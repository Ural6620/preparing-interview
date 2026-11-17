<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import {
  plan,
  getDay,
  getWeek,
  phrasesForWeek,
  weekdayName,
  formatDateUz,
  TOTAL_DAYS,
} from '@/lib/plan'
import { useAuthStore } from '@/stores/auth'
import { useProgressStore } from '@/stores/progress'
import TaskList from '@/components/TaskList.vue'
import DayMaterials from '@/components/DayMaterials.vue'
import DailyDrill from '@/components/DailyDrill.vue'
import SpeakButton from '@/components/SpeakButton.vue'
import AppIcon from '@/components/AppIcon.vue'

const auth = useAuthStore()
const progress = useProgressStore()

const firstName = computed(() => auth.user?.name?.split(' ')[0] || '')
const dayNum = computed(() => progress.currentDay)
const day = computed(() => getDay(dayNum.value))
const week = computed(() => getWeek(day.value.week))
const dp = computed(() => progress.dayProgress(dayNum.value))
const allDone = computed(() => progress.completedDays === TOTAL_DAYS)
const phrases = computed(() => phrasesForWeek(day.value.week).slice(0, 4))

const weekDays = computed(() =>
  week.value.days.map((n) => {
    const p = progress.dayProgress(n)
    return {
      n,
      weekday: progress.dateOfDay(n) ? weekdayName(progress.dateOfDay(n)).slice(0, 2) : '',
      state:
        p.done === p.total ? 'done' : p.done > 0 ? 'partial' : n === dayNum.value ? 'current' : '',
    }
  }),
)

const leftover = computed(() => progress.leftoverTasks(dayNum.value))
const startedOn = computed(() => progress.dayDatesOf(dayNum.value).start)
// the day before the current one, if it was finished today
const finishedToday = computed(() => {
  const prev = dayNum.value - 1
  return prev >= 1 && progress.dayDatesOf(prev).end === progress.dateOfDay(dayNum.value) ? prev : 0
})

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Xayrli tong'
  if (h < 18) return 'Xayrli kun'
  return 'Xayrli kech'
})
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <p class="eyebrow">{{ greeting }}{{ firstName ? `, ${firstName}` : '' }} 👋</p>
        <h1 v-if="!allDone">
          Kun {{ dayNum }} <span class="muted">/ {{ TOTAL_DAYS }}</span>
        </h1>
        <h1 v-else>90 kun tugadi! 🎉</h1>
      </div>
      <RouterLink :to="`/day/${dayNum}`" class="btn">
        Kunni to'liq ochish <AppIcon name="chevronRight" :size="16" />
      </RouterLink>
    </div>

    <div class="stats">
      <div class="stat card">
        <span class="label">Umumiy progress</span>
        <strong>{{ progress.percent }}%</strong>
        <div class="bar"><span :style="{ width: progress.percent + '%' }" /></div>
      </div>
      <div class="stat card">
        <span class="label">Tugagan kunlar</span>
        <strong
          >{{ progress.completedDays }}<small>/{{ TOTAL_DAYS }}</small></strong
        >
      </div>
      <div class="stat card">
        <span class="label">Ketma-ket kunlar</span>
        <strong class="streak"><AppIcon name="flame" :size="22" /> {{ progress.streak }}</strong>
      </div>
      <div class="stat card">
        <span class="label">Bajarilgan vazifalar</span>
        <strong>{{ progress.totalDone }}</strong>
      </div>
    </div>

    <div v-if="!allDone && progress.carriedOver" class="card notice warn">
      <strong>⏳ Kun {{ dayNum }} hali tugamagan</strong>
      <p class="small">
        {{ formatDateUz(startedOn) }}, {{ weekdayName(startedOn).toLowerCase() }} kuni boshlangan.
        Keyingi kunga o'tishdan oldin qolgan {{ leftover.length }} ta vazifani bajaring:
      </p>
      <ul>
        <li v-for="t in leftover" :key="t.index">{{ t.title }}</li>
      </ul>
    </div>
    <div v-else-if="!allDone && finishedToday && dp.done === 0" class="card notice ok">
      <strong>✅ Kun {{ finishedToday }} bugun tugadi!</strong>
      <p class="small">
        Dam olishingiz mumkin yoki xohlasangiz Kun {{ dayNum }} ni hozir boshlang.
      </p>
    </div>

    <section class="card today">
      <div class="today-head">
        <div>
          <p class="eyebrow">{{ week.number }}-hafta · {{ progress.dayLabel(dayNum) }}</p>
          <h2>{{ week.title }}</h2>
          <div v-if="week.focus.length" class="row focus">
            <span v-for="f in week.focus" :key="f.label" class="chip">
              <b v-if="f.label">{{ f.label }}:</b> {{ f.value }}
            </span>
          </div>
        </div>
        <div class="ring" :style="{ '--p': dp.total ? (dp.done / dp.total) * 100 : 0 }">
          <span>{{ dp.done }}/{{ dp.total }}</span>
        </div>
      </div>

      <div class="week-strip">
        <RouterLink
          v-for="d in weekDays"
          :key="d.n"
          :to="`/day/${d.n}`"
          class="wd"
          :class="d.state"
        >
          <small>{{ d.weekday }}</small>
          <span>{{ d.n }}</span>
        </RouterLink>
      </div>

      <p v-if="leftover.length && dp.done > 0" class="small muted left">
        Qoldi: <b>{{ leftover.map((t) => t.title).join(', ') }}</b>
      </p>

      <TaskList :day="dayNum" />
    </section>

    <DailyDrill :day="dayNum" />

    <DayMaterials :day="dayNum" compact />

    <div class="grid two">
      <section class="card">
        <div class="row">
          <h3>Haftaning iboralari</h3>
          <span class="spacer" />
          <RouterLink :to="{ path: '/phrases', query: { week: week.number } }" class="small"
            >Hammasi →</RouterLink
          >
        </div>
        <ul class="phrases">
          <li v-for="p in phrases" :key="p.en">
            <SpeakButton :text="p.en" />
            <div>
              <div>{{ p.en }}</div>
              <small class="muted">{{ p.uz }}</small>
            </div>
          </li>
        </ul>
      </section>

      <section class="card">
        <h3>Kunlik 2 soat</h3>
        <ul class="schedule">
          <li v-for="s in plan.intro.schedule" :key="s.time">
            <span class="chip accent">{{ s.time }}</span>
            <span class="small">{{ s.task }}</span>
          </li>
        </ul>
        <RouterLink
          :to="{ path: '/speak', query: { day: dayNum, task: 3 } }"
          class="btn primary full"
        >
          <AppIcon name="mic" :size="18" /> Inglizcha xulosani yozib olish
        </RouterLink>
      </section>
    </div>
  </div>
