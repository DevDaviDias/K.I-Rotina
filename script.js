/* ═══════════════════════════════════════════
   KOUDO IKUSEI — Sistema de Rotina
   script.js — Classroom of the Elite theme
   + Toast interno a cada mudança de tarefa
   + Subtarefas em todas as tarefas
   + Notificações do sistema
═══════════════════════════════════════════ */

'use strict';

// ─── ROTINA BASE PADRÃO ─────────────────────
const DEFAULT_ROUTINE = {
  0: [
    { time:"05:00", name:"Acordar",              subtasks:[] },
    { time:"05:15", name:"Alongamento",           subtasks:["Pescoço e ombros","Lombar","Pernas"] },
    { time:"06:00", name:"Estudar",               subtasks:[] },
    { time:"09:00", name:"Trabalho",              subtasks:[] },
    { time:"12:00", name:"Almoço",                subtasks:[] },
    { time:"13:00", name:"Trabalho (tarde)",      subtasks:[] },
    { time:"17:00", name:"Descanso",              subtasks:[] },
    { time:"19:00", name:"Jantar",                subtasks:[] },
    { time:"21:00", name:"Revisão do dia",        subtasks:["Anotar conquistas","Planejar amanhã"] },
    { time:"22:00", name:"Dormir",                subtasks:[] },
  ],
  1: [
    { time:"05:00", name:"Acordar",               subtasks:[] },
    { time:"05:30", name:"Meditação",             subtasks:[] },
    { time:"06:30", name:"Estudar",               subtasks:[] },
    { time:"09:00", name:"Trabalho",              subtasks:[] },
    { time:"12:00", name:"Almoço",                subtasks:[] },
    { time:"13:00", name:"Trabalho (tarde)",      subtasks:[] },
    { time:"18:00", name:"Caminhada",             subtasks:[] },
    { time:"19:30", name:"Jantar",                subtasks:[] },
    { time:"22:00", name:"Dormir",                subtasks:[] },
  ],
  2: [
    { time:"05:00", name:"Acordar",               subtasks:[] },
    { time:"05:30", name:"Exercícios",            subtasks:["Aquecimento","Treino principal","Alongamento final"] },
    { time:"06:30", name:"Estudar",               subtasks:[] },
    { time:"09:00", name:"Trabalho",              subtasks:[] },
    { time:"12:00", name:"Almoço",                subtasks:[] },
    { time:"13:00", name:"Trabalho (tarde)",      subtasks:[] },
    { time:"17:00", name:"Tempo livre",           subtasks:[] },
    { time:"19:00", name:"Jantar",                subtasks:[] },
    { time:"22:00", name:"Dormir",                subtasks:[] },
  ],
  3: [
    { time:"05:00", name:"Acordar",               subtasks:[] },
    { time:"05:30", name:"Meditação",             subtasks:[] },
    { time:"06:30", name:"Estudar",               subtasks:[] },
    { time:"09:00", name:"Trabalho",              subtasks:[] },
    { time:"12:00", name:"Almoço",                subtasks:[] },
    { time:"13:00", name:"Trabalho (tarde)",      subtasks:[] },
    { time:"18:00", name:"Caminhada",             subtasks:[] },
    { time:"19:30", name:"Jantar",                subtasks:[] },
    { time:"22:00", name:"Dormir",                subtasks:[] },
  ],
  4: [
    { time:"05:00", name:"Acordar",               subtasks:[] },
    { time:"05:30", name:"Exercícios",            subtasks:[] },
    { time:"06:30", name:"Estudar",               subtasks:[] },
    { time:"09:00", name:"Trabalho",              subtasks:[] },
    { time:"12:00", name:"Almoço",                subtasks:[] },
    { time:"13:00", name:"Trabalho (tarde)",      subtasks:[] },
    { time:"17:30", name:"Planejamento da semana",subtasks:["Revisar metas","Definir prioridades"] },
    { time:"19:00", name:"Jantar",                subtasks:[] },
    { time:"22:30", name:"Dormir",                subtasks:[] },
  ],
  5: [
    { time:"07:00", name:"Acordar",               subtasks:[] },
    { time:"08:00", name:"Café tranquilo",        subtasks:[] },
    { time:"09:00", name:"Atividade física",      subtasks:[] },
    { time:"12:00", name:"Almoço",                subtasks:[] },
    { time:"14:00", name:"Projetos pessoais",     subtasks:[] },
    { time:"19:00", name:"Jantar",                subtasks:[] },
    { time:"23:00", name:"Dormir",                subtasks:[] },
  ],
  6: [
    { time:"07:30", name:"Acordar",               subtasks:[] },
    { time:"08:30", name:"Café com calma",        subtasks:[] },
    { time:"10:00", name:"Descanso / leitura",    subtasks:[] },
    { time:"12:30", name:"Almoço",                subtasks:[] },
    { time:"15:00", name:"Passeio",               subtasks:[] },
    { time:"19:00", name:"Jantar",                subtasks:[] },
    { time:"21:00", name:"Preparar a semana",     subtasks:["Roupas","Agenda","Lista de compras"] },
    { time:"22:30", name:"Dormir",                subtasks:[] },
  ],
};

