/* ================================================================
   Q-Nekt · Page: SAR Dashboard
   ================================================================ */

const SAR_DASHBOARD_HTML = /* html */`
<div class="page active" id="page-sar-dashboard">

  <div class="page-hero">
    <div class="page-hero-title">SAR Dashboard</div>
    <div class="page-hero-sub">Self-Assessment Report — AUN-QA v4 Programme Level Overview</div>
  </div>
  <div class="deco-bar"></div>

  <!-- Stats Row -->
  <div class="de-metrics" style="margin-bottom:1.8rem;">
    <div class="de-metric">
      <div class="de-metric-label">Build Fields Filled</div>
      <div class="de-metric-value" id="dash-build-pct">0%</div>
      <div class="de-metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg></div>
    </div>
    <div class="de-metric">
      <div class="de-metric-label">Review Statuses Set</div>
      <div class="de-metric-value" id="dash-review-pct">0%</div>
      <div class="de-metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
    </div>
    <div class="de-metric">
      <div class="de-metric-label">Data Files Uploaded</div>
      <div class="de-metric-value" id="dash-files">0</div>
      <div class="de-metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div>
    </div>
    <div class="de-metric">
      <div class="de-metric-label">Criteria Complete</div>
      <div class="de-metric-value" id="dash-criteria-done">0/8</div>
      <div class="de-metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg></div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;margin-bottom:1.4rem;">

    <!-- Build Progress -->
    <div style="background:var(--surface2);border:1px solid var(--border2);border-radius:12px;padding:1.2rem;">
      <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:1rem;display:flex;align-items:center;gap:8px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--header2)" stroke-width="2" style="width:15px;height:15px;"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>
        SAR Build — Criteria Progress
      </div>
      <div id="dash-build-bars"></div>
      <div style="margin-top:1rem;">
        <button class="btn btn-primary" style="font-size:12px;padding:7px 16px;width:100%;" onclick="showPage('sar-build')">
          Go to SAR Build →
        </button>
      </div>
    </div>

    <!-- Review Progress -->
    <div style="background:var(--surface2);border:1px solid var(--border2);border-radius:12px;padding:1.2rem;">
      <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:1rem;display:flex;align-items:center;gap:8px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2" style="width:15px;height:15px;"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        SAR Review — Criteria Status
      </div>
      <div id="dash-review-bars"></div>
      <div style="margin-top:1rem;">
        <button class="btn btn-ghost" style="font-size:12px;padding:7px 16px;width:100%;border-color:rgba(138,21,56,0.4);color:var(--header2);" onclick="showPage('sar-review')">
          Go to SAR Review →
        </button>
      </div>
    </div>

  </div>

  <!-- Quick Actions -->
  <div style="background:linear-gradient(135deg,rgba(138,21,56,0.15) 0%,rgba(138,21,56,0.06) 100%);border:1px solid rgba(138,21,56,0.25);border-radius:12px;padding:1.2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
    <div>
      <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:3px;">Ready to export?</div>
      <div style="font-size:11px;color:var(--muted);">Use SAR Build to export a .docx report, or SAR Review to export a formatted PDF.</div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <button class="btn btn-ghost" style="font-size:12px;" onclick="showPage('sar-build')">Export .docx</button>
      <button class="btn btn-primary" style="font-size:12px;" onclick="showPage('sar-review')">Export PDF</button>
    </div>
  </div>

</div>
`;
