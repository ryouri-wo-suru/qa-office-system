/* ================================================================
   Q-Nekt · Page: SAR Build
   Data upload, records, matching, SAR field builder, docx export
   ================================================================ */

const SAR_BUILD_HTML = /* html */`
<div class="page" id="page-sar-build">

  <div class="page-hero">
    <div class="page-hero-title">SAR Build</div>
    <div class="page-hero-sub">Upload supporting data files and build SAR content by criterion — export as .docx</div>
  </div>
  <div class="deco-bar"></div>

  <!-- Sub-nav tabs -->
  <div class="de-hub-tabs" style="margin-bottom:1.4rem;">
    <button class="de-hub-tab active" onclick="switchBuildTab('upload', this)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
      Upload Data
    </button>
    <button class="de-hub-tab" onclick="switchBuildTab('records', this)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      Records
      <span class="de-hub-tab-badge" id="build-records-badge" style="display:none;">0</span>
    </button>
    <button class="de-hub-tab" onclick="switchBuildTab('match', this)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
      Data Matching
    </button>
    <button class="de-hub-tab" onclick="switchBuildTab('builder', this)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>
      SAR Builder
    </button>
  </div>

  <!-- UPLOAD TAB -->
  <div id="build-tab-upload" class="build-tab-panel active">
    <div style="background:var(--surface2);border:1px solid var(--border2);border-radius:12px;padding:1.4rem;margin-bottom:1.2rem;">
      <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:1rem;">Upload Department Data</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:14px;">
        <div>
          <div style="font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.7px;margin-bottom:6px;">Department</div>
          <select id="upload-dept" style="width:100%;background:var(--bg2);border:1px solid var(--border2);border-radius:8px;color:var(--text);font-size:13px;padding:9px 12px;outline:none;">
            <option value="">Select department…</option>
            <option>Academic Affairs</option>
            <option>Student Services</option>
            <option>Research &amp; Development</option>
            <option>Faculty &amp; Staff</option>
            <option>Curriculum Committee</option>
            <option>Quality Assurance Office</option>
            <option>Registrar</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <div style="font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.7px;margin-bottom:6px;">SAR Criterion (optional)</div>
          <select id="upload-criterion" style="width:100%;background:var(--bg2);border:1px solid var(--border2);border-radius:8px;color:var(--text);font-size:13px;padding:9px 12px;outline:none;">
            <option value="">General / Not criterion-specific</option>
            <option value="1">Criterion 1 – Expected Learning Outcomes</option>
            <option value="2">Criterion 2 – Programme Structure &amp; Content</option>
            <option value="3">Criterion 3 – Teaching &amp; Learning Approach</option>
            <option value="4">Criterion 4 – Student Assessment</option>
            <option value="5">Criterion 5 – Academic Staff</option>
            <option value="6">Criterion 6 – Student Support Services</option>
            <option value="7">Criterion 7 – Facilities &amp; Infrastructure</option>
            <option value="8">Criterion 8 – Output &amp; Outcomes</option>
          </select>
        </div>
      </div>
      <div style="margin-bottom:14px;">
        <div style="font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.7px;margin-bottom:6px;">Description</div>
        <input id="upload-desc" type="text" placeholder="Brief description of this dataset…" style="width:100%;background:var(--bg2);border:1px solid var(--border2);border-radius:8px;color:var(--text);font-size:13px;padding:9px 12px;outline:none;"/>
      </div>
      <div id="build-drop-zone" onclick="document.getElementById('build-file-input').click()"
           ondragover="buildHandleDragOver(event)" ondragleave="buildHandleDragLeave()" ondrop="buildHandleDrop(event)"
           style="border:2px dashed var(--border2);border-radius:10px;padding:32px 20px;text-align:center;cursor:pointer;transition:all .2s;">
        <div style="font-size:32px;margin-bottom:10px;">📂</div>
        <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:4px;">Drop files here or click to browse</div>
        <div style="font-size:11px;color:var(--muted);">Supports .xlsx, .xls, .csv, .txt, .json — max 10 MB</div>
      </div>
      <input type="file" id="build-file-input" accept=".xlsx,.xls,.csv,.txt,.json" multiple onchange="buildHandleFileSelect(event)" style="display:none;"/>
      <div id="build-file-preview" style="margin-top:12px;"></div>
      <div style="margin-top:14px;display:flex;gap:8px;">
        <button class="btn btn-primary" onclick="buildUploadFiles()" id="build-upload-btn" disabled style="font-size:13px;">Upload Files</button>
        <button class="btn btn-ghost" onclick="buildClearUpload()" style="font-size:13px;">Clear</button>
      </div>
    </div>
  </div>

  <!-- RECORDS TAB -->
  <div id="build-tab-records" class="build-tab-panel" style="display:none;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:10px;">
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <select id="build-filter-dept" style="background:var(--bg2);border:1px solid var(--border2);border-radius:8px;color:var(--text);font-size:12px;padding:7px 10px;outline:none;" onchange="buildRenderRecords()">
          <option value="">All Departments</option>
        </select>
        <select id="build-filter-crit" style="background:var(--bg2);border:1px solid var(--border2);border-radius:8px;color:var(--text);font-size:12px;padding:7px 10px;outline:none;" onchange="buildRenderRecords()">
          <option value="">All Criteria</option>
          <option value="1">C1</option><option value="2">C2</option><option value="3">C3</option>
          <option value="4">C4</option><option value="5">C5</option><option value="6">C6</option>
          <option value="7">C7</option><option value="8">C8</option>
        </select>
      </div>
    </div>
    <div style="background:var(--surface2);border:1px solid var(--border2);border-radius:12px;overflow:hidden;">
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <thead>
            <tr style="border-bottom:1px solid var(--border2);">
              <th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--muted);">File</th>
              <th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--muted);">Department</th>
              <th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--muted);">Criterion</th>
              <th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--muted);">Description</th>
              <th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--muted);">Rows</th>
              <th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--muted);">Date</th>
              <th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--muted);">Actions</th>
            </tr>
          </thead>
          <tbody id="build-records-body"></tbody>
        </table>
      </div>
      <div id="build-records-empty" class="act-empty" style="display:none;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <div>No records yet.</div>
        <div style="font-size:12px;color:var(--muted);margin-top:4px;">Upload data files from the Upload tab.</div>
      </div>
    </div>
  </div>

  <!-- MATCHING TAB -->
  <div id="build-tab-match" class="build-tab-panel" style="display:none;">
    <div style="background:var(--surface2);border:1px solid var(--border2);border-radius:12px;padding:1.4rem;margin-bottom:1.2rem;">
      <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:1rem;">Configure Matching</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:14px;">
        <div>
          <div style="font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.7px;margin-bottom:6px;">Source Dataset A</div>
          <select id="build-match-a" style="width:100%;background:var(--bg2);border:1px solid var(--border2);border-radius:8px;color:var(--text);font-size:13px;padding:9px 12px;outline:none;" onchange="buildRefreshMatchCols()"><option value="">Select record…</option></select>
        </div>
        <div>
          <div style="font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.7px;margin-bottom:6px;">Source Dataset B</div>
          <select id="build-match-b" style="width:100%;background:var(--bg2);border:1px solid var(--border2);border-radius:8px;color:var(--text);font-size:13px;padding:9px 12px;outline:none;" onchange="buildRefreshMatchCols()"><option value="">Select record…</option></select>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
        <div>
          <div style="font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.7px;margin-bottom:6px;">Match Key (Column A)</div>
          <select id="build-match-col-a" style="width:100%;background:var(--bg2);border:1px solid var(--border2);border-radius:8px;color:var(--text);font-size:13px;padding:9px 12px;outline:none;"><option value="">—</option></select>
        </div>
        <div>
          <div style="font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.7px;margin-bottom:6px;">Match Key (Column B)</div>
          <select id="build-match-col-b" style="width:100%;background:var(--bg2);border:1px solid var(--border2);border-radius:8px;color:var(--text);font-size:13px;padding:9px 12px;outline:none;"><option value="">—</option></select>
        </div>
      </div>
      <button class="btn btn-primary" onclick="buildRunMatch()" style="font-size:13px;">Run Match</button>
    </div>
    <div id="build-match-results"></div>
  </div>

  <!-- SAR BUILDER TAB -->
  <div id="build-tab-builder" class="build-tab-panel" style="display:none;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:10px;">
      <div style="font-size:12px;color:var(--muted);">Fill in SAR criteria content and export as a .docx report.</div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-ghost" onclick="buildAutoFill()" style="font-size:12px;padding:7px 14px;">⚡ Auto-fill from Data</button>
        <button class="btn btn-primary" onclick="buildExportDocx()" style="font-size:12px;padding:7px 16px;">📄 Export .docx</button>
      </div>
    </div>
    <div id="build-sar-tabs" class="de-hub-tabs" style="flex-wrap:wrap;gap:4px;margin-bottom:1rem;"></div>
    <div id="build-sar-panels"></div>
  </div>

  <!-- Record View Modal -->
  <div id="build-modal-view" style="position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:200;display:none;align-items:center;justify-content:center;padding:24px;">
    <div style="background:var(--surface);border:1px solid var(--border2);border-radius:14px;width:100%;max-width:900px;max-height:80vh;overflow-y:auto;">
      <div style="padding:20px 24px 0;display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <div id="build-modal-title" style="font-size:16px;font-weight:700;color:var(--text);"></div>
        <button onclick="document.getElementById('build-modal-view').style.display='none'" style="background:none;border:none;color:var(--muted);font-size:20px;cursor:pointer;">✕</button>
      </div>
      <div id="build-modal-body" style="padding:0 24px 24px;"></div>
    </div>
  </div>

</div>
`;