const DAY_NAMES = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
const MONTHS    = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];

function jsToIdx(d) { return d === 0 ? 6 : d - 1; }

// ─── TEMPO ──────────────────────────────────
function timeToMin(t) {
  const [h,m] = t.split(":").map(Number);
  return h*60+m;
}
function nowMin() {
  const n = new Date();
  return n.getHours()*60 + n.getMinutes();
}
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}
function formatCountdown(nextTime) {
  if (!nextTime) return "último";
  let diff = timeToMin(nextTime) - nowMin();
  if (diff < 0) diff += 1440;
  const h = Math.floor(diff/60), m = diff%60;
  if (h===0) return `${m}min`;
  if (m===0) return `${h}h`;
  return `${h}h ${m}m`;
}
function formatClock() {
  const n = new Date();
  const p = x => String(x).padStart(2,"0");
  return `${p(n.getHours())}:${p(n.getMinutes())}:${p(n.getSeconds())}`;
}

// ─── STORAGE ────────────────────────────────
function getBase()          { return JSON.parse(localStorage.getItem("base") || "null") || JSON.parse(JSON.stringify(DEFAULT_ROUTINE)); }
function setBase(d)         { localStorage.setItem("base", JSON.stringify(d)); }
function getTodayOverride() { return JSON.parse(localStorage.getItem("today_"+todayKey()) || "null"); }
function setTodayOverride(d){ localStorage.setItem("today_"+todayKey(), JSON.stringify(d)); }
function clearTodayOvr()    { localStorage.removeItem("today_"+todayKey()); }
function getTodayDone()     { return JSON.parse(localStorage.getItem("done_"+todayKey()) || "[]"); }
function setTodayDone(d)    { localStorage.setItem("done_"+todayKey(), JSON.stringify(d)); }
function getSubDone()       { return JSON.parse(localStorage.getItem("subdone_"+todayKey()) || "{}"); }
function setSubDone(d)      { localStorage.setItem("subdone_"+todayKey(), JSON.stringify(d)); }
function getReminders()     { return JSON.parse(localStorage.getItem("reminders") || "[]"); }
function setReminders(d)    { localStorage.setItem("reminders", JSON.stringify(d)); }

function getTodayTasks() {
  const ovr = getTodayOverride();
  if (ovr) return ovr;
  const base = getBase();
  const idx  = jsToIdx(new Date().getDay());
  const tasks = JSON.parse(JSON.stringify(base[idx] || []));
  return tasks.map(t => ({ ...t, subtasks: t.subtasks || [] }));
}

// ─── ESTADO GLOBAL ──────────────────────────
let configTab    = 0;
let notifTimers  = [];
let tickId       = null;
let clockId      = null;
let expandedTasks = new Set();
let lastTaskIdx  = -2;   // para detectar mudança de tarefa
let toastTimer   = null;

// ─── NAVEGAÇÃO ──────────────────────────────
function showView(id) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
  if (id === "view-home")        renderHome();
  if (id === "view-edit-today")  renderEditToday();
  if (id === "view-settings")    { configTab=0; refreshDayTabs(); renderSettingsTab(); }
  if (id === "view-reminders")   renderReminders();
}

