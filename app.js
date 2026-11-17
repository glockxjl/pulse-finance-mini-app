// Категории с цветовой палитрой и стартовыми месячными ориентирами (лимитами)
const CATEGORIES = {
  expense: [
    { name: "Продукты", icon: "🛒", color: "#10b981", defaultLimit: 220 },
    { name: "Кафе и доставка", icon: "☕", color: "#f59e0b", defaultLimit: 60 },
    { name: "Жильё", icon: "🏠", color: "#3b82f6", defaultLimit: 350 },
    { name: "Транспорт", icon: "🚌", color: "#6366f1", defaultLimit: 35 },
    { name: "Подписки", icon: "📱", color: "#8b5cf6", defaultLimit: 30 },
    { name: "Здоровье", icon: "💊", color: "#ec4899", defaultLimit: 50 },
    { name: "Развлечения", icon: "🎮", color: "#f43f5e", defaultLimit: 50 },
    { name: "Покупки", icon: "🛍️", color: "#14b8a6", defaultLimit: 80 },
    { name: "Образование", icon: "📚", color: "#0ea5e9", defaultLimit: 40 },
    { name: "Совместные расходы", icon: "🤝", color: "#eab308", defaultLimit: 100 },
    { name: "Прочее", icon: "📦", color: "#64748b", defaultLimit: 50 }
  ],
  income: [
    { name: "Зарплата", icon: "💶", color: "#10b981" },
    { name: "Подработка", icon: "⚡", color: "#34d399" },
    { name: "Дополнительный доход", icon: "📈", color: "#059669" },
    { name: "Подарки", icon: "🎁", color: "#a7f3d0" },
    { name: "Возврат средств", icon: "↩️", color: "#6ee7b7" },
    { name: "Прочее", icon: "✨", color: "#10b981" }
  ]
};

const LT_MERCHANT_RULES = [
  { keywords: ["lidl", "maxima", "iki", "rimi", "norfa", "silas", "šilas", "aibe", "aibė", "express market", "vynoteka", "barbora", "assorti"], type: "expense", category: "Продукты" },
  { keywords: ["wolt", "bolt food", "caffeine", "hesburger", "mcdonald", "kfc", "subway", "dodo", "grill london", "cancan", "cili", "чили", "talutti", "vero cafe", "huracan", "starbucks", "caif", "paul", "crustum"], type: "expense", category: "Кафе и доставка" },
  { keywords: ["bolt", "judu", "trafi", "trafik", "ltg link", "citybee", "spark", "uber", "autobus", "parkavim", "unipark", "stova", "viada", "circle k", "neste", "emsi", "baltic petroleum", "orlen"], type: "expense", category: "Транспорт" },
  { keywords: ["ignitis", "vilniaus vandenys", "telia", "bite", "bitė", "tele2", "cgates", "vieningoji saskaita", "energija", "nuoma", "komunal", "busto"], type: "expense", category: "Жильё" },
  { keywords: ["eurovaistine", "eurovaistinė", "camelia", "benu", "gintarine", "gintarinė", "apotheka", "kardiolita", "anteja", "antėja", "klinika", "odontolog", "vaistine"], type: "expense", category: "Здоровье" },
  { keywords: ["apple.com/bill", "spotify", "netflix", "youtube", "google", "openai", "chatgpt", "icloud", "playstation", "steam"], type: "expense", category: "Подписки" },
  { keywords: ["senukai", "ermitazas", "ermitažas", "depo", "ikea", "zara", "sinsay", "pepco", "pigu", "varle", "varlė", "kesko", "jysk", "h&m", "new yorker", "sportland", "about you", "zalando", "vinted", "topline", "topocentras"], type: "expense", category: "Покупки" },
  { keywords: ["forum cinemas", "multikino", "apollo", "bilietai", "kino", "event", "akropolis", "акрополис", "ozas", "panorama"], type: "expense", category: "Развлечения" },
  { keywords: ["darbo uzmokestis", "atlyginimas", "alga", "algos", "salary", "swedbank", "uab "], type: "income", category: "Зарплата" }
];

const STORAGE_KEY_TX = "finance_mini_app_demo_tx_v2";
const STORAGE_KEY_LIVE_TX = "finance_mini_app_live_tx_v1";
const STORAGE_KEY_API = "finance_mini_app_api_url_v1";
const STORAGE_KEY_SAVINGS = "finance_mini_app_savings_goal_v1";
const STORAGE_KEY_BILLS = "finance_mini_app_bills_v1";
const STORAGE_KEY_LIMITS = "finance_mini_app_cat_limits_v1";
const STORAGE_KEY_PRIVACY = "finance_mini_app_privacy_v1";
const STORAGE_KEY_LEARNED = "finance_mini_app_learned_merchants_v1";
const DEFAULT_API_URL = "https://pulse-api.dragonfantom2007.workers.dev";
const DEFAULT_N8N_TEST_WEBHOOK = DEFAULT_API_URL;

function hasTelegramAuth() {
  return Boolean(window.Telegram?.WebApp?.initData && String(window.Telegram.WebApp.initData).trim().length > 0);
}

function getInitialDemoTransactions() {
  return [
    { id: "demo-1", date: "2026-11-01", type: "income", amount: 1150.0, category: "Зарплата", description: "Основная выплата", externalId: "SWED-INIT-1" },
    { id: "demo-2", date: "2026-11-01", type: "expense", amount: 320.0, category: "Жильё", description: "Аренда и коммунальные", externalId: "SWED-INIT-2" },
    { id: "demo-3", date: "2026-11-02", type: "expense", amount: 42.8, category: "Продукты", description: "Lidl — продукты", externalId: "SWED-INIT-3" },
    { id: "demo-4", date: "2026-11-02", type: "expense", amount: 28.0, category: "Совместные расходы", description: "Для дома (50% от €56.00)", externalId: "SWED-INIT-4" },
    { id: "demo-5", date: "2026-11-03", type: "expense", amount: 14.5, category: "Кафе и доставка", description: "Caffeine и перекус", externalId: "SWED-INIT-5" },
    { id: "demo-6", date: "2026-11-03", type: "expense", amount: 12.0, category: "Транспорт", description: "Проездной JUDU", externalId: "SWED-INIT-6" },
    { id: "demo-7", date: "2026-11-04", type: "income", amount: 85.0, category: "Подработка", description: "Дополнительная смена", externalId: "SWED-INIT-7" },
    { id: "demo-8", date: "2026-11-04", type: "expense", amount: 19.9, category: "Подписки", description: "Интернет и сервисы", externalId: "SWED-INIT-8" }
  ];
}

function getCurrentYearMonth(nowDate = new Date()) {
  const y = nowDate.getFullYear();
  const m = String(nowDate.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function getTodayIsoLocal(nowDate = new Date()) {
  const y = nowDate.getFullYear();
  const m = String(nowDate.getMonth() + 1).padStart(2, "0");
  const d = String(nowDate.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isBillPaidForMonth(bill, yearMonth = getCurrentYearMonth()) {
  return Boolean(bill && bill.paid === true && bill.paidMonth === yearMonth);
}

function normalizeBillsForMonth(bills, yearMonth = getCurrentYearMonth()) {
  if (!Array.isArray(bills)) return getDefaultMonthlyBills();
  return bills.map((b) => {
    const paidThisMonth = Boolean(b && b.paid === true && b.paidMonth === yearMonth);
    return {
      ...b,
      paid: paidThisMonth,
      paidMonth: paidThisMonth ? yearMonth : null
    };
  });
}

function getDefaultMonthlyBills() {
  return [
    { id: "bill-1", name: "Аренда жилья (моя доля)", amount: 320.0, day: "1 число", paid: false, paidMonth: null },
    { id: "bill-2", name: "Интернет и связь Telia", amount: 19.9, day: "4 число", paid: false, paidMonth: null },
    { id: "bill-3", name: "Коммунальные Ignitis", amount: 44.5, day: "15 число", paid: false, paidMonth: null },
    { id: "bill-4", name: "Apple / Spotify подписки", amount: 9.99, day: "20 число", paid: false, paidMonth: null }
  ];
}

function getDefaultPockets() {
  return [
    { name: "🛡️ Финансовый резерв", current: 650, target: 1500 },
    { name: "📱 Обновление техники", current: 240, target: 600 },
    { name: "🦷 Здоровье и стоматолог", current: 150, target: 300 }
  ];
}

function getSampleSwedbankCsv() {
  return [
    `"Sąskaitos Nr.";"Tipas";"Data";"Gavėjas";"Paaiškinimai";"Suma";"Valiuta";"D/K";"Dokumento Nr.";"Kodas"`,
    `"LT127300010123456789";"10";"2026-11-01";"";"Likutis pradžiai";"420.00";"EUR";"K";"";""`,
    `"LT127300010123456789";"20";"2026-11-02";"MAXIMA LT, UAB";"PIRKIMAS KORTELE 5167****1234 VILNIUS";"24.60";"EUR";"D";"RO2611020001";"P"`,
    `"LT127300010123456789";"20";"2026-11-02";"CAFFEINE LT";"PIRKIMAS KORTELE 5167****1234";"6.80";"EUR";"D";"RO2611020002";"P"`,
    `"LT127300010123456789";"20";"2026-11-03";"BOLT.EU/O/261103";"PIRKIMAS KORTELE";"8.40";"EUR";"D";"RO2611030003";"P"`,
    `"LT127300010123456789";"20";"2026-11-03";"EUROVAISTINE UAB";"PIRKIMAS KORTELE VILNIUS";"15.20";"EUR";"D";"RO2611030004";"P"`,
    `"LT127300010123456789";"20";"2026-11-04";"LIDL LIETUVA";"PIRKIMAS KORTELE VILNIUS";"31.90";"EUR";"D";"RO2611040005";"P"`,
    `"LT127300010123456789";"20";"2026-11-04";"APPLE.COM/BILL";"ITUNES.COM IRL";"9.99";"EUR";"D";"RO2611040006";"P"`,
    `"LT127300010123456789";"20";"2026-11-04";"IGNITIS UAB";"Už elektrą ir dujas";"44.50";"EUR";"D";"RO2611040007";"P"`,
    `"LT127300010123456789";"20";"2026-11-04";"Vardenis Pavardenis";"Возврат за общий ужин";"15.00";"EUR";"K";"RO2611040008";"P"`,
    `"LT127300010123456789";"82";"2026-11-04";"";"Likutis pabaigai";"293.61";"EUR";"K";"";""`
  ].join("\n");
}

const state = {
  transactions: [],
  bills: [],
  catLimits: {},
  learnedMerchants: {},
  period: "month",
  customFrom: "",
  customTo: "",
  formType: "expense",
  selectedCategory: CATEGORIES.expense[0].name,
  splitRatio: 1,
  editingTxId: null,
  historyTypeFilter: "all",
  historyCategoryFilter: "all",
  historySearchQuery: "",
  selectedTxId: null,
  focusedDonutCategory: null,
  privacyMasked: localStorage.getItem(STORAGE_KEY_PRIVACY) === "1",
  savingsGoal: Number(localStorage.getItem(STORAGE_KEY_SAVINGS) ?? 200),
  parsedBankTx: [],
  syncState: "demo",
  lastSyncAt: null,
  lastSyncError: "",
  showingCachedCopy: false,
  mutationInFlight: false,
  pendingFormExternalId: null,
  pendingSmartExternalId: null,
  pendingSmartInputKey: "",
  pendingDupExternalId: null,
  pendingRefundExternalId: null,
  apiUrl: (() => {
    const saved = localStorage.getItem(STORAGE_KEY_API);
    if (saved && (saved.includes("/webhook-test/finance-mini-app-test") || saved.includes("glockxjl.app.n8n.cloud"))) {
      localStorage.setItem(STORAGE_KEY_API, DEFAULT_API_URL);
      return hasTelegramAuth() ? DEFAULT_API_URL : "";
    }
    if (saved !== null) return saved;
    return hasTelegramAuth() ? DEFAULT_API_URL : "";
  })()
};

// Haptic Feedback Telegram
function triggerHaptic(type = "light") {
  try {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred(type);
    }
  } catch {
    // ignore outside Telegram
  }
}

const SHEET_IDS = [
  "txFormModal",
  "bankModal",
  "goalsModal",
  "billsModal",
  "sharedModal",
  "txDetailModal",
  "settingsModal"
];

function getAnyOpenSheetId() {
  return SHEET_IDS.find((id) => {
    const el = document.getElementById(id);
    return el && !el.classList.contains("hidden");
  });
}

function closeAllSheets() {
  SHEET_IDS.forEach((id) => {
    document.getElementById(id)?.classList.add("hidden");
  });
  syncTelegramBackButton();
}

function syncTelegramBackButton() {
  try {
    const tg = window.Telegram?.WebApp;
    if (!tg?.BackButton) return;
    if (getAnyOpenSheetId()) {
      tg.BackButton.show();
    } else {
      tg.BackButton.hide();
    }
  } catch {
    // ignore outside Telegram
  }
}

function initTelegramWebApp() {
  const tg = window.Telegram?.WebApp;
  if (!tg) return;
  try {
    tg.ready();
    tg.expand();
    if (typeof tg.disableVerticalSwipes === "function") {
      tg.disableVerticalSwipes();
    }
    if (typeof tg.setHeaderColor === "function") {
      tg.setHeaderColor("#f2f1ed");
    }
    if (typeof tg.setBackgroundColor === "function") {
      tg.setBackgroundColor("#f2f1ed");
    }
    if (tg.BackButton && typeof tg.BackButton.onClick === "function") {
      tg.BackButton.onClick(() => {
        const openId = getAnyOpenSheetId();
        if (openId) {
          triggerHaptic("light");
          document.getElementById(openId)?.classList.add("hidden");
          syncTelegramBackButton();
        }
      });
    }
    // Автоматический отслеживатель открытия/закрытия шторок для BackButton
    const observer = new MutationObserver(() => syncTelegramBackButton());
    SHEET_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    });
  } catch {
    // ignore
  }
}

function askNativeConfirm(message, onConfirm) {
  const tg = window.Telegram?.WebApp;
  if (tg && typeof tg.showConfirm === "function" && tg.initData) {
    tg.showConfirm(message, (ok) => {
      if (ok) onConfirm();
    });
  } else if (window.confirm(message)) {
    onConfirm();
  }
}

function syncSettingsToCloudStorage() {
  try {
    const cloud = window.Telegram?.WebApp?.CloudStorage;
    if (!cloud || typeof cloud.setItem !== "function") return;
    const payload = JSON.stringify({
      savingsGoal: state.savingsGoal,
      catLimits: state.catLimits,
      learnedMerchants: state.learnedMerchants
    });
    cloud.setItem("pulse_settings_v1", payload);
  } catch {
    // ignore
  }
}

function loadActiveModeTransactions() {
  if (state.apiUrl) {
    // В режиме LIVE (API) никогда не подставляем демо-операции как реальные данные
    if (!hasTelegramAuth()) {
      state.transactions = [];
      state.showingCachedCopy = false;
      state.syncState = "auth_required";
      return;
    }
    const rawLiveTx = localStorage.getItem(STORAGE_KEY_LIVE_TX);
    try {
      state.transactions = rawLiveTx ? JSON.parse(rawLiveTx) : [];
    } catch {
      state.transactions = [];
    }
    state.showingCachedCopy = state.transactions.length > 0;
    state.syncState = "connecting";
    return;
  }

  state.showingCachedCopy = false;
  state.syncState = "demo";
  const rawTx = localStorage.getItem(STORAGE_KEY_TX);
  try {
    state.transactions = rawTx ? JSON.parse(rawTx) : getInitialDemoTransactions();
  } catch {
    state.transactions = getInitialDemoTransactions();
  }
}

function loadAllState() {
  loadActiveModeTransactions();

  const rawBills = localStorage.getItem(STORAGE_KEY_BILLS);
  const currentYm = getCurrentYearMonth();
  try {
    const parsedBills = rawBills ? JSON.parse(rawBills) : getDefaultMonthlyBills();
    state.bills = normalizeBillsForMonth(parsedBills, currentYm);
  } catch {
    state.bills = getDefaultMonthlyBills();
  }

  const rawLimits = localStorage.getItem(STORAGE_KEY_LIMITS);
  const defaultLimits = {};
  CATEGORIES.expense.forEach((c) => (defaultLimits[c.name] = c.defaultLimit));
  try {
    state.catLimits = rawLimits ? { ...defaultLimits, ...JSON.parse(rawLimits) } : defaultLimits;
  } catch {
    state.catLimits = defaultLimits;
  }

  const rawLearned = localStorage.getItem(STORAGE_KEY_LEARNED);
  try {
    state.learnedMerchants = rawLearned ? JSON.parse(rawLearned) : {};
  } catch {
    state.learnedMerchants = {};
  }

  document.body.classList.toggle("privacy-masked", state.privacyMasked);
}

function saveTransactions() {
  if (state.apiUrl) {
    if (hasTelegramAuth()) {
      localStorage.setItem(STORAGE_KEY_LIVE_TX, JSON.stringify(state.transactions));
    }
    return;
  }
  localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(state.transactions));
}

