const STATUS_MAP = {
  'in-service': { label: 'Em atendimento', className: 'status-badge--in-service' },
  'waiting-confirmation': {
    label: 'Procedimento aguardando confirmação',
    className: 'status-badge--waiting-confirmation'
  },
  'in-procedure': { label: 'Em procedimento', className: 'status-badge--in-procedure' },
  'pending-validation': { label: 'Aguardando validação', className: 'status-badge--pending-validation' },
  'completed': { label: 'Concluído', className: 'status-badge--completed' }
};

const TAB_GROUPS = {
  active: ['in-service', 'in-procedure', 'waiting-confirmation'],
  pending: ['pending-validation'],
  completed: ['completed']
};

const patients = [
  {
    id: 1,
    name: 'Mariana Alves',
    event: 'Peeling e Revitalização Facial',
    arrivalTime: '13:22',
    email: 'modelo@senac.br',
    cpf: '128.554.907-30',
    phone: '(84) 99812-7745',
    birth: '14/08/1990 · 36 anos',
    job: 'Professora',
    status: 'in-service',
    records: []
  },
  {
    id: 2,
    name: 'Joana Pereira',
    event: 'Peeling e Revitalização Facial',
    arrivalTime: '13:33',
    email: 'joana.pereira@senac.br',
    cpf: '342.118.650-12',
    phone: '(84) 99145-3320',
    birth: '22/03/1988 · 38 anos',
    job: 'Designer',
    status: 'in-procedure',
    records: []
  }
];

let currentTab = 'active';
let selectedPatientId = 1;

const patientListEl = document.getElementById('patientList');
const sidebarBadgeEl = document.getElementById('sidebarActiveBadge');
const tabCountActiveEl = document.getElementById('tabCountActive');
const tabCountPendingEl = document.getElementById('tabCountPending');
const tabCountCompletedEl = document.getElementById('tabCountCompleted');
const tabBtns = document.querySelectorAll('.tab-btn');

const detailNameEl = document.getElementById('detailName');
const detailSubtitleEl = document.getElementById('detailSubtitle');
const detailStatusBadgeEl = document.getElementById('detailStatusBadge');
const metaNameEl = document.getElementById('metaName');
const metaEmailEl = document.getElementById('metaEmail');
const metaCpfEl = document.getElementById('metaCpf');
const metaPhoneEl = document.getElementById('metaPhone');
const metaBirthEl = document.getElementById('metaBirth');
const metaJobEl = document.getElementById('metaJob');

const btnFacial = document.getElementById('btnFacial');
const btnCorporal = document.getElementById('btnCorporal');
const finishBtn = document.getElementById('finishBtn');
const prontuarioBodyEl = document.getElementById('prontuarioBody');

const sidebarEl = document.getElementById('sidebar');
const sidebarBackdropEl = document.getElementById('sidebarBackdrop');
const menuToggleBtn = document.getElementById('menuToggle');
const menuCloseBtn = document.getElementById('menuClose');

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getSelectedPatient() {
  return patients.find((p) => p.id === selectedPatientId) || null;
}

function renderCounts() {
  const activeCount = patients.filter((p) => TAB_GROUPS.active.includes(p.status)).length;
  const pendingCount = patients.filter((p) => TAB_GROUPS.pending.includes(p.status)).length;
  const completedCount = patients.filter((p) => TAB_GROUPS.completed.includes(p.status)).length;

  tabCountActiveEl.textContent = `(${activeCount})`;
  tabCountPendingEl.textContent = `(${pendingCount})`;
  tabCountCompletedEl.textContent = `(${completedCount})`;

  sidebarBadgeEl.textContent = activeCount;
  sidebarBadgeEl.style.display = activeCount > 0 ? 'inline-block' : 'none';
}

function renderList() {
  patientListEl.innerHTML = '';

  const filtered = patients.filter((p) => TAB_GROUPS[currentTab].includes(p.status));

  if (filtered.length === 0) {
    patientListEl.innerHTML = '<li class="list-empty">Nenhuma modelo nesta categoria.</li>';
    return;
  }

  if (!filtered.some((p) => p.id === selectedPatientId)) {
    selectedPatientId = filtered[0].id;
  }

  filtered.forEach((patient) => {
    const statusInfo = STATUS_MAP[patient.status];
    const isSelected = patient.id === selectedPatientId;

    const li = document.createElement('li');
    li.className = 'patient-item';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = isSelected ? 'patient-item-btn is-selected' : 'patient-item-btn';

    btn.innerHTML = `
      <span class="patient-avatar" aria-hidden="true">
        <span class="material-symbols-rounded icon-filled">person</span>
      </span>
      <span class="patient-item-body">
        <span class="patient-item-name">${escapeHtml(patient.name)}</span>
        <span class="status-badge ${statusInfo.className}">
          <span class="status-dot" aria-hidden="true"></span>
          <span>${statusInfo.label}</span>
        </span>
      </span>
      <span class="patient-item-time">${escapeHtml(patient.arrivalTime)}</span>
    `;

    btn.addEventListener('click', () => {
      selectedPatientId = patient.id;
      renderAll();
    });

    li.appendChild(btn);
    patientListEl.appendChild(li);
  });
}

