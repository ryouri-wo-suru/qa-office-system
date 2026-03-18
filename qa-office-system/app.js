/* Q-Nekt · Application Logic
   Modules: [1] Init  [2] Navigation  [3] Data Tabs  [4] Database
            [5] Activity Log  [6] Data Entry Hub  [7] Reports  [8] Notifications */


// --- 1. INIT ---

function initQNekt() {
  const now     = new Date();
  const month   = now.getMonth() + 1;
  const year    = now.getFullYear();
  const ayStart = month >= 8 ? year : year - 1;
  const ayEl    = document.getElementById('sidebar-ay');
  if (ayEl) ayEl.textContent = 'AY ' + ayStart + '\u2013' + (ayStart + 1);
}


// --- 3. NAVIGATION ---

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + id);
  if (page) page.classList.add('active');

  document.querySelectorAll('.site-nav-item').forEach(b => {
    b.classList.toggle('active', b.dataset.page === id);
  });
  document.querySelectorAll('.sidebar-item[data-page]').forEach(s => {
    s.classList.toggle('active', s.dataset.page === id);
  });

  if (id === 'data-entry') {
    const firstTab = document.querySelector('#de-hub .de-hub-tab');
    if (firstTab) switchHubTab('entry', firstTab);
    document.getElementById('de-hub').style.display  = 'block';
    document.getElementById('de-form').style.display = 'none';
  }
  if (id === 'reports') {
    const firstTab = document.querySelector('#page-reports .de-hub-tab');
    if (firstTab) switchRptTab('types', firstTab);
    document.getElementById('rpt-hub').style.display     = 'block';
    document.getElementById('rpt-preview').style.display = 'none';
  }
  if (id === 'historical') {
    const firstTab = document.querySelector('.hist-tab');
    if (firstTab) switchHistTab('student', firstTab);
  }
}

function setSidebarActive(el) {} // legacy shim — no-op


// --- 4. DATA PANEL TABS ---

