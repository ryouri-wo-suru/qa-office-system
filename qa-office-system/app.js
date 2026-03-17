/* ================================================================
   Q-Nekt · UPOU Quality Assurance System · Application Logic
   ================================================================
   This file contains all the JavaScript that powers the Q-Nekt
   system. It is split into 9 modules, each handling a specific
   part of the application.

   Modules
     [1] Data Source Status    Updates the sidebar connection dots
     [2] Initialisation        Runs once on page load (academic year,
                               semester label, source dot setup)
     [3] Navigation            Switches between pages; keeps the top
                               nav and sidebar in sync
     [4] Data Panel Tabs       Switches sub-panels inside data entry forms
     [5] Database              Switches database table tabs and updates
                               the status filter options per table
     [6] Activity Log          Records every save / import / export action
                               and displays them in the Recent Activity tab
     [7] Data Entry Hub        Controls the three hub tabs (Data Entry,
                               Database, Recent Activity) and manages
                               opening / closing individual data forms
     [8] Reports               Handles report generation, export, the
                               report preview panel, and the recent
                               reports log
     [9] Notifications         Shows the brief toast notification that
                               appears at the bottom-right of the screen
   ================================================================ */


/* ================================================================
   MODULE 1 · DATA SOURCE STATUS
   ================================================================
   The sidebar shows five data source connections (OUR, FoS, OSA,
   PIVOT/HR, R&E Personnel). Each has a coloured dot and a status
   label. This module controls those indicators.

   Usage: setSourceStatus('our', 'connected')
   States: 'connected' | 'syncing' | 'error' | 'disconnected'
   ================================================================ */

// Human-readable label for each connection state
const SOURCE_LABELS = {
  connected:    '● Online',
  syncing:      '● Syncing',
  error:        '● Error',
  disconnected: 'Not connected',
};

/**
 * Updates the colour dot and text label for a data source in the sidebar.
 * @param {string} id    - Source ID: 'our' | 'fos' | 'osa' | 'pivot' | 'rne'
 * @param {string} state - Connection state (see SOURCE_LABELS above)
 */
function setSourceStatus(id, state) {
  const dot    = document.getElementById('dot-'    + id);
  const status = document.getElementById('status-' + id);
  if (!dot || !status) return;
  dot.className      = 'source-dot '    + state;
  status.className   = 'source-status ' + state;
  status.textContent = SOURCE_LABELS[state] || 'Not connected';
}


/* ================================================================
   MODULE 2 · INITIALISATION
   ================================================================
   Called by loader.js after all HTML templates have been injected
   into the page. Sets up the initial state of the application:
     - All data source dots start as "Not connected"
     - The sidebar shows the current academic year and semester
       based on today's date (Philippine academic calendar)
   ================================================================ */

/**
 * Main entry point — called automatically by loader.js on page load.
 * Do not call this manually; loader.js handles the timing.
 */
function initQNekt() {
  // Mark all five data sources as disconnected on first load
  ['our', 'fos', 'osa', 'pivot', 'rne'].forEach(id => setSourceStatus(id, 'disconnected'));

  // Work out the current academic year and semester using today's date.
  // Philippine academic calendar:
  //   Aug–Dec  →  1st Semester   (AY starts in August)
  //   Jan–May  →  2nd Semester
  //   Jun–Jul  →  Summer
  const now     = new Date();
  const month   = now.getMonth() + 1; // getMonth() returns 0-indexed, so +1
  const year    = now.getFullYear();
  const ayStart = month >= 8 ? year : year - 1; // AY starts in August
  const ayEnd   = ayStart + 1;

  let sem;
  if      (month >= 8 && month <= 12) sem = '1st Semester';
  else if (month >= 1 && month <= 5)  sem = '2nd Semester';
  else                                sem = 'Summer';

  // Write the AY and semester into the sidebar labels
  const ayEl  = document.getElementById('sidebar-ay');
  const semEl = document.getElementById('sidebar-sem');
  if (ayEl)  ayEl.textContent  = 'AY ' + ayStart + '\u2013' + ayEnd;
  if (semEl) semEl.textContent = sem;
}


/* ================================================================
   MODULE 3 · NAVIGATION
   ================================================================
   The app has four pages: Dashboard, Data Entry, Reports, and
   Historical Data. Both the top nav bar and the sidebar link to
   the same pages; clicking either one switches the page and keeps
   both navigation elements in sync.
   ================================================================ */

