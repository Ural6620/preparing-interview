<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { plan, getDay, getWeek, TOTAL_DAYS } from '@/lib/plan'
import { useProgressStore } from '@/stores/progress'
import SelfAssessment from '@/components/SelfAssessment.vue'

const progress = useProgressStore()

function dayState(n) {
  const p = progress.dayProgress(n)
  if (p.total && p.done === p.total) return 'done'
  if (p.done > 0) return 'partial'
  if (n === progress.currentDay) return 'current'
  return ''
}

// "Portfolio loyiha" checklist from the reference section: "- [ ] Name (Kun N)".
// An item counts as done when that day's technical task (index 2) is ticked.
const portfolio = computed(() => {
  const tracker = plan.reference.find((r) => /Progress tracker/i.test(r.title))
  if (!tracker) return []
  const part = tracker.md.split('#### Portfolio loyiha')[1]?.split('####')[0] || ''
  return [...part.matchAll(/- \[ \] (.+) \(Kun (\d+)\)/g)].map((m) => {
    const day = Number(m[2])
    return { name: m[1], day, done: progress.isDone(day, 2) }
  })
})

const monthWeeks = computed(() =>
  plan.months.map((m) => ({ ...m, weekObjs: m.weeks.map((n) => getWeek(n)) })),
)
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <p class="eyebrow">90 kunlik reja</p>
        <h1>Reja</h1>
      </div>
      <div class="overall">
        <span class="muted small">{{ progress.completedDays }}/{{ TOTAL_DAYS }} kun · {{ progress.percent }}%</span>
        <div class="bar"><span :style="{ width: progress.percent + '%' }" /></div>
      </div>
    </div>

    <div class="legend small muted">
      <span><i class="dot done" /> bajarildi</span>
      <span><i class="dot partial" /> boshlangan</span>
      <span><i class="dot current" /> hozirgi kun</span>
    </div>

    <section v-for="m in monthWeeks" :key="m.title" class="month">
      <h2>{{ m.title }}</h2>
      <div class="grid two">
        <article v-for="w in m.weekObjs" :key="w.number" class="card week">
          <div class="row">
            <span class="chip accent">{{ w.number }}-hafta</span>
            <span class="spacer" />
            <span class="small muted">{{ progress.weekProgress(w.number).pct }}%</span>
          </div>
          <h3>{{ w.title }}</h3>
          <p v-if="w.focus.length" class="small muted focus">
            <span v-for="f in w.focus" :key="f.label"><b>{{ f.label }}:</b> {{ f.value }}<br /></span>
          </p>
          <div class="bar"><span :style="{ width: progress.weekProgress(w.number).pct + '%' }" /></div>
          <div class="days">
            <RouterLink
              v-for="d in w.days"
              :key="d"
              :to="`/day/${d}`"
              class="d"
              :class="dayState(d)"
              :title="`Kun ${d} · ${getDay(d).weekday}`"
            >
              {{ d }}
            </RouterLink>
          </div>
        </article>
      </div>
    </section>

    <SelfAssessment />

    <section v-if="portfolio.length" class="card">
      <h2>Portfolio loyiha</h2>
      <p class="small muted">Tegishli kunning texnik vazifasi belgilanganda avtomatik ✓ bo'ladi.</p>
      <ul class="portfolio">
        <li v-for="p in portfolio" :key="p.day" :class="{ done: p.done }">
          <span class="tick">{{ p.done ? '✓' : '' }}</span>
          <span class="name">{{ p.name }}</span>
          <RouterLink :to="`/day/${p.day}`" class="small">Kun {{ p.day }}</RouterLink>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.overall {
  min-width: 180px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}
.legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 4px;
  display: inline-block;
  background: var(--surface-2);
}
.dot.done {
  background: var(--success);
}
.dot.partial {
  background: var(--success-soft);
  border: 1px solid var(--success);
}
.dot.current {
  border: 2px solid var(--accent);
}
.month {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}
.month h2 {
  margin: 0;
}
.week {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.week h3 {
  margin: 0;
}
.focus {
  margin: 0;
}
.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}
.d {
  display: grid;
  place-items: center;
  height: 38px;
  border-radius: 9px;
  background: var(--surface-2);
  color: var(--muted);
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
}
.d:hover {
  outline: 1px solid var(--border);
}
.d.done {
  background: var(--success);
  color: #fff;
}
.d.partial {
  background: var(--success-soft);
  color: var(--success);
}
.d.current {
  outline: 2px solid var(--accent);
  color: var(--accent);
}
.portfolio {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.portfolio li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  background: var(--surface-2);
}
.portfolio li.done {
  background: var(--success-soft);
}
.tick {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  display: grid;
  place-items: center;
  border: 2px solid var(--border);
  font-size: 0.8rem;
  font-weight: 800;
  color: #fff;
}
.done .tick {
  background: var(--success);
  border-color: var(--success);
}
.name {
  flex: 1;
}
</style>