// SAR Build constants (matches sar_system.html)
const BUILD_SAR_CRITERIA = [
  { id: 1, name: 'Expected Learning Outcomes',    short: 'ELOs',
    fields: ['readiness','coverage_1_1','coverage_1_2','coverage_1_3','coverage_1_4','coverage_1_5','evaluation','evidence_summary'] },
  { id: 2, name: 'Programme Structure & Content', short: 'Structure',
    fields: ['readiness','coverage_summary','evaluation','stakeholder_data','benchmarking'] },
  { id: 3, name: 'Teaching & Learning Approach',  short: 'TLA',
    fields: ['readiness','coverage_summary','evaluation','active_learning_evidence','improvement_actions'] },
  { id: 4, name: 'Student Assessment',            short: 'Assessment',
    fields: ['readiness','coverage_summary','evaluation','policy_details','appeal_process'] },
  { id: 5, name: 'Academic Staff',                short: 'Staff',
    fields: ['readiness','coverage_summary','evaluation','staff_planning','workload_data','competency_matrix'] },
  { id: 6, name: 'Student Support Services',      short: 'Support',
    fields: ['readiness','coverage_summary','evaluation','services_list','monitoring_mechanism'] },
  { id: 7, name: 'Facilities & Infrastructure',   short: 'Facilities',
    fields: ['readiness','coverage_summary','evaluation','facilities_inventory','ict_resources'] },
  { id: 8, name: 'Output & Outcomes',             short: 'Outcomes',
    fields: ['readiness','coverage_summary','evaluation','graduation_data','employability_data','research_output','satisfaction_scores'] },
];

