// Loads every knowledge file in src/content/knowledge/ (except algorithms.js, which has its own schema).
const modules = import.meta.glob('../content/knowledge/*.js', { eager: true, import: 'default' })

const ORDER = ['frontend', 'backend', 'database', 'devops', 'engineering', 'system-design', 'behavioral', 'grammar']

export const algorithms = Object.entries(modules).find(([p]) => p.endsWith('/algorithms.js'))?.[1] || {
  patterns: [],
  problems: [],
}

export const domains = Object.entries(modules)
  .filter(([p]) => !p.endsWith('/algorithms.js'))
  .map(([, m]) => m)
  .filter((m) => m?.id && Array.isArray(m.topics))
  .sort((a, b) => {
    const ia = ORDER.indexOf(a.id)
    const ib = ORDER.indexOf(b.id)
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib)
  })

// Flat lists with back-references for search, practice and day materials
export const topics = domains.flatMap((d) => d.topics.map((t) => ({ ...t, domain: d })))

export const questions = topics.flatMap((t) =>
  t.questions.map((q, i) => ({ ...q, key: `${t.id}-${i}`, topic: t, domain: t.domain })),
)

export function getDomain(id) {
  return domains.find((d) => d.id === id) || null
}

export function getTopic(domainId, topicId) {
  return getDomain(domainId)?.topics.find((t) => t.id === topicId) || null
}

export function topicsForDay(day) {
  return topics.filter((t) => t.days?.includes(day))
}

export function problemsForDay(day) {
  return algorithms.problems.filter((p) => p.days?.includes(day))
}

export function getPattern(id) {
  return algorithms.patterns.find((p) => p.id === id) || null
}

export const TOTAL_QUESTIONS = questions.length
