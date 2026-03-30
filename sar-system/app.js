/* ================================================================
   Q-Nekt · Application Logic — SAR System
   Modules: [1] Init  [2] Navigation  [3] Notifications
   ================================================================ */

// --- 1. INIT ---
function initQNekt() {
  const now     = new Date();
  const month   = now.getMonth() + 1;
  const year    = now.getFullYear();
  const ayStart = month >= 8 ? year : year - 1;
  const ayEl    = document.getElementById('sidebar-ay');
  if (ayEl) ayEl.textContent = 'AY ' + ayStart + '\u2013' + (ayStart + 1);

  // Load build DB from localStorage
  buildLoadDB();
  buildUpdateRecordsBadge();

  // Boot the review page
  initReviewPage();

  // Refresh dashboard on first load
  refreshDashboard();
  refreshDashboardReview();
}


// --- 2. NAVIGATION ---
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + id);
  if (page) page.classList.add('active');

  document.querySelectorAll('.site-nav-item').forEach(b => {
    b.classList.toggle('active', b.dataset.page === id);
  });
  document.querySelectorAll('.sidebar-item[data-page]').forEach(s => {
    s.classList.toggle('active', s.dataset.page === id);
  });

  // On navigating to dashboard, refresh it
  if (id === 'sar-dashboard') {
    refreshDashboard();
    refreshDashboardReview();
  }
}


// --- 3. NOTIFICATIONS ---
function notify(msg, logType, logCat, logDetail) {
  const n = document.getElementById('notif');
  if (!n) return;
  document.getElementById('notif-text').textContent = msg;
  n.classList.add('show');
  setTimeout(() => n.classList.remove('show'), 3200);
}


// --- 4. REPORTS (stub — keeps db-integration.js happy) ---
const reportLog = [];
function updateRptBadge() {}
function switchRptTab() {}
function generateReport() {}
function quickGenerateReport() {}
function closeReportPreview() {}
function exportCurrentFormat() {}
function switchPreviewFormat() {}


// --- 5. STUBS (keep db-integration happy) ---
function openDataEntry() {}
function openSARPage() { showPage('sar-review'); }
function closeSARPage() { showPage('sar-dashboard'); }

const activityLog = [];
function logActivity() {}
function renderActivity() {}
function updateActivityBadge() {}
function clearActivityLog() {}
function switchHubTab() {}

// SAR data delegates to reviewData (for db-integration SAR drafts tab)
let sarData = {};
let sarActiveCriterion = 'c1';

function buildSARTabs()            { buildReviewTabs(); }
function switchSARCriterion(cid)   { reviewSwitchCriterion(cid); }
function buildSARPanel(cid)        { buildReviewPanel(cid); }
function updateSARField(a,b,c)     { reviewUpdateField(a,b,c); }
function updateSARNarrative(k,v)   { reviewUpdateNarrative(k,v); }
function updateSAREvidence(c,v)    { reviewUpdateEvidence(c,v); }
function updateSAROverallBadge()   { reviewUpdateOverallBadge(); }
function saveSARDraft()            { reviewSaveDraft(); }
async function loadSARDraft(p)     { reviewLoadDraft(p); }
function exportSAR()               { reviewExportPDF(); }

// Stub missing DB nav functions
function showDbTab() {}
function goToReport() {}
function goToDataEntry() {}
function dbQuickEnter() {}
function dbQuickReport() {}
function viewDbRecords() {}
function setSidebarActive() {}
function showDataTab() {}
function showPage_hist() {}
function switchHistTab() {}
function switchHubTab_hist() {}
function openDataEntry_hist() {}
