import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { doc, onSnapshot, setDoc, increment, serverTimestamp } from 'firebase/firestore'
import { db, firebaseEnabled } from '@/lib/firebase'
import { plan, taskKey, todayISO, TOTAL_TASKS } from '@/lib/plan'

const LOCAL_KEY = 'interview-prep:progress'

const empty = () => ({
  done: {}, // { d1_0: true }
  activity: {}, // { '2026-11-13': 3 }  — number of tasks ticked that day
  mistakes: [], // [{ id, date, said, correct, type }]
  qa: [], // [{ id, question, answer, example, followUp, status }]
  audioLog: [], // [{ id, date, day, topic, seconds, pauses, note, wpm }]
  dayNotes: {}, // { d1: 'text' }
  lastDay: null,
  qaStatus: {}, // knowledge-base questions: { 'closures-0': 'ok' | 'review' }
  problems: {}, // algorithm problems: { 'two-sum': 'solved' | 'unaided' }
  assessments: [], // [{ id, date, day, scores: { fe, be, db, devops, dsa, english } }]
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
    local(data.value)
    if (remote()) {
      setDoc(doc(db, 'users', uid), { ...patch, updatedAt: serverTimestamp() }, { merge: true }).catch(
        (e) => (syncError.value = e.message),
      )
    } else {
      writeLocal(data.value)
    }
  }

  // ---------- tasks ----------
  function isDone(day, i) {
    return Boolean(data.value.done[taskKey(day, i)])
  }

  function toggleTask(day, i) {
    const key = taskKey(day, i)
    const value = !data.value.done[key]
    const today = todayISO()
    const patch = { done: { [key]: value }, lastDay: day }
    if (value) patch.activity = { [today]: increment(1) }
    commit((d) => {
      d.done[key] = value
      d.lastDay = day
      if (value) d.activity[today] = (d.activity[today] || 0) + 1
    }, patch)
  }

  // status '' removes the mark (stored as null — merge can't delete keys)
  function setQaStatus(key, status) {
    const v = status || null
    commit((d) => (d.qaStatus[key] = v), { qaStatus: { [key]: v } })
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

  /** The first day that still has unfinished tasks — "where you are". */
  const currentDay = computed(() => {
    const next = plan.days.find((d) => !isDayComplete(d.number))
    return next ? next.number : plan.days.at(-1).number
  })

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
    setQaStatus,
    setProblem,
    setDayNote,
    dayProgress,
    isDayComplete,
    weekProgress,
    currentDay,
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