const BUILD_FIELD_LABELS = {
  readiness: 'SAR Readiness Decision',
  coverage_1_1: '1.1 Formulation, Alignment & Stakeholders',
  coverage_1_2: '1.2 Course Alignment (CLO to PLO)',
  coverage_1_3: '1.3 Generic & Subject-Specific Outcomes',
  coverage_1_4: '1.4 Stakeholder Requirements',
  coverage_1_5: '1.5 Achievement of ELOs',
  coverage_summary: 'Sub-requirement Coverage Summary',
  evaluation: 'Evaluation / Findings',
  evidence_summary: 'Evidence Summary',
  stakeholder_data: 'Stakeholder Feedback Data',
  benchmarking: 'Benchmarking Data',
  active_learning_evidence: 'Active Learning Evidence',
  improvement_actions: 'Documented Improvement Actions',
  policy_details: 'Assessment Policies & Procedures',
  appeal_process: 'Appeals Process',
  staff_planning: 'Staff Planning Documentation',
  workload_data: 'Workload Data & Monitoring',
  competency_matrix: 'Staff Competency Matrix',
  services_list: 'Student Services Inventory',
  monitoring_mechanism: 'Progress Monitoring Mechanism',
  facilities_inventory: 'Facilities Inventory',
  ict_resources: 'ICT Resources',
  graduation_data: 'Graduation / Enrollment Data',
  employability_data: 'Employability Data',
  research_output: 'Research Output Summary',
  satisfaction_scores: 'Stakeholder Satisfaction Scores',
};

const BUILD_DEPT_COLORS = {
  'Academic Affairs':'#4f9ef7','Student Services':'#3fb950','Research & Development':'#a371f7',
  'Faculty & Staff':'#f7924f','Curriculum Committee':'#f0883e','Quality Assurance Office':'#c9a84c',
  'Registrar':'#58c7d6','Other':'#8b949e'
};

// State
let buildDB = { records: [], sarData: {}, activity: [] };
let buildPendingFiles = [];

// Persist to localStorage
async function buildSaveDB() {
  try { localStorage.setItem('qnekt_sar_build', JSON.stringify(buildDB)); } catch(e) {}
}
function buildLoadDB() {
  try {
    const raw = localStorage.getItem('qnekt_sar_build');
    if (raw) buildDB = JSON.parse(raw);
  } catch(e) {}
}

// ── Tab switching ──
function switchBuildTab(tab, btn) {
  document.querySelectorAll('.build-tab-panel').forEach(p => p.style.display = 'none');
  document.getElementById('build-tab-' + tab).style.display = 'block';
  document.querySelectorAll('#page-sar-build .de-hub-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  if (tab === 'records') buildRenderRecords();
  if (tab === 'match')   buildRenderMatchSelects();
  if (tab === 'builder') buildRenderSARBuilder();
}

// ── File upload ──
function buildHandleDragOver(e) { e.preventDefault(); document.getElementById('build-drop-zone').style.borderColor = 'var(--header2)'; }
function buildHandleDragLeave()  { document.getElementById('build-drop-zone').style.borderColor = ''; }
function buildHandleDrop(e) {
  e.preventDefault(); buildHandleDragLeave();
  buildProcessFiles(Array.from(e.dataTransfer.files));
}
function buildHandleFileSelect(e) { buildProcessFiles(Array.from(e.target.files)); }

function buildProcessFiles(files) {
  buildPendingFiles = files.filter(f => f.size < 10_000_000);
  const el = document.getElementById('build-file-preview');
  if (!buildPendingFiles.length) { el.innerHTML = ''; document.getElementById('build-upload-btn').disabled = true; return; }
  el.innerHTML = buildPendingFiles.map(f => `
    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--surface2);border-radius:6px;margin-bottom:6px;">
      <span style="font-size:16px;">📄</span>
      <span style="font-size:12px;font-weight:600;color:var(--text);flex:1;">${f.name}</span>
      <span style="font-size:11px;color:var(--muted);">${(f.size/1024).toFixed(1)} KB</span>
    </div>`).join('');
  document.getElementById('build-upload-btn').disabled = false;
}

async function buildParseFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'csv' || ext === 'txt') {
      reader.onload = e => {
        const lines = e.target.result.split('\n').filter(l => l.trim());
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g,''));
        const rows = lines.slice(1).map(l => {
          const vals = l.split(',').map(v => v.trim().replace(/^"|"$/g,''));
          const obj = {}; headers.forEach((h,i) => obj[h] = vals[i] || ''); return obj;
        });
        resolve({ headers, rows, rowCount: rows.length });
      };
      reader.readAsText(file);
    } else if (['xlsx','xls'].includes(ext)) {
      reader.onload = e => {
        const wb = XLSX.read(e.target.result, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws, { defval: '' });
        const headers = data.length ? Object.keys(data[0]) : [];
        resolve({ headers, rows: data, rowCount: data.length });
      };
      reader.readAsArrayBuffer(file);
    } else if (ext === 'json') {
      reader.onload = e => {
        try {
          const parsed = JSON.parse(e.target.result);
          const arr = Array.isArray(parsed) ? parsed : [parsed];
          const headers = arr.length ? Object.keys(arr[0]) : [];
          resolve({ headers, rows: arr, rowCount: arr.length });
        } catch { resolve({ headers: [], rows: [], rowCount: 0 }); }
      };
      reader.readAsText(file);
    } else {
      resolve({ headers: [], rows: [], rowCount: 0 });
    }
  });
}

