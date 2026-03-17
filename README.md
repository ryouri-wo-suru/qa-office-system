# Q-Nekt — UPOU Quality Assurance System

A browser-based data collection and report generation system for the Quality Assurance Office of the University of the Philippines Open University (UPOU).

To run the system, open `index.html` in any modern browser.

---

## File Overview

| File | Purpose |
|------|---------|
| `index.html` | Entry point. Loads all scripts and defines the page slots. |
| `styles.css` | All styling — colours, layout, and responsive breakpoints. |
| `shell.js` | HTML templates for the header, navigation bar, sidebar, and toast notification. |
| `app.js` | All JavaScript logic split into 9 modules (see below). |
| `loader.js` | Injects the HTML templates into the page, then starts the app. |
| `pages/dashboard.js` | Dashboard page HTML |
| `pages/data-entry.js` | Data Entry page HTML (entry forms, database, activity log) |
| `pages/reports.js` | Reports page HTML (report cards, format preview, recent reports log) |
| `pages/historical.js` | Historical Data page HTML |

---

## Pages

| Page | What it does |
|------|-------------|
| **Dashboard** | Overview with metric cards, a data-flow diagram, collection progress bars, and recent activity. |
| **Data Entry** | Three-tab hub: enter data by category, view the database (6 tables), or check the activity log. Each entry card has quick access to its database table and report. |
| **Reports** | Seven report types matching all data categories. Each card has a format preview (PDF / Excel / CSV) and direct access to the corresponding data entry form. Recent exports are logged. |
| **Historical Data** | Data Repository Summary, metric cards, four area charts (Student, Faculty, Research, Retention), and per-tab summary cards. |

---

## JavaScript Modules (`app.js`)

| Module | Functions | What it does |
|--------|-----------|-------------|
| **1 · Data Source Status** | `setSourceStatus(id, state)` | Updates the connection dot and label in the sidebar for a given source. |
| **2 · Initialisation** | `initQNekt()` | Runs on page load. Sets up source dots and computes the current academic year. |
| **3 · Navigation** | `showPage(id)` | Switches the visible page, syncs the nav bar and sidebar, and resets each page to its first tab. |
| **4 · Data Panel Tabs** | `showDataTab(tab, btn)` | Switches sub-panels inside a data entry form. |
| **5 · Database** | `showDbTab(tab, btn)` `viewDbRecords(tab)` `dbQuickEnter()` `dbQuickReport()` | Switches between 6 database tables and updates status filters. `dbQuickEnter` and `dbQuickReport` open the matching data entry form or report from the database toolbar. |
| **6 · Activity Log** | `logActivity()` `renderActivity()` `clearActivityLog()` | Records every save and import as a timestamped entry and renders the filtered list. |
| **7 · Data Entry Hub** | `switchHubTab()` `openDataEntry()` `closeDataEntry()` `switchHistTab()` | Controls the Data Entry hub tabs, opens/closes data entry forms, and switches Historical Data tabs. |
| **8 · Reports** | `generateReport()` `quickGenerateReport()` `switchPreviewFormat()` `exportCurrentFormat()` `exportReport()` `closeReportPreview()` `renderReportLog()` `clearReportLog()` `goToReport()` `goToDataEntry()` | Full report lifecycle — preview with PDF/Excel/CSV tabs, export (logs to Recent Reports only), and cross-page navigation shortcuts. |
| **9 · Notifications** | `notify(msg, logType, logCat, logDetail)` | Shows a brief toast at the bottom-right. Logs to the activity log only if type/category/detail are provided. |

---

## Colour Palette

Defined as CSS variables in `styles.css` — change one variable to update the colour everywhere.

| Variable | Value | Usage |
|----------|-------|-------|
| `--bg` | `#2c2f39` | Main background |
| `--bg2` | `#23262f` | Cards and sidebar |
| `--bg3` | `#1a1c23` | Inputs and deep backgrounds |
| `--header` | `#8a1538` | UPOU maroon — headers, primary buttons |
| `--gold` | `#f6ac1d` | Accent gold — active states, highlights |
| `--green2` | `#1a8c32` | Success green — saved, connected |
| `--muted` | `#a0a4b5` | Labels and placeholder text |

---

## Backend Integration Checklist

When connecting a real backend, update these areas:

- [ ] Metric card values on the Dashboard and Historical Data pages
- [ ] Database table records (all 6 tables in `pages/data-entry.js`)
- [ ] Save and Import button handlers in data entry forms
- [ ] Report document fields in `RPT_DOC` and `RPT_FIELDS` (`app.js`)
- [ ] Export file generation in `exportReport()` (`app.js`)
- [ ] Historical Data chart datasets in `pages/historical.js`
- [ ] Data Repository Summary values in `pages/historical.js`

---

*UPOU Quality Assurance Office · Q-Nekt Data Collection & Report System*
