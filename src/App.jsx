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
    { layer: 'Мобильные приложения', tech: 'React Native (Expo)', note: 'Единая кодовая база iOS + Android — экономия 40% бюджета' },
    { layer: 'Backend MVP', tech: 'Node.js + TypeScript', note: 'Быстрый старт, большая экосистема, TypeScript = типобезопасность' },
    { layer: 'База данных', tech: 'PostgreSQL', note: 'Реляционная БД — транзакции, эскроу, заказы' },
    { layer: 'Кэш / очереди', tech: 'Redis + BullMQ', note: 'Push-уведомления, фоновые задачи, rate limiting' },
    { layer: 'Платежи', tech: 'Stripe Connect', note: 'Эскроу, instant payout шопам, KYC автоматически' },
    { layer: 'Карты / GPS', tech: 'Google Maps SDK', note: 'Real-time трекинг заказа, ETA, геолокация шопов' },
    { layer: 'AI / Vision', tech: 'Ravin AI → Tractable', note: 'Начинаем с Ravin, мигрируем на Tractable при scale' },
    { layer: 'Масштабирование', tech: 'Go / Kotlin (фаза 2)', note: 'Критические сервисы переписываются при росте нагрузки' },
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
    id: 'cta', label: 'Старт',
    slides: [
      { id: 'cta', label: 'Начать', Component: Slide12CTA },
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
              className={`deck-tab${i === groupIdx ? ' deck-tab-active' : ''}`}
              onClick={() => handleGroupChange(i)}>
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
