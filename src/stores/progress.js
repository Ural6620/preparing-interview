import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { doc, onSnapshot, setDoc, increment, serverTimestamp } from 'firebase/firestore'
import { db, firebaseEnabled } from '@/lib/firebase'
import {
  plan,
  taskKey,
  todayISO,
  addDaysISO,
  weekdayName,
  formatDateUz,
  TOTAL_TASKS,
} from '@/lib/plan'

const LOCAL_KEY = 'interview-prep:progress'

const empty = () => ({
  done: {}, // { d1_0: true }
  activity: {}, // { '2026-11-13': 3 }  — number of tasks ticked that day
  dayDates2: {}, // schedule v2 — { '1': { start: '2026-11-14', end: '2026-11-15' } } — when each plan day was started / finished
  mistakes: [], // [{ id, date, said, correct, type }]
  qa: [], // [{ id, question, answer, example, followUp, status }]
  audioLog: [], // [{ id, date, day, topic, seconds, pauses, note, wpm }]
  dayNotes: {}, // { d1: 'text' }
  lastDay: null,
  qaStatus: {}, // knowledge-base questions: { 'closures-0': 'ok' | 'review' }
  qaDate: {}, // when each question was last rated: { 'closures-0': '2026-11-15' }
  problems: {}, // algorithm problems: { 'two-sum': 'solved' | 'unaided' }
  assessments: [], // [{ id, date, day, scores: { fe, be, db, devops, dsa, english } }]
  aiUsage: {}, // { '2026-11-15': 4 } — free Gemini checks used per day
  aiChecks: {}, // { d1_2: { passed, score, feedback, todo, corrections, answer, date } } — last AI review
})

function readLocal() {
  try {
    return { ...empty(), ...JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}') }
  } catch {
    return empty()
  }
}

function writeLocal(data) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
  } catch {
    /* storage full or blocked — data stays in memory */
  }
}

