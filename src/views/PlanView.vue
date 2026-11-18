<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { plan, getWeek, TOTAL_DAYS } from '@/lib/plan'
import { useProgressStore } from '@/stores/progress'
import SelfAssessment from '@/components/SelfAssessment.vue'

const progress = useProgressStore()

function dayState(n) {
  const p = progress.dayProgress(n)
  if (p.total && p.done === p.total) return 'done'
  if (p.done > 0) return 'partial'
  if (progress.isLocked(n)) return 'locked'
  if (n === progress.currentDay) return 'current'
  return ''
}

const monthWeeks = computed(() =>
  plan.months.map((m) => ({ ...m, weekObjs: m.weeks.map((n) => getWeek(n)) })),
)
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <p class="eyebrow">{{ TOTAL_DAYS }} kunlik reja · har hafta 7 soha</p>
        <h1>Reja</h1>
      </div>
      <div class="overall">
        <span class="muted small"
          >{{ progress.completedDays }}/{{ TOTAL_DAYS }} kun · {{ progress.percent }}%</span
        >
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
            <span v-for="f in w.focus" :key="f.label"
              ><b>{{ f.label }}:</b> {{ f.value }}<br
            /></span>
          </p>
          <div class="bar">
            <span :style="{ width: progress.weekProgress(w.number).pct + '%' }" />
          </div>
          <div class="days">
            <RouterLink
              v-for="d in w.days"
              :key="d"
              :to="`/day/${d}`"
              class="d"
              :class="dayState(d)"
              :title="`Kun ${d} · ${progress.dayLabel(d)}`"
            >
              {{ d }}
            </RouterLink>
          </div>
        </article>
      </div>
    </section>

    <SelfAssessment />
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
.d.locked {
  opacity: 0.5;
}
.d.current {
  outline: 2px solid var(--accent);
  color: var(--accent);
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