function saveBills() {
  localStorage.setItem(STORAGE_KEY_BILLS, JSON.stringify(state.bills));
}

function saveCatLimits() {
  localStorage.setItem(STORAGE_KEY_LIMITS, JSON.stringify(state.catLimits));
  syncSettingsToCloudStorage();
}

function saveLearnedMerchants() {
  localStorage.setItem(STORAGE_KEY_LEARNED, JSON.stringify(state.learnedMerchants));
  syncSettingsToCloudStorage();
}

function learnMerchantCategory(description, category) {
  if (!description || !category) return;
  const cleaned = String(description)
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .replace(/[0-9€$.,+%—\-]/g, " ")
    .trim();
  const firstWord = cleaned.split(/\s+/).filter((w) => w.length >= 3)[0];
  if (!firstWord || firstWord === "общий" || firstWord === "чек" || firstWord === "swedbank") return;
  state.learnedMerchants[firstWord] = category;
  saveLearnedMerchants();
}

// Всплывающее уведомление Toast
let appToastTimer = null;
function showToast(message) {
  const el = document.getElementById("appToast");
  if (!el || !message) return;
  el.textContent = message;
  el.classList.add("visible");
  clearTimeout(appToastTimer);
  appToastTimer = setTimeout(() => {
    el.classList.remove("visible");
  }, 2600);
}

// Нормализация массива транзакций из любого формата ответа API
function normalizeApiTransactions(data) {
  if (!data) return [];
  let rawList = [];
  if (Array.isArray(data)) {
    if (data.length === 1 && Array.isArray(data[0]?.transactions)) {
      rawList = data[0].transactions;
    } else if (data.length === 1 && Array.isArray(data[0]?.data)) {
      rawList = data[0].data;
    } else {
      rawList = data;
    }
  } else if (Array.isArray(data.transactions)) {
    rawList = data.transactions;
  } else if (Array.isArray(data.rows)) {
    rawList = data.rows;
  } else if (Array.isArray(data.data)) {
    rawList = data.data;
  }

  return rawList
    .filter((r) => r && (r.amount !== undefined || r.description !== undefined))
    .map((r, idx) => {
      const amt = Math.abs(Number(String(r.amount ?? 0).replace(",", ".")) || 0);
      const txType = String(r.type || "expense").toLowerCase() === "income" ? "income" : "expense";
      const rawCat = String(r.category || "").trim();
      const cat = rawCat === "Разное" || rawCat === "Другое" ? "Прочее" : (rawCat || "Прочее");
      const dateStr = String(r.date || r.createdAt || getTodayIsoLocal()).slice(0, 10);
      const extId = String(r.externalId || r.id || `api-${dateStr}-${idx}`);
      return {
        id: String(r.id || extId),
        externalId: extId,
        date: dateStr,
        type: txType,
        amount: Math.round(amt * 100) / 100,
        category: cat,
        description: String(r.description || cat)
      };
    });
}

function formatSyncTime(dateObj = new Date()) {
  const hh = String(dateObj.getHours()).padStart(2, "0");
  const mm = String(dateObj.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function markSyncConnecting() {
  if (!state.apiUrl) {
    state.syncState = "demo";
  } else if (!hasTelegramAuth()) {
    state.syncState = "auth_required";
  } else {
    state.syncState = "connecting";
  }
  updateModeBadge();
}

function markSyncSuccess() {
  state.syncState = "synced";
  state.lastSyncAt = formatSyncTime(new Date());
  state.lastSyncError = "";
  state.showingCachedCopy = false;
  updateModeBadge();
}

function markSyncFailure(errorMsg = "") {
  if (!state.apiUrl) {
    state.syncState = "demo";
    state.showingCachedCopy = false;
  } else if (!hasTelegramAuth()) {
    state.syncState = "auth_required";
    state.showingCachedCopy = false;
  } else {
    state.syncState = "offline_cache";
    state.showingCachedCopy = state.transactions.length > 0;
  }
  state.lastSyncError = String(errorMsg || "");
  updateModeBadge();
}

// Клиент для связи с облачным API Cloudflare Worker + D1 (отправляет только подписанный X-Telegram-Init-Data)
async function apiCallN8n(action, payload = {}, options = {}) {
  if (!state.apiUrl) {
    return options.returnError ? { ok: false, error: "Включён режим DEMO" } : null;
  }
  if (!hasTelegramAuth()) {
    markSyncFailure("Нужен вход через Telegram");
    return options.returnError ? { ok: false, error: "Нужен вход через Telegram" } : null;
  }
  try {
    const initData = window.Telegram?.WebApp?.initData || "";
    const wrappedPayload = (action === "create" || action === "update") && !payload.transaction
      ? { transaction: payload, ...payload }
      : payload;
    const response = await fetch(state.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Telegram-Init-Data": initData
      },
      body: JSON.stringify({
        action,
        initData,
        payload: wrappedPayload
      })
    });
    let jsonBody = null;
    try {
      jsonBody = await response.json();
    } catch {
      jsonBody = null;
    }
    if (!response.ok || !jsonBody || jsonBody.ok === false) {
      const errText = jsonBody?.error || `Ошибка сервера (HTTP ${response.status})`;
      if (options.returnError) {
        return { ok: false, status: response.status, error: errText };
      }
      return null;
    }
    return jsonBody;
  } catch (err) {
    return options.returnError ? { ok: false, error: err?.message || "Нет связи с сервером" } : null;
  }
}

async function syncTransactionsFromServer() {
  if (!state.apiUrl) {
    state.syncState = "demo";
    updateModeBadge();
    return { ok: true, mode: "demo" };
  }
  if (!hasTelegramAuth()) {
    state.transactions = [];
    markSyncFailure("Нужен вход через Telegram");
    renderAll();
    return { ok: false, error: "Нужен вход через Telegram" };
  }
  markSyncConnecting();
  const res = await apiCallN8n("list", {}, { returnError: true });
  if (res && res.ok) {
    state.transactions = normalizeApiTransactions(res);
    saveTransactions();
    markSyncSuccess();
    renderAll();
    return { ok: true, count: state.transactions.length };
  }
  markSyncFailure(res?.error || "Нет связи с сервером");
  renderAll();
  return { ok: false, error: res?.error || "Нет связи с сервером" };
}

function generateAttemptExternalId(prefix = "APP") {
  const rand = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now()}-${rand}`;
}

async function executeServerCreate(txData) {
  if (!state.apiUrl) {
    const demoTx = {
      ...txData,
      id: txData.id || `demo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      externalId: txData.externalId || generateAttemptExternalId("DEMO")
    };
    state.transactions.unshift(demoTx);
    saveTransactions();
    renderAll();
    return { ok: true, mode: "demo", item: demoTx };
  }

  if (!hasTelegramAuth()) {
    markSyncFailure("Нужен вход через Telegram");
    return { ok: false, error: "В режиме LIVE нужен вход через Telegram (или переключи на DEMO)" };
  }

  const res = await apiCallN8n("create", txData, { returnError: true });
  if (!res || !res.ok) {
    markSyncFailure(res?.error);
    return { ok: false, error: res?.error || "Нет связи с сервером — операция не сохранена в D1" };
  }

  const listRes = await apiCallN8n("list", {}, { returnError: true });
  if (listRes && listRes.ok) {
    state.transactions = normalizeApiTransactions(listRes);
  } else if (res.item) {
    const norm = normalizeApiTransactions([res.item])[0];
    if (norm) {
      state.transactions = [
        norm,
        ...state.transactions.filter((t) => t.externalId !== norm.externalId && String(t.id) !== String(norm.id))
      ];
    }
  }
  saveTransactions();
  markSyncSuccess();
  renderAll();
  return { ok: true, mode: "live", item: res.item, deduplicated: Boolean(res.deduplicated) };
}