// ─── TOAST INTERNO ───────────────────────────
function showToast(taskName, taskTime) {
  const el   = document.getElementById("toast-notif");
  const body = document.getElementById("toast-body");
  body.textContent = `${taskTime} — ${taskName}`;
  el.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 4500);
}

// ─── HOME ────────────────────────────────────
function renderHome() {
  const now   = new Date();
  const jsDay = now.getDay();

  document.getElementById("hdr-day").textContent  = DAY_NAMES[jsDay];
  document.getElementById("hdr-date").textContent = `${now.getDate()} ${MONTHS[now.getMonth()]}`;

  const tasks  = getTodayTasks();
  const done   = getTodayDone();
  const subDone= getSubDone();
  const nm     = nowMin();

  // Tarefa atual
  let curIdx = -1;
  for (let i=0; i<tasks.length; i++) {
    if (timeToMin(tasks[i].time) <= nm) curIdx = i;
  }

  // Detectar mudança de tarefa → mostrar toast
  if (curIdx !== lastTaskIdx && lastTaskIdx !== -2) {
    const cur = curIdx >= 0 ? tasks[curIdx] : null;
    if (cur) showToast(cur.name, cur.time);
  }
  if (lastTaskIdx !== curIdx) lastTaskIdx = curIdx;

  const cur  = curIdx >= 0 ? tasks[curIdx] : null;
  const next = tasks[curIdx+1] || null;

  document.getElementById("now-time").textContent = cur ? cur.time : "—";
  document.getElementById("now-name").textContent = cur ? cur.name : "Aguardando início";
  document.getElementById("next-label").textContent = next ? `${next.time} · ${next.name}` : "nenhuma";
  document.getElementById("countdown-pill").textContent = next ? formatCountdown(next.time) : "último";

  // Subtarefas do now-card
  const nowSubsEl = document.getElementById("now-subtasks");
  nowSubsEl.innerHTML = "";
  if (cur && cur.subtasks && cur.subtasks.length > 0) {
    const key = String(curIdx);
    cur.subtasks.forEach((sub, si) => {
      const isDone = (subDone[key] || []).includes(si);
      const row = document.createElement("div");
      row.className = "now-subtask-item" + (isDone ? " is-done" : "");
      row.innerHTML = `
        <div class="now-sub-check"><span class="now-sub-icon">✓</span></div>
        <span class="now-sub-label">${sub}</span>
      `;
      row.addEventListener("click", (e) => { e.stopPropagation(); toggleSubDone(curIdx, si); });
      nowSubsEl.appendChild(row);
    });
  }

  // Progresso
  let totalUnits = 0, doneUnits = 0;
  tasks.forEach((t, i) => {
    const subs = t.subtasks || [];
    if (subs.length > 0) {
      totalUnits += subs.length;
      const key = String(i);
      doneUnits += (subDone[key] || []).length;
    } else {
      totalUnits += 1;
      if (done.includes(i)) doneUnits += 1;
    }
  });
  const pct = totalUnits ? (doneUnits / totalUnits)*100 : 0;
  document.getElementById("progress-fill").style.width = pct + "%";
  document.getElementById("progress-label").textContent = `${done.length} / ${tasks.length}`;

  // Lista
  const list = document.getElementById("task-list");
  list.innerHTML = "";
  tasks.forEach((t, i) => {
    const isDone    = done.includes(i);
    const isCurrent = i === curIdx && !isDone;
    const subs      = t.subtasks || [];
    const key       = String(i);
    const subsDone  = subDone[key] || [];
    const isExpanded= expandedTasks.has(i);

    const li = document.createElement("li");
    li.className = "task-item" + (isDone ? " is-done" : "") + (isCurrent ? " is-current" : "");

    let badgeHtml = "";
    if (subs.length > 0) {
      badgeHtml = `<span class="t-sub-count">${subsDone.length}/${subs.length}</span>`;
    }
    const expandHtml = subs.length > 0
      ? `<button class="t-expand${isExpanded?" open":""}" data-i="${i}">▸</button>`
      : "";

    const subsHtml = subs.length > 0 ? `
      <div class="task-subtasks${isExpanded?" open":""}">
        ${subs.map((s, si) => `
          <div class="sub-item${subsDone.includes(si)?" is-done":""}" data-i="${i}" data-si="${si}">
            <div class="sub-check"><span class="sub-check-icon">✓</span></div>
            <span class="sub-label">${s}</span>
          </div>
        `).join("")}
      </div>
    ` : "";

    li.innerHTML = `
      <div class="task-item-row">
        <div class="task-check"><span class="task-check-icon">✓</span></div>
        <span class="t-time">${t.time}</span>
        <span class="t-name">${t.name}</span>
        ${badgeHtml}
        ${expandHtml}
      </div>
      ${subsHtml}
    `;

    li.querySelector(".task-item-row").addEventListener("click", (e) => {
      if (e.target.closest(".t-expand")) return;
      toggleDone(i);
    });

    const expandBtn = li.querySelector(".t-expand");
    if (expandBtn) {
      expandBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (expandedTasks.has(i)) expandedTasks.delete(i);
        else expandedTasks.add(i);
        renderHome();
      });
    }

    li.querySelectorAll(".sub-item").forEach(row => {
      row.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleSubDone(parseInt(row.dataset.i), parseInt(row.dataset.si));
      });
    });

    list.appendChild(li);
  });

  exposeWidgetData(tasks, done, subDone, cur, next);
}

