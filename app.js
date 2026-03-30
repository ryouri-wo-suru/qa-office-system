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
  sar:   { entry: null,           report: null           },
};

let currentDbTab = 'fac';

function showDbTab(tab, btn) {
  currentDbTab = tab;
  ['fac', 'stu', 'fload', 'sload', 'res', 'sch', 'sar'].forEach(t => {
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
  } else if (sel && tab === 'sar') {
    sel.innerHTML = '<option value="">All Status</option>';
  }
  // Refresh SAR drafts table when tab is selected
  if (tab === 'sar' && typeof refreshDbTable === 'function') refreshDbTable('sar');
}

function goToReport(type)     { showPage('reports');    generateReport(type);  }
function goToDataEntry(panel) { showPage('data-entry'); openDataEntry(panel);  }
function dbQuickEnter()  { const m = DB_TAB_MAP[currentDbTab]; if (m && m.entry)   goToDataEntry(m.entry);   else if (currentDbTab === 'sar') { showPage('reports'); setTimeout(() => openSARPage(), 100); } }
function dbQuickReport() { const m = DB_TAB_MAP[currentDbTab]; if (m && m.report)  goToReport(m.report);     else if (currentDbTab === 'sar') { showPage('reports'); setTimeout(() => openSARPage(), 100); } }

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


// --- 9. SAR (SELF-ASSESSMENT REPORT) ---

const SAR_CRITERIA = [
  {
    id: 'c1', number: 1,
    title: 'Expected Learning Outcomes',
    subReqs: [
      { id: '1.1', label: 'Formulation, Alignment & Stakeholders', desc: 'The programme to show that the expected learning outcomes are appropriately formulated in accordance with an established learning taxonomy, are aligned to the vision and mission of the university, and are known to all stakeholders.' },
      { id: '1.2', label: 'Course Alignment (CLO to PLO)', desc: 'The programme to show that the expected learning outcomes for all courses are appropriately formulated and are aligned to the expected learning outcomes of the programme.' },
      { id: '1.3', label: 'Generic & Subject-Specific Outcomes', desc: 'The programme to show that the expected learning outcomes consist of both generic outcomes (related to written and oral communication, problem-solving, information technology, team building skills, etc) and subject specific outcomes (related to knowledge and skills of the study discipline).' },
      { id: '1.4', label: 'Stakeholder Requirements', desc: 'The programme to show that the expected learning outcomes are clearly aligned with the requirements of the stakeholders.' },
      { id: '1.5', label: 'Achievement of ELOs', desc: 'The programme to show directly the achievement of the expected learning outcomes.' },
    ]
  },
  {
    id: 'c2', number: 2,
    title: 'Programme Structure and Content',
    subReqs: [
      { id: '2.1', label: 'Specifications Comprehensive / Up-to-date / Available', desc: 'The programme specifications are shown to be comprehensive, current, and available to all stakeholders via appropriate channels.' },
      { id: '2.2', label: 'Constructive Alignment (ELOs / CLOs / Activities / Assessments)', desc: 'The programme to show that teaching, learning, and assessment activities are constructively aligned to achieving the expected learning outcomes.' },
      { id: '2.3', label: 'Stakeholder Feedback Included in Design', desc: 'The programme content is shown to have been designed with input from external stakeholders including employers, alumni, and industry partners.' },
      { id: '2.4', label: 'Course Contribution to ELOs is Clear', desc: 'Each course\'s contribution to the achievement of the expected programme learning outcomes is shown to be clear.' },
      { id: '2.5', label: 'Logical Structure, Sequencing & Integration', desc: 'The programme structure is shown to have a logical structure, appropriate sequencing, and integration of courses.' },
      { id: '2.6', label: 'Option for Major and/or Minor Specialisations', desc: 'The programme to show that there are options for major and/or minor specialisations where applicable.' },
      { id: '2.7', label: 'Periodic Review & Industry Relevance', desc: 'The programme is shown to be periodically reviewed for relevance to industry and benchmarked against peer programmes.' },
    ]
  },
  {
    id: 'c3', number: 3,
    title: 'Teaching and Learning Approach',
    subReqs: [
      { id: '3.1', label: 'Philosophy Articulation', desc: 'The teaching and learning philosophy and approach are shown to be well articulated and communicated to all stakeholders, and reflected in the teaching and learning activities.' },
      { id: '3.2', label: 'Student Participation', desc: 'The teaching and learning activities are shown to allow students to participate responsibly in the learning process.' },
      { id: '3.3', label: 'Active Learning', desc: 'The teaching and learning activities are shown to involve active learning by the students.' },
      { id: '3.4', label: 'Life-long Learning', desc: 'The teaching and learning activities are shown to promote learning, learning how to learn, and instilling in students a commitment for life-long learning (e.g., commitment to critical inquiry, information-processing skills, and a willingness to experiment with new ideas and practices).' },
      { id: '3.5', label: 'Innovation & Entrepreneurship', desc: 'The teaching and learning activities are shown to inculcate in students, new ideas, creative thought, innovation, and an entrepreneurial mindset.' },
      { id: '3.6', label: 'Continuous Improvement', desc: 'The teaching and learning processes are shown to be continuously improved to ensure their relevance to the needs of industry and are aligned to the expected learning outcomes.' },
    ]
  },
  {
    id: 'c4', number: 4,
    title: 'Student Assessment',
    subReqs: [
      { id: '4.1', label: 'Variety & Alignment', desc: 'A variety of assessment methods are shown to be used and constructively aligned to achieving the expected learning outcomes and the teaching and learning objectives.' },
      { id: '4.2', label: 'Policies & Appeals', desc: 'The assessment and assessment-appeal policies are shown to be explicit, communicated to students, and applied consistently.' },
      { id: '4.3', label: 'Standards & Progression', desc: 'The assessment standards and procedures for student progression and degree completion are shown to be explicit, communicated to students, and applied consistently.' },
      { id: '4.4', label: 'Rubrics & Reliability', desc: 'The assessment methods are shown to include rubrics, marking schemes, timelines, and regulations that ensure validity, reliability, and fairness in assessment.' },
      { id: '4.5', label: 'Measuring ELOs', desc: 'The assessment methods are shown to measure the achievement of the expected learning outcomes of the programme and its courses.' },
      { id: '4.6', label: 'Timely Feedback', desc: 'Feedback of student assessment is shown to be provided in a timely manner.' },
      { id: '4.7', label: 'Continuous Review', desc: 'The student assessment and its processes are shown to be continuously reviewed and improved to ensure relevance to the needs of industry and alignment to the expected learning outcomes.' },
    ]
  },
  {
    id: 'c5', number: 5,
    title: 'Academic Staff',
    subReqs: [
      { id: '5.1', label: 'Staff Planning', desc: 'The programme to show that academic staff planning (including succession, promotion, re-deployment, termination, and retirement plans) is carried out to ensure the quality and quantity of academic staff fulfil the needs for education, research, and service.' },
      { id: '5.2', label: 'Workload', desc: 'The programme to show that staff workload is measured and monitored to improve the quality of education, research, and service.' },
      { id: '5.3', label: 'Competencies', desc: 'The programme to show that the competences of the academic staff are determined, evaluated, and communicated.' },
      { id: '5.4', label: 'Duties / Allocation', desc: 'The programme to show that the duties allocated to the academic staff are appropriate to qualifications, experience, and aptitude.' },
      { id: '5.5', label: 'Promotion / Merit', desc: 'The programme to show that promotion of the academic staff is based on a merit system which accounts for teaching, research, and service.' },
      { id: '5.6', label: 'Ethics / Rights', desc: 'The programme to show that the rights and privileges, benefits, roles and relationships, and accountability of the academic staff, taking into account professional ethics and their academic freedom, are well defined and understood.' },
      { id: '5.7', label: 'Training / Dev', desc: 'The programme to show that the training and developmental needs of the academic staff are systematically identified, and that appropriate training and development activities are implemented to fulfill the identified needs.' },
      { id: '5.8', label: 'Performance Mgmt', desc: 'The programme to show that performance management including reward and recognition is implemented to assess academic staff teaching and research quality.' },
    ]
  },
  {
    id: 'c6', number: 6,
    title: 'Student Support Services',
    subReqs: [
      { id: '6.1', label: 'Intake & Admission', desc: 'The student intake policy, admission criteria, and admission procedures to the programme are shown to be clearly defined, communicated, published, and up-to-date.' },
      { id: '6.2', label: 'Service Planning', desc: 'Both short-term and long-term planning of academic and non-academic support services are shown to be carried out to ensure sufficiency and quality of support services for teaching, research, and community service.' },
      { id: '6.3', label: 'Monitoring Progress', desc: 'An adequate system is shown to exist for student progress, academic performance, and workload monitoring. Student progress, academic performance, and workload are shown to be systematically recorded and monitored. Feedback to students and corrective actions are made where necessary.' },
      { id: '6.4', label: 'Co-curricular / Employability', desc: 'Co-curricular activities, student competition, and other student support services are shown to be available to improve learning experience and employability.' },
      { id: '6.5', label: 'Support Staff Competence', desc: 'The competences of the support staff rendering student services are shown to be identified for recruitment and deployment, evaluated for continued relevance, and roles and relationships are well-defined.' },
      { id: '6.6', label: 'Evaluation & Enhancement', desc: 'Student support services are shown to be subjected to evaluation, benchmarking, and enhancement.' },
    ]
  },
  {
    id: 'c7', number: 7,
    title: 'Facilities and Infrastructures',
    subReqs: [
      { id: '7.1', label: 'Physical Resources & Technology', desc: 'The physical resources to deliver the curriculum, including equipment, material, and information technology, are shown to be sufficient.' },
      { id: '7.2', label: 'Laboratories & Equipment', desc: 'The laboratories and equipment are shown to be up-to-date, readily available, and effectively deployed.' },
      { id: '7.3', label: 'Digital Library', desc: 'A digital library is shown to be set-up, in keeping with progress in information and communication technology.' },
      { id: '7.4', label: 'IT Systems for Staff & Students', desc: 'The information technology systems are shown to be set up to meet the needs of staff and students.' },
      { id: '7.5', label: 'Computer & Network Infrastructure', desc: 'The university is shown to provide a highly accessible computer and network infrastructure that enables the campus community to fully exploit information technology for teaching, research, service, and administration.' },
      { id: '7.6', label: 'Environmental, Health & Safety Standards', desc: 'The environmental, health, and safety standards and access for people with special needs are shown to be defined and implemented.' },
      { id: '7.7', label: 'Physical, Social & Psychological Environment', desc: 'The university is shown to provide a physical, social, and psychological environment that is conducive for education, research, and personal well-being.' },
      { id: '7.8', label: 'Support Staff for Facilities', desc: 'The competences of the support staff rendering services related to facilities are shown to be identified and evaluated to ensure that their skills remain relevant to stakeholder needs.' },
      { id: '7.9', label: 'Quality Evaluation of Facilities', desc: 'The quality of the facilities (library, laboratory, IT, and student services) are shown to be subjected to evaluation and enhancement.' },
    ]
  },
  {
    id: 'c8', number: 8,
    title: 'Output and Outcomes',
    subReqs: [
      { id: '8.1', label: 'Pass / Drop / Grad', desc: 'The pass rate, dropout rate, and average time to graduate are shown to be established, monitored, and benchmarked for improvement.' },
      { id: '8.2', label: 'Employability', desc: 'Employability as well as self-employment, entrepreneurship, and advancement to further studies, are shown to be established, monitored, and benchmarked for improvement.' },
      { id: '8.3', label: 'Research Output', desc: 'Research and creative work output and activities carried out by the academic staff and students, are shown to be established, monitored, and benchmarked for improvement.' },
      { id: '8.4', label: 'Achievement of PLOs', desc: 'Data are provided to show directly the achievement of the programme outcomes, which are established and monitored.' },
      { id: '8.5', label: 'Satisfaction Level', desc: 'Satisfaction levels of the various stakeholders are shown to be established, monitored, and benchmarked for improvement.' },
    ]
  },
];

const SAR_STATUS_OPTIONS = ['Not Met', 'Partially Met', 'Fully Met'];

const SAR_READINESS_OPTIONS = ['Needs immediate attention.', 'In progress.', 'Ready for assessment.'];

let sarData = {}; // keyed by subReq id: { rating, justification } and narrative_cX / evidence_cX / overall_cX keys
let sarActiveCriterion = 'c1';

function openSARPage() {
  // Init SAR data with empty values
  SAR_CRITERIA.forEach(c => {
    c.subReqs.forEach(sr => {
      if (!sarData[sr.id]) sarData[sr.id] = { status: '', justification: '' };
    });
  });

  // Set meta info
  const ay = (document.getElementById('sidebar-ay') || {}).textContent || '—';
  const sarAy = document.getElementById('sar-ay');
  if (sarAy) sarAy.textContent = ay;
  const sarDate = document.getElementById('sar-date');
  if (sarDate) sarDate.textContent = new Date().toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });

  buildSARTabs();
  switchSARCriterion('c1');
  updateSAROverallBadge();

  // Show SAR page, hide reports page
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-sar').classList.add('active');
  document.querySelectorAll('.site-nav-item').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.sidebar-item[data-page]').forEach(s => s.classList.remove('active'));

  // Wire programme input to auto-load draft on blur
  const progInput = document.getElementById('sar-programme');
  if (progInput && !progInput._sarWired) {
    progInput._sarWired = true;
    progInput.addEventListener('blur', () => {
      if (progInput.value.trim()) loadSARDraft(progInput.value.trim()).then(() => {
        buildSARTabs();
        switchSARCriterion(sarActiveCriterion);
        updateSAROverallBadge();
      });
    });
  }
}