async function executeServerUpdate(txData) {
  if (!state.apiUrl) {
    const idx = state.transactions.findIndex((t) => String(t.id) === String(txData.id));
    if (idx < 0) return { ok: false, error: "Операция не найдена" };
    state.transactions[idx] = { ...state.transactions[idx], ...txData };
    saveTransactions();
    renderAll();
    return { ok: true, mode: "demo", item: state.transactions[idx] };
  }

  if (!hasTelegramAuth()) {
    markSyncFailure("Нужен вход через Telegram");
    return { ok: false, error: "В режиме LIVE нужен вход через Telegram (или переключи на DEMO)" };
  }

  const res = await apiCallN8n("update", txData, { returnError: true });
  if (!res || !res.ok) {
    markSyncFailure(res?.error);
    return { ok: false, error: res?.error || "Не удалось сохранить изменения в D1" };
  }

  const listRes = await apiCallN8n("list", {}, { returnError: true });
  if (listRes && listRes.ok) {
    state.transactions = normalizeApiTransactions(listRes);
  } else if (res.item) {
    const norm = normalizeApiTransactions([res.item])[0];
    if (norm) {
      state.transactions = state.transactions.map((t) =>
        String(t.id) === String(norm.id) || (norm.externalId && t.externalId === norm.externalId) ? norm : t
      );
    }
  }
  saveTransactions();
  markSyncSuccess();
  renderAll();
  return { ok: true, mode: "live", item: res.item };
}

async function executeServerDelete(targetId) {
  const tx = state.transactions.find(
    (t) => String(t.id) === String(targetId) || (t.externalId && t.externalId === String(targetId))
  );
  if (!tx) {
    return { ok: false, error: "Операция уже отсутствует в списке" };
  }

  if (!state.apiUrl) {
    state.transactions = state.transactions.filter((t) => t !== tx);
    saveTransactions();
    renderAll();
    return { ok: true, mode: "demo" };
  }

  if (!hasTelegramAuth()) {
    markSyncFailure("Нужен вход через Telegram");
    return { ok: false, error: "В режиме LIVE нужен вход через Telegram" };
  }

  const res = await apiCallN8n("delete", { id: tx.id, externalId: tx.externalId }, { returnError: true });
  if (!res || !res.ok) {
    markSyncFailure(res?.error);
    return { ok: false, error: res?.error || "Сервер не подтвердил удаление операции" };
  }

  const listRes = await apiCallN8n("list", {}, { returnError: true });
  if (listRes && listRes.ok) {
    state.transactions = normalizeApiTransactions(listRes);
  } else {
    state.transactions = state.transactions.filter((t) => t !== tx);
  }
  saveTransactions();
  markSyncSuccess();
  renderAll();
  return { ok: true, mode: "live" };
}

function formatEUR(value) {
  const num = Number(value) || 0;
  return "€" + num.toFixed(2);
}

function getCategoryMeta(type, categoryName) {
  const list = CATEGORIES[type] || [];
  const norm = String(categoryName || "").trim().toLowerCase();
  if (norm === "разное" || norm === "другое") {
    return { name: "Прочее", icon: "📦", color: "#64748b", defaultLimit: 50 };
  }
  const found = list.find((c) => c.name.toLowerCase() === norm);
  return found || { icon: type === "income" ? "💶" : "📦", color: "#64748b", defaultLimit: 50 };
}

function autoDetectLtCategory(merchant, details, isCredit) {
  const combined = `${merchant || ""} ${details || ""}`.toLowerCase();
  if (isCredit) {
    if (combined.includes("возврат") || combined.includes("grazin") || combined.includes("refund")) return "Возврат средств";
    if (combined.includes("darbo") || combined.includes("atlyginim") || combined.includes("salary") || combined.includes("uab") || combined.includes("зарплат") || combined.includes("аванс")) return "Зарплата";
    if (combined.includes("подработ") || combined.includes("смен") || combined.includes("бонус")) return "Подработка";
    return "Дополнительный доход";
  }

  // 1. Сначала проверяем выученный персональный словарь пользователя
  for (const [learnedKey, learnedCat] of Object.entries(state.learnedMerchants || {})) {
    if (learnedKey && combined.includes(learnedKey.toLowerCase())) {
      return learnedCat;
    }
  }

  // 2. Русские быстрые ключевые слова (для умной строки ввода)
  const ruQuickRules = [
    { kw: ["лидл", "максима", "ики", "рими", "продукт", "хлеб", "молок", "мясо", "рынок"], cat: "Продукты" },
    { kw: ["кофе", "кафе", "обед", "ужин", "шаурм", "пицц", "бургер", "суши", "волт", "доставк"], cat: "Кафе и доставка" },
    { kw: ["болт", "такси", "автобус", "проезд", "бензин", "парковк"], cat: "Транспорт" },
    { kw: ["аренд", "коммунал", "кварт", "свет", "вода", "интернет"], cat: "Жильё" },
    { kw: ["аптек", "врач", "таблет", "зуб", "стоматол", "зал", "спорт"], cat: "Здоровье" },
    { kw: ["подписк", "спотифай", "нетфликс", "эпл", "связь"], cat: "Подписки" },
    { kw: ["кино", "бар", "игры", "тусовк", "концерт"], cat: "Развлечения" },
    { kw: ["одежд", "обувь", "икеа", "дом", "кроссовк", "куртк"], cat: "Покупки" }
  ];
  for (const rule of ruQuickRules) {
    if (rule.kw.some((k) => combined.includes(k))) return rule.cat;
  }

  // 3. Литовский словарь магазинов Swedbank
  for (const rule of LT_MERCHANT_RULES) {
    if (
      rule.type === "expense" &&
      rule.keywords.some((kw) => {
        if (kw.length <= 3) {
          return new RegExp(`(^|[^a-zа-яё0-9])${kw}([^a-zа-яё0-9]|$)`, "i").test(combined);
        }
        return combined.includes(kw);
      })
    ) {
      return rule.category;
    }
  }
  return "Прочее";
}

