/* Q-Nekt · db-integration.js
   Bridges the Q-Nekt UI with QNektDB and QNektCrypto.
   Wires the existing form buttons (Save, Clear, Import), updates
   the database table tbodies after each save, and handles the
   unlock modal, dashboard metrics, and export/import toolbar. */


// --- 1. UNLOCK MODAL ---

async function showUnlockModal() {
  document.getElementById('qnekt-unlock-modal')?.remove();
  _buildAuthModal('login');
}

// Builds either the 'login' or 'register' screen inside the same modal shell.
function _buildAuthModal(mode) {
  document.getElementById('qnekt-unlock-modal')?.remove();

  const isLogin = mode === 'login';
  const modal   = document.createElement('div');
  modal.id      = 'qnekt-unlock-modal';

  modal.innerHTML = `
    <div class="qnekt-modal-backdrop"></div>
    <div class="qnekt-modal-box">
      <div class="qnekt-modal-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
      </div>
      <h2 class="qnekt-modal-heading">${isLogin ? 'Q-Nekt Login' : 'Create Account'}</h2>
      <p class="qnekt-modal-sub">${isLogin
        ? 'Enter your credentials to access the system.'
        : 'Choose a username and password for your account.'}</p>

      <div class="qnekt-modal-field" style="margin-bottom:0.6rem;">
        <input type="text" id="qnekt-username-input" class="qnekt-modal-input"
               placeholder="Username" autocomplete="username" style="padding-right:1rem;"/>
      </div>
      <div class="qnekt-modal-field" style="${isLogin ? '' : 'margin-bottom:0.6rem;'}">
        <input type="password" id="qnekt-password-input" class="qnekt-modal-input"
               placeholder="Password" autocomplete="${isLogin ? 'current-password' : 'new-password'}"/>
        <button class="qnekt-modal-eye" id="qnekt-toggle-pw" type="button" aria-label="Toggle visibility">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </div>
      ${!isLogin ? `
      <div class="qnekt-modal-field">
        <input type="password" id="qnekt-password-confirm" class="qnekt-modal-input"
               placeholder="Confirm password" autocomplete="new-password"/>
      </div>` : ''}
      <p class="qnekt-modal-error" id="qnekt-modal-error" style="display:none;"></p>
      <button class="qnekt-modal-btn" id="qnekt-unlock-btn" type="button">
        ${isLogin ? 'Login' : 'Create Account'}
      </button>
      <p style="margin-top:1rem;font-size:13px;color:var(--muted);text-align:center;">
        ${isLogin
          ? 'New user? <button class="qnekt-switch-btn" id="qnekt-switch">Create an account</button>'
          : 'Already have an account? <button class="qnekt-switch-btn" id="qnekt-switch">Log in</button>'}
      </p>
      <p class="qnekt-modal-hint" style="margin-top:0.6rem;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px;vertical-align:-2px;">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        All data is encrypted with AES-256-GCM. Your password never leaves this device.
      </p>
    </div>`;

  document.body.appendChild(modal);

  const usernameEl = document.getElementById('qnekt-username-input');
  const passwordEl = document.getElementById('qnekt-password-input');
  const confirmEl  = document.getElementById('qnekt-password-confirm');
  const errEl      = document.getElementById('qnekt-modal-error');
  const btn        = document.getElementById('qnekt-unlock-btn');

  document.getElementById('qnekt-toggle-pw').addEventListener('click', () => {
    passwordEl.type = passwordEl.type === 'password' ? 'text' : 'password';
  });

  document.getElementById('qnekt-switch').addEventListener('click', () => {
    _buildAuthModal(isLogin ? 'register' : 'login');
  });

  function _isRegistered(username) {
    return !!localStorage.getItem('qnekt_verify_' + username.trim().toLowerCase());
  }

  async function attemptSubmit() {
    errEl.style.display = 'none';
    btn.disabled = true;
    btn.textContent = isLogin ? 'Logging in…' : 'Creating account…';

    const username = usernameEl.value.trim();
    const pw       = passwordEl.value;
    const conf     = confirmEl?.value || '';

    if (!username) {
      errEl.textContent = 'Please enter a username.';
    } else if (!pw) {
      errEl.textContent = 'Please enter a password.';
    } else if (isLogin && !_isRegistered(username)) {
      errEl.textContent = 'Username not found. Please create an account first.';
    } else if (!isLogin && _isRegistered(username)) {
      errEl.textContent = 'Username already exists. Please log in instead.';
    } else if (!isLogin && pw !== conf) {
      errEl.textContent = 'Passwords do not match. Please try again.';
    } else if (!isLogin && pw.length < 8) {
      errEl.textContent = 'Password must be at least 8 characters.';
    } else {
      try {
        QNektCrypto._setUserPrefix(username.toLowerCase());
        await QNektCrypto.init(pw);
        await QNektDB.open();
        await QNektDB.audit.log('LOGIN', 'system', null, { username });
        sessionStorage.setItem('qnekt_user', username);
        modal.remove();
        _addLockButton(username);
        await refreshDashboardMetrics();
        await refreshAllDbTables();
        notify('Welcome, ' + username + ' ✓');
        _logLoginToDashboard(username);
        return;
      } catch (err) {
        errEl.textContent = err.message === 'WRONG_PASSWORD'
          ? 'Incorrect password. Please try again.'
          : 'Could not log in: ' + err.message;
      }
    }

    errEl.style.display = 'block';
    btn.disabled = false;
    btn.textContent = isLogin ? 'Login' : 'Create Account';
  }

  btn.addEventListener('click', attemptSubmit);
  [usernameEl, passwordEl, confirmEl].forEach(el => {
    el?.addEventListener('keydown', e => { if (e.key === 'Enter') attemptSubmit(); });
  });
  setTimeout(() => usernameEl?.focus(), 80);
}


