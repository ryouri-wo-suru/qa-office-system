/* Q-Nekt · db.js
   IndexedDB database for Q-Nekt. Every record is AES-GCM encrypted
   via db-crypto.js before it touches disk. Only the primary key and
   timestamp are stored as plain text — all field data lives in _enc. */

const QNektDB = (() => {
  'use strict';

  const DB_NAME    = 'QNektDB';
  const DB_VERSION = 1;

  // Object store definitions: key field + whether it auto-increments
  const STORES = {
    faculty:      { key: 'facultyId',     autoInc: false },
    students:     { key: 'studentId',     autoInc: false },
    research:     { key: 'personnelId',   autoInc: false },
    scholarships: { key: 'scholarshipId', autoInc: false },
    student_load: { key: 'id',            autoInc: true  },
    faculty_load: { key: 'id',            autoInc: true  },
    audit_log:    { key: 'id',            autoInc: true  },
  };

  let _db = null;

  // Opens (or upgrades) the database. Safe to call multiple times.
  function open() {
    if (_db) return Promise.resolve(_db);
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        for (const [name, cfg] of Object.entries(STORES)) {
          if (!db.objectStoreNames.contains(name)) {
            const store = db.createObjectStore(name, { keyPath: cfg.key, autoIncrement: cfg.autoInc });
            store.createIndex('_ts', '_ts', { unique: false });
          }
        }
      };
      req.onsuccess = (e) => { _db = e.target.result; resolve(_db); };
      req.onerror   = (e) => reject(new Error('DB open failed: ' + e.target.error));
      req.onblocked = ()  => reject(new Error('DB blocked — close other Q-Nekt tabs'));
    });
  }

  function isOpen() { return _db !== null; }

  // Wraps an IDB request in a Promise.
  function _req(req) {
    return new Promise((res, rej) => {
      req.onsuccess = (e) => res(e.target.result);
      req.onerror   = (e) => rej(e.target.error);
    });
  }

  // Opens a transaction on one or more stores.
  function _tx(stores, mode = 'readonly') {
    if (!_db) throw new Error('DB not open — call QNektDB.open() first');
    return _db.transaction(stores, mode);
  }

  // Encrypts a record and wraps it with metadata.
  async function _wrap(keyField, record, ver = 1) {
    if (!QNektCrypto.isUnlocked()) throw new Error('LOCKED');
    const enc = await QNektCrypto.encrypt(record);
    return { [keyField]: record[keyField], _enc: enc, _ts: Date.now(), _ver: ver };
  }

  // Decrypts a stored record. Attaches _ts and _ver for convenience.
  async function _unwrap(wrapped) {
    if (!wrapped) return null;
    if (!QNektCrypto.isUnlocked()) throw new Error('LOCKED');
    const plain = await QNektCrypto.decrypt(wrapped._enc);
    plain._ts  = wrapped._ts;
    plain._ver = wrapped._ver;
    return plain;
  }

  // Creates the standard CRUD interface for a given store.
  function _makeStore(storeName) {
    const cfg      = STORES[storeName];
    const keyField = cfg.key;

    return {
      // Insert or versioned-update a record. Writes an audit entry automatically.
      async save(record) {
        await open();
        const tx    = _tx(storeName, 'readwrite');
        const store = tx.objectStore(storeName);

        let ver = 1;
        if (!cfg.autoInc && record[keyField]) {
          const existing = await _req(store.get(record[keyField]));
          if (existing) ver = (existing._ver || 0) + 1;
        }

        const wrapped = await _wrap(keyField, record, ver);
        const id      = await _req(store.put(wrapped));
        await _auditWrite(ver === 1 ? 'CREATE' : 'UPDATE', storeName, id ?? record[keyField], { ver });
        return { ok: true, id: id ?? record[keyField], ver };
      },

      // Returns a decrypted record by primary key, or null if not found.
      async get(id) {
        await open();
        const row = await _req(_tx(storeName).objectStore(storeName).get(id));
        return row ? _unwrap(row) : null;
      },

      // Returns all records, decrypted, newest first.
      async getAll() {
        await open();
        const rows = await _req(_tx(storeName).objectStore(storeName).getAll());
        rows.sort((a, b) => (b._ts || 0) - (a._ts || 0));
        return Promise.all(rows.map(_unwrap));
      },

      // Deletes a record and writes an audit entry.
      async delete(id) {
        await open();
        await _req(_tx(storeName, 'readwrite').objectStore(storeName).delete(id));
        await _auditWrite('DELETE', storeName, id, {});
        return { ok: true };
      },

      // Returns the number of records in the store.
      async count() {
        await open();
        return _req(_tx(storeName).objectStore(storeName).count());
      },
    };
  }

  // --- Audit log ---

  // Writes an encrypted entry to audit_log. Non-fatal on failure.
  async function _auditWrite(action, store, recordId, details) {
    try {
      const db     = await open();
      const aStore = db.transaction('audit_log', 'readwrite').objectStore('audit_log');
      const entry  = { action, store, recordId: String(recordId), details, timestamp: new Date().toISOString(), user: _currentUser() };
      const enc    = await QNektCrypto.encrypt(entry);
      await _req(aStore.add({ _enc: enc, _ts: Date.now() }));
    } catch (err) {
      console.warn('[QNektDB] Audit write failed:', err);
    }
  }

  function _currentUser() {
    return sessionStorage.getItem('qnekt_user') || 'system';
  }

  const audit = {
    // Manually log an action (e.g. LOGIN, EXPORT).
    log: (action, store, recordId, details = {}) => _auditWrite(action, store, recordId, details),

    // Returns all audit entries, decrypted, newest first.
    async getAll() {
      await open();
      const rows = await _req(_tx('audit_log').objectStore('audit_log').getAll());
      rows.sort((a, b) => (b._ts || 0) - (a._ts || 0));
      return Promise.all(rows.map(async (r) => {
        try   { return await QNektCrypto.decrypt(r._enc); }
        catch { return { error: 'DECRYPT_FAILED', _ts: r._ts }; }
      }));
    },
  };

  // --- Export / Import ---

  // Exports all records in their encrypted form as a JSON string.
  // The backup is safe to store — passphrase is still required to read it.
  async function exportAll() {
    await open();
    const snapshot = {};
    for (const name of Object.keys(STORES)) {
      snapshot[name] = await _req(_tx(name).objectStore(name).getAll());
    }
    return JSON.stringify({ _meta: { exportedAt: new Date().toISOString(), version: DB_VERSION, app: 'QNektDB' }, data: snapshot }, null, 2);
  }

  // Imports a backup produced by exportAll(). Merges into existing data.
  async function importAll(jsonBlob) {
    const parsed = JSON.parse(jsonBlob);
    if (parsed._meta?.app !== 'QNektDB') throw new Error('Not a valid Q-Nekt backup file');
    await open();
    const counts = {};
    for (const [storeName, rows] of Object.entries(parsed.data || {})) {
      if (!STORES[storeName]) continue;
      const store = _tx(storeName, 'readwrite').objectStore(storeName);
      for (const row of rows) await _req(store.put(row));
      counts[storeName] = rows.length;
    }
    await audit.log('IMPORT', 'system', null, { counts });
    return { ok: true, counts };
  }

  // Re-encrypts every record with the current key. Call after changePassphrase().
  async function reEncrypt(onProgress) {
    await open();
    let total = 0;
    for (const [storeName, cfg] of Object.entries(STORES)) {
      if (storeName === 'audit_log') continue;
      const tx    = _tx(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const rows  = await _req(store.getAll());
      for (let i = 0; i < rows.length; i++) {
        const row    = rows[i];
        row._enc     = await QNektCrypto.encrypt(await QNektCrypto.decrypt(row._enc));
        await _req(store.put(row));
        total++;
        if (onProgress) onProgress(storeName, i + 1, rows.length);
      }
    }
    await audit.log('RE_ENCRYPT', 'system', null, { total });
    return { ok: true, total };
  }

  // Deletes the entire database and wipes the encryption keys. IRREVERSIBLE.
  async function wipeAll() {
    if (_db) { _db.close(); _db = null; }
    await new Promise((res, rej) => {
      const req = indexedDB.deleteDatabase(DB_NAME);
      req.onsuccess = res;
      req.onerror   = (e) => rej(e.target.error);
    });
    QNektCrypto._wipeStoredKeys();
  }

  // --- Utilities ---

  // Total record count across all data stores (excludes audit_log).
  async function totalRecords() {
    await open();
    let total = 0;
    for (const name of Object.keys(STORES)) {
      if (name === 'audit_log') continue;
      total += await _req(_tx(name).objectStore(name).count());
    }
    return total;
  }

  // Per-store record counts as a plain object.
  async function storeCounts() {
    await open();
    const result = {};
    for (const name of Object.keys(STORES)) {
      if (name === 'audit_log') continue;
      result[name] = await _req(_tx(name).objectStore(name).count());
    }
    return result;
  }

  return {
    open, isOpen,
    faculty: _makeStore('faculty'),
    students: _makeStore('students'),
    research: _makeStore('research'),
    scholarships: _makeStore('scholarships'),
    studentLoad: _makeStore('student_load'),
    facultyLoad: _makeStore('faculty_load'),
    audit,
    totalRecords, storeCounts,
    exportAll, importAll, reEncrypt, wipeAll,
  };
})();
