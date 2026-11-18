// The study schedule — built from the knowledge base, not written by hand.
//
// Every week cycles through 7 areas, one per day:
//   1 Frontend · 2 Backend (Java/Spring) · 3 Database · 4 Algorithms ·
//   5 DevOps · 6 Team, Git, code quality · 7 Architecture (system design)
// Inside each area the topics go from basic to advanced, one topic per day, so
// each new week is a step harder than the last. An area that runs out of new
// topics starts its next round (review + deeper practice) while the biggest
// area (backend) is still going. The plan lasts as many weeks as the biggest
// area needs — currently ~23 weeks (about 5.5 months).
//
// Each day: 1) learn the topic (Uzbek), 2) interview questions (EN + UZ),
// 3) hands-on practice, 4) speaking in English (behavioral + summary).
import { algorithms, getDomain } from './knowledge'

export const AREAS = [
  { key: 'frontend', title: 'Frontend', icon: '🎨', domains: ['frontend'] },
  {
    key: 'backend',
    title: 'Backend (Java, Spring)',
    icon: '⚙️',
    domains: ['backend', 'java', 'spring'],
  },
  { key: 'database', title: 'Database', icon: '🗄️', domains: ['database'] },
  { key: 'algorithms', title: 'Algoritmlar', icon: '🧩', domains: [] },
  { key: 'devops', title: 'DevOps', icon: '🐳', domains: ['devops'] },
  { key: 'engineering', title: 'Jamoa, Git, kod sifati', icon: '🤝', domains: ['engineering'] },
  { key: 'architecture', title: 'Arxitektura', icon: '🏗️', domains: ['system-design'] },
]

// Backend mixes three knowledge domains; this is the learning order
// (HTTP → Java basics → Spring basics → data → security → testing → advanced).
const BACKEND_ORDER = [
  'be-http-basics',
  'java-how-it-works',
  'be-http-methods-status',
  'java-oop',
  'be-rest-design',
  'java-collections',
  'spring-core-di',
  'spring-boot-basics',
  'spring-mvc-rest',
  'java-exceptions',
  'be-error-handling',
  'spring-validation-errors',
  'be-fullstack-flow',
  'java-modern-functional',
  'spring-data-jpa',
  'spring-transactions',
  'be-auth',
  'spring-security-jwt',
  'be-filters-interceptors',
  'java-testing',
  'spring-testing',
  'java-concurrency',
  'be-live-coding',
]

/** Algorithm problems per day at most. */
const PROBLEMS_PER_DAY = 3

const ROUNDS = ['Asos', 'Takrorlash va chuqurlashtirish', 'Mock va yakuniy takror']

// ---------- units: one unit = one day of one area ----------
function topicUnits(area) {
  const all = area.domains.flatMap((id) => {
    const d = getDomain(id)
    return d ? d.topics.map((t) => ({ ...t, domain: d })) : []
  })
  if (area.key === 'backend') {
    const rank = (t) => {
      const i = BACKEND_ORDER.indexOf(t.id)
      return i < 0 ? 999 : i
    }
    all.sort((a, b) => rank(a) - rank(b))
  }
  return all.map((topic) => ({
    kind: 'topic',
    topic,
    title: topic.title,
    // basic questions first, harder ones after
    questionKeys: topic.questions
      .map((q, i) => ({ i, middle: q.level === 'middle' }))
      .sort((a, b) => a.middle - b.middle || a.i - b.i)
      .map(({ i }) => `${topic.id}-${i}`),
  }))
}

