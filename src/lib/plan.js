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

export function parseISO(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDaysISO(iso, n) {
  const d = parseISO(iso)
  d.setDate(d.getDate() + n)
  return todayISO(d)
}

const WEEKDAYS = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba']
const MONTHS = [
  'yanvar',
  'fevral',
  'mart',
  'aprel',
  'may',
  'iyun',
  'iyul',
  'avgust',
  'sentabr',
  'oktabr',
  'noyabr',
  'dekabr',
]

export const weekdayName = (iso) => WEEKDAYS[parseISO(iso).getDay()]

/** '2026-11-14' → '14-noyabr' */
export function formatDateUz(iso) {
  const d = parseISO(iso)
  return `${d.getDate()}-${MONTHS[d.getMonth()]}`
}