function _addLockButton(username) {
  if (document.getElementById('qnekt-lock-btn')) return;
  const nav = document.querySelector('.site-nav') || document.querySelector('nav') || document.body;
  const btn = document.createElement('button');
  btn.id        = 'qnekt-lock-btn';
  btn.title     = 'Log out';
  const label   = username ? username : 'Lock';
  btn.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;">' +
      '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>' +
    '</svg> ' + label;
  btn.addEventListener('click', async () => {
    QNektCrypto.lock();
    sessionStorage.removeItem('qnekt_user');
    btn.remove();
    notify('Logged out.');
    await showUnlockModal();
  });
  nav.appendChild(btn);
}

// --- 2. FORM BUTTON WIRING ---

// Panel config: maps each panel to its store, key field, title, and import source label.
const PANEL_CONFIG = {
  'faculty': {
    store:     () => QNektDB.faculty,
    keyField:  'facultyId',
    idLabel:   'Faculty ID',
    title:     'Faculty Information',
    importSrc: 'PIVOT/HR',
    dbTab:     'fac',
  },
  'student': {
    store:     () => QNektDB.students,
    keyField:  'studentId',
    idLabel:   'Student ID',
    title:     'Student Information',
    importSrc: 'AIMS',
    dbTab:     'stu',
  },
  'research': {
    store:     () => QNektDB.research,
    keyField:  'personnelId',
    idLabel:   'Personnel ID',
    title:     'Research & Extension',
    importSrc: null,
    dbTab:     'res',
  },
  'scholarship': {
    store:     () => QNektDB.scholarships,
    keyField:  'scholarshipId',
    idLabel:   'Scholarship ID',
    title:     'Scholarships',
    importSrc: null,
    dbTab:     'sch',
  },
  'student-load': {
    store:     () => QNektDB.studentLoad,
    keyField:  null,
    idLabel:   'Student ID',
    title:     'Student Academic Load',
    importSrc: null,
    dbTab:     'sload',
  },
  'faculty-load': {
    store:     () => QNektDB.facultyLoad,
    keyField:  null,
    idLabel:   'Faculty ID',
    title:     'Faculty Academic Load',
    importSrc: null,
    dbTab:     'fload',
  },
};

// Reads all form-group label/input pairs from a panel into a plain object.
function _readForm(panelId) {
  const panel  = document.getElementById(panelId);
  if (!panel) return {};
  const result = {};
  panel.querySelectorAll('.form-group').forEach(fg => {
    const lbl = fg.querySelector('label');
    const inp = fg.querySelector('input, select, textarea');
    if (lbl && inp) result[lbl.textContent.trim()] = inp.value;
  });
  return result;
}

// Resets all inputs/selects/textareas in a panel to their defaults.
function clearForm(panelId) {
  const panel = document.getElementById(panelId);
  if (!panel) return;
  panel.querySelectorAll('input').forEach(inp => { inp.value = ''; });
  panel.querySelectorAll('select').forEach(sel => sel.selectedIndex = 0);
  panel.querySelectorAll('textarea').forEach(ta => ta.value = '');
}

// Saves the form for a panel to the encrypted DB, then clears and refreshes the table.
async function saveFormRecord(panel) {
  if (!QNektCrypto.isUnlocked()) { notify('Database is locked. Please unlock first.'); return; }

  const cfg = PANEL_CONFIG[panel];
  if (!cfg) return;

  const raw = _readForm('panel-' + panel);

  if (cfg.keyField) {
    const idVal = raw[cfg.idLabel];
    if (!idVal || idVal.trim() === '') {
      notify('Please enter a ' + cfg.idLabel + ' before saving.');
      return;
    }
    raw[cfg.keyField] = idVal.trim();
  }

  try {
    await cfg.store().save(raw);
    notify('Record saved \u2713', 'create', cfg.title, 'Saved ' + cfg.title + ' record');
    _pushToDashboard('create', cfg.title, 'Saved ' + cfg.title + ' record');
    clearForm('panel-' + panel);
    await refreshDbTable(cfg.dbTab);
    await refreshDashboardMetrics();
  } catch (err) {
    notify('Save failed: ' + err.message);
    console.error('[QNektDB] Save error:', err);
  }
}

// Shows an import notification (simulates a source system batch import).
function importFromSource(panel) {
  const cfg = PANEL_CONFIG[panel];
  if (!cfg || !cfg.importSrc) return;
  notify(
    'Imported from ' + cfg.importSrc + '!',
    'import',
    cfg.title,
    'Batch import from ' + cfg.importSrc + ' System'
  );
  _pushToDashboard('import', cfg.title, 'Batch import from ' + cfg.importSrc + ' System');
}

// Replaces dummy onclick handlers on the existing Save / Clear / Import buttons.
function _wireFormButtons() {
  Object.keys(PANEL_CONFIG).forEach(panel => {
    const el = document.getElementById('panel-' + panel);
    if (!el) return;
    const btnRow = el.querySelector('.btn-row');
    if (!btnRow) return;

    btnRow.querySelectorAll('button').forEach(btn => {
      const text = btn.textContent.trim();
      btn.removeAttribute('onclick');

      if (text.includes('Save Record')) {
        btn.addEventListener('click', () => saveFormRecord(panel));
      } else if (text.includes('Clear Form')) {
        btn.addEventListener('click', () => clearForm('panel-' + panel));
      } else if (text.includes('Import')) {
        btn.addEventListener('click', () => importFromSource(panel));
      }
    });
  });
}


// --- 3. DATABASE TABLE RENDERING ---

