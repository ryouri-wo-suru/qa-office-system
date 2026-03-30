/* ================================================================
   Q-Nekt · Page: SAR Review
   AUN-QA v4 Criteria Evaluation — status, justification, narrative, PDF export
   ================================================================ */

const SAR_REVIEW_HTML = /* html */`
<div class="page" id="page-sar-review">

  <!-- BACK / Header -->
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:1.4rem;flex-wrap:wrap;">
    <div>
      <div class="page-hero-title" style="font-size:22px;">SAR Review</div>
      <div class="page-hero-sub" style="margin-top:2px;">AUN-QA v4 Criteria Evaluation — Programme Level</div>
    </div>
    <div style="margin-left:auto;display:flex;gap:8px;flex-wrap:wrap;">
      <button class="btn btn-ghost" style="font-size:12px;padding:7px 14px;display:flex;align-items:center;gap:6px;" onclick="reviewSaveDraft()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px;"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 12 7 12 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        Save Draft
      </button>
      <button class="btn btn-primary" style="font-size:12px;padding:7px 16px;display:flex;align-items:center;gap:6px;" onclick="reviewExportPDF()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px;"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>
        Export PDF
      </button>
    </div>
  </div>
  <div class="deco-bar"></div>

  <!-- Programme Info Bar -->
  <div style="background:rgba(138,21,56,0.12);border:1px solid rgba(138,21,56,0.3);border-radius:10px;padding:1rem 1.4rem;margin-bottom:1.6rem;display:flex;align-items:center;gap:2rem;flex-wrap:wrap;">
    <div>
      <div style="font-size:10px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.7px;margin-bottom:3px;">Degree Programme</div>
      <input id="review-programme" type="text" placeholder="e.g. Master in Public Management" style="background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,0.15);color:var(--text);font-size:14px;font-weight:600;outline:none;min-width:220px;padding-bottom:2px;" />
    </div>
    <div style="width:1px;height:32px;background:rgba(255,255,255,0.1);flex-shrink:0;"></div>
    <div>
      <div style="font-size:10px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.7px;margin-bottom:3px;">Faculty</div>
      <input id="review-faculty" type="text" placeholder="e.g. Faculty of Information and Communication Studies" style="background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,0.15);color:var(--text);font-size:13px;font-weight:500;outline:none;min-width:200px;padding-bottom:2px;" />
    </div>
    <div style="width:1px;height:32px;background:rgba(255,255,255,0.1);flex-shrink:0;"></div>
    <div>
      <div style="font-size:10px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.7px;margin-bottom:3px;">Academic Year</div>
      <div style="font-size:14px;font-weight:600;color:var(--text);" id="review-ay">—</div>
    </div>
    <div style="width:1px;height:32px;background:rgba(255,255,255,0.1);flex-shrink:0;"></div>
    <div>
      <div style="font-size:10px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.7px;margin-bottom:3px;">Date Prepared</div>
      <div style="font-size:14px;font-weight:600;color:var(--text);" id="review-date">—</div>
    </div>
    <div style="width:1px;height:32px;background:rgba(255,255,255,0.1);flex-shrink:0;"></div>
    <div style="margin-left:auto;display:flex;align-items:center;gap:10px;">
      <div style="font-size:11px;color:var(--muted);">Overall Readiness:</div>
      <span id="review-overall-badge" style="font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;background:rgba(160,164,181,0.15);color:var(--muted);">Calculating…</span>
    </div>
  </div>

  <!-- Criterion Tabs -->
  <div id="review-criterion-tabs" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:1.4rem;"></div>

  <!-- Criterion Content Panels -->
  <div id="review-criterion-panels"></div>

</div>
`;

