/* ================================================================
   Q-Nekt · Shell Templates — SAR System
   ================================================================ */

const HEADER_HTML = /* html */`
<header class="site-header">
  <div class="header-brand">
    <div class="header-text-group">
      <div class="header-univ-name">University of the Philippines</div>
      <div class="header-title">OPEN <span>UNIVERSITY</span></div>
      <div class="header-subtitle">Quality Assurance Office</div>
    </div>
  </div>
  <div class="header-qnekt">
    <div class="qnekt-badge">
      <div class="qnekt-badge-sub">Self-Assessment Report System</div>
    </div>
  </div>
</header>
`;

const NAV_HTML = /* html */`
<nav class="site-nav">
  <button class="site-nav-item active" data-page="sar-dashboard" onclick="showPage('sar-dashboard',this)">
    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
    SAR Dashboard
  </button>
  <button class="site-nav-item" data-page="sar-build" onclick="showPage('sar-build',this)">
    <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>
    SAR Build
  </button>
  <button class="site-nav-item" data-page="sar-review" onclick="showPage('sar-review',this)">
    <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
    SAR Review
  </button>
</nav>
`;

const SIDEBAR_HTML = /* html */`
  <aside class="sidebar">
    <div class="sidebar-brand">
      <div class="sidebar-brand-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </div>
      <div class="sidebar-brand-text">
        <div class="sidebar-brand-name">SAR System</div>
        <div class="sidebar-brand-sub">Quality Assurance Office</div>
      </div>
    </div>

    <div class="sidebar-divider"></div>

    <div class="sidebar-section">
      <div class="sidebar-label">Navigation</div>
      <div class="sidebar-item active" data-page="sar-dashboard" onclick="showPage('sar-dashboard',null)">
        <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
        SAR Dashboard
      </div>
      <div class="sidebar-item" data-page="sar-build" onclick="showPage('sar-build',null)">
        <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>
        SAR Build
      </div>
      <div class="sidebar-item" data-page="sar-review" onclick="showPage('sar-review',null)">
        <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        SAR Review
      </div>
    </div>

    <div class="sidebar-divider"></div>

    <div class="sidebar-section">
      <div class="sidebar-label">AUN-QA v4 Criteria</div>
      <div class="sidebar-source-row"><span class="sidebar-source-name" style="font-size:10px;color:var(--muted);">C1 Expected Learning Outcomes</span></div>
      <div class="sidebar-source-row"><span class="sidebar-source-name" style="font-size:10px;color:var(--muted);">C2 Programme Structure</span></div>
      <div class="sidebar-source-row"><span class="sidebar-source-name" style="font-size:10px;color:var(--muted);">C3 Teaching &amp; Learning</span></div>
      <div class="sidebar-source-row"><span class="sidebar-source-name" style="font-size:10px;color:var(--muted);">C4 Student Assessment</span></div>
      <div class="sidebar-source-row"><span class="sidebar-source-name" style="font-size:10px;color:var(--muted);">C5 Academic Staff</span></div>
      <div class="sidebar-source-row"><span class="sidebar-source-name" style="font-size:10px;color:var(--muted);">C6 Support Services</span></div>
      <div class="sidebar-source-row"><span class="sidebar-source-name" style="font-size:10px;color:var(--muted);">C7 Facilities</span></div>
      <div class="sidebar-source-row"><span class="sidebar-source-name" style="font-size:10px;color:var(--muted);">C8 Output &amp; Outcomes</span></div>
    </div>

    <div class="sidebar-ay-block">
      <div class="sidebar-ay-inner">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <div>
          <div class="sidebar-ay-label">Academic Year</div>
          <div class="sidebar-ay-value" id="sidebar-ay">AY ——</div>
        </div>
      </div>
    </div>

  </aside>
`;

const NOTIF_HTML = /* html */`
<div class="notif" id="notif"><div class="notif-dot"></div><span id="notif-text"></span></div>
`;
