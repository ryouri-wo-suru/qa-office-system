/* ================================================================
   Q-Nekt · Page Template: Dashboard
   ================================================================
   The Dashboard is the first page users see. It gives a high-level
   overview of the system through four metric cards (Total Students,
   Faculty Members, Active Researchers, Reports Generated), a Data
   Flow Architecture diagram showing how data moves from source
   systems through Q-Nekt into QA reports, and two status cards
   (Data Collection Progress, Recent Activity).

   All metric values show "—" until a backend data source is
   connected. The layout and structure are fully ready.

   This file exports a single const (DASHBOARD_HTML) containing the full
   HTML for this page. loader.js injects it into the matching slot
   in index.html. All interactive behaviour is handled by app.js.
   ================================================================ */

const DASHBOARD_HTML = /* html */`
<!-- ════════════════════════════════════════════════════════════
     PAGE: DASHBOARD
     ════════════════════════════════════════════════════════════ -->
<!-- ══════════════════ DASHBOARD ══════════════════ -->
    <div class="page active" id="page-dashboard">
      <div class="page-hero">
        <div class="page-hero-title">System Workflow Overview</div>
        <div class="page-hero-sub">Quality Assurance Report Generation System · UPOU</div>
      </div>
      <div class="deco-bar"></div>

      <div class="metrics-row">
        <div class="metric-card c-blue" id="dash-card-students">
          <div class="metric-left">
            <div class="metric-label">Total Students</div>
            <div class="metric-value" id="dash-val-students" style="font-size:20px;">0</div>
            <div class="metric-note" id="dash-note-students">No records yet</div>
          </div>
          <div class="metric-icon blue">
            <svg viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          </div>
        </div>
        <div class="metric-card c-green" id="dash-card-faculty">
          <div class="metric-left">
            <div class="metric-label">Faculty Members</div>
            <div class="metric-value" id="dash-val-faculty" style="font-size:20px;">0</div>
            <div class="metric-note" id="dash-note-faculty">No records yet</div>
          </div>
          <div class="metric-icon green">
            <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
          </div>
        </div>
        <div class="metric-card c-red" id="dash-card-research">
          <div class="metric-left">
            <div class="metric-label">Active Researchers</div>
            <div class="metric-value" id="dash-val-research" style="font-size:20px;">0</div>
            <div class="metric-note" id="dash-note-research">No records yet</div>
          </div>
          <div class="metric-icon red">
            <svg viewBox="0 0 24 24"><path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 0v8M10 2a8 8 0 018 8"/><path d="M21 21l-4.35-4.35"/></svg>
          </div>
        </div>
        <div class="metric-card c-gold" id="dash-card-reports">
          <div class="metric-left">
            <div class="metric-label">Reports Generated</div>
            <div class="metric-value" id="dash-val-reports" style="font-size:20px;">0</div>
            <div class="metric-note" id="dash-note-reports">No reports yet</div>
          </div>
          <div class="metric-icon gold">
            <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
        </div>
      </div>

      <!-- Data Flow Architecture -->
      <div class="flow-full">
        <div class="card-header">
          <div class="card-title"><div class="card-title-dot green"></div> Data Flow Architecture</div>
        </div>
        <div class="flow-diagram">
          <div class="flow-col">
            <div class="flow-icon-wrap gold">
              <svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
            </div>
            <div class="flow-label">Data Sources</div>
            <div class="flow-sub">5 Systems</div>
            <div class="flow-items">
              <div class="flow-item">OUR</div>
              <div class="flow-item">FoS</div>
              <div class="flow-item">OSA</div>
              <div class="flow-item">PIVOT</div>
              <div class="flow-item">R&amp;E Personnel</div>
            </div>
          </div>

          <div class="flow-arrow">→</div>

          <div class="flow-col">
            <div class="flow-icon-wrap red">
              <svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
            </div>
            <div class="flow-label">Q-Nekt</div>
            <div class="flow-sub">Central Repository</div>
            <div class="flow-center-items">
              <div class="flow-center-item gold-bg">
                <h4>Historical Data</h4>
                <p>Students, Faculty, Researchers</p>
              </div>
              <div class="flow-center-item green-bg">
                <h4>Data Processing</h4>
                <p>Validation &amp; Integration</p>
              </div>
            </div>
          </div>

          <div class="flow-arrow">→</div>

          <div class="flow-col">
            <div class="flow-icon-wrap green">
              <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </div>
            <div class="flow-label">Reports</div>
            <div class="flow-sub">Generated Output</div>
            <div class="flow-items">
              <div class="flow-item" style="color:var(--text);">Student Performance</div>
              <div class="flow-item" style="color:var(--text);">Faculty Analytics</div>
              <div class="flow-item" style="color:var(--text);">Research Metrics</div>
              <div class="flow-item" style="color:var(--text);">QA Compliance</div>
            </div>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <div class="card">
          <div class="card-header">
            <div class="card-title"><div class="card-title-dot green"></div> Data Repository Summary</div>
            <span id="dash-repo-total" style="font-size:11px;color:var(--muted);font-weight:500;"></span>
          </div>
          <div id="dash-repo-summary">
            <div class="dash-repo-row">
              <div class="dash-repo-item">
                <div class="dash-repo-icon" style="background:rgba(59,130,246,0.15);color:#60a5fa;">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                </div>
                <div class="dash-repo-info">
                  <div class="dash-repo-label">Faculty</div>
                  <div class="dash-repo-count" id="repo-count-faculty">—</div>
                </div>
              </div>
              <div class="dash-repo-item">
                <div class="dash-repo-icon" style="background:rgba(16,185,129,0.15);color:#34d399;">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                </div>
                <div class="dash-repo-info">
                  <div class="dash-repo-label">Students</div>
                  <div class="dash-repo-count" id="repo-count-students">—</div>
                </div>
              </div>
              <div class="dash-repo-item">
                <div class="dash-repo-icon" style="background:rgba(245,158,11,0.15);color:#fbbf24;">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                </div>
                <div class="dash-repo-info">
                  <div class="dash-repo-label">Research</div>
                  <div class="dash-repo-count" id="repo-count-research">—</div>
                </div>
              </div>
            </div>
            <div class="dash-repo-row" style="margin-top:0.75rem;">
              <div class="dash-repo-item">
                <div class="dash-repo-icon" style="background:rgba(139,92,246,0.15);color:#a78bfa;">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                </div>
                <div class="dash-repo-info">
                  <div class="dash-repo-label">Scholarships</div>
                  <div class="dash-repo-count" id="repo-count-scholarships">—</div>
                </div>
              </div>
              <div class="dash-repo-item">
                <div class="dash-repo-icon" style="background:rgba(236,72,153,0.15);color:#f472b6;">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </div>
                <div class="dash-repo-info">
                  <div class="dash-repo-label">Faculty Load</div>
                  <div class="dash-repo-count" id="repo-count-faculty-load">—</div>
                </div>
              </div>
              <div class="dash-repo-item">
                <div class="dash-repo-icon" style="background:rgba(20,184,166,0.15);color:#2dd4bf;">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </div>
                <div class="dash-repo-info">
                  <div class="dash-repo-label">Student Load</div>
                  <div class="dash-repo-count" id="repo-count-student-load">—</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <div class="card-title"><div class="card-title-dot green"></div> Recent Activity</div>
            <span id="dash-activity-count" style="font-size:11px;color:var(--muted);font-weight:500;"></span>
          </div>
          <div id="dash-activity-list"></div>
        </div>
      </div>
    </div>
`;