// Умный парсер свободной строки (по мотивам actual-budget-telegram-bot)
function parseSmartQuickInput(rawText) {
  const text = String(rawText || "").trim();
  if (!text) return null;

  // Проверяем признак дохода (+ в начале или слова доход/зарплата/аванс/возврат)
  const isExplicitIncome =
    text.startsWith("+") ||
    /(зарплат|аванс|подработк|возврат|доход|подарок)/i.test(text);

  // Проверяем сплит 50/50 или 50%
  const isSplitHalf = /(50\/50|50%|пополам|сплит)/i.test(text);

  // Ищем сумму (число с точкой или запятой, не привязанное к 50%)
  const cleanedForAmount = text.replace(/50\/50|50%/gi, " ");
  const amountMatch = cleanedForAmount.match(/[+-]?\d+(?:[.,]\d{1,2})?/);
  if (!amountMatch) return null;

  const rawNum = Math.abs(Number(amountMatch[0].replace(",", ".")));
  if (!Number.isFinite(rawNum) || rawNum <= 0) return null;

  // Убираем найденную сумму и маркеры сплита из описания
  let desc = text
    .replace(amountMatch[0], " ")
    .replace(/(50\/50|50%|пополам|сплит)/gi, " ")
    .replace(/^[+\-—•\s]+|[+\-—•\s]+$/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  const type = isExplicitIncome ? "income" : "expense";
  let category = isSplitHalf && type === "expense"
    ? "Совместные расходы"
    : autoDetectLtCategory(desc, "", type === "income");

  const finalAmount = isSplitHalf && type === "expense"
    ? Math.round(rawNum * 0.5 * 100) / 100
    : Math.round(rawNum * 100) / 100;

  if (!desc) desc = category;
  if (isSplitHalf && type === "expense" && !desc.includes("от €")) {
    desc = `${desc} (50% от €${rawNum.toFixed(2)})`;
  }

  return {
    type,
    rawAmount: rawNum,
    amount: finalAmount,
    isSplitHalf,
    category,
    description: desc,
    date: new Date().toISOString().slice(0, 10)
  };
}

const MONTH_NAMES_NOM = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

function getMonthTitleRu(nowDate = new Date()) {
  return `${MONTH_NAMES_NOM[nowDate.getMonth()]} ${nowDate.getFullYear()}`;
}

function filterByPeriod(transactions, period = state.period, customFrom = state.customFrom, customTo = state.customTo, nowDate = new Date()) {
  const todayStr = getTodayIsoLocal(nowDate);
  const currentYm = getCurrentYearMonth(nowDate);

  return transactions.filter((tx) => {
    const txDateStr = String(tx.date).slice(0, 10);
    if (period === "all") return true;
    if (period === "month") return txDateStr.slice(0, 7) === currentYm;
    if (period === "week") {
      const txTime = new Date(txDateStr + "T00:00:00").getTime();
      const nowTime = new Date(todayStr + "T00:00:00").getTime();
      const diffDays = (nowTime - txTime) / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 7;
    }
    if (period === "custom") {
      if (customFrom && txDateStr < customFrom) return false;
      if (customTo && txDateStr > customTo) return false;
      return true;
    }
    return true;
  });
}

function computeFinancialMetrics(
  allTransactions,
  bills,
  savingsGoal,
  period = state.period,
  customFrom = state.customFrom,
  customTo = state.customTo,
  nowDate = new Date()
) {
  const currentYm = getCurrentYearMonth(nowDate);
  const daysInMonth = new Date(nowDate.getFullYear(), nowDate.getMonth() + 1, 0).getDate();
  const remainingDays = Math.max(1, daysInMonth - nowDate.getDate() + 1);

  let allIncome = 0;
  let allExpense = 0;
  let monthIncome = 0;
  let monthExpense = 0;
  let allSharedExpense = 0;
  let allPartnerRefunds = 0;

  for (const tx of allTransactions) {
    const amt = Number(tx.amount) || 0;
    const isInc = tx.type === "income";
    if (isInc) {
      allIncome += amt;
      if (tx.category === "Возврат средств") allPartnerRefunds += amt;
    } else {
      allExpense += amt;
      if (tx.category === "Совместные расходы") allSharedExpense += amt;
    }
    if (String(tx.date).slice(0, 7) === currentYm) {
      if (isInc) monthIncome += amt;
      else monthExpense += amt;
    }
  }

  const periodTx = sortByDateDesc(filterByPeriod(allTransactions, period, customFrom, customTo, nowDate));
  let periodIncome = 0;
  let periodExpense = 0;
  for (const tx of periodTx) {
    const amt = Number(tx.amount) || 0;
    if (tx.type === "income") periodIncome += amt;
    else periodExpense += amt;
  }

  const unpaidBillsTotal = Math.round(
    (bills || [])
      .filter((b) => !isBillPaidForMonth(b, currentYm))
      .reduce((acc, b) => acc + Number(b.amount || 0), 0) * 100
  ) / 100;
  const paidBillsCount = (bills || []).filter((b) => isBillPaidForMonth(b, currentYm)).length;

  const allNet = Math.round((allIncome - allExpense) * 100) / 100;
  const periodNet = Math.round((periodIncome - periodExpense) * 100) / 100;
  const monthNet = Math.round((monthIncome - monthExpense) * 100) / 100;
  const goal = Math.max(0, Number(savingsGoal || 0));

  // Формула дневного лимита строго привязана к текущему календарному месяцу (не зависит от фильтра истории!)
  const freeAfterSavingsAndBills = Math.round((monthNet - goal - unpaidBillsTotal) * 100) / 100;
  const dailySafe = freeAfterSavingsAndBills > 0
    ? Math.round((freeAfterSavingsAndBills / remainingDays) * 100) / 100
    : 0;

  const partnerOwes = Math.max(0, Math.round((allSharedExpense - allPartnerRefunds) * 100) / 100);

  return {
    currentYm,
    monthTitle: getMonthTitleRu(nowDate),
    daysInMonth,
    remainingDays,
    periodTx,
    periodIncome: Math.round(periodIncome * 100) / 100,
    periodExpense: Math.round(periodExpense * 100) / 100,
    periodNet,
    allIncome: Math.round(allIncome * 100) / 100,
    allExpense: Math.round(allExpense * 100) / 100,
    allNet,
    allCount: allTransactions.length,
    monthIncome: Math.round(monthIncome * 100) / 100,
    monthExpense: Math.round(monthExpense * 100) / 100,
    monthNet,
    goal,
    unpaidBillsTotal,
    paidBillsCount,
    freeAfterSavingsAndBills,
    dailySafe,
    sharedExpense: Math.round(allSharedExpense * 100) / 100,
    partnerRefunds: Math.round(allPartnerRefunds * 100) / 100,
    partnerOwes
  };
}

function sortByDateDesc(list) {
  return [...list].sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

function renderAll() {
  const metrics = computeFinancialMetrics(state.transactions, state.bills, state.savingsGoal, state.period, state.customFrom, state.customTo);
  renderHeaderPeriodLabel(metrics);
  renderHome(metrics);
  renderHistory(metrics.periodTx);
  renderAnalytics(metrics.periodTx);
}

function renderHeaderPeriodLabel(metrics) {
  const labelEl = document.getElementById("currentPeriodLabel");
  if (!labelEl) return;
  const monthTitle = metrics?.monthTitle || getMonthTitleRu();
  let customText = "Произвольный период • EUR";
  if (state.customFrom || state.customTo) {
    customText = `${state.customFrom || "…"} → ${state.customTo || "…"} • EUR`;
  }
  const labels = {
    week: "Последние 7 дней • EUR",
    month: `${monthTitle} • EUR`,
    all: "Все учтённые операции • EUR",
    custom: customText
  };
  labelEl.textContent = labels[state.period] || `${monthTitle} • EUR`;
}

function renderHome(metrics) {
  const {
    monthTitle,
    remainingDays,
    periodTx,
    periodIncome,
    periodExpense,
    periodNet,
    allIncome,
    allExpense,
    allNet,
    allCount,
    monthIncome,
    monthExpense,
    goal,
    unpaidBillsTotal,
    paidBillsCount,
    freeAfterSavingsAndBills,
    dailySafe,
    sharedExpense,
    partnerOwes
  } = metrics;

  // Оценка финансового пульса по текущему месяцу (Health Score 0..100)
  const savingsRate = monthIncome > 0 ? ((monthIncome - monthExpense) / monthIncome) * 100 : 50;
  const pulseScore = Math.min(99, Math.max(40, Math.round(50 + savingsRate * 0.7)));
  document.getElementById("healthScoreBadge").textContent = `${pulseScore} PULSE`;

  // Главная цифра: Оценка дневного лимита строго по текущему календарному месяцу
  document.getElementById("dailySafeHero").textContent = formatEUR(dailySafe);
  const formulaBreakdown = `доход мес. €${monthIncome.toFixed(0)} − расход €${monthExpense.toFixed(0)} − копилка €${goal.toFixed(0)} − счета €${unpaidBillsTotal.toFixed(0)}`;
  if (monthIncome === 0 && monthExpense === 0) {
    document.getElementById("dailySafeSubtext").textContent =
      `Оценка (${monthTitle}): за текущий месяц пока нет записей (${formulaBreakdown})`;
  } else if (freeAfterSavingsAndBills > 0) {
    document.getElementById("dailySafeSubtext").textContent =
      `Оценка (${monthTitle}): €${freeAfterSavingsAndBills.toFixed(0)} ÷ ${remainingDays} дн. (${formulaBreakdown})`;
  } else {
    document.getElementById("dailySafeSubtext").textContent =
      `Оценка (${monthTitle}): свободный остаток €0, дефицит плана €${Math.abs(freeAfterSavingsAndBills).toFixed(0)} (${formulaBreakdown})`;
  }

  // Разделение итога за выбранный период и общего итога по всем учтённым операциям
  const periodLabels = {
    week: { bal: "Итог за 7 дн. (Д−Р)", inc: "Доходы (7 дн.)", exp: "Расходы (7 дн.)" },
    month: { bal: "Итог месяца (Д−Р)", inc: "Доходы (мес.)", exp: "Расходы (мес.)" },
    all: { bal: "Итог всех записей", inc: "Доходы (все)", exp: "Расходы (все)" },
    custom: { bal: "Итог периода (Д−Р)", inc: "Доходы (пер.)", exp: "Расходы (пер.)" }
  };
  const pLbl = periodLabels[state.period] || periodLabels.month;
  const balLblEl = document.getElementById("summaryBalanceLabel");
  const incLblEl = document.getElementById("summaryIncomeLabel");
  const expLblEl = document.getElementById("summaryExpenseLabel");
  if (balLblEl) balLblEl.textContent = pLbl.bal;
  if (incLblEl) incLblEl.textContent = pLbl.inc;
  if (expLblEl) expLblEl.textContent = pLbl.exp;

  document.getElementById("summaryBalance").textContent = (periodNet >= 0 ? "" : "−") + formatEUR(Math.abs(periodNet));
  document.getElementById("summaryIncome").textContent = "+" + formatEUR(periodIncome);
  document.getElementById("summaryExpense").textContent = "−" + formatEUR(periodExpense);
  document.getElementById("summaryCount").textContent = String(periodTx.length);

  const allTimeNoteEl = document.getElementById("allTimeSummaryNote");
  if (allTimeNoteEl) {
    const allSign = allNet >= 0 ? "+" : "−";
    allTimeNoteEl.textContent =
      `Всего по всем учтённым операциям (${allCount}): ${allSign}${formatEUR(Math.abs(allNet))} (доходы +${formatEUR(allIncome)}, расходы −${formatEUR(allExpense)}) • оценка по записям, не баланс банка`;
  }

  // Плитка Сплит 50/50
  document.getElementById("summaryShared").textContent = formatEUR(sharedExpense);
  document.getElementById("sharedWhoOwesText").textContent =
    partnerOwes > 0 ? `К возврату тебе: €${partnerOwes.toFixed(2)}` : `Расчёты закрыты ✓`;

  // Виджет обязательных счетов текущего месяца
  document.getElementById("billsStatusSub").textContent =
    unpaidBillsTotal > 0
      ? `В ${monthTitle}: оплачено ${paidBillsCount} из ${state.bills.length} • В резерве: €${unpaidBillsTotal.toFixed(2)}`
      : `Все обязательные счета на ${monthTitle} (${state.bills.length}) оплачены ✓`;

  // Кольцо копилки (оценка по текущему месяцу)
  document.getElementById("savingsGoalValue").textContent = "€" + Math.round(goal);
  document.getElementById("freeAfterSavingsValue").textContent =
    `Оценка своб.: €${Math.max(0, Math.round(freeAfterSavingsAndBills))}`;

  const circumference = 175.9;
  const ratio = goal > 0 ? Math.min(1, Math.max(0, (monthIncome - monthExpense) / goal)) : 1;
  const offset = circumference - ratio * circumference;
  document.getElementById("savingsRingCircle").style.strokeDashoffset = String(offset.toFixed(1));

  // Умная строка инсайта
  renderSmartInsight(periodTx, periodIncome, periodExpense, dailySafe);

  // Лента последних операций по дням
  const recentContainer = document.getElementById("recentTxList");
  const recent = periodTx.slice(0, 7);
  if (recent.length === 0) {
    if (state.apiUrl && !hasTelegramAuth()) {
      recentContainer.innerHTML = `<div class="empty-state">Нужен вход через Telegram: реальные данные доступны при открытии внутри бота. Для автономной работы переключи на DEMO.</div>`;
    } else {
      recentContainer.innerHTML = `<div class="empty-state">За выбранный период нет операций</div>`;
    }
    return;
  }
  recentContainer.innerHTML = renderGroupedByDayHTML(recent);
  bindTxItemClicks(recentContainer);
}

function renderSmartInsight(periodTx, totalIncome, totalExpense, dailySafe) {
  const el = document.getElementById("smartInsightText");
  if (periodTx.length === 0) {
    el.textContent = "Добавь операцию или выбери другой фильтр периода.";
    return;
  }

  const cafeSpent = periodTx
    .filter((t) => t.type === "expense" && t.category === "Кафе и доставка")
    .reduce((a, b) => a + Number(b.amount), 0);

  if (totalIncome > 0 && totalExpense < totalIncome * 0.45) {
    el.textContent = `За период сохранено ${Math.round(((totalIncome - totalExpense) / totalIncome) * 100)}% учтённого дохода. Оценка на сегодня — €${dailySafe.toFixed(0)}.`;
  } else if (cafeSpent > 45) {
    el.textContent = `За выбранный период на кафе и доставку учтено €${cafeSpent.toFixed(2)}.`;
  } else {
    el.textContent = `За период учтено ${periodTx.length} опер. Оценка дневного лимита на этот месяц — €${dailySafe.toFixed(0)}/день.`;
  }
}

function renderGroupedByDayHTML(txList) {
  const groups = new Map();
  for (const tx of txList) {
    const d = String(tx.date).slice(0, 10);
    if (!groups.has(d)) groups.set(d, []);
    groups.get(d).push(tx);
  }

  const htmlParts = [];
  for (const [dateStr, items] of groups.entries()) {
    let daySum = 0;
    for (const i of items) {
      daySum += i.type === "income" ? Number(i.amount) : -Number(i.amount);
    }
    const daySumFormatted = (daySum >= 0 ? "+" : "−") + formatEUR(Math.abs(daySum));

    htmlParts.push(`
      <div class="day-group">
        <div class="day-block-head">
          <span>${formatHumanDayLabel(dateStr)}</span>
          <span class="sensitive-num">${daySumFormatted}</span>
        </div>
        ${items.map(renderTxRowHTML).join("")}
      </div>
    `);
  }
  return htmlParts.join("");
}

function renderTxRowHTML(tx) {
  const isIncome = tx.type === "income";
  const sign = isIncome ? "+" : "−";
  const meta = getCategoryMeta(tx.type, tx.category);

  return `
    <div class="tx-row" data-tx-id="${escapeHtml(tx.id)}">
      <div class="tx-left">
        <div class="tx-badge">${meta.icon}</div>
        <div class="tx-main">
          <div class="tx-title">${escapeHtml(tx.description || tx.category)}</div>
          <div class="tx-sub">${escapeHtml(tx.category)}</div>
        </div>
      </div>
      <div class="tx-right-group">
        <div class="tx-val ${tx.type} sensitive-num">${sign}${formatEUR(tx.amount)}</div>
        <button type="button" class="tx-quick-del" data-quick-del-id="${escapeHtml(tx.id)}" title="Удалить запись" aria-label="Удалить запись">×</button>
      </div>
    </div>
  `;
}

function bindTxItemClicks(container) {
  container.querySelectorAll(".tx-quick-del").forEach((delBtn) => {
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (state.mutationInFlight) return;
      const targetId = delBtn.getAttribute("data-quick-del-id");
      if (!targetId) return;
      triggerHaptic("light");
      askNativeConfirm("Удалить эту операцию?", async () => {
        if (state.mutationInFlight) return;
        state.mutationInFlight = true;
        delBtn.disabled = true;
        try {
          const res = await executeServerDelete(targetId);
          if (!res.ok) {
            showToast(`Ошибка удаления: ${res.error}`);
            return;
          }
          showToast("Операция удалена");
        } finally {
          state.mutationInFlight = false;
          delBtn.disabled = false;
        }
      });
    });
  });

  container.querySelectorAll(".tx-row").forEach((el) => {
    el.addEventListener("click", () => {
      triggerHaptic("light");
      openTxDetailModal(el.getAttribute("data-tx-id"));
    });
  });
}

