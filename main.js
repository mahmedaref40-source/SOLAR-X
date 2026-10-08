// إدارة الشاشات الأساسية
function showScreen(screenId) {
  document.querySelectorAll('.app-screen').forEach(el => el.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    window.scrollTo(0, 0);
  }
}

function handleLogin(e) {
  e.preventDefault();
  showScreen('screen-dashboard');
}

// -------------------------------------------------------------
// إدارة خطوات الـ Wizard (Previous / Next)
// -------------------------------------------------------------
let currentStep = 1;
const totalSteps = 8;

const stepNames = [
  "Client & Site Data",
  "Solar System Topology & Goals",
  "Grid Connection Assessment",
  "Electrical Load Survey",
  "Rooftop & Panel Location Survey",
  "Inverter & Battery Room Evaluation",
  "Earthing & Surge Protection Survey",
  "STEP 01 | PV Array Energy & Capacity Sizing"
];

function updateStepView() {
  document.querySelectorAll('.survey-step-page').forEach((el, index) => {
    el.classList.toggle('active', index + 1 === currentStep);
  });

  const label = document.getElementById('currentStepLabel');
  const title = document.getElementById('currentStepTitle');
  const progBar = document.getElementById('stepProgressBar');

  if (label) label.textContent = `Page ${currentStep} of ${totalSteps}`;
  if (title) title.textContent = stepNames[currentStep - 1];
  if (progBar) {
    const percent = Math.round((currentStep / totalSteps) * 100);
    progBar.style.width = percent + "%";
  }

  const btnPrev = document.getElementById('btnPrevStep');
  const btnNext = document.getElementById('btnNextStep');

  if (btnPrev) btnPrev.disabled = (currentStep === 1);
  if (btnNext) {
    if (currentStep === totalSteps) {
      btnNext.innerHTML = '<i class="fa-solid fa-check-double me-1"></i> Completed';
      btnNext.disabled = true;
    } else {
      btnNext.innerHTML = 'Next <i class="fa-solid fa-arrow-right ms-1"></i>';
      btnNext.disabled = false;
    }
  }

  window.scrollTo(0, 100);
}

function nextSurveyStep() {
  if (currentStep < totalSteps) {
    currentStep++;
    updateStepView();
  }
}

function prevSurveyStep() {
  if (currentStep > 1) {
    currentStep--;
    updateStepView();
  }
}

// -------------------------------------------------------------
// جدول الأحمال والحسابات المباشرة الـ 21 جهازاً كما في الإكسيل
// -------------------------------------------------------------
const appliancesData = [
  { name: "LED Lighting", qty: 12, pwr: 15, surge: 1.0, day: 2, night: 6, crit: false },
  { name: "Refrigerator", qty: 1, pwr: 180, surge: 2.0, day: 6, night: 6, crit: false },
  { name: "Deep Freezer", qty: 1, pwr: 150, surge: 2.0, day: 5, night: 5, crit: false },
  { name: "TV & Receiver", qty: 1, pwr: 120, surge: 1.0, day: 2, night: 4, crit: false },
  { name: "Wi-Fi Router", qty: 1, pwr: 15, surge: 1.0, day: 12, night: 12, crit: true },
  { name: "Air Conditioner", qty: 1, pwr: 1200, surge: 1.5, day: 5, night: 3, crit: false },
  { name: "Ceiling Fan", qty: 3, pwr: 75, surge: 1.2, day: 4, night: 6, crit: false },
  { name: "Water Pump", qty: 1, pwr: 170, surge: 3.0, day: 1, night: 1, crit: true },
  { name: "Microwave Oven", qty: 1, pwr: 1000, surge: 1.2, day: 0.1, night: 0.2, crit: false },
  { name: "Washing Machine", qty: 1, pwr: 500, surge: 1.5, day: 1.5, night: 1.5, crit: false },
  { name: "Water Heater", qty: 1, pwr: 1500, surge: 1.0, day: 1.5, night: 1.5, crit: false },
  { name: "Iron", qty: 1, pwr: 1000, surge: 1.0, day: 0.5, night: 0.5, crit: false },
  { name: "Vacuum Cleaner", qty: 1, pwr: 2000, surge: 1.5, day: 0, night: 0.1, crit: false },
  { name: "Laptop", qty: 1, pwr: 180, surge: 1.0, day: 5, night: 6, crit: true },
  { name: "Mobile Chargers", qty: 2, pwr: 40, surge: 1.0, day: 1, night: 2, crit: true },
  { name: "Dishwasher", qty: 1, pwr: 1200, surge: 1.5, day: 0.5, night: 0.5, crit: false },
  { name: "Electric Kettle", qty: 1, pwr: 1500, surge: 1.0, day: 0.3, night: 0.2, crit: false },
  { name: "Coffee Maker", qty: 1, pwr: 800, surge: 1.0, day: 0.2, night: 0.1, crit: false },
  { name: "Hair Dryer", qty: 1, pwr: 1200, surge: 1.1, day: 0.2, night: 0, crit: false },
  { name: "Electric Oven", qty: 1, pwr: 2000, surge: 1.0, day: 0, night: 0.5, crit: false },
  { name: "Induction Cooktop", qty: 1, pwr: 1800, surge: 1.0, day: 0.5, night: 0.5, crit: false }
];