// ── SAR Review Constants ──
const REVIEW_CRITERIA = [
  { id: 'c1', number: 1, title: 'Expected Learning Outcomes', subReqs: [
    { id: '1.1', label: 'Formulation, Alignment & Stakeholders', desc: 'The programme to show that the expected learning outcomes are appropriately formulated in accordance with an established learning taxonomy, are aligned to the vision and mission of the university, and are known to all stakeholders.' },
    { id: '1.2', label: 'Course Alignment (CLO to PLO)', desc: 'The programme to show that the expected learning outcomes for all courses are appropriately formulated and are aligned to the expected learning outcomes of the programme.' },
    { id: '1.3', label: 'Generic & Subject-Specific Outcomes', desc: 'The programme to show that the expected learning outcomes consist of both generic outcomes and subject specific outcomes.' },
    { id: '1.4', label: 'Stakeholder Requirements', desc: 'The programme to show that the expected learning outcomes are clearly aligned with the requirements of the stakeholders.' },
    { id: '1.5', label: 'Achievement of ELOs', desc: 'The programme to show directly the achievement of the expected learning outcomes.' },
  ]},
  { id: 'c2', number: 2, title: 'Programme Structure and Content', subReqs: [
    { id: '2.1', label: 'Specifications Comprehensive / Up-to-date / Available', desc: 'The programme specifications are shown to be comprehensive, current, and available to all stakeholders via appropriate channels.' },
    { id: '2.2', label: 'Constructive Alignment (ELOs / CLOs / Activities / Assessments)', desc: 'The programme to show that teaching, learning, and assessment activities are constructively aligned to achieving the expected learning outcomes.' },
    { id: '2.3', label: 'Stakeholder Feedback Included in Design', desc: 'The programme content is shown to have been designed with input from external stakeholders including employers, alumni, and industry partners.' },
    { id: '2.4', label: 'Course Contribution to ELOs is Clear', desc: "Each course's contribution to the achievement of the expected programme learning outcomes is shown to be clear." },
    { id: '2.5', label: 'Logical Structure, Sequencing & Integration', desc: 'The programme structure is shown to have a logical structure, appropriate sequencing, and integration of courses.' },
    { id: '2.6', label: 'Option for Major and/or Minor Specialisations', desc: 'The programme to show that there are options for major and/or minor specialisations where applicable.' },
    { id: '2.7', label: 'Periodic Review & Industry Relevance', desc: 'The programme is shown to be periodically reviewed for relevance to industry and benchmarked against peer programmes.' },
  ]},
  { id: 'c3', number: 3, title: 'Teaching and Learning Approach', subReqs: [
    { id: '3.1', label: 'Philosophy Articulation', desc: 'The teaching and learning philosophy and approach are shown to be well articulated and communicated to all stakeholders.' },
    { id: '3.2', label: 'Student Participation', desc: 'The teaching and learning activities are shown to allow students to participate responsibly in the learning process.' },
    { id: '3.3', label: 'Active Learning', desc: 'The teaching and learning activities are shown to involve active learning by the students.' },
    { id: '3.4', label: 'Life-long Learning', desc: 'The teaching and learning activities are shown to promote learning, learning how to learn, and instilling a commitment for life-long learning.' },
    { id: '3.5', label: 'Innovation & Entrepreneurship', desc: 'The teaching and learning activities are shown to inculcate new ideas, creative thought, innovation, and an entrepreneurial mindset.' },
    { id: '3.6', label: 'Continuous Improvement', desc: 'The teaching and learning processes are shown to be continuously improved to ensure their relevance to the needs of industry.' },
  ]},
  { id: 'c4', number: 4, title: 'Student Assessment', subReqs: [
    { id: '4.1', label: 'Variety & Alignment', desc: 'A variety of assessment methods are shown to be used and constructively aligned to achieving the expected learning outcomes.' },
    { id: '4.2', label: 'Policies & Appeals', desc: 'The assessment and assessment-appeal policies are shown to be explicit, communicated to students, and applied consistently.' },
    { id: '4.3', label: 'Standards & Progression', desc: 'The assessment standards and procedures for student progression and degree completion are shown to be explicit and applied consistently.' },
    { id: '4.4', label: 'Rubrics & Reliability', desc: 'The assessment methods are shown to include rubrics, marking schemes, timelines, and regulations that ensure validity, reliability, and fairness.' },
    { id: '4.5', label: 'Measuring ELOs', desc: 'The assessment methods are shown to measure the achievement of the expected learning outcomes of the programme and its courses.' },
    { id: '4.6', label: 'Timely Feedback', desc: 'Feedback of student assessment is shown to be provided in a timely manner.' },
    { id: '4.7', label: 'Continuous Review', desc: 'The student assessment and its processes are shown to be continuously reviewed and improved.' },
  ]},
  { id: 'c5', number: 5, title: 'Academic Staff', subReqs: [
    { id: '5.1', label: 'Staff Planning', desc: 'The programme to show that academic staff planning is carried out to ensure the quality and quantity of academic staff fulfil the needs for education, research, and service.' },
    { id: '5.2', label: 'Workload', desc: 'The programme to show that staff workload is measured and monitored to improve the quality of education, research, and service.' },
    { id: '5.3', label: 'Competencies', desc: 'The programme to show that the competences of the academic staff are determined, evaluated, and communicated.' },
    { id: '5.4', label: 'Duties / Allocation', desc: 'The programme to show that the duties allocated to the academic staff are appropriate to qualifications, experience, and aptitude.' },
    { id: '5.5', label: 'Promotion / Merit', desc: 'The programme to show that promotion of the academic staff is based on a merit system which accounts for teaching, research, and service.' },
    { id: '5.6', label: 'Ethics / Rights', desc: 'The programme to show that the rights, privileges, roles and accountability of the academic staff are well defined and understood.' },
    { id: '5.7', label: 'Training / Dev', desc: 'The programme to show that training and developmental needs of the academic staff are systematically identified and fulfilled.' },
    { id: '5.8', label: 'Performance Mgmt', desc: 'The programme to show that performance management including reward and recognition is implemented to assess academic staff quality.' },
  ]},
  { id: 'c6', number: 6, title: 'Student Support Services', subReqs: [
    { id: '6.1', label: 'Intake & Admission', desc: 'The student intake policy, admission criteria, and admission procedures to the programme are shown to be clearly defined, communicated, and up-to-date.' },
    { id: '6.2', label: 'Service Planning', desc: 'Both short-term and long-term planning of academic and non-academic support services are shown to ensure sufficiency and quality.' },
    { id: '6.3', label: 'Monitoring Progress', desc: 'An adequate system is shown to exist for student progress, academic performance, and workload monitoring. Feedback to students and corrective actions are made where necessary.' },
    { id: '6.4', label: 'Co-curricular / Employability', desc: 'Co-curricular activities, student competition, and other student support services are shown to be available to improve learning experience and employability.' },
    { id: '6.5', label: 'Support Staff Competence', desc: 'The competences of the support staff rendering student services are shown to be identified for recruitment and deployment.' },
    { id: '6.6', label: 'Evaluation & Enhancement', desc: 'Student support services are shown to be subjected to evaluation, benchmarking, and enhancement.' },
  ]},
  { id: 'c7', number: 7, title: 'Facilities and Infrastructures', subReqs: [
    { id: '7.1', label: 'Physical Resources & Technology', desc: 'The physical resources to deliver the curriculum, including equipment, material, and information technology, are shown to be sufficient.' },
    { id: '7.2', label: 'Laboratories & Equipment', desc: 'The laboratories and equipment are shown to be up-to-date, readily available, and effectively deployed.' },
    { id: '7.3', label: 'Digital Library', desc: 'A digital library is shown to be set-up, in keeping with progress in information and communication technology.' },
    { id: '7.4', label: 'IT Systems for Staff & Students', desc: 'The information technology systems are shown to be set up to meet the needs of staff and students.' },
    { id: '7.5', label: 'Computer & Network Infrastructure', desc: 'The university is shown to provide a highly accessible computer and network infrastructure.' },
    { id: '7.6', label: 'Environmental, Health & Safety Standards', desc: 'The environmental, health, and safety standards and access for people with special needs are shown to be defined and implemented.' },
    { id: '7.7', label: 'Physical, Social & Psychological Environment', desc: 'The university is shown to provide an environment conducive for education, research, and personal well-being.' },
    { id: '7.8', label: 'Support Staff for Facilities', desc: 'The competences of the support staff rendering services related to facilities are shown to be identified and evaluated.' },
    { id: '7.9', label: 'Quality Evaluation of Facilities', desc: 'The quality of the facilities (library, laboratory, IT, and student services) are shown to be subjected to evaluation and enhancement.' },
  ]},
  { id: 'c8', number: 8, title: 'Output and Outcomes', subReqs: [
    { id: '8.1', label: 'Pass / Drop / Grad', desc: 'The pass rate, dropout rate, and average time to graduate are shown to be established, monitored, and benchmarked for improvement.' },
    { id: '8.2', label: 'Employability', desc: 'Employability as well as self-employment, entrepreneurship, and advancement to further studies, are shown to be established, monitored, and benchmarked.' },
    { id: '8.3', label: 'Research Output', desc: 'Research and creative work output and activities carried out by the academic staff and students, are shown to be established, monitored, and benchmarked.' },
    { id: '8.4', label: 'Achievement of PLOs', desc: 'Data are provided to show directly the achievement of the programme outcomes, which are established and monitored.' },
    { id: '8.5', label: 'Satisfaction Level', desc: 'Satisfaction levels of the various stakeholders are shown to be established, monitored, and benchmarked for improvement.' },
  ]},
];

