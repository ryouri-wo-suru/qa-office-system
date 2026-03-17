/* ================================================================
   Q-Nekt · UPOU Quality Assurance System · Application Logic
   ================================================================
   Modules
     [1] Data Source Status    setSourceStatus()
     [2] Initialisation        initQNekt() — called by loader.js
     [3] Navigation            showPage(), nav + sidebar sync
     [4] Data Panel Tabs       showDataTab()
     [5] Database              showDbTab(), DB_STATUS_OPTIONS
     [6] Activity Log          logActivity(), renderActivity()
     [7] Data Entry Hub        switchHubTab(), openDataEntry()
     [8] Reports               generateReport(), exportReport()
     [9] Notifications         notify()
   ================================================================ */

/* ================================================================
   Q-Nekt · UPOU Quality Assurance System
   ================================================================
   MODULES
     [1] DATA SOURCE STATUS     setSourceStatus(), source dot helpers
     [2] INITIALISATION         initQNekt(): AY, semester, source dots
     [3] NAVIGATION             showPage(), nav + sidebar sync
     [4] DATA PANEL TABS        showDataTab() — form sub-panel switching
     [5] DATABASE               DB_STATUS_OPTIONS, showDbTab(), viewDbRecords()
     [6] ACTIVITY LOG           activityLog[], logActivity(), renderActivity()
     [7] DATA ENTRY HUB         switchHubTab(), DE_FORM_META,
                                openDataEntry(), closeDataEntry()
     [8] REPORTS                RPT_META, RPT_DOC, generateReport(),
                                exportReport(), report log rendering
     [9] NOTIFICATIONS          notify() toast
   ================================================================ */

/* ================================================================
   MODULE 1  DATA SOURCE STATUS
   ================================================================ */

const SOURCE_LABELS = {
  connected:    '● Online',
  syncing:      '● Syncing',
  error:        '● Error',
  disconnected: 'Not connected'
};

function setSourceStatus(id, state) {
  const dot    = document.getElementById('dot-'    + id);
  const status = document.getElementById('status-' + id);
  if (!dot || !status) return;
  dot.className    = 'source-dot ' + state;
  status.className = 'source-status ' + state;
  status.textContent = SOURCE_LABELS[state] || 'Not connected';
}

// Initialise all sources as disconnected on load
// ── initQNekt: called by loader.js once all partials are injected ─────────

/* ================================================================
   MODULE 2  INITIALISATION  —  called by DOMContentLoaded once DOM is ready
   ================================================================ */

function initQNekt() {
  // Initialise data source dots
  ['our','fos','osa','pivot','rne'].forEach(id => setSourceStatus(id, 'disconnected'));

  // Dynamic Academic Year
  const now     = new Date();
  const month   = now.getMonth() + 1;
  const year    = now.getFullYear();
  const ayStart = month >= 8 ? year : year - 1;
  const ayEnd   = ayStart + 1;
  let sem;
  if (month >= 8 && month <= 12)     sem = '1st Semester';
  else if (month >= 1 && month <= 5) sem = '2nd Semester';
  else                               sem = 'Summer';
  const ayEl  = document.getElementById('sidebar-ay');
  const semEl = document.getElementById('sidebar-sem');
  if (ayEl)  ayEl.textContent  = 'AY ' + ayStart + '\u2013' + ayEnd;
  if (semEl) semEl.textContent = sem;
}

/* ================================================================
   MODULE 3  NAVIGATION  —  page switching, nav + sidebar sync
   ================================================================ */

function showPage(id) {
  // Show the correct page
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + id);
  if (page) page.classList.add('active');

  // Sync nav bar (top)
  document.querySelectorAll('.site-nav-item').forEach(b => {
    b.classList.toggle('active', b.dataset.page === id);
  });

  // Sync sidebar
  document.querySelectorAll('.sidebar-item[data-page]').forEach(s => {
    s.classList.toggle('active', s.dataset.page === id);
  });
}

function setSidebarActive(el) {
  // Legacy shim — kept so any stray calls don't break; now a no-op
}

/* ================================================================
   MODULE 4  DATA PANEL TABS  —  form sub-panel switching
   ================================================================ */

