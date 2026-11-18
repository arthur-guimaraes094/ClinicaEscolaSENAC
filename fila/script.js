const STATUS_MAP = {
  'waiting-link': { label: 'Aguardando atendimento', className: 'status-badge--waiting-link' },
  'in-service': { label: 'Em atendimento', className: 'status-badge--in-service' },
  'waiting-confirmation': {
    label: 'Procedimento aguardando confirmação',
    className: 'status-badge--waiting-confirmation'
  },
  'in-procedure': { label: 'Em procedimento', className: 'status-badge--in-procedure' },
  'pending-validation': { label: 'Aguardando validação', className: 'status-badge--pending-validation' },
  'completed': { label: 'Concluído', className: 'status-badge--completed' },
  'procedure-denied': { label: 'Procedimento negado', className: 'status-badge--denied' },
  'procedure-failed': { label: 'Procedimento falhou', className: 'status-badge--failed' }
};

const ACTIONABLE_STATUSES = ['waiting-link', 'waiting-confirmation', 'pending-validation'];
const BUSY_STATUSES = ['in-service', 'waiting-confirmation', 'in-procedure', 'pending-validation'];
const FINISHED_STATUSES = ['completed', 'procedure-denied', 'procedure-failed'];

let currentFilter = 'active';

const STUDENTS = [
  'Camila Rocha',
  'Bruno Lima',
  'Lucas Mendes',
  'Fernanda Souza',
  'Gabriel Alves',
  'Larissa Martins'
];

const queueItems = [
  {
    id: 1,
    name: 'Mariana Alves',
    arrivalText: 'Chegou às 13:22 · há 56 min',
    student: 'Camila Rocha',
    procedure: '',
    status: 'in-service'
  },
  {
    id: 2,
    name: 'Joana Pereira',
    arrivalText: 'Chegou às 13:33 · há 45 min',
    student: 'Lucas Mendes',
    procedure: 'Peeling de Diamante',
    status: 'waiting-confirmation'
  },
  {
    id: 3,
    name: 'Ana Beatriz Costa',
    arrivalText: 'Chegou às 13:41 · há 37 min',
    student: 'Bruno Lima',
    procedure: 'Limpeza de Pele Profunda',
    status: 'pending-validation'
  },
  {
    id: 4,
    name: 'Roberto Nunes',
    arrivalText: 'Chegou às 13:56 · há 22 min',
    student: '',
    procedure: '',
    status: 'waiting-link'
  }
];

const queueListEl = document.getElementById('queueList');
const queueTotalEl = document.getElementById('queueTotalText');
const sidebarBadgeEl = document.getElementById('sidebarQueueBadge');

const countWaitingLinkEl = document.getElementById('countWaitingLink');
const countInServiceEl = document.getElementById('countInService');
const countPendingValidationEl = document.getElementById('countPendingValidation');
const countCompletedEl = document.getElementById('countCompleted');

const addQueueForm = document.getElementById('addQueueForm');
const modelSearchInput = document.getElementById('modelSearchInput');
const addQueueBtn = document.getElementById('addQueueBtn');
const endEventBtn = document.getElementById('endEventBtn');

const sidebarEl = document.getElementById('sidebar');
const sidebarBackdropEl = document.getElementById('sidebarBackdrop');
const menuToggleBtn = document.getElementById('menuToggle');
const menuCloseBtn = document.getElementById('menuClose');

const actionModalEl = document.getElementById('actionModal');
const modalEyebrowEl = document.getElementById('modalEyebrow');
const modalTitleEl = document.getElementById('modalTitle');
const modalBodyEl = document.getElementById('modalBody');
const modalFooterEl = document.getElementById('modalFooter');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const filterBtns = document.querySelectorAll('.queue-filter-btn');