const TABLE_CONFIG = {
  fac: {
    store:  () => QNektDB.faculty,
    cols:   ['Faculty ID','Full Name','Department / College','Rank / Designation','Employment Status','Highest Attainment','Years in Service','Specialization'],
    rowMap: r => [r['Faculty ID'], r['Full Name'], r['Department / College'], r['Rank / Designation'], r['Employment Status'], r['Highest Educational Attainment'], r['Years in Service'], r['Specialization']],
  },
  stu: {
    store:  () => QNektDB.students,
    cols:   ['Student ID','Full Name','Program / Course','Year Level','Enrollment Status','Sex','Date of Birth','Contact Number'],
    rowMap: r => [r['Student ID'], r['Full Name'], r['Program / Course'], r['Year Level'], r['Enrollment Status'], r['Sex'], r['Date of Birth'], r['Contact Number']],
  },
  fload: {
    store:  () => QNektDB.facultyLoad,
    cols:   ['Faculty ID','Faculty Name','Academic Year','Semester','Teaching Units','Research Units','Extension Units','Admin Units','Classes Handled','Total Workload'],
    rowMap: r => [r['Faculty ID'], r['Faculty Name'], r['Academic Year'], r['Semester'], r['Teaching Units'], r['Research Units'], r['Extension Units'], r['Admin Units'], r['No. of Classes Handled'], r['Total Workload Units']],
  },
  sload: {
    store:  () => QNektDB.studentLoad,
    cols:   ['Student ID','Student Name','Academic Year','Semester','Total Units','No. of Subjects','GWA','Load Status'],
    rowMap: r => [r['Student ID'], r['Student Name'], r['Academic Year'], r['Semester'], r['Total Units Enrolled'], r['No. of Subjects'], r['GWA (Previous Semester)'], r['Load Status']],
  },
  res: {
    store:  () => QNektDB.research,
    cols:   ['Personnel ID','Full Name','Role','Project Title','Funding Agency','Duration','Status','Budget (PHP)'],
    rowMap: r => [r['Personnel ID'], r['Full Name'], r['Role'], r['Project Title'], r['Funding Agency'], r['Project Duration'], r['Status'], r['Budget (PHP)']],
  },
  sch: {
    store:  () => QNektDB.scholarships,
    cols:   ['Scholarship ID','Student Name','Student ID','Scholarship Program','Type','Grant Amount (PHP)','Academic Year','Status'],
    rowMap: r => [r['Scholarship ID'], r['Student Name'], r['Student ID'], r['Scholarship Program'], r['Scholarship Type'], r['Grant Amount (PHP)'], r['Academic Year'], r['Status']],
  },
  sar: {
    store:  () => QNektDB.sarDrafts,
    cols:   ['Draft ID','Programme','Saved At'],
    rowMap: r => [r['draftId'], r['programme'], r['savedAt'] ? new Date(r['savedAt']).toLocaleString() : '—'],
  },
};

