/* ================================================================
   Q-Nekt · Page Template: Reports
   ================================================================
   The Reports page lets QA staff generate standardised reports
   from the collected data. It has two tabs:

     Report Types   — Five report cards. Clicking "Generate Report"
                      opens a preview panel showing the report
                      structure with export buttons (PDF, Excel,
                      CSV). All values show "—" until data is
                      connected.

     Recent Reports — A log of all reports generated this session,
                      showing the report type, export format chosen,
                      and timestamp. Filterable by type and format.

   This file exports a single const (REPORTS_HTML) containing the full
   HTML for this page. loader.js injects it into the matching slot
   in index.html. All interactive behaviour is handled by app.js.
   ================================================================ */

const REPORTS_HTML = /* html */`
<!-- ════════════════════════════════════════════════════════════
     PAGE: REPORTS
     Panels: report-types · recent-reports-log
     ════════════════════════════════════════════════════════════ -->
<!-- ══════════════════ REPORTS ══════════════════ -->
    <div class="page" id="page-reports">

      <!-- REPORTS HUB -->
      <div id="rpt-hub">
        <div class="page-hero">
          <div class="page-hero-title">Reports</div>
          <div class="page-hero-sub">Generate quality assurance reports from collected data</div>
        </div>
        <div class="deco-bar"></div>

        <!-- Report tabs -->
        <div class="de-hub-tabs">
          <button class="de-hub-tab active" onclick="switchRptTab('types', this)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Report Types
          </button>
          <button class="de-hub-tab" onclick="switchRptTab('log', this)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Recent Reports
            <span class="de-hub-tab-badge" id="rpt-badge" style="display:none;">0</span>
          </button>
        </div>

        <!-- ── REPORT TYPES PANEL ── -->
        <div id="rpt-types-panel">
          <!-- Summary metrics -->
          <div class="de-metrics" style="margin-bottom:1.8rem;">
            <div class="de-metric">
              <div class="de-metric-label">Report Types</div>
              <div class="de-metric-value">5</div>
              <div class="de-metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
            </div>
            <div class="de-metric">
              <div class="de-metric-label">Generated This Month</div>
              <div class="de-metric-value">—</div>
              <div class="de-metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
            </div>
            <div class="de-metric">
              <div class="de-metric-label">Export Formats</div>
              <div class="de-metric-value">3</div>
              <div class="de-metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg></div>
            </div>
            <div class="de-metric">
              <div class="de-metric-label">Last Generated</div>
              <div class="de-metric-value de-metric-value--sm" id="rpt-last-gen">—</div>
              <div class="de-metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
            </div>
          </div>

          <div style="font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:1rem;">Report Types</div>

          <!-- Report cards grid -->
          <div class="rpt-cards">

            <div class="rpt-card">
              <div class="rpt-card-header">
                <div class="rpt-card-icon" style="background:rgba(138,21,56,0.25);">
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--header2)" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                </div>
                <div>
                  <div class="rpt-card-title">Faculty Report</div>
                  <div class="rpt-card-desc">Comprehensive faculty data including basic information, educational background, research &amp; extension activities, and administrative positions</div>
                </div>
              </div>
              <div class="rpt-sections">
                <div class="rpt-section-label">Report Sections:</div>
                <div class="rpt-tags">
                  <span class="rpt-tag">Basic Faculty Information</span>
                  <span class="rpt-tag">Educational Background</span>
                  <span class="rpt-tag">Research Activities</span>
                  <span class="rpt-tag">Extension Activities</span>
                  <span class="rpt-tag">Administrative Positions</span>
                  <span class="rpt-tag">Teaching Load</span>
                </div>
              </div>
              <div class="rpt-formats">
                <div class="rpt-section-label">Export Formats: <span style="font-size:10px;color:var(--muted);font-weight:400;text-transform:none;letter-spacing:0;">— click to generate directly</span></div>
                <div class="rpt-format-tags">
                  <span class="rpt-format rpt-format-btn" onclick="quickGenerateReport('faculty','PDF')" title="Generate & export as PDF">PDF</span>
                  <span class="rpt-format rpt-format-btn" onclick="quickGenerateReport('faculty','Excel')" title="Generate & export as Excel">Excel</span>
                  <span class="rpt-format rpt-format-btn" onclick="quickGenerateReport('faculty','CSV')" title="Generate & export as CSV">CSV</span>
                </div>
              </div>
              <div class="rpt-card-actions">
              <button class="rpt-btn-generate" onclick="generateReport('faculty')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Generate Report
              </button>
              <button class="de-btn-icon" title="Enter Data" onclick="goToDataEntry('faculty')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>
              </button>
              </div>
            </div>
            <div class="rpt-card">
              <div class="rpt-card-header">
                <div class="rpt-card-icon" style="background:rgba(14,96,33,0.2);">
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--green2)" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                </div>
                <div>
                  <div class="rpt-card-title">Student Report</div>
                  <div class="rpt-card-desc">Student enrollment, academic performance, classification, and degree program information</div>
                </div>
              </div>
              <div class="rpt-sections">
                <div class="rpt-section-label">Report Sections:</div>
                <div class="rpt-tags">
                  <span class="rpt-tag">Basic Student Information</span>
                  <span class="rpt-tag">Degree Program &amp; Major</span>
                  <span class="rpt-tag">Student Classification</span>
                  <span class="rpt-tag">Academic Load</span>
                  <span class="rpt-tag">Academic Status</span>
                  <span class="rpt-tag">Completion Rates</span>
                </div>
              </div>
              <div class="rpt-formats">
                <div class="rpt-section-label">Export Formats: <span style="font-size:10px;color:var(--muted);font-weight:400;text-transform:none;letter-spacing:0;">— click to generate directly</span></div>
                <div class="rpt-format-tags">
                  <span class="rpt-format rpt-format-btn" onclick="quickGenerateReport('student','PDF')" title="Generate & export as PDF">PDF</span>
                  <span class="rpt-format rpt-format-btn" onclick="quickGenerateReport('student','Excel')" title="Generate & export as Excel">Excel</span>
                  <span class="rpt-format rpt-format-btn" onclick="quickGenerateReport('student','CSV')" title="Generate & export as CSV">CSV</span>
                </div>
              </div>
              <div class="rpt-card-actions">
              <button class="rpt-btn-generate" onclick="generateReport('student')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Generate Report
              </button>
              <button class="de-btn-icon" title="Enter Data" onclick="goToDataEntry('student')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>
              </button>
              </div>
            </div>
            <div class="rpt-card">
              <div class="rpt-card-header">
                <div class="rpt-card-icon" style="background:rgba(246,172,29,0.15);">
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
                </div>
                <div>
                  <div class="rpt-card-title">Faculty Academic Load Report</div>
                  <div class="rpt-card-desc">Faculty teaching loads, credit units, research and administrative load per semester and academic year</div>
                </div>
              </div>
              <div class="rpt-sections">
                <div class="rpt-section-label">Report Sections:</div>
                <div class="rpt-tags">
                  <span class="rpt-tag">Semester / Trimester Period</span>
                  <span class="rpt-tag">Teaching Units</span>
                  <span class="rpt-tag">Research Units</span>
                  <span class="rpt-tag">Extension Units</span>
                  <span class="rpt-tag">Admin Units</span>
                  <span class="rpt-tag">Total Workload</span>
                </div>
              </div>
              <div class="rpt-formats">
                <div class="rpt-section-label">Export Formats: <span style="font-size:10px;color:var(--muted);font-weight:400;text-transform:none;letter-spacing:0;">— click to generate directly</span></div>
                <div class="rpt-format-tags">
                  <span class="rpt-format rpt-format-btn" onclick="quickGenerateReport('faculty-load','PDF')">PDF</span>
                  <span class="rpt-format rpt-format-btn" onclick="quickGenerateReport('faculty-load','Excel')">Excel</span>
                  <span class="rpt-format rpt-format-btn" onclick="quickGenerateReport('faculty-load','CSV')">CSV</span>
                </div>
              </div>
              <div class="rpt-card-actions">
              <button class="rpt-btn-generate" onclick="generateReport('faculty-load')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Generate Report
              </button>
              <button class="de-btn-icon" title="Enter Data" onclick="goToDataEntry('faculty-load')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>
              </button>
              </div>
            </div>
            <div class="rpt-card">
              <div class="rpt-card-header">
                <div class="rpt-card-icon" style="background:rgba(58,123,213,0.15);">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#3a7bd5" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                </div>
                <div>
                  <div class="rpt-card-title">Student Academic Load Report</div>
                  <div class="rpt-card-desc">Student enrollment loads, credit units per semester, GWA, and academic performance data</div>
                </div>
              </div>
              <div class="rpt-sections">
                <div class="rpt-section-label">Report Sections:</div>
                <div class="rpt-tags">
                  <span class="rpt-tag">Semester / Academic Year</span>
                  <span class="rpt-tag">Total Units Enrolled</span>
                  <span class="rpt-tag">Number of Subjects</span>
                  <span class="rpt-tag">GWA &amp; Performance</span>
                  <span class="rpt-tag">Load Status</span>
                </div>
              </div>
              <div class="rpt-formats">
                <div class="rpt-section-label">Export Formats: <span style="font-size:10px;color:var(--muted);font-weight:400;text-transform:none;letter-spacing:0;">— click to generate directly</span></div>
                <div class="rpt-format-tags">
                  <span class="rpt-format rpt-format-btn" onclick="quickGenerateReport('student-load','PDF')">PDF</span>
                  <span class="rpt-format rpt-format-btn" onclick="quickGenerateReport('student-load','Excel')">Excel</span>
                  <span class="rpt-format rpt-format-btn" onclick="quickGenerateReport('student-load','CSV')">CSV</span>
                </div>
              </div>
              <div class="rpt-card-actions">
              <button class="rpt-btn-generate" onclick="generateReport('student-load')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Generate Report
              </button>
              <button class="de-btn-icon" title="Enter Data" onclick="goToDataEntry('student-load')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>
              </button>
              </div>
            </div>
            <div class="rpt-card">
              <div class="rpt-card-header">
                <div class="rpt-card-icon" style="background:rgba(58,123,213,0.15);">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#3a7bd5" stroke-width="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
                </div>
                <div>
                  <div class="rpt-card-title">Research &amp; Publication Report</div>
                  <div class="rpt-card-desc">Research and extension activities, publications, presentations, patents, and community service</div>
                </div>
              </div>
              <div class="rpt-sections">
                <div class="rpt-section-label">Report Sections:</div>
                <div class="rpt-tags">
                  <span class="rpt-tag">Research Projects</span>
                  <span class="rpt-tag">Publications</span>
                  <span class="rpt-tag">Presentations</span>
                  <span class="rpt-tag">Community Service</span>
                  <span class="rpt-tag">Funding &amp; Budget</span>
                </div>
              </div>
              <div class="rpt-formats">
                <div class="rpt-section-label">Export Formats: <span style="font-size:10px;color:var(--muted);font-weight:400;text-transform:none;letter-spacing:0;">— click to generate directly</span></div>
                <div class="rpt-format-tags">
                  <span class="rpt-format rpt-format-btn" onclick="quickGenerateReport('research','PDF')" title="Generate & export as PDF">PDF</span>
                  <span class="rpt-format rpt-format-btn" onclick="quickGenerateReport('research','Excel')" title="Generate & export as Excel">Excel</span>
                  <span class="rpt-format rpt-format-btn" onclick="quickGenerateReport('research','CSV')" title="Generate & export as CSV">CSV</span>
                </div>
              </div>
              <div class="rpt-card-actions">
              <button class="rpt-btn-generate" onclick="generateReport('research')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Generate Report
              </button>
              <button class="de-btn-icon" title="Enter Data" onclick="goToDataEntry('research')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>
              </button>
              </div>
            </div>
            <div class="rpt-card">
              <div class="rpt-card-header">
                <div class="rpt-card-icon" style="background:rgba(138,21,56,0.18);">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#e87093" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                </div>
                <div>
                  <div class="rpt-card-title">Research &amp; Extension Personnel Report</div>
                  <div class="rpt-card-desc">Personnel information, roles, expertise, research contributions, and extension activities</div>
                </div>
              </div>
              <div class="rpt-sections">
                <div class="rpt-section-label">Report Sections:</div>
                <div class="rpt-tags">
                  <span class="rpt-tag">Personnel Profile</span>
                  <span class="rpt-tag">Role &amp; Designation</span>
                  <span class="rpt-tag">Research Contributions</span>
                  <span class="rpt-tag">Extension Activities</span>
                  <span class="rpt-tag">Project Assignments</span>
                </div>
              </div>
              <div class="rpt-formats">
                <div class="rpt-section-label">Export Formats: <span style="font-size:10px;color:var(--muted);font-weight:400;text-transform:none;letter-spacing:0;">— click to generate directly</span></div>
                <div class="rpt-format-tags">
                  <span class="rpt-format rpt-format-btn" onclick="quickGenerateReport('personnel','PDF')" title="Generate & export as PDF">PDF</span>
                  <span class="rpt-format rpt-format-btn" onclick="quickGenerateReport('personnel','Excel')" title="Generate & export as Excel">Excel</span>
                  <span class="rpt-format rpt-format-btn" onclick="quickGenerateReport('personnel','CSV')" title="Generate & export as CSV">CSV</span>
                </div>
              </div>
              <div class="rpt-card-actions">
              <button class="rpt-btn-generate" onclick="generateReport('personnel')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Generate Report
              </button>
              <button class="de-btn-icon" title="Enter Data" onclick="goToDataEntry('research')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>
              </button>
              </div>
            </div>
            <div class="rpt-card">
              <div class="rpt-card-header">
                <div class="rpt-card-icon" style="background:rgba(246,172,29,0.15);">
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><circle cx="12" cy="10" r="2"/></svg>
                </div>
                <div>
                  <div class="rpt-card-title">Scholarships Report</div>
                  <div class="rpt-card-desc">Active grantees, funding agency breakdown, scholarship types, grant amounts, and award status</div>
                </div>
              </div>
              <div class="rpt-sections">
                <div class="rpt-section-label">Report Sections:</div>
                <div class="rpt-tags">
                  <span class="rpt-tag">Grantee Information</span>
                  <span class="rpt-tag">Scholarship Program</span>
                  <span class="rpt-tag">Grant Type &amp; Amount</span>
                  <span class="rpt-tag">Funding Agency</span>
                  <span class="rpt-tag">Award Status</span>
                </div>
              </div>
              <div class="rpt-formats">
                <div class="rpt-section-label">Export Formats: <span style="font-size:10px;color:var(--muted);font-weight:400;text-transform:none;letter-spacing:0;">— click to generate directly</span></div>
                <div class="rpt-format-tags">
                  <span class="rpt-format rpt-format-btn" onclick="quickGenerateReport('scholarship','PDF')" title="Generate & export as PDF">PDF</span>
                  <span class="rpt-format rpt-format-btn" onclick="quickGenerateReport('scholarship','Excel')" title="Generate & export as Excel">Excel</span>
                  <span class="rpt-format rpt-format-btn" onclick="quickGenerateReport('scholarship','CSV')" title="Generate & export as CSV">CSV</span>
                </div>
              </div>
              <div class="rpt-card-actions">
              <button class="rpt-btn-generate" onclick="generateReport('scholarship')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Generate Report
              </button>
              <button class="de-btn-icon" title="Enter Data" onclick="goToDataEntry('scholarship')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>
              </button>
              </div>
            </div>
          </div><!-- /rpt-cards -->
        </div><!-- /rpt-types-panel -->

        <!-- ── RECENT REPORTS LOG ── -->
        <div id="rpt-log-panel" style="display:none;">
          <div class="act-toolbar">
            <div style="display:flex;gap:8px;flex-wrap:wrap;flex:1;">
              <select id="rpt-log-filter" class="act-filter" onchange="renderReportLog()">
                <option value="">All Report Types</option>
                <option>Faculty Report</option>
                <option>Student Report</option>
                <option>Scholarships Report</option>
                <option>Research &amp; Publication Report</option>
                <option>Research &amp; Extension Personnel Report</option>
              </select>
              <select id="rpt-fmt-filter" class="act-filter" onchange="renderReportLog()">
                <option value="">All Formats</option>
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
              </select>
            </div>
            <button class="btn btn-gold" style="font-size:12px;" onclick="clearReportLog()">Clear Log</button>
          </div>

          <div class="act-empty" id="rpt-log-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <div>No reports generated yet.</div>
            <div style="font-size:12px;color:var(--muted);margin-top:4px;">Reports you generate will appear here with their export details and timestamps.</div>
          </div>

          <div class="act-list" id="rpt-log-list"></div>
        </div><!-- /rpt-log-panel -->

      </div><!-- /rpt-hub -->

      <!-- REPORT PREVIEW -->
      <div id="rpt-preview" style="display:none;">

        <!-- Header: back button + report title -->
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:1.4rem;">
          <button class="btn btn-ghost" style="padding:6px 14px;" onclick="closeReportPreview()">← Back</button>
          <div>
            <div class="page-hero-title" id="previewTitle" style="font-size:20px;"></div>
            <div class="page-hero-sub" id="previewSub" style="margin-top:2px;"></div>
          </div>
        </div>
        <div class="deco-bar"></div>

        <!-- Format switcher tabs -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:10px;">
          <div style="display:flex;gap:4px;">
            <div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:0.7px;font-weight:600;align-self:center;margin-right:8px;">Preview as:</div>
            <button class="rpt-fmt-tab active" id="fmt-tab-PDF"   onclick="switchPreviewFormat('PDF',   this)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px;"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              PDF
            </button>
            <button class="rpt-fmt-tab" id="fmt-tab-Excel" onclick="switchPreviewFormat('Excel', this)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px;"><path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18"/></svg>
              Excel
            </button>
            <button class="rpt-fmt-tab" id="fmt-tab-CSV"   onclick="switchPreviewFormat('CSV',   this)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px;"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              CSV
            </button>
          </div>
          <div style="font-size:11px;color:var(--muted);" id="rpt-fmt-hint">Previewing as PDF</div>
        </div>

        <!-- Preview panels — one per format -->
        <div class="report-preview">

          <!-- PDF preview -->
          <div class="rpt-fmt-preview active" id="rpt-fmt-PDF">
            <div class="report-doc" id="reportContent-PDF">
              <div style="text-align:center;padding:3rem;color:var(--muted);font-size:13px;">Loading preview…</div>
            </div>
          </div>

          <!-- Excel preview -->
          <div class="rpt-fmt-preview" id="rpt-fmt-Excel">
            <div class="rpt-excel-preview">
              <div class="rpt-excel-toolbar">
                <span class="rpt-excel-cell rpt-excel-header" style="width:200px;">Field</span>
                <span class="rpt-excel-cell rpt-excel-header" style="flex:1;">Value</span>
                <span class="rpt-excel-cell rpt-excel-header" style="width:120px;">Academic Year</span>
              </div>
              <div id="reportContent-Excel"></div>
            </div>
          </div>

          <!-- CSV preview -->
          <div class="rpt-fmt-preview" id="rpt-fmt-CSV">
            <div class="rpt-csv-preview">
              <div class="rpt-csv-label">Raw CSV Output</div>
              <pre id="reportContent-CSV" class="rpt-csv-code"></pre>
            </div>
          </div>

        </div><!-- /report-preview -->

        <!-- Export button at the bottom -->
        <div class="rpt-export-footer">
          <div style="font-size:12px;color:var(--muted);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;vertical-align:middle;margin-right:4px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            All fields show — until a data source is connected
          </div>
          <button class="btn btn-primary rpt-export-btn" id="rpt-export-btn" onclick="exportCurrentFormat();closeReportPreview()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px;"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>
            Export as PDF
          </button>
        </div>

      </div><!-- /rpt-preview -->

    </div>
`;