function renderHistory(periodTx) {
  populateHistoryCategorySelect();
  const q = state.historySearchQuery.trim().toLowerCase();

  const filtered = periodTx.filter((tx) => {
    if (state.historyTypeFilter !== "all" && tx.type !== state.historyTypeFilter) return false;
    if (state.historyCategoryFilter !== "all" && tx.category !== state.historyCategoryFilter) return false;
    if (q) {
      const hay = `${tx.category} ${tx.description} ${tx.amount}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  document.getElementById("historyCountBadge").textContent = String(filtered.length);
  const listEl = document.getElementById("historyTxList");

  if (filtered.length === 0) {
    if (state.apiUrl && !hasTelegramAuth()) {
      listEl.innerHTML = `<div class="empty-state">Режим LIVE: реальные данные доступны только при входе через Telegram. Для автономной работы переключи на DEMO.</div>`;
    } else {
      listEl.innerHTML = `<div class="empty-state">Ничего не найдено</div>`;
    }
    return;
  }

  listEl.innerHTML = renderGroupedByDayHTML(filtered);
  bindTxItemClicks(listEl);
}

function populateHistoryCategorySelect() {
  const select = document.getElementById("filterCategory");
  const currentVal = state.historyCategoryFilter;
  const allCats = new Set();
  CATEGORIES.expense.forEach((c) => allCats.add(c.name));
  CATEGORIES.income.forEach((c) => allCats.add(c.name));
  state.transactions.forEach((tx) => allCats.add(tx.category));

  select.innerHTML =
    `<option value="all">Все категории</option>` +
    [...allCats].map((cat) => `<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`).join("");
  select.value = allCats.has(currentVal) ? currentVal : "all";
}

function renderAnalytics(periodTx) {
  let totalExpense = 0;
  const catTotals = new Map();
  const weekdayTotals = [0, 0, 0, 0, 0, 0, 0];

  for (const tx of periodTx) {
    const amt = Number(tx.amount) || 0;
    if (tx.type === "expense") {
      totalExpense += amt;
      catTotals.set(tx.category, (catTotals.get(tx.category) || 0) + amt);

      const d = new Date(String(tx.date).slice(0, 10) + "T12:00:00");
      if (!isNaN(d.getTime())) {
        const dayIndex = (d.getDay() + 6) % 7;
        weekdayTotals[dayIndex] += amt;
      }
    }
  }

  const sortedCats = [...catTotals.entries()].sort((a, b) => b[1] - a[1]);

  // Фокус на выбранной категории бублика
  if (state.focusedDonutCategory && !catTotals.has(state.focusedDonutCategory)) {
    state.focusedDonutCategory = null;
  }

  const centerLabelEl = document.getElementById("donutCenterLabel");
  const centerTotalEl = document.getElementById("analyticsTotalExpenseLabel");

  if (state.focusedDonutCategory) {
    const focusedAmt = catTotals.get(state.focusedDonutCategory) || 0;
    const pct = totalExpense > 0 ? Math.round((focusedAmt / totalExpense) * 100) : 0;
    centerLabelEl.textContent = `${state.focusedDonutCategory} (${pct}%)`;
    centerTotalEl.textContent = "€" + Math.round(focusedAmt);
  } else {
    centerLabelEl.textContent = "Все траты";
    centerTotalEl.textContent = "€" + Math.round(totalExpense);
  }

  // 1. Интерактивный SVG Donut Chart
  const svgEl = document.getElementById("donutSvg");
  const legendEl = document.getElementById("donutLegend");
  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  if (totalExpense <= 0) {
    svgEl.innerHTML = `<circle cx="75" cy="75" r="${radius}" fill="none" stroke="#ecebe6" stroke-width="18" />`;
    legendEl.innerHTML = `<div class="empty-state" style="padding:8px 0;">Нет расходов</div>`;
  } else {
    let accumulatedPct = 0;
    const circles = [`<circle cx="75" cy="75" r="${radius}" fill="none" stroke="#ecebe6" stroke-width="18" />`];

    for (const [catName, amt] of sortedCats.slice(0, 6)) {
      const pct = amt / totalExpense;
      const strokeLen = pct * circumference;
      const offset = -accumulatedPct * circumference;
      const meta = getCategoryMeta("expense", catName);
      const isDimmed = state.focusedDonutCategory && state.focusedDonutCategory !== catName;

      circles.push(`
        <circle
          class="donut-segment"
          data-cat="${escapeHtml(catName)}"
          cx="75" cy="75" r="${radius}"
          fill="none"
          stroke="${meta.color}"
          stroke-width="${state.focusedDonutCategory === catName ? 22 : 18}"
          opacity="${isDimmed ? 0.35 : 1}"
          stroke-dasharray="${strokeLen.toFixed(1)} ${circumference.toFixed(1)}"
          stroke-dashoffset="${offset.toFixed(1)}"
        />
      `);
      accumulatedPct += pct;
    }
    svgEl.innerHTML = circles.join("");

    legendEl.innerHTML = sortedCats
      .slice(0, 5)
      .map(([catName, amt]) => {
        const meta = getCategoryMeta("expense", catName);
        const pct = Math.round((amt / totalExpense) * 100);
        const activeClass = state.focusedDonutCategory === catName ? "active" : "";
        return `
          <div class="legend-item ${activeClass}" data-cat="${escapeHtml(catName)}">
            <div class="legend-left">
              <span class="legend-swatch" style="background:${meta.color}"></span>
              <span class="legend-name">${escapeHtml(catName)}</span>
            </div>
            <span class="legend-pct">${pct}% • €${Math.round(amt)}</span>
          </div>
        `;
      })
      .join("");

    const toggleDonutFocus = (cat) => {
      triggerHaptic("light");
      state.focusedDonutCategory = state.focusedDonutCategory === cat ? null : cat;
      renderAnalytics(periodTx);
    };

    svgEl.querySelectorAll(".donut-segment").forEach((seg) => {
      seg.addEventListener("click", () => toggleDonutFocus(seg.getAttribute("data-cat")));
    });
    legendEl.querySelectorAll(".legend-item").forEach((item) => {
      item.addEventListener("click", () => toggleDonutFocus(item.getAttribute("data-cat")));
    });
  }

  // 2. График по дням недели (Пн–Вс)
  const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const maxDayAmt = Math.max(...weekdayTotals, 1);
  const peakIdx = weekdayTotals.indexOf(Math.max(...weekdayTotals));

  if (weekdayTotals[peakIdx] > 0) {
    document.getElementById("peakDayLabel").textContent = `Пик: ${dayNames[peakIdx]} (€${Math.round(weekdayTotals[peakIdx])})`;
  }

  document.getElementById("weekdayChart").innerHTML = weekdayTotals
    .map((amt, idx) => {
      const hPct = amt > 0 ? Math.max(10, Math.round((amt / maxDayAmt) * 100)) : 4;
      const isPeak = amt > 0 && idx === peakIdx;
      return `
        <div class="day-col" title="€${amt.toFixed(2)}">
          <div class="day-bar-wrap">
            <div class="day-bar-fill ${isPeak ? "peak" : ""}" style="height:${hPct}%"></div>
          </div>
          <span class="day-name">${dayNames[idx]}</span>
        </div>
      `;
    })
    .join("");

  // 3. Полоски категорий со светофором бюджетов (клик меняет лимит)
  const catContainer = document.getElementById("categoryChart");
  if (totalExpense <= 0) {
    catContainer.innerHTML = `<div class="empty-state">За этот период нет расходов</div>`;
    return;
  }

  catContainer.innerHTML = sortedCats
    .map(([category, amount]) => {
      const meta = getCategoryMeta("expense", category);
      const limit = Number(state.catLimits[category] || meta.defaultLimit || 100);
      const limitPct = Math.round((amount / limit) * 100);

      let badgeClass = "";
      let barColor = meta.color;
      if (limitPct >= 100) {
        badgeClass = "over";
        barColor = "var(--coral)";
      } else if (limitPct >= 80) {
        badgeClass = "warn";
        barColor = "var(--amber)";
      }

      return `
        <div class="bar-row" data-limit-cat="${escapeHtml(category)}" title="Нажми, чтобы изменить месячный лимит">
          <div class="bar-header">
            <span>${meta.icon} ${escapeHtml(category)}</span>
            <span class="limit-badge ${badgeClass}">€${amount.toFixed(0)} / лимит €${limit} (${limitPct}%)</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width:${Math.min(100, Math.max(limitPct, 4))}%; background:${barColor}"></div>
          </div>
        </div>
      `;
    })
    .join("");

  catContainer.querySelectorAll(".bar-row").forEach((row) => {
    row.addEventListener("click", () => {
      const cat = row.getAttribute("data-limit-cat");
      const currentLimit = state.catLimits[cat] || 100;
      const input = prompt(`Месячный лимит для категории «${cat}» (€):`, String(currentLimit));
      if (input === null) return;
      const val = Number(input.replace(",", "."));
      if (Number.isFinite(val) && val > 0) {
        state.catLimits[cat] = Math.round(val);
        saveCatLimits();
        renderAnalytics(periodTx);
      }
    });
  });
}

// Шторка Целей и Конвертов
function renderGoalsModal() {
  document.getElementById("monthlySavingsInput").value = state.savingsGoal;
  const pockets = getDefaultPockets();
  document.getElementById("pocketsList").innerHTML = pockets
    .map((p) => {
      const pct = Math.round((p.current / p.target) * 100);
      return `
        <div class="pocket-card">
          <div>
            <div class="bill-name">${escapeHtml(p.name)}</div>
            <div class="bill-day">Накоплено €${p.current} из €${p.target} (${pct}%)</div>
          </div>
          <div class="bill-amt">€${p.current}</div>
        </div>
      `;
    })
    .join("");
}

// Шторка Обязательных счетов
function renderBillsModal() {
  const container = document.getElementById("billsChecklist");
  const currentYm = getCurrentYearMonth();
  container.innerHTML = state.bills
    .map((b, idx) => {
      const paidThisMonth = isBillPaidForMonth(b, currentYm);
      return `
        <div class="bill-row ${paidThisMonth ? "paid" : ""}" data-bill-idx="${idx}">
          <div class="bill-left">
            <div class="bill-check">${paidThisMonth ? "✓" : ""}</div>
            <div>
              <div class="bill-name">${escapeHtml(b.name)}</div>
              <div class="bill-day">${escapeHtml(b.day)} • ${paidThisMonth ? `Оплачено (${currentYm})` : "Ожидает оплаты в этом месяце"}</div>
            </div>
          </div>
          <div class="bill-amt">€${Number(b.amount).toFixed(2)}</div>
        </div>
      `;
    })
    .join("");

  container.querySelectorAll(".bill-row").forEach((row) => {
    row.addEventListener("click", () => {
      triggerHaptic("light");
      const idx = Number(row.getAttribute("data-bill-idx"));
      if (state.bills[idx]) {
        const ym = getCurrentYearMonth();
        const currentlyPaid = isBillPaidForMonth(state.bills[idx], ym);
        state.bills[idx].paid = !currentlyPaid;
        state.bills[idx].paidMonth = !currentlyPaid ? ym : null;
        saveBills();
        renderBillsModal();
        renderAll();
      }
    });
  });
}

// Шторка Совместных расходов 50/50
function renderSharedModal() {
  const sharedTx = state.transactions.filter((t) => t.category === "Совместные расходы");
  const refundsTx = state.transactions.filter((t) => t.category === "Возврат средств");

  const totalMyShare = sharedTx.reduce((a, b) => a + Number(b.amount), 0);
  const totalRefunded = refundsTx.reduce((a, b) => a + Number(b.amount), 0);
  const owedToMe = Math.max(0, Math.round((totalMyShare - totalRefunded) * 100) / 100);

  document.getElementById("sharedSettleSummaryBox").innerHTML = `
    <div>Твоя доля в общих покупках: <strong>€${totalMyShare.toFixed(2)}</strong></div>
    <div>Получено возвратов: <strong style="color:var(--emerald)">€${totalRefunded.toFixed(2)}</strong></div>
    <div style="margin-top:6px; font-size:14px;">
      Итог сверки: <strong style="color:${owedToMe > 0 ? "var(--emerald)" : "var(--ink)"}">
        ${owedToMe > 0 ? `Партнёр должен тебе €${owedToMe.toFixed(2)}` : "Никто никому не должен ✓"}
      </strong>
    </div>
  `;

  const listEl = document.getElementById("sharedTxListModal");
  if (sharedTx.length === 0) {
    listEl.innerHTML = `<div class="empty-state">Нет совместных операций</div>`;
  } else {
    listEl.innerHTML = sharedTx.map(renderTxRowHTML).join("");
    bindTxItemClicks(listEl);
  }

  const settleBtn = document.getElementById("settleSharedRefundBtn");
  settleBtn.disabled = owedToMe <= 0 || state.mutationInFlight;
  settleBtn.style.opacity = owedToMe > 0 ? "1" : "0.5";
  if (owedToMe <= 0) {
    state.pendingRefundExternalId = null;
  } else if (!state.pendingRefundExternalId) {
    state.pendingRefundExternalId = generateAttemptExternalId("REFUND");
  }

  settleBtn.onclick = async () => {
    if (owedToMe <= 0 || state.mutationInFlight) return;
    triggerHaptic("medium");
    if (!state.pendingRefundExternalId) {
      state.pendingRefundExternalId = generateAttemptExternalId("REFUND");
    }
    state.mutationInFlight = true;
    settleBtn.disabled = true;
    try {
      const res = await executeServerCreate({
        externalId: state.pendingRefundExternalId,
        date: getTodayIsoLocal(),
        type: "income",
        amount: owedToMe,
        category: "Возврат средств",
        description: "Возврат за совместные покупки 50/50"
      });
      if (!res.ok) {
        showToast(`Ошибка записи возврата: ${res.error}`);
        return;
      }
      state.pendingRefundExternalId = null;
      renderSharedModal();
      showToast("Возврат доли записан");
    } finally {
      state.mutationInFlight = false;
      settleBtn.disabled = owedToMe <= 0;
    }
  };
}

function buildTextReport(txList, titleLabel) {
  let income = 0;
  let expense = 0;
  const catMap = new Map();

  for (const tx of txList) {
    const amt = Number(tx.amount) || 0;
    if (tx.type === "income") income += amt;
    else {
      expense += amt;
      catMap.set(tx.category, (catMap.get(tx.category) || 0) + amt);
    }
  }

  const net = income - expense;
  const afterSavings = net - state.savingsGoal;
  const sortedCats = [...catMap.entries()].sort((a, b) => b[1] - a[1]);

  const lines = [
    `📊 PULSE ОТЧЁТ (${titleLabel})`,
    `↑ Доходы: €${income.toFixed(2)}`,
    `↓ Расходы: €${expense.toFixed(2)}`,
    `💰 Итог (Д−Р): €${net.toFixed(2)}`,
    `🎯 Свободно после копилки: €${afterSavings.toFixed(2)}`,
    ``,
    `По категориям:`
  ];
  for (const [cat, amt] of sortedCats) {
    lines.push(`• ${cat}: €${amt.toFixed(2)}`);
  }
  return lines.join("\n");
}

// Разбор выписки Swedbank
function parseSwedbankCSV(csvText) {
  const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  const delimiter = lines[0].includes(";") ? ";" : ",";
  const headers = splitCsvLine(lines[0], delimiter).map((h) => h.toLowerCase());

  const idxDate = headers.findIndex((h) => h.includes("data") || h.includes("дата") || h.includes("date"));
  const idxPayee = headers.findIndex((h) => h.includes("gavėjas") || h.includes("gavejas") || h.includes("получатель") || h.includes("payee"));
  const idxDetails = headers.findIndex((h) => h.includes("paaiškinimai") || h.includes("paaiskinimai") || h.includes("пояснения") || h.includes("details"));
  const idxAmount = headers.findIndex((h) => h.includes("suma") || h.includes("сумма") || h.includes("amount"));
  const idxDK = headers.findIndex((h) => h.includes("d/k") || h.includes("д/к"));
  const idxDoc = headers.findIndex((h) => h.includes("dokumento") || h.includes("документ") || h.includes("doc"));
  const idxRowType = headers.findIndex((h) => h.includes("tipas") || h.includes("тип"));

  const parsed = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i], delimiter);
    if (cols.length < 4) continue;

    const rowType = idxRowType >= 0 ? cols[idxRowType] : "20";
    const details = idxDetails >= 0 ? cols[idxDetails] : "";
    const payee = idxPayee >= 0 ? cols[idxPayee] : "";
    const lowerDetails = details.toLowerCase();

    if (rowType === "10" || rowType === "82" || rowType === "86" || lowerDetails.includes("likutis") || lowerDetails.includes("apyvarta")) {
      continue;
    }

    const rawAmount = idxAmount >= 0 ? cols[idxAmount] : "0";
    const amount = Math.abs(Number(String(rawAmount).replace(",", ".")));
    if (!Number.isFinite(amount) || amount <= 0) continue;

    const dk = idxDK >= 0 ? cols[idxDK].toUpperCase() : "D";
    const isCredit = dk === "K" || dk === "C";
    const type = isCredit ? "income" : "expense";
    const dateStr = idxDate >= 0 && cols[idxDate] ? cols[idxDate].slice(0, 10) : getTodayIsoLocal();
    const rawDocNr = idxDoc >= 0 && cols[idxDoc] ? String(cols[idxDoc]).trim() : "";
    const extId = rawDocNr ? "SWED-" + rawDocNr : "";
    const localId = rawDocNr ? "swed-" + rawDocNr : `swed-noid-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`;

    const category = autoDetectLtCategory(payee, details, isCredit);
    const cleanDesc = [payee, details].filter(Boolean).join(" — ").replace(/PIRKIMAS KORTELE\s*\d+\*+\d+\s*/i, "").trim();

    parsed.push({
      id: localId,
      externalId: extId,
      date: dateStr,
      type,
      amount: Math.round(amount * 100) / 100,
      category,
      description: cleanDesc || "Swedbank"
    });
  }
  return parsed;
}

function splitCsvLine(line, delimiter) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else inQuotes = !inQuotes;
    } else if (ch === delimiter && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else current += ch;
  }
  result.push(current.trim());
  return result;
}

function renderParsedSwedbankPreview() {
  const box = document.getElementById("bankImportResultBox");
  if (!state.parsedBankTx.length) {
    box.classList.add("hidden");
    return;
  }
  box.classList.remove("hidden");

  let inc = 0;
  let exp = 0;
  for (const tx of state.parsedBankTx) {
    if (tx.type === "income") inc += tx.amount;
    else exp += tx.amount;
  }

  document.getElementById("bankParsedSummary").innerHTML = `
    <span>Операций: ${state.parsedBankTx.length}</span>
    <span style="color:var(--emerald)">+${formatEUR(inc)}</span>
    <span style="color:var(--coral)">−${formatEUR(exp)}</span>
  `;

  const listEl = document.getElementById("bankParsedTxList");
  listEl.innerHTML = state.parsedBankTx
    .map((tx, idx) => {
      const cats = CATEGORIES[tx.type] || [];
      const optionsHtml = cats
        .map((c) => `<option value="${escapeHtml(c.name)}" ${c.name === tx.category ? "selected" : ""}>${c.icon} ${escapeHtml(c.name)}</option>`)
        .join("");

      return `
        <div class="tx-row">
          <div class="tx-left">
            <div class="tx-main">
              <div class="tx-title">${escapeHtml(tx.description)}</div>
              <select class="parsed-cat-select" data-parsed-idx="${idx}">${optionsHtml}</select>
            </div>
          </div>
          <div class="tx-val ${tx.type}">${tx.type === "income" ? "+" : "−"}${formatEUR(tx.amount)}</div>
        </div>
      `;
    })
    .join("");

  listEl.querySelectorAll(".parsed-cat-select").forEach((sel) => {
    sel.addEventListener("change", (e) => {
      const index = Number(e.target.getAttribute("data-parsed-idx"));
      const item = state.parsedBankTx[index];
      if (item) {
        item.category = e.target.value;
        learnMerchantCategory(item.description, item.category);
      }
    });
  });
}

function renderCategoryChips() {
  const container = document.getElementById("categoryChips");
  const list = CATEGORIES[state.formType] || [];
  const isCustom = Boolean(state.selectedCategory && !list.some((c) => c.name === state.selectedCategory));

  const chipsHtml = list
    .map((c) => {
      const activeClass = !isCustom && c.name === state.selectedCategory ? "selected" : "";
      return `<button type="button" class="cat-chip ${activeClass}" data-cat="${escapeHtml(c.name)}">${c.icon} ${escapeHtml(c.name)}</button>`;
    })
    .join("");

  const customActiveClass = isCustom ? "selected" : "";
  container.innerHTML = chipsHtml + `<button type="button" class="cat-chip ${customActiveClass}" data-cat="__custom__">✨ Своя...</button>`;

  const customInput = document.getElementById("txCustomCategory");
  if (customInput) {
    customInput.classList.toggle("hidden", !isCustom);
    if (isCustom && state.selectedCategory !== "__custom__") {
      customInput.value = state.selectedCategory;
    }
    if (!customInput.dataset.bound) {
      customInput.dataset.bound = "1";
      customInput.addEventListener("input", () => {
        const val = customInput.value.trim();
        state.selectedCategory = val || "Своя категория";
        state.pendingFormExternalId = null;
      });
    }
  }

  container.querySelectorAll(".cat-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      triggerHaptic("light");
      state.pendingFormExternalId = null;
      const cat = btn.getAttribute("data-cat");
      if (cat === "__custom__") {
        if (customInput) {
          customInput.classList.remove("hidden");
          customInput.focus();
          const currentVal = customInput.value.trim();
          state.selectedCategory = currentVal || "Своя категория";
        }
      } else {
        state.selectedCategory = cat;
        if (customInput) customInput.classList.add("hidden");
      }
      renderCategoryChips();
    });
  });

  document.getElementById("splitBillGroup").classList.toggle("hidden", state.formType !== "expense");
}

function updateSplitPreview() {
  const hintEl = document.getElementById("splitPreviewHint");
  const raw = Number(String(document.getElementById("txAmount").value).replace(",", "."));
  if (state.formType !== "expense" || state.splitRatio === 1 || !Number.isFinite(raw) || raw <= 0) {
    hintEl.classList.add("hidden");
    return;
  }
  const myShare = Math.round(raw * state.splitRatio * 100) / 100;
  hintEl.textContent = `Твоя доля к записи: €${myShare.toFixed(2)} (из чека €${raw.toFixed(2)})`;
  hintEl.classList.remove("hidden");
}

function switchTab(targetId) {
  triggerHaptic("light");
  document.querySelectorAll(".screen").forEach((el) => el.classList.toggle("active", el.id === targetId));
  document.querySelectorAll(".dock-item[data-target]").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-target") === targetId);
  });
}

function openFormModal(type = "expense", editingTx = null) {
  triggerHaptic("medium");
  document.getElementById("formError").classList.add("hidden");
  state.pendingFormExternalId = null;
  if (editingTx) {
    state.editingTxId = editingTx.id;
    setFormType(editingTx.type);
    state.selectedCategory = editingTx.category;
    document.getElementById("formTitle").textContent = "Изменить операцию";
    document.getElementById("txAmount").value = editingTx.amount;
    document.getElementById("txDate").value = String(editingTx.date).slice(0, 10);
    document.getElementById("txDescription").value = editingTx.description || "";
  } else {
    state.editingTxId = null;
    setFormType(type);
    document.getElementById("formTitle").textContent = "Новая операция";
    document.getElementById("txAmount").value = "";
    document.getElementById("txDate").value = getTodayIsoLocal();
    document.getElementById("txDescription").value = "";
  }
  state.splitRatio = 1;
  document.querySelectorAll(".s-pill").forEach((p) => {
    p.classList.toggle("active", Number(p.getAttribute("data-split")) === 1);
  });
  renderCategoryChips();
  updateSplitPreview();
  document.getElementById("txFormModal").classList.remove("hidden");
}

function openTxDetailModal(id) {
  const tx = state.transactions.find((item) => String(item.id) === String(id));
  if (!tx) return;
  state.selectedTxId = tx.id;
  state.pendingDupExternalId = null;
  const isIncome = tx.type === "income";
  const meta = getCategoryMeta(tx.type, tx.category);

  document.getElementById("txDetailBody").innerHTML = `
    <div class="detail-row"><span>Сумма</span><span style="color:${isIncome ? "var(--emerald)" : "var(--ink)"}">${isIncome ? "+" : "−"}${formatEUR(tx.amount)}</span></div>
    <div class="detail-row"><span>Категория</span><span>${meta.icon} ${escapeHtml(tx.category)}</span></div>
    <div class="detail-row"><span>Дата</span><span>${escapeHtml(String(tx.date).slice(0, 10))}</span></div>
    <div class="detail-row"><span>Описание</span><span>${escapeHtml(tx.description || "—")}</span></div>
  `;
  document.getElementById("txDetailModal").classList.remove("hidden");
}

function formatHumanDayLabel(dateStr) {
  const today = getTodayIsoLocal();
  const yestDate = getTodayIsoLocal(new Date(Date.now() - 86400000));
  if (dateStr === today) return "Сегодня";
  if (dateStr === yestDate) return "Вчера";

  const parts = String(dateStr).split("-");
  if (parts.length !== 3) return dateStr;
  const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  return `${parseInt(parts[2], 10)} ${months[parseInt(parts[1], 10) - 1] || parts[1]}`;
}

function escapeHtml(str) {
  return String(str ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function exportTransactionsToCSV() {
  const rows = [["date", "type", "amount", "category", "description"].join(";")];
  for (const tx of sortByDateDesc(state.transactions)) {
    rows.push([tx.date, tx.type, Number(tx.amount).toFixed(2), `"${tx.category}"`, `"${tx.description || ""}"`].join(";"));
  }
  const blob = new Blob(["\uFEFF" + rows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `pulse_finance_${getTodayIsoLocal()}.csv`;
  a.click();
}

function initEvents() {
  // Док-навигация
  document.querySelectorAll(".dock-item[data-target]").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.getAttribute("data-target")));
  });

  // Кнопка приватности (скрытие сумм)
  document.getElementById("privacyToggleBtn").addEventListener("click", () => {
    triggerHaptic("light");
    state.privacyMasked = !state.privacyMasked;
    localStorage.setItem(STORAGE_KEY_PRIVACY, state.privacyMasked ? "1" : "0");
    document.body.classList.toggle("privacy-masked", state.privacyMasked);
  });

  // Умная строка ввода одной фразой (на главном экране)
  const smartInput = document.getElementById("smartQuickTextInput");
  const smartPreview = document.getElementById("smartParsePreview");
  const smartSendBtn = document.getElementById("smartQuickSendBtn");
  const updateSmartPreview = () => {
    const rawTrimmed = String(smartInput.value || "").trim();
    if (rawTrimmed !== state.pendingSmartInputKey) {
      state.pendingSmartExternalId = null;
      state.pendingSmartInputKey = rawTrimmed;
    }
    const parsed = parseSmartQuickInput(rawTrimmed);
    if (!parsed) {
      smartPreview.classList.add("hidden");
      return;
    }
    const meta = getCategoryMeta(parsed.type, parsed.category);
    const sign = parsed.type === "income" ? "+" : "−";
    const color = parsed.type === "income" ? "var(--emerald)" : "var(--ink)";
    smartPreview.innerHTML = `
      <span>${meta.icon} <strong>${escapeHtml(parsed.category)}</strong> • ${escapeHtml(parsed.description)}</span>
      <strong style="color:${color}">${sign}${formatEUR(parsed.amount)}</strong>
    `;
    smartPreview.classList.remove("hidden");
  };
  const submitSmartQuickInput = async () => {
    if (state.mutationInFlight) return;
    const rawTrimmed = String(smartInput.value || "").trim();
    const parsed = parseSmartQuickInput(rawTrimmed);
    if (!parsed) return;
    if (state.apiUrl && !hasTelegramAuth()) {
      markSyncFailure("Нужен вход через Telegram");
      showToast("В режиме LIVE нужен вход через Telegram (или включи DEMO)");
      return;
    }
    if (rawTrimmed !== state.pendingSmartInputKey || !state.pendingSmartExternalId) {
      state.pendingSmartInputKey = rawTrimmed;
      state.pendingSmartExternalId = generateAttemptExternalId("SMART");
    }

    triggerHaptic("medium");
    state.mutationInFlight = true;
    if (smartSendBtn) smartSendBtn.disabled = true;
    try {
      const res = await executeServerCreate({
        externalId: state.pendingSmartExternalId,
        date: parsed.date,
        type: parsed.type,
        amount: parsed.amount,
        category: parsed.category,
        description: parsed.description
      });
      if (!res.ok) {
        showToast(`Ошибка записи: ${res.error}`);
        return;
      }
      state.pendingSmartExternalId = null;
      state.pendingSmartInputKey = "";
      smartInput.value = "";
      smartPreview.classList.add("hidden");
      showToast(`Записано: ${parsed.category} • €${parsed.amount.toFixed(2)}`);
    } finally {
      state.mutationInFlight = false;
      if (smartSendBtn) smartSendBtn.disabled = false;
    }
  };
  smartInput?.addEventListener("input", updateSmartPreview);
  smartInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitSmartQuickInput();
    }
  });
  smartSendBtn?.addEventListener("click", submitSmartQuickInput);

  // Шторка создания операции
  document.getElementById("fabAddBtn").addEventListener("click", () => openFormModal("expense"));
  document.getElementById("quickAddExpenseBtn").addEventListener("click", () => openFormModal("expense"));
  document.getElementById("quickAddIncomeBtn").addEventListener("click", () => openFormModal("income"));
  document.getElementById("closeFormModalBtn").addEventListener("click", () => {
    document.getElementById("txFormModal").classList.add("hidden");
  });

  // Сброс ключа идемпотентности при изменении полей формы
  ["txAmount", "txDate", "txDescription"].forEach((fieldId) => {
    document.getElementById(fieldId)?.addEventListener("input", () => {
      state.pendingFormExternalId = null;
    });
  });

  // Быстрые купюры +€5 / +€10 / +€25 / +€50
  document.querySelectorAll(".add-amt-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      triggerHaptic("light");
      state.pendingFormExternalId = null;
      const addVal = Number(btn.getAttribute("data-add") || 0);
      const inputEl = document.getElementById("txAmount");
      const current = Number(String(inputEl.value).replace(",", ".")) || 0;
      inputEl.value = (current + addVal).toFixed(2).replace(/\.00$/, "");
      updateSplitPreview();
    });
  });

  // Шторка Swedbank
  const openBankModal = () => {
    triggerHaptic("light");
    document.getElementById("bankModal").classList.remove("hidden");
  };
  document.getElementById("quickImportBankBtn").addEventListener("click", openBankModal);
  document.getElementById("navBankBtn").addEventListener("click", openBankModal);
  document.getElementById("closeBankModalBtn").addEventListener("click", () => {
    document.getElementById("bankModal").classList.add("hidden");
  });

  // Шторка Целей и Копилки
  document.getElementById("openGoalsModalBtn").addEventListener("click", () => {
    triggerHaptic("light");
    renderGoalsModal();
    document.getElementById("goalsModal").classList.remove("hidden");
  });
  document.getElementById("closeGoalsModalBtn").addEventListener("click", () => {
    document.getElementById("goalsModal").classList.add("hidden");
  });
  document.getElementById("saveSavingsGoalBtn").addEventListener("click", () => {
    const val = Number(String(document.getElementById("monthlySavingsInput").value).replace(",", "."));
    if (Number.isFinite(val) && val >= 0) {
      state.savingsGoal = Math.round(val);
      localStorage.setItem(STORAGE_KEY_SAVINGS, String(state.savingsGoal));
      renderAll();
      document.getElementById("goalsModal").classList.add("hidden");
    }
  });

  // Шторка Обязательных счетов
  document.getElementById("openBillsModalBtn").addEventListener("click", () => {
    triggerHaptic("light");
    renderBillsModal();
    document.getElementById("billsModal").classList.remove("hidden");
  });
  document.getElementById("closeBillsModalBtn").addEventListener("click", () => {
    document.getElementById("billsModal").classList.add("hidden");
  });

  // Шторка Сплита 50/50
  document.getElementById("openSharedModalBtn").addEventListener("click", () => {
    triggerHaptic("light");
    renderSharedModal();
    document.getElementById("sharedModal").classList.remove("hidden");
  });
  document.getElementById("closeSharedModalBtn").addEventListener("click", () => {
    document.getElementById("sharedModal").classList.add("hidden");
  });

  document.getElementById("seeAllHistoryBtn").addEventListener("click", () => switchTab("view-history"));

  document.getElementById("quickRefreshBtn")?.addEventListener("click", async () => {
    triggerHaptic("light");
    if (state.apiUrl) {
      showToast("Синхронизация с D1...");
      const res = await syncTransactionsFromServer();
      if (res.ok) {
        showToast("Данные синхронизированы с D1");
      } else {
        showToast(`Нет связи: ${res.error}`);
      }
    } else {
      renderAll();
      showToast("Режим DEMO: локальные данные");
    }
  });

  // Шаблоны в форме
  document.querySelectorAll("#quickTemplatesBar .preset-pill").forEach((chip) => {
    chip.addEventListener("click", () => {
      triggerHaptic("light");
      state.pendingFormExternalId = null;
      setFormType(chip.getAttribute("data-type") || "expense");
      state.selectedCategory = chip.getAttribute("data-cat");
      state.splitRatio = Number(chip.getAttribute("data-split") || 1);
      document.querySelectorAll(".s-pill").forEach((p) => {
        p.classList.toggle("active", Number(p.getAttribute("data-split")) === state.splitRatio);
      });
      document.getElementById("txDescription").value = chip.getAttribute("data-desc") || "";
      renderCategoryChips();
      updateSplitPreview();
      document.getElementById("txAmount").focus();
    });
  });

  // Деление чека
  document.querySelectorAll(".s-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      triggerHaptic("light");
      state.pendingFormExternalId = null;
      document.querySelectorAll(".s-pill").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      state.splitRatio = Number(pill.getAttribute("data-split") || 1);
      if (state.splitRatio < 1 && state.selectedCategory === "Продукты") {
        state.selectedCategory = "Совместные расходы";
        renderCategoryChips();
      }
      updateSplitPreview();
    });
  });

  document.getElementById("txAmount").addEventListener("input", updateSplitPreview);

  // Период
  document.querySelectorAll(".p-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      triggerHaptic("light");
      document.querySelectorAll(".p-chip").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      state.period = btn.getAttribute("data-period");
      document.getElementById("customDatesBox").classList.toggle("hidden", state.period !== "custom");
      renderAll();
    });
  });

  document.getElementById("dateFrom").addEventListener("change", (e) => {
    state.customFrom = e.target.value;
    renderAll();
  });
  document.getElementById("dateTo").addEventListener("change", (e) => {
    state.customTo = e.target.value;
    renderAll();
  });

  // Переключатель Расход/Доход
  document.querySelectorAll(".t-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.pendingFormExternalId = null;
      setFormType(btn.getAttribute("data-tx-type"));
    });
  });

  // Сабмит формы (Создание и Редактирование строго через сервер в LIVE)
  document.getElementById("txForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (state.mutationInFlight) return;
    const errEl = document.getElementById("formError");
    const submitBtn = document.getElementById("submitTxBtn");
    errEl.classList.add("hidden");

    if (state.apiUrl && !hasTelegramAuth()) {
      markSyncFailure("Нужен вход через Telegram");
      errEl.textContent = "В режиме LIVE нужен вход через Telegram (или переключи на DEMO)";
      errEl.classList.remove("hidden");
      return;
    }

    const rawAmountStr = String(document.getElementById("txAmount").value || "").trim();
    const enteredAmount = rawAmountStr && !rawAmountStr.startsWith("-")
      ? Number(rawAmountStr.replace(",", "."))
      : NaN;
    const dateVal = String(document.getElementById("txDate").value || "").trim().slice(0, 10);
    let descVal = document.getElementById("txDescription").value.trim();

    const customInput = document.getElementById("txCustomCategory");
    if (customInput && !customInput.classList.contains("hidden")) {
      const customVal = customInput.value.trim();
      if (customVal) {
        state.selectedCategory = customVal;
      }
    }

    if (!Number.isFinite(enteredAmount) || enteredAmount <= 0) {
      errEl.textContent = "Укажи положительную сумму больше нуля";
      errEl.classList.remove("hidden");
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateVal)) {
      errEl.textContent = "Укажи корректную дату операции";
      errEl.classList.remove("hidden");
      return;
    }

    const ratio = state.formType === "expense" ? state.splitRatio : 1;
    const finalAmount = Math.round(enteredAmount * ratio * 100) / 100;
    if (finalAmount <= 0) {
      errEl.textContent = "Сумма после деления должна быть не меньше €0.01";
      errEl.classList.remove("hidden");
      return;
    }
    if (ratio < 1 && !descVal.includes("от €")) {
      descVal = `${descVal || "Общий чек"} (${Math.round(ratio * 100)}% от €${enteredAmount.toFixed(2)})`;
    }

    const categoryVal = String(state.selectedCategory || "Прочее").trim().slice(0, 60);
    const descriptionVal = String(descVal || categoryVal).trim().slice(0, 250);

    state.mutationInFlight = true;
    if (submitBtn) submitBtn.disabled = true;
    try {
      if (state.editingTxId) {
        const existingTx = state.transactions.find((t) => String(t.id) === String(state.editingTxId));
        if (!existingTx) {
          errEl.textContent = "Редактируемая операция не найдена";
          errEl.classList.remove("hidden");
          return;
        }
        const res = await executeServerUpdate({
          id: existingTx.id,
          externalId: existingTx.externalId,
          date: dateVal,
          type: state.formType,
          amount: finalAmount,
          category: categoryVal,
          description: descriptionVal
        });
        if (!res.ok) {
          errEl.textContent = `Ошибка сохранения: ${res.error}`;
          errEl.classList.remove("hidden");
          return;
        }
        if (descVal && state.formType === "expense") {
          learnMerchantCategory(descVal, categoryVal);
        }
        triggerHaptic("medium");
        document.getElementById("txFormModal").classList.add("hidden");
        showToast("Операция обновлена");
      } else {
        if (!state.pendingFormExternalId) {
          state.pendingFormExternalId = generateAttemptExternalId("APP");
        }
        const res = await executeServerCreate({
          externalId: state.pendingFormExternalId,
          date: dateVal,
          type: state.formType,
          amount: finalAmount,
          category: categoryVal,
          description: descriptionVal
        });
        if (!res.ok) {
          errEl.textContent = `Ошибка сохранения: ${res.error}`;
          errEl.classList.remove("hidden");
          return;
        }
        state.pendingFormExternalId = null;
        if (descVal && state.formType === "expense") {
          learnMerchantCategory(descVal, categoryVal);
        }
        triggerHaptic("medium");
        document.getElementById("txFormModal").classList.add("hidden");
        showToast("Операция сохранена");
      }
    } finally {
      state.mutationInFlight = false;
      if (submitBtn) submitBtn.disabled = false;
    }
  });

  // Swedbank CSV
  const fileInput = document.getElementById("swedbankFileInput");
  document.getElementById("chooseCsvFileBtn").addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      state.parsedBankTx = parseSwedbankCSV(String(reader.result || ""));
      renderParsedSwedbankPreview();
    };
    reader.readAsText(file, "UTF-8");
  });

  document.getElementById("loadSampleSwedbankBtn").addEventListener("click", () => {
    triggerHaptic("light");
    state.parsedBankTx = parseSwedbankCSV(getSampleSwedbankCsv());
    renderParsedSwedbankPreview();
  });

  document.getElementById("confirmImportTxBtn").addEventListener("click", async () => {
    if (!state.parsedBankTx.length || state.mutationInFlight) return;
    if (state.apiUrl && !hasTelegramAuth()) {
      markSyncFailure("Нужен вход через Telegram");
      showToast("В режиме LIVE нужен вход через Telegram (или включи DEMO)");
      return;
    }

    const confirmBtn = document.getElementById("confirmImportTxBtn");
    const msgEl = document.getElementById("bankImportSuccessMsg");

    // Проверяем дубликаты ТОЛЬКО по надёжному банковскому externalId.
    const existingExtIds = new Set(
      state.transactions
        .map((t) => (typeof t.externalId === "string" ? t.externalId.trim() : ""))
        .filter(Boolean)
    );
    let skippedLocal = 0;
    const candidateBatch = [];
    for (const item of state.parsedBankTx) {
      const extId = typeof item.externalId === "string" ? item.externalId.trim() : "";
      if (extId) {
        if (existingExtIds.has(extId)) {
          skippedLocal++;
          continue;
        }
        existingExtIds.add(extId);
      }
      candidateBatch.push({ ...item });
    }

    if (candidateBatch.length === 0) {
      msgEl.style.color = "";
      msgEl.textContent = `Новых операций нет (пропущено дубликатов: ${skippedLocal})`;
      msgEl.classList.remove("hidden");
      setTimeout(() => msgEl.classList.add("hidden"), 4000);
      return;
    }

    if (state.apiUrl) {
      state.mutationInFlight = true;
      confirmBtn.disabled = true;
      try {
        const res = await apiCallN8n("bulk_import", { items: candidateBatch }, { returnError: true });
        if (!res || !res.ok) {
          markSyncFailure(res?.error);
          msgEl.style.color = "#dc2626";
          msgEl.textContent = `Ошибка импорта: ${res?.error || "сервер недоступен"}`;
          msgEl.classList.remove("hidden");
          showToast("Не удалось импортировать выписку. Данные не изменены.");
          return;
        }

        await syncTransactionsFromServer();

        triggerHaptic("medium");
        const serverInserted = Number(res.insertedCount || 0);
        const totalSkipped = skippedLocal + Number(res.skippedDuplicatesCount || 0);
        const noIdCount = Number(res.withoutExternalIdCount || 0);
        let statusText = `Импортировано: ${serverInserted} (пропущено дубликатов: ${totalSkipped})`;
        if (noIdCount > 0) {
          statusText += ` · Без банковского ID: ${noIdCount} (без защиты от дублей)`;
        }
        msgEl.style.color = "";
        msgEl.textContent = statusText;
        msgEl.classList.remove("hidden");
        setTimeout(() => msgEl.classList.add("hidden"), 5000);
      } finally {
        state.mutationInFlight = false;
        confirmBtn.disabled = false;
      }
      return;
    }

    // DEMO режим (без сервера)
    for (const item of candidateBatch) {
      state.transactions.push({ ...item });
    }
    triggerHaptic("medium");
    saveTransactions();
    renderAll();
    msgEl.style.color = "";
    msgEl.textContent = `Импортировано (DEMO): ${candidateBatch.length} (пропущено дубликатов: ${skippedLocal})`;
    msgEl.classList.remove("hidden");
    setTimeout(() => msgEl.classList.add("hidden"), 3000);
  });

  document.getElementById("copyBankReportBtn").addEventListener("click", () => {
    navigator.clipboard?.writeText(buildTextReport(state.parsedBankTx, "Swedbank"));
    document.getElementById("copyBankReportBtn").textContent = "Скопировано ✓";
    setTimeout(() => (document.getElementById("copyBankReportBtn").textContent = "Скопировать отчёт"), 2000);
  });

  document.getElementById("copyPeriodReportBtn").addEventListener("click", () => {
    const periodTx = sortByDateDesc(filterByPeriod(state.transactions));
    navigator.clipboard?.writeText(buildTextReport(periodTx, "Период"));
    document.getElementById("copyPeriodReportBtn").textContent = "Скопировано ✓";
    setTimeout(() => (document.getElementById("copyPeriodReportBtn").textContent = "📋 Копировать отчёт"), 2000);
  });

  // Симуляция Apple Pay разрешена ТОЛЬКО в режиме DEMO
  document.getElementById("simulateApplePayBtn").addEventListener("click", () => {
    if (state.apiUrl) {
      showToast("Демо-симуляция Apple Pay доступна только в режиме DEMO (в LIVE данные защищены)");
      return;
    }
    triggerHaptic("medium");
    state.transactions.unshift({
      id: "applepay-" + Date.now(),
      externalId: generateAttemptExternalId("DEMO-AP"),
      date: getTodayIsoLocal(),
      type: "expense",
      amount: 16.4,
      category: "Продукты",
      description: "MAXIMA LT • Apple Pay (DEMO)"
    });
    saveTransactions();
    renderAll();
    document.getElementById("bankModal").classList.add("hidden");
    showToast("Демо-операция Apple Pay добавлена");
  });

  // Поиск и фильтры
  document.getElementById("historySearchInput").addEventListener("input", (e) => {
    state.historySearchQuery = e.target.value;
    renderAll();
  });
  document.getElementById("filterType").addEventListener("change", (e) => {
    state.historyTypeFilter = e.target.value;
    renderAll();
  });
  document.getElementById("filterCategory").addEventListener("change", (e) => {
    state.historyCategoryFilter = e.target.value;
    renderAll();
  });
  document.getElementById("exportCsvBtn").addEventListener("click", exportTransactionsToCSV);

  // Детали операции
  const closeDetail = () => document.getElementById("txDetailModal").classList.add("hidden");
  document.getElementById("closeDetailModalBtn").addEventListener("click", closeDetail);
  document.getElementById("okDetailModalBtn").addEventListener("click", closeDetail);

  document.getElementById("editTxBtn").addEventListener("click", () => {
    const tx = state.transactions.find((t) => String(t.id) === String(state.selectedTxId));
    closeDetail();
    if (tx) openFormModal(tx.type, tx);
  });

  // 1-Tap Дублирование операции на сегодня (только через сервер в LIVE)
  const dupBtn = document.getElementById("duplicateTxBtn");
  dupBtn?.addEventListener("click", async () => {
    if (state.mutationInFlight) return;
    const tx = state.transactions.find((t) => String(t.id) === String(state.selectedTxId));
    if (!tx) return;
    triggerHaptic("medium");
    if (!state.pendingDupExternalId) {
      state.pendingDupExternalId = generateAttemptExternalId("DUP");
    }
    state.mutationInFlight = true;
    dupBtn.disabled = true;
    try {
      const res = await executeServerCreate({
        externalId: state.pendingDupExternalId,
        date: getTodayIsoLocal(),
        type: tx.type,
        amount: tx.amount,
        category: tx.category,
        description: tx.description
      });
      if (!res.ok) {
        showToast(`Ошибка дублирования: ${res.error}`);
        return;
      }
      state.pendingDupExternalId = null;
      closeDetail();
      showToast("Операция продублирована на сегодня");
    } finally {
      state.mutationInFlight = false;
      dupBtn.disabled = false;
    }
  });

  const delModalBtn = document.getElementById("deleteDemoTxBtn");
  delModalBtn.addEventListener("click", () => {
    if (state.mutationInFlight) return;
    const targetId = state.selectedTxId;
    if (!targetId) return;
    askNativeConfirm("Удалить эту операцию?", async () => {
      if (state.mutationInFlight) return;
      state.mutationInFlight = true;
      delModalBtn.disabled = true;
      try {
        const res = await executeServerDelete(targetId);
        if (!res.ok) {
          showToast(`Ошибка удаления: ${res.error}`);
          return;
        }
        closeDetail();
        showToast("Операция удалена");
      } finally {
        state.mutationInFlight = false;
        delModalBtn.disabled = false;
      }
    });
  });

  // Настройки и подключение к API
  const settingsModal = document.getElementById("settingsModal");
  const updateLearnedDictLabel = () => {
    const entries = Object.entries(state.learnedMerchants || {});
    const el = document.getElementById("learnedDictSummary");
    if (!el) return;
    if (entries.length === 0) {
      el.textContent = "🧠 Самообучающийся словарь: пока 0 правил (меняй категорию при импорте, и приложение запомнит магазин)";
    } else {
      const sample = entries.slice(0, 4).map(([k, v]) => `${k} → ${v}`).join(", ");
      el.textContent = `🧠 Выучено магазинов (${entries.length}): ${sample}`;
    }
  };

  document.getElementById("modeToggleBtn").addEventListener("click", () => {
    document.getElementById("apiUrlInput").value = state.apiUrl;
    updateLearnedDictLabel();
    settingsModal.classList.remove("hidden");
  });
  document.getElementById("closeSettingsModalBtn").addEventListener("click", () => settingsModal.classList.add("hidden"));

  document.getElementById("fillTestWebhookBtn")?.addEventListener("click", () => {
    triggerHaptic("light");
    document.getElementById("apiUrlInput").value = DEFAULT_N8N_TEST_WEBHOOK;
  });

  document.getElementById("clearApiUrlBtn")?.addEventListener("click", () => {
    triggerHaptic("light");
    document.getElementById("apiUrlInput").value = "";
  });

  document.getElementById("syncFromApiBtn")?.addEventListener("click", async () => {
    triggerHaptic("medium");
    const candidateUrl = document.getElementById("apiUrlInput").value.trim() || DEFAULT_API_URL;
    state.apiUrl = candidateUrl;
    localStorage.setItem(STORAGE_KEY_API, state.apiUrl);
    loadActiveModeTransactions();
    updateModeBadge();
    renderAll();
    if (!hasTelegramAuth()) {
      showToast("Для запроса к API открой приложение внутри Telegram");
      return;
    }
    const res = await syncTransactionsFromServer();
    if (res.ok) {
      settingsModal.classList.add("hidden");
      showToast(`Синхронизировано с API (${res.count} опер.)`);
    } else {
      showToast(`Ошибка синхронизации: ${res.error}`);
    }
  });

  document.getElementById("resetDemoDataBtn").addEventListener("click", () => {
    askNativeConfirm("Сбросить демо-операции к начальному состоянию?", () => {
      state.apiUrl = "";
      localStorage.setItem(STORAGE_KEY_API, "");
      document.getElementById("apiUrlInput").value = "";
      state.transactions = getInitialDemoTransactions();
      state.bills = getDefaultMonthlyBills();
      state.syncState = "demo";
      state.showingCachedCopy = false;
      saveTransactions();
      saveBills();
      updateModeBadge();
      renderAll();
      settingsModal.classList.add("hidden");
    });
  });

  document.getElementById("saveSettingsBtn").addEventListener("click", async () => {
    state.apiUrl = document.getElementById("apiUrlInput").value.trim();
    localStorage.setItem(STORAGE_KEY_API, state.apiUrl);
    loadActiveModeTransactions();
    updateModeBadge();
    renderAll();
    settingsModal.classList.add("hidden");
    if (state.apiUrl) {
      await syncTransactionsFromServer();
    }
  });
}

function setFormType(type) {
  state.formType = type;
  document.querySelectorAll(".t-btn").forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-tx-type") === type);
  });
  state.selectedCategory = CATEGORIES[type][0].name;
  renderCategoryChips();
  updateSplitPreview();
}

function updateModeBadge() {
  const dot = document.getElementById("modeDot");
  const text = document.getElementById("modeBadgeText");
  const notice = document.getElementById("syncStatusNotice");
  if (!dot || !text) return;

  dot.classList.remove("online", "error");
  if (notice) {
    notice.classList.remove("error");
    notice.classList.add("hidden");
  }

  if (!state.apiUrl) {
    text.textContent = "DEMO";
    return;
  }

  if (!hasTelegramAuth()) {
    dot.classList.add("error");
    text.textContent = "Нужен вход TG";
    if (notice) {
      notice.textContent = "Нужен вход через Telegram (или переключи режим на DEMO в настройках).";
      notice.classList.add("error");
      notice.classList.remove("hidden");
    }
    return;
  }

  if (state.syncState === "connecting") {
    text.textContent = "Подключение…";
    if (notice && state.showingCachedCopy) {
      notice.textContent = "Подключение к D1… Пока отображается сохранённая на устройстве копия.";
      notice.classList.remove("hidden");
    }
    return;
  }

  if (state.syncState === "synced") {
    dot.classList.add("online");
    text.textContent = state.lastSyncAt ? `Синхр. ${state.lastSyncAt}` : "Синхронизировано";
    return;
  }

  // offline_cache или сбой запроса
  dot.classList.add("error");
  if (state.transactions.length > 0) {
    text.textContent = "Нет связи • кэш";
    if (notice) {
      notice.textContent = "Нет связи с сервером — показана сохранённая копия (данные могут быть устаревшими).";
      notice.classList.add("error");
      notice.classList.remove("hidden");
    }
  } else {
    text.textContent = "Нет связи";
    if (notice) {
      notice.textContent = `Нет связи с сервером D1${state.lastSyncError ? ": " + state.lastSyncError : ""}.`;
      notice.classList.add("error");
      notice.classList.remove("hidden");
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  initTelegramWebApp();
  loadAllState();
  renderCategoryChips();
  initEvents();
  updateModeBadge();
  renderAll();
  if (state.apiUrl && hasTelegramAuth()) {
    await syncTransactionsFromServer();
  }
});