// Updates only the <tbody> of the existing table — the styled <thead> is preserved.
async function refreshDbTable(tabKey) {
  const cfg       = TABLE_CONFIG[tabKey];
  const container = document.getElementById('db-' + tabKey);
  if (!cfg || !container) return;

  const tbody = container.querySelector('tbody');
  if (!tbody) return;

  let records = [];
  try { records = await cfg.store().getAll(); }
  catch (err) { console.warn('[QNektDB] Could not load', tabKey, err); }

  const colCount = cfg.cols.length + 1;

  if (records.length === 0) {
    tbody.innerHTML = '<tr><td colspan="' + colCount + '" style="text-align:center;padding:2.5rem;color:var(--muted);font-size:13px;">No records found. Add entries through the Data Entry tab.</td></tr>';
    return;
  }

  tbody.innerHTML = records.map(r => {
    const keyVal = r[Object.keys(r).find(k => !k.startsWith('_') && (k.endsWith('Id') || k === 'id'))] || r._ts || '?';
    const safeKey = String(keyVal).replace(/\\/g,'\\\\').replace(/'/g,"\\'");
    const cells = cfg.rowMap(r).map(v => '<td>' + (v != null ? v : '\u2014') + '</td>').join('');
    return '<tr>' + cells +
      '<td><button class="qnekt-tbl-btn" onclick="deleteDbRecord(\'' + tabKey + '\',\'' + safeKey + '\')">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px;">' +
      '<polyline points="3 6 5 6 21 6"/>' +
      '<path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>' +
      '<path d="M10 11v6M14 11v6M9 6V4h6v2"/>' +
      '</svg></button></td></tr>';
  }).join('');
}

// Refreshes all database table tbodies including SAR drafts.
async function refreshAllDbTables() {
  if (!QNektCrypto.isUnlocked()) return;
  for (const key of Object.keys(TABLE_CONFIG)) {
    await refreshDbTable(key);
  }
}

// Called by the delete button inside each table row.
async function deleteDbRecord(tabKey, id) {
  if (!confirm('Delete this record? This cannot be undone.')) return;
  const cfg = TABLE_CONFIG[tabKey];
  try {
    await cfg.store().delete(id);
    notify('Record deleted.', 'update', 'Database', 'Deleted record [' + id + '] from ' + tabKey);
    await refreshDbTable(tabKey);
    await refreshDashboardMetrics();
  } catch (err) {
    notify('Delete failed: ' + err.message);
  }
}


// --- 4. DASHBOARD METRICS ---

// Returns a human-readable note for a metric card based on count.
function _countNote(n) {
  if (!n || n === 0) return 'No records yet';
  return n + ' record' + (n !== 1 ? 's' : '') + ' in database';
}

async function refreshDashboardMetrics() {
  if (!QNektCrypto.isUnlocked()) return;
  try {
    const counts = await QNektDB.storeCounts();
    const total  = Object.values(counts).reduce((a, b) => a + b, 0);

    // Data Entry hub metric
    const metricEls = document.querySelectorAll('.de-metric-value');
    if (metricEls[0]) metricEls[0].textContent = total;
    document.querySelectorAll('.de-metric-value--sm').forEach(el => {
      el.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });

    // Dashboard top metrics
    const setValue = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val != null ? val : '—'; };
    setValue('repo-count-faculty',      counts.faculty      || 0);
    setValue('repo-count-students',     counts.students     || 0);
    setValue('repo-count-research',     counts.research     || 0);
    setValue('repo-count-scholarships', counts.scholarships || 0);
    setValue('repo-count-faculty-load', counts.faculty_load || 0);
    setValue('repo-count-student-load', counts.student_load || 0);
    setValue('repo-count-sar-drafts',   counts.sar_drafts   || 0);

    // Total label in card header
    const totalEl = document.getElementById('dash-repo-total');
    if (totalEl) totalEl.textContent = total + ' record' + (total !== 1 ? 's' : '') + ' total';

    // Helper: set a value el by ID, optionally its paired note el too
    const set = (id, val, note) => {
      const el = document.getElementById(id);
      if (el) { el.textContent = val; el.style.color = ''; }
      if (note !== undefined) {
        const nl = document.getElementById(id.replace('-val-','-note-'));
        if (nl) nl.textContent = note;
      }
    };
    const rCount  = (typeof reportLog !== 'undefined') ? reportLog.length : 0;
    const actCount = (typeof activityLog !== 'undefined') ? activityLog.length : 0;
    const now = new Date();
    const lastTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // ── Dashboard metric cards ──────────────────────────────
    set('dash-val-students', counts.students     || 0, _countNote(counts.students));
    set('dash-val-faculty',  counts.faculty      || 0, _countNote(counts.faculty));
    set('dash-val-research', counts.research     || 0, _countNote(counts.research));
    set('dash-val-reports',  rCount,                   rCount === 0 ? 'No reports yet' : rCount + ' this session');

    // ── Data Entry Hub metrics ──────────────────────────────
    const hubTotal = document.getElementById('de-hub-total');
    if (hubTotal) hubTotal.textContent = total;
    const hubMonth = document.getElementById('de-hub-month');
    if (hubMonth) hubMonth.textContent = total; // all records (no server date filter)
    const hubHist = document.getElementById('de-hub-history');
    if (hubHist) hubHist.textContent = actCount;

    // ── Data Entry card stat-vals ───────────────────────────
    const cardMap = {
      'de-stat-faculty':       counts.faculty,
      'de-stat-students':      counts.students,
      'de-stat-faculty_load':  counts.faculty_load,
      'de-stat-student_load':  counts.student_load,
      'de-stat-research':      counts.research,
      'de-stat-scholarships':  counts.scholarships,
      'de-stat-sar_drafts':    counts.sar_drafts,
    };
    for (const [id, val] of Object.entries(cardMap)) {
      const el = document.getElementById(id);
      if (el) el.textContent = val || 0;
    }
    // Last entry times — set to now if count > 0
    const lastMap = {
      'de-last-faculty':       counts.faculty,
      'de-last-students':      counts.students,
      'de-last-faculty_load':  counts.faculty_load,
      'de-last-student_load':  counts.student_load,
      'de-last-research':      counts.research,
      'de-last-scholarships':  counts.scholarships,
    };
    for (const [id, val] of Object.entries(lastMap)) {
      const el = document.getElementById(id);
      if (el) el.textContent = val > 0 ? lastTime : '—';
    }

    // ── Reports page metrics ────────────────────────────────
    const rptCountEl = document.getElementById('rpt-metric-count');
    if (rptCountEl) rptCountEl.textContent = rCount;

    // ── Historical page repo summary ────────────────────────
    const setH = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setH('hist-repo-total',        total);
    setH('hist-repo-students',     counts.students     || 0);
    setH('hist-repo-faculty',      counts.faculty      || 0);
    setH('hist-repo-research',     counts.research     || 0);
    setH('hist-repo-scholarships', counts.scholarships || 0);
    setH('hist-repo-range',        total > 0 ? 'Active' : '—');
    setH('hist-repo-growth',       total > 0 ? '+' + total + ' records' : '—');

    // Historical metric cards
    set('hist-val-students', counts.students  || 0, _countNote(counts.students));
    set('hist-val-faculty',  counts.faculty   || 0, _countNote(counts.faculty));
    set('hist-val-research', counts.research  || 0, _countNote(counts.research));
    set('hist-val-total',    total,                 total === 0 ? 'No records yet' : total + ' across all stores');

    // Historical data stats + charts
    await refreshHistoricalData();

  } catch (err) {
    console.warn('[QNektDB] Dashboard refresh error:', err);
  }
}


// --- 5. EXPORT / IMPORT TOOLBAR ---

async function dbExportBackup() {
  if (!QNektCrypto.isUnlocked()) { notify('Please unlock the database first.'); return; }
  try {
    const blob = new Blob([await QNektDB.exportAll()], { type: 'application/json' });
    const a    = Object.assign(document.createElement('a'), {
      href:     URL.createObjectURL(blob),
      download: 'qnekt-backup-' + new Date().toISOString().slice(0, 10) + '.json',
    });
    a.click();
    URL.revokeObjectURL(a.href);
    notify('Backup exported \u2713', 'export', 'System', 'Full encrypted backup downloaded');
    _pushToDashboard('export', 'System', 'Full encrypted backup downloaded');
  } catch (err) {
    notify('Export failed: ' + err.message);
  }
}