function renderDetail() {
  const patient = getSelectedPatient();

  if (!patient) {
    detailNameEl.textContent = 'Nenhuma modelo selecionada';
    detailSubtitleEl.textContent = 'Selecione uma modelo na lista ao lado.';
    detailStatusBadgeEl.hidden = true;
    finishBtn.disabled = true;
    prontuarioBodyEl.innerHTML = '';
    return;
  }

  const statusInfo = STATUS_MAP[patient.status];
  detailNameEl.textContent = patient.name;
  detailSubtitleEl.textContent = `${patient.event} · chegada às ${patient.arrivalTime}`;

  detailStatusBadgeEl.hidden = false;
  detailStatusBadgeEl.className = `status-badge ${statusInfo.className}`;
  detailStatusBadgeEl.innerHTML = `
    <span class="status-dot" aria-hidden="true"></span>
    <span>${statusInfo.label}</span>
  `;

  metaNameEl.textContent = patient.name;
  metaEmailEl.textContent = patient.email;
  metaCpfEl.textContent = patient.cpf;
  metaPhoneEl.textContent = patient.phone;
  metaBirthEl.textContent = patient.birth;
  metaJobEl.textContent = patient.job;

  btnFacial.href = `../anamnese-facial/index.html?modelo=${patient.id}`;
  btnCorporal.href = `../anamnese-corporal/index.html?modelo=${patient.id}`;

  const isActive = TAB_GROUPS.active.includes(patient.status);
  finishBtn.disabled = !isActive || patient.records.length === 0;

  if (patient.records.length === 0) {
    prontuarioBodyEl.innerHTML = `
      <div class="prontuario-empty">
        <div class="empty-icon-box" aria-hidden="true">
          <span class="material-symbols-rounded">description</span>
        </div>
        <p class="empty-title">Nenhuma ficha registrada</p>
        <p class="empty-desc">
          Preencha a anamnese facial ou corporal para iniciar o prontuário desta modelo.
        </p>
      </div>
    `;
    return;
  }

  const recordsHtml = patient.records
    .slice()
    .reverse()
    .map(
      (rec) => `
        <li class="record-item">
          <div class="record-top">
            <span class="record-type">${escapeHtml(rec.type)} · v${rec.version}</span>
            <span class="record-meta">${escapeHtml(rec.time)}</span>
          </div>
          <p class="record-procedure">Procedimento sugerido: ${escapeHtml(rec.procedure)}</p>
          <p class="record-notes">${escapeHtml(rec.notes)}</p>
        </li>
      `
    )
    .join('');

  prontuarioBodyEl.innerHTML = `<ul class="records-list">${recordsHtml}</ul>`;
}

function renderAll() {
  renderCounts();
  renderList();
  renderDetail();
}

finishBtn.addEventListener('click', () => {
  const patient = getSelectedPatient();
  if (!patient || patient.records.length === 0) return;

  const confirmed = window.confirm(`Finalizar atendimento de "${patient.name}" e enviar para validação?`);
  if (!confirmed) return;

  patient.status = 'pending-validation';
  renderAll();
});

tabBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    currentTab = btn.dataset.tab;
    tabBtns.forEach((b) => {
      const active = b === btn;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', String(active));
    });
    renderAll();
  });
});

function setMenuOpen(isOpen) {
  sidebarEl.classList.toggle('is-open', isOpen);
  sidebarBackdropEl.classList.toggle('is-open', isOpen);
  menuToggleBtn.setAttribute('aria-expanded', String(isOpen));
}

menuToggleBtn.addEventListener('click', () => setMenuOpen(true));
menuCloseBtn.addEventListener('click', () => setMenuOpen(false));
sidebarBackdropEl.addEventListener('click', () => setMenuOpen(false));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && sidebarEl.classList.contains('is-open')) {
    setMenuOpen(false);
  }
});

renderAll();
