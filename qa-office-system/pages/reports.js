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
                <div class="rpt-section-label">Export Formats:</div>
                <div class="rpt-format-tags">
                  <span class="rpt-format">PDF</span>
                  <span class="rpt-format">Excel</span>
                  <span class="rpt-format">CSV</span>
                </div>
              </div>
              <button class="rpt-btn-generate" onclick="generateReport('faculty')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Generate Report
              </button>
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
                <div class="rpt-section-label">Export Formats:</div>
                <div class="rpt-format-tags">
                  <span class="rpt-format">PDF</span>
                  <span class="rpt-format">Excel</span>
                  <span class="rpt-format">CSV</span>
                </div>
              </div>
              <button class="rpt-btn-generate" onclick="generateReport('student')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Generate Report
              </button>
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
                <div class="rpt-section-label">Export Formats:</div>
                <div class="rpt-format-tags">
                  <span class="rpt-format">PDF</span>
                  <span class="rpt-format">Excel</span>
                  <span class="rpt-format">CSV</span>
                </div>
              </div>
              <button class="rpt-btn-generate" onclick="generateReport('scholarship')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Generate Report
              </button>
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
                <div class="rpt-section-label">Export Formats:</div>
                <div class="rpt-format-tags">
                  <span class="rpt-format">PDF</span>
                  <span class="rpt-format">Excel</span>
                  <span class="rpt-format">CSV</span>
                </div>
              </div>
              <button class="rpt-btn-generate" onclick="generateReport('research')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Generate Report
              </button>
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
                <div class="rpt-section-label">Export Formats:</div>
                <div class="rpt-format-tags">
                  <span class="rpt-format">PDF</span>
                  <span class="rpt-format">Excel</span>
                  <span class="rpt-format">CSV</span>
                </div>
              </div>
              <button class="rpt-btn-generate" onclick="generateReport('personnel')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Generate Report
              </button>
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
            <button class="btn btn-ghost" style="font-size:12px;" onclick="clearReportLog()">Clear Log</button>
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
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:1.4rem;">
          <button class="btn btn-ghost" style="padding:6px 14px;" onclick="closeReportPreview()">← Back</button>
          <div>
            <div class="page-hero-title" id="previewTitle" style="font-size:20px;"></div>
            <div class="page-hero-sub" id="previewSub" style="margin-top:2px;"></div>
          </div>
        </div>
        <div class="deco-bar"></div>
        <div class="report-preview">
          <div class="preview-top">
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button class="btn btn-primary" onclick="exportReport('PDF')">↓ Export PDF</button>
              <button class="btn btn-gold" onclick="exportReport('Excel')">↓ Export Excel</button>
              <button class="btn btn-green" onclick="exportReport('CSV')">↓ Export CSV</button>
            </div>
          </div>
          <div class="report-doc" id="reportContent"></div>
        </div>
      </div>

    </div>
`;