function dbImportBackup() {
  if (!QNektCrypto.isUnlocked()) { notify('Please unlock the database first.'); return; }
  const input = Object.assign(document.createElement('input'), { type: 'file', accept: '.json' });
  input.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const result = await QNektDB.importAll(await file.text());
      const total  = Object.values(result.counts).reduce((a, b) => a + b, 0);
      notify('Import complete \u2014 ' + total + ' records loaded \u2713', 'import', 'System', 'Backup imported');
      _pushToDashboard('import', 'System', 'Backup imported — ' + total + ' records');
      await refreshAllDbTables();
      await refreshDashboardMetrics();
    } catch (err) {
      notify('Import failed: ' + err.message);
    }
  });
  input.click();
}


// --- 6. STYLES ---

function _injectStyles() {
  if (document.getElementById('qnekt-db-styles')) return;
  const style = document.createElement('style');
  style.id = 'qnekt-db-styles';
  style.textContent = `
    .qnekt-modal-backdrop {
      position:fixed; inset:0;
      background:rgba(0,0,0,0.72);
      backdrop-filter:blur(4px);
      z-index:9998;
    }
    .qnekt-modal-box {
      position:fixed; top:50%; left:50%;
      transform:translate(-50%,-50%);
      z-index:9999;
      background:var(--surface,#1a1a2e);
      border:1px solid rgba(255,255,255,0.1);
      border-radius:16px;
      padding:2.4rem 2.6rem 2rem;
      width:min(440px,92vw);
      box-shadow:0 24px 64px rgba(0,0,0,0.6);
      text-align:center;
    }
    .qnekt-modal-icon {
      width:56px; height:56px;
      margin:0 auto 1.2rem;
      background:rgba(138,21,56,0.18);
      border-radius:50%;
      display:flex; align-items:center; justify-content:center;
      color:var(--header2,#c0405e);
    }
    .qnekt-modal-icon svg { width:26px; height:26px; }
    .qnekt-modal-heading { font-size:1.25rem; font-weight:700; margin:0 0 0.5rem; color:var(--text,#e8e8f0); }
    .qnekt-modal-sub     { font-size:0.85rem; color:var(--muted,#888); margin:0 0 1.4rem; line-height:1.5; }
    .qnekt-modal-field   { position:relative; display:flex; align-items:center; }
    .qnekt-modal-input {
      width:100%; padding:0.7rem 2.6rem 0.7rem 1rem;
      border-radius:8px; border:1px solid rgba(255,255,255,0.12);
      background:rgba(255,255,255,0.05); color:var(--text,#e8e8f0);
      font-size:0.9rem; outline:none; transition:border-color 0.15s;
    }
    .qnekt-modal-input:focus { border-color:var(--header2,#c0405e); }
    .qnekt-modal-eye {
      position:absolute; right:10px;
      background:none; border:none; cursor:pointer;
      color:var(--muted,#888); padding:4px;
    }
    .qnekt-modal-eye svg { width:16px; height:16px; }
    .qnekt-modal-error { color:#e05555; font-size:0.82rem; margin:0.5rem 0 0; text-align:left; }
    .qnekt-modal-btn {
      width:100%; margin-top:1.2rem; padding:0.75rem;
      border-radius:8px; border:none;
      background:var(--header2,#8a1538);
      color:#fff; font-size:0.95rem; font-weight:600;
      cursor:pointer; transition:opacity 0.15s;
    }
    .qnekt-modal-btn:hover    { opacity:0.88; }
    .qnekt-modal-btn:disabled { opacity:0.5; cursor:not-allowed; }
    .qnekt-modal-hint { font-size:0.75rem; color:var(--muted,#888); margin:0.9rem 0 0; }
    .qnekt-switch-btn {
      background:none; border:none; color:var(--header2,#c0405e);
      cursor:pointer; font-size:13px; font-weight:600; padding:0;
      text-decoration:underline; text-underline-offset:2px;
    }
    .qnekt-switch-btn:hover { opacity:0.8; }
    #qnekt-lock-btn {
      display:inline-flex; align-items:center; gap:6px;
      margin-left:auto; margin-right:1rem;
      padding:0.4rem 0.85rem;
      border-radius:6px; border:1px solid rgba(255,255,255,0.14);
      background:transparent; color:var(--muted,#aaa);
      font-size:0.8rem; cursor:pointer;
      transition:background 0.15s, color 0.15s;
    }
    #qnekt-lock-btn:hover { background:rgba(255,255,255,0.07); color:var(--text,#e8e8f0); }
    .qnekt-tbl-btn {
      background:none; border:none;
      color:var(--muted,#888); cursor:pointer;
      padding:4px; border-radius:4px; transition:color 0.12s;
    }
    .qnekt-tbl-btn:hover { color:#e05555; }
  `;
  document.head.appendChild(style);
}


// --- 7. BOOT ---

async function initQNektDB() {
  _injectStyles();

  // Wait for loader.js to finish injecting HTML templates
  await new Promise(r => setTimeout(r, 150));
  _wireFormButtons();
  await showUnlockModal();
}

document.addEventListener('DOMContentLoaded', () => setTimeout(initQNektDB, 50));


// --- PATCH: Filter/search-aware table rendering, dashboard login activity, table design ---
// This block overrides the refreshDbTable function defined earlier.

// Maps each tab key to the record field used for status filtering
const TAB_STATUS_FIELD = {
  fac:   r => r['Employment Status'],
  stu:   r => r['Enrollment Status'],
  fload: r => r['Semester'],
  sload: r => r['Load Status'],
  res:   r => r['Status'],
  sch:   r => r['Status'],
  sar:   r => null,
};

