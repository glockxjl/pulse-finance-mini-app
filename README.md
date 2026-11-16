# PULSE — Telegram Mini App & Finance Bot

Персональное приложение для учёта личных финансов в евро (€) внутри Telegram (Mini App на базе Cloudflare Workers + D1).

> [!IMPORTANT]
> Полный актуальный паспорт архитектуры зафиксирован в документе [`ARCHITECTURE.md`](file:///C:/Users/Buhalterija/Desktop/PULSE-Finance/ARCHITECTURE.md).

## Единый источник кода и публикация

- **Основной рабочий проект (единственный исходник):** `C:\Users\Buhalterija\Desktop\PULSE-Finance`
- **Опубликованная версия (GitHub Pages):** https://glockxjl.github.io/pulse-finance-mini-app/
- **Облачный API Mini App (Cloudflare Worker + D1):** папка `cloudflare-worker/` (`https://pulse-api.dragonfantom2007.workers.dev`)
- **Репозиторий GitHub Pages:** `https://github.com/glockxjl/pulse-finance-mini-app`
- **Старая папка (`C:\Users\Buhalterija\project-2030\pulse-finance-mini-app`):** переведена в статус **архивной** (`ARCHIVED_README.md`) и больше не используется для разработки или деплоя.

## Структура проекта

```text
PULSE-Finance/
├── ARCHITECTURE.md             # Актуальный паспорт системы и работающей архитектуры
├── index.html                  # Интерфейс Telegram Mini App (Обзор, Операции, Аналитика, Настройки)
├── styles.css                  # Стили Светлое Бенто, темы Telegram WebApp и мобильная адаптация
├── app.js                      # Клиентская логика, словарь магазинов Литвы, демо-режим и API-клиент
├── CHATGPT_PROJECT_PROMPT.md   # Готовый промпт и паспорт проекта для ChatGPT Plus Projects
├── README.md                   # Это описание
├── cloudflare-worker/          # Исходный код Worker (src/index.js), конфигурация D1 и миграции
└── docs/                       # Архив исторической документации и технического плана (n8n)
    ├── CHATGPT_CONTEXT.md      # Личный контекст и предпочтения
    ├── PROJECT_FINANCE.md      # Аудит n8n, правила безопасности и история разработки
    ├── PLAN.md                 # Технический план, формулы, перенесённые функции и задачи API
    └── GEMINI.md               # Рабочие правила для ИИ-агентов
```

## Функционал основной объединённой версии

1. **Обзор и аналитика (Светлое Бенто):**
   - Расчёт за период (Неделя / Месяц / Произвольный диапазон): `Доходы`, `Расходы`, `Доступный остаток (Доходы − Расходы)`, `Число операций`, отдельный учёт категории `Совместные расходы`.
   - Сравнение с прошлым периодом (`%` дельта), прогноз расходов до конца месяца и дневной ориентир трат.
   - Кольцевая SVG-диаграмма расходов по категориям с фильтром по клику, график по дням недели и карточка финансового здоровья (норма сбережений).
2. **Операции и быстрый ввод:**
   - Умная строка быстрого ввода чека (`Lidl 14.80`, `+ 500 Аванс`) с мгновенным определением категории и типа операции.
   - Полная карточка просмотра, редактирования (`✏️`), дублирования (`📋`) и быстрого удаления (`×`) операции.
   - Всплывающие тост-уведомления (`#appToast`) и кнопка быстрого обновления ленты (`↻`).
3. **Авто-категоризация (расширенный словарь Литвы и ЕС + самообучение):**
   - Распознавание более 75 мерчантов Литвы (`Lidl`, `Maxima`, `Iki`, `Rimi`, `Norfa`, `Šilas`, `Aibė`, `Assorti`, `Wolt`, `Bolt`, `Subway`, `Čili`, `Huracan`, `Caif`, `Crustum`, `Ignitis`, `Telia`, `Bitė`, `Tele2`, `Cgates`, `JUDU`, `Trafi`, `Unipark`, `Stova`, `Circle K`, `Viada`, `Neste`, `Emsi`, `Orlen`, `Eurovaistinė`, `Camelia`, `Benu`, `Gintarinė`, `Apotheka`, `Kardiolita`, `Antėja`, `Senukai`, `Ermitažas`, `Ikea`, `Depo`, `Jysk`, `Pepco`, `Pigu`, `Varlė`, `Topocentras`, `Vinted`, `Zalando`, `About You`, `Forum Cinemas`, `Multikino`, `Akropolis`, `Ozas`, `Panorama`, `Swedbank` и др.) с защитой коротких ключей (`iki`) по границам слов.
   - Самообучающийся словарь в `localStorage` при ручной смене категории пользователем.
4. **Импорт/экспорт данных:**
   - Импорт CSV выписок Swedbank и JSON-бэкапов с защитой от дубликатов по `externalId`, экспорт в CSV и JSON.
5. **Безопасный клиент API (`apiCallN8n` + `normalizeApiTransactions`):**
   - Авторизация только через подписанный заголовок `X-Telegram-Init-Data` (`Telegram.WebApp.initData`) без тестовых обходов проверки подписи, без открытых ключей и без передачи неподписанного идентификатора пользователя.
   - Нормализация различных форматов ответа n8n (`transactions`, `rows`, `data`, запятые в дробных суммах, ISO-даты).

## Статус серверного API и интеграций

- **Серверный бэкенд:** полностью переведён на Cloudflare Workers + D1 (`pulse-api.dragonfantom2007.workers.dev`).
- **Авторизация Mini App:** валидация HMAC-SHA256 подписи `Telegram.WebApp.initData` и проверка `userId === 1604405483`.
- **Индикатор LIVE:** зависит исключительно от выбранного URL API (`state.apiUrl`) и не подтверждает наличие сетевой связи или валидность `initData`.
- **Прямой приём оплат из iOS Shortcuts (Apple Pay):** серверный маршрут `POST /api/shortcut` реализован в Worker (с ключом `X-Shortcut-Key`, дедупликацией и записью в `transactions`), однако клиентская автоматика iPhone Shortcut в iOS на данный момент **отложена**, и сквозной сценарий не принят.
- **Кнопка меню в боте:** настроена через `@BotFather` (`/setmenubutton`) на адрес GitHub Pages.
- **Подробный паспорт архитектуры:** см. [`ARCHITECTURE.md`](file:///C:/Users/Buhalterija/Desktop/PULSE-Finance/ARCHITECTURE.md).

## Как запустить локально

1. Открой файл `index.html` в любом браузере — по умолчанию включён **Демо-режим**, который работает автономно через `localStorage` без запросов к серверу.
2. Для проверки с данными из n8n открой приложение внутри Telegram и переключи режим в верхней панели или во вкладке **Настройки** на **API (Тест)**.