function closeSARPage() {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-reports').classList.add('active');
  document.querySelectorAll('.site-nav-item').forEach(b => {
    b.classList.toggle('active', b.dataset.page === 'reports');
  });
  document.querySelectorAll('.sidebar-item[data-page]').forEach(s => {
    s.classList.toggle('active', s.dataset.page === 'reports');
  });
  document.getElementById('rpt-hub').style.display     = 'block';
  document.getElementById('rpt-preview').style.display = 'none';
}

function buildSARTabs() {
  const tabsEl = document.getElementById('sar-criterion-tabs');
  if (!tabsEl) return;
  tabsEl.innerHTML = SAR_CRITERIA.map(c => {
    const filled    = c.subReqs.filter(sr => sarData[sr.id]?.status).length;
    const total     = c.subReqs.length;
    const allDone   = filled === total;
    const noneDone  = filled === 0;
    const dotColor  = allDone ? 'var(--green2)' : noneDone ? 'rgba(220,60,60,0.8)' : 'var(--gold)';
    return `<button class="sar-tab${sarActiveCriterion === c.id ? ' active' : ''}" onclick="switchSARCriterion('${c.id}')" title="${c.title}">
      <span style="width:7px;height:7px;border-radius:50%;background:${dotColor};flex-shrink:0;display:inline-block;"></span>
      ${c.number}. ${c.title}
    </button>`;
  }).join('');
}