// Status badge colour mapping
const STATUS_COLOURS = {
  // Employment
  'Regular':        'green',
  'Contractual':    'gold',
  'Part-time':      'gold',
  'Visiting':       'muted',
  // Enrollment
  'Irregular':      'gold',
  'Cross Enrollee': 'muted',
  'Returnee':       'muted',
  // Research / Scholarship
  'Ongoing':        'green',
  'Completed':      'green',
  'Active':         'green',
  'On Hold':        'gold',
  'Proposed':       'gold',
  'On Probation':   'gold',
  'Terminated':     'red',
  // Load
  'Regular Load':   'green',
  'Overload':       'gold',
  'Underload':      'muted',
  // Semester
  '1st Semester':   'green',
  '2nd Semester':   'green',
  'Summer':         'gold',
};

function _statusBadge(value) {
  if (!value || value === '—') return '<span style="color:var(--muted)">—</span>';
  const colour = STATUS_COLOURS[value];
  if (!colour) return value;
  const cls = colour === 'green' ? 'badge-green' : colour === 'gold' ? 'badge-gold' : colour === 'red' ? 'badge-red' : '';
  return cls
    ? '<span class="badge ' + cls + '">' + value + '</span>'
    : '<span style="color:var(--muted);font-size:12px;">' + value + '</span>';
}

