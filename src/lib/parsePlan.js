// Parses src/content/plan.md into structured data.
// Structure contract (see "Sayt uchun tuzilish" in the plan):
//   # N-OY — ...            → month
//   ## N-hafta — ...        → week (focus line, phrase table, question table)
//   <!-- day:N week:W -->   → day marker, followed by "### Kun N · Weekday"
//   - [ ] **Title** (35 daq) — description   → task
//   # Ma'lumotnoma          → reference sections (## headings)

const DAY_MARKER = /^<!--\s*day:(\d+)\s+week:(\d+)\s*-->/
const TASK = /^- \[[ xX]\] \*\*(.+?)\*\*(?: \((\d+) daq\))?\s*—\s*(.*)$/
const TABLE_ROW = /^\|(.+)\|\s*$/

function splitRow(line) {
  return line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((c) => c.trim())
}

function readTable(lines, start) {
  // returns { rows, end } where rows excludes header + separator
  const rows = []
  let i = start
  while (i < lines.length && TABLE_ROW.test(lines[i])) {
    rows.push(splitRow(lines[i]))
    i++
  }
  return { rows: rows.slice(2), header: rows[0] || [], end: i }
}

export function parsePlan(md) {
  const body = md.replace(/^---[\s\S]*?\n---\n/, '')
  const lines = body.split(/\r?\n/)

  const months = []
  const weeks = []
  const days = []
  const intro = { schedule: [] }
  let referenceStart = -1

  let month = null
  let week = null
  let day = null
  let pendingTable = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith('# Ma\'lumotnoma')) {
      referenceStart = i + 1
      break
    }

    if (line.startsWith('# ') && !line.startsWith('# Full-stack')) {
      month = { title: line.slice(2).trim(), weeks: [] }
      months.push(month)
      week = null
      day = null
      continue
    }

    const weekMatch = line.match(/^## (\d+)-hafta — (.+)$/)
    if (weekMatch) {
      week = {
        number: Number(weekMatch[1]),
        title: weekMatch[2].trim(),
        month: month?.title ?? '',
        focus: [],
        phrases: [],
        questions: [],
        days: [],
      }
      weeks.push(week)
      month?.weeks.push(week.number)
      day = null
      continue
    }

    if (line.startsWith('## Kunlik 2 soat')) {
      pendingTable = 'schedule'
      continue
    }

    if (week && !day && /^\*\*.+:\*\*/.test(line)) {
      // "**English:** a, b · **Texnik:** c"
      week.focus = line.split(' · ').map((part) => {
        const m = part.match(/^\*\*(.+?):\*\*\s*(.*)$/)
        return m ? { label: m[1], value: m[2] } : { label: '', value: part }
      })
      continue
    }

    if (line.startsWith('#### Haftaning iboralari')) {
      pendingTable = 'phrases'
      continue
    }
    if (line.startsWith('#### Tayyorlanadigan savollar')) {
      pendingTable = 'questions'
      continue
    }

    if (pendingTable && TABLE_ROW.test(line)) {
      const { rows, end } = readTable(lines, i)
      if (pendingTable === 'schedule') {
        intro.schedule = rows.map(([time, task]) => ({ time, task }))
      } else if (pendingTable === 'phrases' && week) {
        week.phrases = rows.map(([en, uz]) => ({ en, uz, week: week.number }))
      } else if (pendingTable === 'questions' && week) {
        week.questions = rows.map(([q, source]) => ({ q, source }))
      }
      pendingTable = null
      i = end - 1
      continue
    }

    const dm = line.match(DAY_MARKER)
    if (dm) {
      day = {
        number: Number(dm[1]),
        week: Number(dm[2]),
        weekday: '',
        tasks: [],
      }
      days.push(day)
      weeks.find((w) => w.number === day.week)?.days.push(day.number)
      continue
    }

    if (day && /^### Kun \d+/.test(line)) {
      day.weekday = (line.split('·')[1] || '').trim()
      continue
    }

    const tm = day && line.match(TASK)
    if (tm) {
      day.tasks.push({
        title: tm[1].trim(),
        minutes: tm[2] ? Number(tm[2]) : null,
        text: tm[3].trim(),
      })
    }
  }

  // Reference: split by "## " headings
  const reference = []
  if (referenceStart > -1) {
    let current = null
    for (const line of lines.slice(referenceStart)) {
      const h = line.match(/^## (.+)$/)
      if (h) {
        current = { title: h[1].trim(), md: '' }
        reference.push(current)
      } else if (current && line.trim() !== '---') {
        current.md += line + '\n'
      }
    }
  }

  // Pronunciation table → structured data
  const pronunciation = []
  const pron = reference.find((r) => /talaffuz/i.test(r.title))
  if (pron) {
    for (const line of pron.md.split('\n')) {
      if (!TABLE_ROW.test(line)) continue
      const [word, how, mistake] = splitRow(line)
      if (!word || word === "So'z" || /^-+$/.test(word)) continue
      pronunciation.push({ word, how, mistake })
    }
  }

  const phrases = weeks.flatMap((w) => w.phrases)
  const questions = weeks.flatMap((w) => w.questions)

  return { intro, months, weeks, days, reference, pronunciation, phrases, questions }
}

export function taskKey(dayNumber, index) {
  return `d${dayNumber}_${index}`
}