function toggleDone(idx) {
  const done = getTodayDone();
  const pos  = done.indexOf(idx);
  if (pos >= 0) done.splice(pos, 1);
  else done.push(idx);
  setTodayDone(done);
  renderHome();
}

function toggleSubDone(taskIdx, subIdx) {
  const subDone = getSubDone();
  const key     = String(taskIdx);
  if (!subDone[key]) subDone[key] = [];
  const pos = subDone[key].indexOf(subIdx);
  if (pos >= 0) subDone[key].splice(pos, 1);
  else subDone[key].push(subIdx);
  setSubDone(subDone);
  renderHome();
}

// ─── WIDGET DATA ────────────────────────────
function exposeWidgetData(tasks, done, subDone, cur, next) {
  const data = {
    updated: new Date().toISOString(),
    current: cur ? { time: cur.time, name: cur.name } : null,
    next:    next ? { time: next.time, name: next.name } : null,
    countdown: next ? formatCountdown(next.time) : "último",
    progress: {
      done: done.length,
      total: tasks.length,
      pct: tasks.length ? Math.round((done.length / tasks.length)*100) : 0
    }
  };
  localStorage.setItem("rotina_widget", JSON.stringify(data));
}

// ─── LEMBRETES ──────────────────────────────
function renderReminders() {
  const reminders = getReminders();
  const pendingEl = document.getElementById("reminder-list-pending");
  const doneEl    = document.getElementById("reminder-list-done");
  pendingEl.innerHTML = "";
  doneEl.innerHTML    = "";

  if (reminders.length === 0) {
    pendingEl.innerHTML = `<li style="padding:12px 14px;font-family:var(--font-mono);font-size:.72rem;color:var(--muted);letter-spacing:.08em">// nenhum lembrete registrado</li>`;
    return;
  }

  const sorted = [...reminders].sort((a,b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return (a.datetime||"") < (b.datetime||"") ? -1 : 1;
  });

  sorted.forEach(r => {
    const li = document.createElement("li");
    const meta = formatReminderMeta(r);
    li.className = "reminder-item" + (r.done ? " is-done" : "");
    li.innerHTML = `
      <div class="r-check"><span class="r-check-icon">✓</span></div>
      <div class="r-content">
        <div class="r-text">${r.text}</div>
        ${meta ? `<div class="r-dt">${meta}</div>` : ""}
      </div>
      <button class="r-del">×</button>
    `;
    li.querySelector(".r-check").addEventListener("click", () => toggleReminderDone(r.id));
    li.querySelector(".r-content").addEventListener("click", () => toggleReminderDone(r.id));
    li.querySelector(".r-del").addEventListener("click", (e) => { e.stopPropagation(); deleteReminder(r.id); });
    (r.done ? doneEl : pendingEl).appendChild(li);
  });
}