function populateAppliances() {
  const tbody = document.getElementById('applianceListBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  appliancesData.forEach((app, i) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${i + 1}</td>
      <td><input type="text" class="form-control form-control-sm text-start" value="${app.name}"></td>
      <td><input type="number" class="form-control form-control-sm" value="${app.qty}" oninput="recalcRow(this)"></td>
      <td><input type="number" class="form-control form-control-sm" value="${app.pwr}" oninput="recalcRow(this)"></td>
      <td><input type="number" step="0.1" class="form-control form-control-sm" value="${app.surge}" oninput="recalcRow(this)"></td>
      <td class="surge-power fw-bold text-warning">0</td>
      <td class="total-power fw-bold">0</td>
      <td><input type="number" step="0.1" class="form-control form-control-sm" value="${app.day}" oninput="recalcRow(this)"></td>
      <td><input type="number" step="0.1" class="form-control form-control-sm" value="${app.night}" oninput="recalcRow(this)"></td>
      <td class="day-wh">0</td>
      <td class="night-wh">0</td>
      <td class="total-wh fw-bold text-yellow">0</td>
      <td>
        <div class="d-flex justify-content-center gap-2">
          <label class="small"><input type="radio" name="crit_${i}" value="critical" ${app.crit ? 'checked' : ''} onchange="calculateAllTotals()"> Crit</label>
          <label class="small"><input type="radio" name="crit_${i}" value="non_critical" ${!app.crit ? 'checked' : ''} onchange="calculateAllTotals()"> Non</label>
        </div>
      </td>
    `;
    tbody.appendChild(row);
    recalcRowValues(row);
  });
  calculateAllTotals();
}

function recalcRow(input) {
  recalcRowValues(input.closest('tr'));
  calculateAllTotals();
}

function recalcRowValues(row) {
  const qty = parseFloat(row.cells[2].querySelector('input').value) || 0;
  const pwr = parseFloat(row.cells[3].querySelector('input').value) || 0;
  const surge = parseFloat(row.cells[4].querySelector('input').value) || 1.0;
  const day = parseFloat(row.cells[7].querySelector('input').value) || 0;
  const night = parseFloat(row.cells[8].querySelector('input').value) || 0;

  const surgePower = Math.round(pwr * surge);
  const totalPower = Math.round(qty * pwr);
  const dayWh = Math.round(qty * pwr * day);
  const nightWh = Math.round(qty * pwr * night);
  const totalWh = dayWh + nightWh;

  row.querySelector('.surge-power').textContent = surgePower;
  row.querySelector('.total-power').textContent = totalPower;
  row.querySelector('.day-wh').textContent = dayWh;
  row.querySelector('.night-wh').textContent = nightWh;
  row.querySelector('.total-wh').textContent = totalWh;
}

function calculateAllTotals() {
  let connSurge = 0, connPwr = 0, connDay = 0, connNight = 0, connTotal = 0;
  let critSurge = 0, critPwr = 0, critDay = 0, critNight = 0, critTotal = 0;
  let nonSurge = 0, nonPwr = 0, nonDay = 0, nonNight = 0, nonTotal = 0;

  document.querySelectorAll('#applianceListBody tr').forEach(row => {
    const surge = parseFloat(row.querySelector('.surge-power').textContent) || 0;
    const pwr = parseFloat(row.querySelector('.total-power').textContent) || 0;
    const day = parseFloat(row.querySelector('.day-wh').textContent) || 0;
    const night = parseFloat(row.querySelector('.night-wh').textContent) || 0;
    const total = parseFloat(row.querySelector('.total-wh').textContent) || 0;
    const isCrit = row.querySelector('input[type="radio"]:checked')?.value === 'critical';

    connSurge += surge; connPwr += pwr; connDay += day; connNight += night; connTotal += total;

    if (isCrit) {
      critSurge += surge; critPwr += pwr; critDay += day; critNight += night; critTotal += total;
    } else {
      nonSurge += surge; nonPwr += pwr; nonDay += day; nonNight += night; nonTotal += total;
    }
  });

  const updateEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  updateEl('totConnSurge', connSurge);
  updateEl('totConnPwr', connPwr);
  updateEl('totConnDayWh', connDay);
  updateEl('totConnNightWh', connNight);
  updateEl('totConnTotalWh', connTotal);

  updateEl('totCritSurge', critSurge);
  updateEl('totCritPwr', critPwr);
  updateEl('totCritDayWh', critDay);
  updateEl('totCritNightWh', critNight);
  updateEl('totCritTotalWh', critTotal);

  updateEl('totNonCritSurge', nonSurge);
  updateEl('totNonCritPwr', nonPwr);
  updateEl('totNonCritDayWh', nonDay);
  updateEl('totNonCritNightWh', nonNight);
  updateEl('totNonCritTotalWh', nonTotal);

  calculateStepOne();
}

function calculateStepOne() {
  const totalDailyWh = parseFloat(document.getElementById('totConnTotalWh')?.textContent) || 0;
  const totalEnergyInput = document.getElementById('step1_totalDailyEnergy');
  if (totalEnergyInput) totalEnergyInput.value = totalDailyWh;

  const efficiency = parseFloat(document.getElementById('step1_systemEfficiency')?.value) || 0;
  const expansionPercent = parseFloat(document.getElementById('step1_futureExpansion')?.value) || 0;

  let requiredPvWh = 0;
  if (efficiency > 0) {
    requiredPvWh = Math.round((totalDailyWh * (1 + (expansionPercent / 100))) / efficiency);
  }

  const resultInput = document.getElementById('step1_requiredPvEnergy');
  if (resultInput) resultInput.value = requiredPvWh;
}

// -------------------------------------------------------------
// الآلة الحاسبة العلمية
// -------------------------------------------------------------
let currentCalcExpr = "";
let isEvaluated = false;

function calcAppend(val) {
  const screen = document.getElementById('calcScreen');
  if (isEvaluated && !['+', '-', '*', '/', '^'].includes(val)) {
    currentCalcExpr = "";
    isEvaluated = false;
  }
  isEvaluated = false;
  currentCalcExpr += val;
  if (screen) screen.textContent = currentCalcExpr;
}

function calcClearAll() {
  currentCalcExpr = "";
  isEvaluated = false;
  const screen = document.getElementById('calcScreen');
  const hist = document.getElementById('calcHistory');
  if (screen) screen.textContent = "0";
  if (hist) hist.innerHTML = "&nbsp;";
}

function calcDeleteChar() {
  if (isEvaluated) { calcClearAll(); return; }
  currentCalcExpr = currentCalcExpr.slice(0, -1);
  const screen = document.getElementById('calcScreen');
  if (screen) screen.textContent = currentCalcExpr || "0";
}

function calcFunction(fnName) {
  const screen = document.getElementById('calcScreen');
  let currentVal = parseFloat(screen?.textContent) || 0;
  let res = 0;

  switch (fnName) {
    case 'sin': res = Math.sin((currentVal * Math.PI) / 180); break;
    case 'cos': res = Math.cos((currentVal * Math.PI) / 180); break;
    case 'tan': res = Math.tan((currentVal * Math.PI) / 180); break;
    case 'sqrt': res = currentVal >= 0 ? Math.sqrt(currentVal) : "Error"; break;
    case 'sq': res = Math.pow(currentVal, 2); break;
    case 'log': res = currentVal > 0 ? Math.log10(currentVal) : "Error"; break;
    case 'ln': res = currentVal > 0 ? Math.log(currentVal) : "Error"; break;
    case 'abs': res = Math.abs(currentVal); break;
    case 'inv': res = currentVal !== 0 ? 1 / currentVal : "Error"; break;
  }

  const hist = document.getElementById('calcHistory');
  if (hist) hist.textContent = `${fnName}(${currentVal})`;
  currentCalcExpr = typeof res === 'number' ? parseFloat(res.toFixed(6)).toString() : "";
  if (screen) screen.textContent = currentCalcExpr || res;
  isEvaluated = true;
}

function calcEvaluate() {
  const screen = document.getElementById('calcScreen');
  const history = document.getElementById('calcHistory');
  if (!currentCalcExpr || !screen) return;

  if (history) history.textContent = currentCalcExpr + " =";
  try {
    let sanitized = currentCalcExpr
      .replace(/π/g, Math.PI.toString())
      .replace(/e/g, Math.E.toString())
      .replace(/\^/g, '**')
      .replace(/%/g, '*0.01');

    const compute = new Function(`return ${sanitized}`);
    let result = compute();

    if (typeof result === 'number' && !isNaN(result)) {
      result = parseFloat(result.toFixed(6));
      screen.textContent = result;
      currentCalcExpr = result.toString();
      isEvaluated = true;
    } else {
      screen.textContent = "Error";
      currentCalcExpr = "";
    }
  } catch {
    screen.textContent = "Error";
    currentCalcExpr = "";
  }
}

// -------------------------------------------------------------
// محرك الذكاء الاصطناعي الشامل
// -------------------------------------------------------------
function executeUniversalAI() {
  const inputEl = document.getElementById('aiUniversalInput');
  const query = inputEl?.value.trim();
  if (!query) return;

  const chatContainer = document.getElementById('aiUniversalChat');
  const typingStatus = document.getElementById('aiTypingStatus');

  const userMsg = document.createElement('div');
  userMsg.className = "ai-bubble user";
  userMsg.textContent = query;
  chatContainer?.appendChild(userMsg);

  inputEl.value = "";
  if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
  if (typingStatus) typingStatus.classList.remove('d-none');

  setTimeout(() => {
    generateUniversalResponse(query);
    if (typingStatus) typingStatus.classList.add('d-none');
  }, 500);
}

async function generateUniversalResponse(query) {
  const chatContainer = document.getElementById('aiUniversalChat');
  const botMsg = document.createElement('div');
  botMsg.className = "ai-bubble bot";
  botMsg.innerHTML = "<em>جاري التفكير والرد...</em>";
  chatContainer?.appendChild(botMsg);
  if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;

  try {
    const res = await fetch('/api/chat-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: query })
    });
    const data = await res.json();
    botMsg.innerHTML = `<strong>SOLAR X AI:</strong><br>${(data.reply || '').replace(/\n/g, '<br>')}`;
  } catch (error) {
    botMsg.innerHTML = `<strong>SOLAR X AI:</strong><br>تعذر الاتصال بالذكاء الاصطناعي، تأكد من تشغيل السيرفر ومن اتصال الإنترنت.`;
  }

  if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
}

// -------------------------------------------------------------
// أرشيف المشاريع من الخادم والـ Canvas (مع دعم اللمس)
// -------------------------------------------------------------
async function loadProjectsArchive() {
  const listContainer = document.getElementById('projectsArchiveList');
  if (!listContainer) return;
  try {
    const res = await fetch('/api/projects');
    const projects = await res.json();
    if (!projects || projects.length === 0) {
      listContainer.innerHTML = '<p class="text-secondary text-center my-3">No saved projects found in database.</p>';
      return;
    }
    let html = '<div class="list-group">';
    projects.forEach(p => {
      html += `
        <div class="list-group-item bg-dark text-white border-secondary mb-2 rounded">
          <div class="d-flex justify-content-between">
            <h6 class="text-yellow fw-bold m-0">${p.client_name || 'Project'}</h6>
            <span class="badge bg-warning text-dark">${p.project_id || 'ID: ' + p.id}</span>
          </div>
          <small class="text-secondary">Type: ${p.system_type || 'General'} | Date: ${p.survey_date || 'N/A'}</small>
        </div>`;
    });
    html += '</div>';
    listContainer.innerHTML = html;
  } catch {
    listContainer.innerHTML = '<p class="text-secondary text-center my-3">Server offline. Showing local template.</p>';
  }
}

let canvas, ctx, painting = false;

function initCanvas() {
  canvas = document.getElementById('sketchPad');
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const getPos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDraw = (e) => {
    painting = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    if (!painting) return;
    const pos = getPos(e);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDraw = () => {
    painting = false;
    ctx.beginPath();
  };

  // دعم الماوس
  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mouseup', stopDraw);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseleave', stopDraw);

  // دعم التاتش للموبايل
  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDraw(e); }, { passive: false });
  canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); }, { passive: false });
  canvas.addEventListener('touchend', stopDraw);
}

function clearCanvas() {
  if (!canvas || !ctx) return;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// حفظ المشروع
async function exportDataAsJSON() {
  const form = document.getElementById('solarSurveyMasterForm');
  const formData = form ? new FormData(form) : new FormData();
  const data = Object.fromEntries(formData.entries());

  const loads = [];
  document.querySelectorAll('#applianceListBody tr').forEach(r => {
    loads.push({
      appliance: r.cells[1].querySelector('input').value,
      qty: r.cells[2].querySelector('input').value,
      power_w: r.cells[3].querySelector('input').value,
      surge_factor: r.cells[4].querySelector('input').value,
      total_wh: r.querySelector('.total-wh').textContent,
      type: r.querySelector('input[type="radio"]:checked')?.value || 'non_critical'
    });
  });
  data.loads = loads;

  try {
    const res = await fetch('/api/save-survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) alert("✅ تم حفظ الاستبيان بنجاح في قاعدة البيانات!");
    else alert("❌ حدث خطأ في الخادم أثناء الحفظ");
  } catch {
    alert("❌ تعذر الاتصال بالسيرفر! تأكد من تشغيل python app.py");
  }
}

document.addEventListener('DOMContentLoaded', () => {
  populateAppliances();
  initCanvas();
  updateStepView();
});