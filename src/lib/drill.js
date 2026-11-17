// Daily memorisation plan: which interview questions and chunk phrases are NEW
// on each plan day, and which come back for spaced review.
//
// Questions: each topic's questions are spread over the topic's first block of
// plan days (e.g. 7 self-intro questions over week 1 → about one a day). A
// daily cap keeps the load learnable; overflow moves to the next days.
// Phrases: each week's chunk table is spread over that week's 7 days.
import { plan } from './plan'
import { topics } from './knowledge'

/** New questions per day at most. 7 gets all ~550 questions done by day 90. */
export const NEW_PER_DAY = 7
/** Days after first learning when an item comes back. */
export const REVIEW_AFTER = [1, 3, 7, 21]
/** Items already marked "Bilaman" skip the early reviews. */
const OK_REVIEW_FROM = 7
/** Reviews shown per day at most (hard ones first). */
export const MAX_REVIEW = 20

const LAST_DAY = plan.days.length

// ---------- questions → day ----------
const questionDay = new Map() // key → plan day it is first learned
const questionsByDay = new Map() // day → [question]

{
  const items = []
  for (const t of topics) {
    const days = [...(t.days || [])].sort((a, b) => a - b)
    if (!days.length) continue
    const block = days.filter((d) => d <= days[0] + 20) // later days in t.days are revisits
    t.questions.forEach((q, i) => {
      items.push({
        ...q,
        key: `${t.id}-${i}`,
        topic: t,
        domain: t.domain,
        index: i,
        earliest: block[Math.floor((i * block.length) / t.questions.length)],
      })
    })
  }
  // stable order: by earliest day, then position inside the topic (topics stay interleaved)
  items.sort((a, b) => a.earliest - b.earliest || a.index - b.index)

  let next = 0
  for (let d = 1; d <= LAST_DAY; d++) {
    const today = []
    while (today.length < NEW_PER_DAY && next < items.length && items[next].earliest <= d) {
      today.push(items[next])
      questionDay.set(items[next].key, d)
      next++
    }
    // the last day takes whatever is left so nothing is lost
    if (d === LAST_DAY) while (next < items.length) today.push(items[next++])
    questionsByDay.set(d, today)
  }
}

// ---------- phrases → day ----------
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
export const learnedOnDay = (key) => questionDay.get(key) ?? null

export function reviewPhrasesForDay(day) {
  return REVIEW_AFTER.flatMap((k) => phrasesByDay.get(day - k) || [])
}

/**
 * Questions to review on `day`.
 * @param {Record<string,string>} status qaStatus map ('ok' | 'review')
 */
export function reviewQuestionsForDay(day, status = {}) {
  const due = new Map()
  for (const k of REVIEW_AFTER) {
    for (const q of questionsByDay.get(day - k) || []) {
      if (status[q.key] === 'ok' && k < OK_REVIEW_FROM) continue
      due.set(q.key, q)
    }
  }
  // anything marked "Takrorlash" earlier keeps coming back until it is known
  for (let d = 1; d < day; d++)
    for (const q of questionsByDay.get(d) || []) if (status[q.key] === 'review') due.set(q.key, q)

  const rank = (q) => (status[q.key] === 'review' ? 0 : status[q.key] === 'ok' ? 2 : 1)
  return [...due.values()]
    .sort((a, b) => rank(a) - rank(b) || questionDay.get(a.key) - questionDay.get(b.key))
    .slice(0, MAX_REVIEW)
}
