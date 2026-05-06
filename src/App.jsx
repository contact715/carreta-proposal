import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useInView, animate } from 'framer-motion'
import './App.css'

// ─── SVG Decorations ─────────────────────────────────────────────────────────
function InkUnderline({ color = 'var(--accent)' }) {
  return (
    <svg className="ink-underline" viewBox="0 0 120 6" preserveAspectRatio="none"
      style={{ stroke: color }}>
      <path d="M2,4 C18,2 38,5.5 60,3.5 C82,1.5 100,5 118,3" fill="none"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function InkCircle({ children, style }) {
  return (
    <span className="ink-circle-wrap" style={style}>
      {children}
      <svg className="ink-circle-svg" viewBox="0 0 120 60" preserveAspectRatio="none">
        <ellipse cx="60" cy="30" rx="56" ry="26"
          fill="none" stroke="var(--accent)" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ strokeDasharray: '3 2' }} />
      </svg>
    </span>
  )
}

function WavyDivider() {
  return (
    <svg className="wavy-divider" viewBox="0 0 400 10" preserveAspectRatio="none">
      <path d="M0,5 C40,2 80,8 120,5 C160,2 200,8 240,5 C280,2 320,8 360,5 C380,3 395,6 400,5"
        fill="none" stroke="var(--border)" strokeWidth="1"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Animated counter ────────────────────────────────────────────────────────
function Count({ to, prefix = '', suffix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    const ctrl = animate(0, to, { duration: 1.4, ease: 'easeOut', onUpdate: v => setVal(Math.round(v)) })
    return ctrl.stop
  }, [inView, to])
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>
}

// ─── Market bar ──────────────────────────────────────────────────────────────
function MktBar({ label, value, pct, color, note }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <div ref={ref} className="mkt-row">
      <div className="mkt-row-header">
        <span className="mkt-label">{label}</span>
        <span className="mkt-value">{value}</span>
      </div>
      <div className="mkt-bar-bg">
        <motion.div className="mkt-bar-fill" style={{ background: color }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
          {pct}%
        </motion.div>
      </div>
      {note && <p className="mkt-note">{note}</p>}
    </div>
  )
}

// ─── DATA ────────────────────────────────────────────────────────────────────
const plans = [
  {
    id: 'us', name: 'US-агентство', badge: 'Рыночный ориентир',
    price: '$1.2M — $2.0M', mo: '$150–250K/мес', time: '10–14 мес', team: '10–15 чел', where: 'SF / New York',
    color: '#B94040',
    features: [
      'Все специалисты — US Senior уровня ($14–22K/мес каждый)',
      'Markup агентства 30–50% поверх зарплат команды',
      'Нет прямого контроля над командой — работаете через менеджера',
      'Высокая текучка — ушёл один разработчик, встал весь проект',
    ],
    for: 'Рыночный ориентир. Именно столько стоит тот же продукт в агентстве LA или NY.',
  },
  {
    id: 'a', name: 'Premium', badge: 'Максимальная скорость',
    price: '$700K — $1.2M', mo: '$85–130K/мес', time: '7–9 мес', team: '9–12 чел', where: 'CA + СНГ + US',
    color: '#C8860A',
    level: 'Senior', levelNote: 'Только Senior — US и СНГ. Минимальный риск на каждой позиции.',
    features: [
      'Все разработчики уровня Senior — никаких Middle',
      'US-специалисты на AI/ML и безопасность',
      'Дублирование ключевых ролей — нет зависимости от одного человека',
      'Готовность к аудиту инвесторов с первого дня',
      'AI-ассистент полный — чат, голос, фото-диагностика',
    ],
    for: 'Если важна максимальная скорость и готовность к инвесторам с первого дня.',
  },
  {
    id: 'b', name: 'Standard', badge: 'Рекомендованный', rec: true,
    price: '$450K — $700K', mo: '$48–65K/мес', time: '9–11 мес', team: '7–8 чел', where: 'CA + Восточная Европа',
    color: '#1A9D8A',
    level: 'Mid+ / Senior', levelNote: 'Mid+ и Senior из СНГ под контролем CA-тимлидов. Тот же результат без US-переплаты.',
    features: [
      'Разработчики уровня Mid+ и Senior из Восточной Европы',
      'CA-тимлиды контролируют каждую строчку кода',
      'Полноценный production — не MVP, не прототип',
      'AI-ассистент полный — чат, голос, фото-диагностика',
      'Прямой доступ к команде, еженедельные отчёты',
    ],
    for: 'Оптимальный выбор: US-качество без US-цены. Рекомендуем для старта.',
  },
  {
    id: 'c', name: 'Economy', badge: 'Минимальный бюджет',
    price: '$350K — $500K', mo: '$25–35K/мес', time: '12–16 мес', team: '5–6 чел', where: 'CA + смешанный',
    color: '#9A8B5A',
    level: 'Middle', levelNote: 'Middle-специалисты из СНГ. Медленнее Senior — отсюда срок +3–7 мес.',
    features: [
      'Специалисты уровня Middle из СНГ',
      'Срок 12–16 мес вместо 9–11',
      'AI-ассистент базовый — только чат',
      'Выше зависимость от каждого разработчика',
    ],
    for: 'Если бюджет ограничен и есть готовность к более длинному сроку.',
  },
]

const comparison = [
  { label: 'Бюджет', us: '$1.2M–$2.0M', a: '$700K–$1.2M', b: '$450K–$700K', c: '$350K–$500K' },
  { label: 'Ежемесячный платёж', us: '$150–250K', a: '$85–130K', b: '$48–65K', c: '$25–35K' },
  { label: 'Срок до production', us: '10–14 мес', a: '7–9 мес', b: '9–11 мес', c: '12–16 мес' },
  { label: 'Уровень специалистов', us: 'Senior US', a: 'Senior', b: 'Mid+ / Senior', c: 'Middle' },
  { label: 'AI-ассистент', us: 'Полный', a: 'Полный', b: 'Полный', c: 'Базовый' },
  { label: 'Контроль CA', us: 'Нет', a: 'Да', b: 'Да', c: 'Частично' },
  { label: 'Markup агентства', us: '+30–50%', a: '0%', b: '0%', c: '0%' },
  { label: 'Риск ухода ключевых', us: 'Высокий', a: 'Низкий', b: 'Средний', c: 'Высокий' },
]

// ─── SLIDE COMPONENTS ─────────────────────────────────────────────────────────

function Slide01Hero() {
  return (
    <div className="hero-wrap">
      <div className="hero-left">
        <div className="hero-eyebrow">Коммерческое предложение · 2025</div>
        <h1 className="hero-title">
          <span className="hero-title-main">CARRETA</span>
          <span className="hero-title-sub">Uber-модель<br />для автосервисов</span>
        </h1>
        <p className="hero-desc">
          Первая платформа в США, которая соединяет автовладельцев с независимыми шопами. Заказ, оплата, GPS-трекинг и AI-ассистент — в одном приложении. Рынок $300 млрд. Ниша свободна.
        </p>
        <div className="hero-divider">
          <WavyDivider />
        </div>
        <div className="hero-from">Castells Media, Inc. — Roseville, CA</div>
      </div>

      <div className="hero-right">
        <div className="hero-stats">
          {[
            { n: 435, suf: 'B', label: 'объём рынка\nавтосервиса в США ($)', large: true },
            { n: 289, suf: 'M', label: 'зарегистрированных\nавтомобилей в США' },
            { n: 67, suf: '%', label: 'звонков в шоп\nостаются без ответа' },
            { n: 1400, suf: '$', label: 'в год тратит\nсредний американец\nна уход за машиной' },
          ].map((s, i) => (
            <motion.div key={i} className={`hero-stat${s.large ? ' hero-stat-large' : ''}`}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3 + i * 0.1 }}>
              {s.large
                ? <InkCircle><span className="hero-stat-n"><Count to={s.n} suffix={s.suf} /></span></InkCircle>
                : <span className="hero-stat-n"><Count to={s.n} suffix={s.suf} /></span>
              }
              <span className="hero-stat-l" style={{ whiteSpace: 'pre-line' }}>{s.label}</span>
            </motion.div>
          ))}
        </div>

        <div className="hero-scale-box">
          <div className="hero-scale-title">Что значит 1% этого рынка</div>
          <div className="hero-scale-rows">
            <div className="hero-scale-row">
              <span>500 шопов на платформе</span>
              <span className="hero-scale-val">реальная цель 18 мес</span>
            </div>
            <div className="hero-scale-row">
              <span>2 000 заказов в день</span>
              <span className="hero-scale-val">при среднем чеке $500</span>
            </div>
            <div className="hero-scale-row">
              <span>$1M GMV в сутки</span>
              <span className="hero-scale-val">$200K/сутки — Carreta</span>
            </div>
            <div className="hero-scale-row hero-scale-row-accent">
              <span>Доход Carreta в год</span>
              <span className="hero-scale-val">$73M+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Slide02Problem() {
  const problems = {
    client: [
      { n: '01', h: 'Не знают, кому доверять', p: 'В США сотни шопов на каждый район, но нет нормального способа понять, кто делает хорошо и берёт честную цену. Всё через сарафанное радио или случайный Google Maps.' },
      { n: '02', h: 'Цену называют только вживую', p: 'Онлайн не посмотреть, сколько стоит PPF или детейлинг. Нужно ехать, тратить время — и цена часто меняется прямо в шопе.' },
      { n: '03', h: 'Не принимают карты или рассрочку', p: 'Многие шопы работают только с наличными. Рассрочка на $2000–5000 за PPF — редкость. Клиент либо отказывается, либо идёт к другим.' },
      { n: '04', h: 'Непонятно, что происходит с машиной', p: 'Отдал машину — и тишина. Когда готово? Что сделали? Где она сейчас? Всё только через звонки.' },
    ],
    shop: [
      { n: '01', h: '67% звонков остаются без ответа', p: 'Мастера заняты руками — не могут взять трубку. Клиент звонит конкуренту. Средний шоп теряет 13–20 звонков в день. При среднем чеке $1500 это $20–30K потенциальной выручки ежедневно.' },
      { n: '02', h: 'Нет своего канала привлечения', p: 'Google Maps, Yelp — это чужие платформы. Шоп зависит от их алгоритмов и платных отзывов. Своей базы клиентов нет. Повторный визит — снова случайность.' },
      { n: '03', h: 'Всё вручную — блокноты, звонки, мессенджеры', p: 'Запись клиентов, напоминания, выставление счетов — вручную. Теряются заявки, забываются клиенты, нет аналитики. Сколько шоп заработал в прошлом месяце — часто никто не знает точно.' },
      { n: '04', h: 'Деньги приходят через недели', p: 'Страховые компании платят через 30–60 дней. Шоп сделал работу сегодня, а деньги увидит через два месяца. Это убивает кэшфлоу и не даёт расти.' },
    ],
  }
  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Рынок · Проблема</div>
      <h2 className="ed-title">Проблема двух сторон</h2>
      <p className="ed-lead">
        Клиент не может найти нормальный шоп и не знает цену. Шоп не успевает отвечать на звонки и теряет половину клиентов. Обе стороны страдают каждый день.
      </p>

      <div className="scale-callout">
        <div className="scale-callout-num">$20–30K</div>
        <div className="scale-callout-text">потенциальной выручки теряет средний шоп каждый день из-за пропущенных звонков. За год — $7–11M упущенных возможностей на один шоп.</div>
      </div>

      <div className="prob-split">
        <div>
          <div className="prob-group-label">Клиент-автовладелец</div>
          <div className="prob-cards">
            {problems.client.map((p, i) => (
              <motion.div key={i} className="prob-card"
                initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}>
                <span className="prob-num">{p.n}</span>
                <div><h4>{p.h}</h4><p>{p.p}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <div className="prob-group-label">Автосервис / шоп</div>
          <div className="prob-cards">
            {problems.shop.map((p, i) => (
              <motion.div key={i} className="prob-card"
                initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}>
                <span className="prob-num">{p.n}</span>
                <div><h4>{p.h}</h4><p>{p.p}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="ed-pullquote">
        Carreta решает это для обеих сторон одновременно — и именно поэтому работает сетевой эффект: больше клиентов привлекает шопы, больше шопов привлекает клиентов.
      </div>
    </div>
  )
}

function Slide13Competitors() {
  const stats = [
    { val: '$12B', label: 'авторынок детейлинга США 2025' },
    { val: '$22B', label: 'прогноз к 2035 году' },
    { val: '6.4%', label: 'ежегодный рост CAGR' },
    { val: '0', label: 'Uber-модель для PPF/tint/wrap — ещё никто не сделал' },
  ]
  const competitors = [
    {
      name: 'YourMechanic',
      badge: 'Поглощён / проблемы', badgeColor: '#B94040',
      text: 'Y Combinator, Andreessen Horowitz, SoftBank. Создан в 2012. Серия судебных исков, проблемы с безопасностью мастеров. Поглощён Wrench в 2022.',
      lesson: 'Нанимал мастеров как самозанятых, но фактически управлял ими как сотрудниками — это привело к искам. Отношения с шопами важно выстроить юридически правильно с первого дня.',
    },
    {
      name: 'Wrench Inc.',
      badge: 'Фактически мёртв', badgeColor: '#B94040',
      text: 'Seattle. Купил YourMechanic, Lemon Squad, Fiix, Otobots. Пытался владеть мастерами и инструментами. Модель "mobile shop without walls".',
      lesson: 'Когда компания владеет шопами — она несёт все их риски. Carreta выбрала агрегаторную модель правильно: как Uber не содержит машин.',
    },
    {
      name: 'ServiceUp',
      badge: 'Живой / $70M поднято', badgeColor: '#2A7A3B',
      text: 'Los Gatos, CA. $55M Series B (2025). Начал как B2C ремонт, переключился в B2B — флиты и страховые. 50+ клиентов: Zipcar, Kyte, Clearcover.',
      lesson: 'B2C-авторемонт сложно монетизировать. ServiceUp ушёл в B2B. Carreta фокусируется на premium-услугах (PPF/wrap/coating) с чеком в 3–5 раз выше — другая экономика.',
    },
    {
      name: 'Openbay',
      badge: 'Живой, маленький', badgeColor: '#7A7875',
      text: 'Маркетплейс шопов с 2012. Соединяет клиентов с рейтинговыми шопами. Нет мобильных услуг. Нет AI. Нет GPS-трекинга.',
      lesson: 'Классическая "доска объявлений" — без умного подбора, без автоматизации. Устаревший UX. Нет ни одного wow-момента для клиента.',
    },
    {
      name: 'RepairPal',
      badge: 'Живой, нишевой', badgeColor: '#7A7875',
      text: 'С 2007. Сеть сертифицированных шопов + калькулятор цен. Партнёрство с USAA и CarMax. Фокус на ремонте, не на premium-услугах.',
      lesson: 'Сильная модель доверия — сертификация шопов. Carreta должна создать аналогичную систему верификации, но для другого сегмента.',
    },
    {
      name: 'RepairSmith (AutoNation)',
      badge: 'Живой, корпоративный', badgeColor: '#7A7875',
      text: 'LA, 2018. Куплен AutoNation. Мобильные механики в штате компании. 650+ городов. Высокие операционные расходы.',
      lesson: 'Сотрудники в штате — предсказуемое качество, но огромные затраты. Carreta как агрегатор не несёт этих расходов.',
    },
    {
      name: 'Urable / ClickRez',
      badge: 'SaaS для шопов', badgeColor: '#6B3FA0',
      text: 'Программа для бронирования и CRM именно для PPF/tint/wrap/detailing шопов. Не маркетплейс — инструмент для отдельного шопа.',
      lesson: 'Шопы уже используют цифровые инструменты. Carreta может интегрироваться с ними или заменить — и они пойдут охотно.',
    },
    {
      name: 'ShowCar Franchise',
      badge: 'Франшиза', badgeColor: '#C8860A',
      text: 'Франшизная модель для PPF/tint/wrap/detailing. Мобильные ваны + шопы. CRM, маркетинг, обучение.',
      lesson: 'Подтверждает спрос на premium auto styling. Но франшиза — тяжёлая модель. Carreta легче: чистый агрегатор, нет инвестиций в физику.',
    },
  ]
  const insights = [
    { h: 'Все конкуренты — про ремонт.', t: 'Масляные замены, тормоза, диагностика. Средний чек $100–200. У Carreta средний чек $300–500 (PPF/wrap/coating). Это разные рынки.' },
    { h: 'Ремонт — необходимость, PPF — желание.', t: 'Клиент, которому нужен ремонт, несчастлив (машина сломалась). Клиент Carreta доволен — он улучшает машину. Другая психология означает выше retention и рекомендации.' },
    { h: 'Никто не сделал AI-диагностику для styling.', t: 'Сфотографировал машину — получил рекомендацию и цену. Это killer feature Carreta. Ни один конкурент не сделал этого для PPF/tint/wrap.' },
    { h: 'Ниша premium-детейлинга на агрегаторе свободна.', t: 'Ни один существующий маркетплейс не закрыл сегмент PPF, ceramic coating, vinyl wrap. Рынок уже есть ($12B), платформы нет.' },
    { h: 'First mover advantage — редкая возможность.', t: 'Обычно рынок уже занят. Здесь — нет. Тот, кто запустится первым и наберёт 500 шопов, создаст сетевой эффект, который конкурентам будет очень сложно догнать.' },
  ]
  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Рынок · Конкуренты</div>
      <h2 className="ed-title">Анализ конкурентов</h2>
      <p className="ed-lead">
        Рынок автодетейлинга в США — $12B в 2025, растёт до $22B к 2035. Ни один из существующих конкурентов не создал Uber-модель для premium-сегмента (PPF, tint, wrap, ceramic coating). Ниша свободна.
      </p>

      <div className="comp-stats">
        {stats.map((s, i) => (
          <motion.div key={i} className="comp-stat"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}>
            <span className="comp-stat-val">{s.val}</span>
            <span className="comp-stat-label">{s.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="comp-grid">
        {competitors.map((c, i) => (
          <motion.div key={i} className="comp-card"
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: (i % 2) * 0.07 }}>
            <div className="comp-card-head">
              <span className="comp-card-name">{c.name}</span>
              <span className="comp-badge" style={{ color: c.badgeColor, background: c.badgeColor + '18' }}>{c.badge}</span>
            </div>
            <p className="comp-card-text">{c.text}</p>
            <div className="comp-lesson"><strong>Урок:</strong> {c.lesson}</div>
          </motion.div>
        ))}
      </div>

      <WavyDivider />
      <div className="comp-section-title">Почему никто не создал «Uber для PPF/tint/wrap»</div>
      <div className="comp-insights">
        {insights.map((r, i) => (
          <motion.div key={i} className="comp-insight-row"
            initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.05 }}>
            <span className="comp-insight-n">{i + 1}</span>
            <div className="comp-insight-body">
              <strong>{r.h}</strong>
              <span>{r.t}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function Slide03Product() {
  const apps = [
    { n: '01', name: 'Приложение для клиента', who: 'Автовладелец', desc: 'Открыл — выбрал услугу — нашёл шоп рядом — оплатил картой. Видит, где машина, получает фото до/после. Как Uber, только для машины. iOS + Android.', type: 'iOS · Android' },
    { n: '02', name: 'Приложение для шопа', who: 'Мастер / владелец', desc: 'Входящие заявки приходят как уведомление. Принял заказ, выполнил — деньги приходят в тот же день. Никаких звонков, никаких счетов вручную. iOS + Android.', type: 'iOS · Android' },
    { n: '03', name: 'Личный кабинет шопа', who: 'Владелец сервиса', desc: 'Управляет профилем, прайсом, смотрит статистику — сколько заказов, сколько заработал, какой рейтинг. Всё в браузере, без установки приложений.', type: 'Браузер' },
    { n: '04', name: 'Панель управления Carreta', who: 'Команда Carreta', desc: 'Внутренний инструмент: проверяет шопы перед добавлением на платформу, смотрит показатели по всем городам, управляет выплатами и поддержкой.', type: 'Браузер' },
    { n: '05', name: 'Серверная часть', who: 'Всё держит вместе', desc: 'Мозг системы — обрабатывает заказы, двигает деньги, подбирает шоп для клиента, следит за безопасностью. Клиент его не видит, но без него ничего не работает.', type: 'Сервер' },
    { n: '06', name: 'AI-помощник', who: 'Клиент', desc: 'Сфотографировал машину — получил рекомендацию и цену. Или говорит голосом «хочу PPF на капот» — система сама оформляет заявку. Ни один конкурент этого не делает.', type: 'Встроен' },
  ]
  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Продукт · Обзор</div>
      <h2 className="ed-title">Что именно мы строим</h2>
      <p className="ed-lead">
        Не одно приложение, а шесть взаимосвязанных продуктов. Клиент видит только своё приложение — внутри целая экосистема, которая работает как единый механизм.
      </p>
      <div className="pgrid">
        {apps.map((a, i) => (
          <motion.div key={i} className="pgrid-card"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.06 }}>
            <div className="pgrid-top">
              <span className="pgrid-n">{a.n}</span>
              <span className="pgrid-type">{a.type}</span>
            </div>
            <h3 className="pgrid-name">{a.name}</h3>
            <div className="pgrid-who">{a.who}</div>
            <p className="pgrid-desc">{a.desc}</p>
          </motion.div>
        ))}
      </div>
      <div className="bm-strip">
        {[
          { label: 'Как зарабатывает', val: 'Комиссия 18% с каждого заказа + ежемесячная подписка от шопов' },
          { label: 'Мастера — не сотрудники', val: 'Работают как самозанятые. Carreta не несёт затрат на их содержание — как Uber не содержит водителей.' },
          { label: 'Деньги — не у Carreta', val: 'Оплата идёт через Stripe. Carreta получает только свою комиссию — риск неоплаты минимален.' },
        ].map((b, i) => (
          <div key={i} className="bm-strip-item">
            <span className="bm-strip-label">{b.label}</span>
            <span className="bm-strip-val">{b.val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Slide04Ecosystem() {
  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Продукт · Экосистема</div>
      <h2 className="ed-title">Экосистема платформы</h2>
      <p className="ed-lead">Carreta — чистая IT-платформа. Соединяет 6 групп участников и зарабатывает только комиссию — никаких собственных шопов, никаких техников в штате.</p>
      <div className="eco-wrap">
        <div className="eco-row eco-top">
          <div className="eco-label-row">СПРОС</div>
          <div className="eco-nodes">
            {[
              { title: 'B2C клиенты', sub: 'Автовладельцы' },
              { title: 'B2B / Флиты', sub: 'Uber, рент, дилеры' },
              { title: 'Подписчики', sub: 'Ежемесячный план' },
              { title: 'Клиенты страховых', sub: 'Страховые случаи' },
            ].map((n, i) => (
              <motion.div key={i} className="eco-node eco-node-client"
                initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}>
                {n.title}<span>{n.sub}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="eco-middle">
          <div className="eco-side eco-side-left">
            <div className="eco-label-side">ШОПЫ (ИСПОЛНИТЕЛИ)</div>
            {['Body shops', 'PPF / Tint / Wrap', 'Детейлинг', 'PDR / механики', 'Эвакуаторы'].map((t, i) => (
              <motion.div key={i} className="eco-node eco-node-provider"
                initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}>
                {t}
              </motion.div>
            ))}
          </div>

          <div className="eco-center-wrap">
            <div className="eco-arrows-v eco-arrows-top" />
            <div className="eco-arrows-h" />
            <div className="eco-center-node">
              <span className="eco-center-title">CARRETA</span>
              <span className="eco-center-sub">Только IT-платформа.<br />Только комиссия.</span>
            </div>
            <div className="eco-arrows-h" />
            <div className="eco-arrows-v eco-arrows-bot" />
          </div>

          <div className="eco-side eco-side-right">
            <div className="eco-label-side">ИНФРАСТРУКТУРА</div>
            {[
              { title: 'Платежи', sub: 'Stripe' },
              { title: 'Банки', sub: 'Быстрые выплаты' },
              { title: 'Страховые', sub: 'Гарантии + канал' },
              { title: 'Рассрочка', sub: 'Affirm / Klarna' },
            ].map((n, i) => (
              <motion.div key={i} className="eco-node eco-node-finance"
                initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}>
                {n.title}<span>{n.sub}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="eco-bottom">
          <div className="eco-bottom-group eco-bottom-full">
            <div className="eco-label-side">РОСТ (фаза 2–3)</div>
            <div className="eco-nodes eco-nodes-bottom">
              {[
                { title: 'Блогеры / TikTok', sub: 'Партнёрский маркетинг' },
                { title: 'Дилеры / HOA', sub: 'Корпоративные каналы' },
                { title: 'Франчайзи', sub: 'Масштабирование' },
                { title: 'OBD-устройства', sub: 'Наш продукт → лиды' },
              ].map((n, i) => (
                <motion.div key={i} className="eco-node eco-node-growth"
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}>
                  {n.title}<span>{n.sub}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="eco-footer-bar">
          6 аудиторий: клиенты → корпорации → шопы → страховые → финансовые партнёры → маркетинговые каналы
        </div>
      </div>
    </div>
  )
}

function Slide05OrderFlow() {
  const steps = [
    { n: 1, label: 'Клиент открывает приложение', sub: 'Выбирает тип услуги и город', color: 'oflow-client' },
    { n: 2, label: 'AI-ассистент уточняет детали', sub: 'Голос, текст или фото машины — получает рекомендацию', color: 'oflow-ai' },
    { n: 3, label: 'Система подбирает шоп', sub: 'Алгоритм выбирает лучший вариант по рейтингу и расстоянию', color: 'oflow-system' },
    { n: 4, label: 'Клиент видит цену и условия', sub: 'Прозрачная смета, рейтинг шопа, фото работ', color: 'oflow-client' },
    { n: 5, label: 'Оплата картой или Apple Pay', sub: 'Деньги замораживаются до завершения работы — шоп не получает, пока клиент не принял', color: 'oflow-ai' },
    { n: 6, label: 'Шоп получает заявку', sub: 'Уведомление + все детали заказа за секунды', color: 'oflow-shop' },
    { n: 7, label: 'Техник выезжает / принимает авто', sub: 'GPS-трекинг в реальном времени — клиент видит где машина', color: 'oflow-shop' },
    { n: 8, label: 'Работа выполнена — фото отчёт', sub: 'Фото до/после загружается в приложение, клиент получает уведомление', color: 'oflow-shop' },
    { n: 9, label: 'Клиент принимает работу', sub: 'Нажал "всё ок" в приложении — деньги разблокируются', color: 'oflow-client' },
    { n: 10, label: 'Автоматическая выплата', sub: 'Шоп получает деньги в ту же секунду. Carreta — свою комиссию.', color: 'oflow-ai' },
  ]
  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Продукт · Как работает</div>
      <h2 className="ed-title">Жизненный цикл заказа</h2>
      <p className="ed-lead">10 шагов от открытия приложения до выплаты шопу. Полностью автоматизировано — без звонков, без наличных, без ручной записи.</p>
      <div className="oflow-wrap">
        <div className="oflow">
          {steps.map((s, i) => (
            <motion.div key={i} className={`oflow-step ${s.color}`}
              initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.04 }}>
              <span className="oflow-num">{s.n}</span>
              <div className="oflow-body">
                <strong>{s.label}</strong>
                <span>{s.sub}</span>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="oflow-split">
          <div className="oflow-split-box oflow-split-carreta">
            <strong>15–25%</strong><span>Carreta — с каждого заказа</span>
          </div>
          <div className="oflow-split-box oflow-split-shop">
            <strong>70–80%</strong><span>Шоп — выплата в тот же день</span>
          </div>
          <div className="oflow-split-box oflow-split-fund">
            <strong>2–5%</strong><span>Резерв на спорные ситуации</span>
          </div>
        </div>
        <div className="oflow-footer">
          Весь цикл: 15 минут (детейлинг) — 5 дней (кузовной ремонт)
        </div>
      </div>
    </div>
  )
}

function Slide06Monetization() {
  const streams = [
    [1, 'Комиссия с услуг', 'Клиент', '15–25% с каждой сделки', 'MVP'],
    [2, 'Подписка клиента', 'Клиент', '$9.99–59.99/мес', 'MVP'],
    [3, 'Подписка шопа', 'Шоп', '$99–299/мес за профиль', 'MVP'],
    [4, 'Реклама в приложении', 'Шопы / бренды', 'Sponsored размещения', 'Фаза 2'],
    [5, 'Реферал на рассрочку', 'Партнёр рассрочки', '1–3% реферальная', 'Фаза 2'],
    [6, 'Микрострахование', 'Клиент', '$12–20/мес (колёса, стекло)', 'Фаза 2'],
    [7, 'Франшизы', 'Франчайзи', 'Вступительный + 15% выручки', 'Фаза 3'],
    [8, 'OBD-устройства', 'Клиент', 'Продажа + подписка', 'Фаза 2'],
    [9, 'Маржа на материалах', 'Клиент (через шоп)', 'Оптовые закупки', 'Фаза 3'],
    [10, 'Монетизация данных', 'B2B-клиенты', 'Анонимная аналитика', 'Фаза 3'],
    [11, 'Shop Management SaaS', 'Внешние шопы', '$149–399/мес за белый ярлык', 'Фаза 3'],
  ]
  const risks = [
    { type: 'Качество работы', who: 'GL-страховка шопа', how: 'Обязательная страховка при регистрации + рейтинговая система' },
    { type: 'Повреждение при транспортировке', who: 'Транзит-страховая', how: 'Транзит-полис включён в стоимость' },
    { type: 'Неоплата / отмена платежа', who: 'Stripe', how: 'Деньги замораживаются до завершения. Спорные ситуации — на стороне Stripe' },
    { type: 'Трудовые споры', who: 'Не применимо', how: 'Все шопы — самостоятельные ИП, не сотрудники Carreta' },
  ]

  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Продукт · Бизнес-модель</div>
      <h2 className="ed-title">Монетизация</h2>
      <p className="ed-lead">Не один поток дохода, а 11 — запускаются последовательно по фазам. Уже с первого дня MVP работают три потока. В Фазе 3 инфраструктура Carreta монетизируется как отдельный SaaS для шопов за пределами платформы.</p>

      <div className="scale-callout" style={{ marginBottom: '2rem' }}>
        <div className="scale-callout-num">$73M+</div>
        <div className="scale-callout-text">годовой доход Carreta при 500 шопах на платформе и 2 000 заказах в день. Это реальная цель на 18–24 месяца после запуска в 3–5 городах.</div>
      </div>

      <div className="mono-grid">
        <div>
          <div className="mono-sub">10 источников дохода</div>
          <div className="rev-table-wrap">
            <table className="rev-table">
              <thead><tr><th>#</th><th>Источник</th><th>Кто платит</th><th>Модель</th><th>Фаза</th></tr></thead>
              <tbody>
                {streams.map(([n, src, who, model, phase]) => (
                  <tr key={n}>
                    <td className="rev-n">{n}</td>
                    <td>{src}</td>
                    <td className="rev-who">{who}</td>
                    <td className="rev-model">{model}</td>
                    <td><span className={`rev-phase rev-phase-${phase === 'MVP' ? 'mvp' : phase === 'Фаза 2' ? 'p2' : 'p3'}`}>{phase}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <div className="mono-sub">Риски Carreta — нулевые</div>
          <div className="risk-grid">
            {risks.map((r, i) => (
              <motion.div key={i} className="risk-card"
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}>
                <div className="risk-type">{r.type}</div>
                <div className="risk-who">{r.who}</div>
                <div className="risk-how">{r.how}</div>
                <div className="risk-badge">Carreta не несёт</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Slide10Infra() {
  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Разработка · Архитектура</div>
      <h2 className="ed-title">IT-архитектура</h2>
      <p className="ed-lead">Современный стек без экзотики. Проверенные технологии — те же, на которых работают Airbnb, Lyft, DoorDash. Масштабируются от 100 до 1 000 000 пользователей без переписывания.</p>
      <div className="arch-diagram">
        <motion.div className="arch-layer"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <div className="arch-layer-label arch-label-blue">ПРИЛОЖЕНИЯ (то, что видит пользователь)</div>
          <div className="arch-layer-row">
            <div className="arch-box arch-box-blue">
              <div className="arch-box-title">Приложение клиента</div>
              <div className="arch-box-tags"><span>iOS</span><span>Android</span><span>Web</span></div>
              <div className="arch-box-note">Заказ, оплата, GPS, AI-ассистент</div>
            </div>
            <div className="arch-box arch-box-blue">
              <div className="arch-box-title">Приложение шопа</div>
              <div className="arch-box-tags"><span>iOS</span><span>Android</span><span>Web</span></div>
              <div className="arch-box-note">Входящие заявки, статус, выплаты</div>
            </div>
          </div>
        </motion.div>
        <div className="arch-connector" />
        <motion.div className="arch-layer"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="arch-layer-label arch-label-purple">СЕРВЕРНАЯ ЧАСТЬ (невидимый мозг системы)</div>
          <div className="arch-layer-row">
            <div className="arch-box arch-box-purple arch-box-wide">
              <div className="arch-box-title">Carreta Backend — центральный сервер</div>
              <div className="arch-box-modules">
                {['Авторизация', 'Заказы', 'Подбор шопа', 'Оплата', 'GPS-трекинг', 'AI-ассистент', 'Фото-диагностика', 'Рейтинги', 'Уведомления', 'Аналитика'].map((m, i) => (
                  <span key={i} className="arch-module">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
        <div className="arch-connector" />
        <motion.div className="arch-layer"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
          <div className="arch-layer-label arch-label-green">КАБИНЕТЫ УПРАВЛЕНИЯ</div>
          <div className="arch-layer-row">
            {[
              { name: 'Admin-панель Carreta', note: 'Все города, все шопы, все деньги' },
              { name: 'Кабинет шопа', note: 'Профиль, прайс, статистика' },
              { name: 'Портал партнёров', note: 'Страховые, франчайзи' },
            ].map((b, i) => (
              <div key={i} className="arch-box arch-box-green">
                <div className="arch-box-title">{b.name}</div>
                <div className="arch-box-note">{b.note}</div>
              </div>
            ))}
          </div>
        </motion.div>
        <div className="arch-connector" />
        <motion.div className="arch-layer"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
          <div className="arch-layer-label arch-label-grey">ВНЕШНИЕ СЕРВИСЫ (готовые решения, не надо строить)</div>
          <div className="arch-layer-row arch-layer-chips">
            {[
              { name: 'Stripe', note: 'Платежи' },
              { name: 'Twilio', note: 'SMS / звонки' },
              { name: 'Google Maps', note: 'GPS / карты' },
              { name: 'Claude / GPT', note: 'AI-ассистент' },
              { name: 'Firebase', note: 'Push-уведомления' },
              { name: 'Affirm', note: 'Рассрочка' },
            ].map((chip, i) => (
              <div key={i} className="arch-chip-wrap">
                <span className="arch-chip">{chip.name}</span>
                <span className="arch-chip-note">{chip.note}</span>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div className="arch-footer"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}>
          Итого: 2 мобильных приложения + 4 веб-кабинета + 1 сервер + 6 интеграций = полная платформа
          <span className="prob-tag" style={{ marginLeft: '1rem' }}>Весь код принадлежит Carreta — IP Assignment подписывается до первой строки кода</span>
        </motion.div>
      </div>
    </div>
  )
}

function Slide07Phases() {
  const phases = [
    {
      n: '01', title: 'Найм команды', weeks: '1–6 нед',
      desc: 'Поиск и отбор всей команды.',
      items: [
        'Публикация JD для 8+ ролей в первую неделю',
        'Скрининг 100+ кандидатов',
        'Технические интервью с тестовыми заданиями',
        'NDA + IP Assignment подписывается до первой задачи',
        '2-недельный платный тестовый спринт перед полным контрактом',
        'Настройка окружения разработки, доступы, инфраструктура',
      ],
      analogy: 'Подобрать бригаду',
    },
    {
      n: '02', title: 'Discovery и архитектура', weeks: '1–6 нед',
      desc: 'Полное техническое задание на весь продукт.',
      items: [
        'Документ требований 50+ страниц — все функции, сценарии, исключения',
        'Схема базы данных (50+ таблиц)',
        'API-контракты (100+ эндпоинтов)',
        'Пользовательские сценарии для всех 4 типов пользователей',
        'Wireframes ключевых потоков (30+ экранов)',
        'Модель стоимости инфраструктуры ($X/мес при 10K, $Y при 100K пользователях)',
      ],
      analogy: 'Чертёж дома',
    },
    {
      n: '03', title: 'UX/UI дизайн', weeks: '4–12 нед',
      desc: 'Полноценный дизайн всех приложений и кабинетов.',
      items: [
        '100+ экранов по всем приложениям и кабинетам',
        'Дизайн-система: цвета, типографика, компоненты',
        'Соответствие iOS HIG и Android Material 3',
        'Интерактивный прототип в Figma',
        '2 раунда согласования с клиентом',
        'Передача дизайна разработчикам с полной документацией',
      ],
      analogy: 'Дизайн интерьера',
    },
    {
      n: '04', title: 'Бэкенд', weeks: '6–16 нед',
      desc: 'Серверная часть — мозг всей платформы.',
      items: [
        'Авторизация, роли, безопасность (JWT, OAuth)',
        'Управление заказами: создание, статусы, история',
        'Система подбора шопа (алгоритм по рейтингу, расстоянию, свободным слотам)',
        'Интеграция платежей через Stripe Connect',
        'GPS-трекинг в реальном времени',
        'Push-уведомления, SMS, чат между клиентом и шопом',
        'Рейтинги, отзывы, верификация шопов',
        'Аналитические дашборды',
      ],
      analogy: 'Фундамент',
    },
    {
      n: '05', title: 'Мобильные приложения', weeks: '10–24 нед',
      desc: 'Два приложения для клиентов и шопов — iOS + Android.',
      items: [
        'Приложение клиента: 40+ экранов — поиск, заказ, оплата, трекинг, история',
        'Приложение шопа: 25+ экранов — очередь заявок, статус, выплаты',
        'Offline-режим для основных потоков',
        'Apple Pay + Google Pay',
        'Push-уведомления, deep linking',
        'Соответствие требованиям App Store и Google Play',
      ],
      analogy: 'Стены',
    },
    {
      n: '06', title: 'Веб-кабинеты', weeks: '12–24 нед',
      desc: 'Управление платформой через браузер.',
      items: [
        'Личный кабинет шопа: профиль, прайс, аналитика, заявки',
        'Admin-панель Carreta: все шопы, все заказы, все выплаты',
        'Портал страховых партнёров',
        'Портал франчайзи (фаза 2)',
        'Веб-версия приложения для клиентов',
      ],
      analogy: 'Отделка',
    },
    {
      n: '07', title: 'AI + интеграции', weeks: '16–26 нед',
      desc: 'Умные функции, которые отличают Carreta от всех конкурентов.',
      items: [
        'AI-ассистент: текстовый чат (Claude/GPT)',
        'Голосовой ввод — "хочу PPF на капот"',
        'Фото-диагностика — сфотографировал → получил рекомендацию и цену',
        'Stripe Connect полная настройка — онбординг шопов, split-платежи',
        'Google Maps — поиск, маршруты, трекинг',
        'Twilio — SMS и звонки',
        'Affirm/Klarna — рассрочка для дорогих услуг',
      ],
      analogy: 'Умный дом',
    },
    {
      n: '08', title: 'Тестирование и запуск', weeks: '24–40 нед',
      desc: 'Beta, нагрузочное тестирование, App Store, production.',
      items: [
        'Beta с 20–50 реальными шопами — собираем отзывы',
        '500+ автоматических тестов на все критические сценарии',
        'Нагрузочное тестирование (до 10K одновременных пользователей)',
        'Аудит безопасности',
        'Подача в App Store и Google Play — сопровождение через review',
        'Деплой на production с мониторингом 24/7',
        'Запуск в первых 3 городах',
      ],
      analogy: 'Приёмка объекта',
    },
  ]
  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Разработка · Этапы</div>
      <h2 className="ed-title">Этапы разработки</h2>
      <p className="ed-lead">8 фаз с чёткими результатами на каждой. Многие идут параллельно — поэтому общий срок 9–11 месяцев, а не сумма всех недель. На каждом этапе вы знаете, что сделано и что будет дальше.</p>
      <div className="phases-grid">
        {phases.map((ph, i) => (
          <motion.div key={i} className="phase-card"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.05 }}>
            <div className="phase-top">
              <span className="phase-n">{ph.n}</span>
              <span className="phase-weeks">{ph.weeks}</span>
            </div>
            <h3 className="phase-title">{ph.title}</h3>
            <p className="phase-desc">{ph.desc}</p>
            <ul className="phase-items">
              {ph.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
            <div className="phase-analogy">{ph.analogy}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function Slide11Process() {
  const principles = [
    {
      n: '01', title: 'Полная прозрачность',
      text: 'Каждую неделю — письменный отчёт: что сделано, что планируется, что застряло. Каждый месяц — живое демо продукта. Вы видите, за что платите, ещё до следующего платежа.',
      detail: 'Доступ к репозиторию кода, проектной доске и системе задач — в любой момент.',
    },
    {
      n: '02', title: 'Оплата помесячно',
      text: 'Не вся сумма вперёд. Фиксированный ежемесячный платёж. Каждый месяц — конкретный результат. Нет результата — нет оплаты.',
      detail: 'Первый платёж — после подписания договора. Второй — после первого демо. Дальше — ежемесячно.',
    },
    {
      n: '03', title: 'Мы партнёры, не подрядчики',
      text: 'Нас интересует успех Carreta. Мы не "сделаем и уйдём". Развиваем платформу вместе, думаем о вашем росте, предупреждаем о рисках, которые вы ещё не видите.',
      detail: 'Участвуем в стратегических решениях. Если видим лучший путь — говорим прямо.',
    },
    {
      n: '04', title: 'Защита интеллектуальной собственности',
      text: 'Весь код принадлежит Carreta. NDA и IP Assignment подписываются до первой строки кода. Вы всегда можете передать кодовую базу другой команде.',
      detail: 'Каждый разработчик подписывает соглашение индивидуально. Нет исключений.',
    },
  ]
  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Разработка · Процесс</div>
      <h2 className="ed-title">Как мы работаем</h2>
      <p className="ed-lead">Четыре принципа, которые превращают разработку из лотереи в управляемый процесс. Вы всегда знаете, что происходит.</p>
      <div className="hwgrid">
        {principles.map((hw, i) => (
          <motion.div key={i} className="hwc"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
            <span className="hwc-n">{hw.n}</span>
            <h3 className="hwc-title">{hw.title}</h3>
            <p className="hwc-text">{hw.text}</p>
            <p className="hwc-detail">{hw.detail}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function Slide08Pricing() {
  const [tab, setTab] = useState('b')
  const active = plans.find(p => p.id === tab)
  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Стоимость · Варианты</div>
      <h2 className="ed-title">Стоимость разработки</h2>
      <p className="ed-lead">4 варианта — от полностью US-агентства (рыночный ориентир) до гибридной модели с CA-тимлидами. Рекомендуем Standard.</p>

      <div className="plgrid">
        {plans.map(pl => (
          <button key={pl.id}
            onClick={() => setTab(pl.id)}
            className={`plc${pl.rec ? ' rec' : ''}${pl.ref ? ' ref-plan' : ''}${tab === pl.id ? ' act' : ''}`}>
            {pl.rec && <span className="pl-rec-badge">Рекомендован</span>}
            <div className="plc-name">{pl.name}</div>
            <div className="plc-price" style={{ color: pl.color }}>{pl.price}</div>
            <div className="plc-mo">{pl.mo}</div>
            {pl.level && <div className="pl-level" style={{ borderColor: pl.color, color: pl.color }}>{pl.level}</div>}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} className="plan-detail"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
          <div className="plan-detail-grid">
            <div className="plan-detail-meta">
              {[
                { l: 'Бюджет', v: active.price, bold: true },
                { l: 'Ежемесячный платёж', v: active.mo },
                { l: 'Срок до production', v: active.time },
                { l: 'Команда', v: active.team },
                { l: 'Локация', v: active.where },
              ].map((m, i) => (
                <div key={i} className="plan-detail-row">
                  <span className="plan-detail-label">{m.l}</span>
                  <span className="plan-detail-val" style={m.bold ? { color: active.color, fontWeight: 700 } : {}}>{m.v}</span>
                </div>
              ))}
              {active.levelNote && <div className="plan-detail-note">{active.levelNote}</div>}
            </div>
            <div className="plan-detail-features">
              <div className="plan-detail-features-title">Что включено</div>
              {active.features.map((f, i) => (
                <div key={i} className="plan-feature-row">
                  <span className="plan-feature-dot" style={{ background: active.color }} />
                  {f}
                </div>
              ))}
              <div className="plan-detail-for">{active.for}</div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="ctable-wrap">
        <table className="ctable">
          <thead>
            <tr>
              <th></th>
              {plans.map(pl => (
                <th key={pl.id} style={{ color: pl.color }}
                  className={tab === pl.id ? 'ctable-active' : ''}>
                  {pl.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.map((row, i) => (
              <tr key={i}>
                <td className="ctable-label">{row.label}</td>
                {['us', 'a', 'b', 'c'].map(id => (
                  <td key={id} className={tab === id ? 'ctable-active' : ''}>{row[id]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Slide09Market() {
  const cols = [
    {
      id: 'us', label: 'US-only', tag: 'Для сравнения', sub: 'Полностью американская команда',
      price: '$1.2M — $2.0M', color: '#B94040', tagBg: 'rgba(185,64,64,0.08)', tagColor: '#B94040',
      rows: [
        { role: 'Senior backend', val: '$14–18K/мес' },
        { role: 'Senior mobile', val: '$14–18K/мес' },
        { role: 'Frontend', val: '$12–15K/мес' },
        { role: 'UI/UX', val: '$10–14K/мес' },
        { role: 'DevOps', val: '$12–16K/мес' },
        { role: 'QA', val: '$8–12K/мес' },
        { role: 'AI/ML', val: '$16–22K/мес' },
        { role: 'PM', val: '$10–15K/мес' },
      ],
      footer: [
        { label: 'Зарплаты/мес', val: '$96–130K', bold: true },
        { label: 'Markup агентства', val: '+30–50%', accent: '#B94040' },
      ],
    },
    {
      id: 'hybrid', label: 'Гибрид (наш план)', tag: 'Standard + Premium',
      sub: 'CA тимлиды + Mid+/Senior из Восточной Европы',
      price: '$450K — $1.2M', priceSub: 'Standard $450K–$700K / Premium $700K–$1.2M',
      color: '#1A9D8A', tagBg: 'rgba(26,157,138,0.08)', tagColor: '#1A9D8A',
      highlight: true,
      rows: [
        { role: 'Senior backend', val: '$3.5–5K/мес' },
        { role: 'Senior mobile', val: '$3.5–5K/мес' },
        { role: 'Frontend', val: '$2.5–4K/мес' },
        { role: 'UI/UX', val: '$2–3.5K/мес' },
        { role: 'DevOps', val: '$2.5–3.5K/мес' },
        { role: 'QA', val: '$1.5–2.5K/мес' },
        { role: 'AI/ML', val: '$4–6K/мес' },
        { role: 'PM / тимлиды', val: 'Доля в проекте (партнёры)' },
      ],
      footer: [
        { label: 'Зарплаты/мес', val: '$20–30K', bold: true },
        { label: 'Markup', val: '0%', accent: '#2A7A3B' },
      ],
    },
    {
      id: 'economy', label: 'Economy', tag: 'Минимальный бюджет',
      sub: 'CA oversight + Middle-специалисты из СНГ',
      price: '$350K — $500K', priceSub: 'Срок 12–16 мес, уровень Middle',
      color: '#9A8B5A', tagBg: 'rgba(154,139,90,0.08)', tagColor: '#9A8B5A',
      rows: [
        { role: 'Backend (Middle)', val: '$2–3.5K/мес' },
        { role: 'Mobile (Middle)', val: '$2–3.5K/мес' },
        { role: 'Frontend', val: '$1.5–3K/мес' },
        { role: 'UI/UX', val: '$1.5–2.5K/мес' },
        { role: 'DevOps', val: '$1.5–2.5K/мес' },
        { role: 'QA', val: '$1–1.5K/мес' },
        { role: 'AI/ML (базовый)', val: '$2–3.5K/мес' },
        { role: 'PM', val: '$2–3K/мес' },
      ],
      footer: [
        { label: 'Зарплаты/мес', val: '$14–23K', bold: true },
        { label: 'Срок', val: '12–16 мес', accent: '#9A8B5A' },
      ],
    },
  ]
  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Стоимость · Обоснование</div>
      <h2 className="ed-title">Почему такая разница в цене</h2>
      <p className="ed-lead">
        Senior-разработчик в Калифорнии стоит $150–200K в год. Тот же уровень из Украины, Беларуси, Грузии — $40–60K в год. Разница в 3–4 раза на каждом человеке, умноженная на 7–8 специалистов и 10 месяцев — вот откуда берётся экономия $600K–$1.2M.
      </p>
      <div className="rate-grid">
        {cols.map((col, i) => (
          <motion.div key={col.id} className={`rate-col${col.highlight ? ' rate-col-hl' : ''}`}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.1 }}>
            <div className="rate-col-head">
              <span className="rate-tag" style={{ color: col.tagColor, background: col.tagBg }}>{col.tag}</span>
              <h3 className="rate-col-title">{col.label}</h3>
              <p className="rate-col-sub">{col.sub}</p>
              <div className="rate-col-price" style={{ color: col.color }}>{col.price}</div>
              {col.priceSub && <div className="rate-col-price-sub">{col.priceSub}</div>}
            </div>
            <div className="rate-rows">
              {col.rows.map((r, j) => (
                <div key={j} className="rate-row">
                  <span className="rate-role">{r.role}</span>
                  <span className="rate-val">{r.val}</span>
                </div>
              ))}
            </div>
            <div className="rate-footer">
              {col.footer.map((f, j) => (
                <div key={j} className="rate-footer-row">
                  <span>{f.label}</span>
                  <span style={{ fontWeight: f.bold ? 700 : 500, color: f.accent || 'var(--fg)' }}>{f.val}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mkt-bars" style={{ marginTop: '2rem' }}>
        <MktBar label="US-агентство (SF / NY)" value="$1.2M — $2.0M" pct={100} color="#B94040" note="Senior в SF = $150–250/час + markup агентства 30–50%" />
        <MktBar label="Наш план Premium — CA + US + СНГ Senior" value="$700K — $1.2M" pct={60} color="#C8860A" note="Все Senior, US-специалисты на AI/ML. Максимальная скорость." />
        <MktBar label="Наш план Standard — CA тимлиды + СНГ Senior/Mid+" value="$450K — $700K" pct={42} color="#1A9D8A" note="CA тимлиды + Senior/Mid+ из Восточной Европы. Рекомендованный. Экономия 60–70% vs US." />
        <MktBar label="Наш план Economy — CA oversight + СНГ Middle" value="$350K — $500K" pct={28} color="#9A8B5A" note="Middle-специалисты, срок 12–16 мес. Минимальный бюджет с контролем качества." />
      </div>
      <div className="ed-pullquote">
        GitLab, WhatsApp, Grammarly — все строились командами из Восточной Европы. Гибридная модель даёт тот же результат за $450K–$700K. Если бы вы пошли в агентство в LA или NY — вам бы выставили минимум $1.2–2M.
      </div>

      <div className="rate-note-box">
        <div className="rate-note-title">Как связаны ежемесячный платёж и срок</div>
        <div className="rate-note-row">
          <span className="rate-note-tag" style={{ background: 'rgba(200,134,10,0.10)', color: '#C8860A' }}>Premium $85–130K/мес</span>
          <span className="rate-note-arrow">→</span>
          <span>7–9 мес — большая команда работает параллельно, меньше ожидания</span>
        </div>
        <div className="rate-note-row">
          <span className="rate-note-tag" style={{ background: 'rgba(26,157,138,0.10)', color: '#1A9D8A' }}>Standard $48–65K/мес</span>
          <span className="rate-note-arrow">→</span>
          <span>9–11 мес — оптимальный баланс стоимости и скорости</span>
        </div>
        <div className="rate-note-row">
          <span className="rate-note-tag" style={{ background: 'rgba(154,139,90,0.10)', color: '#9A8B5A' }}>Economy $25–35K/мес</span>
          <span className="rate-note-arrow">→</span>
          <span>12–16 мес — меньше людей в параллели = дольше. Одинаковый результат, другая скорость</span>
        </div>
        <div className="rate-note-footer">Меньше ежемесячный платёж — меньше команда — дольше срок. Общий бюджет при этом остаётся примерно одинаковым.</div>
      </div>
    </div>
  )
}

function Slide12CTA() {
  return (
    <div className="slide-cta">
      <div className="slide-cta-inner">
        <div className="cta-eyebrow">Castells Media, Inc. · Roseville, CA</div>
        <h2 className="cta-title">Готовы начать</h2>
        <p className="cta-lead">
          Обсудим детали, согласуем вариант и определим старт. Встреча занимает 60–90 минут.
        </p>

        <div className="cta-scale-row">
          {[
            { n: '500', label: 'шопов на платформе — цель 18 месяцев' },
            { n: '$73M+', label: 'годовой доход Carreta при этом масштабе' },
            { n: '3→50', label: 'городов — от запуска до экспансии' },
          ].map((s, i) => (
            <div key={i} className="cta-scale-item">
              <span className="cta-scale-n">{s.n}</span>
              <span className="cta-scale-l">{s.label}</span>
            </div>
          ))}
        </div>

        <WavyDivider />

        <div className="cta-validity">
          Предложение действительно <strong>30 дней.</strong> Ставки растут на <strong>5–10% в год.</strong>
        </div>
        <div className="cta-contact-block">
          <a href="mailto:contact@castells.media" className="cta-contact-link">contact@castells.media</a>
        </div>
      </div>
    </div>
  )
}

// ─── NEW SLIDES FROM ANALYSIS ─────────────────────────────────────────────────

function SlideMarketSize() {
  const segments = [
    { name: 'Мойка и детейлинг', size: '$20,2 млрд', cagr: '4,7–5,9%', y2030: '$25+ млрд', note: 'Самый массовый сегмент — миллионы клиентов' },
    { name: 'Vinyl wrap', size: '$1,5–1,7 млрд', cagr: '18,8%', y2030: '~$4,1 млрд', note: 'Самый быстрорастущий — кастомизация и реклама на авто' },
    { name: 'Тонировка стёкол', size: '$2,0–2,5 млрд', cagr: '7,7%', y2030: '~$3,5 млрд', note: 'Стабильный спрос, особенно в южных штатах' },
    { name: 'Ceramic coating', size: '$700 млн – $1 млрд', cagr: '8,1%', y2030: '~$1,5 млрд', note: 'Защита кузова — растущий тренд у новых авто' },
    { name: 'PPF (защитная плёнка)', size: '$110–115 млн', cagr: '6,2%', y2030: '~$158 млн', note: 'Премиальный сегмент — средний чек $2 000–7 000' },
  ]
  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Рынок · Размер</div>
      <h2 className="ed-title">Рынок $435 миллиардов</h2>
      <p className="ed-lead">
        Американцы тратят $435 млрд в год на обслуживание своих машин — это больше, чем весь рынок смартфонов в США. На дорогах 289 миллионов автомобилей со средним возрастом почти 13 лет. Каждое из этих авто нуждается в регулярном уходе. Carreta работает в самом быстрорастущем кармане этого рынка.
      </p>

      <div className="scale-callout">
        <div className="scale-callout-num">$24–25B</div>
        <div className="scale-callout-text">именно столько стоит сегмент "красоты и защиты" — PPF, тонировка, vinyl wrap, ceramic coating, детейлинг. И он растёт до $30+ млрд к 2030 году. Carreta работает здесь — не в сегменте замены масла.</div>
      </div>

      <div className="an-table-wrap">
        <div className="an-table-title">Сегменты рынка — где работает Carreta</div>
        <table className="an-table">
          <thead>
            <tr>
              <th>Сегмент</th>
              <th>Объём сейчас</th>
              <th>Рост/год</th>
              <th>К 2030</th>
              <th>Что это такое</th>
            </tr>
          </thead>
          <tbody>
            {segments.map((s, i) => (
              <tr key={i}>
                <td className="an-td-name">{s.name}</td>
                <td className="an-td-num">{s.size}</td>
                <td className="an-td-cagr" style={{ color: i === 1 ? 'var(--green)' : 'var(--fg)' }}>{s.cagr}</td>
                <td className="an-td-num">{s.y2030}</td>
                <td className="an-td-note">{s.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <WavyDivider />

      <div className="market-miami-grid">
        <div className="market-miami-card">
          <div className="market-miami-title">Майами — первый город запуска</div>
          {[
            { n: '2,1M', l: 'зарегистрированных авто в Miami-Dade' },
            { n: '4,7–5,2M', l: 'авто в трёх округах (Miami-Dade + Broward + Palm Beach)' },
            { n: 'каждый 5-й', l: 'проданный автомобиль в Майами — люксовый' },
            { n: '400–600+', l: 'действующих мастерских детейлинга и защитных покрытий' },
            { n: '$68 694', l: 'медианный доход домохозяйства — выше у приезжих и на побережье' },
          ].map((s, i) => (
            <div key={i} className="market-miami-row">
              <span className="market-miami-n">{s.n}</span>
              <span className="market-miami-l">{s.l}</span>
            </div>
          ))}
        </div>
        <div className="market-miami-card">
          <div className="market-miami-title">Тренды, которые работают на нас</div>
          {[
            { icon: '↑', text: 'Vinyl wrap растёт на 18,8% в год — самый быстрый сегмент на рынке', bold: true },
            { icon: '↑', text: 'Tesla и EV — 39 000 новых электромобилей в Miami DMA в 2024 году. Владельцы EV покупают PPF и tint значительно чаще.' },
            { icon: '↑', text: 'Mobile-first услуги растут: мобильный детейлинг +20% за первый квартал 2025 (Driven Brands)' },
            { icon: '↑', text: 'AI-диагностика: точность распознавания повреждений 90–99% (Tractable, партнёр GEICO)' },
            { icon: '↑', text: 'Средний возраст авто во Флориде — 11 лет. Больше машин нуждаются в защите.' },
          ].map((s, i) => (
            <div key={i} className="market-trend-row">
              <span className="market-trend-icon" style={{ color: 'var(--green)' }}>{s.icon}</span>
              <span style={{ fontWeight: s.bold ? 600 : 400 }}>{s.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SlideAdjacentPlayers() {
  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Рынок · Смежные игроки</div>
      <h2 className="ed-title">Кто ещё на рынке — угрозы и возможности</h2>
      <p className="ed-lead">
        Помимо прямых конкурентов есть крупные игроки, которые либо угрожают нишей, либо могут стать партнёрами. Понимание их роли — обязательная часть стратегии.
      </p>

      <div className="adj-section-title" style={{ color: 'var(--red)' }}>Угрозы — следим внимательно</div>

      <div className="adj-grid">
        <div className="adj-card adj-card-threat">
          <div className="adj-card-head">
            <span className="adj-card-name">Yelp + RepairPal</span>
            <span className="adj-badge" style={{ background: 'rgba(139,46,46,0.1)', color: 'var(--red)' }}>Главная угроза</span>
          </div>
          <div className="adj-stats-row">
            <div className="adj-stat"><span>$80M</span><span>заплатил Yelp за RepairPal в 2024 году</span></div>
            <div className="adj-stat"><span>$90M</span><span>выручка Yelp из авто-вертикали в год</span></div>
            <div className="adj-stat"><span>3 800+</span><span>сертифицированных мастерских в сети</span></div>
          </div>
          <p className="adj-text">Yelp — крупнейший сайт отзывов в США — купил RepairPal (агрегатор автосервисов) за $80M. У Yelp уже $90M годовой выручки только от автомобильной вертикали. Если Yelp решит выйти в сегмент PPF/tint/wrap — это прямая конкуренция. Пока они на ремонте, но движение очевидно.</p>
          <div className="adj-lesson">Стратегия Carreta: захватить нишу premium до того, как Yelp обратит на неё внимание. First mover advantage — редкая возможность.</div>
        </div>

        <div className="adj-card adj-card-threat">
          <div className="adj-card-head">
            <span className="adj-card-name">XPEL (NASDAQ)</span>
            <span className="adj-badge" style={{ background: 'rgba(139,46,46,0.08)', color: 'var(--red)' }}>Потенциальный конкурент</span>
          </div>
          <div className="adj-stats-row">
            <div className="adj-stat"><span>$420M</span><span>выручка XPEL в 2024 году</span></div>
            <div className="adj-stat"><span>6 000+</span><span>авторизованных дилеров по всему миру</span></div>
            <div className="adj-stat"><span>~40%</span><span>доля рынка PPF в США</span></div>
          </div>
          <p className="adj-text">XPEL — крупнейший производитель PPF-плёнки в мире. У них 6 000+ установщиков-партнёров. Они уже предоставляют программное обеспечение (DAP), обучение и маркетинг своим дилерам. Если они захотят — могут запустить consumer marketplace и замкнуть цепочку "плёнка → установка → клиент". <strong>Но сейчас они этого не делают</strong>, и именно это — окно для Carreta.</p>
          <div className="adj-lesson">Стратегия: сделать XPEL-дилеров supply-side Carreta до того, как XPEL построит собственный маркетплейс.</div>
        </div>
      </div>

      <div className="adj-section-title" style={{ color: 'var(--green)', marginTop: '1.5rem' }}>Партнёрские возможности — стратегические союзники</div>

      <div className="adj-grid">
        <div className="adj-card adj-card-partner">
          <div className="adj-card-head">
            <span className="adj-card-name">Turo — Airbnb для машин</span>
            <span className="adj-badge" style={{ background: 'rgba(28,58,46,0.1)', color: 'var(--green)' }}>Demand-side партнёр</span>
          </div>
          <div className="adj-stats-row">
            <div className="adj-stat"><span>$958M</span><span>выручка Turo в 2024 году</span></div>
            <div className="adj-stat"><span>360 000</span><span>активных объявлений (машины в аренду)</span></div>
            <div className="adj-stat"><span>$10 868</span><span>средний доход хоста Turo в год на одну машину</span></div>
          </div>
          <p className="adj-text">Turo — это платформа, где частные владельцы сдают свои машины в аренду (как Airbnb, только для автомобилей). У них 360 000 машин, и их хозяева постоянно нуждаются в детейлинге, тонировке, мойке, мелком кузовном ремонте — всё это нужно делать между арендами. Это огромный источник регулярных заказов для Carreta.</p>
          <div className="adj-lesson">Партнёрство с Turo = стабильный поток заказов от 360К хозяев машин, которым нужен сервис прямо сейчас.</div>
        </div>

        <div className="adj-card adj-card-partner">
          <div className="adj-card-head">
            <span className="adj-card-name">Jiffy Lube / Meineke / Midas</span>
            <span className="adj-badge" style={{ background: 'rgba(28,58,46,0.08)', color: 'var(--green)' }}>Cross-sell канал</span>
          </div>
          <div className="adj-stats-row">
            <div className="adj-stat"><span>24M</span><span>клиентов у Jiffy Lube в год</span></div>
            <div className="adj-stat"><span>2 200+</span><span>точек Jiffy Lube по США</span></div>
            <div className="adj-stat"><span>0</span><span>пересечений с нашим сегментом — они ремонтируют, мы украшаем</span></div>
          </div>
          <p className="adj-text">Jiffy Lube, Meineke, Midas — это сети замены масла и ремонта. Они работают в массовом ценовом сегменте ($50–100 за визит) и вообще не занимаются PPF, ceramic coating, wrap и детейлингом. Но у них миллионы клиентов, которых можно привлечь через партнёрство: клиент приехал на замену масла → увидел рекламу Carreta → заказал тонировку.</p>
          <div className="adj-lesson">Это не конкуренты — это потенциальный referral-канал к 24 миллионам автовладельцев.</div>
        </div>
      </div>
    </div>
  )
}

function SlideFailures() {
  const patterns = [
    { n: '01', h: 'Проблема найма — 1099 против W2', t: 'YourMechanic нанимал мастеров как "самозанятых", но фактически управлял ими как сотрудниками. Суды Калифорнии постановили: это нарушение. Штрафы: $5 000–$25 000 за каждый случай. Если бы YourMechanic официально перевёл всех в штат, расходы выросли бы на 20–30% и уничтожили бы маржу. Homejoy закрылась по той же причине.' },
    { n: '02', h: 'Клиент пользуется платформой 1–2 раза в год', t: 'Авторемонт — не ежедневная вещь. Если привлечь клиента стоит $50, а он делает один заказ на $100 в год — это убыточный бизнес. Uber привлекает клиента за $20, который едет каждый день. GoMechanic тратил 71% выручки только на рекламу — и всё равно не мог удержать клиентов.' },
    { n: '03', h: 'Клиент находит мастера и больше не возвращается в приложение', t: '"Дезинтермедиация" — это когда клиент нашёл через приложение хорошего мастера, взял его номер и в следующий раз позвонил напрямую. Для авторемонта это особенно характерно. Uber решил это, принудительно скрывая контакты — но для нечастых дорогих услуг клиент готов потратить усилия.' },
    { n: '04', h: 'Скупать конкурентов не значит решить проблему', t: 'Wrench потратил $77–125M и купил 4 компании (YourMechanic, Lemon Squad, Fiix, Otobots). Но объединение четырёх убыточных компаний не делает их прибыльными. Рейтинг Wrench на Trustpilot — 1,4 из 5. Клиенты пишут: "После покупки YourMechanic всё стало хуже".' },
    { n: '05', h: 'Мошенничество с финансовой отчётностью', t: 'GoMechanic (Индия) в течение 6 лет завышал выручку через фиктивные гаражи и подставные транзакции. При проверке SoftBank обнаружил это. Основатель признал "ошибки суждения". 700 из 1 000 сотрудников уволены. Компанию продали за $27,5M — против пиковой оценки $285M. Падение на 90%. Уголовное дело против всех 4 основателей.' },
    { n: '06', h: 'Ловушка "Uber-аналогии"', t: 'Uber создал новый рынок — до Uber люди просто не вызывали такси так часто. Авторемонт — это существующий конкурентный рынок. Люди и так ездят в шоп, просто по-другому его находят. "Уберизировать" существующий рынок сложнее, чем создать новый.' },
  ]
  const exits = [
    { company: 'RepairSmith', buyer: 'AutoNation', price: '$190M', year: '2022', note: 'Нанимали техников в штат (W2). Продали за 4,5x вложенного капитала' },
    { company: 'RepairPal', buyer: 'Yelp', price: '$80M', year: '2024', note: 'Маркетплейс с 3 800 сертифицированными мастерскими' },
    { company: 'NuBrakes', buyer: 'Valvoline', price: 'Не раскрыто', year: '2025', note: 'Мобильная замена тормозов, B2C' },
    { company: 'YourMechanic', buyer: 'Wrench', price: 'Distressed (убыток)', year: '2022', note: 'Иски, проблемы с 1099 — продали вынужденно' },
    { company: 'GoMechanic', buyer: 'Lifelong Group', price: '$27,5M', year: '2023', note: 'Было $285M оценки → падение 90%. Мошенничество' },
  ]
  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Рынок · Уроки провалов</div>
      <h2 className="ed-title">Почему другие не смогли — и что мы делаем иначе</h2>
      <p className="ed-lead">
        YourMechanic поднял $50M. Wrench — $125M. GoMechanic — $62M. Все провалились. Это не значит, что рынок плохой — это значит, что их модель была сломана. Carreta строится по-другому.
      </p>

      <div className="fail-grid">
        {patterns.map((p, i) => (
          <motion.div key={i} className="fail-card"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: (i % 2) * 0.07 }}>
            <div className="fail-n">{p.n}</div>
            <h4 className="fail-title">{p.h}</h4>
            <p className="fail-text">{p.t}</p>
          </motion.div>
        ))}
      </div>

      <WavyDivider />

      <div className="an-table-title">Выходы из отрасли — кто продался и за сколько</div>
      <div className="an-table-wrap">
        <table className="an-table">
          <thead>
            <tr><th>Компания</th><th>Кто купил</th><th>Цена</th><th>Год</th><th>Почему</th></tr>
          </thead>
          <tbody>
            {exits.map((e, i) => (
              <tr key={i}>
                <td className="an-td-name">{e.company}</td>
                <td>{e.buyer}</td>
                <td className="an-td-num" style={{ color: e.price.includes('Distressed') ? 'var(--red)' : 'var(--green)' }}>{e.price}</td>
                <td>{e.year}</td>
                <td className="an-td-note">{e.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ed-pullquote">
        Carreta избегает всех главных ловушек: не нанимает техников (нет риска классификации), работает с существующими бизнесами, фокусируется на премиальном сегменте с чеком в 10–30 раз выше замены масла.
      </div>
    </div>
  )
}

function SlideMiami() {
  const areas = [
    { name: 'Brickell / Downtown', desc: 'Финансовый район, максимальная плотность люксовых авто, молодые профессионалы' },
    { name: 'Miami Beach', desc: 'Туризм, дорогие кондо, Ferrari и Lamborghini — обычное явление' },
    { name: 'Coral Gables', desc: 'Состоятельные семьи, высокий доход, культура ухода за машиной' },
    { name: 'Doral', desc: '60%+ население — латиноамериканцы, активный авто-энтузиаст-рынок' },
    { name: 'Aventura', desc: 'Snowbirds, пожилые состоятельные владельцы, сезонный спрос октябрь–апрель' },
  ]
  const priorities = [
    { cat: 'Тонировка стёкол', why: 'Высокий объём, низкий чек ($200–600). Хорош для быстрого роста числа клиентов', phase: 'Фаза 1' },
    { cat: 'Ceramic coating', why: 'Средний чек ($800–1 800). Климатически обусловлен — в Майами UV убивает кузов без защиты', phase: 'Фаза 1' },
    { cat: 'PPF (защитная плёнка)', why: 'Высший чек ($2 000–7 000). Владельцы BMW, Tesla, Porsche — целевые клиенты', phase: 'Фаза 1–2' },
    { cat: 'Детейлинг', why: 'Высокая частота, retention. Клиент возвращается раз в 1–3 месяца', phase: 'Фаза 1–2' },
    { cat: 'Vinyl wrap', why: 'Тренд, вирусный контент в TikTok/Instagram — даёт органический трафик', phase: 'Фаза 2' },
  ]
  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Запуск · Стратегия</div>
      <h2 className="ed-title">Почему Майами — идеальный первый город</h2>
      <p className="ed-lead">
        Первый город — самое важное решение в запуске маркетплейса. Нужен рынок с высокой плотностью клиентов, готовностью платить, фрагментированным предложением и без сильного конкурента. Майами закрывает все четыре пункта.
      </p>

      <div className="miami-pro-con">
        <div className="miami-pros">
          <div className="miami-side-title" style={{ color: 'var(--green)' }}>Почему Майами — да</div>
          {[
            { h: '2,1M автомобилей только в Miami-Dade', t: 'Плюс Broward и Palm Beach — 4,7–5,2 миллиона машин в трёх округах. Рынок огромный.' },
            { h: 'Каждый пятый автомобиль — люксовый', t: 'Edmunds фиксирует непропорционально высокую долю BMW, Mercedes, Tesla, Porsche. Именно эти владельцы платят за PPF и ceramic coating.' },
            { h: 'Климат работает на нас круглый год', t: 'Интенсивное солнце, UV, высокая влажность, солёный воздух. Без тонировки и ceramic coating краска выгорает и ржавеет. Это не прихоть, а необходимость.' },
            { h: 'Снобирды — миллион состоятельных сезонников', t: '"Snowbirds" — состоятельные пенсионеры из северных штатов, которые приезжают на зиму. ~1 миллион человек с октября по апрель. Возраст 50–69, дорогие машины. Идеальный клиент для PPF.' },
            { h: '39 000 новых электромобилей в 2024 году', t: 'Майами — 4-й крупнейший рынок EV в США. Владельцы Tesla почти всегда покупают PPF — плёнку ставят, чтобы защитить дорогое авто.' },
            { h: 'Рынок цифрово не охвачен', t: 'Ни одна платформа не агрегирует PPF/tint/wrap/detailing в Майами. Каждый шоп работает сам по себе. Real-time booking — редкость. Ценовой прозрачности нет.' },
          ].map((p, i) => (
            <div key={i} className="miami-point">
              <strong>{p.h}</strong>
              <span>{p.t}</span>
            </div>
          ))}
        </div>
        <div className="miami-cons">
          <div className="miami-side-title" style={{ color: 'var(--accent)' }}>Что нужно учесть</div>
          {[
            { h: '68,8% — латиноамериканцы', t: 'Двуязычная платформа (English/Spanish) — не опция, а необходимость с первого дня. Многие шопы и их клиенты говорят только по-испански.' },
            { h: 'Летний спад (май–сентябрь)', t: 'Snowbirds уезжают, туристов меньше. Нужна стратегия работы с местными клиентами и шопами в низкий сезон.' },
            { h: '150–250+ конкурирующих шопов', t: 'Много местных игроков в Dade и Broward. Но все работают без платформы, вручную. Carreta не конкурирует с ними — она помогает им расти.' },
          ].map((p, i) => (
            <div key={i} className="miami-point miami-point-warn">
              <strong>{p.h}</strong>
              <span>{p.t}</span>
            </div>
          ))}

          <div className="miami-launch-box">
            <div className="miami-launch-title">Когда запускаться</div>
            <div className="miami-launch-text">
              <strong>Сентябрь–октябрь</strong> — оптимальный тайминг. Snowbirds возвращаются, спрос растёт, конкуренты не готовы.
            </div>
          </div>
        </div>
      </div>

      <div className="miami-areas-title">Приоритетные районы запуска</div>
      <div className="miami-areas">
        {areas.map((a, i) => (
          <div key={i} className="miami-area-card">
            <div className="miami-area-name">{a.name}</div>
            <div className="miami-area-desc">{a.desc}</div>
          </div>
        ))}
      </div>

      <div className="miami-cats-title">Порядок запуска категорий услуг</div>
      <div className="miami-cats">
        {priorities.map((p, i) => (
          <div key={i} className="miami-cat-row">
            <div className="miami-cat-name">{p.cat}</div>
            <div className="miami-cat-why">{p.why}</div>
            <div className="miami-cat-phase" style={{ color: p.phase === 'Фаза 1' ? 'var(--accent)' : 'var(--fg-mid)' }}>{p.phase}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SlideLegal() {
  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Запуск · Правовая среда</div>
      <h2 className="ed-title">Правовые вопросы — почему Флорида выгодна</h2>
      <p className="ed-lead">
        Правовая среда — одна из причин, почему конкуренты провалились. Carreta строится с учётом всех рисков с первого дня. Флорида значительно лучше Калифорнии для нашей модели.
      </p>

      <div className="legal-section">
        <div className="legal-section-title">1099 против W2 — в чём суть и почему это важно</div>
        <div className="legal-explain">
          <div className="legal-explain-block legal-explain-bad">
            <div className="legal-explain-label" style={{ color: 'var(--red)' }}>Проблемная модель (YourMechanic)</div>
            <p>YourMechanic платил мастерам как "самозанятым" (1099 — это форма налоговой отчётности для независимых подрядчиков). Но при этом диктовал им расписание, маршруты, поведение с клиентами. Суды Калифорнии решили: это фактически трудовые отношения. Штраф: $5 000–25 000 за каждый случай нарушения.</p>
          </div>
          <div className="legal-explain-block legal-explain-good">
            <div className="legal-explain-label" style={{ color: 'var(--green)' }}>Модель Carreta (безопасная)</div>
            <p>Carreta не нанимает мастеров вообще. Шопы на платформе — это уже существующие независимые бизнесы с собственными лицензиями, оборудованием, клиентами. Они сами решают, принять ли заявку. Carreta — это витрина, не работодатель. В Флориде применяется мягкий тест "right of control" (Глава 443 Florida Statutes) — не жёсткий ABC-тест Калифорнии.</p>
          </div>
        </div>
      </div>

      <div className="legal-grid">
        <div className="legal-card legal-card-good">
          <div className="legal-card-title">Флорида: про-бизнесовая среда</div>
          <ul className="legal-list">
            <li>Нет личного подоходного налога (НДФЛ) — единственный крупный штат без него</li>
            <li>Корпоративный налог: 5,5% (Калифорния: 8,84%)</li>
            <li>Регистрация LLC: ~$125 онлайн — одна из самых простых процедур</li>
            <li>Нет ABC-теста — не применяется жёсткий калифорнийский стандарт классификации</li>
            <li>DOL (Минтруд США) в 2025 году признал marketplace-платформы "referral services" — мастера не являются сотрудниками платформы</li>
          </ul>
        </div>
        <div className="legal-card">
          <div className="legal-card-title">Что нужно от каждого шопа-партнёра</div>
          <ul className="legal-list">
            <li>Действующая регистрация в FDACS (Florida Department of Agriculture and Consumer Services) — раз в 2 года</li>
            <li>В Miami-Dade: гаражная страховка минимум $50 000</li>
            <li>General Liability Insurance: $2 000–5 000/год — Carreta проверяет при онбординге</li>
            <li>NDA с Carreta — стандартный договор</li>
          </ul>
        </div>
        <div className="legal-card">
          <div className="legal-card-title">Stripe Connect — как работают платежи</div>
          <ul className="legal-list">
            <li>Stripe — мировой лидер в онлайн-платежах, используется Lyft, DoorDash, Airbnb</li>
            <li>Carreta не является банком и не хранит деньги клиентов</li>
            <li>Stripe обрабатывает деньги, держит лицензии денежного переводчика — Carreta не нужна своя лицензия</li>
            <li>Комиссия Stripe: 2,9% + $0,30 за транзакцию</li>
            <li>Онбординг шопа через Stripe занимает минуты-часы (автоматическая проверка)</li>
            <li>Автоматическая выдача налоговых форм 1099 шопам — не нужно делать вручную</li>
          </ul>
        </div>
        <div className="legal-card">
          <div className="legal-card-title">App Store: Apple не берёт 30% комиссии</div>
          <ul className="legal-list">
            <li>Физические услуги (авторемонт, детейлинг и т.д.) <strong>освобождены</strong> от требований Apple IAP</li>
            <li>Apple взимает 30% только с цифровых товаров — приложения, подписки, игры</li>
            <li>Оплата сервисов через Stripe внутри приложения — законно и без комиссий Apple</li>
            <li>Google Play: та же история — физические услуги освобождены</li>
            <li>Это подтверждено решением суда Epic v. Apple (2025)</li>
          </ul>
        </div>
        <div className="legal-card">
          <div className="legal-card-title">Страховка для самой Carreta (год)</div>
          <ul className="legal-list">
            <li>General Liability: $2 000–5 000/год — защита от исков третьих лиц</li>
            <li>Tech E&O + Cyber: $3 000–8 000/год — защита от ошибок в ПО и утечек данных</li>
            <li>D&O: $2 000–5 000/год — защита основателей от личной ответственности</li>
            <li>EPLI: $1 500–3 000/год — защита от трудовых исков</li>
            <li><strong>Итого: $8 500–21 000/год</strong></li>
          </ul>
        </div>
        <div className="legal-card">
          <div className="legal-card-title">Защита интеллектуальной собственности</div>
          <ul className="legal-list">
            <li>Предварительная патентная заявка на AI-диагностику: $2 000–5 000 (даёт статус "Patent Pending")</li>
            <li>Торговая марка "Carreta": $1 500–3 500 с юристом (12–18 мес. до регистрации)</li>
            <li>Весь код принадлежит Carreta — IP Assignment подписывает каждый разработчик</li>
            <li>Общий бюджет правовой подготовки к запуску: $17 500–45 600</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function SlideBNPLSubs() {
  const priceTable = [
    { service: 'PPF — передняя часть', lo: '$1 500', hi: '$3 500', typical: '$2 000–2 500', carreta18: '$360–450' },
    { service: 'PPF — полный кузов', lo: '$4 500', hi: '$9 000+', typical: '$5 000–7 000', carreta18: '$900–1 260' },
    { service: 'Тонировка — весь автомобиль', lo: '$100', hi: '$850', typical: '$200–600', carreta18: '$36–108' },
    { service: 'Ceramic coating', lo: '$500', hi: '$3 000+', typical: '$800–1 800', carreta18: '$144–324' },
    { service: 'Full vinyl wrap', lo: '$2 000', hi: '$5 000+', typical: '$2 500–4 000', carreta18: '$450–720' },
    { service: 'Детейлинг (полный)', lo: '$150', hi: '$500+', typical: '$200–350', carreta18: '$36–63' },
  ]
  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Продукт · Экономика</div>
      <h2 className="ed-title">Юнит-экономика — сколько зарабатывает Carreta</h2>
      <p className="ed-lead">
        Юнит-экономика — это математика одной транзакции: сколько стоит привлечь клиента, сколько он приносит, когда инвестиция окупается. Carreta имеет значительно лучшую юнит-экономику, чем конкуренты по авторемонту — за счёт высокого среднего чека.
      </p>

      <div className="ue-explain-row">
        <div className="ue-term">
          <div className="ue-term-n">CAC</div>
          <div className="ue-term-name">Customer Acquisition Cost — стоимость привлечения клиента</div>
          <div className="ue-term-def">Сколько нужно потратить на рекламу, чтобы один человек совершил первый заказ. Для Carreta: $20–50 для клиентов (buyer), $100–200 для шопов (seller).</div>
        </div>
        <div className="ue-term">
          <div className="ue-term-n">LTV</div>
          <div className="ue-term-name">Lifetime Value — пожизненная ценность клиента</div>
          <div className="ue-term-def">Сколько денег клиент принесёт за всё время работы с платформой. Если клиент сделал PPF за $2 500 (комиссия $450), потом раз в год детейлинг за $300 (комиссия $54) — за 3 года LTV = ~$600+.</div>
        </div>
        <div className="ue-term ue-term-key">
          <div className="ue-term-n">3:1</div>
          <div className="ue-term-name">LTV:CAC — минимальный стандарт</div>
          <div className="ue-term-def">Золотое правило: клиент должен приносить в 3+ раза больше, чем стоит его привлечение. При CAC $40 и LTV $200+ — Carreta уже выше порога. Без подписки и cross-sell — сложнее.</div>
        </div>
      </div>

      <div className="an-table-title">Цены на услуги и комиссия Carreta (18%)</div>
      <div className="an-table-wrap">
        <table className="an-table">
          <thead>
            <tr><th>Услуга</th><th>Мин. цена</th><th>Макс. цена</th><th>Типичная цена</th><th>Комиссия Carreta (18%)</th></tr>
          </thead>
          <tbody>
            {priceTable.map((r, i) => (
              <tr key={i}>
                <td className="an-td-name">{r.service}</td>
                <td>{r.lo}</td>
                <td>{r.hi}</td>
                <td className="an-td-num">{r.typical}</td>
                <td className="an-td-cagr" style={{ color: 'var(--accent)' }}>{r.carreta18}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <WavyDivider />

      <div className="bnpl-section">
        <div className="bnpl-title">BNPL — рассрочка без банка (Affirm, Sunbit)</div>
        <div className="bnpl-explain">
          <p><strong>Что такое BNPL</strong> (Buy Now Pay Later): клиент платит не сразу, а частями — например, $600/мес вместо $3 000 за PPF. Carreta получает всю сумму сразу от финансового партнёра. Клиент расплачивается с Affirm или Sunbit — не с Carreta.</p>
          <div className="bnpl-facts">
            {[
              { n: '50%+', l: 'дилерских центров США уже используют Sunbit — лидер в BNPL для авто' },
              { n: '~90%', l: 'одобряемость заявок на рассрочку через Sunbit (почти все клиенты проходят)' },
              { n: '9 п.п.', l: 'на столько снижается отказ от покупки при наличии рассрочки: с 22% до 13%' },
              { n: '$2 137', l: 'средний финансируемый чек через DigniFi для авто (май 2024)' },
            ].map((s, i) => (
              <div key={i} className="bnpl-fact">
                <span className="bnpl-fact-n">{s.n}</span>
                <span className="bnpl-fact-l">{s.l}</span>
              </div>
            ))}
          </div>
          <div className="bnpl-conclusion">Для PPF и ceramic coating с чеком $1 500–5 000 — <strong>рассрочка обязательна</strong>. Без неё часть клиентов просто уходит, хотя хотела купить.</div>
        </div>
      </div>

      <div className="subs-section">
        <div className="subs-title">Подписочная модель — как поднять частоту использования</div>
        <div className="subs-explain">
          <p>Главная слабость авто-маркетплейсов: клиент делает PPF раз в 5 лет. За это время он уже забыл о платформе. Решение — <strong>подписка на регулярный уход</strong>: детейлинг, мойка, напоминания, скидки.</p>
          <div className="subs-benchmarks">
            {[
              { brand: 'Spiffy', plan: 'от $49/мес', detail: '13 услуг в год — мобильный детейлинг прямо к машине' },
              { brand: 'EverWash', plan: 'от $9,95/мес', detail: '1 000 точек, неограниченная мойка — subscription-first модель' },
              { brand: 'Quick Quack (KKR)', plan: 'Subscription-centric', detail: 'KKR инвестировал $850M именно из-за подписочной модели' },
            ].map((s, i) => (
              <div key={i} className="subs-benchmark">
                <strong>{s.brand}</strong>
                <span>{s.plan}</span>
                <span>{s.detail}</span>
              </div>
            ))}
          </div>
          <div className="subs-math">
            <div className="subs-math-title">Математика подписки</div>
            <div className="subs-math-row"><span>Клиент без подписки</span><span>LTV ~$106 за жизнь</span></div>
            <div className="subs-math-row"><span>Клиент с подпиской $30/мес</span><span>LTV ~$434–440 (36 мес.)</span></div>
            <div className="subs-math-row subs-math-highlight"><span>Разница</span><span>подписчики дают в 4,1 раза больше выручки</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SlideSWOT() {
  const swot = {
    strengths: [
      { h: 'Нет найма техников — нет рисков классификации', t: 'YourMechanic потерял из-за этого $50M+. Carreta агрегирует существующие бизнесы. Никакого W2 vs 1099 риска.' },
      { h: 'Высокий средний чек — $2 000–7 000 за PPF', t: 'При комиссии 18% — $360–1 260 за транзакцию. Маркетплейс замены масла ($70–100 за заказ) никогда не достигнет такой юнит-экономики.' },
      { h: 'Незанятая ниша — буквально ни одного конкурента', t: 'Ни Yelp, ни Thumbtack, ни Angi не специализируются на PPF/coating/tint/wrap. XPEL и Ceramic Pro — поставщики, не маркетплейсы. Ниша свободна.' },
      { h: 'Правовая среда во Флориде — максимально благоприятная', t: 'Нет ABC-теста, нет НДФЛ, $125 за регистрацию LLC. DOL признаёт маркетплейсы как referral services, а не работодателей.' },
      { h: 'AI-диффренциатор — сфотографировал → получил цену', t: 'Ни один конкурент не предлагает фото-диагностику для PPF/tint/wrap. Точность систем (Ravin AI, Monk AI) — 90–99%. Это уникальная фича.' },
    ],
    weaknesses: [
      { h: 'Низкая частота использования PPF и coating', t: 'PPF ставят раз в 5 лет. Ceramic coating — раз в 2–3 года. Без подписки на детейлинг и cross-sell клиент забудет о платформе до следующего раза.' },
      { h: 'Зависимость от шопов-партнёров', t: 'Если ключевые XPEL-дилеры откажутся от платформы или начнут уводить клиентов — supply-side рушится. Нужны условия, при которых шопам выгодно оставаться.' },
      { h: 'Стартовая стадия — нет трекшена', t: 'На рынке, где $125M-компании провалились, инвесторы будут скептичны. Нужен убедительный proof of concept с реальными шопами и реальными заказами.' },
      { h: 'Клиент может уйти напрямую к мастеру', t: '"Дезинтермедиация" — после первого визита клиент берёт номер шопа. Для дорогих нечастых услуг это особенно характерно. Решение: рейтинги, гарантии, страховка через платформу.' },
    ],
    opportunities: [
      { h: 'Vinyl wrap растёт на 18,8% в год', t: 'Это самый быстрорастущий сегмент — кастомизация авто, реклама на машинах, замена покраски. Carreta входит в тренд на ранней стадии.' },
      { h: 'Партнёрство с Turo — 360K машин нуждаются в сервисе', t: 'Хосты Turo обязаны регулярно убирать и обслуживать машины между арендами. Интеграция с Turo даст стабильный поток заказов уже в день запуска.' },
      { h: 'EV-бум: Tesla-владельцы покупают PPF гораздо чаще', t: '39 000 новых EV в Miami DMA в 2024 году. Tesla владельцы — идеальная аудитория: состоятельные, технически грамотные, ценят защиту.' },
      { h: 'AI-премия к оценке +30–50%', t: 'Стартапы с AI-интеграцией получают оценки на 30–50% выше при прочих равных. Damage detection, dynamic pricing, predictive maintenance — три AI-функции для fundraising.' },
      { h: 'Snowbirds (1M) — пакет "New to Florida"', t: 'Состоятельные сезонники приезжают в октябре с дорогими машинами после северной зимы. Пакет tint + coating + PPF = $3 000–5 000 средний чек.' },
      { h: 'Стратегическое поглощение: XPEL, Valvoline, AutoNation', t: 'Компании с тысячами дилеров не строят маркетплейсы с нуля — они покупают. RepairSmith ушёл за $190M, NuBrakes — Valvoline, RepairPal — Yelp. XPEL ($420M выручки) и крупные дистрибуторы PPF — естественные покупатели Carreta, когда платформа докажет тракшн.' },
    ],
    threats: [
      { h: 'Yelp + RepairPal — $80M acquisition', t: 'Yelp купил RepairPal (3 800 сертифицированных мастерских) за $80M в 2024. У Yelp $90M/год из авто-вертикали. Если выйдут в specialty auto services — прямая конкуренция.' },
      { h: 'XPEL может запустить собственный маркетплейс', t: 'У XPEL 6 000 дилеров, $420M выручки, собственный DAP-портал. При желании они могут замкнуть цепочку "плёнка → установка → клиент" без Carreta. Но исторически компании такого масштаба покупают готовые платформы, а не строят их. Успешный Carreta с трекшеном — очевидная цель для поглощения, а не конкурент.' },
      { h: 'История провалов отрасли пугает инвесторов', t: 'YourMechanic ($50M+), Wrench ($125M), GoMechanic ($62M) — все провалились. Инвесторы знают эти истории и будут требовать доказательств, что Carreta другая.' },
      { h: 'Макро-риски — рецессия снижает расходы на люкс', t: 'PPF и ceramic coating — дискреционные расходы. При экономическом спаде клиенты откладывают их. Детейлинг и тонировка более устойчивы.' },
    ],
  }
  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Бизнес-кейс · SWOT</div>
      <h2 className="ed-title">SWOT-анализ Carreta</h2>
      <p className="ed-lead">SWOT — это структурированная оценка бизнеса: сильные стороны (Strengths), слабые стороны (Weaknesses), возможности (Opportunities) и угрозы (Threats). Честный анализ помогает видеть картину полностью.</p>
      <div className="swot-grid">
        <div className="swot-quadrant swot-s">
          <div className="swot-q-title">Сильные стороны</div>
          {swot.strengths.map((s, i) => (
            <div key={i} className="swot-item">
              <strong>{s.h}</strong>
              <span>{s.t}</span>
            </div>
          ))}
        </div>
        <div className="swot-quadrant swot-w">
          <div className="swot-q-title">Слабые стороны</div>
          {swot.weaknesses.map((s, i) => (
            <div key={i} className="swot-item">
              <strong>{s.h}</strong>
              <span>{s.t}</span>
            </div>
          ))}
        </div>
        <div className="swot-quadrant swot-o">
          <div className="swot-q-title">Возможности</div>
          {swot.opportunities.map((s, i) => (
            <div key={i} className="swot-item">
              <strong>{s.h}</strong>
              <span>{s.t}</span>
            </div>
          ))}
        </div>
        <div className="swot-quadrant swot-t">
          <div className="swot-q-title">Угрозы</div>
          {swot.threats.map((s, i) => (
            <div key={i} className="swot-item">
              <strong>{s.h}</strong>
              <span>{s.t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SlideInvestors() {
  const milestones = [
    {
      stage: 'Pre-Seed', raise: '$500K–$1,5M', valuation: '$3–6M',
      need: 'MVP + первые 5–10 подключённых шопов + первые реальные заказы',
      target: 'Automotive Ventures, Motus Ventures, FJ Labs (marketplace-фокус)',
    },
    {
      stage: 'Seed', raise: '$2–4M', valuation: '$8–12M',
      need: '$100–200K Monthly GMV. Доказанный product-market fit в Майами. 50+ шопов на платформе.',
      target: 'Autotech Ventures, FJ Labs, Canvas Ventures, Hearst Ventures',
    },
    {
      stage: 'Series A', raise: '$5–10M', valuation: '$30–50M',
      need: '$500K–1M Monthly GMV. Рост 70%+ YoY. LTV:CAC > 3:1. Расширение в 3+ города.',
      target: 'PeakSpan Capital, Edison Partners, корпоративные: XPEL, Bridgestone Americas',
    },
  ]
  const exits = [
    { company: 'RepairSmith', buyer: 'AutoNation (NYSE)', price: '$190M', year: '2022', multiple: '4,5x', note: 'W2-механики → стратегический buyer' },
    { company: 'RepairPal', buyer: 'Yelp', price: '$80M', year: '2024', multiple: 'N/A', note: '3 800 сертифицированных шопов' },
    { company: 'NuBrakes', buyer: 'Valvoline', price: 'н/р', year: '2025', multiple: 'N/A', note: 'Мобильная замена тормозов' },
    { company: 'Carreta', buyer: 'XPEL / Valvoline / AutoNation', price: 'TBD', year: 'Фаза 3', multiple: 'TBD', note: '6 000 дилеров XPEL + платформа = замкнутая цепочка' },
  ]
  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Бизнес-кейс · Инвестиции</div>
      <h2 className="ed-title">Инвестиционный путь и метрики</h2>
      <p className="ed-lead">
        Инвесторы смотрят на конкретные числа: сколько GMV генерирует платформа, как растёт выручка, когда окупается привлечение клиента. Вот дорожная карта от Pre-Seed до Series A с реальными бенчмарками.
      </p>

      <div className="inv-explain-box">
        <div className="inv-explain-title">Что такое GMV — главная метрика маркетплейса</div>
        <p>GMV (Gross Merchandise Volume) — общий оборот всех сделок, которые прошли через платформу. Если через Carreta прошло заказов на $1 000 000, из которых Carreta забрала 18% комиссии — GMV = $1M, выручка Carreta = $180K. Инвесторы смотрят на GMV как на показатель масштаба рынка, который захватила платформа.</p>
      </div>

      <div className="inv-stages">
        {milestones.map((m, i) => (
          <motion.div key={i} className="inv-stage"
            initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
            <div className="inv-stage-head">
              <div className="inv-stage-name">{m.stage}</div>
              <div className="inv-stage-raise">{m.raise}</div>
              <div className="inv-stage-val">оценка {m.valuation}</div>
            </div>
            <div className="inv-stage-body">
              <div className="inv-stage-label">Что нужно показать:</div>
              <div className="inv-stage-need">{m.need}</div>
              <div className="inv-stage-label">Целевые фонды:</div>
              <div className="inv-stage-target">{m.target}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <WavyDivider />

      <div className="inv-ai-box">
        <div className="inv-ai-n">+30–50%</div>
        <div className="inv-ai-text">
          <strong>AI-премия к оценке</strong> — стартапы с реальными AI-фичами получают оценку на 30–50% выше при прочих равных показателях. Для Carreta это: фото-диагностика состояния авто, динамическое ценообразование (время + погода + спрос), предсказание обслуживания через OBD. Это не маркетинг — это реальный технологический moat.
        </div>
      </div>

      <div className="an-table-title">Успешные exits в отрасли — прецеденты стоимости</div>
      <div className="an-table-wrap">
        <table className="an-table">
          <thead>
            <tr><th>Компания</th><th>Покупатель</th><th>Сумма</th><th>Год</th><th>Мультипликатор</th><th>Почему купили</th></tr>
          </thead>
          <tbody>
            {exits.map((e, i) => (
              <tr key={i}>
                <td className="an-td-name">{e.company}</td>
                <td>{e.buyer}</td>
                <td className="an-td-num" style={{ color: 'var(--green)' }}>{e.price}</td>
                <td>{e.year}</td>
                <td>{e.multiple}</td>
                <td className="an-td-note">{e.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="inv-vc-title">Кто инвестирует в auto-tech (специализированные фонды)</div>
      <div className="inv-vc-grid">
        {[
          { name: 'Autotech Ventures', note: '~$600M AUM, 56+ компаний — Lyft, SpotHero. Главный специализированный фонд.' },
          { name: 'FJ Labs (Fabrice Grinda)', note: '900+ marketplace-компаний в портфеле — #1 в мире по marketplace-инвестициям.' },
          { name: 'PeakSpan Capital', note: 'Инвестировали в ServiceUp Series B ($55M). Понимают auto-marketplace модель.' },
          { name: 'Bridgestone Americas', note: 'Стратегический инвестор — вложились в Wrench. Дадут credibility и дистрибуцию.' },
          { name: 'Goodyear Ventures', note: 'Инвестировали в Spiffy ($87,7M выручки). Заинтересованы в авто-tech.' },
          { name: 'Canvas Ventures', note: 'Инвестировали в NuBrakes (продан Valvoline). Активны в auto-services.' },
        ].map((v, i) => (
          <div key={i} className="inv-vc-card">
            <div className="inv-vc-name">{v.name}</div>
            <div className="inv-vc-note">{v.note}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── CLIENT PROTECTION ────────────────────────────────────────────────────────
function SlideGuarantees() {
  const milestones = [
    { n: '1', label: 'Подписание', note: 'Первый ежемесячный платёж после подписания контракта и NDA.' },
    { n: '2', label: 'Каждый месяц', note: 'Фиксированный платёж ежемесячно — только при подтверждённом прогрессе.' },
    { n: '3', label: 'Этап не принят', note: 'Не приняли результат — платёж не идёт. Дорабатываем до приёмки.' },
    { n: '4', label: 'Запуск', note: 'Последний платёж — после выхода в App Store и Google Play.' },
  ]
  const protections = [
    {
      icon: '§',
      title: 'Код принадлежит вам',
      text: 'С первого коммита — 100% IP-права переходят к вам. В контракте нет никаких «лицензий на использование» или «ограниченных прав». Вы можете нанять любую другую студию, чтобы продолжить работу.'
    },
    {
      icon: '⊙',
      title: 'Оплата по результату',
      text: 'Ежемесячная оплата — только при подтверждённом прогрессе. Не приняли результат месяца — платёж не идёт, дорабатываем. Никакого аванса на весь проект.'
    },
    {
      icon: '◻',
      title: 'NDA до первого слова',
      text: 'Мы подписываем NDA ещё до обсуждения деталей вашего продукта. Все идеи, данные и бизнес-логика защищены с первого контакта.'
    },
    {
      icon: '⌥',
      title: 'GitHub с первого дня',
      text: 'Весь код — в вашем репозитории. Вы видите каждый коммит, каждый Pull Request, каждое изменение в реальном времени. Никакого «передадим код после запуска».'
    },
    {
      icon: '↻',
      title: 'Замена разработчика',
      text: 'Если разработчик покидает проект — CA тимлид обеспечивает непрерывность. Вся документация ведётся с первого дня именно для того, чтобы ни один уход не остановил проект.'
    },
    {
      icon: '✦',
      title: 'Поддержка после запуска',
      text: 'Support retainer ($5–10K/мес) или полный transfer на вашу in-house команду с документацией. Мы не исчезаем после запуска.'
    },
    {
      icon: '⇤',
      title: 'Выход из договора — в любой момент',
      text: 'Уведомление за 30 дней — и проект останавливается. Следующий платёж не идёт. Весь код, репозиторий и документация — ваши без условий. Никаких штрафов, никаких удержаний.',
    },
  ]
  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Защита клиента</div>
      <h2 className="ed-title">Ваша безопасность — в структуре</h2>
      <p className="ed-lead">Доверие строится не на обещаниях, а на том, как устроен контракт. Каждый риск закрыт юридически или структурно.</p>

      <div className="guar-grid">
        {protections.map((p, i) => (
          <div key={i} className="guar-card">
            <div className="guar-icon">{p.icon}</div>
            <div className="guar-body">
              <div className="guar-title">{p.title}</div>
              <div className="guar-text">{p.text}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="guar-milestones-title">Структура платежей</div>
      <div className="guar-milestones">
        {milestones.map((m, i) => (
          <div key={i} className="guar-ms-row">
            <div className="guar-ms-pct">{m.n}</div>
            <div className="guar-ms-body">
              <div className="guar-ms-label">{m.label}</div>
              <div className="guar-ms-note">{m.note}</div>
            </div>
            {i < milestones.length - 1 && <div className="guar-ms-arrow">→</div>}
          </div>
        ))}
      </div>

      <div className="guar-scope-wrap">
        <div className="guar-scope-col guar-scope-yes">
          <div className="guar-scope-title" style={{ color: 'var(--green)' }}>Что мы гарантируем</div>
          {[
            'Работающее приложение по согласованному ТЗ — iOS, Android, Web',
            'Код в вашем репозитории с первого дня',
            'Еженедельные демо и полная прозрачность',
            'Гарантийный период 90 дней после запуска: исправляем баги без дополнительной оплаты',
            'Документация по архитектуре, API, дизайн-системе',
          ].map((s, i) => (
            <div key={i} className="guar-scope-row"><span className="guar-scope-dot" style={{ color: 'var(--green)' }}>✓</span>{s}</div>
          ))}
        </div>
        <div className="guar-scope-col guar-scope-no">
          <div className="guar-scope-title" style={{ color: 'var(--fg-mid)' }}>Что не входит в нашу ответственность</div>
          {[
            'Количество скачиваний и пользователей — это GTM и маркетинг Carreta',
            'Выручка платформы и бизнес-метрики — зависит от продуктовых решений',
            'Действия третьих сторон: App Store review, Stripe, Google API',
            'Результат после изменений клиентом вне согласованного ТЗ',
          ].map((s, i) => (
            <div key={i} className="guar-scope-row"><span className="guar-scope-dot" style={{ color: 'var(--fg-light)' }}>—</span>{s}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function SlideFAQ() {
  const [open, setOpen] = useState(null)
  const faqs = [
    {
      q: 'Почему так дорого — $450–700K?',
      a: 'Carreta — это не сайт-визитка. Это мультиплатформенная система: 2 мобильных приложения (iOS + Android), 4 веб-кабинета, Stripe Connect с эскроу, AI-ассистент, GPS-трекинг, BNPL-интеграция. Агентство в Сан-Франциско взяло бы $1.2–2.0M. Мы — $450–700K. Разница — это не экономия на качестве, это экономия на американских зарплатах ($14–22K/мес у SF-разработчика vs $4–6K в Восточной Европе).'
    },
    {
      q: 'Кому принадлежит код? А если вы закроетесь?',
      a: 'Код принадлежит вам с первого коммита. В контракте прямо прописано: все IP-права переходят к клиенту. Весь код хранится в вашем GitHub-репозитории — он уже ваш, независимо от того, что происходит с нами. Если Castells завтра закроется, вы нанимаете любую другую команду и продолжаете работу с того же места.'
    },
    {
      q: 'Как я буду знать, что работа идёт?',
      a: 'Еженедельное демо: каждую пятницу вы видите живой продукт, а не презентацию с прогресс-баром. Прямой Slack с командой — не через менеджера. Доступ к GitHub: каждый коммит, каждый Pull Request в реальном времени. Доступ к Linear/Jira: все задачи, статусы, блокеры — прозрачно.'
    },
    {
      q: 'Что если мне не понравится результат этапа?',
      a: 'Оплата по результату устроена именно для этого. Не приняли дизайн — платёж не идёт, дорабатываем. Не приняли backend — не переходим к мобильным приложениям. Каждый этап имеет чёткие критерии приёмки, прописанные в контракте. «Не понравилось» — это повод доработать, не спор о деньгах.'
    },
    {
      q: 'Что если разработчик уйдёт во время проекта?',
      a: 'Это стандартный риск любого долгосрочного проекта, и мы его закрываем структурно: CA тимлид контролирует каждую строчку кода и знает проект целиком. Вся документация ведётся с первого дня. Замена разработчика занимает 1–2 недели, не месяцы, потому что нет «знания только в голове одного человека».'
    },
    {
      q: 'Можно ли начать с меньшего бюджета?',
      a: 'Да. Мы можем начать с Discovery + дизайна ($50–80K): вы получаете полную архитектуру и все дизайн-макеты, прежде чем принять решение о полном бюджете. Это даёт возможность убедиться в качестве работы до того, как вкладывать в разработку.'
    },
    {
      q: 'Что происходит после запуска?',
      a: 'Два пути: 1) Support retainer — мы продолжаем поддерживать и развивать продукт ($5–10K/мес). 2) Knowledge transfer — передаём документацию, архитектурные решения и помогаем нанять вашу in-house команду. В любом случае, вы не оказываетесь один на один с кодом, который никто не понимает.'
    },
    {
      q: 'Почему не нанять свою команду?',
      a: 'Посчитайте: 1 Senior Full-Stack в LA — $180–220K/год. Вам нужно минимум 4–5 человек + CTO + QA + Designer. Это $1M+ в год только на зарплаты. Плюс поиск (3–6 мес на каждую роль), управление, HR, офис. Мы даём уже собранную команду с налаженными процессами — вы платите за результат, не за процесс найма.'
    },
    {
      q: 'Вы гарантируете, что Carreta привлечёт пользователей и заработает деньги?',
      a: 'Нет — и это честно. Мы строим техническую платформу: приложения, бэкенд, AI-ассистент, интеграции. Насколько платформа привлечёт шопы и клиентов — зависит от маркетинга, GTM-стратегии и команды Carreta. Разделение чёткое: наша зона — работающий продукт, ваша зона — его развитие на рынке. Это закреплено в контракте, чтобы не было недопонимания.'
    },
    {
      q: 'Что если мы захотим остановить проект на полпути?',
      a: 'Выход возможен в любой момент с уведомлением за 30 дней. Следующий ежемесячный платёж не идёт. Весь код, репозиторий и документация уже ваши — это прописано с первого дня. Частично выполненный этап передаётся в текущем состоянии со всей документацией и комментариями. Никаких штрафов, никаких «компенсаций за прекращение работы». Мы строим отношения на доверии, а не на страхе санкций.'
    },
  ]
  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Честные ответы</div>
      <h2 className="ed-title">Вопросы, которые важно задать</h2>
      <p className="ed-lead">Хороший партнёр отвечает на неудобные вопросы честно — до подписания контракта.</p>

      <div className="faq-list">
        {faqs.map((f, i) => (
          <div key={i} className={`faq-item${open === i ? ' faq-item-open' : ''}`}>
            <button className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
              <span className="faq-q-text">{f.q}</span>
              <span className="faq-q-icon">{open === i ? '−' : '+'}</span>
            </button>
            {open === i && (
              <motion.div className="faq-a"
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}>
                {f.a}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── PARTNERSHIP SLIDES ──────────────────────────────────────────────────────

function SlidePartnershipDeal() {
  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Партнерство · Итоги переговоров</div>
      <h2 className="ed-title">Формат сотрудничества</h2>
      <p className="ed-lead" style={{ maxWidth: 720 }}>
        После серии переговоров мы пришли к модели, которая устраивает обе стороны.
        Полный фокус на Carreta с параллельным развитием Mosco AI за счет собственных продаж.
      </p>

      <div className="prob-cards" style={{ maxWidth: 780 }}>
        {[
          {
            n: '01',
            title: '15% от Carreta',
            text: 'Команда Castells Media получает 15% от чистой прибыли Carreta как компенсацию за разработку, архитектуру и управление проектом. Это не зарплата, это доля в результате.'
          },
          {
            n: '02',
            title: '15% от Mosco AI',
            text: 'Партнеры получают 15% от чистой прибыли Mosco AI. Проект развивается параллельно на средства от текущих продаж и клиентов. Уже сейчас приносит доход.'
          },
          {
            n: '03',
            title: 'Перспектива интеграции',
            text: 'Carreta и Mosco AI работают в смежных рынках. Когда Carreta выйдет на 90% готовности, интегрируем Mosco AI для автоматизации шопов. Два продукта усиливают друг друга.'
          },
        ].map((p, i) => (
          <motion.div key={i} className="prob-card"
            initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
            <div className="prob-num">{p.n}</div>
            <div>
              <h4>{p.title}</h4>
              <p>{p.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <WavyDivider />

      <div className="ed-pullquote" style={{ textAlign: 'center', borderLeft: 'none', paddingLeft: 0, maxWidth: 640 }}>
        Мы не нанимаемся на работу. Мы заходим как партнеры с прямой мотивацией довести продукт до результата.
        Наша выгода привязана к вашей выгоде.
      </div>
    </div>
  )
}

function SlideRoadmapStartup() {
  const phases = [
    {
      month: 'Месяц 1',
      title: 'Дизайн + Архитектура',
      hiring: 'UI/UX дизайнер ($2K), Backend ($4K)',
      tasks: [
        'Согласование всех экранов клиентского и шоп-приложения',
        'Архитектурный документ: база данных, API, безопасность',
        'Настройка GitHub, CI/CD, разграничение доступов',
        'Backend-разработчик начинает серверную часть параллельно с дизайном',
      ],
      result: 'Утвержденный дизайн + работающий скелет backend',
    },
    {
      month: 'Месяц 2',
      title: 'Мобилка + Backend',
      hiring: 'Mobile ($3K), Продажник ($2K+%)',
      tasks: [
        'Верстка клиентского приложения по утвержденному дизайну',
        'Backend: API для заказов, оплаты, геолокации',
        'Интеграция Stripe Connect для платежей',
        'Продажник начинает подключать первые шопы',
      ],
      result: 'Рабочий прототип мобилки + первые шопы в воронке',
    },
    {
      month: 'Месяц 3-4',
      title: 'MVP + Первые заказы',
      hiring: 'Frontend ($3K) для веб-кабинета',
      tasks: [
        'Доработка мобилки до стабильного MVP',
        'Веб-кабинет для шопов: управление заказами, расписание',
        'Admin-панель Carreta: мониторинг, аналитика',
        'Beta-тестирование с 5-10 реальными шопами в Майами',
      ],
      result: 'Работающий MVP с первыми реальными заказами',
    },
    {
      month: 'Месяц 5-6',
      title: 'Масштабирование',
      hiring: 'Оптимизация команды по результатам',
      tasks: [
        'AI фото-диагностика состояния авто',
        'Push-уведомления, рейтинги, отзывы',
        'Запуск в App Store и Google Play',
        'Активное привлечение шопов и клиентов',
      ],
      result: '50+ шопов, первые стабильные заказы через платформу',
    },
  ]
  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Партнерство · Roadmap</div>
      <h2 className="ed-title">Этапы разработки и найм</h2>
      <p className="ed-lead">Конкретный план по месяцам: кого нанимаем, что делаем, какой результат получаем.</p>

      <div className="ds-stages">
        {phases.map((p, i) => (
          <div key={i} className="ds-stage-row">
            <div className="ds-stage-left">
              <div className="ds-stage-n">{i + 1}</div>
              <div className="ds-stage-name">{p.month}</div>
              <div className="ds-stage-analogy">{p.title}</div>
            </div>
            <div className="ds-stage-mid">
              <div className="ds-stage-weeks" style={{ fontSize: '0.75rem' }}>{p.hiring}</div>
            </div>
            <div className="ds-stage-right">
              <div className="ds-stage-result">{p.result}</div>
            </div>
          </div>
        ))}
      </div>

      <WavyDivider />

      <div className="ed-pullquote" style={{ marginTop: '1rem' }}>
        Если кто-то не нужен после определенного этапа, сокращаем. Если нужно усилить, нанимаем.
        Команда гибкая, не раздутая.
      </div>
    </div>
  )
}

function SlideBudgetPlan() {
  const rows = [
    { role: 'Backend-разработчик (core)', cost: '$4,000', when: 'С 1-го месяца', note: 'Senior, опыт в enterprise. Архитектура, API, безопасность.' },
    { role: 'Mobile-разработчик', cost: '$3,000', when: 'Со 2-го месяца', note: 'iOS + Android (React Native / Flutter).' },
    { role: 'UI/UX дизайнер', cost: '$2,000', when: 'С 1-го месяца', note: 'Все экраны, согласование. Можно сократить после 2-3 мес.' },
    { role: 'Продажник', cost: '$2,000 + %', when: 'Со 2-го месяца', note: 'Подключение шопов. Оклад минимальный, доход с продаж.' },
    { role: 'Маркетинг / SMM', cost: '$1,500', when: 'С 3-го месяца', note: 'Google Ads, контент, дизайн. Можно стартовать позже.' },
    { role: 'Рекламный бюджет', cost: '$2,500', when: 'С 3-го месяца', note: 'Google Ads, Facebook. Масштабируется по результатам.' },
  ]
  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Партнерство · Бюджет</div>
      <h2 className="ed-title">Распределение средств</h2>
      <p className="ed-lead">Прозрачная структура расходов. Каждый доллар привязан к конкретному человеку или задаче.</p>

      <div className="an-table-wrap">
        <table className="an-table">
          <thead>
            <tr><th>Роль</th><th>Стоимость/мес</th><th>Когда</th><th>Зачем</th></tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="an-td-name">{r.role}</td>
                <td className="an-td-num" style={{ color: 'var(--green, #2a7d4f)' }}>{r.cost}</td>
                <td>{r.when}</td>
                <td className="an-td-note">{r.note}</td>
              </tr>
            ))}
            <tr style={{ fontWeight: 600, borderTop: '2px solid var(--border)' }}>
              <td>Итого (месяц 1-2)</td>
              <td className="an-td-num">~$15,000/мес</td>
              <td colSpan={2}>$30,000 на первые два месяца. Далее $15K/мес пока строим Carreta.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="prob-cards" style={{ maxWidth: 780, marginTop: '2rem' }}>
        {[
          {
            n: '01',
            title: 'Первые 2 месяца: $30,000',
            text: 'Стартовая инвестиция. Нанимаем core-команду, запускаем дизайн и backend. Через 2 месяца оцениваем прогресс и решаем по дальнейшему финансированию.'
          },
          {
            n: '02',
            title: 'Далее: $15K/мес пока строим Carreta',
            text: 'Пока идет разработка Carreta, ежемесячно $15K на команду и маркетинг. Это фиксированная сумма на весь период строительства продукта до запуска.'
          },
          {
            n: '03',
            title: 'Контроль и прозрачность',
            text: 'GitHub с первого дня. Еженедельные демо. Можете подключить своего технического специалиста для ревью кода. Полная прозрачность.'
          },
        ].map((p, i) => (
          <motion.div key={i} className="prob-card"
            initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
            <div className="prob-num">{p.n}</div>
            <div>
              <h4>{p.title}</h4>
              <p>{p.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function SlideMoscoSynergy() {
  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Партнерство · Mosco AI</div>
      <h2 className="ed-title">Mosco AI и Carreta: одна экосистема</h2>
      <p className="ed-lead" style={{ maxWidth: 720 }}>
        Mosco AI уже работает и приносит доход. Вчера подключили Enterprise-клиента на $3,000/мес.
        8 активных клиентов. Продукт на 90% готов. Он не конкурирует с Carreta, а дополняет ее.
      </p>

      <div className="prob-cards" style={{ maxWidth: 780 }}>
        {[
          {
            n: '01',
            title: 'Что такое Mosco AI',
            text: 'Платформа AI-агентов для локальных бизнесов. Агенты отвечают на звонки, переписываются в мессенджерах, букают клиентов, отправляют напоминания. Работает 24/7.'
          },
          {
            n: '02',
            title: 'Как это помогает Carreta',
            text: 'Когда Carreta подключит шопы, им понадобится автоматизация. Mosco AI может стать встроенным модулем: AI-ассистент для каждого шопа. Дополнительная ценность и retention.'
          },
          {
            n: '03',
            title: 'Текущая стратегия',
            text: 'Полный фокус на Carreta. Mosco AI развивается параллельно на доходы от клиентов. $30K стартовой инвестиции идет целиком в Carreta. Когда Carreta будет на 90%, обсуждаем интеграцию.'
          },
        ].map((p, i) => (
          <motion.div key={i} className="prob-card"
            initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
            <div className="prob-num">{p.n}</div>
            <div>
              <h4>{p.title}</h4>
              <p>{p.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <WavyDivider />

      <div className="ed-pullquote" style={{ textAlign: 'center', borderLeft: 'none', paddingLeft: 0, maxWidth: 640 }}>
        Mosco AI генерирует доход. Carreta будет генерировать масштаб.
        Вместе они создают замкнутую экосистему: маркетплейс + автоматизация шопов.
      </div>
    </div>
  )
}

// ─── CHAPTER: НАЧАЛО РАБОТЫ (KICKOFF) ────────────────────────────────────────

// KICKOFF SLIDE 0: Original PDF catalog
function SlideKickoffOriginalCatalog() {
  const categories = [
    { n: 1, name: 'Basic maintenance services', count: '~50 услуг', icon: '🔧' },
    { n: 2, name: 'Repair services', count: '~50 услуг', icon: '⚙️' },
    { n: 3, name: 'Minor quick-fix services', count: '~30 услуг', icon: '🪛' },
    { n: 4, name: 'Car wash and detailing services', count: '~50 услуг', icon: '✨' },
    { n: 5, name: 'Roadside assistance services', count: '~30 услуг', icon: '🚨' },
    { n: 6, name: '«We handle it for you» concierge', count: '~30 услуг', icon: '🤝' },
    { n: 7, name: 'Sober driver / designated driver', count: '~20 услуг', icon: '🍻' },
    { n: 8, name: 'Chauffeur and personal driver', count: '~20 услуг', icon: '🚗' },
    { n: 9, name: 'Vehicle pickup, delivery, relocation', count: '~20 услуг', icon: '📍' },
    { n: 10, name: 'Inspection and compliance', count: '~17 услуг', icon: '📋' },
    { n: 11, name: 'Tire services', count: '~25 услуг', icon: '🛞' },
    { n: 12, name: 'Battery and electrical support', count: '~22 услуги', icon: '⚡' },
    { n: 13, name: 'Seasonal services', count: '~17 услуг', icon: '🌡️' },
    { n: 14, name: 'Emergency and convenience', count: '~15 услуг', icon: '🆘' },
    { n: 15, name: 'Accident and post-accident support', count: '~17 услуг', icon: '🚧' },
    { n: 16, name: 'Car buying and selling support', count: '~17 услуг', icon: '🏷️' },
    { n: 17, name: 'Registration, documentation, admin', count: '~15 услуг', icon: '📄' },
    { n: 18, name: 'Subscription / membership-based', count: '16 планов', icon: '♻️' },
    { n: 19, name: 'Services for specific customer groups', count: 'busy/family/elderly', icon: '👥' },
    { n: 20, name: 'Fleet and business vehicle services', count: '~15 услуг', icon: '🏢' },
    { n: 21, name: 'Add-on convenience services', count: '~17 услуг', icon: '➕' },
    { n: 22, name: 'Cosmetic and appearance services', count: '~16 услуг', icon: '🎨' },
    { n: 23, name: 'Advanced concierge packages', count: '8 пакетов', icon: '💎' },
    { n: 24, name: 'Luxury white-glove services', count: '~15 услуг', icon: '🤍' },
    { n: 25, name: 'Outcome-based grouping', count: '7 outcome-групп', icon: '🎯' },
    { n: 26, name: 'Simple service categories (web)', count: '8 секций', icon: '🌐' },
    { n: 27, name: 'Extra service ideas — modern', count: '~13 услуг', icon: '🚀' },
    { n: 28, name: 'Powerful wording — brand options', count: '7 опций', icon: '✍️' },
    { n: 29, name: 'Best high-value services (Top-15)', count: 'Top-15 список', icon: '⭐' },
    { n: 30, name: 'Business positioning thought', count: '7 selling angles', icon: '💡' },
    { n: 31, name: 'Car wrap service', count: '~50 wrap-услуг', icon: '🎁' },
  ]

  // Group by type for colour coding
  const typeColor = (n) => {
    if (n <= 8) return '#1C5C8F'   // core services — blue
    if (n <= 16) return '#1C6B3A'  // specialized — green
    if (n <= 22) return '#D68910'  // niche/add-on — amber
    if (n <= 26) return '#6B3A8F'  // packages — purple
    return '#7F8C8D'               // strategy docs — grey
  }

  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Начало работы · Отправная точка</div>
      <h2 className="ed-title">Исходный каталог клиента — отправная точка</h2>

      <div className="koc-quote">
        «We take care of everything related to your car, so you don't have to.»
      </div>

      <p className="ed-lead">
        Партнёры из CarETA поделились с нами своим видением продукта в PDF — концепция, каталог услуг, идея бренда.
        31 категория, около 250 услуг, плюс блоки про позиционирование и слоганы.
        Это база с которой мы начали совместную работу. Ниже — структура того, что они нам дали,
        чтобы видеть точку отсчёта и направление движения.
      </p>

      {/* 31-card grid */}
      <div className="koc-grid">
        {categories.map((cat, i) => (
          <motion.div key={cat.n} className="koc-card"
            style={{ borderTop: `3px solid ${typeColor(cat.n)}` }}
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.35, delay: (i % 5) * 0.06 }}>
            <div className="koc-card-top">
              <span className="koc-card-n" style={{ color: typeColor(cat.n) }}>{cat.n}</span>
              <span className="koc-card-icon">{cat.icon}</span>
            </div>
            <div className="koc-card-name">{cat.name}</div>
            <div className="koc-card-count" style={{ color: typeColor(cat.n) }}>{cat.count}</div>
          </motion.div>
        ))}
      </div>

      {/* Footer stats */}
      <div className="koc-footer-stats">
        <div className="koc-footer-stat">
          <div className="koc-footer-num">31</div>
          <div className="koc-footer-label">категория</div>
        </div>
        <div className="koc-footer-stat">
          <div className="koc-footer-num">~250</div>
          <div className="koc-footer-label">атомарных услуг</div>
        </div>
        <div className="koc-footer-stat koc-footer-plus">
          <div className="koc-footer-num koc-footer-note-num">+</div>
          <div className="koc-footer-label">yearly packages, detailing bundles,<br/>AI-prices, motor home cleaning</div>
        </div>
      </div>

      <WavyDivider />

      {/* What was strong in the original */}
      <div className="koc-two-col">
        <div>
          <h3 className="ed-section-title" style={{ color: '#1C6B3A' }}>Что было сильного в исходнике</h3>
          <div className="koc-strength-list">
            {[
              { icon: '🎯', text: 'Главная идея чёткая и продаваемая: «not a repair shop, a concierge layer over the auto industry» — это позиционирование, а не описание услуг.' },
              { icon: '📦', text: 'Outcome-based grouping (раздел 25 PDF) — уже маркетинговый инсайт. Клиент думал «I\'m stuck», а не «coolant flush».' },
              { icon: '⭐', text: 'Топ-15 для старта (раздел 29) реальный и избирательный — не «всё сразу запустим». Правильное мышление.' },
              { icon: '♻️', text: 'Memberships как стратегия recurring revenue правильно выделены. 16 планов — много, но направление верное.' },
              { icon: '👥', text: 'Сегментация по аудиториям (women-only, elderly, parents) — готовые нишевые лендинги с высокой конверсией.' },
              { icon: '✍️', text: 'Brand wording проработан: 7 вариантов слоганов. «Your car. Zero stress. We handle the rest.» — сильный.' },
            ].map((item, i) => (
              <motion.div key={i} className="koc-strength-item"
                initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.07 }}>
                <span className="koc-item-icon">{item.icon}</span>
                <span>{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="ed-section-title" style={{ color: '#1C5C8F' }}>Что мы добавили и усилили</h3>
          <div className="koc-add-list">
            {[
              { icon: '💰', text: 'Цены и юнит-экономика — pricing framework Standard × Premium × White-Glove × Time-tier, 9 ценовых точек, surge-multiplier модель.' },
              { icon: '⚖️', text: 'Регуляторика — DOT inspection, smog check (CA/NY), VIN verification, lemon law, bonded title, apostille — закрыты полностью.' },
              { icon: '🎯', text: 'TAM и ICP — 3 beachhead-сегмента приоритезированы: busy professionals, snowbirds, fleet tradesmen. С числами по LTV и CAC.' },
              { icon: '🗺️', text: 'Конкурентный ландшафт — 5 игроков (YourMechanic, Wrench, Spiffy, RepairPal, Take5) с анализом funding, revenue, моатов CarETA.' },
              { icon: '🏭', text: 'Provider network strategy — 8 типов провайдеров, количественные targets для Miami MVP, 5 каналов acquisition.' },
            ].map((item, i) => (
              <motion.div key={i} className="koc-add-item"
                initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.07 }}>
                <span className="koc-item-icon">{item.icon}</span>
                <span>{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation hint */}
      <div className="aes-nav-hint" style={{ marginTop: '1.5rem' }}>
        <div className="aes-nav-hint-label">Дальше в этом разделе</div>
        <div className="aes-nav-hint-steps">
          {['Главное', 'Статус', '17 пробелов', '100+ услуг', 'Цены', 'Путь клиента', 'Стратегия', 'Top-10', 'Конкуренты', 'Импакт', 'Провайдеры', 'Вопросы', 'Roadmap'].map((step, i, arr) => (
            <span key={i} className="aes-nav-step">{step}{i < arr.length - 1 ? ' →' : ''}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// SLIDE A: Executive Summary
function SlideKickoffExecSummary() {
  const heroStats = [
    { from: 31, to: 48, label: 'категорий услуг', suffix: '', note: 'было → станет', color: '#C8860A' },
    { from: 250, to: 360, label: 'атомарных услуг', suffix: '+', note: 'расширение каталога', color: '#1C5C8F' },
    { from: 0, to: 17, label: 'выявленных пробелов', suffix: '', note: 'в текущем каталоге', color: '#C0392B' },
    { from: 0, to: 10, label: 'high-impact gaps', suffix: '', note: 'приоритет первого дня', color: '#1C6B3A' },
  ]

  const takeaways = [
    {
      n: '01',
      title: 'Электромобили почти не охвачены',
      text: 'Только 3 EV-услуги в текущем каталоге. В 2026 году это уже 9% всех новых машин в США — растущий сегмент без конкурентного покрытия. Мы добавляем 14 услуг, включая установку домашней зарядной станции (средний чек $1500–3000).',
      color: '#C0392B',
      icon: '⚡',
    },
    {
      n: '02',
      title: 'Маркетплейс требует трёх отдельных частей',
      text: 'Текущий список смешивает всё в один файл. Для платформы-посредника нужны три отдельных раздела: каталог услуг для исполнителей, сценарии для клиентов («не заводится», «хочу помыть»), и категории типов шопов для подключения.',
      color: '#1C5C8F',
      icon: '🏗️',
    },
    {
      n: '03',
      title: 'Нет уровней обслуживания',
      text: 'Каждая услуга должна иметь три уровня: Standard / Premium / White-Glove (как UberX / Comfort / Black) и три уровня срочности: запись / сегодня / срочно. Это даёт 9 ценовых точек на одну услугу и возможность зарабатывать больше с каждого заказа.',
      color: '#6B3A8F',
      icon: '📊',
    },
    {
      n: '04',
      title: 'Подготовка к урагану — уникальная ниша для Miami',
      text: 'Ни один из конкурентов не покрывает климатические события. Запуск в сезон ураганов даёт уникальный PR-момент и эмоциональную связь с брендом — то, что крупные федеральные игроки скопировать не смогут.',
      color: '#D68910',
      icon: '🌀',
    },
    {
      n: '05',
      title: 'B2B-сегмент не охвачен',
      text: 'Автодилеры, компании с рабочими машинами (сантехники, HVAC-мастера), аренда, службы доставки — 13 услуг с предсказуемым ежемесячным доходом. Первая точка входа — наши собственные B2B-клиенты Castells: HVAC и сантехнические компании.',
      color: '#1C6B3A',
      icon: '🏢',
    },
  ]

  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Аудит каталога · Executive Summary</div>
      <h2 className="ed-title">Аудит каталога услуг — главное</h2>
      <p className="ed-lead">
        Краткое резюме для быстрого прочтения. Все детали — 100+ конкретных услуг, карта конкурентов
        и дорожная карта — в следующих вкладках этого раздела.
        CarETA — это маркетплейс (платформа-посредник между автовладельцами и автосервисами, как Uber между пассажирами и водителями).
        Мы провели полный аудит каталога услуг партнёров, выявили пробелы и подготовили план действий.
      </p>

      {/* Hero stats */}
      <div className="aes-hero-grid">
        {heroStats.map((s, i) => (
          <motion.div key={i} className="aes-hero-stat"
            style={{ borderTop: `3px solid ${s.color}` }}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
            <div className="aes-hero-num" style={{ color: s.color }}>
              <Count to={s.to} suffix={s.suffix} />
            </div>
            <div className="aes-hero-label">{s.label}</div>
            <div className="aes-hero-note">{s.note}</div>
          </motion.div>
        ))}
      </div>

      <WavyDivider />

      {/* 5 key takeaways */}
      <h3 className="ed-section-title">5 ключевых выводов</h3>
      <div className="aes-takeaways">
        {takeaways.map((t, i) => (
          <motion.div key={i} className="aes-takeaway"
            style={{ borderLeft: `3px solid ${t.color}` }}
            initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.08 }}>
            <div className="aes-takeaway-head">
              <span className="aes-takeaway-icon">{t.icon}</span>
              <span className="aes-takeaway-n" style={{ color: t.color }}>{t.n}</span>
              <span className="aes-takeaway-title">{t.title}</span>
            </div>
            <div className="aes-takeaway-text">{t.text}</div>
          </motion.div>
        ))}
      </div>

      <WavyDivider />

      {/* Top-10 actions next 30 days */}
      <div className="aes-two-bottom">
        <div>
          <h3 className="ed-section-title">Топ-10 действий — следующие 30 дней</h3>
          <div className="aes-checklist">
            {[
              { n: 1, text: 'Финализировать Top-10 услуг для MVP с клиентом' },
              { n: 2, text: 'Workshop с founder: ICP priority, geo strategy, tier-system decision' },
              { n: 3, text: 'Service catalog v2 — 3-tier pricing framework + Standard/Premium/WG' },
              { n: 4, text: 'Provider onboarding script для первых 50 шопов Miami' },
              { n: 5, text: 'API contracts: Stripe Connect эскроу-flow, Twilio, Maps' },
              { n: 6, text: 'AI-prompts для customer-facing chat (outcome detection)' },
              { n: 7, text: 'Beta launch private — 5 клиентов на 3 услуги' },
              { n: 8, text: 'Live tracking первых 50 заказов с full instrumentation' },
              { n: 9, text: 'Insurance partnership outreach — 3 pilot meetings (Geico/SF/Progressive)' },
              { n: 10, text: 'Iteration sprint-review — weekly cadence с CarETA founder' },
            ].map((item, i) => (
              <motion.div key={i} className="aes-check-item"
                initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                <span className="aes-check-n">{item.n}</span>
                <span className="aes-check-box">☐</span>
                <span>{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="ed-section-title">Метрики успеха — месяц 1</h3>
          <div className="aes-kpis">
            {[
              { kpi: 'Подключённые провайдеры', target: '≥ 20', color: '#1C6B3A' },
              { kpi: 'Зарегистрированные клиенты', target: '≥ 200', color: '#1C5C8F' },
              { kpi: 'Завершённые заказы', target: '≥ 50', color: '#D68910' },
              { kpi: 'Agreement rate (shadow mode)', target: '≥ 85%', color: '#6B3A8F' },
              { kpi: 'NPS первых клиентов', target: '≥ 50', color: '#C0392B' },
            ].map((kpi, i) => (
              <motion.div key={i} className="aes-kpi-row"
                style={{ borderLeft: `3px solid ${kpi.color}` }}
                initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.07 }}>
                <span className="aes-kpi-label">{kpi.kpi}</span>
                <span className="aes-kpi-target" style={{ color: kpi.color }}>{kpi.target}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation hint */}
      <div className="aes-nav-hint">
        <div className="aes-nav-hint-label">Дальше в этом разделе</div>
        <div className="aes-nav-hint-steps">
          {['Статус', '17 пробелов', '100+ услуг', 'Цены', 'Путь клиента', 'Стратегия', 'Top-10', 'Конкуренты', 'Импакт', 'Провайдеры', 'Вопросы', 'Roadmap'].map((step, i, arr) => (
            <span key={i} className="aes-nav-step">{step}{i < arr.length - 1 ? ' →' : ''}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// SUB 1: Статус запуска
function SlideKickoffLaunchStatus() {
  const [activeTracker, setActiveTracker] = useState(null)

  const columns = [
    {
      id: 'done',
      label: 'Готово',
      color: '#1C6B3A',
      bg: 'rgba(28,107,58,0.08)',
      borderColor: 'rgba(28,107,58,0.3)',
      pill: '#1C6B3A',
      items: [
        'Бизнес-модель и финансовая структура (Uber-модель)',
        'Юридическая архитектура (Delaware C-Corp + 1099 + ABC-test)',
        'IT-архитектура: 6 интерфейсов + бэкенд + 4 интеграции',
        'Маркетплейс-стек: Stripe Connect + Twilio + Maps + AI',
        'Брендинг и позиционирование',
        'Аудит каталога — 17 пробелов, 100+ услуг (этот документ)',
      ],
    },
    {
      id: 'wip',
      label: 'В работе',
      color: '#B86A00',
      bg: 'rgba(184,106,0,0.07)',
      borderColor: 'rgba(184,106,0,0.3)',
      pill: '#B86A00',
      items: [
        'Клиентское приложение — каталог, AI-ассистент, оплата',
        'Приложение шопа — заявки, навигация, выплаты',
        'Веб-кабинет шопа — профиль, прайс, аналитика',
        'Admin-панель Carreta — модерация, KPI, саппорт',
        'Бэкенд API — заказы, рейтинги, OBD',
        'Onboarding первых 20 шопов в Miami',
      ],
    },
    {
      id: 'next',
      label: 'Следующий этап',
      color: '#1C5C8F',
      bg: 'rgba(28,92,143,0.07)',
      borderColor: 'rgba(28,92,143,0.3)',
      pill: '#1C5C8F',
      items: [
        'Beta-launch Miami: 50 шопов, 500 клиентов',
        'Страховая партнёрка (Geico / State Farm pilot)',
        'Микрострахование колёс и стекла',
        'BNPL-интеграция (Affirm / Klarna)',
        'Франшизная программа для мобильных моек',
      ],
    },
    {
      id: 'q3',
      label: 'Q3 и далее',
      color: '#6B3A8F',
      bg: 'rgba(107,58,143,0.07)',
      borderColor: 'rgba(107,58,143,0.3)',
      pill: '#6B3A8F',
      items: [
        'Расширение: FL, TX, CA, NY (5–10 городов)',
        'OBD-устройства собственного бренда',
        'Корпоративный портал для fleet-клиентов',
        'Международный запуск (EU pilot)',
      ],
    },
  ]

  const trackers = [
    { label: 'Frontend MVP', pct: 65, color: '#1C5C8F' },
    { label: 'Backend MVP', pct: 70, color: '#1C6B3A' },
    { label: 'AI Engine', pct: 50, color: '#C8860A' },
    { label: 'Stripe эскроу-flow', pct: 80, color: '#D68910' },
    { label: 'Admin-панель', pct: 40, color: '#B86A00' },
    { label: 'Provider onboarding', pct: 25, color: '#6B3A8F' },
    { label: 'Compliance docs', pct: 90, color: '#1C6B3A' },
  ]

  const team = [
    { role: 'Founder · Castells', name: 'Продукт + Sales', desc: 'Архитектура продукта, клиент-коммуникация, стратегия', color: '#C8860A', status: 'Активен' },
    { role: 'CTO · Yura', name: 'Backend + AI', desc: 'ex-Vohha TMS — backend архитектура, AI-движок, API', color: '#1C5C8F', status: 'Активен' },
    { role: 'Frontend · Nikel', name: 'UI + Design', desc: 'Клиентское app, дизайн-система, все интерфейсы', color: '#1C6B3A', status: 'Активен' },
    { role: 'Dev #4–9 · план', name: '6 разработчиков', desc: 'Восточная Европа, Senior/Mid+. По roadmap — месяц 1–4', color: '#7F8C8D', status: 'Найм' },
  ]

  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Начало работы · Статус</div>
      <h2 className="ed-title">Что уже сделано и что строится прямо сейчас</h2>
      <p className="ed-lead">
        Команда Castells совместно с партнёрами из CarETA уже ведёт разработку платформы.
        Это не питч «мы планируем» — это питч «мы уже строим».
        Зелёное — готово. Оранжевое — в активной разработке. Синее — следующий этап. Фиолетовое — Q3 и далее.
      </p>

      <div className="lnch-status-board">
        {columns.map((col, ci) => (
          <motion.div key={col.id} className="lnch-status-col"
            style={{ borderTop: `3px solid ${col.color}`, background: col.bg }}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: ci * 0.1 }}>
            <div className="lnch-status-col-header" style={{ color: col.color }}>
              {col.label}
            </div>
            <div className="lnch-status-items">
              {col.items.map((item, ii) => (
                <div key={ii} className="lnch-status-item">
                  <span className="lnch-pill" style={{ background: col.pill + '20', color: col.pill, border: `1px solid ${col.pill}40` }}>
                    {col.id === 'done' ? '✓' : col.id === 'wip' ? '●' : col.id === 'next' ? '→' : '◇'}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <WavyDivider />

      <h3 className="ed-section-title">Live Status Tracker</h3>
      <p style={{ fontFamily: 'var(--sans)', fontSize: '0.95rem', color: 'var(--fg-mid)', marginBottom: '1.2rem' }}>
        Текущий прогресс по ключевым модулям платформы
      </p>
      <div className="lnch-tracker-grid">
        {trackers.map((t, i) => (
          <motion.div key={i} className="lnch-tracker-row"
            initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}>
            <div className="lnch-tracker-label">{t.label}</div>
            <div className="lnch-tracker-bar-wrap">
              <motion.div className="lnch-tracker-bar"
                style={{ background: t.color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${t.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.0, delay: i * 0.07 + 0.2, ease: [0.22, 1, 0.36, 1] }} />
            </div>
            <div className="lnch-tracker-pct" style={{ color: t.color }}>{t.pct}%</div>
          </motion.div>
        ))}
      </div>

      <WavyDivider />

      <h3 className="ed-section-title">Команда сейчас</h3>
      <div className="lnch-team-grid">
        {team.map((m, i) => (
          <motion.div key={i} className="lnch-team-card"
            style={{ borderTop: `3px solid ${m.color}` }}
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}>
            <div className="lnch-team-avatar" style={{ background: m.color + '20', color: m.color }}>
              {m.role[0]}
            </div>
            <div className="lnch-team-info">
              <div className="lnch-team-role" style={{ color: m.color }}>{m.role}</div>
              <div className="lnch-team-name">{m.name}</div>
              <div className="lnch-team-desc">{m.desc}</div>
            </div>
            <span className="lnch-team-status" style={{
              background: m.status === 'Найм' ? 'rgba(127,140,141,0.12)' : 'rgba(28,107,58,0.12)',
              color: m.status === 'Найм' ? '#7F8C8D' : '#1C6B3A',
              border: `1px solid ${m.status === 'Найм' ? 'rgba(127,140,141,0.3)' : 'rgba(28,107,58,0.3)'}`,
            }}>{m.status}</span>
          </motion.div>
        ))}
      </div>

      <div className="ed-pullquote" style={{ marginTop: '2rem' }}>
        Это не питч «мы планируем». Это питч «мы уже строим». Каждый день в репозитории появляются новые коммиты.
      </div>
    </div>
  )
}

// SUB 2: 17 пробелов
function SlideKickoffGaps() {
  const gaps = [
    { n: 1, title: 'EV-сегмент почти не закрыт', priority: 'High', color: '#C0392B', services: 14, why: '9% новых машин в США — электрики, в Калифорнии уже 20%+. Текущий каталог упоминает EV лишь в 3 пунктах. Растущий сегмент без конкурентного покрытия — открытое окно для захвата.', icon: '⚡', tam: '$42B', growth: '+28%', ticket: '$250–3000', whynow: '9% новых машин EV, в CA 20%+' },
    { n: 2, title: 'ADAS calibration отсутствует', priority: 'High', color: '#C0392B', services: 7, why: 'После любой замены лобового стекла, бампера или зеркала — обязательна по NHTSA с 2024 года. Очень маржинальная услуга, слабо конкурентная на marketplace.', icon: '🎯', tam: '$4.2B', growth: '+35%', ticket: '$250–650', whynow: 'NHTSA mandate 2024+' },
    { n: 3, title: 'Aftermarket / customization', priority: 'High', color: '#C0392B', services: 22, why: 'Рынок $60B+ в год в США. Идеальный формат для marketplace: разнотипные шопы, высокий средний чек, низкая ценовая эластичность.', icon: '🔧', tam: '$60B', growth: '+6%', ticket: '$150–2500', whynow: 'Gen Z personalization wave' },
    { n: 4, title: 'Anti-theft / Security', priority: 'Medium', color: '#D68910', services: 10, why: 'Кражи каталитических конвертеров взорвались с 2021 года. Отдельная маржинальная ниша с нарастающим спросом в Miami и крупных городах.', icon: '🔒', tam: '$2.8B', growth: '+47%', ticket: '$80–400', whynow: 'Cat converter thefts +1500% с 2019' },
    { n: 5, title: 'Glass / windshield (полная категория)', priority: 'High', color: '#C0392B', services: 11, why: 'В каталоге слабо представлен. Rock chip repair — до $100, идеальна для мобильной модели. Высокая частота, быстрая сделка.', icon: '🪟', tam: '$7.1B', growth: '+8%', ticket: '$80–1200', whynow: 'ADAS recalibration требует certified shops' },
    { n: 6, title: 'RV / Camper / Trailer / Boat', priority: 'Medium', color: '#D68910', services: 14, why: 'Огромный рынок Florida / Arizona / Texas. В текущем каталоге только "motor home cleaning". Сезонный но высокочековый сегмент.', icon: '🚐', tam: '$11.4B', growth: '+12%', ticket: '$200–2000', whynow: 'Post-COVID RV boom продолжается' },
    { n: 7, title: 'Motorcycle / Powersports', priority: 'Low', color: '#27AE60', services: 8, why: 'Если CarETA = «всё что катается» — мотоциклы и ATV дают трафик и ширину охвата без существенных затрат на добавление.', icon: '🏍️', tam: '$4.6B', growth: '+4%', ticket: '$50–800', whynow: 'Secondary трафик при low CAC' },
    { n: 8, title: 'Pre-purchase / Selling — отдельный продукт', priority: 'High', color: '#C0392B', services: 11, why: 'Decision-point с максимальной готовностью платить. Mobile pre-purchase inspection — $200–400 средний чек, привлекает новых клиентов в воронку.', icon: '🔍', tam: '$850M', growth: '+18%', ticket: '$200–450', whynow: 'Used car market + scam fears' },
    { n: 9, title: 'Hurricane / disaster services', priority: 'High', color: '#C0392B', services: 11, why: 'Miami-specific! Hurricane season — идеальный moment of relevance. В текущем каталоге — ноль. Конкурентный moat для регионального лидерства.', icon: '🌀', tam: '$1.2B (FL)', growth: '+22%', ticket: '$89–389', whynow: '2024 — самый разрушительный season' },
    { n: 10, title: 'Microinsurance / warranty', priority: 'High', color: '#C0392B', services: 12, why: 'В бизнес-модели отдельный revenue stream ($12–20/мес), но в services list нет конкретных продуктов. Огромная упущенная подписочная категория.', icon: '🛡️', tam: '$5.5B', growth: '+24%', ticket: '$5–25/мес', whynow: 'Insurtech boom + chargeback fatigue' },
    { n: 11, title: 'B2B сегменты не закрыты', priority: 'High', color: '#C0392B', services: 13, why: 'Used car dealers, auctions, rental cleanup, last-mile vans, government fleets — упущены. B2B дает предсказуемый recurring revenue с первого месяца.', icon: '🏢', tam: '$32B', growth: '+9%', ticket: '$1K–15K/мес', whynow: 'Gig-economy fleet growth + labor shortage' },
    { n: 12, title: 'Childcare / accessibility', priority: 'Medium', color: '#D68910', services: 9, why: 'CPST-сертифицированный inspection — премиум-услуга. Wheelchair conversion и hand controls — медленный рост, но высокая лояльность и уникальность.', icon: '👶', tam: '$1.8B', growth: '+7%', ticket: '$50–400', whynow: 'Aging population + CPST awareness' },
    { n: 13, title: 'Documentation / digital twin', priority: 'High', color: '#C0392B', services: 12, why: 'Retention moat для платформы. Digital vehicle file = customer lock-in. Клиент уходит туда, где хранится история его машины.', icon: '📋', tam: '$720M', growth: '+31%', ticket: '$5–15/мес', whynow: 'Data portability laws (CA, NY)' },
    { n: 14, title: 'Outcome-based packages', priority: 'High', color: '#C0392B', services: 8, why: 'В разделе 25 обозначено, но не доведено. Для marketplace критично: клиент выбирает «I\'m stuck», а не «coolant flush».', icon: '📦', tam: 'UX концепция', growth: 'Conv +35%', ticket: 'Bundled', whynow: 'Gen Z prefers outcome over feature' },
    { n: 15, title: 'Membership tiers недостаточно дифференцированы', priority: 'Medium', color: '#D68910', services: 0, why: '16 планов без чёткой иерархии. Нужно 4–5 tier\'ов с upgrade path и visible value gap между уровнями.', icon: '⭐', tam: 'Retention', growth: 'LTV +220%', ticket: '$19–199/мес', whynow: 'DashPass аналог — subscription pays' },
    { n: 16, title: 'Регуляторно-критичные услуги', priority: 'High', color: '#C0392B', services: 13, why: 'DOT inspection, smog check, VIN verification, bonded title, lemon law — compliance-pieces, обязательные для полноты платформы и доверия клиентов.', icon: '⚖️', tam: '$2.1B', growth: '+5%', ticket: '$40–300', whynow: 'State-by-state regulatory expansion' },
    { n: 17, title: 'Modern trends 2026', priority: 'Medium', color: '#D68910', services: 11, why: 'AI inspection via phone, live mechanic video consult, OBD-prediction — создают «wow it\'s 2026» ощущение и укрепляют бренд как инновационную платформу.', icon: '🤖', tam: 'Differentiator', growth: 'Critical', ticket: 'Premium', whynow: '2026 customer expects AI-first UX' },
  ]

  const priorityLabel = { High: 'Высокий', Medium: 'Средний', Low: 'Низкий' }
  const priorityColor = { High: '#C0392B', Medium: '#D68910', Low: '#27AE60' }

  // Impact vs Effort positions for heatmap (x=effort 0-100, y=impact 0-100)
  const heatmapDots = [
    { n: 1, x: 45, y: 88, label: 'EV' },
    { n: 2, x: 30, y: 92, label: 'ADAS' },
    { n: 3, x: 60, y: 85, label: 'Aftermarket' },
    { n: 4, x: 25, y: 68, label: 'Anti-theft' },
    { n: 5, x: 20, y: 82, label: 'Glass' },
    { n: 6, x: 55, y: 60, label: 'RV/Boat' },
    { n: 7, x: 35, y: 45, label: 'Moto' },
    { n: 8, x: 22, y: 90, label: 'Pre-purchase' },
    { n: 9, x: 28, y: 78, label: 'Hurricane' },
    { n: 10, x: 50, y: 88, label: 'Insurance' },
    { n: 11, x: 65, y: 86, label: 'B2B' },
    { n: 12, x: 70, y: 52, label: 'Childcare' },
    { n: 13, x: 40, y: 80, label: 'Doc/Twin' },
    { n: 14, x: 55, y: 84, label: 'Outcomes' },
    { n: 15, x: 30, y: 62, label: 'Tiers' },
    { n: 16, x: 35, y: 76, label: 'Regulatory' },
    { n: 17, x: 45, y: 65, label: '2026 trends' },
  ]

  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Аудит каталога · 17 пробелов</div>
      <h2 className="ed-title">Глубокий аудит каталога услуг</h2>
      <p className="ed-lead">
        Текущий каталог из 31 категории — мощная база. Но в нём отсутствуют 17 крупных пластов услуг,
        которые в 2026 году либо обязательны (ADAS calibration), либо растут двузначными процентами (EV),
        либо являются маржинальными moat'ами для marketplace-модели.
      </p>

      {/* Heatmap — Impact vs Effort */}
      <h3 className="ed-section-title">Матрица Impact × Effort — что добавить в первую очередь</h3>
      <p style={{ fontFamily: 'var(--sans)', fontSize: '1.0rem', color: 'var(--fg-mid)', marginBottom: '1rem', lineHeight: 1.6 }}>
        На горизонтальной оси — сколько усилий требует добавление каждого пробела (данные, разработка, партнёрства).
        На вертикальной — насколько сильно это влияет на выручку и позицию на рынке.
        Верхний левый угол = добавить в первую очередь.
      </p>
      <div className="lnch-heatmap-wrap">
        <svg className="lnch-heatmap-svg" viewBox="0 0 500 340" preserveAspectRatio="xMidYMid meet">
          {/* Background zones */}
          <rect x="0" y="0" width="250" height="170" fill="rgba(192,57,43,0.06)" rx="0" />
          <rect x="250" y="0" width="250" height="170" fill="rgba(214,137,16,0.06)" rx="0" />
          <rect x="0" y="170" width="250" height="170" fill="rgba(214,137,16,0.06)" rx="0" />
          <rect x="250" y="170" width="250" height="170" fill="rgba(127,140,141,0.04)" rx="0" />
          {/* Zone labels */}
          <text x="125" y="20" textAnchor="middle" fill="rgba(192,57,43,0.5)" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="0.1em">ПРИОРИТЕТ 1</text>
          <text x="375" y="20" textAnchor="middle" fill="rgba(214,137,16,0.5)" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="0.1em">ПРИОРИТЕТ 2</text>
          <text x="125" y="188" textAnchor="middle" fill="rgba(214,137,16,0.4)" fontSize="9" fontFamily="Inter, sans-serif">Средний</text>
          <text x="375" y="188" textAnchor="middle" fill="rgba(127,140,141,0.4)" fontSize="9" fontFamily="Inter, sans-serif">Отложить</text>
          {/* Grid lines */}
          <line x1="250" y1="0" x2="250" y2="340" stroke="rgba(15,15,14,0.1)" strokeWidth="1" strokeDasharray="4,4" />
          <line x1="0" y1="170" x2="500" y2="170" stroke="rgba(15,15,14,0.1)" strokeWidth="1" strokeDasharray="4,4" />
          {/* Axes labels */}
          <text x="250" y="332" textAnchor="middle" fill="rgba(15,15,14,0.4)" fontSize="9" fontFamily="Inter, sans-serif">EFFORT →</text>
          <text x="8" y="170" textAnchor="middle" fill="rgba(15,15,14,0.4)" fontSize="9" fontFamily="Inter, sans-serif" transform="rotate(-90,8,170)">IMPACT ↑</text>
          <text x="12" y="12" fill="rgba(15,15,14,0.3)" fontSize="8" fontFamily="Inter, sans-serif">Высокий</text>
          <text x="12" y="328" fill="rgba(15,15,14,0.3)" fontSize="8" fontFamily="Inter, sans-serif">Низкий</text>
          <text x="8" y="12" fill="rgba(15,15,14,0.3)" fontSize="8" fontFamily="Inter, sans-serif">Низкий</text>
          <text x="460" y="330" fill="rgba(15,15,14,0.3)" fontSize="8" fontFamily="Inter, sans-serif">Высокий</text>
          {/* Dots */}
          {heatmapDots.map((d) => {
            const cx = (d.x / 100) * 500
            const cy = (1 - d.y / 100) * 340
            const dotColor = d.x < 50 && d.y > 70 ? '#C0392B' : d.x >= 50 && d.y > 70 ? '#D68910' : '#7F8C8D'
            return (
              <g key={d.n}>
                <circle cx={cx} cy={cy} r="13" fill={dotColor} fillOpacity="0.15" stroke={dotColor} strokeWidth="1.5" />
                <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fill={dotColor} fontSize="9" fontFamily="Inter, sans-serif" fontWeight="700">{d.n}</text>
                <text x={cx} y={cy + 18} textAnchor="middle" fill={dotColor} fontSize="7.5" fontFamily="Inter, sans-serif">{d.label}</text>
              </g>
            )
          })}
        </svg>
      </div>

      <WavyDivider />

      <h3 className="ed-section-title" style={{ marginTop: '1.5rem' }}>Все 17 пробелов — что за ниша, сколько можно заработать</h3>
      <p style={{ fontFamily: 'var(--sans)', fontSize: '1.0rem', color: 'var(--fg-mid)', marginBottom: '1.2rem', lineHeight: 1.6 }}>
        В каждой карточке: <strong>TAM</strong> — общий объём этого рынка в США в год (насколько большая ниша).
        <strong> Рост</strong> — как быстро растёт в год.
        <strong> Чек</strong> — сколько платит клиент за одну услугу.
        <strong> Почему сейчас</strong> — главная причина добавить именно в 2026.
      </p>
      <div className="lnch-gaps-grid">
        {gaps.map((g, i) => (
          <motion.div key={g.n} className="lnch-gap-card"
            style={{ borderTop: `3px solid ${g.color}` }}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: (i % 4) * 0.08 }}>
            <div className="lnch-gap-top">
              <span className="lnch-gap-num" style={{ color: g.color }}>{g.n}</span>
              <span className="lnch-gap-icon">{g.icon}</span>
            </div>
            <div className="lnch-gap-title">{g.title}</div>
            <div className="lnch-gap-why">{g.why}</div>
            {/* TAM data block */}
            <div className="gap-data-block">
              <div className="gap-data-item">
                <span className="gap-data-label">TAM</span>
                <span className="gap-data-val" style={{ color: g.color }}>{g.tam}</span>
              </div>
              <div className="gap-data-item">
                <span className="gap-data-label">Рост</span>
                <span className="gap-data-val" style={{ color: '#1C6B3A' }}>{g.growth}</span>
              </div>
              <div className="gap-data-item">
                <span className="gap-data-label">Чек</span>
                <span className="gap-data-val">{g.ticket}</span>
              </div>
              <div className="gap-data-why">
                <span className="gap-data-label">Почему сейчас</span>
                <span>{g.whynow}</span>
              </div>
            </div>
            <div className="lnch-gap-footer">
              <span className="lnch-priority-badge" style={{ background: g.color + '15', color: g.color, border: `1px solid ${g.color}40` }}>
                {priorityLabel[g.priority]}
              </span>
              {g.services > 0 && (
                <span className="lnch-services-count">+{g.services} услуг</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// SUB 3: 100+ услуг — полный каталог
function SlideKickoffCatalog() {
  const [openSection, setOpenSection] = useState([0, 1, 7, 9, 10])

  const toggleSection = (i) => {
    setOpenSection(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    )
  }

  const catalog = [
    {
      title: 'EV-сегмент',
      icon: '⚡',
      color: '#C0392B',
      count: 14,
      services: [
        'EV battery health diagnostics (через OBD-II + brand-specific tools)',
        '12V auxiliary battery service (Tesla, Rivian — частая поломка)',
        'Home charger installation coordination (Tesla Wall Connector, ChargePoint, Wallbox) — $1500–3000 за установку',
        'Public charger troubleshooting',
        'EV trip planning service (Plugshare / A Better Routeplanner консультация)',
        'Battery pre-conditioning перед дальней поездкой',
        'Software / firmware update assistance (Tesla OTA, обновление навигации)',
        'EV tire service (специальные шины, частая ротация)',
        'Regen brake fluid service',
        'High-voltage battery coolant service',
        'EV-specific detailing (без воды на high-voltage компонентах)',
        'V2H / V2L setup (Vehicle-to-Home для F-150 Lightning, Ioniq 5)',
        'DC fast charger coordination для сломавшихся EV',
        'Range anxiety concierge — выезд с power bank / portable charger',
      ],
    },
    {
      title: 'ADAS calibration',
      icon: '🎯',
      color: '#C0392B',
      count: 7,
      services: [
        'Front-facing camera calibration',
        'Radar sensor calibration (после замены бампера)',
        '360° camera system recalibration',
        'Blind spot monitor calibration',
        'Park assist sensor calibration',
        'ADAS calibration coordination после collision',
        'Pre-collision system diagnostic',
      ],
    },
    {
      title: 'Aftermarket / customization',
      icon: '🔧',
      color: '#C0392B',
      count: 22,
      services: [
        'Window tinting (различный % VLT, ceramic vs dyed)',
        'Aftermarket headlight upgrade (LED retrofit, HID conversion)',
        'Fog light installation',
        'Underglow / interior LED installation',
        'Audio system upgrade (head unit, amps, subs)',
        'Apple CarPlay / Android Auto retrofit для старых машин',
        'Backup camera retrofit',
        'Remote start retrofit',
        'Dash cam install (front + rear + interior)',
        'GPS tracker installation (anti-theft)',
        'AirTag stash spot installation',
        'Performance chip / ECU tune',
        'Cold air intake installation',
        'Cat-back exhaust installation',
        'Lowering springs / coilovers',
        'Lift kit installation (trucks / SUVs)',
        'Roof rack / cargo box installation',
        'Trailer hitch installation',
        'Bike rack / ski rack installation',
        'Running boards / step bars',
        'Bedliner installation (trucks)',
        'Tonneau cover installation (trucks)',
      ],
    },
    {
      title: 'Anti-theft / Security',
      icon: '🔒',
      color: '#D68910',
      count: 10,
      services: [
        'Catalytic converter shield / cage installation (CatStrap, MillerCAT)',
        'Catalytic converter etching (anti-theft VIN engraving)',
        'VIN window etching',
        'Steering wheel lock fitting (Club, Disklok)',
        'Aftermarket alarm system install',
        'Kill switch installation',
        'GPS tracker subscription service',
        'Faraday key pouch service (anti-relay attack)',
        'Garage Defender installation',
        'Tire lug nut lock installation',
      ],
    },
    {
      title: 'Glass / windshield',
      icon: '🪟',
      color: '#C0392B',
      count: 11,
      services: [
        'Windshield rock chip repair (до $100, мобильная)',
        'Windshield crack repair',
        'Side window replacement',
        'Rear window replacement',
        'Sunroof / moonroof glass replacement',
        'Sunroof leak diagnosis & repair',
        'Window regulator + motor replacement',
        'Privacy glass installation',
        'Anti-theft window film',
        'Heat-rejection ceramic film',
        'Headlight lens replacement',
      ],
    },
    {
      title: 'RV / Camper / Trailer / Boat',
      icon: '🚐',
      color: '#D68910',
      count: 14,
      services: [
        'RV pre-trip inspection',
        'RV winterization / de-winterization',
        'RV slide-out maintenance',
        'RV roof seal check & repair',
        'RV awning repair',
        'RV waste tank cleaning',
        'RV battery system check',
        'Boat trailer service',
        'Boat winterization',
        'Travel trailer inspection',
        '5th wheel inspection',
        'Camper van conversion service',
        'Trailer brake controller installation',
        'Trailer light wiring repair',
      ],
    },
    {
      title: 'Motorcycle / Powersports',
      icon: '🏍️',
      color: '#27AE60',
      count: 8,
      services: [
        'Motorcycle pickup / drop-off',
        'Motorcycle inspection',
        'Motorcycle winter storage prep',
        'Motorcycle battery service',
        'ATV / UTV service coordination',
        'Scooter service',
        'Track day prep service',
        'Motorcycle apparel / gear delivery',
      ],
    },
    {
      title: 'Pre-purchase / Selling',
      icon: '🔍',
      color: '#C0392B',
      count: 11,
      services: [
        'Mobile pre-purchase inspection ($200–400)',
        'Carfax + AutoCheck report pulling',
        'VIN history verification',
        'Title check service (liens, salvage, flood)',
        'Test drive accompaniment (механик едет с покупателем)',
        'Independent mechanic second opinion',
        'Negotiation coaching (что просить срезать с цены)',
        'Off-site inspection at auction (Manheim / Copart)',
        'Online listing analysis',
        'Dealership F&I review',
        'Trade-in valuation independent',
      ],
    },
    {
      title: 'Hurricane / disaster services',
      icon: '🌀',
      color: '#C0392B',
      count: 11,
      services: [
        'Pre-hurricane vehicle prep',
        'Hurricane garage relocation service',
        'Window taping / mylar protection',
        'Post-flood vehicle assessment',
        'Flood damage cleanup (interior, electronics)',
        'Saltwater corrosion protection',
        'Salt-air detail (Miami coastal)',
        'Wildfire evacuation prep (CA)',
        'Tornado shelter relocation (TX)',
        'Snow emergency preparation kit installation',
        'Winter survival kit installation',
      ],
    },
    {
      title: 'Microinsurance / warranty',
      icon: '🛡️',
      color: '#C0392B',
      count: 12,
      services: [
        'Tire & wheel protection plan ($12–15/мес)',
        'Windshield / glass coverage ($8–10/мес)',
        'Key fob replacement plan ($5–7/мес)',
        'Interior protection plan',
        'Paint protection plan',
        'Roadside premium membership',
        'Lockout coverage',
        'Battery replacement coverage',
        'Wear & tear waiver (для leased vehicles)',
        'Pet damage coverage',
        'Lost item recovery service',
        'Diminished value claim assistance',
      ],
    },
    {
      title: 'B2B сегменты',
      icon: '🏢',
      color: '#C0392B',
      count: 13,
      services: [
        'Used car dealer prep packages',
        'Auction prep services (Manheim sellers)',
        'Repossession recovery services',
        'Rental car turnover service',
        'Last-mile delivery van fleet maintenance',
        'Rideshare driver fleet service',
        'Government fleet',
        'Construction company truck fleet',
        'Plumber / electrician / HVAC tradesmen vans',
        'School bus inspection coordination',
        'Limo / black car service',
        'Wedding car prep',
        'Corporate executive fleet detail',
      ],
    },
    {
      title: 'Childcare / accessibility',
      icon: '👶',
      color: '#D68910',
      count: 9,
      services: [
        'Certified Child Passenger Safety Technician inspection',
        'LATCH system inspection',
        'Booster seat fitting service',
        'Child seat re-installation после детейлинга',
        'Wheelchair-accessible vehicle conversion',
        'Hand controls installation для disabled drivers',
        'Pedal extender installation',
        'Swivel seat installation (elderly)',
        'Ramp / lift maintenance',
      ],
    },
    {
      title: 'Documentation / digital twin',
      icon: '📋',
      color: '#C0392B',
      count: 12,
      services: [
        'Digital vehicle file creation',
        'Lost service record reconstruction',
        'Service history audit',
        'VIN-decoded original equipment list',
        'Maintenance schedule personalization',
        'Annual vehicle health report (PDF от CarETA)',
        'Cost-of-ownership tracking',
        'Tax-deductible mileage log service',
        'Insurance documentation organizer',
        'Warranty tracking',
        'Recall monitoring',
        'Service due alerts',
      ],
    },
    {
      title: 'Регуляторно-критичные услуги',
      icon: '⚖️',
      color: '#C0392B',
      count: 13,
      services: [
        'DOT inspection (commercial drivers — federal mandate)',
        'CDL medical card coordination',
        'Smog check / emissions (CA, NY обязательно)',
        'VIN verification (CA, HI, ME)',
        'Out-of-state title transfer',
        'Bonded title processing',
        'Salvage title rebuild documentation',
        'Lemon law claim assistance',
        'Recall completion verification',
        'Diplomat plate process (NY, DC)',
        'Apostille для vehicle export',
        'Custom plate ordering',
        'Disabled placard application',
      ],
    },
    {
      title: 'Modern trends 2026',
      icon: '🤖',
      color: '#D68910',
      count: 11,
      services: [
        'Subscription-based car care (ежемесячная коробка как Dollar Shave Club для cars)',
        'AI vehicle inspection via phone (клиент снимает 360° → AI оценивает)',
        'Live video consultation with mechanic',
        'Photo report после каждой услуги (premium tier always)',
        'Before / after с AR markup',
        'Maintenance prediction via OBD telemetry',
        '«Next service» AI-планировщик',
        'Carbon footprint tracking',
        'Sustainable detail packages (eco-friendly only)',
        'Vehicle longevity coaching',
        'Resale-value optimization service',
      ],
    },
  ]

  const outcomePkgs = [
    { scenario: '«Рожать поехала, машина не заводится»', trigger: '911-style', stack: 'jump-start mobile + 24/7 dispatch + emergency rideshare credit', tier: 'Premium', color: '#C0392B', cost: '$299' },
    { scenario: '«Завтра показ в риэлтор-агентстве»', trigger: 'Same-day', stack: 'exterior wash + interior vacuum + tire shine + freshener (2hr)', tier: 'Express', color: '#D68910', cost: '$189' },
    { scenario: '«Ушёл на свадьбу, нужно домой»', trigger: 'Late night', stack: 'sober driver + drive-home-in-your-car', tier: 'Standard', color: '#1C5C8F', cost: '$129' },
    { scenario: '«Лизинг возвращать через неделю»', trigger: 'Schedule', stack: 'inspection + spot detail + minor cosmetic + paperwork', tier: 'Lease Return', color: '#6B3A8F', cost: '$349' },
    { scenario: '«Купил машину, не знаю что с ней»', trigger: 'Onboarding', stack: 'full inspection + service history pull + mech consultation + plan', tier: 'New Owner', color: '#1C6B3A', cost: '$499' },
    { scenario: '«Уезжаю на 3 месяца»', trigger: 'Schedule', stack: 'storage prep + battery tender + cover + monthly check-in', tier: 'Snowbird', color: '#B86A00', cost: '$89/мес×3' },
    { scenario: '«Ребёнка отвезти на первый день школы»', trigger: 'Trigger', stack: 'car wash + air freshener + child seat check', tier: 'Family', color: '#27AE60', cost: '$79' },
    { scenario: '«Hurricane на горизонте»', trigger: 'Weather alert', stack: 'move to higher ground + window taping + emergency kit', tier: 'Storm', color: '#8B2E2E', cost: '$89–389' },
  ]

  const memberTiers = [
    { tier: 'Free', price: '$0', included: '1 заявка/мес, скидка 5%', who: 'Онбординг', color: '#7F8C8D', margin: '$0 (acquisition)', targetPct: '40%' },
    { tier: 'Essential', price: '$19', included: '3 заявки/мес, 10% off, бесплатный jump-start', who: 'Бытовой', color: '#1C5C8F', margin: '$14 (74%)', targetPct: '25%' },
    { tier: 'Pro', price: '$49', included: 'Unlimited, 15% off, pickup, priority booking', who: 'Busy professional', color: '#1C6B3A', margin: '$32 (65%)', targetPct: '20%' },
    { tier: 'Family', price: '$79', included: 'До 3 машин, kid services, school-run backup', who: 'Семья', color: '#D68910', margin: '$50 (63%)', targetPct: '8%' },
    { tier: 'Executive', price: '$199', included: 'Concierge + chauffeur 4hrs/мес + white-glove', who: 'Premium', color: '#B86A00', margin: '$115 (58%)', targetPct: '5%' },
    { tier: 'Fleet', price: 'от $299', included: 'Per-vehicle, multi-vehicle dashboard', who: 'B2B', color: '#6B3A8F', margin: 'Varies', targetPct: '2%' },
  ]

  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Начало работы · Полный список</div>
      <h2 className="ed-title">100+ конкретных услуг для добавления в каталог</h2>
      <p className="ed-lead">
        Конкретные услуги по каждому из 17 выявленных пробелов. Список сгруппирован по тематикам —
        нажмите на любую группу чтобы раскрыть и посмотреть что входит.
        Список не финальный — команда CarETA сможет отметить что запускать в первую очередь,
        а что оставить на потом.
      </p>

      {/* Accordion catalog */}
      <div className="lnch-catalog-accordion">
        {catalog.map((cat, i) => {
          const isOpen = openSection.includes(i)
          return (
            <div key={i} className="lnch-cat-item" style={{ borderLeft: `3px solid ${cat.color}` }}>
              <button
                className="lnch-cat-header"
                onClick={() => toggleSection(i)}
                aria-expanded={isOpen}>
                <div className="lnch-cat-header-left">
                  <span className="lnch-cat-icon">{cat.icon}</span>
                  <span className="lnch-cat-name">{cat.title}</span>
                  <span className="lnch-cat-count" style={{ color: cat.color }}>+{cat.count} услуг</span>
                </div>
                <span className="lnch-cat-chevron" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  ▾
                </span>
              </button>
              {isOpen && (
                <motion.div
                  className="lnch-cat-body"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}>
                  <ul className="lnch-services-list">
                    {cat.services.map((s, j) => (
                      <li key={j}>{s}</li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          )
        })}
      </div>

      <WavyDivider />

      {/* Outcome-based packages */}
      <h3 className="ed-section-title" style={{ marginTop: '1.5rem' }}>Готовые пакеты под конкретную ситуацию — 8 сценариев</h3>
      <p style={{ fontFamily: 'var(--sans)', fontSize: '1.0rem', color: 'var(--fg-mid)', marginBottom: '1.2rem', lineHeight: 1.6 }}>
        Вместо отдельных услуг — готовые пакеты «под ситуацию». Клиент не выбирает «промывку системы охлаждения» —
        он выбирает «я уезжаю на 3 месяца, позаботьтесь о машине». Мы сами подбираем что нужно сделать.
      </p>
      <div className="lnch-outcomes-table">
        <div className="lnch-outcomes-head">
          <div>Сценарий</div>
          <div>Trigger</div>
          <div>Состав пакета</div>
          <div>Tier</div>
          <div>Цена</div>
        </div>
        {outcomePkgs.map((pkg, i) => (
          <motion.div key={i} className="lnch-outcomes-row"
            initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.06 }}>
            <div className="lnch-outcomes-scenario">{pkg.scenario}</div>
            <div className="lnch-outcomes-trigger">
              <span className="lnch-trigger-tag" style={{ background: pkg.color + '15', color: pkg.color, border: `1px solid ${pkg.color}30` }}>{pkg.trigger}</span>
            </div>
            <div className="lnch-outcomes-stack">{pkg.stack}</div>
            <div>
              <span className="lnch-tier-badge" style={{ background: pkg.color, color: '#fff' }}>{pkg.tier}</span>
            </div>
            <div className="lnch-outcomes-cost" style={{ color: pkg.color }}>{pkg.cost}</div>
          </motion.div>
        ))}
      </div>

      <WavyDivider />

      {/* Membership tiers */}
      <h3 className="ed-section-title" style={{ marginTop: '1.5rem' }}>Уровни подписки — как зарабатывать повторяющийся доход каждый месяц</h3>
      <p style={{ fontFamily: 'var(--sans)', fontSize: '1.0rem', color: 'var(--fg-mid)', marginBottom: '1.2rem', lineHeight: 1.6 }}>
        Подписка — это предсказуемый доход каждый месяц, независимо от количества заказов.
        5 уровней с понятным шагом: каждый следующий уровень даёт ощутимо больше, чем предыдущий.
        Маржа — сколько остаётся платформе после выплат провайдерам. Целевой % — сколько клиентов должны быть на этом уровне.
      </p>
      <div className="lnch-tiers-grid">
        {memberTiers.map((t, i) => (
          <motion.div key={i} className="lnch-tier-card"
            style={{ borderTop: `3px solid ${t.color}` }}
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}>
            <div className="lnch-tier-name" style={{ color: t.color }}>{t.tier}</div>
            <div className="lnch-tier-price">{t.price}</div>
            <div className="lnch-tier-who">{t.who}</div>
            <div className="lnch-tier-included">{t.included}</div>
            <div className="lnch-tier-meta">
              <div className="lnch-tier-meta-row">
                <span className="lnch-tier-meta-label">Маржа</span>
                <span className="lnch-tier-meta-val" style={{ color: t.color }}>{t.margin}</span>
              </div>
              <div className="lnch-tier-meta-row">
                <span className="lnch-tier-meta-label">Целевой %</span>
                <span className="lnch-tier-meta-val">{t.targetPct}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// SLIDE B: Ценовой фреймворк
function SlideKickoffPricing() {
  const tiers = ['Standard', 'Premium', 'White-Glove']
  const times = [
    { label: 'Emergency', mult: '×2.0', color: '#C0392B', bg: 'rgba(192,57,43,0.06)' },
    { label: 'Same-day', mult: '×1.4', color: '#D68910', bg: 'rgba(214,137,16,0.06)' },
    { label: 'Scheduled', mult: '×1.0', color: '#1C6B3A', bg: 'rgba(28,107,58,0.06)' },
  ]
  const tierColors = ['#7F8C8D', '#1C5C8F', '#6B3A8F']

  const matrix = [
    [
      { service: 'Roadside jump-start', price: '$99' },
      { service: 'Mobile wash', price: '$59' },
      { service: 'Oil change', price: '$49' },
    ],
    [
      { service: 'Roadside + tow', price: '$199' },
      { service: 'Detail + interior', price: '$149' },
      { service: 'Pickup detail', price: '$99' },
    ],
    [
      { service: '24/7 personal manager', price: '$499' },
      { service: 'Same-day concierge full', price: '$349' },
      { service: 'Scheduled white-glove', price: '$249' },
    ],
  ]

  const examples = [
    {
      title: 'Mobile pre-purchase inspection',
      icon: '🔍',
      rows: [
        { tier: 'Standard', time: 'Scheduled', price: '$200', note: 'Стандартный инспектор, запись на завтра' },
        { tier: 'Premium', time: 'Same-day', price: '$280', note: '×1.4 — senior механик, в тот же день' },
        { tier: 'White-Glove', time: 'Emergency', price: '$560', note: 'Выехал на дилершип через час после звонка, сертифицированный мастер' },
      ],
    },
    {
      title: 'EV home charger installation',
      icon: '⚡',
      rows: [
        { tier: 'Standard', time: 'Scheduled', price: '$1,500', note: 'Запись на след. неделю, стандартный electrician' },
        { tier: 'Premium', time: 'Same-day', price: '$2,100', note: '×1.4 — EV-сертифицированный, в тот же день' },
        { tier: 'White-Glove', time: 'Emergency', price: 'N/A', note: 'Электромонтажные работы не делаются «в спешке» по safety-протоколу' },
      ],
    },
    {
      title: 'Hurricane vehicle prep',
      icon: '🌀',
      rows: [
        { tier: 'Standard', time: 'Scheduled', price: '$89', note: 'За 48 часов до hurricane, стандартный пакет' },
        { tier: 'Premium', time: 'Same-day', price: '$189', note: 'За 12 часов до шторма' },
        { tier: 'White-Glove', time: 'Emergency', price: '$389', note: 'За 4 часа до landfall — команда выезжает на дом' },
      ],
    },
  ]

  const timeColColors = ['#C0392B', '#D68910', '#1C6B3A']

  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Начало работы · Цены</div>
      <h2 className="ed-title">Как работает ценообразование — три уровня × три скорости</h2>
      <p className="ed-lead">
        Девять ценовых точек на каждую услугу: три уровня сервиса (Standard / Premium / White-Glove — как разные классы в Uber)
        на три уровня срочности (запись / сегодня / прямо сейчас). Как Uber Surge-ценообразование,
        только для авто-сервисов — прозрачно, с разбивкой цены и явным согласием клиента перед оплатой.
        Никакого сюрприза на кассе.
      </p>

      {/* 3×3 Matrix */}
      <div className="apx-matrix-wrap">
        {/* Column headers: time tiers */}
        <div className="apx-matrix-grid">
          {/* Empty top-left corner */}
          <div className="apx-corner" />
          {times.map((t, ti) => (
            <div key={ti} className="apx-col-header" style={{ background: t.bg, borderTop: `3px solid ${t.color}` }}>
              <div className="apx-col-label" style={{ color: t.color }}>{t.label}</div>
              <div className="apx-col-mult" style={{ color: t.color }}>{t.mult}</div>
            </div>
          ))}
          {/* Rows */}
          {tiers.map((tier, ri) => (
            <>
              <div key={`row-${ri}`} className="apx-row-header" style={{ borderLeft: `3px solid ${tierColors[ri]}` }}>
                <span className="apx-row-label" style={{ color: tierColors[ri] }}>{tier}</span>
              </div>
              {matrix[ri].map((cell, ci) => (
                <motion.div key={`cell-${ri}-${ci}`} className="apx-cell"
                  style={{ background: times[ci].bg }}
                  initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ duration: 0.35, delay: (ri * 3 + ci) * 0.05 }}>
                  <div className="apx-cell-service">{cell.service}</div>
                  <div className="apx-cell-price" style={{ color: tierColors[ri] }}>{cell.price}</div>
                </motion.div>
              ))}
            </>
          ))}
        </div>
      </div>

      <WavyDivider />

      {/* Worked examples */}
      <h3 className="ed-section-title">Примеры расчёта по фреймворку</h3>
      <div className="apx-examples">
        {examples.map((ex, ei) => (
          <motion.div key={ei} className="apx-example"
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: ei * 0.12 }}>
            <div className="apx-ex-title">
              <span className="apx-ex-icon">{ex.icon}</span>
              {ex.title}
            </div>
            <div className="apx-ex-table">
              <div className="apx-ex-head">
                <div>Tier</div>
                <div>Время</div>
                <div>Цена</div>
                <div>Детали</div>
              </div>
              {ex.rows.map((row, ri) => (
                <div key={ri} className="apx-ex-row">
                  <div>
                    <span className="apx-ex-tier-badge" style={{ background: tierColors[ri] + '18', color: tierColors[ri], border: `1px solid ${tierColors[ri]}35` }}>
                      {row.tier}
                    </span>
                  </div>
                  <div>
                    <span className="apx-time-tag" style={{ background: timeColColors[ri < 1 ? 2 : ri === 1 ? 1 : 0] + '18', color: timeColColors[ri < 1 ? 2 : ri === 1 ? 1 : 0] }}>
                      {row.time}
                    </span>
                  </div>
                  <div className="apx-ex-price" style={{ color: row.price === 'N/A' ? '#7F8C8D' : tierColors[ri] }}>
                    {row.price}
                  </div>
                  <div className="apx-ex-note">{row.note}</div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <WavyDivider />

      {/* Footer note */}
      <div className="apx-footer-note">
        <div className="apx-footer-label">Surge pricing — как это работает</div>
        <div className="apx-footer-grid">
          <div className="apx-footer-item">
            <span className="apx-footer-mult" style={{ color: '#1C6B3A' }}>×0.85–1.0</span>
            <span>Off-peak, много провайдеров свободны</span>
          </div>
          <div className="apx-footer-item">
            <span className="apx-footer-mult" style={{ color: '#D68910' }}>×1.0–1.5</span>
            <span>Normal range, стандартный спрос</span>
          </div>
          <div className="apx-footer-item">
            <span className="apx-footer-mult" style={{ color: '#C0392B' }}>×2.0+</span>
            <span>Emergency tier — явное согласие клиента в UI перед оплатой</span>
          </div>
        </div>
      </div>

      <WavyDivider />

      {/* Maria case study */}
      <h3 className="ed-section-title">Real-world: как работает фреймворк для живого клиента</h3>
      <motion.div className="apx-case-study"
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <div className="apx-case-study-header">
          <div className="apx-case-study-avatar">👩</div>
          <div className="apx-case-study-who">
            <div className="apx-case-study-name">Мария, 34 года, Miami Beach</div>
            <div className="apx-case-study-desc">Риэлтор, 2021 Tesla Model Y, Essential Member ($19/мес)</div>
          </div>
        </div>
        <div className="apx-case-study-scenario">
          «Завтра утром большой показ дома — приезжают 4 покупателя. Машина грязная после поездки в Everglades.
          Уже вечер, и мне некогда ехать на мойку. Нужно что-то прямо сейчас.»
        </div>
        <div className="apx-case-steps">
          {[
            { n: '1', text: 'Мария открывает CarETA → тапает «Хочу помыть» → AI спрашивает: «Когда нужно? Срочно или завтра утром?»' },
            { n: '2', text: 'Она отвечает: «Сегодня вечером, желательно до 9pm». AI определяет: Same-day tier, Premium.' },
            { n: '3', text: 'Три варианта: Standard сегодня-вечером $83 (10% скидка члена) / Premium $117 / White-Glove $207. Она выбирает Premium.' },
            { n: '4', text: 'Провайдер приезжает в 7:40pm. Exterior + interior detail, tire shine. Фото до/после в приложении.' },
            { n: '5', text: 'Итоговый чек: $117 − 10% = $105.30. CarETA получает 20% = $21. Провайдер — $84.' },
          ].map((s, i) => (
            <div key={i} className="apx-case-step">
              <span className="apx-case-step-n">{s.n}</span>
              <span>{s.text}</span>
            </div>
          ))}
        </div>
        <div className="apx-case-result">
          {[
            { label: 'Цена для Марии', val: '$105.30' },
            { label: 'Доход CarETA', val: '$21.06' },
            { label: 'Доход провайдера', val: '$84.24' },
          ].map((c, i) => (
            <div key={i} className="apx-case-result-cell">
              <span className="apx-case-result-label">{c.label}</span>
              <span className="apx-case-result-val">{c.val}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// SLIDE C: Customer Journey Map
function SlideKickoffJourney() {
  const steps = [
    {
      n: '01',
      title: 'Что случилось с машиной?',
      subtitle: 'Главный экран',
      color: '#C8860A',
      desc: 'Не список из 30 услуг, а 8 больших кнопок с ситуациями. Человек выбирает что произошло — не что нужно заказать. Это покрывает около 80% всех обращений.',
      screen: [
        { icon: '🔧', label: '«Машина не заводится»' },
        { icon: '🚗', label: '«Хочу помыть»' },
        { icon: '🛞', label: '«Спустило колесо»' },
        { icon: '📋', label: '«Регулярное ТО»' },
        { icon: '🍻', label: '«Нужен трезвый водитель»' },
        { icon: '🛒', label: '«Хочу купить машину»' },
        { icon: '📦', label: '«Лизинг возвращаю»' },
        { icon: '❓', label: '«Что-то ещё»' },
      ],
      metrics: [
        { label: 'Time to screen', val: '0 сек' },
        { label: 'Tap-to-proceed', val: '1 тап' },
        { label: 'Drop-off target', val: '< 15%' },
      ],
      cialdini: { principle: 'Liking', note: 'Визуальный язык «ситуации» снижает тревогу — клиент видит себя, а не «coolant flush».' },
    },
    {
      n: '02',
      title: 'AI задаёт несколько вопросов',
      subtitle: 'AI-ассистент',
      color: '#1C5C8F',
      desc: 'Открывается чат. AI по очереди — не все сразу — задаёт уточняющие вопросы. По ответам сам определяет что конкретно нужно, насколько срочно, и какой уровень сервиса подходит.',
      screen: [
        { icon: '💬', label: 'Где находится машина?' },
        { icon: '⏰', label: 'Когда нужно? Срочно?' },
        { icon: '📸', label: 'Прикрепить фото (опц.)' },
        { icon: '🤖', label: 'AI подбирает услугу + tier' },
      ],
      metrics: [
        { label: 'Avg dialog length', val: '2–3 сообщения' },
        { label: 'Intent accuracy', val: '≥ 88%' },
        { label: 'Time to quote', val: '< 60 сек' },
      ],
      cialdini: { principle: 'Authority', note: 'AI задаёт умные вопросы → клиент воспринимает платформу как эксперта, а не таксометр.' },
    },
    {
      n: '03',
      title: 'Выбор цены и исполнителя',
      subtitle: 'Выбор и оплата',
      color: '#1C6B3A',
      desc: 'AI показывает три варианта: Standard (обычная цена) / Premium (+40%) / White-Glove (премиум). Для каждого — фото шопа, рейтинг, через сколько минут приедет, и что конкретно входит в цену. Никакого сюрприза при оплате.',
      screen: [
        { icon: '⭐', label: 'Рейтинг и фото шопа' },
        { icon: '🕐', label: 'ETA и цена' },
        { icon: '📊', label: 'Standard / Premium / WG' },
        { icon: '💳', label: 'Confirm / Compare / Human' },
      ],
      metrics: [
        { label: 'Tier upgrade rate', val: 'цель 35%' },
        { label: 'Time to confirm', val: '< 90 сек' },
        { label: 'Abandon at price', val: '< 20%' },
      ],
      cialdini: { principle: 'Anchoring', note: 'White-Glove показан первым — Standard кажется «выгодной» альтернативой, Premium — «разумным» выбором.' },
    },
    {
      n: '04',
      title: 'Видишь, где исполнитель — в реальном времени',
      subtitle: 'В процессе',
      color: '#6B3A8F',
      desc: 'Как в Uber — карта с движущейся точкой. Push-уведомления на каждом этапе: выехал, через 5 минут, прибыл, начал, завершил. Чат с исполнителем доступен в любой момент. Кнопка отмены — до приезда, бесплатно.',
      screen: [
        { icon: '🗺️', label: 'Карта движения техника' },
        { icon: '🔔', label: 'Push: выехал / прибыл' },
        { icon: '💬', label: 'Чат с техником' },
        { icon: '⏱️', label: 'Таймер ожидания' },
      ],
      metrics: [
        { label: 'Push open rate', val: '> 60%' },
        { label: 'In-app chat usage', val: 'цель 40%' },
        { label: 'Cancellation rate', val: '< 5%' },
      ],
      cialdini: { principle: 'Commitment', note: 'Клиент наблюдает за движением техника — психологически уже «в процессе», отмена воспринимается как потеря.' },
    },
    {
      n: '05',
      title: 'Отчёт, оценка и следующий шаг',
      subtitle: 'После завершения',
      color: '#C0392B',
      desc: 'Фото до/после в приложении — видно что сделали. Оценка шопа. Чаевые мастеру — опционально. Работа автоматически записывается в «цифровой файл машины» — через год это будет как история болезни, только для автомобиля.',
      screen: [
        { icon: '📷', label: 'Фото до/после' },
        { icon: '⭐', label: 'Оценить шоп' },
        { icon: '💝', label: 'Чаевые технику' },
        { icon: '🔄', label: 'Upsell подписки' },
      ],
      metrics: [
        { label: 'Rating completion', val: '> 70%' },
        { label: 'Tip rate', val: 'цель 25%' },
        { label: 'Subscription upsell', val: 'цель 12%' },
      ],
      cialdini: { principle: 'Reciprocity', note: 'Фото до/после + чаевые-предложение активируют взаимность: клиент получил нечто ценное → хочет отдать (оценка, чаевые, подписка).' },
    },
  ]

  const comparison = [
    { param: 'Первый экран', traditional: 'Список из 30+ услуг', careta: '8 кнопок-ситуаций — выбираешь что произошло' },
    { param: 'Время до оплаты', traditional: '5–8 минут', careta: '90 секунд' },
    { param: 'Нужно ли разбираться в авто', traditional: 'Да — нужно знать «flush охлаждайки»', careta: 'Нет — AI сам определит что нужно' },
    { param: 'Как зарабатывают больше с клиента', traditional: 'Показывают рекламу попутных услуг', careta: 'Предлагают Premium-уровень в момент выбора' },
    { param: 'Как удерживают клиента', traditional: 'Email через месяц «пора на ТО»', careta: 'Цифровой файл машины пополняется автоматически' },
  ]

  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Аудит каталога · UX</div>
      <h2 className="ed-title">Как будет выглядеть путь обычного человека в приложении CarETA</h2>
      <p className="ed-lead">
        Большинство автомобильных приложений работают так: открываешь app, видишь длинный список
        услуг — «замена масла», «диагностика подвески», «промывка тормозной системы». Чтобы
        что-то заказать, нужно знать, что тебе нужно. А обычный человек не знает. Он чувствует,
        что машина странно себя ведёт, или ему срочно нужно куда-то ехать, или жена попросила помыть к выходным.
      </p>

      <div className="ajm-explainer-block">
        <p className="ajm-explainer-text">
          CarETA строится иначе. Главный экран не показывает каталог — он показывает <strong>ситуации</strong>.
          «Машина не заводится». «Хочу помыть». «Спустило колесо». «Купил машину, не знаю что с ней».
          Человек выбирает свою ситуацию, а не пытается угадать название услуги — и AI-ассистент
          сам уточняет детали и предлагает решение.
        </p>
        <p className="ajm-explainer-text">
          Это маленькое изменение даёт большой эффект. Конверсия выше — людям не нужно думать что они хотят.
          Время до заказа короче — 90 секунд вместо 5–8 минут. Лояльность выше — приложение «понимает» меня,
          а не отправляет в каталог. Меньше ошибок — человек не закажет «промывку охлаждающей жидкости»
          когда нужна была просто диагностика.
        </p>
      </div>

      {/* 5-step journey flow */}
      <h3 className="ed-section-title" style={{ marginTop: '2rem' }}>Пять шагов — как это выглядит в приложении</h3>
      <div className="ajm-flow">
        {steps.map((step, i) => (
          <motion.div key={i} className="ajm-step"
            style={{ borderTop: `3px solid ${step.color}` }}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.1 }}>
            <div className="ajm-step-header">
              <span className="ajm-step-n" style={{ color: step.color }}>{step.n}</span>
              <div>
                <div className="ajm-step-title">{step.title}</div>
                <div className="ajm-step-subtitle">{step.subtitle}</div>
              </div>
            </div>
            <div className="ajm-step-desc">{step.desc}</div>
            {/* App screen mockup */}
            <div className="ajm-screen-mock" style={{ borderColor: step.color + '30' }}>
              <div className="ajm-screen-bar" style={{ background: step.color }}>
                <span>CarETA</span>
                <span style={{ opacity: 0.7, fontSize: '0.6rem' }}>{step.subtitle}</span>
              </div>
              <div className="ajm-screen-items">
                {step.screen.map((item, j) => (
                  <div key={j} className="ajm-screen-item">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Per-stage metrics */}
            <div className="ajm-stage-metrics">
              {step.metrics.map((m, j) => (
                <div key={j} className="ajm-metric-row">
                  <span className="ajm-metric-label">{m.label}</span>
                  <span className="ajm-metric-val" style={{ color: step.color }}>{m.val}</span>
                </div>
              ))}
            </div>
            {/* Cialdini anchor */}
            <div className="ajm-cialdini-strip">
              <span className="ajm-cialdini-label">{step.cialdini.principle}:</span>
              {step.cialdini.note}
            </div>
            {/* Connector arrow — not on last */}
            {i < steps.length - 1 && (
              <div className="ajm-arrow" style={{ color: step.color }}>→</div>
            )}
          </motion.div>
        ))}
      </div>

      <WavyDivider />

      {/* Comparison table */}
      <h3 className="ed-section-title">Сравнение с обычными автомобильными приложениями</h3>
      <p style={{ fontFamily: 'var(--sans)', fontSize: '0.95rem', color: 'var(--fg-mid)', marginBottom: '1rem' }}>
        Все приложения левой колонки реально существуют и работают. CarETA строится принципиально иначе.
      </p>
      <div className="ajm-compare-table">
        <div className="ajm-compare-head">
          <div>Что сравниваем</div>
          <div>Обычное авто-приложение</div>
          <div className="ajm-careta-col">CarETA</div>
        </div>
        {comparison.map((row, i) => (
          <motion.div key={i} className="ajm-compare-row"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.05 }}>
            <div className="ajm-compare-param">{row.param}</div>
            <div className="ajm-compare-trad">{row.traditional}</div>
            <div className="ajm-careta-col ajm-compare-ca">{row.careta}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// SLIDE D: Импакт на dev-roadmap
function SlideKickoffImpact() {
  const current = [
    '6 интерфейсов (4 MVP + 2 Phase 2)',
    'Бэкенд + AI-движок + 4 интеграции',
    '11 месяцев до production',
    '6 разработчиков Восточная Европа',
    'Stripe Connect, Twilio, Maps, Claude/OpenAI',
  ]

  const noChange = [
    'Новые услуги — это data в каталоге, не новый код',
    'Provider категории — справочник в admin-панели',
    'Outcome-based UX — frontend-логика, уже в плане',
    'Membership tiers — billing-модуль уже спроектирован',
    'Pricing tier × time tier — pricing engine в плане',
  ]

  const smallScope = [
    { item: 'ADAS calibration coordination', detail: 'Отдельный flow + partner network для шопов', effort: '+2 нед' },
    { item: 'EV home charger installation', detail: 'Onboarding лицензированных electricians, отдельный flow', effort: '+1 нед' },
    { item: 'Hurricane / disaster mode', detail: 'Weather API integration + activation logic', effort: '+1 нед' },
  ]

  const phase2 = [
    { item: 'AI vehicle inspection via phone', detail: 'Требует CV-модели или партнёра (Ravin AI, Monk AI)' },
    { item: 'B2B fleet portal', detail: 'Отдельный кабинет для fleet-клиентов' },
    { item: 'Insurance-claim-flow integration', detail: 'Требует подписанного pilot со страховой' },
    { item: 'Microinsurance products', detail: 'Требует licensing + underwriter partner' },
  ]

  const regulatory = [
    { item: 'VIN verification (CA, HI)', detail: 'Нужна аккредитация в этих штатах' },
    { item: 'DOT inspection', detail: 'Federal license для коммерческих ТС' },
    { item: 'Smog check (CA, NY)', detail: 'Государственная сертификация шопов' },
  ]

  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Начало работы · Влияние на разработку</div>
      <h2 className="ed-title">Что новые услуги значат для сроков и бюджета разработки</h2>
      <p className="ed-lead">
        Из 17 выявленных пробелов только 3 требуют дополнительной разработки в Phase 1.
        Остальные 14 — это данные в базе, контент и партнёрства с шопами, а не новый код.
        Текущий 11-месячный план разработки не меняется — мы просто добавляем записи в каталог.
      </p>

      <div className="adv-two-col">
        {/* Current plan */}
        <div className="adv-col">
          <div className="adv-col-header adv-header-current">Текущий план</div>
          <div className="adv-col-body">
            {current.map((item, i) => (
              <div key={i} className="adv-item adv-item-current">
                <span className="adv-dot adv-dot-current">●</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What changes */}
        <div className="adv-col">
          <div className="adv-col-header adv-header-changes">Что меняется</div>
          <div className="adv-col-body">
            <div className="adv-group-label" style={{ color: '#1C6B3A' }}>✅ Без изменений</div>
            {noChange.map((item, i) => (
              <div key={i} className="adv-item">
                <span className="adv-dot" style={{ color: '#1C6B3A' }}>✓</span>
                <span>{item}</span>
              </div>
            ))}

            <div className="adv-group-label" style={{ color: '#D68910', marginTop: '1rem' }}>➕ Небольшой scope (+2–4 нед. Phase 1)</div>
            {smallScope.map((item, i) => (
              <div key={i} className="adv-item adv-item-scope">
                <span className="adv-dot" style={{ color: '#D68910' }}>+</span>
                <div>
                  <div className="adv-item-name">{item.item}</div>
                  <div className="adv-item-detail">{item.detail}</div>
                </div>
                <span className="adv-effort-badge">{item.effort}</span>
              </div>
            ))}

            <div className="adv-group-label" style={{ color: '#1C5C8F', marginTop: '1rem' }}>🟡 Phase 2 candidates</div>
            {phase2.map((item, i) => (
              <div key={i} className="adv-item">
                <span className="adv-dot" style={{ color: '#1C5C8F' }}>◷</span>
                <div>
                  <div className="adv-item-name">{item.item}</div>
                  <div className="adv-item-detail">{item.detail}</div>
                </div>
              </div>
            ))}

            <div className="adv-group-label" style={{ color: '#C0392B', marginTop: '1rem' }}>⚠️ Регуляторные блокеры (не code)</div>
            {regulatory.map((item, i) => (
              <div key={i} className="adv-item">
                <span className="adv-dot" style={{ color: '#C0392B' }}>!</span>
                <div>
                  <div className="adv-item-name">{item.item}</div>
                  <div className="adv-item-detail">{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <WavyDivider />

      {/* Bottom line */}
      <div className="adv-callout">
        <div className="adv-callout-label">Bottom line</div>
        <div className="adv-callout-text">
          Из 17 пробелов только 3 требуют dev-work в Phase 1.
          Остальные 14 — data, content, partnership.
          Текущий 11-месячный roadmap <strong>не меняется</strong>.
        </div>
        <div className="adv-callout-budget">
          Бюджет на ADAS / EV / Hurricane модули
          <span className="adv-callout-num">+$15–25K</span>
        </div>
      </div>

      <WavyDivider />

      {/* Risk Register */}
      <h3 className="ed-section-title" style={{ marginTop: '1.5rem' }}>8 рисков и как с ними работать</h3>
      <p style={{ fontFamily: 'var(--sans)', fontSize: '1.0rem', color: 'var(--fg-mid)', marginBottom: '1rem', lineHeight: 1.6 }}>
        Каждый запуск продукта имеет риски. Мы их описали заранее, чтобы не столкнуться с ними неожиданно.
        HIGH — нужно разбираться прямо сейчас. MED — важно, но есть время. LOW — следим, не критично.
      </p>
      <div className="adv-risk-table">
        <div className="adv-risk-head">
          <div>Риск</div>
          <div>Тип</div>
          <div>Уровень</div>
          <div>Митигация</div>
        </div>
        {[
          { risk: 'Низкое quality провайдеров на старте', type: 'Операционный', level: 'HIGH', levelColor: '#C0392B', mitigation: 'Manual vetting первых 50 шопов + shadow mode первые 2 недели. Background check обязателен.' },
          { risk: 'Регуляторный блок на sober driver в FL', type: 'Регуляторный', level: 'MED', levelColor: '#D68910', mitigation: 'Юридический анализ FL TNC-требований до запуска. Soft launch без маркетинга.' },
          { risk: 'Stripe Connect блок (identity verification)', type: 'Технический', level: 'MED', levelColor: '#D68910', mitigation: 'Начать KYC провайдеров за 6 нед до launch. Иметь backup (Adyen / Braintree).' },
          { risk: 'Низкий organic demand без маркетинга', type: 'Рыночный', level: 'HIGH', levelColor: '#C0392B', mitigation: 'Pre-launch waitlist 500+ клиентов. Castells B2B contacts как beachhead. $5K paid launch budget.' },
          { risk: 'Провайдер не приехал / опоздал', type: 'Операционный', level: 'HIGH', levelColor: '#C0392B', mitigation: 'Backup pool 2-го провайдера в радиусе 5 миль. Auto-redispatch за 10 мин. Компенсация $20 клиенту.' },
          { risk: 'Scope creep — добавление фич во время разработки', type: 'Проектный', level: 'MED', levelColor: '#D68910', mitigation: 'Железный feature freeze после недели 4. Change requests — только в отдельный backlog. Weekly sprint demo.' },
          { risk: 'AI intent detection ошибки (< 85%)', type: 'Технический', level: 'LOW', levelColor: '#1C6B3A', mitigation: 'Human fallback — «поговорить с агентом». A/B тест prompt-версий. Monthly accuracy review.' },
          { risk: 'Конкурент копирует hurricane prep за сезон', type: 'Конкурентный', level: 'LOW', levelColor: '#1C6B3A', mitigation: 'Бренд + provider relationships + hyper-local brand awareness — скопировать за 1 сезон невозможно.' },
        ].map((r, i) => (
          <motion.div key={i} className="adv-risk-row"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.05 }}>
            <div className="adv-risk-name">{r.risk}</div>
            <div className="adv-risk-type">{r.type}</div>
            <div>
              <span className="adv-risk-badge" style={{ background: r.levelColor + '18', color: r.levelColor, border: `1px solid ${r.levelColor}35` }}>
                {r.level}
              </span>
            </div>
            <div className="adv-risk-mitigation">{r.mitigation}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// SLIDE E: Provider Network Strategy
function SlideKickoffProviders() {
  const providers = [
    { n: 1, type: 'Mobile mechanics (1099)', priority: 'P0', pColor: '#C0392B', miamiTarget: '12–15', services: 'Roadside, diagnostics, repair', angle: 270 },
    { n: 2, type: 'Mobile detailing teams', priority: 'P0', pColor: '#C0392B', miamiTarget: '8–10', services: 'Wash, detail, ceramic coating', angle: 315 },
    { n: 3, type: 'Body shops / collision', priority: 'P0', pColor: '#C0392B', miamiTarget: '5–8', services: 'Collision repair, ADAS, glass', angle: 0 },
    { n: 4, type: 'Pickup/delivery drivers', priority: 'P0', pColor: '#C0392B', miamiTarget: '10–15', services: 'Concierge transport, sober driver', angle: 45 },
    { n: 5, type: 'EV-certified electricians', priority: 'P1', pColor: '#D68910', miamiTarget: '3–5', services: 'Home charger install, V2H', angle: 90 },
    { n: 6, type: 'Tire & wheel mobile', priority: 'P1', pColor: '#D68910', miamiTarget: '4–6', services: 'Mobile tire service, TPMS', angle: 135 },
    { n: 7, type: 'Glass repair specialists', priority: 'P1', pColor: '#D68910', miamiTarget: '3–5', services: 'Windshield, rock chip repair', angle: 180 },
    { n: 8, type: 'Speciality (RV, motorcycle)', priority: 'P2', pColor: '#27AE60', miamiTarget: '2–3', services: 'RV winterize, moto service', angle: 225 },
  ]

  const channels = [
    { n: 1, title: 'Cold outreach + AI', desc: 'Первые 30–50 шопов закрываем личными встречами и AI-персонализированным outreach' },
    { n: 2, title: 'Industry associations', desc: 'Florida Auto Dealers Association, IDA (International Detailing Association), MEMA' },
    { n: 3, title: 'Inverse marketing', desc: 'Собрать 200 клиентов в waitlist в Miami — шопы сами приходят за лидами' },
    { n: 4, title: 'Referral bonus', desc: '$200 за каждого приведённого верифицированного шопа — реферальная цепочка' },
    { n: 5, title: 'Equipment partnerships', desc: 'XPEL / 3M рекомендуют CarETA своим дистрибьюторам и студиям' },
  ]

  const priorityLabel = { P0: 'Критично', P1: 'Важно', P2: 'Желательно' }

  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Начало работы · Провайдеры</div>
      <h2 className="ed-title">Кого подключаем в первые 6 месяцев</h2>
      <p className="ed-lead">
        Маркетплейс без исполнителей — это пустая витрина. 100+ новых услуг, которые мы добавляем,
        требуют 8 разных типов партнёров-провайдеров. Для старта в Miami цель — 47–67 активных шопов.
        Это на ~30% больше первоначального плана (20–50) — за счёт расширенного каталога.
        Ниже: схема, таблица по типам шопов, экономика одного провайдера, и как мы их привлекаем.
      </p>

      {/* Hub-and-spoke SVG */}
      <div className="apv-hub-wrap">
        <svg className="apv-hub-svg" viewBox="0 0 500 400" preserveAspectRatio="xMidYMid meet">
          {/* Center hub */}
          <circle cx="250" cy="200" r="48" fill="rgba(200,134,10,0.12)" stroke="var(--accent)" strokeWidth="2" />
          <text x="250" y="195" textAnchor="middle" fill="var(--accent)" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="700">CarETA</text>
          <text x="250" y="212" textAnchor="middle" fill="var(--accent)" fontSize="9" fontFamily="Inter, sans-serif">Marketplace</text>
          {/* Spokes and nodes */}
          {providers.map((p) => {
            const rad = (p.angle * Math.PI) / 180
            const spokeLen = 145
            const nx = 250 + Math.cos(rad) * spokeLen
            const ny = 200 + Math.sin(rad) * spokeLen
            const labelX = 250 + Math.cos(rad) * (spokeLen + 28)
            const labelY = 200 + Math.sin(rad) * (spokeLen + 28)
            return (
              <g key={p.n}>
                <line x1={250 + Math.cos(rad) * 48} y1={200 + Math.sin(rad) * 48}
                  x2={nx - Math.cos(rad) * 20} y2={ny - Math.sin(rad) * 20}
                  stroke={p.pColor} strokeWidth="1.5" strokeDasharray={p.priority === 'P2' ? '4,3' : p.priority === 'P1' ? '6,2' : 'none'} strokeOpacity="0.6" />
                <circle cx={nx} cy={ny} r="20" fill={p.pColor + '18'} stroke={p.pColor} strokeWidth="1.5" />
                <text x={nx} y={ny + 1} textAnchor="middle" dominantBaseline="middle" fill={p.pColor} fontSize="9" fontFamily="Inter, sans-serif" fontWeight="700">{p.n}</text>
                <text x={labelX} y={labelY - 5} textAnchor="middle" fill="var(--fg-mid)" fontSize="7.5" fontFamily="Inter, sans-serif" fontWeight="500">
                  {p.type.split(' ').slice(0, 2).join(' ')}
                </text>
                <text x={labelX} y={labelY + 7} textAnchor="middle" fill={p.pColor} fontSize="7" fontFamily="Inter, sans-serif">
                  {p.miamiTarget}
                </text>
              </g>
            )
          })}
          {/* Legend */}
          <g transform="translate(8, 360)">
            <circle cx="8" cy="8" r="6" fill="rgba(192,57,43,0.15)" stroke="#C0392B" strokeWidth="1.5" />
            <text x="18" y="12" fill="var(--fg-mid)" fontSize="8" fontFamily="Inter, sans-serif">P0 — приоритет</text>
          </g>
          <g transform="translate(110, 360)">
            <circle cx="8" cy="8" r="6" fill="rgba(214,137,16,0.15)" stroke="#D68910" strokeWidth="1.5" />
            <text x="18" y="12" fill="var(--fg-mid)" fontSize="8" fontFamily="Inter, sans-serif">P1 — важно</text>
          </g>
          <g transform="translate(190, 360)">
            <circle cx="8" cy="8" r="6" fill="rgba(39,174,96,0.15)" stroke="#27AE60" strokeWidth="1.5" />
            <text x="18" y="12" fill="var(--fg-mid)" fontSize="8" fontFamily="Inter, sans-serif">P2 — желательно</text>
          </g>
        </svg>
      </div>

      {/* Provider table */}
      <div className="apv-table">
        <div className="apv-table-head">
          <div>#</div>
          <div>Тип провайдера</div>
          <div>Приоритет</div>
          <div>Цель Miami</div>
          <div>Покрывает услуги</div>
        </div>
        {providers.map((p, i) => (
          <motion.div key={i} className="apv-table-row"
            initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.05 }}>
            <div className="apv-table-n" style={{ color: p.pColor }}>{p.n}</div>
            <div className="apv-table-type">{p.type}</div>
            <div>
              <span className="apv-priority-badge" style={{ background: p.pColor + '18', color: p.pColor, border: `1px solid ${p.pColor}35` }}>
                {p.priority} {priorityLabel[p.priority]}
              </span>
            </div>
            <div className="apv-table-target">{p.miamiTarget}</div>
            <div className="apv-table-services">{p.services}</div>
          </motion.div>
        ))}
        <div className="apv-table-total">
          <div></div>
          <div>Итого Miami MVP</div>
          <div></div>
          <div style={{ fontWeight: 700, color: 'var(--accent)' }}>47–67</div>
          <div style={{ color: 'var(--fg-mid)', fontSize: '0.82rem' }}>провайдеров за 6 месяцев</div>
        </div>
      </div>

      <WavyDivider />

      {/* Provider Economics */}
      <h3 className="ed-section-title">Сколько зарабатывает провайдер на платформе</h3>
      <p style={{ fontFamily: 'var(--sans)', fontSize: '1.0rem', color: 'var(--fg-mid)', marginBottom: '1rem', lineHeight: 1.6 }}>
        Чтобы подключить 47–67 шопов в Miami — нужно показать им реальные цифры.
        Расчёт ниже — для активного мобильного мастера, 8 заказов в день, 5 рабочих дней в неделю.
        CarETA берёт 20% от каждого заказа (стандарт для маркетплейсов — как Uber берёт ~25% с водителя).
      </p>
      <div className="apv-econ-grid">
        {[
          { label: 'Средний чек', val: '$125', note: 'mix of wash + roadside + inspection', color: '#1C5C8F' },
          { label: 'Заказов в месяц', val: '160', note: '8/день × 20 рабочих дней', color: '#1C5C8F' },
          { label: 'Gross GMV/мес', val: '$20,000', note: 'выручка до комиссии', color: '#C8860A' },
          { label: 'CarETA take (20%)', val: '$4,000', note: 'платформенная комиссия', color: '#C0392B' },
          { label: 'Провайдер получает', val: '$16,000', note: 'до расходов', color: '#1C6B3A' },
          { label: 'Расходы провайдера', val: '~$6,000', note: 'fuel, tools, insurance, налоги', color: '#D68910' },
          { label: 'Чистый доход', val: '~$10,000', note: 'в месяц для активного мастера', color: '#1C6B3A' },
          { label: 'Breakeven по заказам', val: '≥ 40', note: 'заказов/мес чтобы оправдать онбординг', color: '#6B3A8F' },
        ].map((e, i) => (
          <motion.div key={i} className="apv-econ-cell"
            style={{ borderTop: `3px solid ${e.color}` }}
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.35, delay: (i % 4) * 0.06 }}>
            <div className="apv-econ-val" style={{ color: e.color }}>{e.val}</div>
            <div className="apv-econ-label">{e.label}</div>
            <div className="apv-econ-note">{e.note}</div>
          </motion.div>
        ))}
      </div>

      <WavyDivider />

      {/* Provider Lifecycle */}
      <h3 className="ed-section-title">Жизненный цикл провайдера</h3>
      <div className="apv-lifecycle">
        {[
          { phase: 'День 1–7', label: 'Onboarding', icon: '📋', color: '#1C5C8F', steps: ['Заявка через app/web', 'KYC + background check', 'Insurance verification', 'Service category selection'] },
          { phase: 'День 7–14', label: 'Shadow mode', icon: '👁️', color: '#D68910', steps: ['Первые 5 заказов с мониторингом', 'Обязательное фото до/после', 'Rating ≥ 4.5 для активации', 'Менеджер на связи'] },
          { phase: 'День 14+', label: 'Активный', icon: '✅', color: '#1C6B3A', steps: ['Полный доступ к заказам', 'Surge pricing участие', 'Bonus pool eligibility', 'Referral bonus программа'] },
          { phase: 'Мес 3+', label: 'Premium Partner', icon: '⭐', color: '#C8860A', steps: ['Топ-10% по рейтингу', 'Priority dispatch', 'Co-branded страница', 'B2B / fleet заказы'] },
        ].map((p, i) => (
          <motion.div key={i} className="apv-lifecycle-phase"
            style={{ borderTop: `3px solid ${p.color}` }}
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}>
            <div className="apv-lifecycle-head">
              <span className="apv-lifecycle-icon">{p.icon}</span>
              <div>
                <div className="apv-lifecycle-phase-label" style={{ color: p.color }}>{p.phase}</div>
                <div className="apv-lifecycle-label">{p.label}</div>
              </div>
            </div>
            <ul className="apv-lifecycle-steps">
              {p.steps.map((s, j) => <li key={j}>{s}</li>)}
            </ul>
          </motion.div>
        ))}
      </div>

      <WavyDivider />

      {/* Acquisition channels */}
      <h3 className="ed-section-title">Каналы привлечения провайдеров</h3>
      <div className="apv-channels">
        {channels.map((c, i) => (
          <motion.div key={i} className="apv-channel"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.38, delay: i * 0.08 }}>
            <div className="apv-channel-n">{c.n}</div>
            <div>
              <div className="apv-channel-title">{c.title}</div>
              <div className="apv-channel-desc">{c.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// SUB 4: Стратегические замечания
function SlideKickoffStrategic() {
  const recs = [
    {
      n: '01',
      icon: '🏗️',
      title: 'Список нужно перестроить под marketplace-модель',
      problem: 'Сейчас читается как «что мы умеем». Для двухстороннего marketplace нужны 3 раздельные сущности.',
      rec: 'Service catalog — атомарные услуги для шопов. Customer scenarios — outcome-based bundles в приложении. Provider categories — какие типы шопов onboard\'ить.',
      analog: 'Thumbtack разделяет категории для клиентов и для подрядчиков — разные UI, разная логика.',
      firstAction: 'Создать 3 отдельных CSV-файла: catalog.csv / scenarios.csv / provider-types.csv. Сделать на этой неделе.',
      color: '#C0392B',
    },
    {
      n: '02',
      icon: '📊',
      title: 'Tier-структура должна быть в каждой услуге',
      problem: 'В Uber каждая поездка имеет UberX / Comfort / Black / SUV. У CarETA — нет.',
      rec: 'Каждая услуга должна иметь Standard / Premium / White-Glove tier с разной ценой. Даёт upsell + segmentation + price discrimination.',
      analog: 'Uber: 78% выручки генерирует Uber Comfort+ / Black — не базовый тариф. Upsell — главная маржа.',
      firstAction: 'Добавить поле tier в каждую запись catalog.csv. Три строки на услугу — три ценовые точки.',
      color: '#D68910',
    },
    {
      n: '03',
      icon: '⏱️',
      title: 'Time-tier важнее size-tier',
      problem: 'В авто-услугах «когда» часто важнее «как».',
      rec: 'Same-day vs scheduled vs emergency — разные ценовые точки. Ввести как ортогональную ось к tier-системе.',
      analog: 'Amazon Prime Same-Day vs Standard — один и тот же товар, разная цена. Клиенты платят за время охотнее, чем за качество.',
      firstAction: 'В pricing engine заложить time_multiplier как отдельный параметр. Базовая цена × tier × time = итоговая цена.',
      color: '#1C5C8F',
    },
    {
      n: '04',
      icon: '🛡️',
      title: 'Insurance / warranty как товар, не только сегмент',
      problem: 'Бизнес-модель упоминает microinsurance как revenue stream, но в каталоге его нет.',
      rec: 'Огромная упущенная категория subscription-продуктов. Каждый tier подписки включает базовую страховку.',
      analog: 'Lemonade начинал с рентерс-страховки $5/мес — $4B IPO. Microinsurance как add-on к существующим транзакциям конвертирует в 3× лучше.',
      firstAction: 'Связаться с 2–3 MGAs (Managing General Agents) для pilot microinsurance продукта. Не нужна страховая лицензия на старте.',
      color: '#1C6B3A',
    },
    {
      n: '05',
      icon: '🔄',
      title: 'Отсутствует «recovery / failure» flow',
      problem: 'Что если шоп не справился? Деталь сломалась через 3 дня?',
      rec: 'Нет «warranty claim assistance», «redo service», «complaint resolution» — критично для marketplace с trust-моделью.',
      analog: 'Airbnb AirCover — гарантия возврата за любую проблему. Стоит $0 для клиента, но убрала главный барьер к первому бронированию.',
      firstAction: 'Написать recovery policy: кто платит за redo, в течение какого срока, через какой канал. До старта beta.',
      color: '#6B3A8F',
    },
    {
      n: '06',
      icon: '🎯',
      title: 'ICP в business model — 8 групп, в services — 6',
      problem: 'Не совпадает. Uber/Lyft drivers как ICP — слабо отражены. Snowbirds — есть relocation, но нет full snowbird care package.',
      rec: 'Синхронизировать сервисный каталог с ICP-матрицей. Для каждого ICP — свой bundle.',
      analog: 'DoorDash DashPass — один продукт, но разные landing pages для college students / families / business users. Конверсия выше на 40%.',
      firstAction: 'Создать ICP-bundle карточку для каждой из 8 групп: какие услуги, какой tier, какая цена. Snowbird bundle — первый приоритет.',
      color: '#B86A00',
    },
  ]

  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Начало работы · Стратегия</div>
      <h2 className="ed-title">Стратегические замечания — 6 ключевых</h2>
      <p className="ed-lead">
        Аудит каталога выявил не только пробелы в отдельных услугах, но и системные архитектурные вопросы.
        Каждое из этих замечаний влияет на продукт в целом. Ниже — проблема, рекомендация, реальный пример
        из рынка и первое конкретное действие.
      </p>

      <div className="lnch-recs-grid">
        {recs.map((r, i) => (
          <motion.div key={i} className="lnch-rec-card"
            style={{ borderLeft: `3px solid ${r.color}` }}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.45, delay: (i % 3) * 0.1 }}>
            <div className="lnch-rec-head">
              <span className="lnch-rec-icon">{r.icon}</span>
              <span className="lnch-rec-n" style={{ color: r.color }}>{r.n}</span>
            </div>
            <div className="lnch-rec-title">{r.title}</div>
            <div className="lnch-rec-problem">
              <span className="lnch-rec-label">Проблема</span>
              {r.problem}
            </div>
            <div className="lnch-rec-rec">
              <span className="lnch-rec-label" style={{ color: r.color }}>Рекомендация</span>
              {r.rec}
            </div>
            <div className="lnch-rec-analog">
              <span className="lnch-rec-label" style={{ color: '#7F8C8D' }}>Аналог</span>
              {r.analog}
            </div>
            <div className="lnch-rec-action">
              <span className="lnch-rec-label" style={{ color: r.color }}>Первый шаг</span>
              {r.firstAction}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="ed-pullquote" style={{ marginTop: '2rem' }}>
        Эти шесть замечаний — не опциональные улучшения. Для marketplace с trust-моделью каждое из них влияет на конверсию и retention с первого дня.
      </div>
    </div>
  )
}

// SUB 5: Top-10 для запуска
function SlideKickoffTop10() {
  const myTop10 = [
    { n: 1, name: 'Mobile car wash & detailing', tag: 'оставить', tagColor: '#1C6B3A', reason: 'Высокая частота, recurring revenue, знакомая услуга — лучший точка входа.', cac: '$12', ticket: '$65', ltv: '$780', freq: '1×/мес' },
    { n: 2, name: 'Mobile pre-purchase inspection', tag: '🆕 добавить', tagColor: '#C0392B', reason: '#1 acquisition tool. $200–400 средний чек, привлекает новых клиентов в критический момент решения.', cac: '$45', ticket: '$280', ltv: '$1,400', freq: '2–3×/год' },
    { n: 3, name: 'Emergency roadside', tag: 'оставить', tagColor: '#1C6B3A', reason: 'Низкая маржа, но высокое вовлечение. Строит доверие в момент стресса.', cac: '$20', ticket: '$99', ltv: '$594', freq: '6×/год' },
    { n: 4, name: 'EV home charger installation', tag: '🆕 добавить', tagColor: '#C0392B', reason: 'Premium revenue ($1500–3000 за установку), растущий сегмент в FL. Высокий средний чек.', cac: '$65', ticket: '$1,800', ltv: '$2,700', freq: '1×/2 года' },
    { n: 5, name: 'ADAS calibration coordination', tag: '🆕 добавить', tagColor: '#C0392B', reason: 'Mandatory после collision / windshield — обязательная услуга, очень маржинальная.', cac: '$35', ticket: '$420', ltv: '$840', freq: '2×/год' },
    { n: 6, name: 'Pickup / drop-off для service', tag: 'оставить', tagColor: '#1C6B3A', reason: 'Core USP платформы. То, чего нет ни у одного конкурента.', cac: '$8', ticket: '$45', ltv: '$540', freq: '1×/мес' },
    { n: 7, name: 'Catalytic converter anti-theft cage', tag: '🆕 добавить', tagColor: '#C0392B', reason: 'Trending pain point в больших городах. $200–400 за установку, растущий спрос.', cac: '$28', ticket: '$300', ltv: '$450', freq: '1–2×/год' },
    { n: 8, name: 'Sober driver service', tag: 'оставить', tagColor: '#1C6B3A', reason: 'Miami nightlife, эмоциональная связь с брендом. Уникальный — 0 конкурентов.', cac: '$18', ticket: '$85', ltv: '$510', freq: '6×/год' },
    { n: 9, name: 'Fleet wash для tradesmen', tag: '🆕 добавить', tagColor: '#C0392B', reason: 'B2B beachhead. Recurring B2B revenue — те же клиенты что у HVAC/plumber/electrician.', cac: '$55', ticket: '$320/мес', ltv: '$5,760', freq: 'ежемесячно' },
    { n: 10, name: 'Snowbird vehicle care subscription', tag: '🆕 добавить', tagColor: '#C0392B', reason: 'Miami-specific moat. $79–199/мес recurring. 0 конкурентов на этой нише.', cac: '$42', ticket: '$139/мес', ltv: '$1,668', freq: '8–10 мес/год' },
  ]

  const toRemove = [
    'Inspection handling — низкая маржа, низкая частота',
    'Routine maintenance concierge — overlap с pickup/drop-off',
    'Oil change pickup — commodity, ценовая война с Take5',
    'Lease return assistance — низкая частота, узкая аудитория',
    'Pre-sale car prep — overlap с pre-purchase и detailing',
  ]

  // Estimated Month-1 revenue if 50 orders split across top-3 services
  const month1calc = [
    { service: 'Mobile car wash (×15 orders)', rev: '$975', margin: '$195', pct: '20%' },
    { service: 'Emergency roadside (×10 orders)', rev: '$990', margin: '$198', pct: '20%' },
    { service: 'Pre-purchase inspection (×8 orders)', rev: '$2,240', margin: '$448', pct: '20%' },
    { service: 'Pickup/drop-off (×12 orders)', rev: '$540', margin: '$108', pct: '20%' },
    { service: 'Sober driver (×5 orders)', rev: '$425', margin: '$85', pct: '20%' },
  ]
  const totalRev = '$5,170'
  const totalMargin = '$1,034'

  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Аудит каталога · Приоритизация</div>
      <h2 className="ed-title">Top-10 для запуска — пересмотр</h2>
      <p className="ed-lead">
        Текущий Top-15 в каталоге — хороший, но 5 позиций стоит заменить на более стратегические
        для Miami-MVP. Каждая позиция — с данными по экономике.
        <br /><span style={{ fontSize: '0.9em', opacity: 0.8 }}>CAC — сколько стоит привлечь одного клиента. Чек — средняя сумма одного заказа. LTV — сколько клиент приносит за 12 месяцев.</span>
      </p>

      <div className="lnch-top10-wrap">
        {/* My Top 10 */}
        <div className="lnch-top10-list">
          <div className="lnch-top10-header">Рекомендуемый Top-10</div>
          {myTop10.map((item, i) => (
            <motion.div key={i} className="lnch-top10-item"
              initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.06 }}>
              <div className="lnch-top10-num" style={{ color: item.tagColor === '#1C6B3A' ? '#1C6B3A' : '#C0392B' }}>
                {item.n}
              </div>
              <div className="lnch-top10-body">
                <div className="lnch-top10-name">
                  {item.name}
                  <span className="lnch-top10-tag" style={{ background: item.tagColor + '18', color: item.tagColor, border: `1px solid ${item.tagColor}35` }}>
                    {item.tag}
                  </span>
                </div>
                <div className="lnch-top10-reason">{item.reason}</div>
                <div className="lnch-top10-economics">
                  <span className="lnch-econ-chip">CAC {item.cac}</span>
                  <span className="lnch-econ-chip">Чек {item.ticket}</span>
                  <span className="lnch-econ-chip" style={{ color: '#1C6B3A', borderColor: 'rgba(28,107,58,0.3)' }}>LTV {item.ltv}</span>
                  <span className="lnch-econ-chip" style={{ color: '#6B3A8F', borderColor: 'rgba(107,58,143,0.3)' }}>{item.freq}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <WavyDivider />

      {/* Month-1 revenue calc */}
      <h3 className="ed-section-title" style={{ marginTop: '1.5rem' }}>Расчёт выручки — Месяц 1 (50 заказов)</h3>
      <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9rem', color: 'var(--fg-mid)', marginBottom: '1rem' }}>
        Реалистичный сценарий при 20 подключённых провайдерах и $5K маркетинг-бюджете на старте.
      </p>
      <div className="lnch-m1-table">
        <div className="lnch-m1-head">
          <div>Услуга</div>
          <div>Выручка GMV</div>
          <div>Маржа CarETA (20%)</div>
          <div>Take rate</div>
        </div>
        {month1calc.map((row, i) => (
          <motion.div key={i} className="lnch-m1-row"
            initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.06 }}>
            <div className="lnch-m1-service">{row.service}</div>
            <div className="lnch-m1-rev">{row.rev}</div>
            <div className="lnch-m1-margin" style={{ color: '#1C6B3A' }}>{row.margin}</div>
            <div className="lnch-m1-pct">{row.pct}</div>
          </motion.div>
        ))}
        <div className="lnch-m1-total">
          <div style={{ fontWeight: 700 }}>Итого Месяц 1</div>
          <div style={{ fontWeight: 700, color: 'var(--accent)' }}>{totalRev}</div>
          <div style={{ fontWeight: 700, color: '#1C6B3A' }}>{totalMargin}</div>
          <div style={{ color: 'var(--fg-mid)' }}>20% avg</div>
        </div>
      </div>

      <WavyDivider />

      <h3 className="ed-section-title" style={{ marginTop: '1.5rem' }}>Что убрать из приоритетов</h3>
      <div className="lnch-remove-list">
        {toRemove.map((item, i) => (
          <div key={i} className="lnch-remove-item">
            <span className="lnch-remove-x">✕</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// SUB 6: Конкурентная карта
function SlideKickoffCompetition() {
  const competitors = [
    { name: 'YourMechanic', x: 18, y: 72, mobile: true, full: false, color: '#7F8C8D' },
    { name: 'Wrench', x: 22, y: 62, mobile: true, full: false, color: '#7F8C8D' },
    { name: 'Spiffy', x: 35, y: 52, mobile: true, full: false, color: '#7F8C8D' },
    { name: 'Take5', x: 78, y: 25, mobile: false, full: false, color: '#7F8C8D' },
    { name: 'RepairPal', x: 72, y: 38, mobile: false, full: false, color: '#7F8C8D' },
    { name: 'CarETA', x: 50, y: 88, mobile: true, full: true, color: '#C8860A' },
  ]

  const compRows = [
    { feature: 'Mobile mechanic', ym: true, wr: true, sp: false, rp: false, t5: false, ca: true },
    { feature: 'Mobile detail', ym: false, wr: false, sp: true, rp: false, t5: false, ca: true },
    { feature: 'Pickup / drop-off concierge', ym: false, wr: false, sp: false, rp: false, t5: false, ca: true },
    { feature: 'Marketplace эскроу', ym: false, wr: false, sp: false, rp: false, t5: false, ca: true },
    { feature: 'Insurance partnership', ym: false, wr: false, sp: false, rp: true, t5: false, ca: true },
    { feature: 'EV-specific services', ym: 'partial', wr: false, sp: false, rp: false, t5: false, ca: true },
    { feature: 'Subscription model', ym: false, wr: false, sp: true, rp: false, t5: false, ca: true },
    { feature: 'Sober driver', ym: false, wr: false, sp: false, rp: false, t5: false, ca: 'unique' },
    { feature: 'Hurricane prep', ym: false, wr: false, sp: false, rp: false, t5: false, ca: 'unique' },
    { feature: 'Outcome-based UX', ym: false, wr: false, sp: false, rp: false, t5: false, ca: 'unique' },
    { feature: '24/7 emergency', ym: 'partial', wr: false, sp: false, rp: false, t5: false, ca: true },
    { feature: 'BNPL встроен', ym: false, wr: false, sp: false, rp: false, t5: false, ca: true },
    { feature: 'Multi-tier (X/Comfort/Black)', ym: false, wr: false, sp: false, rp: false, t5: false, ca: 'plan' },
  ]

  const moats = [
    { icon: '🌀', title: 'Hurricane prep', desc: 'Никто из конкурентов не покрывает климат-события. Miami-exclusive moat.' },
    { icon: '🍻', title: 'Sober driver', desc: 'Никто не объединяет night-out service с auto-care в одном приложении.' },
    { icon: '🎯', title: 'Outcome-based UX', desc: 'Все продают «coolant flush». CarETA продаёт «I\'m stuck». Разные конверсии.' },
    { icon: '🏖️', title: 'Snowbird care', desc: 'Miami-specific recurring revenue, $79–199/мес. Ноль конкурентов на этой нише.' },
  ]

  const cellVal = (v) => {
    if (v === true) return { text: '✓', color: '#1C6B3A' }
    if (v === false) return { text: '—', color: 'rgba(15,15,14,0.2)' }
    if (v === 'partial') return { text: '~', color: '#D68910' }
    if (v === 'unique') return { text: '✓ unique', color: '#C8860A' }
    if (v === 'plan') return { text: 'план', color: '#1C5C8F' }
    return { text: '?', color: '#7F8C8D' }
  }

  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Начало работы · Рынок</div>
      <h2 className="ed-title">Конкурентная карта — где CarETA выигрывает</h2>
      <p className="ed-lead">
        На американском рынке авто-сервисов уже работает 5 крупных игроков. Мы изучили каждого — откуда деньги,
        что умеют, где дыры. Ни один из них не занимает позицию «мобильный + полный консьерж» одновременно.
        CarETA — первая платформа, которая объединяет оба измерения в одном продукте.
      </p>

      {/* 2x2 Positioning Matrix */}
      <h3 className="ed-section-title">Матрица позиционирования</h3>
      <div className="lnch-matrix-wrap">
        <svg className="lnch-matrix-svg" viewBox="0 0 500 380" preserveAspectRatio="xMidYMid meet">
          {/* Quadrant backgrounds */}
          <rect x="0" y="0" width="250" height="190" fill="rgba(28,92,143,0.05)" />
          <rect x="250" y="0" width="250" height="190" fill="rgba(200,134,10,0.08)" />
          <rect x="0" y="190" width="250" height="190" fill="rgba(127,140,141,0.04)" />
          <rect x="250" y="190" width="250" height="190" fill="rgba(127,140,141,0.03)" />
          {/* Quadrant labels */}
          <text x="125" y="22" textAnchor="middle" fill="rgba(28,92,143,0.55)" fontSize="9.5" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="0.1em">MOBILE + CONCIERGE</text>
          <text x="375" y="22" textAnchor="middle" fill="rgba(200,134,10,0.55)" fontSize="9.5" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="0.1em">MULTI-SERVICE</text>
          <text x="125" y="210" textAnchor="middle" fill="rgba(127,140,141,0.5)" fontSize="9" fontFamily="Inter, sans-serif">Single service mobile</text>
          <text x="375" y="210" textAnchor="middle" fill="rgba(127,140,141,0.5)" fontSize="9" fontFamily="Inter, sans-serif">Shop-based single</text>
          {/* Axes */}
          <line x1="250" y1="0" x2="250" y2="380" stroke="rgba(15,15,14,0.12)" strokeWidth="1.5" strokeDasharray="5,5" />
          <line x1="0" y1="190" x2="500" y2="190" stroke="rgba(15,15,14,0.12)" strokeWidth="1.5" strokeDasharray="5,5" />
          <text x="250" y="372" textAnchor="middle" fill="rgba(15,15,14,0.4)" fontSize="9" fontFamily="Inter, sans-serif">Shop-based ←→ Mobile-first</text>
          <text x="10" y="195" fill="rgba(15,15,14,0.35)" fontSize="8.5" fontFamily="Inter, sans-serif" transform="rotate(-90,10,190)">Full concierge ↑ / Single service ↓</text>
          {/* Competitor dots */}
          {competitors.map((c) => {
            const cx = (c.x / 100) * 500
            const cy = (1 - c.y / 100) * 380
            const isCareta = c.name === 'CarETA'
            return (
              <g key={c.name}>
                <circle cx={cx} cy={cy} r={isCareta ? 22 : 15}
                  fill={isCareta ? 'rgba(200,134,10,0.18)' : 'rgba(127,140,141,0.12)'}
                  stroke={c.color} strokeWidth={isCareta ? 2.5 : 1.5} />
                <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
                  fill={c.color} fontSize={isCareta ? 11 : 9}
                  fontFamily="Inter, sans-serif" fontWeight={isCareta ? '700' : '500'}>
                  {c.name}
                </text>
              </g>
            )
          })}
          {/* Star on CarETA */}
          <circle cx={(50/100)*500} cy={(1-88/100)*380} r="28"
            fill="none" stroke="rgba(200,134,10,0.3)" strokeWidth="1" strokeDasharray="3,3" />
        </svg>
      </div>

      <WavyDivider />

      {/* Comparison table */}
      <h3 className="ed-section-title" style={{ marginTop: '1.5rem' }}>Сравнительная таблица фич</h3>
      <div className="lnch-comp-table">
        <div className="lnch-comp-head">
          <div>Фича</div>
          <div>YourMech.</div>
          <div>Wrench</div>
          <div>Spiffy</div>
          <div>RepairPal</div>
          <div>Take5</div>
          <div className="lnch-comp-careta">CarETA</div>
        </div>
        {compRows.map((row, i) => (
          <motion.div key={i} className="lnch-comp-row"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.2, delay: i * 0.04 }}>
            <div className="lnch-comp-feat">{row.feature}</div>
            {['ym','wr','sp','rp','t5'].map(k => {
              const v = cellVal(row[k])
              return <div key={k} style={{ color: v.color, fontFamily: 'var(--sans)', fontSize: '0.88rem', textAlign: 'center' }}>{v.text}</div>
            })}
            <div className="lnch-comp-careta" style={{ color: cellVal(row.ca).color, fontWeight: '600', textAlign: 'center', fontFamily: 'var(--sans)', fontSize: '0.88rem' }}>
              {cellVal(row.ca).text}
            </div>
          </motion.div>
        ))}
      </div>

      <WavyDivider />

      {/* Deep competitor cards */}
      <h3 className="ed-section-title" style={{ marginTop: '1.5rem' }}>Детальный разбор — 5 конкурентов</h3>
      {[
        {
          name: 'YourMechanic',
          color: '#7F8C8D',
          founded: '2012',
          funding: '$62M (Series B)',
          revenue: '~$30M ARR (est.)',
          model: 'Mobile mechanic marketplace. Механик приезжает к клиенту. Booking через сайт/app.',
          strength: 'Широкий coverage (50+ городов), бренд, интеграция с RepairPal.',
          weakness: 'Только mechanics — нет detailing, нет concierge, нет pickp/drop-off. Старый UX (2012 UI). Нет subscription модели.',
          preempt: 'Expansion в concierge layer займёт 18+ мес — слишком большая перестройка продукта.',
        },
        {
          name: 'Wrench',
          color: '#7F8C8D',
          founded: '2016',
          funding: '$24M (Series A)',
          revenue: '~$15M ARR (est.)',
          model: 'Mobile mechanic + fleet maintenance. Сильны в B2B (корпоративные аккаунты).',
          strength: 'B2B focus — корпоративные клиенты, fleet contracts. Более стабильная выручка.',
          weakness: 'B2C weak. Только mechanics. Нет outcome-based UX. Географически ограничены.',
          preempt: 'B2B strengths не реплицируются — у CarETA другая точка входа (B2C first, B2B follow).',
        },
        {
          name: 'Spiffy',
          color: '#7F8C8D',
          founded: '2014',
          funding: '$43M (Series C)',
          revenue: '~$40M ARR (est.)',
          model: 'Mobile car wash + detailing. Franchising модель. Фокус на fleet и enterprise.',
          strength: 'Subscription (Spiffy Select), strong brand в detailing, fleet contracts (Hertz, Enterprise).',
          weakness: 'Только detailing + oil change — не полноценный marketplace. Нет mechanics, нет concierge.',
          preempt: 'Detailing — их core. CarETA берёт detailing как entry point, но идёт дальше — к full concierge.',
        },
        {
          name: 'RepairPal',
          color: '#7F8C8D',
          founded: '2007',
          funding: '$30M (Series C)',
          revenue: '~$25M ARR (est.)',
          model: 'Price transparency tool + shop directory. Лиды для shops, не marketplace.',
          strength: 'SEO-трафик, данные о ценах, партнёрство с USAA/CarGurus.',
          weakness: 'Нет мобильной услуги — только referral к шопу. Нет транзакции. Старая бизнес-модель (лиды).',
          preempt: 'Фундаментально разные бизнес-модели — RepairPal не станет marketplace без полной перестройки.',
        },
        {
          name: 'Take5 Oil Change',
          color: '#7F8C8D',
          founded: '1984',
          funding: 'Private (Driven Brands, NYSE: DRVN)',
          revenue: '$1.5B+ (Driven Brands total)',
          model: '«Drive-thru» oil change. Нет appointment, нет mobile, chain format (1200+ locations).',
          strength: 'Brand recognition, speed (10 min), масштаб в Sunbelt (FL, TX, SE).',
          weakness: 'Физически bound — надо приехать. Только oil change. Нет digital layer. Нет subscription.',
          preempt: 'CarETA не конкурирует напрямую — мы заменяем поездку в шоп, а не шоп. Разные jobs-to-be-done.',
        },
      ].map((c, i) => (
        <motion.div key={i} className="lnch-comp-deep-card"
          initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}>
          <div className="lnch-comp-deep-header">
            <span className="lnch-comp-deep-name">{c.name}</span>
            <span className="lnch-comp-deep-meta">{c.founded} · {c.funding} · {c.revenue}</span>
          </div>
          <div className="lnch-comp-deep-body">
            <div className="lnch-comp-deep-row">
              <span className="lnch-comp-deep-label">Модель</span>
              <span>{c.model}</span>
            </div>
            <div className="lnch-comp-deep-row">
              <span className="lnch-comp-deep-label" style={{ color: '#1C6B3A' }}>Сильное</span>
              <span>{c.strength}</span>
            </div>
            <div className="lnch-comp-deep-row">
              <span className="lnch-comp-deep-label" style={{ color: '#C0392B' }}>Слабое</span>
              <span>{c.weakness}</span>
            </div>
            <div className="lnch-comp-deep-row" style={{ background: 'rgba(200,134,10,0.05)', borderRadius: 3, padding: '0.4rem 0.5rem' }}>
              <span className="lnch-comp-deep-label" style={{ color: 'var(--accent)' }}>Упреждение</span>
              <span style={{ fontStyle: 'italic' }}>{c.preempt}</span>
            </div>
          </div>
        </motion.div>
      ))}

      <WavyDivider />

      {/* Moats */}
      <h3 className="ed-section-title" style={{ marginTop: '1.5rem' }}>Конкурентные moat'ы CarETA</h3>
      <div className="lnch-moats-grid">
        {moats.map((m, i) => (
          <motion.div key={i} className="lnch-moat-card"
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
            <div className="lnch-moat-icon">{m.icon}</div>
            <div className="lnch-moat-title">{m.title}</div>
            <div className="lnch-moat-desc">{m.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// SUB 7: Вопросы к клиенту
function SlideKickoffQuestions() {
  const questions = [
    {
      n: '01',
      title: 'После Miami — какой второй город?',
      text: 'После Miami — FL Tampa или сразу TX / CA для market test? Выбор влияет на наём шопов и маркетинговый бюджет.',
      whyMatters: 'Разные города — разные партнёры-провайдеры, разные CAC, разные regulatory требования. Заранее решить это — значит не делать одну и ту же работу дважды.',
      whatItMeans: 'Tampa — логичный шаг, один рынок (FL). Texas — другой климат, другие клиенты, другие страховые. Рекомендуем Tampa для второго шага.',
      color: '#1C5C8F',
    },
    {
      n: '02',
      title: 'Кто первый целевой клиент?',
      text: 'Из 8 целевых групп бизнес-модели — на кого делаем основную ставку в первые 6 месяцев? Рекомендуем busy professionals в Miami: высокий LTV, низкая ценовая чувствительность.',
      whyMatters: 'Разные аудитории — разный маркетинг, разные услуги, разный UX. Нельзя одновременно хорошо делать всё для всех. Нужна одна конкретная «первая аудитория».',
      whatItMeans: 'Busy professionals (юристы, риэлторы, врачи, предприниматели) — готовы платить за время. Самый высокий LTV при самом низком CAC в Miami. Они ценят удобство, а не цену.',
      color: '#C0392B',
    },
    {
      n: '03',
      title: 'Добавляем EV-услуги сразу или позже?',
      text: 'Запускаем EV-категорию в MVP или откладываем до второго города? В FL доля EV ниже CA, но растёт. Добавление EV требует специализированных шопов с сертификацией.',
      whyMatters: 'EV-шопы — отдельный тип партнёров с другим обучением и инструментами. Если решим добавить в MVP — нужно начать их онбординг прямо сейчас.',
      whatItMeans: 'Наша рекомендация: добавить EV в MVP как ограниченную beta-категорию с 3–5 сертифицированными шопами. Рост ниши оправдывает риск.',
      color: '#D68910',
    },
    {
      n: '04',
      title: 'B2B с первого дня или после?',
      text: 'Запускаем B2B (автопарки, tradesmen — мастера HVAC/сантехники с рабочими машинами) с первого дня или после product-market fit на B2C? B2B даёт предсказуемый доход, но требует другого процесса продаж.',
      whyMatters: 'B2B — стабильный договорной доход. Но сначала нужно доказать продукт на обычных клиентах. Попытка делать и то и другое с нуля размывает фокус.',
      whatItMeans: 'Рекомендуем: B2B как приоритет с месяца 3, не с дня 1. Первый B2B-клиент — компания из нашей сети: HVAC-бизнес или plumber с парком машин.',
      color: '#1C6B3A',
    },
    {
      n: '05',
      title: 'Когда начинаем переговоры со страховыми?',
      text: 'Подписание пилота со страховой — Q1 или Q2? Geico / State Farm / Progressive имеют разные циклы согласования. Чем раньше начать — тем лучше.',
      whyMatters: 'Страховые компании согласовывают партнёрства 6–12 месяцев. Чтобы к Q4 иметь работающую интеграцию — стучаться нужно прямо сейчас.',
      whatItMeans: 'Первый шаг — «теплые» интро через LinkedIn или отраслевые конференции (Digital Insurance Agenda, InsureTech Connect). Нужны 3 meeting к концу Q1.',
      color: '#6B3A8F',
    },
    {
      n: '06',
      title: 'Три уровня обслуживания — запускаем сразу или поэтапно?',
      text: 'Standard / Premium / White-Glove — реализовать с первого релиза или вводить постепенно? С первого релиза — сложнее, но дешевле переделывать потом.',
      whyMatters: 'Если tier-систему добавлять после запуска — нужно переделывать pricing engine, UI, договора с шопами. Это дорого. Лучше заложить с нуля, даже если вначале будет только 2 уровня.',
      whatItMeans: 'Наш план: Standard + Premium с дня 1, White-Glove добавить в месяце 2 для 3–5 «белых перчаток» сервисов (детейлинг, concierge, VIP эвакуация).',
      color: '#B86A00',
    },
    {
      n: '07',
      title: 'Микростраховка — с MVP или позже?',
      text: 'Запуск страховых мини-продуктов ($9.99–59.99/мес) с MVP или после 1000 активных пользователей? Страховые продукты требуют лицензий — compliance нужно начинать сейчас.',
      whyMatters: 'Microinsurance — один из главных revenue stream в бизнес-модели. Но без лицензии продавать страховку в США незаконно. Процесс лицензирования занимает 3–6 месяцев.',
      whatItMeans: 'Рекомендуем: найти MGA (Managing General Agent — посредника с уже имеющейся лицензией) и запустить под его лицензией. Это стандартная схема для InsurTech стартапов.',
      color: '#C0392B',
    },
    {
      n: '08',
      title: 'Trober driver — нужна ли специальная лицензия во Флориде?',
      text: 'Проверка регуляторики Florida — есть ли ограничения на sober driver в FL? В некоторых штатах нужна лицензия транспортной компании (TNC), в других нет.',
      whyMatters: 'Если запустить без нужной лицензии — штраф или принудительная остановка сервиса в разгар сезона. Нужно знать ответ до первой рекламы.',
      whatItMeans: 'В FL TNC-лицензия нужна только если водитель использует личное транспортное средство. Если клиент садится в свою машину с нашим водителем — это другая модель. Нужен юридический мнение FL-адвоката.',
      color: '#1C5C8F',
    },
    {
      n: '09',
      title: 'AI-осмотр через телефон — в MVP или нет?',
      text: 'Включать функцию «клиент снимает фото, AI определяет повреждения» в MVP или Phase 2? AI-инспекция требует ML-модели или партнёра (Ravin AI, Monk AI). Влияет на бюджет и сроки.',
      whyMatters: 'Это дифференциатор который нельзя купить — его надо строить. Если конкурент запустит раньше — потеряем часть уникальности. Зато он требует серьёзной разработки.',
      whatItMeans: 'Рекомендуем: интеграция с Ravin AI или Monk AI (готовые SDK для мобильных инспекций, $0.50–5.00 за фото) как быстрый путь. Своя ML-модель — месяцы работы.',
      color: '#D68910',
    },
    {
      n: '10',
      title: 'Финальный слоган бренда',
      text: 'Остановиться на «Your car. Zero stress. We handle the rest.» или провести customer research? Слоган влияет на рекламные объявления, онбординг и инвестиционный deck.',
      whyMatters: 'Слоган — это 5 слов которые человек видит в рекламе, на сайте, в App Store. От него зависит первое впечатление и конверсия в установку.',
      whatItMeans: 'Текущий вариант сильный. Но рекомендуем 2-недельный A/B тест на Meta с 3 вариантами слогана перед финализацией — $500 бюджета даст реальный ответ от рынка.',
      color: '#1C6B3A',
    },
  ]

  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Начало работы · Следующий шаг</div>
      <h2 className="ed-title">10 вопросов перед финализацией — разбираем вместе</h2>
      <p className="ed-lead">
        Это не список «подумайте сами». Каждый вопрос ниже — с нашим видением ответа и объяснением почему он важен именно сейчас.
        Ответы на них определяют архитектуру MVP, первый рынок и распределение бюджета.
        Рекомендуем разобрать на первом рабочем звонке — уйдёт 45–60 минут.
      </p>

      <div className="lnch-questions-grid">
        {questions.map((q, i) => (
          <motion.div key={i} className="lnch-question-card"
            style={{ borderTop: `3px solid ${q.color}` }}
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: (i % 2) * 0.1 }}>
            <div className="lnch-question-n" style={{ color: q.color }}>{q.n}</div>
            <div className="lnch-question-title">{q.title}</div>
            <div className="lnch-question-text">{q.text}</div>
            <div className="lnch-question-why">
              <span className="lnch-question-why-label">Почему это важно</span>
              {q.whyMatters}
            </div>
            <div className="lnch-question-what">
              <span className="lnch-question-what-label" style={{ color: q.color }}>Наше видение</span>
              {q.whatItMeans}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="ed-pullquote" style={{ marginTop: '2rem' }}>
        Эти вопросы — не формальность. Каждый влияет на архитектурные решения, которые дорого менять после старта разработки.
      </div>
    </div>
  )
}

// SUB 8: Что дальше — первые 30 дней аудита
function SlideKickoffRoadmap() {
  const weeks = [
    {
      period: 'Неделя 1',
      subtitle: 'После approval этого документа',
      color: '#C0392B',
      owner: 'Castells + CarETA founder',
      deliverable: 'Service catalog v2 PDF + wireframes набросок',
      successCriteria: 'Top-10 согласован обеими сторонами, pricing framework зафиксирован в документе',
      items: [
        'Финализация Top-10 услуг для MVP с командой CarETA',
        'Рабочий звонок: ICP, гео-стратегия, tier-система — принять решения по всем 10 вопросам из предыдущего слайда',
        'Service catalog v2 — структурированный с Standard / Premium / White-Glove и pricing framework',
        'Wireframes для outcome-based UX в клиентском приложении (набросок, не финал)',
      ],
      result: 'Согласованный Top-10 + pricing framework + wireframes',
    },
    {
      period: 'Неделя 2',
      subtitle: 'Инфраструктура и партнёры',
      color: '#D68910',
      owner: 'Castells tech team + CarETA ops',
      deliverable: 'API spec doc + onboarding скрипт для шопов',
      successCriteria: 'Первые 5 шопов подписали LOI (letter of intent). Stripe Connect тест-аккаунт работает.',
      items: [
        'Скрипт для онбординга первых 50 шопов в Miami (холодный outreach + демо-презентация)',
        'API контракты: Stripe Connect эскроу-поток, Twilio SMS-уведомления, Google Maps геокодинг',
        'AI-промпты для чата с клиентом (распознавание ситуации + подбор услуги)',
        'Первая версия admin-панели для управления заказами',
      ],
      result: 'Onboarding-воронка для шопов + API spec + AI-prompts',
    },
    {
      period: 'Недели 3–4',
      subtitle: 'Beta и первые реальные заказы',
      color: '#1C5C8F',
      owner: 'Вся команда',
      deliverable: 'Отчёт с данными первых 50 заказов',
      successCriteria: '≥ 50 завершённых заказов, NPS ≥ 50, время диспетчеризации < 8 минут',
      items: [
        'Закрытая beta — 5 тестовых клиентов на 3 услуги (мобильная мойка, аварийная помощь, предпродажная инспекция)',
        'Live-трекинг первых 50 заказов с полной инструментацией (каждое событие логируется)',
        'Итерационный цикл — еженедельный sprint review каждую пятницу',
        'Первые переговоры со страховыми: 3 встречи с Geico / State Farm / Progressive',
      ],
      result: 'Первые реальные заказы + данные для итерации',
    },
  ]

  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Начало работы · Roadmap</div>
      <h2 className="ed-title">Что дальше — план первых 30 дней</h2>
      <p className="ed-lead">
        Конкретный план первого месяца после одобрения этого документа. Без абстракций — каждая неделя
        заканчивается конкретным результатом, у каждого задания есть ответственный,
        и есть чёткий критерий «как понять что сделано хорошо».
      </p>

      <div className="lnch-roadmap-wrap">
        {weeks.map((w, i) => (
          <motion.div key={i} className="lnch-roadmap-week"
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}>
            <div className="lnch-roadmap-connector">
              <div className="lnch-roadmap-dot" style={{ background: w.color }} />
              {i < weeks.length - 1 && <div className="lnch-roadmap-line" />}
            </div>
            <div className="lnch-roadmap-content">
              <div className="lnch-roadmap-period" style={{ color: w.color }}>{w.period}</div>
              <div className="lnch-roadmap-subtitle">{w.subtitle}</div>
              <ul className="lnch-roadmap-items">
                {w.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
              <div className="lnch-roadmap-result">
                <span className="lnch-roadmap-result-label">Результат:</span>
                {w.result}
              </div>
              <div className="lnch-roadmap-meta">
                <div className="lnch-roadmap-meta-row">
                  <span className="lnch-roadmap-meta-label">Ответственный</span>
                  <span className="lnch-roadmap-meta-val">{w.owner}</span>
                </div>
                <div className="lnch-roadmap-meta-row">
                  <span className="lnch-roadmap-meta-label">Deliverable</span>
                  <span className="lnch-roadmap-meta-val">{w.deliverable}</span>
                </div>
                <div className="lnch-roadmap-meta-row">
                  <span className="lnch-roadmap-meta-label" style={{ color: '#1C6B3A' }}>Критерий успеха</span>
                  <span className="lnch-roadmap-meta-val" style={{ color: '#1C6B3A' }}>{w.successCriteria}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <WavyDivider />

      <div className="lnch-milestone-box">
        <div className="lnch-milestone-label">Milestone Месяц 2</div>
        <div className="lnch-milestone-text">
          Public beta в Miami — 50 шопов, 500 клиентов, $50K GMV
        </div>
        <div className="lnch-milestone-sub">
          Это реалистичная цель при правильном onboarding-процессе и маркетинговом бюджете $5–10K.
        </div>
      </div>
    </div>
  )
}

// ─── FIRST 30 DAYS ────────────────────────────────────────────────────────────
function SlideDay30() {
  const days = [
    {
      period: 'Неделя 1',
      title: 'Документы и знакомство',
      steps: [
        'Подписание NDA — до любых деталей о продукте',
        'Звонок-знакомство с CA тимлидом (1 час)',
        'Подписание контракта с milestone-структурой',
        'Первый ежемесячный платёж → команда зафиксирована за вами',
      ],
      result: 'У вас есть подписанный контракт, NDA и зарезервированная команда'
    },
    {
      period: 'Неделя 2–3',
      title: 'Discovery — архитектура будущего продукта',
      steps: [
        'Серия рабочих сессий: разбираем каждый экран и флоу',
        'Технический аудит рынка: конкуренты, API, ограничения платформ',
        'Архитектурный документ: как будет работать каждая часть системы',
        'Вам создаётся доступ к GitHub, Linear, Slack команды',
      ],
      result: 'Полный архитектурный документ — blueprint вашего продукта'
    },
    {
      period: 'Неделя 4',
      title: 'Дизайн стартует',
      steps: [
        'Начало UI/UX дизайна: первые экраны клиентского приложения в Figma',
        'Еженедельное демо — первый показ направления дизайна',
        'Синхронизация по обратной связи: что нравится, что менять',
        'Первый производственный коммит в вашем репозитории',
      ],
      result: 'Через 30 дней после подписания вы видите живой дизайн своего продукта'
    },
  ]
  const parallel = [
    'Вы занимаетесь своим бизнесом — закрываете первых партнёров-шопы, договариваетесь с XPEL, регистрируете компанию во Флориде',
    'Мы строим продукт — без лишних встреч, без «нам нужно ещё 3 страницы ТЗ», без бюрократии',
    'Еженедельно: 30-минутное демо + async Slack для оперативных вопросов',
  ]
  return (
    <div className="slide-content">
      <div className="ed-eyebrow">После подписания</div>
      <h2 className="ed-title">Первые 30 дней</h2>
      <p className="ed-lead">Конкретный план первого месяца — без абстракций. После подписания вы точно знаете, что произойдёт завтра, послезавтра и через месяц.</p>

      <div className="d30-grid">
        {days.map((d, i) => (
          <div key={i} className="d30-card">
            <div className="d30-period">{d.period}</div>
            <div className="d30-title">{d.title}</div>
            <ul className="d30-steps">
              {d.steps.map((s, j) => <li key={j}>{s}</li>)}
            </ul>
            <div className="d30-result">{d.result}</div>
          </div>
        ))}
      </div>

      <div className="d30-parallel-title">Принцип параллельной работы</div>
      <div className="d30-parallel">
        {parallel.map((p, i) => (
          <div key={i} className="d30-parallel-item">
            <span className="d30-parallel-n">{i + 1}</span>
            <span>{p}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── TECH STACK ───────────────────────────────────────────────────────────────
function SlideTechStack() {
  const interfaces = [
    { n: '01', name: 'Приложение клиента', who: 'Автовладелец', platform: 'iOS + Android', priority: 'MVP', color: '#1C5C8F' },
    { n: '02', name: 'Приложение шопа', who: 'Техник / менеджер', platform: 'iOS + Android', priority: 'MVP', color: '#1C5C8F' },
    { n: '03', name: 'Веб-кабинет шопа', who: 'Владелец бизнеса', platform: 'Web', priority: 'MVP', color: '#1C5C8F' },
    { n: '04', name: 'Admin-панель Carreta', who: 'Команда', platform: 'Web', priority: 'MVP', color: '#1C5C8F' },
    { n: '05', name: 'Портал страховых', who: 'Менеджер страховой', platform: 'Web', priority: 'Фаза 2', color: '#7A7875' },
    { n: '06', name: 'Портал франчайзи', who: 'Владелец франшизы', platform: 'Web', priority: 'Фаза 3', color: '#7A7875' },
  ]
  const aiTools = [
    { name: 'Tractable', accuracy: '~90%+', use: 'Оценка повреждений по фото, партнёр GEICO', cost: '$10K–50K setup', badge: 'Enterprise' },
    { name: 'Ravin AI', accuracy: 'Высокая', use: 'Mobile SDK для инспекций, подходит для MVP', cost: '$0,50–5,00/инспекция', badge: 'Гибкий' },
    { name: 'Monk AI', accuracy: 'Высокая', use: 'Mobile SDK, 20–30K инспекций/мес в тарифе', cost: 'Subscription', badge: 'Scalable' },
  ]
  const stack = [
    { layer: 'Мобильные приложения', tech: 'Swift (iOS) + Kotlin (Android)', note: 'Нативная разработка — максимальная производительность, UX на уровне Uber/Lyft' },
    { layer: 'Backend', tech: 'Go (Golang)', note: 'Высокая производительность, конкурентность из коробки — используется Uber, Docker, Kubernetes' },
    { layer: 'База данных', tech: 'PostgreSQL', note: 'Реляционная БД — транзакции, эскроу, заказы' },
    { layer: 'Кэш / очереди', tech: 'Redis + BullMQ', note: 'Push-уведомления, фоновые задачи, rate limiting' },
    { layer: 'Платежи', tech: 'Stripe Connect', note: 'Эскроу, instant payout шопам, KYC автоматически' },
    { layer: 'Карты / GPS', tech: 'Google Maps SDK', note: 'Real-time трекинг заказа, ETA, геолокация шопов' },
    { layer: 'AI / Vision', tech: 'Ravin AI → Tractable', note: 'Начинаем с Ravin, мигрируем на Tractable при scale' },
    { layer: 'Масштабирование', tech: 'Микросервисы + gRPC', note: 'Горизонтальное масштабирование, разделение на сервисы при росте нагрузки' },
  ]
  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Технологии · Стек</div>
      <h2 className="ed-title">Технологический ландшафт</h2>
      <p className="ed-lead">6 интерфейсов, AI-диагностика, Stripe Connect. Выбор стека определяет скорость и стоимость разработки.</p>

      <div className="ts-section-label">Рекомендуемый tech stack</div>
      <div className="ts-stack-grid">
        {stack.map((s, i) => (
          <div key={i} className="ts-stack-row">
            <div className="ts-stack-layer">{s.layer}</div>
            <div className="ts-stack-tech">{s.tech}</div>
            <div className="ts-stack-note">{s.note}</div>
          </div>
        ))}
      </div>

      <div className="ts-section-label" style={{ marginTop: '2rem' }}>6 интерфейсов платформы</div>
      <div className="ts-iface-grid">
        {interfaces.map((f, i) => (
          <div key={i} className={`ts-iface-card${f.priority !== 'MVP' ? ' ts-iface-later' : ''}`}>
            <div className="ts-iface-n">{f.n}</div>
            <div className="ts-iface-name">{f.name}</div>
            <div className="ts-iface-who">{f.who} · {f.platform}</div>
            <div className="ts-iface-badge" style={{ color: f.priority === 'MVP' ? 'var(--green)' : 'var(--fg-light)' }}>
              {f.priority}
            </div>
          </div>
        ))}
      </div>

      <div className="ts-section-label" style={{ marginTop: '2rem' }}>AI-инструменты для диагностики повреждений</div>
      <div className="ts-ai-grid">
        {aiTools.map((t, i) => (
          <div key={i} className="ts-ai-card">
            <div className="ts-ai-head">
              <span className="ts-ai-name">{t.name}</span>
              <span className="ts-ai-badge">{t.badge}</span>
            </div>
            <div className="ts-ai-accuracy">Точность: {t.accuracy}</div>
            <div className="ts-ai-use">{t.use}</div>
            <div className="ts-ai-cost">{t.cost}</div>
          </div>
        ))}
      </div>

      <div className="ed-pullquote" style={{ marginTop: '2rem' }}>
        Общий бюджет технологической разработки: MVP $80 000–150 000, полная платформа с AI — $250 000–700 000. AI-функции — дифференциатор и драйвер retention.
      </div>
    </div>
  )
}

// ─── DEV STAGES ───────────────────────────────────────────────────────────────
function SlideDevStages() {
  const stages = [
    { n: '1', name: 'Discovery & найм', analogy: 'Проект + бригада', weeks: '4–6 нед.', result: 'Архитектура, wireframes, контракты с командой. Все роли закрыты до начала кода.' },
    { n: '2', name: 'UI/UX дизайн', analogy: 'Чертежи', weeks: '4–6 нед.', result: 'Полный дизайн всех экранов в Figma. Клиент видит и утверждает каждый экран до начала разработки.' },
    { n: '3', name: 'Backend API', analogy: 'Фундамент', weeks: '6–8 нед.', result: 'Серверная часть, база данных, Stripe Connect. Как фундамент дома — если неправильно, всё остальное рухнет.' },
    { n: '4', name: 'Mobile apps', analogy: 'Стены', weeks: '8–10 нед.', result: 'Клиентское + шоп-приложение для iOS и Android. Самый долгий этап — здесь живёт основная функциональность.' },
    { n: '5', name: 'Web-кабинеты', analogy: 'Коммуникации', weeks: '6–8 нед.', result: 'Admin-панель, кабинет шопа, аналитика. Параллельно с mobile apps — экономит 3–4 недели общего срока.' },
    { n: '6', name: 'AI + интеграции', analogy: 'Умный дом', weeks: '4–6 нед.', result: 'Чат-бот для клиентов, BNPL (Affirm/Sunbit), push-уведомления, карты. Платформа «оживает».' },
    { n: '7', name: 'QA и тестирование', analogy: 'Приёмка', weeks: '4–6 нед.', result: 'Beta-тестирование с реальными пользователями, App Store review (обычно 1–3 дня), финальные правки.' },
    { n: '8', name: 'Запуск', analogy: 'Новоселье', weeks: '2–4 нед.', result: 'Первые клиенты в Майами. Мониторинг, быстрые итерации, поддержка команды.' },
  ]
  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Разработка · Этапы</div>
      <h2 className="ed-title">Как строится платформа</h2>
      <p className="ed-lead">8 этапов, аналогия со строительством дома. Каждый этап — конкретный результат, который можно потрогать.</p>

      <div className="ds-stages">
        {stages.map((s, i) => (
          <div key={i} className="ds-stage-row">
            <div className="ds-stage-left">
              <div className="ds-stage-n">{s.n}</div>
              <div className="ds-stage-name">{s.name}</div>
              <div className="ds-stage-analogy">{s.analogy}</div>
            </div>
            <div className="ds-stage-mid">
              <div className="ds-stage-weeks">{s.weeks}</div>
            </div>
            <div className="ds-stage-right">
              <div className="ds-stage-result">{s.result}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="ds-total-bar">
        <div className="ds-total-left">Итого</div>
        <div className="ds-total-mid">~9–11 месяцев (Standard)</div>
        <div className="ds-total-right">Production-готовый продукт в Майами</div>
      </div>

      <div className="ed-pullquote" style={{ marginTop: '1.5rem' }}>
        Каждый этап заканчивается конкретным артефактом — дизайн-документом, работающим кодом или живым приложением. Никакой «работы в чёрном ящике».
      </div>
    </div>
  )
}

// ─── ROADMAP & BUDGET ────────────────────────────────────────────────────────
function SlideRoadmapBudget() {
  const months = [
    {
      n: '1', title: 'Discovery + Архитектура + Дизайн', founders: '$30K', devs: '$7.5K', infra: '$1K', budget: '$38.5K',
      who: 'Основатели + UI/UX дизайнер ($3K) + Backend Senior ($4.5K)',
      tasks: [
        'Архитектура 50+ стр, схема БД (50+ таблиц), API-контракты',
        'Backend: настройка инфраструктуры, CI/CD, auth (JWT/OAuth)',
        'Дизайнер: wireframes 30+ экранов, начало дизайн-системы',
        'Найм остальной команды: JD, скрининг, тестовые задания',
      ],
      result: 'Архитектура + wireframes + инфраструктура готовы',
    },
    {
      n: '2', title: 'UI/UX активная фаза + Backend core', founders: '$30K', devs: '$7.5K', infra: '$1K', budget: '$38.5K',
      who: 'Та же тройка работает на полную',
      tasks: [
        'Дизайн клиентского приложения (40+ экранов)',
        'Дизайн приложения шопа (25+ экранов)',
        'Backend: модели БД, миграции, CRUD заказов',
        'Нанимаем Mobile-разработчика #1',
      ],
      result: 'Figma-макеты приложений + API auth + заказы',
    },
    {
      n: '3', title: 'UI/UX финал + Backend core', founders: '$30K', devs: '$12K', infra: '$1.5K', budget: '$43.5K',
      who: '+ Mobile Senior #1 ($4.5K)',
      tasks: [
        'Дизайн веб-кабинетов (admin, шоп, accounting)',
        'Backend: CRUD заказов, статусы, подбор шопа',
        'Онбординг шопов — backend (верификация, документы)',
        'Mobile #1 стартует клиентское приложение',
      ],
      result: 'Полный дизайн всех интерфейсов + API заказов',
    },
    {
      n: '4', title: 'Backend + Mobile полным ходом', founders: '$30K', devs: '$21K', infra: '$3K', budget: '$54K',
      who: '+ Mobile #2 ($3.5K) + Frontend ($3.5K) + QA ($2K) — полная команда',
      tasks: [
        'Stripe Connect: эскроу, split-платежи, payouts',
        'GPS-трекинг, push-уведомления (Firebase)',
        'Онбординг шопов: модерация, Stripe KYC, DocuSign',
        'Mobile клиент: поиск, каталог, карта шопов',
      ],
      result: 'Платежи работают + первые экраны приложений',
    },
    {
      n: '5', title: 'Mobile + Web старт', founders: '$30K', devs: '$21K', infra: '$3K', budget: '$54K',
      who: 'Полная команда (2 + 6)',
      tasks: [
        'Mobile клиент: заказ, оплата, трекинг, чат',
        'Mobile шоп: входящие заявки, статусы, выплаты',
        'Кабинет шопа: профиль, прайс, портфолио, расписание',
        'Backend: рейтинги, отзывы, фото до/после',
      ],
      result: 'Оба приложения в alpha + кабинет шопа',
    },
    {
      n: '6', title: 'Mobile + Admin-панели', founders: '$30K', devs: '$21K', infra: '$3K', budget: '$54K',
      who: 'Полная команда (2 + 6)',
      tasks: [
        'Финализация мобильных приложений',
        'Admin диспетчеров: live dashboard, споры, чат поддержки, GPS-мониторинг',
        'Admin accounting: выплаты, комиссии, отчёты',
        'Промокоды и акции в админке',
      ],
      result: 'Приложения feature-complete + обе админки',
    },
    {
      n: '7', title: 'Web-кабинеты + AI старт', founders: '$30K', devs: '$21K', infra: '$4K', budget: '$55K',
      who: 'Полная команда (2 + 6)',
      tasks: [
        'Accounting: export QuickBooks, reconciliation',
        'Портал онбординга шопов — web-интерфейс',
        'AI чат-бот (Claude/GPT) + голосовой ввод',
        'Портал партнёров (страховые)',
      ],
      result: 'Все кабинеты готовы + AI-ассистент в beta',
    },
    {
      n: '8', title: 'AI + Интеграции', founders: '$30K', devs: '$21K', infra: '$5K', budget: '$56K',
      who: 'Полная команда (2 + 6)',
      tasks: [
        'Фото-диагностика (Ravin AI SDK)',
        'Affirm/Sunbit (BNPL-рассрочка)',
        'Twilio (SMS), Google Maps (маршруты, ETA)',
        'DocuSign для NDA шопов при онбординге',
      ],
      result: 'Платформа полностью интегрирована',
    },
    {
      n: '9', title: 'QA + Beta', founders: '$30K', devs: '$21K', infra: '$4K', budget: '$55K',
      who: 'Полная команда (2 + 6)',
      tasks: [
        '500+ авто-тестов, нагрузочное (10K concurrent)',
        'Security audit всей платформы',
        'Beta с 20–50 шопами в Майами',
        'Подготовка App Store / Google Play',
      ],
      result: 'Стабильная beta-версия на реальных пользователях',
    },
    {
      n: '10', title: 'Запуск', founders: '$30K', devs: '$17.5K', infra: '$4K', budget: '$51.5K',
      who: 'Команда сокращается (2 + 5) — дизайнер завершает',
      tasks: [
        'Подача в App Store + Google Play',
        'Production deploy + мониторинг 24/7',
        'Hot-fixes по фидбеку beta',
        'Онбординг первых реальных шопов в Майами',
      ],
      result: 'Live в Майами — приложения в сторах',
    },
    {
      n: '11', title: 'Стабилизация', founders: '$30K', devs: '$12.5K', infra: '$3K', budget: '$45.5K',
      who: 'Команда оптимизируется (2 + 4)',
      tasks: [
        'Итерации по фидбеку пользователей',
        'Performance-оптимизация',
        'Финальная полировка UI',
        'Документация для handoff / Phase 2',
      ],
      result: 'Стабильный production-продукт',
    },
  ]

  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Разработка · Помесячный план</div>
      <h2 className="ed-title">11 месяцев — от нуля до production</h2>
      <p className="ed-lead">
        Не нужно вкладывать $50K+ с первого дня. Команда растёт постепенно — от $38.5K в первый месяц до $56K на пике. Бюджет увеличивается только вместе с командой и объёмом работ.
      </p>

      <div className="rm-stats">
        <motion.div className="rm-stat" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
          <div className="rm-stat-num">$<Count to={566} suffix="K" /></div>
          <div className="rm-stat-label">общий бюджет Standard</div>
        </motion.div>
        <motion.div className="rm-stat" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.08 }}>
          <div className="rm-stat-num">$<Count to={38} suffix="K" /> → $<Count to={56} suffix="K" /></div>
          <div className="rm-stat-label">ежемесячный платёж растёт с командой</div>
        </motion.div>
        <motion.div className="rm-stat" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.16 }}>
          <div className="rm-stat-num"><Count to={11} /> мес</div>
          <div className="rm-stat-label">до production в Майами</div>
        </motion.div>
        <motion.div className="rm-stat" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.24 }}>
          <div className="rm-stat-num"><Count to={2} /> + <Count to={6} /></div>
          <div className="rm-stat-label">основатели + разработчики (пик)</div>
        </motion.div>
      </div>

      <div className="rm-timeline">
        {months.map((m, i) => (
          <motion.div key={i} className="rm-month"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.04 }}>
            <div className="rm-month-head">
              <div className="rm-month-n">Мес {m.n}</div>
              <div className="rm-month-title">{m.title}</div>
              <div className="rm-month-who">{m.who}</div>
              <div className="rm-month-breakdown">
                <span>Осн: {m.founders}</span>
                <span>Dev: {m.devs}</span>
                <span>Инфра: {m.infra}</span>
              </div>
              <div className="rm-month-budget">{m.budget}</div>
            </div>
            <ul className="rm-month-tasks">
              {m.tasks.map((t, j) => <li key={j}>{t}</li>)}
            </ul>
            <div className="rm-month-result">{m.result}</div>
          </motion.div>
        ))}
      </div>

      <WavyDivider />

      <h3 className="ed-section-title" style={{ marginTop: '2rem' }}>Что вы получаете на каждом этапе</h3>
      <p className="ed-lead" style={{ fontSize: '0.92rem', marginBottom: '1.2rem' }}>
        Каждый продукт проходит путь: архитектура → дизайн → прототип → рабочий код → production. Вот что вы увидите каждый месяц.
      </p>

      <div className="rm-product-roadmap">
        <div className="rm-pr-header">
          <div className="rm-pr-product-label">Продукт</div>
          {[1,2,3,4,5,6,7,8,9,10,11].map(m => (
            <div key={m} className="rm-pr-month-label">{m}</div>
          ))}
        </div>
        {[
          { name: 'Приложение клиента', phases: [
            { start: 1, end: 2, label: 'Дизайн', color: '#ec4899' },
            { start: 3, end: 4, label: 'Прототип', color: '#f59e0b' },
            { start: 5, end: 7, label: 'Разработка', color: '#10b981' },
            { start: 8, end: 9, label: 'QA + Beta', color: '#8b5cf6' },
            { start: 10, end: 11, label: 'Production', color: '#6366f1' },
          ]},
          { name: 'Приложение шопа', phases: [
            { start: 1, end: 2, label: 'Дизайн', color: '#ec4899' },
            { start: 4, end: 5, label: 'Прототип', color: '#f59e0b' },
            { start: 5, end: 7, label: 'Разработка', color: '#10b981' },
            { start: 8, end: 9, label: 'QA + Beta', color: '#8b5cf6' },
            { start: 10, end: 11, label: 'Production', color: '#6366f1' },
          ]},
          { name: 'Бэкенд (API)', phases: [
            { start: 1, end: 1, label: 'Архитектура', color: '#ec4899' },
            { start: 2, end: 4, label: 'Core API', color: '#10b981' },
            { start: 5, end: 7, label: 'Интеграции', color: '#f59e0b' },
            { start: 8, end: 9, label: 'QA + Beta', color: '#8b5cf6' },
            { start: 10, end: 11, label: 'Production', color: '#6366f1' },
          ]},
          { name: 'Кабинет шопа', phases: [
            { start: 3, end: 3, label: 'Дизайн', color: '#ec4899' },
            { start: 5, end: 6, label: 'Разработка', color: '#10b981' },
            { start: 9, end: 9, label: 'QA', color: '#8b5cf6' },
            { start: 10, end: 10, label: 'Prod', color: '#6366f1' },
          ]},
          { name: 'Admin диспетчеров', phases: [
            { start: 3, end: 3, label: 'Дизайн', color: '#ec4899' },
            { start: 6, end: 7, label: 'Разработка', color: '#10b981' },
            { start: 9, end: 9, label: 'QA', color: '#8b5cf6' },
            { start: 10, end: 10, label: 'Prod', color: '#6366f1' },
          ]},
          { name: 'Admin accounting', phases: [
            { start: 3, end: 3, label: 'Дизайн', color: '#ec4899' },
            { start: 7, end: 8, label: 'Разработка', color: '#10b981' },
            { start: 9, end: 9, label: 'QA', color: '#8b5cf6' },
            { start: 10, end: 10, label: 'Prod', color: '#6366f1' },
          ]},
          { name: 'Онбординг шопов', phases: [
            { start: 1, end: 1, label: 'Проект', color: '#ec4899' },
            { start: 3, end: 5, label: 'Backend + Web', color: '#10b981' },
            { start: 9, end: 9, label: 'QA', color: '#8b5cf6' },
            { start: 10, end: 10, label: 'Prod', color: '#6366f1' },
          ]},
          { name: 'AI-ассистент', phases: [
            { start: 7, end: 8, label: 'Разработка', color: '#10b981' },
            { start: 9, end: 9, label: 'QA', color: '#8b5cf6' },
            { start: 10, end: 11, label: 'Production', color: '#6366f1' },
          ]},
          { name: 'Портал партнёров', phases: [
            { start: 7, end: 8, label: 'Разработка', color: '#10b981' },
            { start: 9, end: 9, label: 'QA', color: '#8b5cf6' },
            { start: 10, end: 10, label: 'Prod', color: '#6366f1' },
          ]},
        ].map((product, i) => (
          <motion.div key={i} className="rm-pr-row"
            initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.04 }}>
            <div className="rm-pr-product">{product.name}</div>
            <div className="rm-pr-cells">
              {[1,2,3,4,5,6,7,8,9,10,11].map(m => {
                const phase = product.phases.find(p => m >= p.start && m <= p.end)
                return (
                  <div key={m} className="rm-pr-cell"
                    style={phase ? { background: phase.color + '20', borderBottom: `2px solid ${phase.color}` } : {}}>
                    {phase && m === phase.start && (
                      <span className="rm-pr-label" style={{ color: phase.color }}>{phase.label}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="rm-legend">
        <span><span className="rm-legend-dot" style={{ background: '#ec4899' }} /> Дизайн / Архитектура</span>
        <span><span className="rm-legend-dot" style={{ background: '#f59e0b' }} /> Прототип</span>
        <span><span className="rm-legend-dot" style={{ background: '#10b981' }} /> Разработка</span>
        <span><span className="rm-legend-dot" style={{ background: '#8b5cf6' }} /> QA / Beta</span>
        <span><span className="rm-legend-dot" style={{ background: '#6366f1' }} /> Production</span>
      </div>
    </div>
  )
}

// ─── TEAM & HIRING ───────────────────────────────────────────────────────────
function SlideTeamHiring() {
  const founders = [
    { role: 'Co-founder / CTO', level: 'CA Lead', rate: '$15K/мес', color: '#6366f1', desc: 'Техническое лидерство, архитектура, code review, клиент-коммуникация' },
    { role: 'Co-founder / CPO', level: 'CA Lead', rate: '$15K/мес', color: '#6366f1', desc: 'Продукт, UX-решения, приоритизация фич, контроль качества, демо клиенту' },
  ]

  const roles = [
    { role: 'UI/UX дизайнер', level: 'Mid+', when: 'Месяц 1', rate: '$3K/мес', color: '#ec4899', desc: '100+ экранов, дизайн-система, Figma, HIG + Material 3' },
    { role: 'Backend-разработчик', level: 'Senior', when: 'Месяц 1', rate: '$4.5K/мес', color: '#f59e0b', desc: 'Go (Golang), Stripe Connect, GPS, высоконагруженный API' },
    { role: 'iOS-разработчик', level: 'Senior', when: 'Месяц 2', rate: '$4.5K/мес', color: '#10b981', desc: 'Swift/SwiftUI, клиентское + шоп приложение, Apple Pay, GPS' },
    { role: 'Android-разработчик', level: 'Mid+', when: 'Месяц 4', rate: '$3.5K/мес', color: '#22c55e', desc: 'Kotlin/Jetpack Compose, клиентское + шоп приложение, Google Pay' },
    { role: 'Frontend (Web)', level: 'Mid+', when: 'Месяц 4', rate: '$3.5K/мес', color: '#f97316', desc: 'Admin-панели, кабинет шопа, accounting, портал партнёров' },
    { role: 'QA-инженер', level: 'Mid', when: 'Месяц 4', rate: '$2K/мес', color: '#8b5cf6', desc: 'Авто + ручное тестирование, 500+ тестов, нагрузочное' },
  ]

  const modules = [
    { name: 'Приложение клиента', platform: 'iOS + Android', user: 'Автовладелец', icon: '1' },
    { name: 'Приложение шопа', platform: 'iOS + Android', user: 'Мастер / менеджер', icon: '2' },
    { name: 'Кабинет шопа', platform: 'Web', user: 'Владелец сервиса', icon: '3' },
    { name: 'Admin — Диспетчеры', platform: 'Web', user: 'Операторы Carreta', icon: '4' },
    { name: 'Admin — Accounting', platform: 'Web', user: 'Финансовый отдел', icon: '5' },
    { name: 'Онбординг шопов', platform: 'Web + API', user: 'Шоп + модерация', icon: '6' },
    { name: 'Портал партнёров', platform: 'Web', user: 'Страховые, франчайзи', icon: '7' },
    { name: 'Центральный бэкенд', platform: 'Сервер', user: 'Все продукты', icon: '8' },
    { name: 'AI-ассистент', platform: 'Встроен', user: 'Клиент', icon: '9' },
  ]

  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Разработка · Команда и модули</div>
      <h2 className="ed-title">Кого нанимаем и что строим</h2>
      <p className="ed-lead">
        8 специалистов, 9 продуктовых модулей. Команда масштабируется постепенно — от 3 человек в первый месяц до 8 на пике. Не нанимаем всех сразу — подключаем по мере готовности предыдущих слоёв.
      </p>

      <h3 className="ed-section-title">Основатели — CA-лидеры проекта</h3>
      <div className="ht-grid">
        {founders.map((r, i) => (
          <motion.div key={i} className="ht-card ht-card-founder"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}>
            <div className="ht-card-head">
              <div className="ht-dot" style={{ background: r.color }} />
              <div className="ht-role">{r.role}</div>
              <div className="ht-level">{r.level}</div>
            </div>
            <div className="ht-meta">
              <span className="ht-when">Весь проект (11 мес)</span>
              <span className="ht-rate">{r.rate}</span>
            </div>
            <div className="ht-desc">{r.desc}</div>
          </motion.div>
        ))}
      </div>

      <h3 className="ed-section-title" style={{ marginTop: '1.5rem' }}>6 разработчиков — Восточная Европа</h3>
      <div className="ht-grid">
        {roles.map((r, i) => (
          <motion.div key={i} className="ht-card"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}>
            <div className="ht-card-head">
              <div className="ht-dot" style={{ background: r.color }} />
              <div className="ht-role">{r.role}</div>
              <div className="ht-level">{r.level}</div>
            </div>
            <div className="ht-meta">
              <span className="ht-when">{r.when}</span>
              <span className="ht-rate">{r.rate}</span>
            </div>
            <div className="ht-desc">{r.desc}</div>
          </motion.div>
        ))}
      </div>

      <WavyDivider />

      <h3 className="ed-section-title" style={{ marginTop: '2rem' }}>9 модулей платформы</h3>
      <div className="mod-grid">
        {modules.map((m, i) => (
          <motion.div key={i} className="mod-card"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.04 }}>
            <div className="mod-icon">{m.icon}</div>
            <div className="mod-info">
              <div className="mod-name">{m.name}</div>
              <div className="mod-platform">{m.platform}</div>
              <div className="mod-user">{m.user}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="rm-salary-box" style={{ marginTop: '2rem' }}>
        <div className="rm-salary-title">Как растёт ежемесячный платёж</div>
        <div className="rm-salary-row"><span>Мес 1–2 — основатели + дизайнер + backend</span><span>$38.5K</span></div>
        <div className="rm-salary-row"><span>Мес 3 — + mobile #1</span><span>$43.5K</span></div>
        <div className="rm-salary-row"><span>Мес 4–9 — полная команда (2+6)</span><span>$54–56K</span></div>
        <div className="rm-salary-row"><span>Мес 10–11 — команда оптимизируется</span><span>$45–51K</span></div>
        <div className="rm-salary-row total"><span>Итого за 11 месяцев</span><span>~$566K</span></div>
      </div>

      <div className="ed-pullquote" style={{ marginTop: '1rem' }}>
        Основатели ($15K × 2) работают все 11 месяцев — это $330K. Остальные $228K — зарплаты 6 разработчиков + инфраструктура. Команда масштабируется постепенно: нет смысла платить за 8 человек, когда работа есть только для троих.
      </div>
    </div>
  )
}

// ─── PORTFOLIO ────────────────────────────────────────────────────────────────
function SlidePortfolio() {
  const cases = [
    {
      n: '01', name: 'Vohha', tag: 'AI · iOS + Android',
      desc: 'Интеллектуальная система диспетчеризации на базе AI: оптимизирует координацию и управление в реальном времени. Наш первый production AI-продукт.',
      links: [
        { label: 'App Store', url: 'https://apps.apple.com/us/app/vohha-app/id6478448549' },
        { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.belgilabs.vohha' },
      ],
    },
    {
      n: '03', name: 'Evolution: Битва за Утопию', tag: 'Стратегия · iOS + Android · Миллионы установок',
      desc: 'Крупная мультиплеерная стратегия с миллионами установок. Сложная игровая механика, мультиплеер, высоконагруженная серверная архитектура под большую базу игроков.',
      links: [
        { label: 'App Store', url: 'https://apps.apple.com/ru/app/evolution-battle-for-utopia/id774652325' },
        { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.my.evolution.android' },
      ],
    },
    {
      n: '04', name: 'В небо — АОПА России', tag: 'Авиация · Flutter · Офлайн-синхронизация',
      desc: '1,5 года разработки. Картография, офлайн-синхронизация, сложная навигация. Продукт работает без интернета — требует нестандартной архитектуры данных.',
      links: [
        { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=ru.vega.flightplan' },
      ],
    },
    {
      n: '05', name: 'BBBoom', tag: 'AR · 3D · Мультиплеер',
      desc: 'Мобильный мультиплеерный 3D-футбол с дополненной реальностью. Трёхмерная графика, сетевое взаимодействие в реальном времени, AR-поле прямо перед вами.',
      links: [
        { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.lodisgroup.bbboom' },
      ],
    },
    {
      n: '06', name: 'QR AI для Таиланда', tag: 'AI · ML · Дообучение модели',
      desc: 'Быстрое сканирование и распознавание тайских чеков через DeepSeek AI, дообученный на реальных данных. Опыт работы с нестандартными форматами и fine-tuning ML-моделей.',
      links: [
        { label: 'Figma дизайн', url: 'https://www.figma.com/design/1JwAustUEWSY47bptgD52L/Qr?node-id=0-1&p=f' },
      ],
    },
    {
      n: '07', name: 'Планетариум 4D', tag: 'AR · Образование · iOS + Android',
      desc: 'AR-приложение для изучения космоса: распознавание пространства, наложение планет и созвездий в реальном окружении. Immersive-опыт без специального оборудования.',
      links: [
        { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.lodisgroup.kosmos4d' },
      ],
    },
    {
      n: '08', name: 'Моя рыбалка', tag: 'Соцсеть · Геолокация · Карты',
      desc: 'Первая специализированная соцсеть для рыболовов России: геолокация мест, обмен опытом, сообщество. Сложная работа с картами и точками интереса.',
      links: [
        { label: 'Веб-сайт', url: 'https://myfish.pro/' },
        { label: 'RuStore', url: 'https://www.rustore.ru/catalog/app/pro.myfish.app' },
      ],
    },
    {
      n: '09', name: 'Syntoks', tag: 'Соцсеть · Flutter · Legacy',
      desc: 'Текстовая социальная платформа. Работа с унаследованной кодовой базой: рефакторинг, добавление новой функциональности без разрушения существующей архитектуры.',
      links: [
        { label: 'Веб-сайт', url: 'https://syntoks.com/' },
      ],
    },
    {
      n: '10', name: 'ShkolaApp', tag: 'EdTech · iOS + Android + RuStore',
      desc: 'Образовательная платформа с единой кодовой базой для трёх сторов: iOS App Store, Google Play и RuStore. Одна разработка — три markets одновременно.',
      links: [
        { label: 'Веб-сайт', url: 'https://shkola.app/' },
        { label: 'App Store', url: 'https://apps.apple.com/ru/app/shkolaapp/id6736643540' },
        { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.Versh.School' },
      ],
    },
    {
      n: '11', name: 'Сибирская монета — Altai Palace', tag: 'Казино · Лояльность · iOS + Android',
      desc: 'Мобильное приложение казино-развлекательного комплекса: игровые механики, система лояльности, удержание пользователей. Production на iOS и Android.',
      links: [
        { label: 'App Store', url: 'https://apps.apple.com/ru/app/%D1%81%D0%B8%D0%B1%D0%B8%D1%80%D1%81%D0%BA%D0%B0%D1%8F-%D0%BC%D0%BE%D0%BD%D0%B5%D1%82%D0%B0/id1586118621' },
        { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.siberia.vegas' },
      ],
    },
  ]
  return (
    <div className="slide-content">
      <div className="ed-eyebrow">Кейсы · Что мы построили</div>
      <h2 className="ed-title">Наши работы</h2>
      <p className="ed-lead">AI-продукты, маркетплейсы, соцсети, AR-приложения — 10 лет разработки на iOS, Android и Web. Carreta по сложности и масштабу — в ряду того, что мы уже делали.</p>

      <div className="port-featured">
        <div className="port-feat-eyebrow">02 · Текущий проект</div>
        <div className="port-feat-head">
          <div>
            <div className="port-feat-name">Mosco.ai — Multi-Agent Operating System</div>
            <div className="port-feat-sub">Операционная система для сервисного бизнеса на базе 11 AI-агентов</div>
          </div>
          <div className="port-feat-tag">SaaS · AI · $199–497/мес</div>
        </div>
        <p className="port-feat-desc">
          Mosco.ai — это не CRM и не чат-бот. Это операционная система на агентной архитектуре: каждый агент — отдельный специалист с конкретной задачей. Frontline отвечает на звонки и сообщения 24/7, Dispatcher распределяет задания по команде, Vision Estimator оценивает объём работ по фотографии, The Closer ведёт сделку до подписания. Вместе они заменяют 5–10 SaaS-инструментов.
        </p>
        <p className="port-feat-desc" style={{ marginTop: '0.6rem' }}>
          Ключевая идея архитектуры: агентов можно создавать под любую задачу, которая только придёт в голову — новый агент добавляется в систему как новый модуль, не ломая существующее. Сегодня это 11 агентов для сервисного бизнеса. Завтра — столько, сколько нужно бизнесу.
        </p>
        <div className="port-feat-stats">
          {[
            { n: '11', l: 'AI-агентов' },
            { n: '80+', l: 'страниц' },
            { n: '224', l: 'React-компонента' },
            { n: '9', l: 'интеграций prod' },
            { n: '20', l: 'state-хранилищ' },
          ].map((s, i) => (
            <div key={i} className="port-feat-stat">
              <span className="port-feat-stat-n">{s.n}</span>
              <span className="port-feat-stat-l">{s.l}</span>
            </div>
          ))}
        </div>
        <div className="port-feat-tech">
          Next.js 16 · React 19 · TypeScript · FastAPI (Python 3.13) · PostgreSQL · Twilio · WhatsApp · Meta · Google Ads · Stripe · OpenAI
        </div>
        <div className="port-feat-verticals">
          Вертикали: HVAC · Кровля · Авто-детейлинг / PPF · Ремонт · Покраска · Витрины
        </div>
      </div>

      <div className="port-grid">
        {cases.map((c, i) => (
          <motion.div key={i} className="port-card"
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}>
            <div className="port-card-top">
              <span className="port-card-n">{c.n}</span>
              <span className="port-card-tag">{c.tag}</span>
            </div>
            <div className="port-card-name">{c.name}</div>
            <p className="port-card-desc">{c.desc}</p>
            <div className="port-card-links">
              {c.links.map((l, j) => (
                <a key={j} href={l.url} target="_blank" rel="noopener noreferrer" className="port-card-link">{l.label}</a>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── POST-LAUNCH SUPPORT ───────────────────────────────────────────────────────
function SlideSupport() {
  const options = [
    {
      phase: 'A',
      title: 'Support Retainer',
      price: '$5–10K/мес',
      color: '#1A9D8A',
      timing: 'Начинается сразу после запуска',
      desc: 'Мы остаёмся командой. Исправляем баги, мониторим систему, отвечаем на вопросы, вносим мелкие улучшения — без отдельного контракта на каждый тикет.',
      items: [
        'Гарантия ответа в течение 24 часов',
        'Исправление критических багов в течение 48 часов',
        'Мониторинг сервера и App Store reviews',
        'Мелкие улучшения UI/UX (до 20 часов/мес)',
        'Ежемесячная встреча по продукту',
      ],
      best: 'Лучший вариант для быстро растущего продукта',
    },
    {
      phase: 'B',
      title: 'Phase 2 — новый контракт',
      price: 'По договорённости',
      color: '#C8860A',
      timing: 'Когда есть понимание следующих фич',
      desc: 'Когда Carreta растёт и нужны новые функции — садимся за стол, согласовываем scope и бюджет Phase 2. Та же команда, та же прозрачность, новый контракт.',
      items: [
        'Новые фичи по приоритетам бизнеса',
        'Масштабирование инфраструктуры под рост пользователей',
        'Новые интеграции (страховые, B2B-клиенты, флиты)',
        'Расширение на новые города и вертикали',
        'Оценка и контракт за 1–2 недели',
      ],
      best: 'Оптимально, когда Carreta получила первых клиентов и видит, что строить дальше',
    },
    {
      phase: 'C',
      title: 'Full Handoff',
      price: 'Разово',
      color: '#7A7875',
      timing: 'Если хотите в-house команду',
      desc: 'Полная передача проекта вашей команде или другому подрядчику. Документируем всё, объясняем архитектурные решения, помогаем найти и онбордить новых разработчиков.',
      items: [
        'Полная техническая документация (архитектура, API, БД)',
        'Видео-walkthrough по ключевым частям системы',
        'Сессии Q&A с новой командой (до 10 часов)',
        'Передача доступов, credentials, vendor-аккаунтов',
        'Код уже ваш с первого дня — никаких юридических формальностей',
      ],
      best: 'Если хотите построить внутреннюю команду или сменить подрядчика',
    },
  ]
  return (
    <div className="slide-content">
      <div className="ed-eyebrow">После запуска · Дальнейшее развитие</div>
      <h2 className="ed-title">Что происходит после production</h2>
      <p className="ed-lead">Мы сдаём работающий продукт — это не конец, а начало. Три варианта того, как мы работаем дальше. Выбор за вами в любой момент.</p>

      <div className="sup-grid">
        {options.map((o, i) => (
          <motion.div key={i} className="sup-card"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.1 }}>
            <div className="sup-phase" style={{ color: o.color, borderColor: o.color + '40' }}>{o.phase}</div>
            <div className="sup-head">
              <div className="sup-title">{o.title}</div>
              <div className="sup-price" style={{ color: o.color }}>{o.price}</div>
            </div>
            <div className="sup-timing">{o.timing}</div>
            <p className="sup-desc">{o.desc}</p>
            <ul className="sup-items">
              {o.items.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
            <div className="sup-best">{o.best}</div>
          </motion.div>
        ))}
      </div>

      <div className="sup-note">
        <div className="sup-note-title">Гарантийный период — без доплат</div>
        <p>Первые 90 дней после запуска: все технические баги исправляем бесплатно. Это не «поддержка» — это часть обязательств по договору. Новые функции и расширения — уже отдельный разговор.</p>
      </div>
    </div>
  )
}

// ─── NAVIGATION ───────────────────────────────────────────────────────────────
const GROUPS = [
  {
    id: 'intro', label: 'Введение',
    slides: [
      { id: 'hero', label: 'CARRETA', Component: Slide01Hero },
    ],
  },
  {
    id: 'market', label: 'Рынок',
    slides: [
      { id: 'problem', label: 'Проблема', Component: Slide02Problem },
      { id: 'marketsize', label: 'Размер рынка', Component: SlideMarketSize },
      { id: 'competitors', label: 'Конкуренты', Component: Slide13Competitors },
      { id: 'adjacent', label: 'Смежные игроки', Component: SlideAdjacentPlayers },
      { id: 'failures', label: 'Уроки провалов', Component: SlideFailures },
    ],
  },
  {
    id: 'product', label: 'Продукт',
    slides: [
      { id: 'product', label: 'Что строим', Component: Slide03Product },
      { id: 'eco', label: 'Экосистема', Component: Slide04Ecosystem },
      { id: 'order', label: 'Жизненный цикл', Component: Slide05OrderFlow },
      { id: 'mono', label: 'Монетизация', Component: Slide06Monetization },
      { id: 'unitec', label: 'Экономика и BNPL', Component: SlideBNPLSubs },
    ],
  },
  {
    id: 'launch', label: 'Запуск',
    slides: [
      { id: 'miami', label: 'Майами', Component: SlideMiami },
      { id: 'legal', label: 'Правовая среда', Component: SlideLegal },
    ],
  },
  {
    id: 'business', label: 'Бизнес-кейс',
    slides: [
      { id: 'swot', label: 'SWOT-анализ', Component: SlideSWOT },
      { id: 'investors', label: 'Инвестиции', Component: SlideInvestors },
    ],
  },
  {
    id: 'dev', label: 'Разработка',
    slides: [
      { id: 'infra', label: 'IT-архитектура', Component: Slide10Infra },
      { id: 'techstack', label: 'Tech Stack + AI', Component: SlideTechStack },
      { id: 'devstages', label: 'Этапы разработки', Component: SlideDevStages },
      { id: 'phases', label: 'Сроки по фазам', Component: Slide07Phases },
      { id: 'roadmap', label: 'Помесячный план', Component: SlideRoadmapBudget },
      { id: 'hiring', label: 'Команда и модули', Component: SlideTeamHiring },
      { id: 'process', label: 'Процесс', Component: Slide11Process },
    ],
  },
  {
    id: 'cost', label: 'Стоимость',
    slides: [
      { id: 'pricing', label: 'Варианты', Component: Slide08Pricing },
      { id: 'justify', label: 'Обоснование', Component: Slide09Market },
    ],
  },
  {
    id: 'cases', label: 'Кейсы',
    slides: [
      { id: 'portfolio', label: 'Наши работы', Component: SlidePortfolio },
    ],
  },
  {
    id: 'trust', label: 'Условия',
    slides: [
      { id: 'guarantees', label: 'Защита клиента', Component: SlideGuarantees },
      { id: 'support', label: 'После запуска', Component: SlideSupport },
      { id: 'faq', label: 'Вопросы и ответы', Component: SlideFAQ },
      { id: 'day30', label: 'Первые 30 дней', Component: SlideDay30 },
    ],
  },
  {
    id: 'partnership', label: 'Партнерство',
    slides: [
      { id: 'deal', label: 'Условия 15/15', Component: SlidePartnershipDeal },
      { id: 'startup-roadmap', label: 'Roadmap найма', Component: SlideRoadmapStartup },
      { id: 'budget-plan', label: 'Бюджет $30K', Component: SlideBudgetPlan },
      { id: 'mosco-synergy', label: 'Mosco AI', Component: SlideMoscoSynergy },
    ],
  },
  {
    id: 'cta', label: 'Старт',
    slides: [
      { id: 'cta', label: 'Начать', Component: Slide12CTA },
    ],
  },
  {
    id: 'kickoff', label: 'Начало работы', isKickoff: true,
    slides: [
      { id: 'original-catalog', label: 'Исходный PDF', Component: SlideKickoffOriginalCatalog },
      { id: 'exec-summary', label: 'Главное', Component: SlideKickoffExecSummary },
      { id: 'launch-status', label: 'Статус', Component: SlideKickoffLaunchStatus },
      { id: 'catalog-gaps', label: '17 пробелов', Component: SlideKickoffGaps },
      { id: 'full-catalog', label: '100+ услуг', Component: SlideKickoffCatalog },
      { id: 'pricing', label: 'Цены', Component: SlideKickoffPricing },
      { id: 'journey', label: 'Путь клиента', Component: SlideKickoffJourney },
      { id: 'strategic', label: 'Стратегия', Component: SlideKickoffStrategic },
      { id: 'top10', label: 'Top-10', Component: SlideKickoffTop10 },
      { id: 'competition', label: 'Конкуренты', Component: SlideKickoffCompetition },
      { id: 'dev-impact', label: 'Импакт', Component: SlideKickoffImpact },
      { id: 'providers', label: 'Провайдеры', Component: SlideKickoffProviders },
      { id: 'questions', label: 'Вопросы', Component: SlideKickoffQuestions },
      { id: 'kickoff-roadmap', label: 'Roadmap', Component: SlideKickoffRoadmap },
    ],
  },
]

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [groupIdx, setGroupIdx] = useState(0)
  const [slideIdx, setSlideIdx] = useState(0)
  const [dark, setDark] = useState(false)

  const group = GROUPS[groupIdx]
  const slide = group.slides[slideIdx]
  const { Component } = slide

  // Flat list for keyboard nav
  const allSlides = GROUPS.flatMap((g, gi) => g.slides.map((s, si) => ({ gi, si })))
  const flatIdx = allSlides.findIndex(s => s.gi === groupIdx && s.si === slideIdx)
  const total = allSlides.length

  const goTo = useCallback((fi) => {
    if (fi < 0 || fi >= total) return
    const { gi, si } = allSlides[fi]
    setGroupIdx(gi)
    setSlideIdx(si)
  }, [allSlides, total])

  const prev = useCallback(() => goTo(flatIdx - 1), [flatIdx, goTo])
  const next = useCallback(() => goTo(flatIdx + 1), [flatIdx, goTo])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next()
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [prev, next])

  const handleGroupChange = (gi) => {
    setGroupIdx(gi)
    setSlideIdx(0)
  }

  return (
    <div className={`deck${dark ? ' dark' : ''}`}>
      {/* Top bar */}
      <header className="deck-top">
        <div className="deck-brand">CARRETA</div>
        <nav className="deck-tabs">
          {GROUPS.map((g, i) => (
            <button key={g.id}
              className={`deck-tab${i === groupIdx ? ' deck-tab-active' : ''}${g.isKickoff ? ' deck-tab-kickoff' : ''}`}
              onClick={() => handleGroupChange(i)}>
              {g.isKickoff && <span className="deck-tab-kickoff-dot" />}
              {g.label}
            </button>
          ))}
        </nav>
        <button className="theme-toggle" onClick={() => setDark(d => !d)} title="Переключить тему">
          <span className="theme-toggle-icon">{dark ? '☀' : '◑'}</span>
          {dark ? 'Светлая' : 'Тёмная'}
        </button>
        <div className="deck-counter">{String(flatIdx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</div>
      </header>

      {/* Body */}
      <div className="deck-body">
        {/* Sidebar — only when group has multiple slides */}
        {group.slides.length > 1 && (
          <aside className="deck-sidebar">
            <div className="sidebar-group-label">{group.label}</div>
            {group.slides.map((s, i) => (
              <button key={s.id}
                className={`sidebar-item${i === slideIdx ? ' sidebar-item-active' : ''}`}
                onClick={() => setSlideIdx(i)}>
                {s.label}
              </button>
            ))}
          </aside>
        )}

        {/* Main content */}
        <main className="deck-main">
          <AnimatePresence mode="wait">
            <motion.div key={`${groupIdx}-${slideIdx}`} className="deck-content"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}>
              <Component />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Bottom nav */}
      <footer className="deck-footer">
        <button className="deck-arrow" onClick={prev} disabled={flatIdx === 0}>
          ← Назад
        </button>
        <span className="deck-slide-label">{group.label} · {slide.label}</span>
        <button className="deck-arrow" onClick={next} disabled={flatIdx === total - 1}>
          Далее →
        </button>
      </footer>
    </div>
  )
}