function formatReminderMeta(r) {
  if (!r.datetime) return "";
  const d = new Date(r.datetime);
  const pad = n => String(n).padStart(2,"0");
  return `${d.getDate()} ${MONTHS[d.getMonth()]} · ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toggleReminderDone(id) {
  const rems = getReminders().map(r => r.id===id ? {...r, done:!r.done} : r);
  setReminders(rems);
  renderReminders();
}

function deleteReminder(id) {
  setReminders(getReminders().filter(x => x.id!==id));
  renderReminders();
}

function openReminderModal() {
  const d   = new Date();
  const pad = n => String(n).padStart(2,"0");
  document.getElementById("rm-date").value = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  document.getElementById("rm-time").value = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  document.getElementById("rm-text").value = "";
  document.getElementById("reminder-modal").classList.remove("hidden");
  setTimeout(() => document.getElementById("rm-text").focus(), 100);
}

function closeReminderModal() {
  document.getElementById("reminder-modal").classList.add("hidden");
}

function saveReminder() {
  const text = document.getElementById("rm-text").value.trim();
  if (!text) { document.getElementById("rm-text").focus(); return; }
  const date = document.getElementById("rm-date").value;
  const time = document.getElementById("rm-time").value;
  const datetime = (date && time) ? `${date}T${time}` : null;
  const rem = getReminders();
  rem.push({ id: Date.now().toString(), text, datetime, done: false });
  setReminders(rem);
  closeReminderModal();
  renderReminders();
  scheduleReminderNotif(rem[rem.length-1]);
}

// ─── SUBTASK MODAL ──────────────────────────
let subtaskModalContext = null;

function openSubtaskModal(taskIdx, mode) {
  subtaskModalContext = { taskIdx, mode };
  const tasks = mode === "today" ? getTodayTasks() : (getBase()[configTab] || []);
  const task  = tasks[taskIdx];
  if (!task) return;

  document.getElementById("sub-task-label").textContent = `// ${task.time} — ${task.name}`;
  const list = document.getElementById("subtask-edit-list");
  list.innerHTML = "";

  (task.subtasks || []).forEach((s, si) => {
    appendSubEditRow(list, s, si);
  });

  document.getElementById("subtask-modal").classList.remove("hidden");
}

function closeSubtaskModal() {
  document.getElementById("subtask-modal").classList.add("hidden");
  subtaskModalContext = null;
}

function appendSubEditRow(list, value, idx) {
  const li = document.createElement("li");
  li.innerHTML = `
    <div class="sub-edit-row">
      <input type="text" value="${value}" placeholder="Subtarefa..." />
      <button class="sub-edit-del">×</button>
    </div>
  `;
  li.querySelector(".sub-edit-del").addEventListener("click", () => {
    li.remove();
    saveSubtaskModal();
  });
  li.querySelector("input").addEventListener("input", () => saveSubtaskModal());
  list.appendChild(li);
}

function saveSubtaskModal() {
  if (!subtaskModalContext) return;
  const { taskIdx, mode } = subtaskModalContext;
  const inputs = document.querySelectorAll("#subtask-edit-list input");
  const subs   = [...inputs].map(i => i.value.trim()).filter(Boolean);

  if (mode === "today") {
    const tasks = getTodayTasks();
    if (tasks[taskIdx]) { tasks[taskIdx].subtasks = subs; setTodayOverride(tasks); }
  } else {
    const base  = getBase();
    const tasks = base[configTab] || [];
    if (tasks[taskIdx]) { tasks[taskIdx].subtasks = subs; base[configTab] = tasks; setBase(base); }
  }
  renderHome();
}

// ─── EDITAR HOJE ────────────────────────────
function renderEditToday() {
  const tasks = getTodayTasks();
  const ul    = document.getElementById("edit-today-list");
  ul.innerHTML = "";
  tasks.forEach((t) => appendEditItem(ul, t, "today"));
}

function renderSettingsTab() {
  const base  = getBase();
  const tasks = base[configTab] || [];
  const ul    = document.getElementById("settings-list");
  ul.innerHTML = "";
  tasks.forEach(t => appendEditItem(ul, t, "settings"));
}

