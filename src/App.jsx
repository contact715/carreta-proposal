import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import './App.css'

function S({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const v = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.section ref={ref} initial={{ opacity: 0, y: 32 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.22,1,0.36,1] }} className={className}>{children}</motion.section>
  )
}

const phases = [
  { n:'01', t:'Найм команды', d:'Поиск, собеседования, тестовые задания, NDA', a:'Выбрать бригаду', w:'1–6 нед' },
  { n:'02', t:'Discovery и архитектура', d:'Полное ТЗ, схема БД, API-контракты, wireframes', a:'Чертеж дома', w:'1–6 нед' },
  { n:'03', t:'UX/UI дизайн', d:'100+ экранов всех приложений и кабинетов', a:'Дизайн интерьера', w:'4–12 нед' },
  { n:'04', t:'Бэкенд', d:'Заказы, платежи (эскроу), матчинг, GPS, чат', a:'Фундамент', w:'6–16 нед' },
  { n:'05', t:'Мобильные приложения', d:'2 приложения (клиент + шоп) для iOS и Android', a:'Стены', w:'10–24 нед' },
  { n:'06', t:'Веб-кабинеты', d:'Кабинет шопа + Admin + веб клиента', a:'Отделка', w:'12–24 нед' },
  { n:'07', t:'AI + интеграции', d:'Чат-бот, голос, фото-диагностика, OBD', a:'Умный дом', w:'16–26 нед' },
  { n:'08', t:'Тестирование и запуск', d:'Beta с шопами, 500+ тестов, App Store', a:'Приемка', w:'24–40 нед' },
]

const plans = [
  { id:'a', name:'Premium', badge:'Максимальная скорость', price:'$700K — $1.2M', mo:'$85–130K/мес', time:'7–9 мес', team:'9–12 чел', where:'CA + Вост.Европа + US', c:'#b8965a',
    f:['Самый быстрый выход на рынок','US-специалисты на AI/ML и безопасность','Минимальный риск — дублирование позиций','Полный секьюрити-аудит от US-компании','Готовность к инвесторам','3 мес поддержки включено'],
    whom:'Максимальная скорость, готовность к инвесторам.' },
  { id:'b', name:'Standard', badge:'Рекомендованный', price:'$450K — $700K', mo:'$48–65K/мес', time:'9–11 мес', team:'7–8 чел', where:'CA + Восточная Европа', c:'#4a9eff', rec:true,
    f:['Полноценный production, не MVP','Проверенная модель: US + Вост.Европа','AI-ассистент полный (чат+голос+фото)','Качество на уровне US-агентства','Мы контролируем каждую строчку кода','1 мес поддержки включено'],
    whom:'Лучший выбор для старта с собственными средствами.' },
  { id:'c', name:'Economy', badge:'Экономия бюджета', price:'$350K — $500K', mo:'$25–35K/мес', time:'12–16 мес', team:'5–6 чел', where:'CA + смешанный offshore', c:'#6b7280',
    f:['Самый низкий ежемесячный платеж','Полный функционал — тот же продукт','AI-ассистент базовый (чат)','На 3-7 мес дольше до запуска','Выше зависимость от каждого сотрудника','Поддержка после запуска — отдельно'],
    whom:'Ограниченный бюджет, готовность ждать дольше.' },
]

const cmp = [
  { l:'Бюджет', a:'$700K—$1.2M', b:'$450K—$700K', c:'$350K—$500K' },
  { l:'Ежемесячный платеж', a:'$85–130K', b:'$48–65K', c:'$25–35K' },
  { l:'Срок до production', a:'7–9 мес', b:'9–11 мес', c:'12–16 мес' },
  { l:'Команда', a:'9–12 чел', b:'7–8 чел', c:'5–6 чел' },
  { l:'AI-ассистент', a:'Полный', b:'Полный', c:'Базовый' },
  { l:'Секьюрити-аудит', a:'US-компания', b:'Внутренний', c:'Базовый' },
  { l:'Bus factor риск', a:'Низкий', b:'Средний', c:'Высокий' },
  { l:'Поддержка', a:'3 мес вкл.', b:'1 мес вкл.', c:'Отдельно' },
]

