/* ================================================================
   Q-Nekt · Shell Templates
   ================================================================
   "Shell" refers to the persistent chrome that surrounds every page:
   the university header, the top navigation bar, the sidebar, and
   the notification toast. These elements never change between pages,
   so they live here separately from the page-specific content.

   Exports (used by loader.js to inject into index.html slots):
     HEADER_HTML  — University header: UPOU branding + badge
     NAV_HTML     — Top navigation bar: page links
     SIDEBAR_HTML — Left sidebar: nav items, data source dots,
                    academic year / semester label
     NOTIF_HTML   — Toast notification element (hidden by default;
                    shown briefly after each user action)

   To update the sidebar navigation links, edit SIDEBAR_HTML.
   To add a new top-nav page link, edit NAV_HTML.
   ================================================================ */

/* University header ─────────────────────────────────────────────
   Contains: UPOU branding (university name, subtitle) and the
   "Data Collection & Report System" badge on the right.
   ─────────────────────────────────────────────────────────────── */
const HEADER_HTML = /* html */`
<!-- ════════════════════════════════════════════════════════════
     SHELL: UNIVERSITY HEADER
     ════════════════════════════════════════════════════════════ -->
<!-- UNIVERSITY HEADER -->
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
      <div class="qnekt-badge-sub">Data Collection &amp; Report System</div>
    </div>
  </div>
</header>
`;

/* Top navigation bar ────────────────────────────────────────────
   Contains: Dashboard, Data Entry, Reports, Historical Data tabs.
   onclick="showPage('...')" wires each button to the navigation
   module in app.js.
   ─────────────────────────────────────────────────────────────── */
const NAV_HTML = /* html */`
<!-- ════════════════════════════════════════════════════════════
     SHELL: TOP NAVIGATION
     ════════════════════════════════════════════════════════════ -->
<!-- NAVIGATION -->
<nav class="site-nav">
  <button class="site-nav-item active" data-page="dashboard" onclick="showPage('dashboard',this)">
    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
    Dashboard
  </button>
  <button class="site-nav-item" data-page="data-entry" onclick="showPage('data-entry',this)">
    <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
    Data Entry
  </button>
  <button class="site-nav-item" data-page="reports" onclick="showPage('reports',this)">
    <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
    Reports
  </button>
  <button class="site-nav-item" data-page="historical" onclick="showPage('historical',this)">
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    Historical Data
  </button>
</nav>
`;

/* Sidebar ────────────────────────────────────────────────────────
   Contains: navigation items (mirrors the top nav), data source
   status indicators (OUR, FoS, OSA, PIVOT/HR, R&E Personnel),
   and the academic year / semester label updated by initQNekt().
   ─────────────────────────────────────────────────────────────── */
const SIDEBAR_HTML = /* html */`
  <aside class="sidebar">

    <!-- Branding -->
    <div class="sidebar-brand">
      <div class="sidebar-brand-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </div>
      <div class="sidebar-brand-text">
        <div class="sidebar-brand-name">Q-Nekt</div>
        <div class="sidebar-brand-sub">Quality Assurance Office</div>
      </div>
    </div>

    <div class="sidebar-divider"></div>

    <!-- Navigation -->
    <div class="sidebar-section">
      <div class="sidebar-label">Navigation</div>
      <div class="sidebar-item active" data-page="dashboard" onclick="showPage('dashboard',null)">
        <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
        Dashboard
      </div>
      <div class="sidebar-item" data-page="data-entry" onclick="showPage('data-entry',null)">
        <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        Data Entry
      </div>
      <div class="sidebar-item" data-page="reports" onclick="showPage('reports',null)">
        <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        Reports
      </div>
      <div class="sidebar-item" data-page="historical" onclick="showPage('historical',null)">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Historical Data
      </div>
    </div>

    <div class="sidebar-divider"></div>

    <!-- Data Sources -->
    <div class="sidebar-section">
      <div class="sidebar-label">Data Sources</div>
      <div class="sidebar-source-row"><span class="sidebar-source-name">OUR</span></div>
      <div class="sidebar-source-row"><span class="sidebar-source-name">FoS</span></div>
      <div class="sidebar-source-row"><span class="sidebar-source-name">OSA</span></div>
      <div class="sidebar-source-row"><span class="sidebar-source-name">PIVOT / HR</span></div>
      <div class="sidebar-source-row"><span class="sidebar-source-name">R&amp;E Personnel</span></div>
    </div>

    <!-- Academic Year (pinned to bottom) -->
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

/* Notification toast ────────────────────────────────────────────
   A small pop-up at the bottom-right of the screen. Hidden by
   default; shown by notify() in app.js after user actions.
   ─────────────────────────────────────────────────────────────── */
const NOTIF_HTML = /* html */`
<!-- ════════════════════════════════════════════════════════════
     SHELL: NOTIFICATION TOAST
     ════════════════════════════════════════════════════════════ -->
<!-- NOTIFICATION -->
<div class="notif" id="notif"><div class="notif-dot"></div><span id="notif-text"></span></div>

<!-- ================================================================
     JAVASCRIPT
     Modules: [1] Data Source Status  [2] Initialisation  [3] Navigation
              [4] Data Panel Tabs     [5] Database         [6] Activity Log
              [7] Data Entry Hub      [8] Reports          [9] Notifications
     ================================================================ -->
`;
