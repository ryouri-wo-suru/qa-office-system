/* ================================================================
   Q-Nekt · Page Template: Historical Data
   ================================================================
   The Historical Data page lets users browse and compare records
   across past academic years. It includes filter controls (academic
   year, category, keyword search) and a summary table showing
   student, faculty, researcher, scholarship, and report counts per
   academic year.

   All data shows empty states until historical records have been
   entered and archived in the system.

   This file exports a single const (HISTORICAL_HTML) containing the full
   HTML for this page. loader.js injects it into the matching slot
   in index.html. All interactive behaviour is handled by app.js.
   ================================================================ */

const HISTORICAL_HTML = /* html */`
<!-- ════════════════════════════════════════════════════════════
     PAGE: HISTORICAL DATA
     ════════════════════════════════════════════════════════════ -->
<!-- ══════════════════ HISTORICAL DATA ══════════════════ -->
    <div class="page" id="page-historical">
      <div class="page-hero">
        <div class="page-hero-title">Historical Data</div>
        <div class="page-hero-sub">Browse and compare past academic year records</div>
      </div>
      <div class="deco-bar"></div>
      <div class="hist-filter-row">
        <select style="width:180px;"><option>AY 2024–2025</option><option>AY 2023–2024</option><option>AY 2022–2023</option><option>AY 2021–2022</option></select>
        <select style="width:160px;"><option>All Categories</option><option>Students</option><option>Faculty</option><option>Research</option><option>Scholarships</option></select>
        <input type="text" placeholder="🔍 Search historical records..." style="flex:1;min-width:200px;"/>
        <button class="btn btn-gold" onclick="notify('Historical data exported!', 'export', 'Historical Data', 'Historical records exported')">↓ Export</button>
      </div>
      <div class="card" style="margin-bottom:1.4rem;">
        <div style="text-align:center;padding:3rem 1rem;color:var(--muted);font-size:13px;line-height:2;">
          No historical data available. Records will appear here once data has been entered and archived.
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Academic Year</th><th>Students</th><th>Faculty</th><th>Researchers</th><th>Scholarships</th><th>Reports</th></tr></thead>
          <tbody>
            <tr><td colspan="6" style="text-align:center;padding:2.5rem;color:var(--muted);font-size:13px;">No historical records found.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
`;