async function buildUploadFiles() {
  const dept = document.getElementById('upload-dept').value;
  const criterion = document.getElementById('upload-criterion').value;
  const desc = document.getElementById('upload-desc').value;
  if (!dept) { notify('Please select a department'); return; }
  if (!buildPendingFiles.length) { notify('No files selected'); return; }

  const btn = document.getElementById('build-upload-btn');
  btn.textContent = 'Uploading…'; btn.disabled = true;

  for (const file of buildPendingFiles) {
    const parsed = await buildParseFile(file);
    const record = {
      id: 'r' + Date.now() + Math.random().toString(36).slice(2),
      filename: file.name, dept, criterion: criterion || null, desc,
      uploadedAt: Date.now(), rowCount: parsed.rowCount,
      headers: parsed.headers, rows: parsed.rows.slice(0, 500),
    };
    buildDB.records.push(record);
    buildDB.activity.push({ msg: `Uploaded "${file.name}" from ${dept}`, ts: Date.now() });
  }

  await buildSaveDB();
  buildClearUpload();
  btn.textContent = 'Upload Files'; btn.disabled = false;
  buildUpdateRecordsBadge();
  refreshDashboard();
  notify('Files uploaded ✓', 'create', 'SAR Build', 'Files uploaded');
}

function buildClearUpload() {
  buildPendingFiles = [];
  document.getElementById('build-file-preview').innerHTML = '';
  document.getElementById('build-file-input').value = '';
  document.getElementById('build-upload-btn').disabled = true;
}

function buildUpdateRecordsBadge() {
  const badge = document.getElementById('build-records-badge');
  if (!badge) return;
  const n = buildDB.records.length;
  badge.textContent = n; badge.style.display = n > 0 ? 'inline-flex' : 'none';
}