export const useProgressStore = defineStore('progress', () => {
  const data = ref(empty())
  const loaded = ref(false)
  const syncError = ref('')
  let uid = null
  let unsubscribe = null

  const remote = () => firebaseEnabled && uid

  // Today's date as a reactive value, so an app left open past midnight moves on.
  const today = ref(todayISO())
  const tick = () => (today.value = todayISO())
  setInterval(tick, 60_000)
  if (typeof document !== 'undefined') document.addEventListener('visibilitychange', tick)

  /** Attach the store to a signed-in user (or local mode when Firebase is off). */
  function bind(user) {
    unsubscribe?.()
    unsubscribe = null
    syncError.value = ''

    if (!firebaseEnabled) {
      uid = null
      data.value = readLocal()
      loaded.value = true
      return
    }

    uid = user?.uid ?? null
    data.value = empty()
    loaded.value = false
    if (!uid) return

    const ref_ = doc(db, 'users', uid)
    unsubscribe = onSnapshot(
      ref_,
      (snap) => {
        data.value = { ...empty(), ...snap.data() }
        loaded.value = true
      },
      (e) => {
        syncError.value = e.message
        loaded.value = true
      },
    )
    // keep a small profile so the owner can see who uses the app
    setDoc(
      ref_,
      { profile: { name: user.name, email: user.email }, lastSeen: serverTimestamp() },
      { merge: true },
    ).catch((e) => (syncError.value = e.message))
  }

  /**
   * Apply a change locally right away, then persist it.
   * `local` mutates data.value; `patch` is the Firestore merge payload.
   */
  function commit(local, patch) {
    tick()
    local(data.value)
    if (remote()) {
      setDoc(
        doc(db, 'users', uid),
        { ...patch, updatedAt: serverTimestamp() },
        { merge: true },
      ).catch((e) => (syncError.value = e.message))
    } else {
      writeLocal(data.value)
    }
  }

  // ---------- tasks ----------
  function isDone(day, i) {
    return Boolean(data.value.done[taskKey(day, i)])
  }

  /** A day can be worked on only once every earlier day is finished. */
  const isLocked = (day) => day > currentDay.value

  /**
   * Set a task's done state, keeping the day's start/finish dates in step.
   * Returns false (and changes nothing) for a locked future day.
   */
  function setTaskDone(day, i, value, extraLocal = () => {}, extraPatch = {}) {
    if (value && isLocked(day)) return false
    tick()
    const key = taskKey(day, i)
    const date = today.value
    const changed = Boolean(data.value.done[key]) !== value
    const dayTasks = plan.days.find((d) => d.number === day)?.tasks || []
    const willBeComplete = dayTasks.every((_, j) => (j === i ? value : isDone(day, j)))
    const prev = data.value.dayDates2?.[day] || {}
    const dates = { start: prev.start || date, end: willBeComplete ? prev.end || date : null }

    const patch = {
      ...extraPatch,
      done: { [key]: value },
      lastDay: day,
      dayDates2: { [day]: dates },
    }
    if (value && changed) patch.activity = { [date]: increment(1) }
    commit((d) => {
      extraLocal(d)
      d.done[key] = value
      d.lastDay = day
      d.dayDates2 = { ...d.dayDates2, [day]: dates }
      if (value && changed) d.activity[date] = (d.activity[date] || 0) + 1
    }, patch)
    return true
  }

  function toggleTask(day, i) {
    return setTaskDone(day, i, !isDone(day, i))
  }

  /** Save an AI review of a task; a pass also ticks the task. */
  function saveAiCheck(day, i, result) {
    const key = taskKey(day, i)
    const entry = { ...result, date: todayISO() }
    const local = (d) => (d.aiChecks = { ...d.aiChecks, [key]: entry })
    if (result.passed) return setTaskDone(day, i, true, local, { aiChecks: { [key]: entry } })
    commit(local, { aiChecks: { [key]: entry } })
    return true
  }

  /** True if the question was rated (Bilaman / Takrorlash) today. */
  const ratedToday = (key) =>
    data.value.qaDate?.[key] === today.value && Boolean(data.value.qaStatus[key])

  const aiUsedToday = computed(() => data.value.aiUsage?.[today.value] || 0)

  function noteAiUse() {
    tick()
    const date = today.value
    commit((d) => (d.aiUsage = { ...d.aiUsage, [date]: (d.aiUsage?.[date] || 0) + 1 }), {
      aiUsage: { [date]: increment(1) },
    })
  }

  const aiCheckOf = (day, i) => data.value.aiChecks?.[taskKey(day, i)] || null

  // status '' removes the mark (stored as null — merge can't delete keys)
  function setQaStatus(key, status) {
    const v = status || null
    tick()
    const date = today.value
    commit(
      (d) => {
        d.qaStatus[key] = v
        d.qaDate = { ...d.qaDate, [key]: date }
      },
      { qaStatus: { [key]: v }, qaDate: { [key]: date } },
    )
  }

  function setProblem(id, status) {
    const v = status || null
    commit((d) => (d.problems[id] = v), { problems: { [id]: v } })
  }

  function setDayNote(day, text) {
    commit((d) => (d.dayNotes[`d${day}`] = text), { dayNotes: { [`d${day}`]: text } })
  }

  function dayProgress(dayNumber) {
    const day = plan.days.find((d) => d.number === dayNumber)
    if (!day) return { done: 0, total: 0 }
    const done = day.tasks.filter((_, i) => isDone(dayNumber, i)).length
    return { done, total: day.tasks.length }
  }

  function isDayComplete(n) {
    const p = dayProgress(n)
    return p.total > 0 && p.done === p.total
  }

  function weekProgress(weekNumber) {
    const days = plan.days.filter((d) => d.week === weekNumber)
    let done = 0
    let total = 0
    for (const d of days) {
      const p = dayProgress(d.number)
      done += p.done
      total += p.total
    }
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 }
  }

  /**
   * "Where you are": the first day that still has unfinished tasks. The plan
   * never moves on while a day is unfinished, and never leaves a day behind.
   */
  const currentDay = computed(() => {
    const next = plan.days.find((d) => !isDayComplete(d.number))
    return next ? next.number : plan.days.at(-1).number
  })

  /** Tasks of a day that are still not done: [{ index, title }] */
  function leftoverTasks(n) {
    const day = plan.days.find((d) => d.number === n)
    if (!day) return []
    return day.tasks
      .map((t, index) => ({ index, title: t.title }))
      .filter((t) => !isDone(n, t.index))
  }

  const dayDatesOf = (n) => data.value.dayDates2?.[n] || {}

  /**
   * True when the current day was started on an earlier date and still isn't
   * finished — i.e. it was left over from a previous session.
   */
  const carriedOver = computed(() => {
    const start = dayDatesOf(currentDay.value).start
    return Boolean(start && start < today.value && !isDayComplete(currentDay.value))
  })

  /**
   * Real date for a plan day: the date it was finished, today for the
   * current day, or projected forward from today for days not reached yet.
   */
  function dateOfDay(n) {
    if (n === currentDay.value)
      return isDayComplete(n) ? dayDatesOf(n).end || today.value : today.value
    if (n < currentDay.value) return dayDatesOf(n).end || null
    return addDaysISO(today.value, n - currentDay.value)
  }

  /** 'Shanba, 14-noyabr' for a plan day ('' when the date isn't known). */
  function dayLabel(n) {
    const iso = dateOfDay(n)
    return iso ? `${weekdayName(iso)}, ${formatDateUz(iso)}` : ''
  }

  const totalDone = computed(() => Object.values(data.value.done).filter(Boolean).length)
  const percent = computed(() => Math.round((totalDone.value / TOTAL_TASKS) * 100))
  const completedDays = computed(() => plan.days.filter((d) => isDayComplete(d.number)).length)

  const streak = computed(() => {
    const act = data.value.activity
    const d = new Date()
    if (!act[todayISO(d)]) d.setDate(d.getDate() - 1) // today not started yet doesn't break the streak
    let n = 0
    while (act[todayISO(d)]) {
      n++
      d.setDate(d.getDate() - 1)
    }
    return n
  })

  // ---------- lists (mistakes, Q&A, audio journal) ----------
  const uidGen = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6)

  function saveList(name, list) {
    commit((d) => (d[name] = list), { [name]: list })
  }

  function addItem(name, item) {
    saveList(name, [{ id: uidGen(), createdAt: todayISO(), ...item }, ...data.value[name]])
  }

  function updateItem(name, id, changes) {
    saveList(
      name,
      data.value[name].map((x) => (x.id === id ? { ...x, ...changes } : x)),
    )
  }

  function removeItem(name, id) {
    saveList(
      name,
      data.value[name].filter((x) => x.id !== id),
    )
  }

  function resetAll() {
    data.value = empty()
    if (remote()) {
      // full overwrite (merge would keep old map keys)
      setDoc(doc(db, 'users', uid), { ...empty(), updatedAt: serverTimestamp() }).catch(
        (e) => (syncError.value = e.message),
      )
    } else {
      writeLocal(data.value)
    }
  }

  return {
    data,
    loaded,
    syncError,
    bind,
    isDone,
    toggleTask,
    isLocked,
    leftoverTasks,
    carriedOver,
    dayDatesOf,
    saveAiCheck,
    aiUsedToday,
    ratedToday,
    noteAiUse,
    aiCheckOf,
    setQaStatus,
    setProblem,
    setDayNote,
    dayProgress,
    isDayComplete,
    weekProgress,
    currentDay,
    dateOfDay,
    dayLabel,
    totalDone,
    percent,
    completedDays,
    streak,
    addItem,
    updateItem,
    removeItem,
    resetAll,
  }
})