function algorithmUnits() {
  const units = []
  for (const pattern of algorithms.patterns) {
    const problems = algorithms.problems
      .filter((p) => p.pattern === pattern.id)
      .sort((a, b) => (a.difficulty === 'Easy' ? 0 : 1) - (b.difficulty === 'Easy' ? 0 : 1))
    const parts = Math.max(1, Math.ceil(problems.length / PROBLEMS_PER_DAY))
    const size = Math.ceil(problems.length / parts)
    for (let p = 0; p < parts; p++) {
      units.push({
        kind: 'pattern',
        pattern,
        title: parts > 1 ? `${pattern.title} (${p + 1}/${parts})` : pattern.title,
        problems: problems.slice(p * size, (p + 1) * size),
        questionKeys: [],
      })
    }
  }
  return units
}

const unitsByArea = Object.fromEntries(
  AREAS.map((a) => [a.key, a.key === 'algorithms' ? algorithmUnits() : topicUnits(a)]),
)

export const TOTAL_WEEKS = Math.max(...AREAS.map((a) => unitsByArea[a.key].length))

// English practice threads that run through every day
const behavioral =
  getDomain('behavioral')?.topics.flatMap((t) =>
    t.questions.map((q, i) => ({ ...q, key: `${t.id}-${i}` })),
  ) || []
const grammar = getDomain('grammar')?.topics || []

// ---------- tasks ----------
const PRACTICE = {
  frontend: (t) =>
    `Vue loyihangizda **${t}** bo'yicha kichik misol yozing (komponent yoki funksiya) va kodni ovoz chiqarib tushuntiring`,
  backend: (t) =>
    `Spring Boot loyihangizda **${t}** ni qo'llang: kod yozing, ishga tushiring, nima qilganingizni 3 gapda yozing`,
  database: (t) => `PostgreSQL'da **${t}** bo'yicha 3–5 ta SQL yozib, natijasini tekshiring`,
  devops: (t) =>
    `Loyihangizda **${t}** ni sinab ko'ring (Docker / CI / config) va qadamlarini yozib qo'ying`,
  engineering: (t) =>
    `**${t}** bo'yicha o'z kodingiz yoki git tarixingizdan 1 ta real misol tayyorlang`,
  architecture: (t) =>
    `**${t}**: diagramma chizing (Excalidraw / qog'oz) va uni inglizcha 2 daqiqa tushuntiring`,
}

function tasksFor(area, unit, round, behavioralQ) {
  const r = round > 1
  const nQ = unit.questionKeys.length
  const tasks = []

  if (unit.kind === 'pattern') {
    const names = unit.problems.map((p) => p.title).join(', ')
    tasks.push({
      title: 'Mavzu',
      minutes: 30,
      text: r
        ? `Algoritm: **${unit.title}** pattern'ini qaytadan ko'ring — qachon ishlatilishini o'z so'zingiz bilan yozing`
        : `Algoritm: **${unit.title}** pattern'i — qachon ishlatiladi, shablon kod, murakkablik`,
    })
    tasks.push({
      title: 'Masalalar',
      minutes: 50,
      text: r
        ? `Qayta yeching (yechimga qaramasdan, 25 daqiqa vaqt bilan): ${names}`
        : `Yeching: ${names} — avval yondashuvni ayting, keyin kod, oxirida complexity`,
    })
    tasks.push({
      title: 'Amaliyot',
      minutes: 25,
      text: `Bitta masala yechimini inglizcha ovoz chiqarib tushuntiring: approach → code → time/space complexity → edge case'lar`,
    })
  } else {
    const t = unit.title
    tasks.push({
      title: 'Mavzu',
      minutes: 40,
      text: r
        ? `${area.title}: **${t}** — darsni qayta o'qing, asosiy fikrlarni o'zbekcha konspekt qiling (${round}-aylana)`
        : `${area.title}: **${t}** — darsni o'qing va o'zbekcha tushunib oling`,
    })
    tasks.push({
      title: 'Interview savollari',
      minutes: 40,
      text: r
        ? `${nQ} ta savol — endi namunaga qaramasdan inglizcha javob bering, qiyinlarini "Takrorlash" deb belgilang`
        : `${nQ} ta savol (inglizcha + o'zbekcha): avval o'zingiz ovoz chiqarib javob bering, keyin namuna bilan solishtiring`,
    })
    tasks.push({ title: 'Amaliyot', minutes: 25, text: PRACTICE[area.key](t) })
  }

  tasks.push({
    title: 'Inglizcha gapirish',
    minutes: 15,
    text: `Behavioral: "${behavioralQ?.q || 'Tell me about yourself'}" — javob bering, so'ng bugungi mavzuni 2 daqiqa inglizcha ovoz chiqarib tushuntiring va yozib oling`,
  })
  return tasks
}