const REVIEW_STATUS_OPTIONS  = ['Not Met', 'Partially Met', 'Fully Met'];
const REVIEW_READINESS_OPTIONS = ['Needs immediate attention.', 'In progress.', 'Ready for assessment.'];

let reviewData = {};
let reviewActiveCriterion = 'c1';

// ── Init & nav ──
function initReviewPage() {
  REVIEW_CRITERIA.forEach(c => {
    c.subReqs.forEach(sr => {
      if (!reviewData[sr.id]) reviewData[sr.id] = { status: '', justification: '' };
    });
  });

  const now = new Date(), m = now.getMonth()+1, y = now.getFullYear();
  const ayStart = m >= 8 ? y : y - 1;
  const ayEl = document.getElementById('review-ay');
  if (ayEl) ayEl.textContent = 'AY ' + ayStart + '–' + (ayStart+1);
  const dateEl = document.getElementById('review-date');
  if (dateEl) dateEl.textContent = now.toLocaleDateString([], { year:'numeric', month:'long', day:'numeric' });

  // wire programme input to auto-load draft
  const prog = document.getElementById('review-programme');
  if (prog && !prog._wired) {
    prog._wired = true;
    prog.addEventListener('blur', () => {
      if (prog.value.trim()) reviewLoadDraft(prog.value.trim());
    });
  }

  buildReviewTabs();
  reviewSwitchCriterion('c1');
  reviewUpdateOverallBadge();
}

