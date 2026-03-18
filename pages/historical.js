/* ================================================================
   Q-Nekt · Page Template: Historical Data
   ================================================================
   Redesigned as an analytics dashboard with:
     - Four metric summary cards (with trend indicators)
     - Four data tabs: Student Data, Faculty Data, Research Data,
       Retention Rates — each showing an area chart and a
       data summary section below
     - Chart.js loaded from CDN for the area charts
     - All values show "—" until a backend is connected

   This file exports HISTORICAL_HTML. loader.js injects it into
   the matching slot in index.html. Interactive behaviour (tab
   switching, chart rendering) is handled inline and in app.js.
   ================================================================ */

const HISTORICAL_HTML = /* html */`
<!-- ════════════════════════════════════════════════════════════
     PAGE: HISTORICAL DATA
     ════════════════════════════════════════════════════════════ -->
<div class="page" id="page-historical">

  <div class="page-hero">
    <div class="page-hero-title">Historical Data Analytics</div>
    <div class="page-hero-sub">Long-term trends and insights from the Q-Nekt data repository</div>
  </div>
  <div class="deco-bar"></div>

  <!-- ── Data Repository Summary ──────────────────────────── -->
  <div class="card repo-summary">
    <div class="repo-summary-title">Data Repository Summary</div>
    <div class="repo-summary-body">

      <!-- Storage Overview -->
      <div class="repo-col">
        <div class="repo-col-heading">Storage Overview</div>
        <div class="repo-row">
          <div class="repo-row-left">
            <div class="repo-icon" style="background:rgba(58,123,213,0.15);">
              <svg viewBox="0 0 24 24" fill="none" stroke="#3a7bd5" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <span class="repo-label">Data Range</span>
          </div>
          <span class="repo-value" id="hist-repo-range">—</span>
        </div>
        <div class="repo-row">
          <div class="repo-row-left">
            <div class="repo-icon" style="background:rgba(14,96,33,0.18);">
              <svg viewBox="0 0 24 24" fill="none" stroke="#1a8c32" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
            </div>
            <span class="repo-label">Total Records</span>
          </div>
          <span class="repo-value" id="hist-repo-total">—</span>
        </div>
        <div class="repo-row">
          <div class="repo-row-left">
            <div class="repo-icon" style="background:rgba(138,21,56,0.15);">
              <svg viewBox="0 0 24 24" fill="none" stroke="#e87093" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            </div>
            <span class="repo-label">Growth Rate</span>
          </div>
          <span class="repo-value" id="hist-repo-growth">—</span>
        </div>
      </div>

      <div class="repo-divider"></div>

      <!-- Data Categories -->
      <div class="repo-col">
        <div class="repo-col-heading">Data Categories</div>
        <div class="repo-row" style="background:rgba(58,123,213,0.08);border-radius:8px;">
          <span class="repo-label" style="padding-left:4px;">Student Records</span>
          <span class="repo-value" id="hist-repo-students">—</span>
        </div>
        <div class="repo-row" style="background:rgba(14,96,33,0.08);border-radius:8px;">
          <span class="repo-label" style="padding-left:4px;">Faculty Records</span>
          <span class="repo-value" id="hist-repo-faculty">—</span>
        </div>
        <div class="repo-row" style="border-radius:8px;">
          <span class="repo-label" style="padding-left:4px;">Research Records</span>
          <span class="repo-value" id="hist-repo-research">—</span>
        </div>
        <div class="repo-row" style="background:rgba(246,172,29,0.08);border-radius:8px;">
          <span class="repo-label" style="padding-left:4px;">Scholarship Records</span>
          <span class="repo-value" id="hist-repo-scholarships">—</span>
        </div>
      </div>

    </div>
  </div>

  <!-- ── Metric summary cards ──────────────────────────────── -->
  <div class="metrics-row" style="margin-bottom:1.8rem;">

    <div class="metric-card c-blue">
      <div class="metric-left">
        <div class="metric-label">Total Students</div>
        <div class="metric-value" id="hist-val-students" style="font-size:20px;">0</div>
        <div class="metric-note" id="hist-note-students">No records yet</div>
      </div>
      <div class="metric-icon blue">
        <svg viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
      </div>
    </div>

    <div class="metric-card c-green">
      <div class="metric-left">
        <div class="metric-label">Faculty Members</div>
        <div class="metric-value" id="hist-val-faculty" style="font-size:20px;">0</div>
        <div class="metric-note" id="hist-note-faculty">No records yet</div>
      </div>
      <div class="metric-icon green">
        <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
      </div>
    </div>

    <div class="metric-card c-red">
      <div class="metric-left">
        <div class="metric-label">Active Researchers</div>
        <div class="metric-value" id="hist-val-research" style="font-size:20px;">0</div>
        <div class="metric-note" id="hist-note-research">No records yet</div>
      </div>
      <div class="metric-icon red">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </div>
    </div>

    <div class="metric-card c-gold">
      <div class="metric-left">
        <div class="metric-label">Data Points</div>
        <div class="metric-value" id="hist-val-total" style="font-size:20px;">0</div>
        <div class="metric-note" id="hist-note-total">No records yet</div>
      </div>
      <div class="metric-icon gold">
        <svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
      </div>
    </div>

  </div>

  <!-- ── Data category tabs ─────────────────────────────────── -->
  <div class="hist-tab-bar">
    <button class="hist-tab active" onclick="switchHistTab('student', this)">Student Data</button>
    <button class="hist-tab" onclick="switchHistTab('faculty', this)">Faculty Data</button>
    <button class="hist-tab" onclick="switchHistTab('research', this)">Research Data</button>
    <button class="hist-tab" onclick="switchHistTab('retention', this)">Retention Rates</button>
  </div>

  <!-- ── STUDENT DATA panel ─────────────────────────────────── -->
  <div class="hist-panel active" id="hist-student">
    <div class="card" style="margin-bottom:1.4rem;">
      <div class="hist-chart-header">
        <div>
          <div style="font-size:14px;font-weight:600;margin-bottom:3px;">Student Enrollment Trends</div>
          <div style="font-size:12px;color:var(--muted);">Academic year enrollment counts over time</div>
        </div>
        <div class="hist-filter-row" style="margin:0;">
          <select style="width:160px;" onchange="renderHistChart('student-chart', 'student')"><option>All Years</option><option>Last 3 Years</option><option>Last 5 Years</option></select>
          <button class="btn btn-ghost" style="font-size:12px;" onclick="notify('Exported!','export','Historical Data','Student data exported')">↓ Export</button>
        </div>
      </div>
      <div class="hist-chart-wrap">
        <canvas id="student-chart"></canvas>
        <div class="hist-chart-empty" id="student-chart-empty">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity:.3"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <p>No historical data available.</p>
          <p style="font-size:12px;margin-top:4px;">Records will appear here once data has been entered and archived.</p>
        </div>
      </div>
    </div>
    <!-- Data summary -->
    <div class="hist-summary-grid">
      <div class="hist-summary-card">
        <div class="hist-summary-label">Total Enrollment (Latest AY)</div>
        <div class="hist-summary-value" id="hs-stu-total">0</div>
        <div class="hist-summary-note" id="hs-stu-total-note">No records yet</div>
      </div>
      <div class="hist-summary-card">
        <div class="hist-summary-label">Regular Students</div>
        <div class="hist-summary-value" id="hs-stu-regular">0</div>
        <div class="hist-summary-note" id="hs-stu-regular-note">No records yet</div>
      </div>
      <div class="hist-summary-card">
        <div class="hist-summary-label">Irregular Students</div>
        <div class="hist-summary-value" id="hs-stu-irregular">0</div>
        <div class="hist-summary-note" id="hs-stu-irregular-note">No records yet</div>
      </div>
      <div class="hist-summary-card">
        <div class="hist-summary-label">Year-on-Year Change</div>
        <div class="hist-summary-value" id="hs-stu-yoy">—</div>
        <div class="hist-summary-note" id="hs-stu-yoy-note">No records yet</div>
      </div>
    </div></div>

  <!-- ── FACULTY DATA panel ─────────────────────────────────── -->
  <div class="hist-panel" id="hist-faculty">
    <div class="card" style="margin-bottom:1.4rem;">
      <div class="hist-chart-header">
        <div>
          <div style="font-size:14px;font-weight:600;margin-bottom:3px;">Faculty Headcount Trends</div>
          <div style="font-size:12px;color:var(--muted);">Faculty count and rank distribution over time</div>
        </div>
        <div class="hist-filter-row" style="margin:0;">
          <select style="width:160px;"><option>All Years</option><option>Last 3 Years</option><option>Last 5 Years</option></select>
          <button class="btn btn-ghost" style="font-size:12px;" onclick="notify('Exported!','export','Historical Data','Faculty data exported')">↓ Export</button>
        </div>
      </div>
      <div class="hist-chart-wrap">
        <canvas id="faculty-chart"></canvas>
        <div class="hist-chart-empty" id="faculty-chart-empty">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity:.3"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <p>No historical data available.</p>
          <p style="font-size:12px;margin-top:4px;">Records will appear here once data has been entered and archived.</p>
        </div>
      </div>
    </div>
    <div class="hist-summary-grid">
      <div class="hist-summary-card">
        <div class="hist-summary-label">Total Faculty (Latest AY)</div>
        <div class="hist-summary-value" id="hs-fac-total">0</div>
        <div class="hist-summary-note" id="hs-fac-total-note">No records yet</div>
      </div>
      <div class="hist-summary-card">
        <div class="hist-summary-label">Regular / Permanent</div>
        <div class="hist-summary-value" id="hs-fac-regular">0</div>
        <div class="hist-summary-note" id="hs-fac-regular-note">No records yet</div>
      </div>
      <div class="hist-summary-card">
        <div class="hist-summary-label">With Doctoral Degree</div>
        <div class="hist-summary-value" id="hs-fac-doctoral">0</div>
        <div class="hist-summary-note" id="hs-fac-doctoral-note">No records yet</div>
      </div>
      <div class="hist-summary-card">
        <div class="hist-summary-label">Year-on-Year Change</div>
        <div class="hist-summary-value" id="hs-fac-yoy">—</div>
        <div class="hist-summary-note" id="hs-fac-yoy-note">No records yet</div>
      </div>
    </div></div>

  <!-- ── RESEARCH DATA panel ────────────────────────────────── -->
  <div class="hist-panel" id="hist-research">
    <div class="card" style="margin-bottom:1.4rem;">
      <div class="hist-chart-header">
        <div>
          <div style="font-size:14px;font-weight:600;margin-bottom:3px;">Research Output Trends</div>
          <div style="font-size:12px;color:var(--muted);">Projects, publications, and extension activities over time</div>
        </div>
        <div class="hist-filter-row" style="margin:0;">
          <select style="width:160px;"><option>All Years</option><option>Last 3 Years</option><option>Last 5 Years</option></select>
          <button class="btn btn-ghost" style="font-size:12px;" onclick="notify('Exported!','export','Historical Data','Research data exported')">↓ Export</button>
        </div>
      </div>
      <div class="hist-chart-wrap">
        <canvas id="research-chart"></canvas>
        <div class="hist-chart-empty" id="research-chart-empty">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity:.3"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <p>No historical data available.</p>
          <p style="font-size:12px;margin-top:4px;">Records will appear here once data has been entered and archived.</p>
        </div>
      </div>
    </div>
    <div class="hist-summary-grid">
      <div class="hist-summary-card">
        <div class="hist-summary-label">Ongoing Projects</div>
        <div class="hist-summary-value" id="hs-res-ongoing">0</div>
        <div class="hist-summary-note" id="hs-res-ongoing-note">No records yet</div>
      </div>
      <div class="hist-summary-card">
        <div class="hist-summary-label">Completed Projects</div>
        <div class="hist-summary-value" id="hs-res-completed">0</div>
        <div class="hist-summary-note" id="hs-res-completed-note">No records yet</div>
      </div>
      <div class="hist-summary-card">
        <div class="hist-summary-label">Total Publications</div>
        <div class="hist-summary-value" id="hs-res-pubs">—</div>
        <div class="hist-summary-note" id="hs-res-pubs-note">No records yet</div>
      </div>
      <div class="hist-summary-card">
        <div class="hist-summary-label">Extension Activities</div>
        <div class="hist-summary-value" id="hs-res-ext">—</div>
        <div class="hist-summary-note" id="hs-res-ext-note">No records yet</div>
      </div>
    </div></div>

  <!-- ── RETENTION RATES panel ──────────────────────────────── -->
  <div class="hist-panel" id="hist-retention">
    <div class="card" style="margin-bottom:1.4rem;">
      <div class="hist-chart-header">
        <div>
          <div style="font-size:14px;font-weight:600;margin-bottom:3px;">Student Retention Rate Trends</div>
          <div style="font-size:12px;color:var(--muted);">Percentage of students continuing from one year to the next</div>
        </div>
        <div class="hist-filter-row" style="margin:0;">
          <select style="width:160px;"><option>All Years</option><option>Last 3 Years</option><option>Last 5 Years</option></select>
          <button class="btn btn-ghost" style="font-size:12px;" onclick="notify('Exported!','export','Historical Data','Retention data exported')">↓ Export</button>
        </div>
      </div>
      <div class="hist-chart-wrap">
        <canvas id="retention-chart"></canvas>
        <div class="hist-chart-empty" id="retention-chart-empty">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity:.3"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <p>No historical data available.</p>
          <p style="font-size:12px;margin-top:4px;">Records will appear here once data has been entered and archived.</p>
        </div>
      </div>
    </div>
    <div class="hist-summary-grid">
      <div class="hist-summary-card">
        <div class="hist-summary-label">Overall Retention Rate</div>
        <div class="hist-summary-value" id="hs-ret-rate">—</div>
        <div class="hist-summary-note" id="hs-ret-rate-note">No records yet</div>
      </div>
      <div class="hist-summary-card">
        <div class="hist-summary-label">Graduation Rate</div>
        <div class="hist-summary-value" id="hs-ret-grad">—</div>
        <div class="hist-summary-note" id="hs-ret-grad-note">No records yet</div>
      </div>
      <div class="hist-summary-card">
        <div class="hist-summary-label">Dropout Rate</div>
        <div class="hist-summary-value" id="hs-ret-dropout">—</div>
        <div class="hist-summary-note" id="hs-ret-dropout-note">No records yet</div>
      </div>
      <div class="hist-summary-card">
        <div class="hist-summary-label">LOA Rate</div>
        <div class="hist-summary-value" id="hs-ret-loa">—</div>
        <div class="hist-summary-note" id="hs-ret-loa-note">No records yet</div>
      </div>
    </div></div>

</div>
`;
