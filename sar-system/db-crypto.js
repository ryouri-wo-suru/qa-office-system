/* Q-Nekt · db-crypto.js
   AES-GCM 256-bit encryption for IndexedDB records via the Web Crypto API.
   Key is derived from the user's password using PBKDF2 and cached in
   memory only — nothing sensitive is ever written to disk. */

const QNektCrypto = (() => {
  'use strict';

  let _cryptoKey  = null;  // in-memory AES-GCM key
  let _unlockTime = null;

  let _userPrefix = 'default';
  // Called before init() to namespace keys per user
  function _setUserPrefix(username) {
    _userPrefix = username || 'default';
  }
  // Dynamic key getters so each user has isolated salt + verify blobs
  function _saltKey()   { return 'qnekt_salt_'   + _userPrefix; }
  function _verifyKey() { return 'qnekt_verify_' + _userPrefix; }
  const ALGO             = 'AES-GCM';
  const KEY_LENGTH       = 256;
  const PBKDF2_ITER      = 310_000;  // OWASP 2024 recommendation
  const IV_LENGTH        = 12;
  const VERIFY_PLAINTEXT = 'qnekt-verify-ok';

  // ArrayBuffer ↔ Base64 helpers
  function _bufToB64(buf) {
    return btoa(String.fromCharCode(...new Uint8Array(buf)));
  }
  function _b64ToBuf(b64) {
    const binary = atob(b64);
    const buf    = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) buf[i] = binary.charCodeAt(i);
    return buf.buffer;
  }

  // Returns the stored PBKDF2 salt, or creates one on first run.
  function _getOrCreateSalt() {
    const stored = localStorage.getItem(_saltKey());
    if (stored) return _b64ToBuf(stored);
    const salt = crypto.getRandomValues(new Uint8Array(32));
    localStorage.setItem(_saltKey(), _bufToB64(salt.buffer));
    return salt.buffer;
  }

  // Derives an AES-GCM key from a password + salt via PBKDF2.
  async function _deriveKey(passphrase, salt) {
    const enc    = new TextEncoder();
    const keyMat = await crypto.subtle.importKey(
      'raw', enc.encode(passphrase), { name: 'PBKDF2' }, false, ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: PBKDF2_ITER, hash: 'SHA-256' },
      keyMat,
      { name: ALGO, length: KEY_LENGTH },
      false,  // not extractable
      ['encrypt', 'decrypt']
    );
  }

  // --- Public API ---

  // Derive and cache the key. Throws 'WRONG_PASSWORD' if it doesn't match
  // the stored verification blob, or 'EMPTY_PASSWORD' if blank.
  async function init(passphrase) {
    if (!passphrase || typeof passphrase !== 'string' || passphrase.trim() === '') {
      throw new Error('EMPTY_PASSWORD');
    }
    const salt = _getOrCreateSalt();
    const key  = await _deriveKey(passphrase, salt);

    const verifyBlob = localStorage.getItem(_verifyKey());
    if (verifyBlob) {
      // Verify the passphrase against the stored blob
      try {
        const parsed = JSON.parse(verifyBlob);
        const plain  = await crypto.subtle.decrypt(
          { name: ALGO, iv: _b64ToBuf(parsed.iv) }, key, _b64ToBuf(parsed.ct)
        );
        if (new TextDecoder().decode(plain) !== VERIFY_PLAINTEXT) throw new Error();
      } catch {
        throw new Error('WRONG_PASSWORD');
      }
    } else {
      // First run — write a verification blob for future logins
      const iv         = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
      const ciphertext = await crypto.subtle.encrypt(
        { name: ALGO, iv }, key, new TextEncoder().encode(VERIFY_PLAINTEXT)
      );
      localStorage.setItem(_verifyKey(), JSON.stringify({
        iv: _bufToB64(iv.buffer),
        ct: _bufToB64(ciphertext),
      }));
    }

    _cryptoKey  = key;
    _unlockTime = new Date();
  }

  // Returns true if a key is cached for this session.
  function isUnlocked() { return _cryptoKey !== null; }

  // Returns unlock status and timestamp.
  function status() { return { unlocked: _cryptoKey !== null, since: _unlockTime }; }

  // Clears the cached key — user must call init() again to decrypt.
  function lock() { _cryptoKey = null; _unlockTime = null; }

  // Encrypts any JSON-serialisable object. Returns { iv, ct } (Base64 strings).
  async function encrypt(plainObj) {
    if (!_cryptoKey) throw new Error('LOCKED');
    const iv     = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const cipher = await crypto.subtle.encrypt(
      { name: ALGO, iv }, _cryptoKey, new TextEncoder().encode(JSON.stringify(plainObj))
    );
    return { iv: _bufToB64(iv.buffer), ct: _bufToB64(cipher) };
  }

  // Decrypts an envelope produced by encrypt(). Returns the original object.
  async function decrypt(encObj) {
    if (!_cryptoKey) throw new Error('LOCKED');
    const plain = await crypto.subtle.decrypt(
      { name: ALGO, iv: _b64ToBuf(encObj.iv) }, _cryptoKey, _b64ToBuf(encObj.ct)
    );
    return JSON.parse(new TextDecoder().decode(plain));
  }

  // Changes the password. Validates old one first, then re-derives a new
  // key with a fresh salt. Call QNektDB.reEncrypt() afterwards.
  async function changePassphrase(oldPassword, newPassword) {
    await init(oldPassword);
    if (!newPassword || newPassword.trim() === '') throw new Error('EMPTY_PASSWORD');

    const newSalt = crypto.getRandomValues(new Uint8Array(32));
    const newKey  = await _deriveKey(newPassword, newSalt.buffer);

    localStorage.setItem(_saltKey(), _bufToB64(newSalt.buffer));

    const iv         = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const ciphertext = await crypto.subtle.encrypt(
      { name: ALGO, iv }, newKey, new TextEncoder().encode(VERIFY_PLAINTEXT)
    );
    localStorage.setItem(_verifyKey(), JSON.stringify({
      iv: _bufToB64(iv.buffer),
      ct: _bufToB64(ciphertext),
    }));

    _cryptoKey  = newKey;
    _unlockTime = new Date();
  }

  // Returns a random hex token (default 64 chars). Useful for CSRF nonces.
  function generateSessionToken(bytes = 32) {
    return Array.from(crypto.getRandomValues(new Uint8Array(bytes)))
      .map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Returns the SHA-256 hex digest of a PIN string.
  async function hashPin(pin) {
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pin));
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Removes the stored salt and verify blob. Next init() creates a fresh key.
  // Destructive — only call when wiping the entire database.
  function _wipeStoredKeys() {
    localStorage.removeItem(_saltKey());
    localStorage.removeItem(_verifyKey());
    lock();
  }

  return { init, isUnlocked, status, lock, encrypt, decrypt, changePassphrase, generateSessionToken, hashPin, _wipeStoredKeys, _setUserPrefix };
})();
