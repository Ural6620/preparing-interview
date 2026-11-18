// Daily memorisation: today's questions (the day's topic + one behavioral +
// one grammar drill), today's chunk phrases, and spaced review of earlier ones.
import { plan, getWeek } from './plan'
import { questions } from './knowledge'
import { dayInfo } from './curriculum'

/** Days after first learning when a question / phrase comes back. */
export const REVIEW_AFTER = [1, 3, 7, 21]
/** Items already marked "Bilaman" skip the early reviews. */
const OK_REVIEW_FROM = 7
/** Reviews shown per day at most (hard ones first). */
export const MAX_REVIEW = 12

const byKey = new Map(questions.map((q) => [q.key, q]))

function buildDay(day) {
  const info = dayInfo(day)
  if (!info) return []
  const out = info.unit.questionKeys.map((k) => byKey.get(k)).filter(Boolean)
  if (info.behavioralQ) {
    const q = byKey.get(info.behavioralQ.key)
    if (q) out.push(q)
  }
  const week = getWeek(plan.days.find((d) => d.number === day)?.week)
  const g = week?.grammar
  if (g) {
    const i = week.days.indexOf(day)
    const q = byKey.get(`${g.id}-${i}`)
    if (q) out.push(q)
  }
  return out
}

const questionsByDay = new Map(plan.days.map((d) => [d.number, buildDay(d.number)]))

// first day each question is learned (later rounds bring it back as "today's")
const firstDay = new Map()
for (const [d, qs] of questionsByDay)
  for (const q of qs) if (!firstDay.has(q.key)) firstDay.set(q.key, d)

// each week's phrase table spread over its 7 days
const phrasesByDay = new Map()
for (const w of plan.weeks) {
  w.phrases.forEach((p, i) => {
    const d = w.days[Math.floor((i * w.days.length) / w.phrases.length)]
    if (!phrasesByDay.has(d)) phrasesByDay.set(d, [])
    phrasesByDay.get(d).push(p)
  })
}

export const newQuestionsForDay = (day) => questionsByDay.get(day) || []
export const newPhrasesForDay = (day) => phrasesByDay.get(day) || []

export function reviewPhrasesForDay(day) {
  return REVIEW_AFTER.flatMap((k) => phrasesByDay.get(day - k) || [])
}

/**
 * Questions to review on `day`.
 * @param {Record<string,string>} status qaStatus map ('ok' | 'review')
 */
export function reviewQuestionsForDay(day, status = {}) {
  const today = new Set(newQuestionsForDay(day).map((q) => q.key))
  const due = new Map()
  for (const k of REVIEW_AFTER)
    for (const q of questionsByDay.get(day - k) || []) {
      if (firstDay.get(q.key) !== day - k) continue // only from its first learning
      if (status[q.key] === 'ok' && k < OK_REVIEW_FROM) continue
      due.set(q.key, q)
    }
  // anything marked "Takrorlash" keeps coming back until it is known
  for (const [key, d] of firstDay)
    if (d < day && status[key] === 'review') due.set(key, byKey.get(key))

  const rank = (q) => (status[q.key] === 'review' ? 0 : status[q.key] === 'ok' ? 2 : 1)
  return [...due.values()]
    .filter((q) => !today.has(q.key))
    .sort((a, b) => rank(a) - rank(b) || firstDay.get(a.key) - firstDay.get(b.key))
    .slice(0, MAX_REVIEW)
}
