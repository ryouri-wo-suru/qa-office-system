/* ================================================================
   Q-Nekt · Template Loader
   ================================================================
   This file is the glue between the HTML templates (shell.js and
   pages/*.js) and the actual page. It runs once when the browser
   finishes loading, injects each template into its matching slot
   in index.html, then starts the app.

   Why templates instead of separate HTML files?
   Browsers block loading local files with fetch() when you open
   index.html directly from your computer (the file:// protocol).
   By storing HTML as JavaScript template strings, every file loads
   through a normal <script> tag — no web server required.

   How it works:
     1. index.html defines empty <div id="slot-*"> placeholders
     2. shell.js and pages/*.js each export a template string const
     3. This file maps each const to its slot and injects the HTML
     4. Once all slots are filled, initQNekt() (from app.js) runs
   ================================================================ */

/**
 * Injects every HTML template string into its matching DOM slot.
 * Template variables are declared in shell.js and pages/*.js.
 */
function injectTemplates() {
  // Maps slot element ID → template variable name (defined in the
  // <script src="..."> files loaded before this one in index.html)
  const slots = {
    'slot-header':     HEADER_HTML,      // University header bar
    'slot-nav':        NAV_HTML,         // Top navigation tabs
    'slot-sidebar':    SIDEBAR_HTML,     // Left sidebar
    'slot-dashboard':  DASHBOARD_HTML,   // Dashboard page content
    'slot-data-entry': DATA_ENTRY_HTML,  // Data Entry page content
    'slot-reports':    REPORTS_HTML,     // Reports page content
    'slot-historical': HISTORICAL_HTML,  // Historical Data page content
    'slot-notif':      NOTIF_HTML,       // Toast notification element
  };

  for (const [id, html] of Object.entries(slots)) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }
}

// Wait until the browser has parsed the full HTML before injecting,
// then immediately boot the app once all templates are in place
document.addEventListener('DOMContentLoaded', function () {
  injectTemplates();
  if (typeof initQNekt === 'function') initQNekt();
});