const prods = [
  { n:'Клиентское приложение', w:'Автовладелец', d:'Заказ, оплата, GPS, AI-чат', t:'iOS+Android' },
  { n:'Приложение шопа', w:'Техник', d:'Заявки, навигация, доходы', t:'iOS+Android' },
  { n:'Кабинет шопа', w:'Владелец сервиса', d:'Профиль, цены, аналитика', t:'Веб' },
  { n:'Admin-панель', w:'Команда Carreta', d:'KPI, модерация, финансы', t:'Веб' },
  { n:'Бэкенд / API', w:'Все продукты', d:'Логика, платежи, AI', t:'Сервер' },
  { n:'AI-ассистент', w:'Клиент', d:'Чат, голос, фото', t:'Встроен' },
]

export default function App() {
  const [tab, setTab] = useState('b')
  return (
    <div className="app">
      <header className="hero">
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1.2}} className="hero-in">
          <p className="hero-label">Коммерческое предложение</p>
          <h1 className="hero-title">CARRETA</h1>
          <p className="hero-sub">Auto Concierge Platform</p>
          <div className="hero-line"/>
          <p className="hero-desc">Разработка платформы-агрегатора автосервисов</p>
          <div className="hero-meta"><span>Castells Agency</span><span className="dt">·</span><span>Март 2026</span><span className="dt">·</span><span>Конфиденциально</span></div>
        </motion.div>
      </header>
      <main className="main">
        <S className="sec"><span className="sn">01</span><h2>Задача</h2>
          <p className="lead">Владелец автомобиля не знает, кому доверить машину, не понимает справедливую цену и не хочет тратить время. Автосервисы теряют клиентов без маркетинга.</p>
          <div className="hl"><strong>Carreta</strong> решает обе проблемы: клиент получает удобный сервис с прозрачными ценами, шопы — поток заказов. Платформа забирает комиссию, не владея ни одним шопом — как Uber для такси, только для автосервисов.</div>
        </S>
        <S className="sec"><span className="sn">02</span><h2>Что мы создаем</h2>
          <p className="lead">Полноценная IT-платформа из шести связанных продуктов:</p>
          <div className="pgrid">{prods.map((p,i)=><motion.div key={i} className="pcard" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.07}}>
            <span className="pn">{String(i+1).padStart(2,'0')}</span><h4>{p.n}</h4><p className="pw">{p.w}</p><p className="pd">{p.d}</p><span className="pt">{p.t}</span>
          </motion.div>)}</div>
        </S>
        <S className="sec"><span className="sn">03</span><h2>Как устроена разработка</h2>
          <p className="lead">Аналогия со строительством дома. Нельзя класть крышу до фундамента. Этапы одинаковые для всех вариантов — разница в скорости.</p>
          <div className="phl">{phases.map((ph,i)=><motion.div key={i} className="phr" initial={{opacity:0,x:-16}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*.05}}>
            <span className="phn">{ph.n}</span><div className="phb"><h4>{ph.t}</h4><p>{ph.d}</p></div><span className="pha">{ph.a}</span><span className="phw">{ph.w}</span>
          </motion.div>)}</div>
          <div className="callout">Каждый этап завершается конкретным результатом. Оплата привязана к результату, не к времени.</div>
        </S>
        <S className="sec"><span className="sn">04</span><h2>Три варианта реализации</h2>
          <p className="lead">Варианты отличаются <strong>не набором функций, а скоростью, качеством и уровнем риска.</strong> Функционал одинаковый.</p>
          <div className="ptabs">{plans.map(pl=><button key={pl.id} className={`ptab${tab===pl.id?' on':''}`} style={tab===pl.id?{borderColor:pl.c}:{}} onClick={()=>setTab(pl.id)}>{pl.name}</button>)}</div>
          <div className="plgrid">{plans.map(pl=><div key={pl.id} className={`plc${pl.rec?' rec':''}${tab===pl.id?' act':''}`}>
            {pl.rec&&<span className="recb">Рекомендованный</span>}
            <div className="plh" style={{borderLeftColor:pl.c}}><span className="plbadge" style={{color:pl.c}}>{pl.badge}</span><h3>{pl.name}</h3><p className="plprice">{pl.price}</p><p className="plmo">{pl.mo}</p></div>
            <div className="plmeta"><div><span className="ml">Срок</span><span>{pl.time}</span></div><div><span className="ml">Команда</span><span>{pl.team}</span></div><div><span className="ml">Где</span><span>{pl.where}</span></div></div>
            <ul className="plf">{pl.f.map((f,i)=><li key={i}>{f}</li>)}</ul>
            <p className="plfor"><em>{pl.whom}</em></p>
          </div>)}</div>
        </S>
        <S className="sec"><span className="sn">05</span><h2>Сравнительная таблица</h2>
          <div className="tw"><table className="ctbl"><thead><tr><th></th><th>Premium</th><th className="thr">Standard</th><th>Economy</th></tr></thead>
          <tbody>{cmp.map((r,i)=><tr key={i}><td className="tdl">{r.l}</td><td>{r.a}</td><td className="tdr">{r.b}</td><td>{r.c}</td></tr>)}</tbody></table></div>
        </S>
        <S className="sec"><span className="sn">06</span><h2>Контекст рынка</h2>
          <div className="cxgrid">
            <div className="cxc"><p className="cxp">$1.2 — 2.0M</p><p className="cxl">Агентство в Калифорнии или Нью-Йорке</p><p className="cxd">Senior в SF = $150–250/час. Плюс 30–50% наценки агентства.</p></div>
            <div className="cxc acc"><p className="cxp">$450 — 700K</p><p className="cxl">Наша стоимость (Standard)</p><p className="cxd">Экономия 60–70%. US-тимлиды за долю. Вост.Европа = US-качество при ставках в 3-4x ниже. Нет наценки.</p></div>
          </div>
        </S>
        <S className="sec"><span className="sn">07</span><h2>Как мы работаем</h2>
          <div className="hwgrid">
            <div className="hwc"><h4>Прозрачность</h4><p>Каждую неделю — отчет. Каждый месяц — демо. Вы видите, за что платите.</p></div>
            <div className="hwc"><h4>Оплата помесячно</h4><p>Не вся сумма вперед. Фиксированный ежемесячный платеж. Результат → оплата.</p></div>
            <div className="hwc"><h4>Мы — партнеры</h4><p>Мы заинтересованы в успехе Carreta. Не «запилим и уйдем» — развиваем вместе.</p></div>
            <div className="hwc"><h4>Защита IP</h4><p>Весь код принадлежит Carreta. NDA и IP assignment до начала работы.</p></div>
          </div>
        </S>
        <S className="sec scta"><span className="sn">08</span><h2>Следующий шаг</h2>
          <div className="stps">
            <div className="stp"><span className="stpn">1</span><p><strong>Выбрать вариант</strong> — A, B или C</p></div>
            <div className="stp"><span className="stpn">2</span><p><strong>Подписать соглашение</strong> и NDA</p></div>
            <div className="stp"><span className="stpn">3</span><p><strong>Первый платеж</strong> — старт в ту же неделю</p></div>
          </div>
          <p className="val">Предложение действительно 30 дней. Ставки растут на 5–10% в год.</p>
        </S>
      </main>
      <footer className="foot"><div className="foot-in"><p className="fb">Castells Agency</p><p className="fl">Roseville, CA · castells.media</p><p className="fc">Конфиденциально · Март 2026</p></div></footer>
    </div>
  )
}