/**
 * Shows the selected page and highlights its nav item in both the
 * top nav bar and the sidebar.
 * @param {string} id - Page ID: 'dashboard' | 'data-entry' | 'reports' | 'historical'
 */
function showPage(id) {
  // Hide all pages, then reveal only the requested one
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + id);
  if (page) page.classList.add('active');

  // Highlight the matching button in the top navigation bar
  document.querySelectorAll('.site-nav-item').forEach(b => {
    b.classList.toggle('active', b.dataset.page === id);
  });

  // Highlight the matching item in the sidebar
  document.querySelectorAll('.sidebar-item[data-page]').forEach(s => {
    s.classList.toggle('active', s.dataset.page === id);
  });
}

// Legacy shim — kept so any old inline onclick="setSidebarActive(...)" calls
// don't throw errors. The function no longer needs to do anything.
function setSidebarActive(el) {}


/* ================================================================
   MODULE 4 · DATA PANEL TABS
   ================================================================
   Each data entry form (Faculty, Student, etc.) is a separate
   "panel" inside the form view. This function activates the
   correct panel and highlights its tab button when a tab is clicked.
   ================================================================ */

/**
 * Switches the visible sub-panel inside a data entry form.
 * @param {string} tab - Panel ID suffix, e.g. 'faculty', 'student'
 * @param {HTMLElement} btn - The tab button that was clicked
 */