function appendEditItem(ul, t, mode) {
  const subs    = t.subtasks || [];
  const li      = document.createElement("li");
  li.className  = "edit-item";

  const subRows = subs.map(s => `
    <div class="edit-sub-row">
      <input type="text" value="${s}" placeholder="Subtarefa..." class="ei-sub"/>
      <button class="edit-sub-del" title="Remover">×</button>
    </div>
  `).join("");

  const hasOpen = subs.length > 0;

  li.innerHTML = `
    <div class="edit-item-row">
      <input type="time" value="${t.time}" class="ei-time"/>
      <input type="text" value="${t.name}" placeholder="Tarefa..." class="ei-name"/>
      <button class="subtask-toggle${hasOpen?" open":""}">▸ ${subs.length > 0 ? subs.length : "sub"}</button>
      <button class="del-btn">×</button>
    </div>
    <div class="edit-subtask-area${hasOpen?" open":""}">
      ${subRows}
      <button class="add-sub-btn">+ subtarefa</button>
    </div>
  `;

  const subArea   = li.querySelector(".edit-subtask-area");
  const subToggle = li.querySelector(".subtask-toggle");

  subToggle.addEventListener("click", () => {
    subArea.classList.toggle("open");
    subToggle.classList.toggle("open");
  });

  li.querySelector(".del-btn").addEventListener("click", () => { li.remove(); autoSave(mode); });
  li.querySelector(".ei-time").addEventListener("change", () => autoSave(mode));
  li.querySelector(".ei-name").addEventListener("input",  () => autoSave(mode));

  li.querySelector(".add-sub-btn").addEventListener("click", () => {
    addSubRow(subArea, mode);
    subArea.classList.add("open");
    subToggle.classList.add("open");
  });

  subArea.querySelectorAll(".edit-sub-row").forEach(row => {
    row.querySelector("input").addEventListener("input", () => autoSave(mode));
    row.querySelector(".edit-sub-del").addEventListener("click", () => { row.remove(); autoSave(mode); });
  });

  ul.appendChild(li);
}

function addSubRow(subArea, mode) {
  const row = document.createElement("div");
  row.className = "edit-sub-row";
  row.innerHTML = `
    <input type="text" placeholder="Subtarefa..." class="ei-sub"/>
    <button class="edit-sub-del" title="Remover">×</button>
  `;
  const addBtn = subArea.querySelector(".add-sub-btn");
  subArea.insertBefore(row, addBtn);
  row.querySelector("input").focus();
  row.querySelector("input").addEventListener("input",  () => autoSave(mode));
  row.querySelector(".edit-sub-del").addEventListener("click", () => { row.remove(); autoSave(mode); });
}

function autoSave(mode) {
  if (mode === "today") {
    setTodayOverride(collectList("edit-today-list"));
    renderHome();
  } else {
    const base = getBase();
    base[configTab] = collectList("settings-list");
    setBase(base);
  }
}

function collectList(id) {
  const items = document.querySelectorAll(`#${id} .edit-item`);
  return [...items].map(li => {
    const subs = [...li.querySelectorAll(".ei-sub")]
      .map(i => i.value.trim())
      .filter(Boolean);
    return {
      time:     li.querySelector(".ei-time").value,
      name:     li.querySelector(".ei-name").value.trim(),
      subtasks: subs,
    };
  }).filter(t => t.time && t.name)
    .sort((a,b) => timeToMin(a.time)-timeToMin(b.time));
}

function addEditRow(listId, mode) {
  const ul = document.getElementById(listId);
  const nm = nowMin();
  const t  = {
    time: `${String(Math.floor(nm/60)).padStart(2,"0")}:${String(nm%60).padStart(2,"0")}`,
    name: "",
    subtasks: [],
  };
  appendEditItem(ul, t, mode);
  ul.querySelector(".edit-item:last-child .ei-name").focus();
}

function refreshDayTabs() {
  document.querySelectorAll(".day-tab").forEach(b =>
    b.classList.toggle("active", parseInt(b.dataset.d) === configTab)
  );
}