</template>

<style scoped>
.notice {
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-left: 4px solid var(--accent);
}
.notice.warn {
  border-left-color: var(--warn);
}
.notice.ok {
  border-left-color: var(--success);
}
.notice p,
.notice ul {
  margin: 0;
}
.notice ul {
  padding-left: 20px;
}
.left {
  margin: -6px 0 0;
}
.stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
@media (min-width: 720px) {
  .stats {
    grid-template-columns: repeat(4, 1fr);
  }
}
.stat {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
}
.stat .label {
  font-size: 0.78rem;
  color: var(--muted);
  font-weight: 600;
}
.stat strong {
  font-size: 1.6rem;
  line-height: 1.1;
}
.stat strong small {
  font-size: 0.9rem;
  color: var(--faint);
}
.streak {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--warn);
}

.today {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.today-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.today-head h2 {
  margin-bottom: 8px;
}
.focus {
  gap: 6px;
}
.focus .chip {
  display: inline-block;
  white-space: normal;
}
.ring {
  --p: 0;
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: conic-gradient(var(--success) calc(var(--p) * 1%), var(--surface-2) 0);
}
.ring span {
  display: grid;
  place-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--surface);
  font-weight: 700;
  font-size: 0.9rem;
}

.week-strip {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}
.wd {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 0;
  border-radius: 10px;
  background: var(--surface-2);
  color: var(--muted);
  text-decoration: none;
  font-weight: 700;
  line-height: 1.2;
}
.wd small {
  font-size: 0.68rem;
  font-weight: 600;
}
.wd.done {
  background: var(--success);
  color: #fff;
}
.wd.partial {
  background: var(--success-soft);
  color: var(--success);
}
.wd.current {
  outline: 2px solid var(--accent);
  color: var(--accent);
}

.phrases,
.schedule {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.phrases li {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}
.schedule li {
  display: flex;
  gap: 10px;
  align-items: baseline;
}
.schedule {
  margin-bottom: 16px;
}
.full {
  width: 100%;
}
</style>