function showDataTab(tab, btn) {
  // Hide all panels, then show the selected one
  document.querySelectorAll('.data-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + tab).classList.add('active');

  // Update the tab button highlight within the same tab group
  if (btn) {
    btn.closest('.tabs-local').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
}


/* ================================================================
   MODULE 5 · DATABASE
   ================================================================
   The Database panel inside Data Entry shows four tables: Faculty,
   Students, Scholarships, and Research. Switching between them
   also updates the Status filter dropdown to show options relevant
   to the selected table (e.g. "On Leave" only applies to Faculty).
   ================================================================ */

// Status filter options per database table.
// The first entry in each array is always the "show all" default.
const DB_STATUS_OPTIONS = {
  fac: ['All Status', 'Active', 'On Leave', 'Retired', 'Resigned'],
  stu: ['All Status', 'Regular', 'Irregular', 'Cross Enrollee', 'Returnee', 'LOA'],
  sch: ['All Status', 'Active', 'On Probation', 'Terminated', 'Completed'],
  res: ['All Status', 'Ongoing', 'Completed', 'On Hold', 'Proposed'],
};

/**
 * Switches the visible database table and refreshes the status filter.
 * @param {string} tab - Table key: 'fac' | 'stu' | 'sch' | 'res'
 * @param {HTMLElement} btn - The tab button that was clicked
 */
function showDbTab(tab, btn) {
  // Show only the selected table, hide the others
  ['fac', 'stu', 'sch', 'res'].forEach(t => {
    const el = document.getElementById('db-' + t);
    if (el) el.style.display = t === tab ? 'block' : 'none';
  });

  // Highlight the active tab button
  if (btn) {
    btn.closest('.tabs-local').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }

  // Replace the status filter options with ones relevant to this table
  const sel = document.getElementById('db-status-filter');
  if (sel && DB_STATUS_OPTIONS[tab]) {
    sel.innerHTML = DB_STATUS_OPTIONS[tab]
      .map((opt, i) => `<option value="${i === 0 ? '' : opt}">${opt}</option>`)
      .join('');
  }
}

/**
 * Navigates to the Data Entry page, opens the Database tab, and
 * jumps directly to the table matching the clicked card.
 * Used by the "View Records" icon buttons on the entry cards.
 * @param {string} tab - Table key: 'fac' | 'stu' | 'sch' | 'res'
 */
function viewDbRecords(tab) {
  showPage('data-entry');

  // Open the Database hub tab
  const dbTabBtn = document.querySelector('.de-hub-tab[onclick*="database"]');
  if (dbTabBtn) switchHubTab('database', dbTabBtn);

  // Jump to the correct table within the database panel
  const subTabBtn = document.querySelector(`#de-database-panel .tab-btn[onclick*="'${tab}'"]`);
  if (subTabBtn) showDbTab(tab, subTabBtn);
}


/* ================================================================
   MODULE 6 · ACTIVITY LOG
   ================================================================
   Every time a user saves a record, imports data, exports a file,
   or performs a batch update, an entry is added to the activity log.
   The log is displayed in the "Recent Activity" tab of Data Entry
   and can be filtered by action type and data category.

   Activity types: 'update' | 'batch' | 'import' | 'export' | 'create'
   ================================================================ */

// In-memory array that stores all activity entries for the current session.
// Each entry: { type, category, detail, time, date, ts }
const activityLog = [];

// SVG icons shown next to each activity entry in the log list
const ACT_ICONS = {
  update: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>`,
  batch:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8"/><path d="M12 3v4"/></svg>`,
  import: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>`,
  export: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 7 12 3 8 7"/><line x1="12" y1="3" x2="12" y2="15"/><path d="M20 21H4"/></svg>`,
  create: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
};

// Display labels shown on each activity entry pill badge
const ACT_LABELS = {
  update: 'Update',
  batch:  'Batch Update',
  import: 'Import',
  export: 'Export',
  create: 'New Record',
};

/**
 * Adds a new entry to the activity log.
 * Called automatically by notify() whenever an action is performed.
 * @param {string} type     - Activity type key (see ACT_LABELS above)
 * @param {string} category - Data category, e.g. 'Faculty Information'
 * @param {string} detail   - Human-readable description of what happened
 */
function logActivity(type, category, detail) {
  const now  = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  // Prepend so the newest entry always appears at the top
  activityLog.unshift({ type, category, detail, time, date, ts: now.getTime() });
  updateActivityBadge();
  renderActivity();
}

/**
 * Updates the numeric badge on the "Recent Activity" tab button.
 * Shows the total count, capped at "99+".
 */
function updateActivityBadge() {
  const badge = document.getElementById('activity-badge');
  if (!badge) return;
  const count = activityLog.length;
  badge.textContent   = count > 99 ? '99+' : count;
  badge.style.display = count > 0 ? 'inline-block' : 'none';
}

/**
 * Re-renders the activity list based on the current filter selections.
 * Shows an empty-state message if there are no matching entries.
 */
function renderActivity() {
  const list  = document.getElementById('act-list');
  const empty = document.getElementById('act-empty');
  if (!list || !empty) return;

  // Read the current filter values (empty string means "show all")
  const typeFilter = document.getElementById('act-filter-type').value;
  const catFilter  = document.getElementById('act-filter-cat').value;

  const filtered = activityLog.filter(a =>
    (!typeFilter || a.type     === typeFilter) &&
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

/** Clears all entries from the activity log and resets the badge. */
function clearActivityLog() {
  activityLog.length = 0;
  updateActivityBadge();
  renderActivity();
}


/* ================================================================
   MODULE 7 · DATA ENTRY HUB
   ================================================================
   The Data Entry page has a hub view with three tabs:
     - "Data Entry"      — Six category cards (Faculty, Student, etc.)
     - "Database"        — Searchable tables of stored records
     - "Recent Activity" — Log of all actions taken this session

   Clicking "Enter Data →" on a card hides the hub and opens a
   dedicated form for that data category. The "← Back" button
   returns to the hub.
   ================================================================ */

/**
 * Switches between the three tabs in the Data Entry hub.
 * @param {string} tab - Tab name: 'entry' | 'database' | 'activity'
 * @param {HTMLElement} btn - The tab button that was clicked
 */
function switchHubTab(tab, btn) {
  // Update the active tab button highlight
  document.querySelectorAll('.de-hub-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Show the matching panel, hide the others
  document.getElementById('de-entry-panel').style.display    = tab === 'entry'    ? 'block' : 'none';
  document.getElementById('de-database-panel').style.display = tab === 'database' ? 'block' : 'none';
  document.getElementById('de-activity-panel').style.display = tab === 'activity' ? 'block' : 'none';

  // Always re-render the activity list when opening that tab,
  // so it reflects the latest entries and filter state
  if (tab === 'activity') renderActivity();
}

// Maps each data entry panel key to a human-readable title and the
// source system that provides the data (shown below the form title)
const DE_FORM_META = {
  'faculty':      { title: 'Faculty Information',    source: 'Source: PIVOT/HR System' },
  'student':      { title: 'Student Information',    source: 'Source: AIMS System' },
  'research':     { title: 'Research & Extension',   source: 'Source: Research & Extension Office / PIVOT' },
  'scholarship':  { title: 'Scholarships',           source: 'Source: Student Affairs / Registrar' },
  'student-load': { title: 'Student Academic Load',  source: 'Source: Registrar / AIMS' },
  'faculty-load': { title: 'Faculty Academic Load',  source: "Source: PIVOT/HR / Dean's Office" },
};

/**
 * Hides the hub view and opens the data entry form for the given panel.
 * @param {string} panel - Panel key (see DE_FORM_META above)
 */
function openDataEntry(panel) {
  // Swap hub ↔ form visibility
  document.getElementById('de-hub').style.display  = 'none';
  document.getElementById('de-form').style.display = 'block';

  // Set the form header title and source system label
  const meta = DE_FORM_META[panel] || {};
  document.getElementById('de-form-title').textContent  = meta.title  || '';
  document.getElementById('de-form-source').textContent = meta.source || '';

  // Activate the correct form panel (e.g. panel-faculty, panel-student)
  document.querySelectorAll('.data-panel').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('panel-' + panel);
  if (target) target.classList.add('active');
}

/**
 * Switches between the four tabs on the Historical Data page:
 * Student Data, Faculty Data, Research Data, Retention Rates.
 * @param {string} tab - 'student' | 'faculty' | 'research' | 'retention'
 * @param {HTMLElement} btn - The tab button that was clicked
 */
function switchHistTab(tab, btn) {
  // Update tab button highlight
  document.querySelectorAll('.hist-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // Show the matching panel, hide the others
  document.querySelectorAll('.hist-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('hist-' + tab);
  if (panel) panel.classList.add('active');
}


/** Returns from the data entry form back to the hub view. */
function closeDataEntry() {
  document.getElementById('de-form').style.display = 'none';
  document.getElementById('de-hub').style.display  = 'block';
}


/* ================================================================
   MODULE 8 · REPORTS
   ================================================================
   The Reports page lets users generate QA reports from stored data.
   There are five report types (Faculty, Student, Scholarships,
   Research & Publication, R&E Personnel). Each has a "Generate
   Report" button that opens a preview panel with export options
   (PDF, Excel, CSV).

   Every generated report is recorded in the "Recent Reports" log
   tab, filterable by report type and export format.

   Note: All data fields show "—" until a backend is connected.
   The report layout and structure are fully in place and ready.
   ================================================================ */

// In-memory list of reports generated this session.
// Each entry: { title, format, date, time, status }
const reportLog = [];

// Title and "no data" subtitle for each report type,
// displayed in the preview panel header
const RPT_META = {
  faculty:     { title: 'Faculty Report',                            sub: 'No data available. Connect a data source to generate this report.' },
  student:     { title: 'Student Report',                            sub: 'No data available. Connect a data source to generate this report.' },
  scholarship: { title: 'Scholarships Report',                       sub: 'No data available. Connect a data source to generate this report.' },
  research:    { title: 'Research &amp; Publication Report',         sub: 'No data available. Connect a data source to generate this report.' },
  personnel:   { title: 'Research &amp; Extension Personnel Report', sub: 'No data available. Connect a data source to generate this report.' },
};

// HTML rendered inside the report document panel for each report type.
// Shows field labels with "—" as placeholder values.
// Replace "—" with live values once a backend data source is connected.
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

// Tracks which report type is currently open in the preview panel,
// so exportReport() knows what to label the export action
let currentRptType = null;

/**
 * Opens the report preview panel for the given report type.
 * Also adds an entry to the recent reports log.
 * @param {string} type - Report key (see RPT_META above)
 */
function generateReport(type) {
  currentRptType = type;
  const meta = RPT_META[type] || {};

  // Populate the preview panel header and document body
  document.getElementById('previewTitle').innerHTML  = meta.title || '';
  document.getElementById('previewSub').textContent  = meta.sub   || '';
  document.getElementById('reportContent').innerHTML = RPT_DOC[type] || '';

  // Swap hub view → preview panel
  document.getElementById('rpt-hub').style.display     = 'none';
  document.getElementById('rpt-preview').style.display = 'block';

  // Record this generation in the report log
  const now = new Date();
  reportLog.unshift({
    title:  (meta.title || 'Report').replace(/&amp;/g, '&'),
    format: '—',  // updated when the user selects an export format
    date:   now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
    time:   now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'Generated',
  });

  updateRptBadge();

  // Update the "Last Generated" metric card in the summary row
  const lastEl = document.getElementById('rpt-last-gen');
  if (lastEl) lastEl.textContent = 'Just now';

  notify('Report generated!', 'create', 'Reports',
    (meta.title || 'Report').replace(/&amp;/g, '&') + ' generated');
}

/**
 * Records the chosen export format on the most recent log entry
 * and shows a confirmation toast.
 * The actual file download would be implemented here once a
 * backend is connected.
 * @param {string} fmt - Export format: 'PDF' | 'Excel' | 'CSV'
 */
function exportReport(fmt) {
  if (!currentRptType) return;
  const meta  = RPT_META[currentRptType] || {};
  const title = (meta.title || 'Report').replace(/&amp;/g, '&');

  // Update the format field on the most recent log entry
  if (reportLog.length > 0) reportLog[0].format = fmt;

  updateRptBadge();
  notify('Exported as ' + fmt + '!', 'export', 'Reports', title + ' exported as ' + fmt);
}

/** Closes the report preview and returns to the reports hub. */
function closeReportPreview() {
  document.getElementById('rpt-preview').style.display = 'none';
  document.getElementById('rpt-hub').style.display     = 'block';
}

/**
 * Switches between the two tabs on the Reports page:
 * "Report Types" (the cards) and "Recent Reports" (the log).
 * @param {string} tab - 'types' | 'log'
 * @param {HTMLElement} btn - The tab button that was clicked
 */
function switchRptTab(tab, btn) {
  document.querySelectorAll('#page-reports .de-hub-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('rpt-types-panel').style.display = tab === 'types' ? 'block' : 'none';
  document.getElementById('rpt-log-panel').style.display   = tab === 'log'   ? 'block' : 'none';
  if (tab === 'log') renderReportLog();
}

/** Updates the numeric badge on the "Recent Reports" tab button. */
function updateRptBadge() {
  const badge = document.getElementById('rpt-badge');
  if (!badge) return;
  badge.textContent   = reportLog.length > 99 ? '99+' : reportLog.length;
  badge.style.display = reportLog.length > 0 ? 'inline-block' : 'none';
}

/**
 * Re-renders the recent reports list based on the current filters.
 * Shows an empty-state message if there are no matching entries.
 */
function renderReportLog() {
  const list  = document.getElementById('rpt-log-list');
  const empty = document.getElementById('rpt-log-empty');
  if (!list || !empty) return;

  const typeFilter = (document.getElementById('rpt-log-filter')?.value || '').toLowerCase();
  const fmtFilter  = (document.getElementById('rpt-fmt-filter')?.value  || '').toLowerCase();

  const filtered = reportLog.filter(r =>
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

/** Clears all entries from the recent reports log. */
function clearReportLog() {
  reportLog.length = 0;
  updateRptBadge();
  renderReportLog();
}


/* ================================================================
   MODULE 9 · NOTIFICATIONS
   ================================================================
   A small toast notification appears at the bottom-right of the
   screen after any significant user action (save, import, export,
   report generation). It disappears automatically after 3.2 seconds.
   If activity logging details are provided, the action is also
   recorded in the activity log automatically.
   ================================================================ */

/**
 * Shows a toast notification and optionally logs the action.
 * @param {string} msg         - The message to display in the toast
 * @param {string} [logType]   - Activity type (e.g. 'create', 'export')
 * @param {string} [logCat]    - Data category (e.g. 'Faculty Information')
 * @param {string} [logDetail] - Full description of what happened
 */
function notify(msg, logType, logCat, logDetail) {
  const n = document.getElementById('notif');
  document.getElementById('notif-text').textContent = msg;
  n.classList.add('show');
  // Auto-dismiss after 3.2 seconds
  setTimeout(() => n.classList.remove('show'), 3200);

  // Log the action if details were provided
  if (logType && logCat && logDetail) logActivity(logType, logCat, logDetail);
}
