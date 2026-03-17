/* ================================================================
   Q-Nekt · Page Template: Data Entry
   ================================================================
   The Data Entry page is the main data management area. It has
   three tabs inside a hub view:

     Data Entry     — Six category cards. Clicking "Enter Data →"
                      on any card opens a dedicated form for that
                      category (Faculty, Student, Research, etc.).
                      Each form has a "← Back" button to return.

     Database       — Shows the stored records in four searchable,
                      filterable tables (Faculty, Students,
                      Scholarships, Research). The "View Records"
                      button on each card links directly here.

     Recent Activity — A timestamped log of all saves, imports,
                       exports, and batch updates performed during
                       the current session. Filterable by action
                       type and data category.

   This file exports a single const (DATA_ENTRY_HTML) containing the full
   HTML for this page. loader.js injects it into the matching slot
   in index.html. All interactive behaviour is handled by app.js.
   ================================================================ */

const DATA_ENTRY_HTML = /* html */`
<!-- ════════════════════════════════════════════════════════════
     PAGE: DATA ENTRY
     Panels: entry-cards · database · activity-log
     ════════════════════════════════════════════════════════════ -->
<!-- ══════════════════ DATA ENTRY ══════════════════ -->
    <div class="page" id="page-data-entry">

      <!-- HUB VIEW -->
      <div id="de-hub">
        <div class="page-hero">
          <div class="page-hero-title">Data Entry Hub</div>
          <div class="page-hero-sub">Manage all QA data — select a category below to begin</div>
        </div>
        <div class="deco-bar"></div>

        <!-- Hub tab switcher -->
        <div class="de-hub-tabs">
          <button class="de-hub-tab active" onclick="switchHubTab('entry', this)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>
            Data Entry
          </button>
          <button class="de-hub-tab" onclick="switchHubTab('database', this)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
            Database
          </button>
          <button class="de-hub-tab" onclick="switchHubTab('activity', this)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Recent Activity
            <span class="de-hub-tab-badge" id="activity-badge" style="display:none;">0</span>
          </button>
        </div>
        <div id="de-entry-panel">
        <div class="de-notice">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <div>
            <div class="de-notice-title">Automatic History Tracking</div>
            <div class="de-notice-sub">All data entries are updated, not overwritten. Change history is automatically maintained for audit trails and version control.</div>
          </div>
        </div>

        <!-- Summary metrics -->
        <div class="de-metrics">
          <div class="de-metric">
            <div class="de-metric-label">Total Records</div>
            <div class="de-metric-value">—</div>
            <div class="de-metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
          </div>
          <div class="de-metric">
            <div class="de-metric-label">This Month</div>
            <div class="de-metric-value">—</div>
            <div class="de-metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg></div>
          </div>
          <div class="de-metric">
            <div class="de-metric-label">History Entries</div>
            <div class="de-metric-value">—</div>
            <div class="de-metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
          </div>
          <div class="de-metric">
            <div class="de-metric-label">Last Update</div>
            <div class="de-metric-value de-metric-value--sm">—</div>
            <div class="de-metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
          </div>
        </div>

        <!-- Entry cards grid -->
        <div class="de-cards">

          <div class="de-card">
            <div class="de-card-header">
              <div class="de-card-icon" style="background:rgba(138,21,56,0.25);">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--header2)" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
              </div>
              <div>
                <div class="de-card-title">Faculty Information</div>
                <div class="de-card-desc">Basic faculty information, educational background, research &amp; extension activities, administrative positions and their effectivity</div>
              </div>
            </div>
            <div class="de-card-sections">
              <div class="de-section-label">Data Sections:</div>
              <div class="de-section-item"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Basic Faculty Information</div>
              <div class="de-section-item"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Educational Background</div>
              <div class="de-section-item"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Research &amp; Extension Activities</div>
              <div class="de-section-item"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Administrative Positions &amp; Effectivity</div>
            </div>
            <div class="de-card-footer">
              <div class="de-card-stats">
                <div><div class="de-stat-label">Total Records</div><div class="de-stat-val">—</div></div>
                <div><div class="de-stat-label">Last Entry</div><div class="de-stat-val">—</div></div>
              </div>
              <div class="de-card-actions">
                <button class="de-btn-enter" onclick="openDataEntry('faculty')">Enter Data →</button>
                <button class="de-btn-icon" title="View Records" onclick="viewDbRecords('fac')">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div class="de-card">
            <div class="de-card-header">
              <div class="de-card-icon" style="background:rgba(14,96,33,0.2);">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--green2)" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              </div>
              <div>
                <div class="de-card-title">Student Information</div>
                <div class="de-card-desc">Basic student information, degree program, classification, and demographic data</div>
              </div>
            </div>
            <div class="de-card-sections">
              <div class="de-section-label">Data Sections:</div>
              <div class="de-section-item"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Basic Student Information</div>
              <div class="de-section-item"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Degree Program &amp; Major</div>
              <div class="de-section-item"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Student Classification</div>
              <div class="de-section-item"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Contact &amp; Demographic Data</div>
            </div>
            <div class="de-card-footer">
              <div class="de-card-stats">
                <div><div class="de-stat-label">Total Records</div><div class="de-stat-val">—</div></div>
                <div><div class="de-stat-label">Last Entry</div><div class="de-stat-val">—</div></div>
              </div>
              <div class="de-card-actions">
                <button class="de-btn-enter" onclick="openDataEntry('student')">Enter Data →</button>
                <button class="de-btn-icon" title="View Records" onclick="viewDbRecords('stu')">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div class="de-card">
            <div class="de-card-header">
              <div class="de-card-icon" style="background:rgba(246,172,29,0.15);">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
              </div>
              <div>
                <div class="de-card-title">Faculty Academic Load</div>
                <div class="de-card-desc">Faculty teaching loads, credit units, and course assignments per semester and trimester</div>
              </div>
            </div>
            <div class="de-card-sections">
              <div class="de-section-label">Data Sections:</div>
              <div class="de-section-item"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Semester / Trimester Period</div>
              <div class="de-section-item"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Undergraduate Teaching Load</div>
              <div class="de-section-item"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Graduate Teaching Load</div>
              <div class="de-section-item"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Research &amp; Administrative Load</div>
            </div>
            <div class="de-card-footer">
              <div class="de-card-stats">
                <div><div class="de-stat-label">Total Records</div><div class="de-stat-val">—</div></div>
                <div><div class="de-stat-label">Last Entry</div><div class="de-stat-val">—</div></div>
              </div>
              <div class="de-card-actions">
                <button class="de-btn-enter" onclick="openDataEntry('faculty-load')">Enter Data →</button>
                <button class="de-btn-icon" title="View Records" onclick="viewDbRecords('fac')">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div class="de-card">
            <div class="de-card-header">
              <div class="de-card-icon" style="background:rgba(58,123,213,0.15);">
                <svg viewBox="0 0 24 24" fill="none" stroke="#3a7bd5" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              </div>
              <div>
                <div class="de-card-title">Student Academic Load</div>
                <div class="de-card-desc">Student enrollment loads, credit units per semester, and academic performance data</div>
              </div>
            </div>
            <div class="de-card-sections">
              <div class="de-section-label">Data Sections:</div>
              <div class="de-section-item"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Semester / Academic Year</div>
              <div class="de-section-item"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Total Units Enrolled</div>
              <div class="de-section-item"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> GWA &amp; Performance</div>
              <div class="de-section-item"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Load Status</div>
            </div>
            <div class="de-card-footer">
              <div class="de-card-stats">
                <div><div class="de-stat-label">Total Records</div><div class="de-stat-val">—</div></div>
                <div><div class="de-stat-label">Last Entry</div><div class="de-stat-val">—</div></div>
              </div>
              <div class="de-card-actions">
                <button class="de-btn-enter" onclick="openDataEntry('student-load')">Enter Data →</button>
                <button class="de-btn-icon" title="View Records" onclick="viewDbRecords('stu')">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div class="de-card">
            <div class="de-card-header">
              <div class="de-card-icon" style="background:rgba(138,21,56,0.18);">
                <svg viewBox="0 0 24 24" fill="none" stroke="#e87093" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <div>
                <div class="de-card-title">Research &amp; Extension</div>
                <div class="de-card-desc">Research personnel, project details, funding, publications, and extension activities</div>
              </div>
            </div>
            <div class="de-card-sections">
              <div class="de-section-label">Data Sections:</div>
              <div class="de-section-item"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Personnel &amp; Role</div>
              <div class="de-section-item"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Project Title &amp; Duration</div>
              <div class="de-section-item"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Funding Agency &amp; Budget</div>
              <div class="de-section-item"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Project Status</div>
            </div>
            <div class="de-card-footer">
              <div class="de-card-stats">
                <div><div class="de-stat-label">Total Records</div><div class="de-stat-val">—</div></div>
                <div><div class="de-stat-label">Last Entry</div><div class="de-stat-val">—</div></div>
              </div>
              <div class="de-card-actions">
                <button class="de-btn-enter" onclick="openDataEntry('research')">Enter Data →</button>
                <button class="de-btn-icon" title="View Records" onclick="viewDbRecords('res')">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div class="de-card">
            <div class="de-card-header">
              <div class="de-card-icon" style="background:rgba(246,172,29,0.12);">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><circle cx="12" cy="10" r="2"/></svg>
              </div>
              <div>
                <div class="de-card-title">Scholarships</div>
                <div class="de-card-desc">Scholarship grantees, funding programs, grant types, amounts, and award status</div>
              </div>
            </div>
            <div class="de-card-sections">
              <div class="de-section-label">Data Sections:</div>
              <div class="de-section-item"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Grantee Information</div>
              <div class="de-section-item"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Scholarship Program &amp; Type</div>
              <div class="de-section-item"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Grant Amount &amp; Academic Year</div>
              <div class="de-section-item"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Award Status</div>
            </div>
            <div class="de-card-footer">
              <div class="de-card-stats">
                <div><div class="de-stat-label">Total Records</div><div class="de-stat-val">—</div></div>
                <div><div class="de-stat-label">Last Entry</div><div class="de-stat-val">—</div></div>
              </div>
              <div class="de-card-actions">
                <button class="de-btn-enter" onclick="openDataEntry('scholarship')">Enter Data →</button>
                <button class="de-btn-icon" title="View Records" onclick="viewDbRecords('sch')">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </button>
              </div>
            </div>
          </div>

        </div><!-- /de-cards -->
        </div><!-- /de-entry-panel -->

        <!-- ── RECENT ACTIVITY PANEL ── -->
        <div id="de-activity-panel" style="display:none;">
          <div class="act-toolbar">
            <div style="display:flex;gap:8px;flex-wrap:wrap;flex:1;">
              <select id="act-filter-type" class="act-filter" onchange="renderActivity()">
                <option value="">All Types</option>
                <option value="update">Update</option>
                <option value="batch">Batch Update</option>
                <option value="import">Import</option>
                <option value="export">Export</option>
                <option value="create">New Record</option>
              </select>
              <select id="act-filter-cat" class="act-filter" onchange="renderActivity()">
                <option value="">All Categories</option>
                <option value="Faculty Information">Faculty Information</option>
                <option value="Student Information">Student Information</option>
                <option value="Faculty Academic Load">Faculty Academic Load</option>
                <option value="Student Academic Load">Student Academic Load</option>
                <option value="Research &amp; Extension">Research &amp; Extension</option>
                <option value="Scholarships">Scholarships</option>
              </select>
            </div>
            <button class="btn btn-ghost" style="font-size:12px;" onclick="clearActivityLog()">Clear Log</button>
          </div>

          <div class="act-empty" id="act-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <div>No activity recorded yet.</div>
            <div style="font-size:12px;color:var(--muted);margin-top:4px;">Actions such as saves, imports, exports, and batch updates will appear here.</div>
          </div>

          <div class="act-list" id="act-list"></div>
        </div><!-- /de-activity-panel -->

        <!-- ── DATABASE PANEL ── -->
        <div id="de-database-panel" style="display:none;">
          <div class="page-hero" style="margin-bottom:0.5rem;">
            <div class="page-hero-title" style="font-size:20px;">Data Processing &amp; Storage</div>
            <div class="page-hero-sub">Searchable and filterable database of all collected records</div>
          </div>
          <div class="deco-bar"></div>
          <div class="tabs-local">
            <button class="tab-btn active" onclick="showDbTab('fac',this)">Faculty</button>
            <button class="tab-btn" onclick="showDbTab('stu',this)">Students</button>
            <button class="tab-btn" onclick="showDbTab('sch',this)">Scholarships</button>
            <button class="tab-btn" onclick="showDbTab('res',this)">Research</button>
          </div>
          <div style="display:flex;gap:10px;margin-bottom:1rem;flex-wrap:wrap;align-items:center;">
            <input type="text" placeholder="🔍 Search records..." style="flex:1;min-width:200px;"/>
            <select id="db-status-filter" style="width:160px;">
              <option value="">All Status</option>
              <option>Active</option>
              <option>On Leave</option>
              <option>Retired</option>
            </select>
            <button class="btn btn-gold" onclick="notify('Exported as CSV!', 'export', 'Database', 'Records exported as CSV')">↓ Export CSV</button>
            <button class="btn btn-green" onclick="notify('Exported as XLSX!', 'export', 'Database', 'Records exported as XLSX')">↓ Export XLSX</button>
          </div>
          <div class="table-wrap" id="db-fac">
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Rank</th><th>Attainment</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td colspan="6" style="text-align:center;padding:2.5rem;color:var(--muted);font-size:13px;">No records found. Add entries through the Data Entry tab.</td></tr>
              </tbody>
            </table>
          </div>
          <div class="table-wrap" id="db-stu" style="display:none;">
            <table>
              <thead><tr><th>Student ID</th><th>Name</th><th>Program</th><th>Year Level</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td colspan="5" style="text-align:center;padding:2.5rem;color:var(--muted);font-size:13px;">No records found. Add entries through the Data Entry tab.</td></tr>
              </tbody>
            </table>
          </div>
          <div class="table-wrap" id="db-sch" style="display:none;">
            <table>
              <thead><tr><th>Scholarship ID</th><th>Student</th><th>Program</th><th>Type</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td colspan="6" style="text-align:center;padding:2.5rem;color:var(--muted);font-size:13px;">No records found. Add entries through the Data Entry tab.</td></tr>
              </tbody>
            </table>
          </div>
          <div class="table-wrap" id="db-res" style="display:none;">
            <table>
              <thead><tr><th>Personnel ID</th><th>Name</th><th>Role</th><th>Project</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td colspan="5" style="text-align:center;padding:2.5rem;color:var(--muted);font-size:13px;">No records found. Add entries through the Data Entry tab.</td></tr>
              </tbody>
            </table>
          </div>
          <div style="margin-top:0.8rem;font-size:12px;color:var(--muted);">No records found · Add data through the Data Entry tab</div>
        </div><!-- /de-database-panel -->

      </div><!-- /de-hub -->

      <!-- FORM VIEW (shown when Enter Data is clicked) -->
      <div id="de-form" style="display:none;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:1.4rem;">
          <button class="btn btn-ghost" style="padding:6px 14px;" onclick="closeDataEntry()">← Back</button>
          <div>
            <div class="page-hero-title" id="de-form-title" style="font-size:20px;"></div>
            <div class="page-hero-sub" id="de-form-source" style="margin-top:2px;"></div>
          </div>
        </div>
        <div class="deco-bar"></div>

        <div class="data-panel active" id="panel-faculty">
          <div class="form-grid">
            <div class="form-group"><label>Faculty ID</label><input type="text" placeholder=""/></div>
            <div class="form-group"><label>Full Name</label><input type="text" placeholder=""/></div>
            <div class="form-group"><label>Department / College</label><input type="text" placeholder=""/></div>
            <div class="form-group"><label>Rank / Designation</label><select><option>-- Select --</option><option>Instructor I</option><option>Assistant Professor I</option><option>Associate Professor I</option><option>Professor I</option><option>University Professor</option></select></div>
            <div class="form-group"><label>Employment Status</label><select><option>Regular</option><option>Contractual</option><option>Part-time</option><option>Visiting</option></select></div>
            <div class="form-group"><label>Highest Educational Attainment</label><select><option>Bachelor's Degree</option><option>Master's Degree</option><option>Doctoral Degree</option><option>Post-Doctoral</option></select></div>
            <div class="form-group"><label>Years in Service</label><input type="number" placeholder="" min="0"/></div>
            <div class="form-group"><label>Specialization</label><input type="text" placeholder=""/></div>
            <div class="form-group full"><label>Remarks</label><textarea placeholder=""></textarea></div>
          </div>
          <div class="btn-row">
            <button class="btn btn-primary" onclick="notify('Record saved!', 'create', 'Faculty Information', 'New Faculty Information record saved')">+ Save Record</button>
            <button class="btn btn-ghost">Clear Form</button>
            <button class="btn btn-green" onclick="notify('Imported from PIVOT/HR!', 'import', 'Faculty Information', 'Batch import from PIVOT/HR System')">↓ Import from PIVOT/HR</button>
          </div>
        </div>

        <div class="data-panel" id="panel-student">
          <div class="form-grid">
            <div class="form-group"><label>Student ID</label><input type="text" placeholder=""/></div>
            <div class="form-group"><label>Full Name</label><input type="text" placeholder=""/></div>
            <div class="form-group"><label>Program / Course</label><input type="text" placeholder=""/></div>
            <div class="form-group"><label>Year Level</label><select><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option><option>Graduate</option></select></div>
            <div class="form-group"><label>Enrollment Status</label><select><option>Regular</option><option>Irregular</option><option>Cross Enrollee</option><option>Returnee</option></select></div>
            <div class="form-group"><label>Sex</label><select><option>Male</option><option>Female</option><option>Prefer not to say</option></select></div>
            <div class="form-group"><label>Date of Birth</label><input type="date"/></div>
            <div class="form-group"><label>Contact Number</label><input type="text" placeholder=""/></div>
            <div class="form-group full"><label>Address</label><textarea placeholder="" style="min-height:56px;"></textarea></div>
          </div>
          <div class="btn-row">
            <button class="btn btn-primary" onclick="notify('Record saved!', 'create', 'Student Information', 'New Student Information record saved')">+ Save Record</button>
            <button class="btn btn-ghost">Clear Form</button>
            <button class="btn btn-green" onclick="notify('Imported from AIMS!', 'import', 'Student Information', 'Batch import from AIMS System')">↓ Import from AIMS</button>
          </div>
        </div>

        <div class="data-panel" id="panel-research">
          <div class="form-grid">
            <div class="form-group"><label>Personnel ID</label><input type="text" placeholder=""/></div>
            <div class="form-group"><label>Full Name</label><input type="text" placeholder=""/></div>
            <div class="form-group"><label>Role</label><select><option>Lead Researcher</option><option>Co-Researcher</option><option>Research Assistant</option><option>Extension Coordinator</option></select></div>
            <div class="form-group"><label>Project Title</label><input type="text" placeholder=""/></div>
            <div class="form-group"><label>Funding Agency</label><input type="text" placeholder=""/></div>
            <div class="form-group"><label>Project Duration</label><input type="text" placeholder=""/></div>
            <div class="form-group"><label>Status</label><select><option>Ongoing</option><option>Completed</option><option>On Hold</option><option>Proposed</option></select></div>
            <div class="form-group"><label>Budget (PHP)</label><input type="number" placeholder=""/></div>
          </div>
          <div class="btn-row">
            <button class="btn btn-primary" onclick="notify('Record saved!', 'create', 'Research & Extension', 'New Research & Extension record saved')">+ Save Record</button>
            <button class="btn btn-ghost">Clear Form</button>
          </div>
        </div>

        <div class="data-panel" id="panel-scholarship">
          <div class="form-grid">
            <div class="form-group"><label>Scholarship ID</label><input type="text" placeholder=""/></div>
            <div class="form-group"><label>Student Name</label><input type="text" placeholder=""/></div>
            <div class="form-group"><label>Student ID</label><input type="text" placeholder=""/></div>
            <div class="form-group"><label>Scholarship Program</label><select><option>CHED Scholarship</option><option>DOST-SEI</option><option>LGU Scholarship</option><option>Institutional Grant</option><option>Private Benefactor</option></select></div>
            <div class="form-group"><label>Scholarship Type</label><select><option>Full Grant</option><option>Partial Grant</option><option>Stipend Only</option></select></div>
            <div class="form-group"><label>Grant Amount (PHP)</label><input type="number" placeholder=""/></div>
            <div class="form-group"><label>Academic Year</label><input type="text" placeholder=""/></div>
            <div class="form-group"><label>Status</label><select><option>Active</option><option>Terminated</option><option>On Probation</option><option>Completed</option></select></div>
          </div>
          <div class="btn-row">
            <button class="btn btn-primary" onclick="notify('Record saved!', 'create', 'Scholarships', 'New Scholarships record saved')">+ Save Record</button>
            <button class="btn btn-ghost">Clear Form</button>
          </div>
        </div>

        <div class="data-panel" id="panel-student-load">
          <div class="form-grid">
            <div class="form-group"><label>Student ID</label><input type="text" placeholder=""/></div>
            <div class="form-group"><label>Student Name</label><input type="text" placeholder=""/></div>
            <div class="form-group"><label>Academic Year</label><input type="text" placeholder=""/></div>
            <div class="form-group"><label>Semester</label><select><option>1st Semester</option><option>2nd Semester</option><option>Summer</option></select></div>
            <div class="form-group"><label>Total Units Enrolled</label><input type="number" placeholder="" min="0" max="30"/></div>
            <div class="form-group"><label>No. of Subjects</label><input type="number" placeholder="" min="0"/></div>
            <div class="form-group"><label>GWA (Previous Semester)</label><input type="number" step="0.01" placeholder=""/></div>
            <div class="form-group"><label>Load Status</label><select><option>Regular Load</option><option>Overload</option><option>Underload</option></select></div>
          </div>
          <div class="btn-row">
            <button class="btn btn-primary" onclick="notify('Record saved!', 'create', 'Student Academic Load', 'New Student Academic Load record saved')">+ Save Record</button>
            <button class="btn btn-ghost">Clear Form</button>
          </div>
        </div>

        <div class="data-panel" id="panel-faculty-load">
          <div class="form-grid">
            <div class="form-group"><label>Faculty ID</label><input type="text" placeholder=""/></div>
            <div class="form-group"><label>Faculty Name</label><input type="text" placeholder=""/></div>
            <div class="form-group"><label>Academic Year</label><input type="text" placeholder=""/></div>
            <div class="form-group"><label>Semester</label><select><option>1st Semester</option><option>2nd Semester</option><option>Summer</option></select></div>
            <div class="form-group"><label>Teaching Units</label><input type="number" placeholder="" min="0"/></div>
            <div class="form-group"><label>Research Units</label><input type="number" placeholder="" min="0"/></div>
            <div class="form-group"><label>Extension Units</label><input type="number" placeholder="" min="0"/></div>
            <div class="form-group"><label>Admin Units</label><input type="number" placeholder="" min="0"/></div>
            <div class="form-group"><label>No. of Classes Handled</label><input type="number" placeholder="" min="0"/></div>
            <div class="form-group"><label>Total Workload Units</label><input type="number" placeholder="" min="0"/></div>
          </div>
          <div class="btn-row">
            <button class="btn btn-primary" onclick="notify('Record saved!', 'create', 'Faculty Academic Load', 'New Faculty Academic Load record saved')">+ Save Record</button>
            <button class="btn btn-ghost">Clear Form</button>
          </div>
        </div>

      </div><!-- /de-form -->
    </div>
`;