function showDataTab(tab, btn) {
  document.querySelectorAll('.data-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + tab).classList.add('active');
  if (btn) {
    btn.closest('.tabs-local').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
}

/* ================================================================
   MODULE 5  DATABASE  —  tab switching, status options, view records
   ================================================================ */

const DB_STATUS_OPTIONS = {
  fac: ['All Status', 'Active', 'On Leave', 'Retired', 'Resigned'],
  stu: ['All Status', 'Regular', 'Irregular', 'Cross Enrollee', 'Returnee', 'LOA'],
  sch: ['All Status', 'Active', 'On Probation', 'Terminated', 'Completed'],
  res: ['All Status', 'Ongoing', 'Completed', 'On Hold', 'Proposed'],
};

function showDbTab(tab, btn) {
  ['fac','stu','sch','res'].forEach(t => {
    const el = document.getElementById('db-' + t);
    if (el) el.style.display = t === tab ? 'block' : 'none';
  });
  if (btn) {
    btn.closest('.tabs-local').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  // Swap status filter options
  const sel = document.getElementById('db-status-filter');
  if (sel && DB_STATUS_OPTIONS[tab]) {
    sel.innerHTML = DB_STATUS_OPTIONS[tab]
      .map((o, i) => `<option value="${i === 0 ? '' : o}">${o}</option>`)
      .join('');
  }
}

// ── Activity Log ──────────────────────────────────────────────────────────

/* ================================================================
   MODULE 6  ACTIVITY LOG  —  log entries, badge, rendering, filters
   ================================================================ */

const activityLog = [];

const ACT_ICONS = {
  update: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>`,
  batch:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8"/><path d="M12 3v4"/></svg>`,
  import: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>`,
  export: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 7 12 3 8 7"/><line x1="12" y1="3" x2="12" y2="15"/><path d="M20 21H4"/></svg>`,
  create: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
};

const ACT_LABELS = { update:'Update', batch:'Batch Update', import:'Import', export:'Export', create:'New Record' };

function logActivity(type, category, detail) {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
  const date = now.toLocaleDateString([], { month:'short', day:'numeric', year:'numeric' });
  activityLog.unshift({ type, category, detail, time, date, ts: now.getTime() });
  updateActivityBadge();
  renderActivity();
}

function updateActivityBadge() {
  const badge = document.getElementById('activity-badge');
  if (!badge) return;
  const count = activityLog.length;
  badge.textContent = count > 99 ? '99+' : count;
  badge.style.display = count > 0 ? 'inline-block' : 'none';
}

function renderActivity() {
  const list  = document.getElementById('act-list');
  const empty = document.getElementById('act-empty');
  if (!list || !empty) return;
  const typeFilter = document.getElementById('act-filter-type').value;
  const catFilter  = document.getElementById('act-filter-cat').value;
  const filtered   = activityLog.filter(a =>
    (!typeFilter || a.type === typeFilter) &&
    (!catFilter  || a.category === catFilter)
  );
  if (filtered.length === 0) {
    empty.style.display = 'flex';
    list.innerHTML = '';
    return;
  }
  empty.style.display = 'none';
  list.innerHTML = filtered.map(a => `
    <div class="act-item">
      <div class="act-icon ${a.type}">${ACT_ICONS[a.type] || ''}</div>
      <div class="act-body">
        <div class="act-title">${a.detail}</div>
        <div class="act-meta">
          <span>${a.category}</span>
          <span>${a.date} · ${a.time}</span>
        </div>
      </div>
      <span class="act-type-pill ${a.type}">${ACT_LABELS[a.type] || a.type}</span>
    </div>`).join('');
}

function clearActivityLog() {
  activityLog.length = 0;
  updateActivityBadge();
  renderActivity();
}

function viewDbRecords(tab) {
  // Make sure data-entry page is active
  showPage('data-entry');
  // Switch to the database hub tab
  const dbTabBtn = document.querySelector('.de-hub-tab[onclick*="database"]');
  if (dbTabBtn) switchHubTab('database', dbTabBtn);
  // Switch to the correct sub-table
  const subTabBtn = document.querySelector(`#de-database-panel .tab-btn[onclick*="'${tab}'"]`);
  if (subTabBtn) showDbTab(tab, subTabBtn);
}

/* ================================================================
   MODULE 7  DATA ENTRY HUB  —  hub tabs, form meta, open/close
   ================================================================ */

function switchHubTab(tab, btn) {
  document.querySelectorAll('.de-hub-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('de-entry-panel').style.display    = tab === 'entry'    ? 'block' : 'none';
  document.getElementById('de-database-panel').style.display = tab === 'database' ? 'block' : 'none';
  document.getElementById('de-activity-panel').style.display = tab === 'activity' ? 'block' : 'none';
  if (tab === 'activity') renderActivity();
}

const DE_FORM_META = {
  'faculty':      { title: 'Faculty Information',     source: 'Source: PIVOT/HR System' },
  'student':      { title: 'Student Information',     source: 'Source: AIMS System' },
  'research':     { title: 'Research & Extension',    source: 'Source: Research & Extension Office / PIVOT' },
  'scholarship':  { title: 'Scholarships',            source: 'Source: Student Affairs / Registrar' },
  'student-load': { title: 'Student Academic Load',   source: 'Source: Registrar / AIMS' },
  'faculty-load': { title: 'Faculty Academic Load',   source: "Source: PIVOT/HR / Dean's Office" },
};

function openDataEntry(panel) {
  document.getElementById('de-hub').style.display  = 'none';
  document.getElementById('de-form').style.display = 'block';
  const meta = DE_FORM_META[panel] || {};
  document.getElementById('de-form-title').textContent  = meta.title  || '';
  document.getElementById('de-form-source').textContent = meta.source || '';
  document.querySelectorAll('.data-panel').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('panel-' + panel);
  if (target) target.classList.add('active');
}

function closeDataEntry() {
  document.getElementById('de-form').style.display = 'none';
  document.getElementById('de-hub').style.display  = 'block';
}

// ── Reports Hub ───────────────────────────────────────────────────────────

/* ================================================================
   MODULE 8  REPORTS  —  generate, export, preview, log rendering
   ================================================================ */

const reportLog = [];

const RPT_META = {
  faculty:    { title: 'Faculty Report',                            sub: 'No data available. Connect a data source to generate this report.' },
  student:    { title: 'Student Report',                            sub: 'No data available. Connect a data source to generate this report.' },
  scholarship:{ title: 'Scholarships Report',                       sub: 'No data available. Connect a data source to generate this report.' },
  research:   { title: 'Research &amp; Publication Report',         sub: 'No data available. Connect a data source to generate this report.' },
  personnel:  { title: 'Research &amp; Extension Personnel Report', sub: 'No data available. Connect a data source to generate this report.' },
};

const RPT_DOC = {
  faculty: `<h3>Faculty Profile Summary</h3>
    <div class="doc-row"><span class="doc-label">Total Faculty</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Regular / Permanent</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Contractual / Part-time</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">With Doctoral Degree</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">With Master\'s Degree</span><span style="color:var(--muted)">—</span></div>
    <h3 style="margin-top:1rem;">Rank Distribution</h3>
    <div class="doc-row"><span class="doc-label">Professor I–VI</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Associate Professor I–V</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Assistant Professor I–IV</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Instructor I–III</span><span style="color:var(--muted)">—</span></div>`,
  student: `<h3>Student Profile Summary</h3>
    <div class="doc-row"><span class="doc-label">Total Students</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Regular Students</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Irregular Students</span><span style="color:var(--muted)">—</span></div>
    <h3 style="margin-top:1rem;">By Year Level</h3>
    <div class="doc-row"><span class="doc-label">1st Year</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">2nd Year</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">3rd Year</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">4th Year &amp; above</span><span style="color:var(--muted)">—</span></div>`,
  scholarship: `<h3>Scholarship Summary</h3>
    <div class="doc-row"><span class="doc-label">Total Active Grantees</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Full Grants</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Partial Grants</span><span style="color:var(--muted)">—</span></div>
    <h3 style="margin-top:1rem;">By Funding Agency</h3>
    <div class="doc-row"><span class="doc-label">CHED</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">DOST-SEI</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">LGU / Local Government</span><span style="color:var(--muted)">—</span></div>`,
  research: `<h3>Research Summary</h3>
    <div class="doc-row"><span class="doc-label">Ongoing Projects</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Completed Projects</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Total Research Budget</span><span style="color:var(--muted)">—</span></div>
    <h3 style="margin-top:1rem;">Publications</h3>
    <div class="doc-row"><span class="doc-label">International Journals</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">National Journals</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Conference Papers</span><span style="color:var(--muted)">—</span></div>`,
  personnel: `<h3>R&amp;E Personnel Summary</h3>
    <div class="doc-row"><span class="doc-label">Active Researchers</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Lead Researchers</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Co-Researchers</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Extension Coordinators</span><span style="color:var(--muted)">—</span></div>
    <h3 style="margin-top:1rem;">Extension Activities</h3>
    <div class="doc-row"><span class="doc-label">Community Programs</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Partner Communities</span><span style="color:var(--muted)">—</span></div>`,
};

let currentRptType = null;

function generateReport(type) {
  currentRptType = type;
  const meta = RPT_META[type] || {};
  document.getElementById('previewTitle').innerHTML  = meta.title || '';
  document.getElementById('previewSub').textContent   = meta.sub   || '';
  document.getElementById('reportContent').innerHTML  = RPT_DOC[type] || '';
  document.getElementById('rpt-hub').style.display     = 'none';
  document.getElementById('rpt-preview').style.display = 'block';
  const now = new Date();
  reportLog.unshift({
    title: (meta.title || 'Report').replace(/&amp;/g, '&'),
    format: '—',
    date: now.toLocaleDateString([], { month:'short', day:'numeric', year:'numeric' }),
    time: now.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }),
    status: 'Generated',
  });
  updateRptBadge();
  const lastEl = document.getElementById('rpt-last-gen');
  if (lastEl) lastEl.textContent = 'Just now';
  notify('Report generated!', 'create', 'Reports', (meta.title || 'Report').replace(/&amp;/g,'&') + ' generated');
}

function exportReport(fmt) {
  if (!currentRptType) return;
  const meta = RPT_META[currentRptType] || {};
  const title = (meta.title || 'Report').replace(/&amp;/g, '&');
  if (reportLog.length > 0) reportLog[0].format = fmt;
  updateRptBadge();
  notify('Exported as ' + fmt + '!', 'export', 'Reports', title + ' exported as ' + fmt);
}

function closeReportPreview() {
  document.getElementById('rpt-preview').style.display = 'none';
  document.getElementById('rpt-hub').style.display     = 'block';
}

function switchRptTab(tab, btn) {
  document.querySelectorAll('#page-reports .de-hub-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('rpt-types-panel').style.display = tab === 'types' ? 'block' : 'none';
  document.getElementById('rpt-log-panel').style.display   = tab === 'log'   ? 'block' : 'none';
  if (tab === 'log') renderReportLog();
}

function updateRptBadge() {
  const badge = document.getElementById('rpt-badge');
  if (!badge) return;
  badge.textContent = reportLog.length > 99 ? '99+' : reportLog.length;
  badge.style.display = reportLog.length > 0 ? 'inline-block' : 'none';
}

function renderReportLog() {
  const list  = document.getElementById('rpt-log-list');
  const empty = document.getElementById('rpt-log-empty');
  if (!list || !empty) return;
  const typeFilter = (document.getElementById('rpt-log-filter')?.value  || '').toLowerCase();
  const fmtFilter  = (document.getElementById('rpt-fmt-filter')?.value  || '').toLowerCase();
  const filtered   = reportLog.filter(r =>
    (!typeFilter || r.title.toLowerCase().includes(typeFilter)) &&
    (!fmtFilter  || r.format.toLowerCase() === fmtFilter)
  );
  if (filtered.length === 0) {
    empty.style.display = 'flex';
    list.innerHTML = '';
    return;
  }
  empty.style.display = 'none';
  list.innerHTML = filtered.map(r => `
    <div class="act-item">
      <div class="act-icon create">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      </div>
      <div class="act-body">
        <div class="act-title">${r.title}</div>
        <div class="act-meta">
          <span>Format: ${r.format}</span>
          <span>${r.date} · ${r.time}</span>
        </div>
      </div>
      <span class="act-type-pill create">${r.status}</span>
    </div>`).join('');
}

function clearReportLog() {
  reportLog.length = 0;
  updateRptBadge();
  renderReportLog();
}

/* ================================================================
   MODULE 9  NOTIFICATIONS  —  toast helper
   ================================================================ */

function notify(msg, logType, logCat, logDetail) {
  const n = document.getElementById('notif');
  document.getElementById('notif-text').textContent = msg;
  n.classList.add('show');
  setTimeout(() => n.classList.remove('show'), 3200);
  if (logType && logCat && logDetail) logActivity(logType, logCat, logDetail);
}