function formatPosition(index) {
  return String(index + 1).padStart(2, '0');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getCurrentTimeHHMM() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function getAvailableStudents() {
  const busyStudents = new Set(
    queueItems
      .filter((item) => item.student && BUSY_STATUSES.includes(item.status))
      .map((item) => item.student)
  );
  return STUDENTS.filter((student) => !busyStudents.has(student));
}

function closeActionModal() {
  actionModalEl.hidden = true;
  modalBodyEl.innerHTML = '';
  modalFooterEl.innerHTML = '';
}

function openAssignStudentModal(item) {
  const availableStudents = getAvailableStudents();
  modalEyebrowEl.textContent = 'Direcionar atendimento';
  modalTitleEl.textContent = item.name;

  if (availableStudents.length === 0) {
    modalBodyEl.innerHTML = `
      <p class="modal-empty">Nenhum aluno disponível no momento.</p>
    `;
    modalFooterEl.innerHTML = `
      <button type="button" class="btn-outline" id="modalCancelBtn">Fechar</button>
    `;
    document.getElementById('modalCancelBtn').addEventListener('click', closeActionModal);
    actionModalEl.hidden = false;
    return;
  }

  const listHtml = availableStudents
    .map(
      (student) => `
        <button type="button" class="student-option" data-student="${escapeHtml(student)}">
          <span class="student-option-left">
            <span class="material-symbols-rounded">school</span>
            <span>${escapeHtml(student)}</span>
          </span>
          <span class="student-option-tag">Disponível</span>
        </button>
      `
    )
    .join('');

  modalBodyEl.innerHTML = `
    <p class="modal-question">Selecione um aluno disponível para iniciar o atendimento:</p>
    <div class="student-list">${listHtml}</div>
  `;
  modalFooterEl.innerHTML = `
    <button type="button" class="btn-outline" id="modalCancelBtn">Cancelar</button>
  `;

  document.getElementById('modalCancelBtn').addEventListener('click', closeActionModal);
  modalBodyEl.querySelectorAll('.student-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      item.student = btn.dataset.student;
      item.status = 'in-service';
      closeActionModal();
      renderQueue();
    });
  });

  actionModalEl.hidden = false;
}

function openProcedureConfirmationModal(item) {
  modalEyebrowEl.textContent = 'Aprovação de procedimento';
  modalTitleEl.textContent = item.name;

  modalBodyEl.innerHTML = `
    <p class="modal-question">Você confirma e autoriza o início deste procedimento?</p>
  `;

  modalFooterEl.innerHTML = `
    <button type="button" class="btn-outline" id="rejectProcedureBtn">Não</button>
    <button type="button" class="btn-primary" id="approveProcedureBtn">Sim</button>
  `;

  document.getElementById('rejectProcedureBtn').addEventListener('click', () => {
    item.status = 'procedure-denied';
    closeActionModal();
    renderQueue();
  });

  document.getElementById('approveProcedureBtn').addEventListener('click', () => {
    item.status = 'in-procedure';
    closeActionModal();
    renderQueue();
  });

  actionModalEl.hidden = false;
}

function openCheckoutValidationModal(item) {
  modalEyebrowEl.textContent = 'Validação de check-out';
  modalTitleEl.textContent = item.name;

  modalBodyEl.innerHTML = `
    <p class="modal-question">Confirmar check-out do atendimento. O procedimento deu certo?</p>
  `;

  modalFooterEl.innerHTML = `
    <button type="button" class="btn-danger-outline" id="checkoutErrorBtn">Deu errado</button>
    <button type="button" class="btn-primary" id="checkoutSuccessBtn">Deu certo</button>
  `;

  document.getElementById('checkoutErrorBtn').addEventListener('click', () => {
    item.status = 'procedure-failed';
    closeActionModal();
    renderQueue();
  });

  document.getElementById('checkoutSuccessBtn').addEventListener('click', () => {
    item.status = 'completed';
    closeActionModal();
    renderQueue();
  });

  actionModalEl.hidden = false;
}

function handleRowClick(item) {
  if (item.status === 'waiting-link') {
    openAssignStudentModal(item);
  } else if (item.status === 'waiting-confirmation') {
    openProcedureConfirmationModal(item);
  } else if (item.status === 'pending-validation') {
    openCheckoutValidationModal(item);
  }
}

function renderCounts() {
  const waitingLink = queueItems.filter((item) => item.status === 'waiting-link').length;
  const inService = queueItems.filter(
    (item) => item.status === 'in-service' || item.status === 'in-procedure'
  ).length;
  const pendingValidation = queueItems.filter(
    (item) => item.status === 'waiting-confirmation' || item.status === 'pending-validation'
  ).length;
  const completed = queueItems.filter((item) => item.status === 'completed').length;

  countWaitingLinkEl.textContent = waitingLink;
  countInServiceEl.textContent = inService;
  countPendingValidationEl.textContent = pendingValidation;
  countCompletedEl.textContent = completed;

  sidebarBadgeEl.textContent = waitingLink;
  sidebarBadgeEl.style.display = waitingLink > 0 ? 'inline-block' : 'none';
}