function showDataTab(tab, btn) {
  document.querySelectorAll('.data-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + tab).classList.add('active');
  if (btn) {
    btn.closest('.tabs-local').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
}


// --- 5. DATABASE ---

const DB_STATUS_OPTIONS = {
  fac:   ['All Status', 'Regular', 'Contractual', 'Part-time', 'Visiting'],
  stu:   ['All Status', 'Regular', 'Irregular', 'Cross Enrollee', 'Returnee'],
  fload: ['All Status', '1st Semester', '2nd Semester', 'Summer'],
  sload: ['All Status', 'Regular Load', 'Overload', 'Underload'],
  res:   ['All Status', 'Ongoing', 'Completed', 'On Hold', 'Proposed'],
  sch:   ['All Status', 'Active', 'Terminated', 'On Probation', 'Completed'],
};

const DB_TAB_MAP = {
  fac:   { entry: 'faculty',      report: 'faculty'      },
  stu:   { entry: 'student',      report: 'student'      },
  fload: { entry: 'faculty-load', report: 'faculty-load' },
  sload: { entry: 'student-load', report: 'student-load' },
  res:   { entry: 'research',     report: 'research'     },
  sch:   { entry: 'scholarship',  report: 'scholarship'  },
};

let currentDbTab = 'fac';

function showDbTab(tab, btn) {
  currentDbTab = tab;
  ['fac', 'stu', 'fload', 'sload', 'res', 'sch'].forEach(t => {
    const el = document.getElementById('db-' + t);
    if (el) el.style.display = t === tab ? 'block' : 'none';
  });
  if (btn) {
    btn.closest('.tabs-local').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  const sel = document.getElementById('db-status-filter');
  if (sel && DB_STATUS_OPTIONS[tab]) {
    sel.innerHTML = DB_STATUS_OPTIONS[tab]
      .map((opt, i) => `<option value="${i === 0 ? '' : opt}">${opt}</option>`)
      .join('');
  }
}

function goToReport(type)     { showPage('reports');    generateReport(type);  }
function goToDataEntry(panel) { showPage('data-entry'); openDataEntry(panel);  }
function dbQuickEnter()       { goToDataEntry((DB_TAB_MAP[currentDbTab] || DB_TAB_MAP.fac).entry);  }
function dbQuickReport()      { goToReport((DB_TAB_MAP[currentDbTab]    || DB_TAB_MAP.fac).report); }

function viewDbRecords(tab) {
  showPage('data-entry');
  const dbTabBtn = document.querySelector('.de-hub-tab[onclick*="database"]');
  if (dbTabBtn) switchHubTab('database', dbTabBtn);
  const subTabBtn = document.querySelector(`#de-database-panel .tab-btn[onclick*="'${tab}'"]`);
  if (subTabBtn) showDbTab(tab, subTabBtn);
}


// --- 6. ACTIVITY LOG ---

const activityLog = [];

const ACT_ICONS = {
  update: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>`,
  batch:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8"/><path d="M12 3v4"/></svg>`,
  import: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>`,
  export: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 7 12 3 8 7"/><line x1="12" y1="3" x2="12" y2="15"/><path d="M20 21H4"/></svg>`,
  create: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
};

const ACT_LABELS = {
  update: 'Update', batch: 'Batch Update', import: 'Import', export: 'Export', create: 'New Record',
};

function logActivity(type, category, detail) {
  const now = new Date();
  activityLog.unshift({
    type, category, detail,
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
    ts:   now.getTime(),
  });
  updateActivityBadge();
  renderActivity();
  const el = document.getElementById('de-hub-history');
  if (el) el.textContent = activityLog.length;
}

function updateActivityBadge() {
  const badge = document.getElementById('activity-badge');
  if (!badge) return;
  badge.textContent   = activityLog.length > 99 ? '99+' : activityLog.length;
  badge.style.display = activityLog.length > 0 ? 'inline-block' : 'none';
}

function renderActivity() {
  const list  = document.getElementById('act-list');
  const empty = document.getElementById('act-empty');
  if (!list || !empty) return;

  const typeFilter = document.getElementById('act-filter-type').value;
  const catFilter  = document.getElementById('act-filter-cat').value;
  const filtered   = activityLog.filter(a =>
    (!typeFilter || a.type === typeFilter) && (!catFilter || a.category === catFilter)
  );

  if (filtered.length === 0) { empty.style.display = 'flex'; list.innerHTML = ''; return; }
  empty.style.display = 'none';
  list.innerHTML = filtered.map(a => `
    <div class="act-item">
      <div class="act-icon ${a.type}">${ACT_ICONS[a.type] || ''}</div>
      <div class="act-body">
        <div class="act-title">${a.detail}</div>
        <div class="act-meta"><span>${a.category}</span><span>${a.date} · ${a.time}</span></div>
      </div>
      <span class="act-type-pill ${a.type}">${ACT_LABELS[a.type] || a.type}</span>
    </div>`).join('');
}

function clearActivityLog() { activityLog.length = 0; updateActivityBadge(); renderActivity(); }


// --- 7. DATA ENTRY HUB ---

const DE_FORM_META = {
  'faculty':      { title: 'Faculty Information',   source: 'Source: PIVOT/HR System' },
  'student':      { title: 'Student Information',   source: 'Source: AIMS System' },
  'research':     { title: 'Research & Extension',  source: 'Source: Research & Extension Office / PIVOT' },
  'scholarship':  { title: 'Scholarships',          source: 'Source: Student Affairs / Registrar' },
  'student-load': { title: 'Student Academic Load', source: 'Source: Registrar / AIMS' },
  'faculty-load': { title: 'Faculty Academic Load', source: "Source: PIVOT/HR / Dean's Office" },
};

function switchHubTab(tab, btn) {
  document.querySelectorAll('.de-hub-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('de-entry-panel').style.display    = tab === 'entry'    ? 'block' : 'none';
  document.getElementById('de-database-panel').style.display = tab === 'database' ? 'block' : 'none';
  document.getElementById('de-activity-panel').style.display = tab === 'activity' ? 'block' : 'none';
  if (tab === 'activity') renderActivity();
}

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

function switchHistTab(tab, btn) {
  document.querySelectorAll('.hist-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.hist-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('hist-' + tab);
  if (panel) panel.classList.add('active');
  if (typeof refreshHistoricalData === 'function') refreshHistoricalData();
}


// --- 8. REPORTS ---

const reportLog = [];

const RPT_META = {
  faculty:        { title: 'Faculty Report',                            sub: 'No data available. Connect a data source to generate this report.' },
  student:        { title: 'Student Report',                            sub: 'No data available. Connect a data source to generate this report.' },
  scholarship:    { title: 'Scholarships Report',                       sub: 'No data available. Connect a data source to generate this report.' },
  research:       { title: 'Research &amp; Publication Report',         sub: 'No data available. Connect a data source to generate this report.' },
  personnel:      { title: 'Research &amp; Extension Personnel Report', sub: 'No data available. Connect a data source to generate this report.' },
  'faculty-load': { title: 'Faculty Academic Load Report',              sub: 'No data available. Connect a data source to generate this report.' },
  'student-load': { title: 'Student Academic Load Report',              sub: 'No data available. Connect a data source to generate this report.' },
};

const RPT_DOC = {
  faculty: `<h3>Faculty Profile Summary</h3>
    <div class="doc-row"><span class="doc-label">Total Faculty</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Regular / Permanent</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Contractual / Part-time</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">With Doctoral Degree</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">With Master's Degree</span><span style="color:var(--muted)">—</span></div>
    <h3 style="margin-top:1rem;">Rank Distribution</h3>
    <div class="doc-row"><span class="doc-label">Professor I\u2013VI</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Associate Professor I\u2013V</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Assistant Professor I\u2013IV</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Instructor I\u2013III</span><span style="color:var(--muted)">—</span></div>`,
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
  'faculty-load': `<h3>Faculty Academic Load Summary</h3>
    <div class="doc-row"><span class="doc-label">Total Faculty with Load</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">1st Semester Average Units</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">2nd Semester Average Units</span><span style="color:var(--muted)">—</span></div>
    <h3 style="margin-top:1rem;">Load Breakdown</h3>
    <div class="doc-row"><span class="doc-label">Average Teaching Units</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Average Research Units</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Average Admin Units</span><span style="color:var(--muted)">—</span></div>`,
  'student-load': `<h3>Student Academic Load Summary</h3>
    <div class="doc-row"><span class="doc-label">Total Students with Load</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Regular Load</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Overload</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Underload</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Average GWA</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Average Units Enrolled</span><span style="color:var(--muted)">—</span></div>`,
  personnel: `<h3>R&amp;E Personnel Summary</h3>
    <div class="doc-row"><span class="doc-label">Active Researchers</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Lead Researchers</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Co-Researchers</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Extension Coordinators</span><span style="color:var(--muted)">—</span></div>
    <h3 style="margin-top:1rem;">Extension Activities</h3>
    <div class="doc-row"><span class="doc-label">Community Programs</span><span style="color:var(--muted)">—</span></div>
    <div class="doc-row"><span class="doc-label">Partner Communities</span><span style="color:var(--muted)">—</span></div>`,
};

const RPT_FIELDS = {
  faculty:        ['Total Faculty','Regular / Permanent','Contractual / Part-time','With Doctoral Degree',"With Master's Degree",'Professor I\u2013VI','Associate Professor I\u2013V','Assistant Professor I\u2013IV','Instructor I\u2013III'],
  student:        ['Total Students','Regular Students','Irregular Students','1st Year','2nd Year','3rd Year','4th Year & above'],
  scholarship:    ['Total Active Grantees','Full Grants','Partial Grants','CHED','DOST-SEI','LGU / Local Government'],
  research:       ['Ongoing Projects','Completed Projects','Total Research Budget','International Journals','National Journals','Conference Papers'],
  personnel:      ['Active Researchers','Lead Researchers','Co-Researchers','Extension Coordinators','Community Programs','Partner Communities'],
  'faculty-load': ['Total Faculty with Load','1st Semester Average Units','2nd Semester Average Units','Average Teaching Units','Average Research Units','Average Extension Units','Average Admin Units'],
  'student-load': ['Total Students with Load','Regular Load','Overload','Underload','Average GWA','Average Units Enrolled'],
};

let currentRptType    = null;
let currentPreviewFmt = 'PDF';

function generateReport(type) {
  currentRptType    = type;
  currentPreviewFmt = 'PDF';
  const meta = RPT_META[type] || {};
  document.getElementById('previewTitle').innerHTML = meta.title || '';
  document.getElementById('previewSub').textContent = meta.sub   || '';

  const ay = (document.getElementById('sidebar-ay') || {}).textContent || 'AY \u2014\u2014';
  document.getElementById('reportContent-PDF').innerHTML   = RPT_DOC[type] || '';
  document.getElementById('reportContent-Excel').innerHTML = (RPT_FIELDS[type] || []).map(r =>
    `<div class="rpt-excel-row"><span class="rpt-excel-data" style="width:200px;">${r}</span><span class="rpt-excel-data muted" style="flex:1;">\u2014</span><span class="rpt-excel-data muted" style="width:120px;">${ay}</span></div>`
  ).join('');
  document.getElementById('reportContent-CSV').textContent =
    ['Field,Value,Academic Year'].concat((RPT_FIELDS[type] || []).map(r => `${r},\u2014,${ay}`)).join('\n');

  document.querySelectorAll('.rpt-fmt-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.rpt-fmt-preview').forEach(p => p.classList.remove('active'));
  document.getElementById('fmt-tab-PDF')?.classList.add('active');
  document.getElementById('rpt-fmt-PDF')?.classList.add('active');
  const hint = document.getElementById('rpt-fmt-hint');
  if (hint) hint.textContent = 'Previewing as PDF';
  updateExportBtn('PDF');
  document.getElementById('rpt-hub').style.display     = 'none';
  document.getElementById('rpt-preview').style.display = 'block';
}

function quickGenerateReport(type, fmt) { generateReport(type); switchPreviewFormat(fmt, document.getElementById('fmt-tab-' + fmt)); }

function switchPreviewFormat(fmt, btn) {
  currentPreviewFmt = fmt;
  document.querySelectorAll('.rpt-fmt-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('.rpt-fmt-preview').forEach(p => p.classList.remove('active'));
  document.getElementById('rpt-fmt-' + fmt)?.classList.add('active');
  const hint = document.getElementById('rpt-fmt-hint');
  if (hint) hint.textContent = 'Previewing as ' + fmt;
  updateExportBtn(fmt);
}

function updateExportBtn(fmt) {
  const btn = document.getElementById('rpt-export-btn');
  if (!btn) return;
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px;"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg> Export as ${fmt}`;
}

function exportCurrentFormat() { exportReport(currentPreviewFmt); closeReportPreview(); }
function closeReportPreview()  { document.getElementById('rpt-preview').style.display = 'none'; document.getElementById('rpt-hub').style.display = 'block'; }

function exportReport(fmt) {
  if (!currentRptType) return;
  const title    = (RPT_META[currentRptType]?.title || 'Report').replace(/&amp;/g, '&');
  const now      = new Date();
  const dateStr  = now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr  = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const ay       = (document.getElementById('sidebar-ay') || {}).textContent || 'AY \u2014\u2014';
  const filename = title.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '').toLowerCase() + '_' + now.toISOString().slice(0, 10);

  reportLog.unshift({ title, format: fmt, date: dateStr, time: timeStr, status: 'Exported' });
  updateRptBadge();
  if (typeof refreshDashboardMetrics === 'function') refreshDashboardMetrics();
  const lastEl = document.getElementById('rpt-last-gen');
  if (lastEl) lastEl.textContent = 'Just now';

  _computeReportData(currentRptType).then(rows => {
    if      (fmt === 'CSV')   _downloadCSV(filename + '.csv', rows, ay);
    else if (fmt === 'Excel') _downloadExcel(filename + '.xlsx', rows, title, ay);
    else                      _downloadPDF(title, rows, ay);
  });

  notify('Exported as ' + fmt + '!');
}

async function _computeReportData(type) {
  const _all = async store => { try { return await store.getAll(); } catch(e) { return []; } };
  const _avg = (recs, f) => { const v = recs.map(r => parseFloat(r[f])).filter(v => !isNaN(v)); return v.length ? (v.reduce((a,b)=>a+b,0)/v.length).toFixed(2) : '\u2014'; };
  const _sum = (recs, f) => { const v = recs.map(r => parseFloat(r[f])).filter(v => !isNaN(v)); return v.length ? v.reduce((a,b)=>a+b,0).toLocaleString() : '\u2014'; };
  const fields = RPT_FIELDS[type] || [];
  let values = {};

  if (type === 'faculty') {
    const r = await _all(QNektDB.faculty);
    values = {
      'Total Faculty': r.length || '\u2014',
      'Regular / Permanent': r.filter(x => x['Employment Status']==='Regular').length || '\u2014',
      'Contractual / Part-time': r.filter(x => ['Contractual','Part-time'].includes(x['Employment Status'])).length || '\u2014',
      'With Doctoral Degree': r.filter(x => (x['Highest Educational Attainment']||'').toLowerCase().includes('doctoral')).length || '\u2014',
      "With Master's Degree": r.filter(x => (x['Highest Educational Attainment']||'').toLowerCase().includes('master')).length || '\u2014',
      'Professor \u2013VI': r.filter(x => (x['Rank / Designation']||'').startsWith('Professor')).length || '\u2014',
      'Associate Professor I\u2013V': r.filter(x => (x['Rank / Designation']||'').startsWith('Associate')).length || '\u2014',
      'Assistant Professor I\u2013IV': r.filter(x => (x['Rank / Designation']||'').startsWith('Assistant')).length || '\u2014',
      'Instructor I\u2013III': r.filter(x => (x['Rank / Designation']||'').startsWith('Instructor')).length || '\u2014',
    };
  } else if (type === 'student') {
    const r = await _all(QNektDB.students);
    values = {
      'Total Students': r.length || '\u2014',
      'Regular Students': r.filter(x => x['Enrollment Status']==='Regular').length || '\u2014',
      'Irregular Students': r.filter(x => x['Enrollment Status']==='Irregular').length || '\u2014',
      '1st Year': r.filter(x => x['Year Level']==='1st Year').length || '\u2014',
      '2nd Year': r.filter(x => x['Year Level']==='2nd Year').length || '\u2014',
      '3rd Year': r.filter(x => x['Year Level']==='3rd Year').length || '\u2014',
      '4th Year & above': r.filter(x => ['4th Year','Graduate'].includes(x['Year Level'])).length || '\u2014',
    };
  } else if (type === 'scholarship') {
    const r = await _all(QNektDB.scholarships);
    values = {
      'Total Active Grantees': r.filter(x => x['Status']==='Active').length || '\u2014',
      'Full Grants': r.filter(x => x['Scholarship Type']==='Full Grant').length || '\u2014',
      'Partial Grants': r.filter(x => x['Scholarship Type']==='Partial Grant').length || '\u2014',
      'CHED': r.filter(x => (x['Scholarship Program']||'').includes('CHED')).length || '\u2014',
      'DOST-SEI': r.filter(x => (x['Scholarship Program']||'').includes('DOST')).length || '\u2014',
      'LGU / Local Government': r.filter(x => (x['Scholarship Program']||'').includes('LGU')).length || '\u2014',
    };
  } else if (type === 'research') {
    const r = await _all(QNektDB.research);
    const budget = _sum(r, 'Budget (PHP)');
    values = {
      'Ongoing Projects': r.filter(x => x['Status']==='Ongoing').length || '\u2014',
      'Completed Projects': r.filter(x => x['Status']==='Completed').length || '\u2014',
      'Total Research Budget': budget !== '\u2014' ? '\u20b1 ' + budget : '\u2014',
      'International Journals': '\u2014', 'National Journals': '\u2014', 'Conference Papers': '\u2014',
    };
  } else if (type === 'personnel') {
    const r = await _all(QNektDB.research);
    values = {
      'Active Researchers': r.length || '\u2014',
      'Lead Researchers': r.filter(x => x['Role']==='Lead Researcher').length || '\u2014',
      'Co-Researchers': r.filter(x => x['Role']==='Co-Researcher').length || '\u2014',
      'Extension Coordinators': r.filter(x => x['Role']==='Extension Coordinator').length || '\u2014',
      'Community Programs': '\u2014', 'Partner Communities': '\u2014',
    };
  } else if (type === 'faculty-load') {
    const r = await _all(QNektDB.facultyLoad);
    values = {
      'Total Faculty with Load': r.length || '\u2014',
      '1st Semester Average Units': _avg(r.filter(x => x['Semester']==='1st Semester'), 'Total Workload Units'),
      '2nd Semester Average Units': _avg(r.filter(x => x['Semester']==='2nd Semester'), 'Total Workload Units'),
      'Average Teaching Units': _avg(r, 'Teaching Units'),
      'Average Research Units': _avg(r, 'Research Units'),
      'Average Extension Units': _avg(r, 'Extension Units'),
      'Average Admin Units': _avg(r, 'Admin Units'),
    };
  } else if (type === 'student-load') {
    const r = await _all(QNektDB.studentLoad);
    values = {
      'Total Students with Load': r.length || '\u2014',
      'Regular Load': r.filter(x => x['Load Status']==='Regular Load').length || '\u2014',
      'Overload': r.filter(x => x['Load Status']==='Overload').length || '\u2014',
      'Underload': r.filter(x => x['Load Status']==='Underload').length || '\u2014',
      'Average GWA': _avg(r, 'GWA (Previous Semester)'),
      'Average Units Enrolled': _avg(r, 'Total Units Enrolled'),
    };
  }

  return fields.map(f => ({ field: f, value: String(values[f] !== undefined ? values[f] : '\u2014') }));
}

function _downloadCSV(filename, rows, ay) {
  const lines = ['Field,Value,Academic Year'].concat(
    rows.map(r => `"${r.field.replace(/"/g,'""')}","${String(r.value).replace(/"/g,'""')}","${ay}"`)
  );
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function _downloadExcel(filename, rows, title, ay) {
  function _build() {
    const wsData = [['Field','Value','Academic Year']].concat(rows.map(r => [r.field, r.value, ay]));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = [{ wch: 38 }, { wch: 22 }, { wch: 16 }];
    XLSX.utils.book_append_sheet(wb, ws, title.slice(0, 31));
    XLSX.writeFile(wb, filename);
  }
  if (typeof XLSX !== 'undefined') { _build(); return; }
  const s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
  s.onload = _build;
  document.head.appendChild(s);
}

function _downloadPDF(title, rows, ay) {
  const dateStr  = new Date().toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
  const filename = title.replace(/[^a-z0-9]+/gi, '_').toLowerCase() + '_' + new Date().toISOString().slice(0, 10) + '.pdf';

  function _buildPDF() {
    const { jsPDF } = window.jspdf;
    const doc    = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW  = doc.internal.pageSize.getWidth();
    const margin = 18;
    let y = margin;

    doc.setFillColor(138, 21, 56); doc.rect(0, 0, pageW, 18, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');   doc.text('UPOU Q-Nekt Quality Assurance System', margin, 11);
    doc.setFont('helvetica', 'normal'); doc.text(ay, pageW - margin, 11, { align: 'right' });

    y = 30;
    doc.setTextColor(30, 30, 30); doc.setFontSize(16); doc.setFont('helvetica', 'bold');
    doc.text(title, margin, y); y += 7;
    doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(120, 120, 120);
    doc.text('Generated: ' + dateStr + '   |   ' + ay, margin, y); y += 4;
    doc.setDrawColor(138, 21, 56); doc.setLineWidth(0.5); doc.line(margin, y, pageW - margin, y); y += 8;

    const colW1 = 110;
    doc.setFillColor(138, 21, 56); doc.rect(margin, y, pageW - margin * 2, 8, 'F');
    doc.setTextColor(255, 215, 0); doc.setFontSize(8); doc.setFont('helvetica', 'bold');
    doc.text('FIELD', margin + 3, y + 5.5); doc.text('VALUE', margin + colW1 + 3, y + 5.5); y += 8;

    rows.forEach((row, i) => {
      const val = String(row.value);
      if (y > 270) { doc.addPage(); y = margin; }
      if (i % 2 === 0) { doc.setFillColor(252, 248, 249); doc.rect(margin, y, pageW - margin * 2, 8, 'F'); }
      const grey = val === '\u2014' ? 160 : 30;
      doc.setTextColor(50, 50, 50); doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
      doc.text(row.field, margin + 3, y + 5.5);
      doc.setTextColor(grey, grey, grey); doc.text(val, margin + colW1 + 3, y + 5.5);
      doc.setDrawColor(230, 230, 230); doc.setLineWidth(0.2); doc.line(margin, y + 8, pageW - margin, y + 8);
      y += 8;
    });

    const pages = doc.internal.getNumberOfPages();
    for (let p = 1; p <= pages; p++) {
      doc.setPage(p); doc.setFontSize(7.5); doc.setTextColor(160, 160, 160); doc.setFont('helvetica', 'normal');
      doc.text('Q-Nekt \u00b7 UPOU Quality Assurance System', margin, 290);
      doc.text('Page ' + p + ' of ' + pages, pageW - margin, 290, { align: 'right' });
    }
    doc.save(filename);
  }

  function _printWindow() {
    const tableRows = rows.map(row => {
      const val = String(row.value);
      return `<tr><td>${row.field}</td><td style="${val==='\u2014'?'color:#9ca3af;':'color:#111;font-weight:600;'}">${val}</td></tr>`;
    }).join('');
    const win = window.open('', '_blank', 'width=820,height=640');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title>
      <style>@media print{.no-print{display:none!important}}
      body{font-family:Arial,sans-serif;margin:32px;color:#111;font-size:13px;}
      h1{font-size:18px;margin:0 0 4px;}.sub{font-size:11px;color:#6b7280;margin-bottom:20px;}
      table{width:100%;border-collapse:collapse;}
      thead th{background:#8a1538;color:#fff;padding:7px 10px;text-align:left;font-size:11px;letter-spacing:.5px;}
      td{padding:6px 10px;border-bottom:1px solid #e5e7eb;font-size:12px;}tr:nth-child(even) td{background:#fdf8f9;}
      .toolbar{background:#f3f4f6;border:1px solid #d1d5db;border-radius:8px;padding:12px 16px;margin-bottom:20px;display:flex;gap:10px;align-items:center;}
      .btn{padding:7px 16px;border-radius:6px;border:none;cursor:pointer;font-size:13px;font-weight:600;}
      .btn-red{background:#8a1538;color:#fff;}.btn-gray{background:#e5e7eb;color:#374151;}</style>
      </head><body>
      <div class="toolbar no-print">
        <button class="btn btn-red" onclick="window.print()">Print / Save as PDF</button>
        <button class="btn btn-gray" onclick="window.close()">Close</button>
        <span style="font-size:12px;color:#6b7280;margin-left:auto;">Choose "Save as PDF" in the print dialog for a PDF file.</span>
      </div>
      <h1>${title}</h1><div class="sub">${ay} \u00b7 Generated ${dateStr}</div>
      <table><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody>${tableRows}</tbody></table>
      </body></html>`);
    win.document.close(); win.focus();
  }

  if (typeof window.jspdf !== 'undefined') { _buildPDF(); _printWindow(); return; }
  const s = document.createElement('script');
  s.src    = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  s.onload  = () => { _buildPDF(); _printWindow(); };
  s.onerror = () => { notify('PDF library failed to load \u2014 opening print view only.'); _printWindow(); };
  document.head.appendChild(s);
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
  if (badge) {
    badge.textContent   = reportLog.length > 99 ? '99+' : reportLog.length;
    badge.style.display = reportLog.length > 0 ? 'inline-block' : 'none';
  }
  const el = document.getElementById('rpt-metric-count');
  if (el) el.textContent = reportLog.length;
}

function renderReportLog() {
  const list  = document.getElementById('rpt-log-list');
  const empty = document.getElementById('rpt-log-empty');
  if (!list || !empty) return;

  const typeFilter = (document.getElementById('rpt-log-filter')?.value || '').toLowerCase();
  const fmtFilter  = (document.getElementById('rpt-fmt-filter')?.value  || '').toLowerCase();
  const filtered   = reportLog.filter(r =>
    (!typeFilter || r.title.toLowerCase().includes(typeFilter)) &&
    (!fmtFilter  || r.format.toLowerCase() === fmtFilter)
  );

  if (filtered.length === 0) { empty.style.display = 'flex'; list.innerHTML = ''; return; }
  empty.style.display = 'none';
  list.innerHTML = filtered.map(r => `
    <div class="act-item">
      <div class="act-icon create">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      </div>
      <div class="act-body">
        <div class="act-title">${r.title}</div>
        <div class="act-meta"><span>Format: ${r.format}</span><span>${r.date} \u00b7 ${r.time}</span></div>
      </div>
      <span class="act-type-pill create">${r.status}</span>
    </div>`).join('');
}

function clearReportLog() { reportLog.length = 0; updateRptBadge(); renderReportLog(); }


// --- 9. NOTIFICATIONS ---

function notify(msg, logType, logCat, logDetail) {
  const n = document.getElementById('notif');
  document.getElementById('notif-text').textContent = msg;
  n.classList.add('show');
  setTimeout(() => n.classList.remove('show'), 3200);
  if (logType && logCat && logDetail) logActivity(logType, logCat, logDetail);
}