// ─── NOTIFICAÇÕES ────────────────────────────
function scheduleTaskNotifs() {
  notifTimers.forEach(clearTimeout);
  notifTimers = [];
  if (Notification.permission !== "granted") return;

  const tasks = getTodayTasks();
  const now   = new Date();

  tasks.forEach(t => {
    const [h,m] = t.time.split(":").map(Number);
    const target = new Date(now);
    target.setHours(h,m,0,0);
    const delay = target - now;
    if (delay > 0) {
      notifTimers.push(setTimeout(() => {
        new Notification("K.I. Rotina", {
          body: `${t.time} — ${t.name}`,
          icon:"/icon-192.png",
          badge:"/icon-192.png",
          tag: `task-${t.time}`,
        });
        // Também mostra o toast interno
        showToast(t.name, t.time);
      }, delay));
    }
  });
}

function scheduleReminderNotif(r) {
  if (!r.datetime || Notification.permission !== "granted") return;
  const target = new Date(r.datetime);
  const delay  = target - new Date();
  if (delay > 0) {
    setTimeout(() => {
      new Notification("Lembrete", { body: r.text, icon:"/icon-192.png" });
    }, delay);
  }
}

async function requestNotif() {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
  if (Notification.permission === "granted") {
    scheduleTaskNotifs();
  }
}

// ─── PWA / SERVICE WORKER ────────────────────
function registerSW() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }
}

function checkInstallBanner() {
  const isIOS        = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone = window.navigator.standalone === true;
  if (isIOS && !isStandalone) {
    document.getElementById("install-banner").classList.remove("hidden");
  }
}

// ─── CLOCK TICK ──────────────────────────────
function startClock() {
  const el = document.getElementById("sys-clock");
  if (!el) return;
  const update = () => { if (el) el.textContent = formatClock(); };
  update();
  if (clockId) clearInterval(clockId);
  clockId = setInterval(update, 1000);
}

// ─── MAIN TICK ──────────────────────────────
function startTick() {
  if (tickId) clearInterval(tickId);
  renderHome();
  tickId = setInterval(() => {
    renderHome();
    checkMidnight();
  }, 30_000);
}

let lastDate = todayKey();
function checkMidnight() {
  const k = todayKey();
  if (k !== lastDate) {
    lastDate = k;
    expandedTasks.clear();
    lastTaskIdx = -2;
    scheduleTaskNotifs();
    renderHome();
  }
}

// ─── INIT ────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  registerSW();
  startTick();
  checkInstallBanner();
  requestNotif();

  // Lembretes
  document.getElementById("btn-add-reminder").addEventListener("click", openReminderModal);
  document.getElementById("btn-confirm-reminder").addEventListener("click", saveReminder);
  document.getElementById("reminder-modal").addEventListener("click", e => {
    if (e.target === e.currentTarget) closeReminderModal();
  });

  // Modal subtarefas
  document.getElementById("subtask-modal").addEventListener("click", e => {
    if (e.target === e.currentTarget) closeSubtaskModal();
  });
  document.getElementById("btn-add-subtask").addEventListener("click", () => {
    const list = document.getElementById("subtask-edit-list");
    appendSubEditRow(list, "", list.children.length);
    saveSubtaskModal();
  });

  // Editar hoje
  document.getElementById("btn-reset-today").addEventListener("click", () => {
    if (confirm("Resetar para a rotina base de hoje?")) {
      clearTodayOvr();
      renderEditToday();
      renderHome();
    }
  });
  document.getElementById("btn-add-today").addEventListener("click", () => {
    addEditRow("edit-today-list","today");
  });

  // Configurações
  document.getElementById("btn-save-settings").addEventListener("click", () => {
    autoSave("settings");
    const btn = document.getElementById("btn-save-settings");
    const orig = btn.textContent;
    btn.textContent = "✓ salvo";
    btn.style.background = "#00e5a0";
    btn.style.borderColor = "#00e5a0";
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = "";
      btn.style.borderColor = "";
    }, 1400);
    scheduleTaskNotifs();
  });

  document.getElementById("btn-add-settings").addEventListener("click", () => {
    addEditRow("settings-list","settings");
  });

  document.getElementById("day-tabs").addEventListener("click", e => {
    const tab = e.target.closest(".day-tab");
    if (!tab) return;
    autoSave("settings");
    configTab = parseInt(tab.dataset.d);
    refreshDayTabs();
    renderSettingsTab();
  });
});
