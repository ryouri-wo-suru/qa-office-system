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
        <div class="metric-card c-blue">
          <div class="metric-left">
            <div class="metric-label">Total Students</div>
            <div class="metric-value" style="font-size:20px;color:var(--muted);">—</div>
            <div class="metric-note">No data connected</div>
          </div>
          <div class="metric-icon blue">
            <svg viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          </div>
        </div>
        <div class="metric-card c-green">
          <div class="metric-left">
            <div class="metric-label">Faculty Members</div>
            <div class="metric-value" style="font-size:20px;color:var(--muted);">—</div>
            <div class="metric-note">No data connected</div>
          </div>
          <div class="metric-icon green">
            <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
          </div>
        </div>
        <div class="metric-card c-red">
          <div class="metric-left">
            <div class="metric-label">Active Researchers</div>
            <div class="metric-value" style="font-size:20px;color:var(--muted);">—</div>
            <div class="metric-note">No data connected</div>
          </div>
          <div class="metric-icon red">
            <svg viewBox="0 0 24 24"><path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 0v8M10 2a8 8 0 018 8"/><path d="M21 21l-4.35-4.35"/></svg>
          </div>
        </div>
        <div class="metric-card c-gold">
          <div class="metric-left">
            <div class="metric-label">Reports Generated</div>
            <div class="metric-value" style="font-size:20px;color:var(--muted);">—</div>
            <div class="metric-note">No data connected</div>
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
            <div class="card-title"><div class="card-title-dot green"></div> Data Collection Progress</div>
          </div>
          <div style="text-align:center;padding:2rem 0.5rem;color:var(--muted);font-size:13px;line-height:2;">No data available. Connect a data source to begin tracking.</div>
        </div>
        <div class="card">
          <div class="card-header">
            <div class="card-title"><div class="card-title-dot green"></div> Recent Activity</div>
          </div>
          <div style="text-align:center;padding:2rem 0.5rem;color:var(--muted);font-size:13px;line-height:2;">No activity yet. Activity will appear once the system is connected.</div>
        </div>
      </div>
    </div>
`;