function switchSARCriterion(cid) {
  sarActiveCriterion = cid;
  buildSARTabs();
  buildSARPanel(cid);
}

function buildSARPanel(cid) {
  const criterion = SAR_CRITERIA.find(c => c.id === cid);
  if (!criterion) return;
  const panels = document.getElementById('sar-criterion-panels');
  if (!panels) return;

  const filled = criterion.subReqs.filter(sr => sarData[sr.id]?.status).length;
  const total  = criterion.subReqs.length;
  const progressColor = filled === total ? 'var(--green2)' : filled === 0 ? '#e05a78' : 'var(--gold)';

  const statusClass = s =>
    s === 'Fully Met'    ? 'sar-status-met' :
    s === 'Partially Met'? 'sar-status-partial' : 'sar-status-notmet';

  const statusColor = s =>
    s === 'Fully Met'    ? '#166534' :
    s === 'Partially Met'? '#854d0e' : '#7f1d1d';

  const statusBg = s =>
    s === 'Fully Met'    ? '#dcfce7' :
    s === 'Partially Met'? '#fef9c3' : '#fee2e2';

  panels.innerHTML = `
    <div class="sar-criterion-panel">

      <!-- Panel Header -->
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:1.4rem;flex-wrap:wrap;">
        <div style="width:44px;height:44px;background:rgba(138,21,56,0.2);border:1px solid rgba(138,21,56,0.35);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:var(--header2);flex-shrink:0;">${criterion.number}</div>
        <div>
          <div style="font-size:16px;font-weight:700;color:var(--text);">AUN-QA v4 Criterion ${criterion.number} — ${criterion.title}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px;">${total} sub-requirements · ${filled} of ${total} statuses set</div>
        </div>
        <div style="margin-left:auto;">
          <span style="font-size:11px;font-weight:700;padding:4px 14px;border-radius:20px;background:${filled===total?'rgba(14,96,33,0.25)':filled===0?'rgba(138,21,56,0.25)':'rgba(246,172,29,0.2)'};color:${progressColor};border:1px solid ${progressColor}40;">
            ${filled === total ? 'Complete' : filled === 0 ? 'Not Started' : `In Progress (${filled}/${total})`}
          </span>
        </div>
      </div>

      <!-- A. SAR READINESS DECISION -->
      <div class="sar-section-block">
        <div class="sar-section-heading">A. SAR READINESS DECISION</div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:8px;">Select the overall readiness decision for this criterion.</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${SAR_READINESS_OPTIONS.map(opt => {
            const active = (sarData['readiness_' + cid] || '') === opt;
            const col = opt.includes('immediately') ? '#e05a78' : opt.includes('progress') ? 'var(--gold)' : 'var(--green2)';
            const bg  = opt.includes('immediately') ? 'rgba(138,21,56,0.18)' : opt.includes('progress') ? 'rgba(246,172,29,0.15)' : 'rgba(14,96,33,0.18)';
            return `<button onclick="updateSARNarrative('readiness_${cid}','${opt}')" style="font-size:12px;font-weight:${active?700:500};padding:7px 16px;border-radius:8px;border:1.5px solid ${active?col:'var(--border2)'};background:${active?bg:'transparent'};color:${active?col:'var(--muted)'};cursor:pointer;transition:all .15s;">${opt}</button>`;
          }).join('')}
        </div>
      </div>

      <!-- B. SUB-REQUIREMENT COVERAGE CHECK -->
      <div class="sar-section-block">
        <div class="sar-section-heading">B. SUB-REQUIREMENT COVERAGE CHECK</div>

        <div class="sar-table">
          <div class="sar-table-header" style="display:grid;grid-template-columns:120px 1fr 160px 1fr;gap:0;">
            <div style="padding:8px 12px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--muted);">Sub-Requirement</div>
            <div style="padding:8px 12px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--muted);">Description</div>
            <div style="padding:8px 12px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--muted);text-align:center;">Status</div>
            <div style="padding:8px 12px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--muted);">One-line Justification</div>
          </div>

          ${criterion.subReqs.map(sr => {
            const d  = sarData[sr.id] || { status: '', justification: '' };
            const sc = d.status ? statusClass(d.status) : 'sar-status-notmet';
            return `<div style="display:grid;grid-template-columns:120px 1fr 160px 1fr;gap:0;border-top:1px solid var(--border2);align-items:start;">
              <div style="padding:10px 12px;">
                <span class="sar-req-id" style="font-size:11px;">${sr.id}</span>
                <div style="font-size:10px;color:var(--muted);margin-top:3px;line-height:1.3;">${sr.label}</div>
              </div>
              <div style="padding:10px 12px;font-size:11px;color:var(--muted);line-height:1.55;">${sr.desc}</div>
              <div style="padding:10px 12px;text-align:center;">
                <select class="sar-status-select ${sc}" onchange="updateSARField('${sr.id}','status',this.value)" style="font-size:11px;font-weight:600;padding:5px 8px;border-radius:6px;width:100%;cursor:pointer;text-align:center;">
                  <option value="">— Select —</option>
                  ${SAR_STATUS_OPTIONS.map(opt => `<option value="${opt}"${opt===d.status?' selected':''}>${opt}</option>`).join('')}
                </select>
              </div>
              <div style="padding:10px 12px;">
                <input class="sar-justification-input" type="text" placeholder="One-line justification…" value="${(d.justification||'').replace(/"/g,'&quot;')}" onchange="updateSARField('${sr.id}','justification',this.value)" oninput="updateSARField('${sr.id}','justification',this.value)" />
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <!-- C. EVALUATION -->
      <div class="sar-section-block">
        <div class="sar-section-heading">C. EVALUATION</div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:10px;">Provide a detailed evaluation narrative for this criterion — identify gaps, cite evidence, and outline action plans for unmet sub-requirements.</div>
        <textarea class="sar-narrative" id="sar-narrative-${cid}" placeholder="Write your evaluation here. Structure it around each sub-requirement gap, evidence available, and planned actions…" onchange="updateSARNarrative('narrative_${cid}',this.value)" oninput="updateSARNarrative('narrative_${cid}',this.value)">${sarData['narrative_' + cid] || ''}</textarea>
      </div>

      <!-- Appendix References -->
      <div class="sar-section-block">
        <div class="sar-section-heading">APPENDIX REFERENCES</div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:8px;">List all appendix codes and titles referenced in this criterion (e.g. Appendix ${criterion.number}.1.1 – Curriculum Map).</div>
        <textarea class="sar-narrative" style="min-height:70px;" id="sar-evidence-${cid}" placeholder="e.g. Appendix ${criterion.number}.1.1 – …&#10;Appendix ${criterion.number}.2.1 – …" onchange="updateSAREvidence('${cid}',this.value)" oninput="updateSAREvidence('${cid}',this.value)">${sarData['evidence_' + cid] || ''}</textarea>
      </div>

    </div>

    <!-- Criterion Navigation -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1.4rem;padding-top:1.2rem;border-top:1px solid var(--border2);">
      ${cid !== 'c1' ? `<button class="btn btn-ghost" style="font-size:12px;" onclick="switchSARCriterion('c${criterion.number - 1}')">← Criterion ${criterion.number - 1}</button>` : '<div></div>'}
      <div style="font-size:12px;color:var(--muted);">${criterion.number} / ${SAR_CRITERIA.length}</div>
      ${cid !== 'c' + SAR_CRITERIA.length ? `<button class="btn btn-ghost" style="font-size:12px;" onclick="switchSARCriterion('c${criterion.number + 1}')">Criterion ${criterion.number + 1} →</button>` : '<button class="btn btn-primary" style="font-size:12px;" onclick="exportSAR()">Finalize &amp; Export PDF</button>'}
    </div>
  `;
}

function updateSARField(srId, field, value) {
  if (!sarData[srId]) sarData[srId] = { status: '', justification: '' };
  sarData[srId][field] = value;
  if (field === 'status') {
    const sel = document.querySelector(`select[onchange*="'${srId}','status'"]`);
    if (sel) {
      sel.className = 'sar-status-select ' + (
        value === 'Fully Met'    ? 'sar-status-met' :
        value === 'Partially Met'? 'sar-status-partial' : 'sar-status-notmet'
      );
    }
    updateSAROverallBadge();
    buildSARTabs();
  }
}

function updateSARNarrative(key, value) { sarData[key] = value; }
function updateSAREvidence(cid, value)   { sarData['evidence_' + cid] = value; }

function updateSAROverallBadge() {
  const badge = document.getElementById('sar-overall-badge');
  if (!badge) return;
  let total = 0, filled = 0, fullyMet = 0;
  SAR_CRITERIA.forEach(c => {
    c.subReqs.forEach(sr => {
      total++;
      const s = sarData[sr.id]?.status || '';
      if (s) filled++;
      if (s === 'Fully Met') fullyMet++;
    });
  });
  const pct   = Math.round((filled / total) * 100);
  const label = pct === 100 ? `SAR Complete · ${fullyMet}/${total} Fully Met` : pct >= 50 ? `In Progress (${pct}%)` : `Not Started (${pct}%)`;
  const bg    = pct === 100 ? 'rgba(14,96,33,0.3)'   : pct >= 50 ? 'rgba(246,172,29,0.2)'  : 'rgba(138,21,56,0.25)';
  const col   = pct === 100 ? 'var(--green2)'         : pct >= 50 ? 'var(--gold)'            : '#e05a78';
  badge.textContent      = label;
  badge.style.background = bg;
  badge.style.color      = col;
  badge.style.border     = '1px solid ' + col + '50';
}

function saveSARDraft() {
  if (!QNektCrypto.isUnlocked()) { notify('Database is locked. Please unlock first.'); return; }
  const programme = (document.getElementById('sar-programme')?.value || '').trim() || 'Untitled Programme';
  const faculty   = (document.getElementById('sar-faculty')?.value || '').trim();
  const draftId   = 'SAR_' + programme.replace(/\s+/g, '_').toUpperCase();
  const record    = {
    draftId,
    programme,
    faculty,
    savedAt:   new Date().toISOString(),
    sarData:   JSON.stringify(sarData),
  };
  QNektDB.sarDrafts.save(record).then(() => {
    notify('SAR draft saved \u2713');
    QNektDB.audit.log('SAVE', 'sar_drafts', draftId, { programme });
  }).catch(err => {
    notify('Save failed: ' + err.message);
  });
}

async function loadSARDraft(programme) {
  if (!QNektCrypto.isUnlocked()) return;
  try {
    const draftId = 'SAR_' + (programme || '').replace(/\s+/g, '_').toUpperCase();
    const record  = await QNektDB.sarDrafts.get(draftId);
    if (record && record.sarData) {
      Object.assign(sarData, JSON.parse(record.sarData));
      const facultyEl = document.getElementById('sar-faculty');
      if (facultyEl && record.faculty) facultyEl.value = record.faculty;
      notify('SAR draft loaded \u2713');
    }
  } catch (err) {
    console.warn('[SAR] Could not load draft:', err);
  }
}

function exportSAR() {
  const programme = (document.getElementById('sar-programme')?.value || 'Programme').trim() || 'Programme';
  const faculty    = (document.getElementById('sar-faculty')?.value || '').trim();
  const ay         = (document.getElementById('sar-ay')?.textContent || '').trim();
  const date       = (document.getElementById('sar-date')?.textContent || '').trim();

  const statusColor = s => s === 'Fully Met' ? '#166534' : s === 'Partially Met' ? '#92400e' : '#7f1d1d';
  const statusBg    = s => s === 'Fully Met' ? '#dcfce7' : s === 'Partially Met' ? '#fef9c3' : '#fee2e2';

  // Part II — one block per criterion, each with A / B / C sections
  const criteriaHTML = SAR_CRITERIA.map(c => {
    const readiness = sarData['readiness_' + c.id] || '';
    const narrative = sarData['narrative_'  + c.id] || '';
    const evidence  = sarData['evidence_'   + c.id] || '';

    const tableRows = c.subReqs.map(sr => {
      const d = sarData[sr.id] || {};
      const s = d.status || '';
      return `<tr>
        <td style="padding:9px 12px;border:1px solid #d1d5db;font-size:11px;vertical-align:top;width:28%;">
          <strong>${sr.id}.</strong> ${sr.label}
        </td>
        <td style="padding:9px 12px;border:1px solid #d1d5db;font-size:11px;text-align:center;vertical-align:top;width:14%;">
          ${s ? `<span style="display:inline-block;padding:3px 10px;border-radius:12px;font-size:10px;font-weight:700;background:${statusBg(s)};color:${statusColor(s)};white-space:nowrap;">${s}</span>` : '<span style="color:#9ca3af;font-size:11px;">—</span>'}
        </td>
        <td style="padding:9px 12px;border:1px solid #d1d5db;font-size:11px;color:${d.justification?'#374151':'#9ca3af'};vertical-align:top;">${d.justification || '—'}</td>
      </tr>`;
    }).join('');

    return `
      <div style="margin-bottom:48px;page-break-inside:avoid;">
        <h2 style="font-size:15px;font-weight:800;color:#8a1538;border-bottom:2px solid #8a1538;padding-bottom:5px;margin:0 0 18px;text-transform:uppercase;letter-spacing:.5px;">
          AUN-QA v4 Criterion ${c.number} — ${c.title}
        </h2>

        <h3 style="font-size:12px;font-weight:800;color:#111;text-transform:uppercase;letter-spacing:.8px;margin:0 0 6px;">A. SAR READINESS DECISION</h3>
        <p style="font-size:13px;font-weight:600;color:${readiness.includes('immediately')?'#7f1d1d':readiness.includes('progress')?'#92400e':'#166534'};margin:0 0 18px;padding:8px 12px;background:${readiness.includes('immediately')?'#fee2e2':readiness.includes('progress')?'#fef9c3':'#dcfce7'};border-radius:4px;display:inline-block;">
          ${readiness || '[Readiness decision not set]'}
        </p>

        <h3 style="font-size:12px;font-weight:800;color:#111;text-transform:uppercase;letter-spacing:.8px;margin:0 0 10px;">B. SUB-REQUIREMENT COVERAGE CHECK</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:18px;">
          <thead>
            <tr style="background:#1e293b;color:#fff;">
              <th style="padding:9px 12px;font-size:11px;text-align:left;font-weight:700;letter-spacing:.4px;">Sub-Requirement</th>
              <th style="padding:9px 12px;font-size:11px;text-align:center;font-weight:700;letter-spacing:.4px;width:14%;">Status</th>
              <th style="padding:9px 12px;font-size:11px;text-align:left;font-weight:700;letter-spacing:.4px;">One-line Justification</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>

        <h3 style="font-size:12px;font-weight:800;color:#111;text-transform:uppercase;letter-spacing:.8px;margin:0 0 8px;">C. EVALUATION</h3>
        ${narrative
          ? `<div style="font-size:12px;color:#374151;line-height:1.7;white-space:pre-wrap;">${narrative}</div>`
          : `<p style="font-size:12px;color:#9ca3af;font-style:italic;">[No evaluation narrative provided.]</p>`}

        ${evidence ? `
        <div style="margin-top:14px;padding:10px 14px;background:#f8fafc;border-left:3px solid #8a1538;border-radius:0 4px 4px 0;">
          <p style="margin:0 0 4px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.6px;color:#8a1538;">Appendix References</p>
          <p style="margin:0;font-size:11px;color:#374151;white-space:pre-wrap;">${evidence}</p>
        </div>` : ''}
      </div>`;
  }).join('');

  // Part III — summary table (status counts per criterion)
  const summaryRows = SAR_CRITERIA.map(c => {
    const counts = { 'Fully Met': 0, 'Partially Met': 0, 'Not Met': 0 };
    c.subReqs.forEach(sr => { const s = sarData[sr.id]?.status || 'Not Met'; counts[s] = (counts[s]||0) + 1; });
    return `<tr>
      <td style="padding:8px 14px;border:1px solid #d1d5db;font-size:12px;">Criterion ${c.number}: ${c.title}</td>
      <td style="padding:8px 14px;border:1px solid #d1d5db;font-size:11px;text-align:center;color:#166534;font-weight:700;">${counts['Fully Met']}</td>
      <td style="padding:8px 14px;border:1px solid #d1d5db;font-size:11px;text-align:center;color:#92400e;font-weight:700;">${counts['Partially Met']}</td>
      <td style="padding:8px 14px;border:1px solid #d1d5db;font-size:11px;text-align:center;color:#7f1d1d;font-weight:700;">${counts['Not Met']}</td>
    </tr>`;
  }).join('');

  const win = window.open('', '_blank', 'width=1000,height=800');
  if (!win) { notify('Could not open export window. Allow pop-ups.'); return; }

  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
  <title>SAR – ${programme}</title>
  <style>
    @media print { .no-print { display:none!important; } @page { margin:2.5cm; size:A4; } }
    body { font-family: Arial, sans-serif; margin:0; color:#111; font-size:13px; line-height:1.6; }
    .toolbar { background:#f3f4f6; border-bottom:1px solid #d1d5db; padding:12px 24px; display:flex; gap:10px; align-items:center; position:sticky; top:0; z-index:10; }
    .btn { padding:7px 18px; border-radius:6px; border:none; cursor:pointer; font-size:13px; font-weight:600; }
    .btn-red { background:#8a1538; color:#fff; }
    .btn-gray { background:#e5e7eb; color:#374151; }
    .cover { text-align:center; padding:80px 60px 60px; border-bottom:4px solid #8a1538; }
    .toc { padding:40px 60px; border-bottom:2px solid #e5e7eb; }
    .toc h2 { font-size:14px; font-weight:800; text-transform:uppercase; letter-spacing:1.5px; margin:0 0 18px; color:#8a1538; }
    .toc-row { display:flex; justify-content:space-between; padding:5px 0; font-size:12px; border-bottom:1px dotted #d1d5db; }
    .toc-row.bold { font-weight:700; }
    .toc-row.indent { padding-left:24px; color:#374151; }
    .content { padding:40px 60px; }
    .part-title { font-size:16px; font-weight:800; text-transform:uppercase; letter-spacing:1px; color:#8a1538; border-bottom:3px solid #8a1538; padding-bottom:6px; margin:40px 0 24px; }
    h2, h3, p { margin:0 0 12px; }
  </style></head><body>

  <div class="toolbar no-print">
    <button class="btn btn-red" onclick="window.print()">🖨 Print / Save as PDF</button>
    <button class="btn btn-gray" onclick="window.close()">Close</button>
    <span style="font-size:12px;color:#6b7280;margin-left:auto;">Choose "Save as PDF" in print dialog · A4 recommended</span>
  </div>

  <!-- COVER -->
  <div class="cover">
    <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#6b7280;margin-bottom:28px;">University of the Philippines Open University · Quality Assurance Office</div>
    <div style="font-size:30px;font-weight:900;letter-spacing:2px;color:#8a1538;margin-bottom:10px;">SELF-ASSESSMENT REPORT</div>
    <div style="font-size:16px;font-weight:700;color:#374151;margin-bottom:8px;">${programme}</div>
    ${faculty ? `<div style="font-size:14px;font-weight:600;color:#374151;margin-bottom:28px;">${faculty}</div>` : '<div style="margin-bottom:28px;"></div>'}
    <div style="font-size:13px;color:#6b7280;line-height:2;">
      <div><strong style="color:#111;">Academic Year:</strong> ${ay || '—'}</div>
      <div><strong style="color:#111;">Date Prepared:</strong> ${date || '—'}</div>
    </div>
  </div>

  <!-- TABLE OF CONTENTS -->
  <div class="toc">
    <h2>Table of Contents</h2>
    <div class="toc-row bold"><span>LIST OF ABBREVIATIONS</span><span>#</span></div>
    <div class="toc-row bold"><span>LIST OF TABLES</span><span>#</span></div>
    <div class="toc-row bold"><span>LIST OF FIGURES</span><span>#</span></div>
    <div class="toc-row bold"><span>PART I. INTRODUCTION</span><span>#</span></div>
    <div class="toc-row bold"><span>PART II. AUN-QA ASSESSMENT AT PROGRAMME-LEVEL</span><span>#</span></div>
    ${SAR_CRITERIA.map(c=>`<div class="toc-row indent"><span>Criterion ${c.number}: ${c.title}</span><span>#</span></div>`).join('')}
    <div class="toc-row bold"><span>PART III. STRENGTH AND AREAS FOR IMPROVEMENT</span><span>#</span></div>
    <div class="toc-row bold"><span>PART IV. SELF-RATING SUMMARY</span><span>#</span></div>
    <div class="toc-row bold"><span>PART V. APPENDICES</span><span>#</span></div>
  </div>

  <div class="content">

    <div class="part-title">Part I. Introduction</div>
    <p style="font-size:13px;color:#9ca3af;font-style:italic;">[Executive Summary — provide an overview of the programme and key findings of this self-assessment.]</p>
    <p style="font-size:13px;color:#9ca3af;font-style:italic;">[The University of the Philippines Open University — brief institutional description.]</p>
    <p style="font-size:13px;color:#9ca3af;font-style:italic;">[Faculty of Study — brief description of the faculty.]</p>
    <p style="font-size:13px;color:#9ca3af;font-style:italic;">[Degree Programme — brief description of the ${programme}.]</p>

    <div class="part-title">Part II. AUN-QA Assessment at Programme-Level</div>
    ${criteriaHTML}

    <div class="part-title">Part III. Strength and Areas for Improvement</div>
    <p style="font-size:13px;color:#9ca3af;font-style:italic;">[Summarise the key strengths identified across all criteria and priority areas for improvement.]</p>

    <div class="part-title">Part IV. Self-Rating Summary</div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <thead>
        <tr style="background:#8a1538;color:#fff;">
          <th style="padding:10px 14px;font-size:11px;text-align:left;letter-spacing:.4px;">CRITERION</th>
          <th style="padding:10px 14px;font-size:11px;text-align:center;letter-spacing:.4px;width:12%;">FULLY MET</th>
          <th style="padding:10px 14px;font-size:11px;text-align:center;letter-spacing:.4px;width:14%;">PARTIALLY MET</th>
          <th style="padding:10px 14px;font-size:11px;text-align:center;letter-spacing:.4px;width:12%;">NOT MET</th>
        </tr>
      </thead>
      <tbody>${summaryRows}</tbody>
    </table>

    <div class="part-title">Part V. Appendices</div>
    ${SAR_CRITERIA.map(c => {
      const ev = sarData['evidence_' + c.id];
      return ev
        ? `<p style="font-size:12px;margin-bottom:4px;"><em>${ev}</em></p>`
        : `<p style="font-size:12px;color:#9ca3af;font-style:italic;margin-bottom:4px;">Appendix ${c.number}.X.X — [To be attached: Criterion ${c.number} — ${c.title}]</p>`;
    }).join('')}
    <p style="font-size:12px;color:#6b7280;margin-top:20px;font-style:italic;">&lt;Attach the signed SAR Checklist as the last page&gt;</p>

  </div>
  </body></html>`);
  win.document.close(); win.focus();

  reportLog.unshift({ title: 'SAR – ' + programme, format: 'PDF', date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'Exported' });
  updateRptBadge();
  notify('SAR exported as PDF!');
}
// --- 10. NOTIFICATIONS ---

function notify(msg, logType, logCat, logDetail) {
  const n = document.getElementById('notif');
  document.getElementById('notif-text').textContent = msg;
  n.classList.add('show');
  setTimeout(() => n.classList.remove('show'), 3200);
  if (logType && logCat && logDetail) logActivity(logType, logCat, logDetail);
}