function renderQueue() {
  queueListEl.innerHTML = '';

  const filteredItems = queueItems.filter((item) => {
    const isFinished = FINISHED_STATUSES.includes(item.status);
    return currentFilter === 'finished' ? isFinished : !isFinished;
  });

  queueTotalEl.textContent =
    currentFilter === 'finished'
      ? `${filteredItems.length} finalizado(s)`
      : `${filteredItems.length} na fila`;

  if (filteredItems.length === 0) {
    queueListEl.innerHTML = `<li class="queue-empty">${
      currentFilter === 'finished'
        ? 'Nenhum atendimento finalizado ainda.'
        : 'Nenhum paciente na fila no momento.'
    }</li>`;
    renderCounts();
    return;
  }

  filteredItems.forEach((item, index) => {
    const statusInfo = STATUS_MAP[item.status];
    const hasAction = ACTIONABLE_STATUSES.includes(item.status);

    const li = document.createElement('li');
    li.className = 'queue-row';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = hasAction ? 'queue-row-btn' : 'queue-row-btn is-static';

    const studentHtml = item.student
      ? `<span class="queue-student">
           <span class="material-symbols-rounded">school</span>
           <span>${escapeHtml(item.student)}</span>
         </span>`
      : '';

    const chevronHtml = hasAction
      ? '<span class="material-symbols-rounded queue-chevron" aria-hidden="true">chevron_right</span>'
      : '';

    btn.innerHTML = `
      <span class="queue-pos">${formatPosition(index)}</span>
      <span class="queue-avatar" aria-hidden="true">
        <span class="material-symbols-rounded icon-filled">person</span>
      </span>
      <span class="queue-patient">
        <span class="queue-patient-name">${escapeHtml(item.name)}</span>
        <span class="queue-patient-time">${escapeHtml(item.arrivalText)}</span>
      </span>
      <span class="queue-meta">
        ${studentHtml}
        <span class="status-badge ${statusInfo.className}">
          <span class="status-dot" aria-hidden="true"></span>
          <span>${statusInfo.label}</span>
        </span>
        ${chevronHtml}
      </span>
    `;

    if (hasAction) {
      btn.addEventListener('click', () => handleRowClick(item));
    }

    li.appendChild(btn);
    queueListEl.appendChild(li);
  });

  renderCounts();
}

modelSearchInput.addEventListener('input', () => {
  addQueueBtn.disabled = modelSearchInput.value.trim().length === 0;
});

addQueueForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = modelSearchInput.value.trim();
  if (!value) return;

  queueItems.push({
    id: Date.now(),
    name: value,
    arrivalText: `Chegou às ${getCurrentTimeHHMM()} · agora`,
    student: '',
    procedure: '',
    status: 'waiting-link'
  });

  modelSearchInput.value = '';
  addQueueBtn.disabled = true;
  renderQueue();
});

endEventBtn.addEventListener('click', () => {
  const confirmed = window.confirm('Deseja encerrar o evento "Peeling e Revitalização Facial"?');
  if (!confirmed) return;

  endEventBtn.disabled = true;
  endEventBtn.innerHTML = `
    <span class="material-symbols-rounded">check_circle</span>
    <span>Evento encerrado</span>
  `;
});

function setMenuOpen(isOpen) {
  sidebarEl.classList.toggle('is-open', isOpen);
  sidebarBackdropEl.classList.toggle('is-open', isOpen);
  menuToggleBtn.setAttribute('aria-expanded', String(isOpen));
}

menuToggleBtn.addEventListener('click', () => setMenuOpen(true));
menuCloseBtn.addEventListener('click', () => setMenuOpen(false));
sidebarBackdropEl.addEventListener('click', () => setMenuOpen(false));

modalCloseBtn.addEventListener('click', closeActionModal);
actionModalEl.addEventListener('click', (event) => {
  if (event.target === actionModalEl) {
    closeActionModal();
  }
});

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    filterBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
    renderQueue();
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (!actionModalEl.hidden) {
      closeActionModal();
    } else if (sidebarEl.classList.contains('is-open')) {
      setMenuOpen(false);
    }
  }
});

renderQueue();