// ---------- build ----------
function stageTitle(week) {
  const f = week / TOTAL_WEEKS
  if (f <= 0.2) return 'Asoslar'
  if (f <= 0.6) return "O'rta daraja"
  if (f <= 0.85) return 'Chuqurlashtirish'
  return 'Yakuniy bosqich'
}

/**
 * @param {{ weeks: { phrases: object[] }[] }} parsed parsed plan.md (phrase tables are reused weekly)
 */
export function buildCurriculum(parsed) {
  const phraseSets = parsed.weeks.filter((w) => w.phrases.length)
  const days = []
  const weeks = []
  const months = []
  const unitByDay = new Map()

  for (let w = 1; w <= TOTAL_WEEKS; w++) {
    const week = {
      number: w,
      title: stageTitle(w),
      month: '',
      focus: [],
      phrases: phraseSets.length ? phraseSets[(w - 1) % phraseSets.length].phrases : [],
      // number of the plan.md phrase table used this week (for /phrases?week=)
      phraseWeek: phraseSets.length ? phraseSets[(w - 1) % phraseSets.length].number : 0,
      questions: [],
      days: [],
      grammar: grammar.length ? grammar[(w - 1) % grammar.length] : null,
    }
    AREAS.forEach((area, i) => {
      const n = (w - 1) * 7 + i + 1
      const units = unitsByArea[area.key]
      const unit = units[(w - 1) % units.length]
      const round = Math.floor((w - 1) / units.length) + 1
      const behavioralQ = behavioral.length ? behavioral[(n - 1) % behavioral.length] : null
      const roundName = ROUNDS[Math.min(round, ROUNDS.length) - 1]
      unitByDay.set(n, { area, unit, round, roundName, behavioralQ })
      days.push({
        number: n,
        week: w,
        weekday: '',
        area: area.key,
        tasks: tasksFor(area, unit, round, behavioralQ),
      })
      week.days.push(n)
      week.focus.push({ label: `${area.icon} ${area.title}`, value: unit.title })
    })
    weeks.push(week)

    const m = Math.ceil(w / 4)
    if (!months[m - 1]) months[m - 1] = { title: `${m}-OY — ${stageTitle(w)}`, weeks: [] }
    months[m - 1].weeks.push(w)
    week.month = months[m - 1].title
  }

  return { days, weeks, months, unitByDay }
}

// ---------- lookups that used to come from `days` fields in the content ----------
let index = null
/** Called once by plan.js after the plan is built. */
export function setCurriculumIndex(unitByDay) {
  index = unitByDay
}

/** { area, unit, round, roundName, behavioralQ } for a plan day */
export const dayInfo = (day) => index?.get(day) || null

export function topicsForDay(day) {
  const u = dayInfo(day)?.unit
  return u?.kind === 'topic' ? [u.topic] : []
}

export function problemsForDay(day) {
  const u = dayInfo(day)?.unit
  return u?.kind === 'pattern' ? u.problems : []
}

/** First-round plan days on which a topic / problem is studied. */
export function daysForTopic(topicId) {
  const out = []
  for (const [d, info] of index || []) if (info.unit.topic?.id === topicId) out.push(d)
  return out
}

export function daysForProblem(problemId) {
  const out = []
  for (const [d, info] of index || [])
    if (info.unit.problems?.some((p) => p.id === problemId)) out.push(d)
  return out
}
