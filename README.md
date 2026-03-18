# Q-Nekt — UPOU Quality Assurance System

A browser-based data collection and report generation system for the Quality Assurance Office of the University of the Philippines Open University (UPOU).

To run the system, open `index.html` in any modern browser. No server or installation required.

---

## File Overview

| File | Purpose |
|------|---------|
| `index.html` | Entry point. Loads all scripts and defines the page slots. |
| `styles.css` | All styling — colours, layout, and responsive breakpoints. |
| `shell.js` | HTML templates for the header, navigation bar, sidebar, and toast notification. |
| `app.js` | All UI logic: navigation, data entry, reports, activity log, notifications. |
| `db-crypto.js` | AES-256-GCM encryption using the browser's Web Crypto API. |
| `db.js` | IndexedDB database — six data stores, audit log, export/import. |
| `db-integration.js` | Connects the UI to the database: login modal, form save buttons, table rendering, metrics. |
| `loader.js` | Injects HTML templates into the page, then starts the app. |
| `pages/dashboard.js` | Dashboard page HTML |
| `pages/data-entry.js` | Data Entry page HTML |
| `pages/reports.js` | Reports page HTML |
| `pages/historical.js` | Historical Data page HTML |

---

## Pages

| Page | What it does |
|------|-------------|
| **Dashboard** | Live metric cards (students, faculty, researchers, reports generated), data flow diagram, repository summary tiles, and recent activity feed. |
| **Data Entry** | Three-tab hub: enter data by category, view/search/filter the database (6 tables), or check the session activity log. |
| **Reports** | Seven report types. Each has a PDF/Excel/CSV preview and exports a real file with live data from the database. |
| **Historical Data** | Data repository summary, metric cards, and four bar charts (Student, Faculty, Research, Retention) drawn from stored records. |

---

## Authentication & Encryption

- On first load, users create a **username and password**. Returning users log in with those credentials.
- Each user's password is run through **PBKDF2** (310,000 iterations) to derive an **AES-256-GCM** encryption key, cached in memory only.
- Every database record is encrypted before it is written to IndexedDB. Only the primary key (e.g. `facultyId`) is stored as plain text.
- Each user has isolated encryption keys in `localStorage` — one user cannot read another's data.
- The key is cleared from memory on logout. The data in IndexedDB is unreadable without the correct credentials.

> **Note:** Data is stored in the browser on the local machine. Clearing browser data will wipe the database. Use the **Export Backup** button to save an encrypted `.json` backup file.

---

## Database Stores

| Store | Key Field | Contents |
|-------|-----------|---------|
| `faculty` | `facultyId` | Faculty information records |
| `students` | `studentId` | Student information records |
| `research` | `personnelId` | Research & extension records |
| `scholarships` | `scholarshipId` | Scholarship records |
| `faculty_load` | auto | Faculty academic load records |
| `student_load` | auto | Student academic load records |
| `audit_log` | auto | Encrypted log of all creates, updates, deletes, and logins |

---

## JavaScript Modules (`app.js`)

| Module | What it does |
|--------|-------------|
| **1 · Init** | `initQNekt()` — runs on page load, sets the current academic year in the sidebar. |
| **2 · Navigation** | `showPage(id)` — switches the visible page and syncs the nav bar and sidebar. |
| **3 · Data Tabs** | `showDataTab(tab, btn)` — switches sub-panels inside a data entry form. |
| **4 · Database** | `showDbTab()`, `viewDbRecords()`, `dbQuickEnter()`, `dbQuickReport()` — database table switching and toolbar shortcuts. |
| **5 · Activity Log** | `logActivity()`, `renderActivity()`, `clearActivityLog()` — records saves/imports and renders the filtered activity list. |
| **6 · Data Entry Hub** | `switchHubTab()`, `openDataEntry()`, `closeDataEntry()`, `switchHistTab()` — hub tab control and form open/close. |
| **7 · Reports** | Full report lifecycle — preview, export (PDF download via jsPDF, Excel via SheetJS, CSV), and recent reports log. All exports include live data computed from the database. |
| **8 · Notifications** | `notify(msg, logType, logCat, logDetail)` — shows a brief toast. Logs to the activity log if type/category/detail are provided. |

---

## Colour Palette

| Variable | Value | Usage |
|----------|-------|-------|
| `--bg` | `#2c2f39` | Main background |
| `--bg2` | `#23262f` | Cards and sidebar |
| `--bg3` | `#1a1c23` | Inputs and deep backgrounds |
| `--header` | `#8a1538` | UPOU maroon — headers, primary buttons |
| `--gold` | `#f6ac1d` | Accent gold — active states, highlights |
| `--green2` | `#1a8c32` | Success green |
| `--muted` | `#a0a4b5` | Labels and placeholder text |

---

## Backend Integration Checklist

The current system stores all data locally in the browser. When connecting a real server backend:

- [ ] Replace `db.js` store calls with `fetch()` calls to your API endpoints
- [ ] Replace the login modal in `db-integration.js` with server-side session/JWT authentication
- [ ] Keep or adapt `db-crypto.js` for end-to-end encryption of sensitive fields before sending to the server
- [ ] Update `_computeReportData()` in `app.js` to pull from the API instead of IndexedDB

---

*UPOU Quality Assurance Office · Q-Nekt Data Collection & Report System*
