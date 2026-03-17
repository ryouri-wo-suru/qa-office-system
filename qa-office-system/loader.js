/* ================================================================
   Q-Nekt · Template Loader
   ================================================================
   Injects all HTML template strings into their DOM slots.
   Uses JS template literals — no fetch(), works on file://.
   ================================================================ */

function injectTemplates() {
  const slots = {
    'slot-header':     HEADER_HTML,
    'slot-nav':        NAV_HTML,
    'slot-sidebar':    SIDEBAR_HTML,
    'slot-dashboard':  DASHBOARD_HTML,
    'slot-data-entry': DATA_ENTRY_HTML,
    'slot-reports':    REPORTS_HTML,
    'slot-historical': HISTORICAL_HTML,
    'slot-notif':      NOTIF_HTML,
  };
  for (const [id, html] of Object.entries(slots)) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  injectTemplates();
  if (typeof initQNekt === 'function') initQNekt();
});
