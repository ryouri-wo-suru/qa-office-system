/* ================================================================
   Q-Nekt · Loader — SAR System
   Injects HTML templates into their slots then boots the app.
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const slots = {
    'header':        HEADER_HTML,
    'nav':           NAV_HTML,
    'sidebar':       SIDEBAR_HTML,
    'sar-dashboard': SAR_DASHBOARD_HTML,
    'sar-build':     SAR_BUILD_HTML,
    'sar-review':    SAR_REVIEW_HTML,
    'notif':         NOTIF_HTML,
  };

  for (const [id, html] of Object.entries(slots)) {
    const el = document.getElementById('slot-' + id);
    if (el) el.innerHTML = html;
  }

  initQNekt();
});
