import raw from '@/content/plan.md?raw'
import { parsePlan, taskKey } from './parsePlan'

export const plan = parsePlan(raw)
export { taskKey }

export const TOTAL_DAYS = plan.days.length
export const TOTAL_TASKS = plan.days.reduce((n, d) => n + d.tasks.length, 0)

export function getDay(n) {
  return plan.days.find((d) => d.number === Number(n)) || null
}

export function getWeek(n) {
  return plan.weeks.find((w) => w.number === Number(n)) || null
}

// Phrases to practise on a given day: the week's own table, or for weeks
// without one (mock interview / final days) all phrases from the plan.
export function phrasesForWeek(weekNumber) {
  const w = getWeek(weekNumber)
  return w && w.phrases.length ? w.phrases : plan.phrases
}

export function todayISO(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
