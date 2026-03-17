# Q-Nekt — UPOU Quality Assurance System

A browser-based data collection and report generation system for the Quality Assurance Office of the University of the Philippines Open University (UPOU).

---

## File Overview

| File | Purpose |
|------|---------|
| `index.html` | Entry point. Loads all scripts and defines the page slots. |
| `styles.css` | All styling — colours, layout, and components. |
| `shell.js` | HTML templates for the header, navigation bar, sidebar, and toast notification. |
| `app.js` | All JavaScript logic split into 9 modules (see below). |
| `loader.js` | Injects the HTML templates into the page, then starts the app. |
| `pages/dashboard.js` | Dashboard page HTML |
| `pages/data-entry.js` | Data Entry page HTML (entry forms, database, activity log) |
| `pages/reports.js` | Reports page HTML (report cards, recent reports log) |
| `pages/historical.js` | Historical Data page HTML |

---

## Pages

| Page | What it does |
|------|-------------|
| **Dashboard** | Overview with metric cards, a data-flow diagram, and status cards. |
| **Data Entry** | Three-tab hub: enter data by category, view the database, or check the activity log. |
| **Reports** | Generate QA reports (Faculty, Student, Scholarships, Research, R&E Personnel) and track recent exports. |
| **Historical Data** | Browse and compare records from past academic years. |

---

## JavaScript Modules (`app.js`)

| Module | Functions | What it does |
|--------|-----------|-------------|
| **1 · Data Source Status** | `setSourceStatus(id, state)` | Updates the connection dot and label in the sidebar for a given source (`'our'`, `'fos'`, `'osa'`, `'pivot'`, `'rne'`). |
| **2 · Initialisation** | `initQNekt()` | Runs on page load. Sets all source dots to "Not connected" and calculates the current academic year and semester from today's date. |
| **3 · Navigation** | `showPage(id)` | Switches the visible page and syncs the top nav bar and sidebar highlight. |
| **4 · Data Panel Tabs** | `showDataTab(tab, btn)` | Switches sub-panels inside a data entry form. |
| **5 · Database** | `showDbTab(tab, btn)` `viewDbRecords(tab)` | Switches between the four database tables and updates the status filter options per table. `viewDbRecords` navigates directly to a table from an entry card. |
| **6 · Activity Log** | `logActivity()` `renderActivity()` `clearActivityLog()` | Records every save, import, and export as a timestamped log entry and renders the filtered list. |
| **7 · Data Entry Hub** | `switchHubTab()` `openDataEntry()` `closeDataEntry()` | Controls the hub's three tabs and handles opening and closing individual data entry forms. |
| **8 · Reports** | `generateReport()` `exportReport()` `closeReportPreview()` `renderReportLog()` | Generates report previews, records export format selections, and renders the recent reports log. |
| **9 · Notifications** | `notify(msg, logType, logCat, logDetail)` | Shows a brief toast at the bottom-right of the screen. Automatically logs the action if activity details are provided. |

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
| `--green2` | `#1a8c32` | Success green — connected, saved |
| `--muted` | `#a0a4b5` | Labels and placeholder text |

---

## Backend Integration Checklist

When connecting a real backend, update these areas in `app.js`:

- [ ] Metric card values on the Dashboard
- [ ] Database table records
- [ ] Save and Import buttons in data entry forms
- [ ] Report document fields in `RPT_DOC`
- [ ] Export file generation in `exportReport()`
- [ ] Source dot status via `setSourceStatus(id, 'connected')`

---

*UPOU Quality Assurance Office · Q-Nekt Data Collection & Report System*