// ── Records ──
function buildRenderRecords() {
  const deptF = document.getElementById('build-filter-dept').value;
  const critF  = document.getElementById('build-filter-crit').value;
  const filtered = buildDB.records.filter(r =>
    (!deptF || r.dept === deptF) && (!critF || r.criterion == critF)
  );
  const tbody = document.getElementById('build-records-body');
  const empty = document.getElementById('build-records-empty');
  if (!filtered.length) { tbody.innerHTML = ''; empty.style.display = 'flex'; return; }
  empty.style.display = 'none';
  tbody.innerHTML = filtered.map(r => {
    const color = BUILD_DEPT_COLORS[r.dept] || '#8b949e';
    const critLabel = r.criterion ? `C${r.criterion}` : '—';
    return `<tr style="border-bottom:1px solid var(--border2);">
      <td style="padding:10px 14px;font-size:12px;color:var(--gold);">${r.filename}</td>
      <td style="padding:10px 14px;font-size:12px;">
        <span style="display:inline-flex;align-items:center;gap:5px;">
          <span style="width:7px;height:7px;border-radius:50%;background:${color};flex:none;"></span>${r.dept}
        </span>
      </td>
      <td style="padding:10px 14px;">
        ${critLabel !== '—' ? `<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;background:rgba(138,21,56,0.2);color:var(--header2);">${critLabel}</span>` : '<span style="color:var(--muted);font-size:12px;">—</span>'}
      </td>
      <td style="padding:10px 14px;font-size:11px;color:var(--muted);max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${r.desc || '—'}</td>
      <td style="padding:10px 14px;font-size:12px;color:var(--gold);">${r.rowCount}</td>
      <td style="padding:10px 14px;font-size:11px;color:var(--muted);">${new Date(r.uploadedAt).toLocaleDateString()}</td>
      <td style="padding:10px 14px;display:flex;gap:6px;">
        <button class="btn btn-ghost" style="padding:4px 10px;font-size:11px;" onclick="buildViewRecord('${r.id}')">View</button>
        <button style="background:transparent;border:1px solid rgba(220,60,60,0.4);color:#e05a78;border-radius:6px;padding:4px 10px;font-size:11px;cursor:pointer;" onclick="buildDeleteRecord('${r.id}')">Delete</button>
      </td>
    </tr>`;
  }).join('');

  // refresh dept filter options
  const depts = [...new Set(buildDB.records.map(r => r.dept))].filter(Boolean);
  const fd = document.getElementById('build-filter-dept');
  const cur = fd.value;
  fd.innerHTML = '<option value="">All Departments</option>' + depts.map(d => `<option${d===cur?' selected':''}>${d}</option>`).join('');
}

function buildViewRecord(id) {
  const r = buildDB.records.find(x => x.id === id);
  if (!r) return;
  document.getElementById('build-modal-title').textContent = r.filename;
  if (!r.headers.length) {
    document.getElementById('build-modal-body').innerHTML = '<div class="act-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg><div>No tabular data extracted</div></div>';
  } else {
    const rows = r.rows.slice(0, 50);
    document.getElementById('build-modal-body').innerHTML = `
      <div style="font-size:12px;color:var(--muted);margin-bottom:10px;">Showing up to 50 of ${r.rowCount} rows · ${r.headers.length} columns</div>
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:12px;">
          <thead><tr>${r.headers.map(h=>`<th style="padding:8px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--muted);border-bottom:1px solid var(--border2);">${h}</th>`).join('')}</tr></thead>
          <tbody>${rows.map(row=>`<tr style="border-bottom:1px solid var(--border2);">${r.headers.map(h=>`<td style="padding:8px 12px;color:var(--text);">${row[h]??''}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </div>`;
  }
  document.getElementById('build-modal-view').style.display = 'flex';
}

async function buildDeleteRecord(id) {
  if (!confirm('Delete this record?')) return;
  buildDB.records = buildDB.records.filter(r => r.id !== id);
  await buildSaveDB();
  buildRenderRecords(); buildUpdateRecordsBadge(); refreshDashboard();
  notify('Record deleted');
}

// ── Data Matching ──
function buildRenderMatchSelects() {
  const opts = buildDB.records.map(r => `<option value="${r.id}">${r.filename} (${r.dept})</option>`).join('');
  document.getElementById('build-match-a').innerHTML = '<option value="">Select record…</option>' + opts;
  document.getElementById('build-match-b').innerHTML = '<option value="">Select record…</option>' + opts;
}

function buildRefreshMatchCols() {
  const aId = document.getElementById('build-match-a').value;
  const bId = document.getElementById('build-match-b').value;
  const ra = buildDB.records.find(r => r.id === aId);
  const rb = buildDB.records.find(r => r.id === bId);
  document.getElementById('build-match-col-a').innerHTML = '<option value="">—</option>' + (ra?.headers||[]).map(h=>`<option>${h}</option>`).join('');
  document.getElementById('build-match-col-b').innerHTML = '<option value="">—</option>' + (rb?.headers||[]).map(h=>`<option>${h}</option>`).join('');
}

function buildRunMatch() {
  const aId  = document.getElementById('build-match-a').value;
  const bId  = document.getElementById('build-match-b').value;
  const colA = document.getElementById('build-match-col-a').value;
  const colB = document.getElementById('build-match-col-b').value;
  if (!aId || !bId || !colA || !colB) { notify('Select both records and match keys'); return; }
  const ra = buildDB.records.find(r => r.id === aId);
  const rb = buildDB.records.find(r => r.id === bId);
  const mapB = {};
  rb.rows.forEach(row => { mapB[String(row[colB]||'').trim().toLowerCase()] = row; });
  const matched = [], unmatched = [];
  ra.rows.forEach(rowA => {
    const key = String(rowA[colA]||'').trim().toLowerCase();
    if (mapB[key]) matched.push({ keyVal: rowA[colA], rowA, rowB: mapB[key] });
    else unmatched.push(rowA);
  });
  const allCols = [...new Set([...ra.headers, ...rb.headers])].slice(0, 10);
  document.getElementById('build-match-results').innerHTML = `
    <div style="background:var(--surface2);border:1px solid var(--border2);border-radius:12px;padding:1.2rem;margin-top:1rem;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:8px;">
        <div>
          <div style="font-size:13px;font-weight:700;color:var(--text);">Match Results</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px;">${matched.length} matched · ${unmatched.length} unmatched</div>
        </div>
        <div style="display:flex;gap:8px;">
          <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;background:rgba(14,96,33,0.25);color:var(--green2);border:1px solid rgba(14,96,33,0.4);">${matched.length} matches</span>
          <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;background:rgba(220,60,60,0.15);color:#e05a78;border:1px solid rgba(220,60,60,0.3);">${unmatched.length} unmatched</span>
        </div>
      </div>
      <div class="de-hub-tabs" style="margin-bottom:1rem;">
        <button class="de-hub-tab active" onclick="switchBuildMatchTab(this,'bmt-matched')">Matched (${matched.length})</button>
        <button class="de-hub-tab" onclick="switchBuildMatchTab(this,'bmt-unmatched')">Unmatched (${unmatched.length})</button>
      </div>
      <div id="bmt-matched" style="overflow-x:auto;">
        ${matched.length ? `<table style="width:100%;border-collapse:collapse;font-size:12px;">
          <thead><tr><th style="padding:8px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);border-bottom:1px solid var(--border2);">Key</th>${allCols.map(c=>`<th style="padding:8px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);border-bottom:1px solid var(--border2);">${c}</th>`).join('')}</tr></thead>
          <tbody>${matched.slice(0,100).map(m=>`<tr style="border-bottom:1px solid var(--border2);"><td style="padding:8px 12px;color:var(--gold);font-weight:600;">${m.keyVal}</td>${allCols.map(c=>`<td style="padding:8px 12px;color:var(--text);">${m.rowA[c]!==undefined?m.rowA[c]:(m.rowB[c]!==undefined?`<span style="color:var(--gold);">${m.rowB[c]}</span>`:'')}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>` : '<div class="act-empty"><div>No matches found</div></div>'}
      </div>
      <div id="bmt-unmatched" style="display:none;overflow-x:auto;">
        ${unmatched.length ? `<table style="width:100%;border-collapse:collapse;font-size:12px;">
          <thead><tr>${ra.headers.slice(0,10).map(h=>`<th style="padding:8px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);border-bottom:1px solid var(--border2);">${h}</th>`).join('')}</tr></thead>
          <tbody>${unmatched.slice(0,100).map(row=>`<tr style="border-bottom:1px solid var(--border2);">${ra.headers.slice(0,10).map(h=>`<td style="padding:8px 12px;color:var(--text);">${row[h]??''}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>` : '<div class="act-empty"><div>All rows matched!</div></div>'}
      </div>
    </div>`;
}

function switchBuildMatchTab(btn, panelId) {
  ['bmt-matched','bmt-unmatched'].forEach(id => { const el = document.getElementById(id); if(el) el.style.display='none'; });
  document.querySelectorAll('#build-match-results .de-hub-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const target = document.getElementById(panelId); if (target) target.style.display = '';
}

// ── SAR Builder ──
function buildRenderSARBuilder() {
  const tabsEl   = document.getElementById('build-sar-tabs');
  const panelsEl = document.getElementById('build-sar-panels');
  if (!tabsEl || !panelsEl) return;

  tabsEl.innerHTML = BUILD_SAR_CRITERIA.map((c,i) => {
    const data = buildDB.sarData[c.id] || {};
    const filled = c.fields.filter(f => data[f]?.trim?.()).length;
    const pct = Math.round(filled / c.fields.length * 100);
    const col = pct===100?'var(--green2)':pct>0?'var(--gold)':'rgba(220,60,60,0.8)';
    return `<button class="de-hub-tab${i===0?' active':''}" onclick="switchBuildSARTab(this,'bsar-c${c.id}')">
      <span style="width:6px;height:6px;border-radius:50%;background:${col};display:inline-block;flex-shrink:0;"></span>
      C${c.id}: ${c.short}
    </button>`;
  }).join('');

  panelsEl.innerHTML = BUILD_SAR_CRITERIA.map((c,i) => {
    const data = buildDB.sarData[c.id] || {};
    return `
    <div id="bsar-c${c.id}" style="${i===0?'':'display:none;'}">
      <div style="background:var(--surface2);border:1px solid var(--border2);border-radius:12px;padding:1.4rem;">
        <div style="font-size:14px;font-weight:700;color:var(--header2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:1rem;">
          AUN-QA v4 Criterion ${c.id} — ${c.name}
        </div>
        ${c.fields.map(f => `
          <div style="margin-bottom:1rem;">
            <div style="font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.7px;margin-bottom:6px;">${BUILD_FIELD_LABELS[f] || f}</div>
            ${f==='readiness'
              ? `<select id="bsar_${c.id}_${f}" onchange="buildSaveSARField(${c.id},'${f}',this.value)" style="width:100%;max-width:320px;background:var(--bg2);border:1px solid var(--border2);border-radius:8px;color:var(--text);font-size:13px;padding:9px 12px;outline:none;">
                  <option value="">— Select —</option>
                  <option${data[f]==='Ready'?' selected':''}>Ready</option>
                  <option${data[f]==='Needs minor revision'?' selected':''}>Needs minor revision</option>
                  <option${data[f]==='Needs immediate attention'?' selected':''}>Needs immediate attention</option>
                </select>`
              : `<textarea id="bsar_${c.id}_${f}" rows="4" placeholder="Enter content for ${BUILD_FIELD_LABELS[f]||f}…" onchange="buildSaveSARField(${c.id},'${f}',this.value)" style="width:100%;background:var(--bg2);border:1px solid var(--border2);border-radius:8px;color:var(--text);font-size:13px;padding:10px 12px;outline:none;resize:vertical;line-height:1.6;font-family:inherit;">${(data[f]||'').replace(/</g,'&lt;')}</textarea>`}
          </div>`).join('')}
        <div style="display:flex;gap:8px;justify-content:flex-end;padding-top:8px;border-top:1px solid var(--border2);">
          <button class="btn btn-ghost" style="font-size:12px;" onclick="buildClearCriterion(${c.id})">Clear C${c.id}</button>
          <button class="btn btn-primary" style="font-size:12px;" onclick="buildSaveCriterion(${c.id})">💾 Save C${c.id}</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function switchBuildSARTab(btn, panelId) {
  BUILD_SAR_CRITERIA.forEach(c => {
    const el = document.getElementById('bsar-c' + c.id);
    if (el) el.style.display = 'none';
  });
  document.querySelectorAll('#build-sar-tabs .de-hub-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const target = document.getElementById(panelId); if (target) target.style.display = '';
}

function buildSaveSARField(cid, field, value) {
  if (!buildDB.sarData[cid]) buildDB.sarData[cid] = {};
  buildDB.sarData[cid][field] = value;
}

async function buildSaveCriterion(cid) {
  const c = BUILD_SAR_CRITERIA.find(x => x.id === cid);
  if (!buildDB.sarData[cid]) buildDB.sarData[cid] = {};
  c.fields.forEach(f => {
    const el = document.getElementById(`bsar_${cid}_${f}`);
    if (el) buildDB.sarData[cid][f] = el.value;
  });
  await buildSaveDB();
  buildRenderSARBuilder();
  refreshDashboard();
  notify('Criterion ' + cid + ' saved ✓');
}

async function buildClearCriterion(cid) {
  if (!confirm(`Clear all data for Criterion ${cid}?`)) return;
  buildDB.sarData[cid] = {};
  await buildSaveDB();
  buildRenderSARBuilder();
  refreshDashboard();
  notify('Criterion ' + cid + ' cleared');
}

function buildAutoFill() {
  let filled = 0;
  buildDB.records.forEach(r => {
    if (!r.criterion) return;
    const cid = parseInt(r.criterion);
    if (!buildDB.sarData[cid]) buildDB.sarData[cid] = {};
    const currentEval = buildDB.sarData[cid]['evaluation'] || '';
    const dataSummary = `[Auto-filled from ${r.filename}]\nDepartment: ${r.dept}\nRows: ${r.rowCount}\nColumns: ${r.headers.join(', ')}\n\n${currentEval}`;
    if (!currentEval.includes(r.filename)) {
      buildDB.sarData[cid]['evaluation'] = dataSummary;
      filled++;
    }
    if (r.headers.some(h => /graduat|enroll|complet/i.test(h)) && !buildDB.sarData[cid]['graduation_data']) {
      const sample = r.rows.slice(0,5).map(row => r.headers.map(h=>`${h}: ${row[h]}`).join(' | ')).join('\n');
      buildDB.sarData[cid]['graduation_data'] = `[From ${r.filename}]\n${sample}`;
    }
  });
  buildSaveDB();
  buildRenderSARBuilder();
  refreshDashboard();
  notify(filled ? `Auto-filled ${filled} field(s)` : 'No new auto-fill candidates found');
}

// ── Export .docx ──
function buildExportDocx() {
  function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  const today = new Date().toLocaleDateString('en-PH', { year:'numeric', month:'long', day:'numeric' });
  let body = '';
  body += `<w:p><w:pPr><w:pStyle w:val="Title"/></w:pPr><w:r><w:t>Self-Assessment Report (SAR)</w:t></w:r></w:p>`;
  body += `<w:p><w:pPr><w:pStyle w:val="Subtitle"/></w:pPr><w:r><w:t>AUN-QA Version 4 | Generated: ${esc(today)}</w:t></w:r></w:p>`;
  body += `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;

  BUILD_SAR_CRITERIA.forEach(c => {
    const data = buildDB.sarData[c.id] || {};
    body += `<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>Criterion ${c.id}: ${esc(c.name)}</w:t></w:r></w:p>`;
    c.fields.forEach(f => {
      const val = data[f] || '';
      body += `<w:p><w:pPr><w:pStyle w:val="Heading3"/></w:pPr><w:r><w:t>${esc(BUILD_FIELD_LABELS[f]||f)}</w:t></w:r></w:p>`;
      if (val.trim()) {
        val.split('\n').forEach(line => { body += `<w:p><w:r><w:t xml:space="preserve">${esc(line)}</w:t></w:r></w:p>`; });
      } else {
        body += `<w:p><w:r><w:rPr><w:color w:val="999999"/></w:rPr><w:t>[Not filled]</w:t></w:r></w:p>`;
      }
    });
    const relFiles = buildDB.records.filter(r => r.criterion == c.id);
    if (relFiles.length) {
      body += `<w:p><w:pPr><w:pStyle w:val="Heading3"/></w:pPr><w:r><w:t>Supporting Data Files</w:t></w:r></w:p>`;
      relFiles.forEach(rf => { body += `<w:p><w:r><w:t xml:space="preserve">• ${esc(rf.filename)} — ${esc(rf.dept)} (${rf.rowCount} rows)</w:t></w:r></w:p>`; });
    }
    body += `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
  });

  const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr></w:body></w:document>`;
  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:sz w:val="24"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:rPr><w:b/><w:sz w:val="52"/></w:rPr><w:pPr><w:jc w:val="center"/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/><w:rPr><w:sz w:val="28"/><w:color w:val="666666"/></w:rPr><w:pPr><w:jc w:val="center"/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:rPr><w:b/><w:sz w:val="36"/><w:color w:val="8A1538"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:rPr><w:b/><w:sz w:val="24"/><w:color w:val="44546A"/></w:rPr></w:style></w:styles>`;
  const contentTypes = `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>`;
  const rels = `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
  const wordRels = `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;

  const enc = new TextEncoder();
  function crc32b(data){ let c=0xFFFFFFFF; for(let i=0;i<data.length;i++){c^=data[i];for(let j=0;j<8;j++)c=(c>>>1)^((c&1)?0xEDB88320:0);} return (c^0xFFFFFFFF)>>>0; }
  function concatU8(...arrays){ const t=arrays.reduce((s,a)=>s+a.byteLength,0),o=new Uint8Array(t);let off=0;for(const a of arrays){o.set(a,off);off+=a.byteLength;}return o; }
  function makeZip(files){
    const parts=[],cd=[];let off=0;
    const now=new Date(),dosDate=((now.getFullYear()-1980)<<9)|((now.getMonth()+1)<<5)|now.getDate(),dosTime=(now.getHours()<<11)|(now.getMinutes()<<5)|(now.getSeconds()>>1);
    for(const [name,content] of Object.entries(files)){
      const nb=enc.encode(name),db=enc.encode(content),crc=crc32b(db),l=new Uint8Array(30+nb.length),lv=new DataView(l.buffer);
      lv.setUint32(0,0x04034b50,true);lv.setUint16(4,20,true);lv.setUint16(6,0,true);lv.setUint16(8,0,true);
      lv.setUint16(10,dosTime,true);lv.setUint16(12,dosDate,true);lv.setUint32(14,crc,true);
      lv.setUint32(18,db.length,true);lv.setUint32(22,db.length,true);lv.setUint16(26,nb.length,true);l.set(nb,30);
      parts.push(l,db);
      const c=new Uint8Array(46+nb.length),cv=new DataView(c.buffer);
      cv.setUint32(0,0x02014b50,true);cv.setUint16(4,20,true);cv.setUint16(6,20,true);cv.setUint16(8,0,true);cv.setUint16(10,0,true);
      cv.setUint16(12,dosTime,true);cv.setUint16(14,dosDate,true);cv.setUint32(16,crc,true);
      cv.setUint32(20,db.length,true);cv.setUint32(24,db.length,true);cv.setUint16(28,nb.length,true);cv.setUint32(42,off,true);
      c.set(nb,46);cd.push(c);off+=l.byteLength+db.byteLength;
    }
    const cdb=concatU8(...cd),eocd=new Uint8Array(22),ev=new DataView(eocd.buffer);
    ev.setUint32(0,0x06054b50,true);ev.setUint16(8,cd.length,true);ev.setUint16(10,cd.length,true);
    ev.setUint32(12,cdb.byteLength,true);ev.setUint32(16,off,true);
    return concatU8(...parts,cdb,eocd);
  }

  const zip = makeZip({
    '[Content_Types].xml': contentTypes,
    '_rels/.rels': rels,
    'word/document.xml': docXml,
    'word/_rels/document.xml.rels': wordRels,
    'word/styles.xml': styles,
  });

  const blob = new Blob([zip], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `SAR_Build_${new Date().toISOString().slice(0,10)}.docx`;
  a.click();
  buildDB.activity.push({ msg: 'Exported SAR .docx', ts: Date.now() });
  buildSaveDB();
  notify('SAR .docx exported ✓');
}

// ── Dashboard refresh helper (called from sar-dashboard.js functions) ──
function refreshDashboard() {
  // Build progress
  const buildEl = document.getElementById('dash-build-pct');
  const buildBarsEl = document.getElementById('dash-build-bars');
  if (buildEl) {
    const totalFields = BUILD_SAR_CRITERIA.reduce((a,c) => a + c.fields.length, 0);
    const filledFields = BUILD_SAR_CRITERIA.reduce((a,c) => {
      const data = buildDB.sarData[c.id] || {};
      return a + c.fields.filter(f => data[f]?.trim?.()).length;
    }, 0);
    const pct = totalFields ? Math.round(filledFields/totalFields*100) : 0;
    buildEl.textContent = pct + '%';
  }
  if (buildBarsEl) {
    buildBarsEl.innerHTML = BUILD_SAR_CRITERIA.map(c => {
      const data = buildDB.sarData[c.id] || {};
      const filled = c.fields.filter(f => data[f]?.trim?.()).length;
      const pct = Math.round(filled / c.fields.length * 100);
      const col = pct===100?'var(--green2)':pct>0?'var(--gold)':'rgba(220,60,60,0.6)';
      return `<div style="margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px;">
          <span style="color:var(--muted);">C${c.id}: ${c.short}</span>
          <span style="color:${col};">${pct}%</span>
        </div>
        <div style="height:4px;background:var(--border2);border-radius:2px;overflow:hidden;">
          <div style="height:100%;background:${col};border-radius:2px;width:${pct}%;transition:width .3s;"></div>
        </div>
      </div>`;
    }).join('');
  }

  // Files count
  const filesEl = document.getElementById('dash-files');
  if (filesEl) filesEl.textContent = buildDB.records.length;
}