// Override: filter- and search-aware version of refreshDbTable
refreshDbTable = async function(tabKey) {
  const cfg       = TABLE_CONFIG[tabKey];
  const container = document.getElementById('db-' + tabKey);
  if (!cfg || !container) return;

  const tbody = container.querySelector('tbody');
  if (!tbody) return;

  let allRecords = [];
  try { allRecords = await cfg.store().getAll(); }
  catch (err) { console.warn('[QNektDB] Could not load', tabKey, err); }

  const totalCount = allRecords.length;

  // Read search text and status filter
  const searchEl  = document.querySelector('#de-database-panel input[type="text"]');
  const filterEl  = document.getElementById('db-status-filter');
  const searchVal = (searchEl?.value || '').toLowerCase().trim();
  const filterVal = (filterEl?.value || '').trim();
  const isFiltered = !!(searchVal || filterVal);

  let records = allRecords;
  if (isFiltered) {
    const statusFn = TAB_STATUS_FIELD[tabKey];
    records = allRecords.filter(r => {
      const matchesStatus = !filterVal || (statusFn && statusFn(r) === filterVal);
      const matchesSearch = !searchVal || Object.values(r).some(v =>
        v != null && String(v).toLowerCase().includes(searchVal)
      );
      return matchesStatus && matchesSearch;
    });
  }

  const colCount = cfg.cols.length + 1;

  // Update the record count footer
  const countEl = document.getElementById('db-record-count');
  if (countEl) {
    if (totalCount === 0) {
      countEl.textContent = 'No records yet · Add data through the Data Entry tab';
    } else if (isFiltered) {
      countEl.textContent = 'Showing ' + records.length + ' of ' + totalCount + ' record' + (totalCount !== 1 ? 's' : '') + ' · ' + (records.length === totalCount ? 'No filter active' : 'Filter active');
    } else {
      countEl.textContent = totalCount + ' record' + (totalCount !== 1 ? 's' : '') + ' total';
    }
  }

  if (records.length === 0) {
    const msg = isFiltered
      ? 'No records match the current filter.'
      : 'No records found. Add entries through the Data Entry tab.';
    tbody.innerHTML = '<tr><td colspan="' + colCount + '" style="text-align:center;padding:2.5rem;color:var(--muted);font-size:13px;">' + msg + '</td></tr>';
    return;
  }

  const statusField = TAB_STATUS_FIELD[tabKey];

  tbody.innerHTML = records.map(r => {
    const keyVal  = r[Object.keys(r).find(k => !k.startsWith('_') && (k.endsWith('Id') || k === 'id'))] || r._ts || '?';
    const safeKey = String(keyVal).replace(/\\/g,'\\\\').replace(/'/g,"\\'");
    const rawVals = cfg.rowMap(r);
    const statusVal = statusField ? statusField(r) : null;

    const cells = rawVals.map(v => {
      const display = (v != null && v !== '') ? v : '—';
      const isBadge = statusVal && display === statusVal;
      return '<td>' + (isBadge ? _statusBadge(display) : display) + '</td>';
    }).join('');

    return '<tr>' + cells +
      '<td style="width:38px;padding:6px 10px;">' +
        '<button class="qnekt-tbl-btn" title="Delete record" onclick="deleteDbRecord(\'' + tabKey + '\',\'' + safeKey + '\')">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px;">' +
            '<polyline points="3 6 5 6 21 6"/>' +
            '<path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>' +
            '<path d="M10 11v6M14 11v6M9 6V4h6v2"/>' +
          '</svg>' +
        '</button>' +
      '</td></tr>';
  }).join('');
};

// Wire the search input and status filter to re-render the active table live.
function _wireDbFilters() {
  const searchEl = document.querySelector('#de-database-panel input[type="text"]');
  const filterEl = document.getElementById('db-status-filter');
  if (searchEl) {
    searchEl.addEventListener('input', () => {
      if (typeof currentDbTab !== 'undefined') refreshDbTable(currentDbTab);
    });
  }
  if (filterEl) {
    filterEl.addEventListener('change', () => {
      if (typeof currentDbTab !== 'undefined') refreshDbTable(currentDbTab);
    });
  }
}


// --- Dashboard Recent Activity ---
// Adds a login/session event ONLY to the dashboard card, not the Data Entry activity tab.
function _logLoginToDashboard(username) {
  // Clear the Data Entry in-memory activity log on each fresh login
  if (typeof activityLog !== 'undefined') {
    activityLog.length = 0;
    if (typeof updateActivityBadge === 'function') updateActivityBadge();
  }

  const el = document.getElementById('dash-activity-list');
  if (!el) return;

  const now  = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

  el.style.textAlign  = '';
  el.style.padding    = '';
  el.style.lineHeight = '';

  const displayName = username || 'User';
  const entry = document.createElement('div');
  entry.className = 'act-item';
  entry.innerHTML =
    '<div class="act-icon create">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
        '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>' +
        '<path d="M7 11V7a5 5 0 0110 0v4"/>' +
      '</svg>' +
    '</div>' +
    '<div class="act-body">' +
      '<div class="act-title">' + displayName + ' logged in</div>' +
      '<div class="act-meta"><span>System</span><span>' + date + ' · ' + time + '</span></div>' +
    '</div>' +
    '<span class="act-type-pill create">Login</span>';

  el.insertBefore(entry, el.firstChild);
  while (el.children.length > 8) el.removeChild(el.lastChild);
  _updateDashActivityCount();
}


// Pushes an activity entry to the dashboard Recent Activity card directly.
// Called explicitly — never touches logActivity, avoiding any recursion risk.
function _pushToDashboard(type, category, detail) {
  const el = document.getElementById('dash-activity-list');
  if (!el) return;
  el.style.textAlign  = '';
  el.style.padding    = '';
  el.style.lineHeight = '';

  const now   = new Date();
  const time  = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date  = now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  const icons = {
    create: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>',
    update: '<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/>',
    import: '<polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>',
    export: '<polyline points="16 7 12 3 8 7"/><line x1="12" y1="3" x2="12" y2="15"/><path d="M20 21H4"/>',
  };
  const labels = { create: 'New Record', update: 'Update', import: 'Import', export: 'Export' };

  const entry = document.createElement('div');
  entry.className = 'act-item';
  entry.innerHTML =
    '<div class="act-icon ' + type + '">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
        (icons[type] || icons.create) +
      '</svg>' +
    '</div>' +
    '<div class="act-body">' +
      '<div class="act-title">' + detail + '</div>' +
      '<div class="act-meta"><span>' + category + '</span><span>' + date + ' · ' + time + '</span></div>' +
    '</div>' +
    '<span class="act-type-pill ' + type + '">' + (labels[type] || type) + '</span>';

  el.insertBefore(entry, el.firstChild);
  while (el.children.length > 8) el.removeChild(el.lastChild);
  _updateDashActivityCount();
}

// Updates the activity count label in the dashboard card header
function _updateDashActivityCount() {
  const el    = document.getElementById('dash-activity-list');
  const badge = document.getElementById('dash-activity-count');
  if (!badge || !el) return;
  const count = el.querySelectorAll('.act-item').length;
  badge.textContent = count > 0 ? count + ' entr' + (count === 1 ? 'y' : 'ies') + ' this session' : '';
}

// Wire search/filter inputs after the lock button is created.
const _origAddLockButton = _addLockButton;
_addLockButton = function(username) {
  _origAddLockButton(username);
  setTimeout(_wireDbFilters, 200);
};


// --- HISTORICAL DATA: live stats + charts ---

// Cached Chart.js instances so we can destroy/redraw without duplication
const _histCharts = {};

// Draws (or redraws) a bar chart on a canvas using Chart.js loaded via CDN.
// Falls back gracefully if Chart.js isn't available.
function _drawBarChart(canvasId, labels, datasets, emptyId) {
  const canvas = document.getElementById(canvasId);
  const emptyEl = document.getElementById(emptyId);
  if (!canvas) return;

  if (!labels || labels.length === 0) {
    canvas.style.display = 'none';
    if (emptyEl) emptyEl.style.display = 'flex';
    return;
  }

  // Hide empty state, show canvas
  canvas.style.display = 'block';
  if (emptyEl) emptyEl.style.display = 'none';

  if (typeof Chart === 'undefined') {
    // Lazy-load Chart.js from CDN then retry
    if (!document.getElementById('chartjs-cdn')) {
      const s = document.createElement('script');
      s.id  = 'chartjs-cdn';
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
      s.onload = () => _drawBarChart(canvasId, labels, datasets, emptyId);
      document.head.appendChild(s);
    }
    return;
  }

  // Destroy existing chart if present
  if (_histCharts[canvasId]) { _histCharts[canvasId].destroy(); }

  const colours = [
    'rgba(138,21,56,0.75)', 'rgba(59,130,246,0.75)',
    'rgba(16,185,129,0.75)', 'rgba(246,172,29,0.75)',
  ];

  _histCharts[canvasId] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: datasets.map((d, i) => ({
        label:           d.label,
        data:            d.data,
        backgroundColor: colours[i % colours.length],
        borderColor:     colours[i % colours.length].replace('0.75', '1'),
        borderWidth:     1,
        borderRadius:    4,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#aaa', font: { size: 11 } } },
      },
      scales: {
        x: { ticks: { color: '#888', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { ticks: { color: '#888', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true },
      },
    },
  });
}

// Sets a hist-summary-value + its note by ID.
function _hs(id, val, note) {
  const el = document.getElementById(id);
  if (el) { el.textContent = val; el.style.color = ''; }
  if (note !== undefined) {
    const nl = document.getElementById(id + '-note');
    if (nl) nl.textContent = note;
  }
}

// Main function — reads all stores, computes stats, draws charts, sets summary cards.
async function refreshHistoricalData() {
  if (!QNektCrypto.isUnlocked()) return;

  try {
    const [students, faculty, research, scholarships, studentLoad, facultyLoad] = await Promise.all([
      QNektDB.students.getAll(),
      QNektDB.faculty.getAll(),
      QNektDB.research.getAll(),
      QNektDB.scholarships.getAll(),
      QNektDB.studentLoad.getAll(),
      QNektDB.facultyLoad.getAll(),
    ]);

    // ── STUDENT tab ────────────────────────────────────────────────
    const totalStu    = students.length;
    const regularStu  = students.filter(r => r['Enrollment Status'] === 'Regular').length;
    const irregStu    = students.filter(r => r['Enrollment Status'] === 'Irregular').length;

    _hs('hs-stu-total',    totalStu,   totalStu   === 0 ? 'No records yet' : totalStu   + ' students');
    _hs('hs-stu-regular',  regularStu, regularStu === 0 ? 'No records yet' : regularStu + ' students');
    _hs('hs-stu-irregular',irregStu,   irregStu   === 0 ? 'No records yet' : irregStu   + ' students');
    _hs('hs-stu-yoy', totalStu > 0 ? '+' + totalStu : '—', totalStu > 0 ? 'From current data' : 'No records yet');

    // Chart: breakdown by year level
    const yearLevels = ['1st Year','2nd Year','3rd Year','4th Year','Graduate'];
    const yearCounts = yearLevels.map(y => students.filter(r => r['Year Level'] === y).length);
    const hasYearData = yearCounts.some(v => v > 0);
    _drawBarChart('student-chart', hasYearData ? yearLevels : [], hasYearData ? [{ label: 'Students', data: yearCounts }] : [], 'student-chart-empty');

    // ── FACULTY tab ────────────────────────────────────────────────
    const totalFac    = faculty.length;
    const regularFac  = faculty.filter(r => r['Employment Status'] === 'Regular').length;
    const doctoralFac = faculty.filter(r => (r['Highest Educational Attainment'] || '').toLowerCase().includes('doctoral')).length;

    _hs('hs-fac-total',    totalFac,    totalFac    === 0 ? 'No records yet' : totalFac    + ' faculty');
    _hs('hs-fac-regular',  regularFac,  regularFac  === 0 ? 'No records yet' : regularFac  + ' faculty');
    _hs('hs-fac-doctoral', doctoralFac, doctoralFac === 0 ? 'No records yet' : doctoralFac + ' faculty');
    _hs('hs-fac-yoy', totalFac > 0 ? '+' + totalFac : '—', totalFac > 0 ? 'From current data' : 'No records yet');

    // Chart: employment status breakdown
    const empStatuses = ['Regular','Contractual','Part-time','Visiting'];
    const empCounts   = empStatuses.map(s => faculty.filter(r => r['Employment Status'] === s).length);
    const hasEmpData  = empCounts.some(v => v > 0);
    _drawBarChart('faculty-chart', hasEmpData ? empStatuses : [], hasEmpData ? [{ label: 'Faculty', data: empCounts }] : [], 'faculty-chart-empty');

    // ── RESEARCH tab ───────────────────────────────────────────────
    const ongoing   = research.filter(r => r['Status'] === 'Ongoing').length;
    const completed = research.filter(r => r['Status'] === 'Completed').length;
    const extCoord  = research.filter(r => r['Role'] === 'Extension Coordinator').length;

    _hs('hs-res-ongoing',   ongoing,   ongoing   === 0 ? 'No records yet' : ongoing   + ' projects');
    _hs('hs-res-completed', completed, completed === 0 ? 'No records yet' : completed + ' projects');
    _hs('hs-res-pubs',   research.length > 0 ? research.length : '—', research.length > 0 ? 'Total research records' : 'No records yet');
    _hs('hs-res-ext',    extCoord > 0 ? extCoord : '—', extCoord > 0 ? 'Extension coordinators' : 'No records yet');

    // Chart: project status breakdown
    const resStatuses = ['Ongoing','Completed','On Hold','Proposed'];
    const resCounts   = resStatuses.map(s => research.filter(r => r['Status'] === s).length);
    const hasResData  = resCounts.some(v => v > 0);
    _drawBarChart('research-chart', hasResData ? resStatuses : [], hasResData ? [{ label: 'Projects', data: resCounts }] : [], 'research-chart-empty');

    // ── RETENTION tab ──────────────────────────────────────────────
    // Derive from student load records: Regular = retained, Underload/Overload also counts
    const totalLoad   = studentLoad.length;
    const regularLoad = studentLoad.filter(r => r['Load Status'] === 'Regular Load').length;
    const retentionPct = totalLoad > 0 ? Math.round((regularLoad / totalLoad) * 100) : null;
    const overload    = studentLoad.filter(r => r['Load Status'] === 'Overload').length;
    const underload   = studentLoad.filter(r => r['Load Status'] === 'Underload').length;
    const dropoutEst  = totalLoad > 0 ? Math.round((underload / totalLoad) * 100) : null;

    _hs('hs-ret-rate',    retentionPct !== null ? retentionPct + '%' : '—', totalLoad > 0 ? 'Based on load records' : 'No records yet');
    _hs('hs-ret-grad',    totalLoad > 0 ? regularLoad : '—',               totalLoad > 0 ? 'Regular load students' : 'No records yet');
    _hs('hs-ret-dropout', dropoutEst  !== null ? dropoutEst  + '%' : '—', totalLoad > 0 ? 'Underload estimate'    : 'No records yet');
    _hs('hs-ret-loa',     totalLoad > 0 ? overload : '—',                  totalLoad > 0 ? 'Overload students'     : 'No records yet');

    // Chart: load status breakdown
    const loadStatuses = ['Regular Load','Overload','Underload'];
    const loadCounts   = loadStatuses.map(s => studentLoad.filter(r => r['Load Status'] === s).length);
    const hasLoadData  = loadCounts.some(v => v > 0);
    _drawBarChart('retention-chart', hasLoadData ? loadStatuses : [], hasLoadData ? [{ label: 'Students', data: loadCounts }] : [], 'retention-chart-empty');

  } catch (err) {
    console.warn('[QNektDB] Historical refresh error:', err);
  }
}