function buildReviewTabs() {
  const tabsEl = document.getElementById('review-criterion-tabs');
  if (!tabsEl) return;
  tabsEl.innerHTML = REVIEW_CRITERIA.map(c => {
    const filled  = c.subReqs.filter(sr => reviewData[sr.id]?.status).length;
    const total   = c.subReqs.length;
    const allDone = filled === total, noneDone = filled === 0;
    const dotCol  = allDone ? 'var(--green2)' : noneDone ? 'rgba(220,60,60,0.8)' : 'var(--gold)';
    return `<button class="sar-tab${reviewActiveCriterion === c.id ? ' active' : ''}" onclick="reviewSwitchCriterion('${c.id}')" title="${c.title}">
      <span style="width:7px;height:7px;border-radius:50%;background:${dotCol};flex-shrink:0;display:inline-block;"></span>
      ${c.number}. ${c.title}
    </button>`;
  }).join('');
}

function reviewSwitchCriterion(cid) {
  reviewActiveCriterion = cid;
  buildReviewTabs();
  buildReviewPanel(cid);
}

function buildReviewPanel(cid) {
  const criterion = REVIEW_CRITERIA.find(c => c.id === cid);
  if (!criterion) return;
  const panels = document.getElementById('review-criterion-panels');
  if (!panels) return;

  const filled = criterion.subReqs.filter(sr => reviewData[sr.id]?.status).length;
  const total  = criterion.subReqs.length;
  const progressColor = filled === total ? 'var(--green2)' : filled === 0 ? '#e05a78' : 'var(--gold)';

  const statusClass = s => s === 'Fully Met' ? 'sar-status-met' : s === 'Partially Met' ? 'sar-status-partial' : 'sar-status-notmet';

  panels.innerHTML = `
    <div class="sar-criterion-panel">

      <!-- Panel Header -->
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:1.4rem;flex-wrap:wrap;">
        <div style="width:44px;height:44px;background:rgba(138,21,56,0.2);border:1px solid rgba(138,21,56,0.35);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:var(--header2);flex-shrink:0;">${criterion.number}</div>
        <div>
          <div style="font-size:16px;font-weight:700;color:var(--text);">AUN-QA v4 Criterion ${criterion.number} — ${criterion.title}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px;">${total} sub-requirements · ${filled} of ${total} statuses set</div>
        </div>
        <div style="margin-left:auto;">
          <span style="font-size:11px;font-weight:700;padding:4px 14px;border-radius:20px;background:${filled===total?'rgba(14,96,33,0.25)':filled===0?'rgba(138,21,56,0.25)':'rgba(246,172,29,0.2)'};color:${progressColor};border:1px solid ${progressColor}40;">
            ${filled === total ? 'Complete' : filled === 0 ? 'Not Started' : `In Progress (${filled}/${total})`}
          </span>
        </div>
      </div>

      <!-- A. SAR READINESS DECISION -->
      <div class="sar-section-block">
        <div class="sar-section-heading">A. SAR READINESS DECISION</div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:8px;">Select the overall readiness decision for this criterion.</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${REVIEW_READINESS_OPTIONS.map(opt => {
            const active = (reviewData['readiness_' + cid] || '') === opt;
            const col = opt.includes('immediately') ? '#e05a78' : opt.includes('progress') ? 'var(--gold)' : 'var(--green2)';
            const bg  = opt.includes('immediately') ? 'rgba(138,21,56,0.18)' : opt.includes('progress') ? 'rgba(246,172,29,0.15)' : 'rgba(14,96,33,0.18)';
            return `<button onclick="reviewUpdateNarrative('readiness_${cid}','${opt}')" style="font-size:12px;font-weight:${active?700:500};padding:7px 16px;border-radius:8px;border:1.5px solid ${active?col:'var(--border2)'};background:${active?bg:'transparent'};color:${active?col:'var(--muted)'};cursor:pointer;transition:all .15s;">${opt}</button>`;
          }).join('')}
        </div>
      </div>

      <!-- B. SUB-REQUIREMENT COVERAGE CHECK -->
      <div class="sar-section-block">
        <div class="sar-section-heading">B. SUB-REQUIREMENT COVERAGE CHECK</div>
        <div class="sar-table">
          <div class="sar-table-header" style="display:grid;grid-template-columns:120px 1fr 160px 1fr;gap:0;">
            <div style="padding:8px 12px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--muted);">Sub-Req</div>
            <div style="padding:8px 12px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--muted);">Description</div>
            <div style="padding:8px 12px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--muted);text-align:center;">Status</div>
            <div style="padding:8px 12px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--muted);">One-line Justification</div>
          </div>
          ${criterion.subReqs.map(sr => {
            const d  = reviewData[sr.id] || { status: '', justification: '' };
            const sc = d.status ? statusClass(d.status) : 'sar-status-notmet';
            return `<div style="display:grid;grid-template-columns:120px 1fr 160px 1fr;gap:0;border-top:1px solid var(--border2);align-items:start;">
              <div style="padding:10px 12px;">
                <span class="sar-req-id" style="font-size:11px;">${sr.id}</span>
                <div style="font-size:10px;color:var(--muted);margin-top:3px;line-height:1.3;">${sr.label}</div>
              </div>
              <div style="padding:10px 12px;font-size:11px;color:var(--muted);line-height:1.55;">${sr.desc}</div>
              <div style="padding:10px 12px;text-align:center;">
                <select class="sar-status-select ${sc}" onchange="reviewUpdateField('${sr.id}','status',this.value)" style="font-size:11px;font-weight:600;padding:5px 8px;border-radius:6px;width:100%;cursor:pointer;text-align:center;">
                  <option value="">— Select —</option>
                  ${REVIEW_STATUS_OPTIONS.map(opt => `<option value="${opt}"${opt===d.status?' selected':''}>${opt}</option>`).join('')}
                </select>
              </div>
              <div style="padding:10px 12px;">
                <input class="sar-justification-input" type="text" placeholder="One-line justification…" value="${(d.justification||'').replace(/"/g,'&quot;')}" onchange="reviewUpdateField('${sr.id}','justification',this.value)" oninput="reviewUpdateField('${sr.id}','justification',this.value)" />
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <!-- C. EVALUATION -->
      <div class="sar-section-block">
        <div class="sar-section-heading">C. EVALUATION</div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:10px;">Provide a detailed evaluation narrative — identify gaps, cite evidence, and outline action plans.</div>
        <textarea class="sar-narrative" id="review-narrative-${cid}" placeholder="Write your evaluation here…" onchange="reviewUpdateNarrative('narrative_${cid}',this.value)" oninput="reviewUpdateNarrative('narrative_${cid}',this.value)">${reviewData['narrative_' + cid] || ''}</textarea>
      </div>

      <!-- Appendix References -->
      <div class="sar-section-block">
        <div class="sar-section-heading">APPENDIX REFERENCES</div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:8px;">List all appendix codes and titles referenced in this criterion.</div>
        <textarea class="sar-narrative" style="min-height:70px;" id="review-evidence-${cid}" placeholder="e.g. Appendix ${criterion.number}.1.1 – …&#10;Appendix ${criterion.number}.2.1 – …" onchange="reviewUpdateEvidence('${cid}',this.value)" oninput="reviewUpdateEvidence('${cid}',this.value)">${reviewData['evidence_' + cid] || ''}</textarea>
      </div>

    </div>

    <!-- Criterion Navigation -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1.4rem;padding-top:1.2rem;border-top:1px solid var(--border2);">
      ${cid !== 'c1' ? `<button class="btn btn-ghost" style="font-size:12px;" onclick="reviewSwitchCriterion('c${criterion.number - 1}')">← Criterion ${criterion.number - 1}</button>` : '<div></div>'}
      <div style="font-size:12px;color:var(--muted);">${criterion.number} / ${REVIEW_CRITERIA.length}</div>
      ${cid !== 'c' + REVIEW_CRITERIA.length ? `<button class="btn btn-ghost" style="font-size:12px;" onclick="reviewSwitchCriterion('c${criterion.number + 1}')">Criterion ${criterion.number + 1} →</button>` : `<button class="btn btn-primary" style="font-size:12px;" onclick="reviewExportPDF()">Finalize &amp; Export PDF</button>`}
    </div>
  `;
}

function reviewUpdateField(srId, field, value) {
  if (!reviewData[srId]) reviewData[srId] = { status: '', justification: '' };
  reviewData[srId][field] = value;
  if (field === 'status') {
    const sel = document.querySelector(`select[onchange*="'${srId}','status'"]`);
    if (sel) {
      sel.className = 'sar-status-select ' + (
        value === 'Fully Met'    ? 'sar-status-met' :
        value === 'Partially Met'? 'sar-status-partial' : 'sar-status-notmet'
      );
    }
    reviewUpdateOverallBadge();
    buildReviewTabs();
    refreshDashboardReview();
  }
}

function reviewUpdateNarrative(key, value) { reviewData[key] = value; }
function reviewUpdateEvidence(cid, value)   { reviewData['evidence_' + cid] = value; }

function reviewUpdateOverallBadge() {
  const badge = document.getElementById('review-overall-badge');
  if (!badge) return;
  let total = 0, filled = 0, fullyMet = 0;
  REVIEW_CRITERIA.forEach(c => {
    c.subReqs.forEach(sr => {
      total++;
      const s = reviewData[sr.id]?.status || '';
      if (s) filled++;
      if (s === 'Fully Met') fullyMet++;
    });
  });
  const pct   = Math.round((filled / total) * 100);
  const label = pct === 100 ? `SAR Complete · ${fullyMet}/${total} Fully Met` : pct >= 50 ? `In Progress (${pct}%)` : `Not Started (${pct}%)`;
  const bg    = pct === 100 ? 'rgba(14,96,33,0.3)' : pct >= 50 ? 'rgba(246,172,29,0.2)' : 'rgba(138,21,56,0.25)';
  const col   = pct === 100 ? 'var(--green2)'       : pct >= 50 ? 'var(--gold)'          : '#e05a78';
  badge.textContent = label;
  badge.style.background = bg;
  badge.style.color = col;
  badge.style.border = '1px solid ' + col + '50';
}

function refreshDashboardReview() {
  // Update review bars on dashboard
  const reviewBarsEl = document.getElementById('dash-review-bars');
  const reviewPctEl  = document.getElementById('dash-review-pct');
  if (!reviewBarsEl) return;

  let totalAll = 0, filledAll = 0, criteriaDone = 0;
  reviewBarsEl.innerHTML = REVIEW_CRITERIA.map(c => {
    const filled = c.subReqs.filter(sr => reviewData[sr.id]?.status).length;
    const total  = c.subReqs.length;
    const pct    = Math.round(filled / total * 100);
    const col    = pct===100?'var(--green2)':pct>0?'var(--gold)':'rgba(220,60,60,0.6)';
    totalAll  += total; filledAll += filled;
    if (pct === 100) criteriaDone++;
    return `<div style="margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px;">
        <span style="color:var(--muted);">C${c.number}: ${c.title.split(' ').slice(0,3).join(' ')}</span>
        <span style="color:${col};">${filled}/${total}</span>
      </div>
      <div style="height:4px;background:var(--border2);border-radius:2px;overflow:hidden;">
        <div style="height:100%;background:${col};border-radius:2px;width:${pct}%;transition:width .3s;"></div>
      </div>
    </div>`;
  }).join('');

  if (reviewPctEl) reviewPctEl.textContent = totalAll ? Math.round(filledAll/totalAll*100)+'%' : '0%';
  const critDoneEl = document.getElementById('dash-criteria-done');
  if (critDoneEl) critDoneEl.textContent = criteriaDone + '/8';
}

// ── Draft save/load (localStorage) ──
function reviewSaveDraft() {
  const programme = (document.getElementById('review-programme')?.value || '').trim() || 'Untitled';
  try {
    const key = 'qnekt_sar_review_' + programme.replace(/\s+/g,'_').toUpperCase();
    localStorage.setItem(key, JSON.stringify({
      programme,
      faculty: document.getElementById('review-faculty')?.value || '',
      savedAt: new Date().toISOString(),
      reviewData,
    }));
    notify('SAR Review draft saved ✓');
  } catch(e) { notify('Save failed: ' + e.message); }
}

function reviewLoadDraft(programme) {
  try {
    const key = 'qnekt_sar_review_' + programme.replace(/\s+/g,'_').toUpperCase();
    const raw = localStorage.getItem(key);
    if (!raw) return;
    const saved = JSON.parse(raw);
    Object.assign(reviewData, saved.reviewData || {});
    const facultyEl = document.getElementById('review-faculty');
    if (facultyEl && saved.faculty) facultyEl.value = saved.faculty;
    buildReviewTabs();
    reviewSwitchCriterion(reviewActiveCriterion);
    reviewUpdateOverallBadge();
    notify('SAR Review draft loaded ✓');
  } catch(e) { console.warn('[Review] Could not load draft:', e); }
}

// ── Export PDF ──
function reviewExportPDF() {
  const programme = (document.getElementById('review-programme')?.value || 'Programme').trim() || 'Programme';
  const faculty    = (document.getElementById('review-faculty')?.value || '').trim();
  const ay         = (document.getElementById('review-ay')?.textContent || '').trim();
  const date       = (document.getElementById('review-date')?.textContent || '').trim();

  const statusColor = s => s === 'Fully Met' ? '#166534' : s === 'Partially Met' ? '#92400e' : '#7f1d1d';
  const statusBg    = s => s === 'Fully Met' ? '#dcfce7' : s === 'Partially Met' ? '#fef9c3' : '#fee2e2';

  const criteriaHTML = REVIEW_CRITERIA.map(c => {
    const readiness = reviewData['readiness_' + c.id] || '';
    const narrative = reviewData['narrative_'  + c.id] || '';
    const evidence  = reviewData['evidence_'   + c.id] || '';
    const tableRows = c.subReqs.map(sr => {
      const d = reviewData[sr.id] || {};
      const s = d.status || '';
      return `<tr>
        <td style="padding:9px 12px;border:1px solid #d1d5db;font-size:11px;vertical-align:top;width:28%;"><strong>${sr.id}.</strong> ${sr.label}</td>
        <td style="padding:9px 12px;border:1px solid #d1d5db;font-size:11px;text-align:center;vertical-align:top;width:14%;">
          ${s ? `<span style="display:inline-block;padding:3px 10px;border-radius:12px;font-size:10px;font-weight:700;background:${statusBg(s)};color:${statusColor(s)};white-space:nowrap;">${s}</span>` : '<span style="color:#9ca3af;font-size:11px;">—</span>'}
        </td>
        <td style="padding:9px 12px;border:1px solid #d1d5db;font-size:11px;color:${d.justification?'#374151':'#9ca3af'};vertical-align:top;">${d.justification || '—'}</td>
      </tr>`;
    }).join('');

    return `
      <div style="margin-bottom:48px;page-break-inside:avoid;">
        <h2 style="font-size:15px;font-weight:800;color:#8a1538;border-bottom:2px solid #8a1538;padding-bottom:5px;margin:0 0 18px;text-transform:uppercase;letter-spacing:.5px;">
          AUN-QA v4 Criterion ${c.number} — ${c.title}
        </h2>
        <h3 style="font-size:12px;font-weight:800;color:#111;text-transform:uppercase;letter-spacing:.8px;margin:0 0 6px;">A. SAR READINESS DECISION</h3>
        <p style="font-size:13px;font-weight:600;color:${readiness.includes('immediately')?'#7f1d1d':readiness.includes('progress')?'#92400e':'#166534'};margin:0 0 18px;padding:8px 12px;background:${readiness.includes('immediately')?'#fee2e2':readiness.includes('progress')?'#fef9c3':'#dcfce7'};border-radius:4px;display:inline-block;">
          ${readiness || '[Readiness decision not set]'}
        </p>
        <h3 style="font-size:12px;font-weight:800;color:#111;text-transform:uppercase;letter-spacing:.8px;margin:0 0 10px;">B. SUB-REQUIREMENT COVERAGE CHECK</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:18px;">
          <thead><tr style="background:#1e293b;color:#fff;">
            <th style="padding:9px 12px;font-size:11px;text-align:left;font-weight:700;letter-spacing:.4px;">Sub-Requirement</th>
            <th style="padding:9px 12px;font-size:11px;text-align:center;font-weight:700;letter-spacing:.4px;width:14%;">Status</th>
            <th style="padding:9px 12px;font-size:11px;text-align:left;font-weight:700;letter-spacing:.4px;">One-line Justification</th>
          </tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
        <h3 style="font-size:12px;font-weight:800;color:#111;text-transform:uppercase;letter-spacing:.8px;margin:0 0 8px;">C. EVALUATION</h3>
        ${narrative ? `<div style="font-size:12px;color:#374151;line-height:1.7;white-space:pre-wrap;">${narrative}</div>` : `<p style="font-size:12px;color:#9ca3af;font-style:italic;">[No evaluation narrative provided.]</p>`}
        ${evidence ? `<div style="margin-top:14px;padding:10px 14px;background:#f8fafc;border-left:3px solid #8a1538;border-radius:0 4px 4px 0;">
          <p style="margin:0 0 4px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.6px;color:#8a1538;">Appendix References</p>
          <p style="margin:0;font-size:11px;color:#374151;white-space:pre-wrap;">${evidence}</p>
        </div>` : ''}
      </div>`;
  }).join('');

  const summaryRows = REVIEW_CRITERIA.map(c => {
    const counts = { 'Fully Met': 0, 'Partially Met': 0, 'Not Met': 0 };
    c.subReqs.forEach(sr => { const s = reviewData[sr.id]?.status || 'Not Met'; counts[s] = (counts[s]||0) + 1; });
    return `<tr>
      <td style="padding:8px 14px;border:1px solid #d1d5db;font-size:12px;">Criterion ${c.number}: ${c.title}</td>
      <td style="padding:8px 14px;border:1px solid #d1d5db;font-size:11px;text-align:center;color:#166534;font-weight:700;">${counts['Fully Met']}</td>
      <td style="padding:8px 14px;border:1px solid #d1d5db;font-size:11px;text-align:center;color:#92400e;font-weight:700;">${counts['Partially Met']}</td>
      <td style="padding:8px 14px;border:1px solid #d1d5db;font-size:11px;text-align:center;color:#7f1d1d;font-weight:700;">${counts['Not Met']}</td>
    </tr>`;
  }).join('');

  const win = window.open('', '_blank', 'width=1000,height=800');
  if (!win) { notify('Allow pop-ups to export PDF'); return; }
  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>SAR Review – ${programme}</title>
  <style>
    @media print { .no-print { display:none!important; } @page { margin:2.5cm; size:A4; } }
    body { font-family:Arial,sans-serif; margin:0; color:#111; font-size:13px; line-height:1.6; }
    .toolbar { background:#f3f4f6; border-bottom:1px solid #d1d5db; padding:12px 24px; display:flex; gap:10px; align-items:center; position:sticky; top:0; z-index:10; }
    .btn { padding:7px 18px; border-radius:6px; border:none; cursor:pointer; font-size:13px; font-weight:600; }
    .btn-red { background:#8a1538; color:#fff; } .btn-gray { background:#e5e7eb; color:#374151; }
    .cover { text-align:center; padding:80px 60px 60px; border-bottom:4px solid #8a1538; }
    .toc { padding:40px 60px; border-bottom:2px solid #e5e7eb; }
    .toc h2 { font-size:14px; font-weight:800; text-transform:uppercase; letter-spacing:1.5px; margin:0 0 18px; color:#8a1538; }
    .toc-row { display:flex; justify-content:space-between; padding:5px 0; font-size:12px; border-bottom:1px dotted #d1d5db; }
    .toc-row.bold { font-weight:700; } .toc-row.indent { padding-left:24px; color:#374151; }
    .content { padding:40px 60px; }
    .part-title { font-size:16px; font-weight:800; text-transform:uppercase; letter-spacing:1px; color:#8a1538; border-bottom:3px solid #8a1538; padding-bottom:6px; margin:40px 0 24px; }
  </style></head><body>
  <div class="toolbar no-print">
    <button class="btn btn-red" onclick="window.print()">🖨 Print / Save as PDF</button>
    <button class="btn btn-gray" onclick="window.close()">Close</button>
    <span style="font-size:12px;color:#6b7280;margin-left:auto;">Choose "Save as PDF" in print dialog · A4 recommended</span>
  </div>
  <div class="cover">
    <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#6b7280;margin-bottom:28px;">University of the Philippines Open University · Quality Assurance Office</div>
    <div style="font-size:30px;font-weight:900;letter-spacing:2px;color:#8a1538;margin-bottom:10px;">SELF-ASSESSMENT REPORT</div>
    <div style="font-size:16px;font-weight:700;color:#374151;margin-bottom:8px;">${programme}</div>
    ${faculty ? `<div style="font-size:14px;font-weight:600;color:#374151;margin-bottom:28px;">${faculty}</div>` : '<div style="margin-bottom:28px;"></div>'}
    <div style="font-size:13px;color:#6b7280;line-height:2;">
      <div><strong style="color:#111;">Academic Year:</strong> ${ay || '—'}</div>
      <div><strong style="color:#111;">Date Prepared:</strong> ${date || '—'}</div>
    </div>
  </div>
  <div class="toc">
    <h2>Table of Contents</h2>
    <div class="toc-row bold"><span>PART I. INTRODUCTION</span><span>#</span></div>
    <div class="toc-row bold"><span>PART II. AUN-QA ASSESSMENT AT PROGRAMME-LEVEL</span><span>#</span></div>
    ${REVIEW_CRITERIA.map(c=>`<div class="toc-row indent"><span>Criterion ${c.number}: ${c.title}</span><span>#</span></div>`).join('')}
    <div class="toc-row bold"><span>PART III. SELF-RATING SUMMARY</span><span>#</span></div>
    <div class="toc-row bold"><span>PART IV. APPENDICES</span><span>#</span></div>
  </div>
  <div class="content">
    <div class="part-title">Part I. Introduction</div>
    <p style="font-size:13px;color:#9ca3af;font-style:italic;">[Executive Summary — provide an overview of the programme and key findings of this self-assessment.]</p>
    <p style="font-size:13px;color:#9ca3af;font-style:italic;">[Degree Programme — brief description of ${programme}.]</p>
    <div class="part-title">Part II. AUN-QA Assessment at Programme-Level</div>
    ${criteriaHTML}
    <div class="part-title">Part III. Self-Rating Summary</div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <thead><tr style="background:#8a1538;color:#fff;">
        <th style="padding:10px 14px;font-size:11px;text-align:left;letter-spacing:.4px;">CRITERION</th>
        <th style="padding:10px 14px;font-size:11px;text-align:center;letter-spacing:.4px;width:12%;">FULLY MET</th>
        <th style="padding:10px 14px;font-size:11px;text-align:center;letter-spacing:.4px;width:14%;">PARTIALLY MET</th>
        <th style="padding:10px 14px;font-size:11px;text-align:center;letter-spacing:.4px;width:12%;">NOT MET</th>
      </tr></thead>
      <tbody>${summaryRows}</tbody>
    </table>
    <div class="part-title">Part IV. Appendices</div>
    ${REVIEW_CRITERIA.map(c => {
      const ev = reviewData['evidence_' + c.id];
      return ev ? `<p style="font-size:12px;margin-bottom:4px;"><em>${ev}</em></p>`
                : `<p style="font-size:12px;color:#9ca3af;font-style:italic;margin-bottom:4px;">Criterion ${c.number} appendices — [To be attached]</p>`;
    }).join('')}
  </div>
  </body></html>`);
  win.document.close(); win.focus();
  notify('SAR Review exported as PDF ✓');
}
