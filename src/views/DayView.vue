<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getDay, getWeek, phrasesForWeek, TOTAL_DAYS } from '@/lib/plan'
import { useProgressStore } from '@/stores/progress'
import TaskList from '@/components/TaskList.vue'
import DayMaterials from '@/components/DayMaterials.vue'
import SpeakButton from '@/components/SpeakButton.vue'
import AppIcon from '@/components/AppIcon.vue'

const route = useRoute()
const progress = useProgressStore()

const n = computed(() => Math.min(Math.max(Number(route.params.n) || 1, 1), TOTAL_DAYS))
const day = computed(() => getDay(n.value))
const week = computed(() => getWeek(day.value.week))
const dp = computed(() => progress.dayProgress(n.value))
const phrases = computed(() => phrasesForWeek(day.value.week))
const ownPhrases = computed(() => week.value.phrases.length > 0)

// Day note (saved after typing stops)
const note = ref('')
const editing = ref(false)
let timer
watch(
  () => [n.value, progress.data.dayNotes[`d${n.value}`]],
  ([, v], old) => {
    // don't overwrite what the user is typing with a (slightly older) synced value
    if (!editing.value || old?.[0] !== n.value) note.value = v || ''
  },
  { immediate: true },
)
function onNote() {
  clearTimeout(timer)
  const dayAt = n.value
  const text = note.value
  timer = setTimeout(() => progress.setDayNote(dayAt, text), 700)
}
</script>

<template>
  <div v-if="day" class="page">
    <div class="day-nav">
      <RouterLink v-if="n > 1" :to="`/day/${n - 1}`" class="btn icon sm" title="Oldingi kun">
        <AppIcon name="chevronLeft" :size="18" />
      </RouterLink>
      <span v-else class="btn icon sm" style="visibility: hidden" />
      <div class="center">
        <p class="eyebrow">{{ week.number }}-hafta · {{ week.title }}</p>
        <h1>Kun {{ n }}</h1>
        <p v-if="progress.dayLabel(n)" class="small muted date">
          {{ progress.isDayComplete(n) ? 'Tugatilgan: ' : '' }}{{ progress.dayLabel(n) }}
        </p>
      </div>
      <RouterLink
        v-if="n < TOTAL_DAYS"
        :to="`/day/${n + 1}`"
        class="btn icon sm"
        title="Keyingi kun"
      >
        <AppIcon name="chevronRight" :size="18" />
      </RouterLink>
      <span v-else class="btn icon sm" style="visibility: hidden" />
    </div>

    <div class="card summary">
      <div class="row">
        <span class="chip" :class="dp.done === dp.total ? 'success' : 'accent'">
          {{ dp.done === dp.total ? 'Bajarildi ✓' : `${dp.done}/${dp.total} bajarildi` }}
        </span>
        <span v-if="n === progress.currentDay" class="chip warn">Hozirgi kun</span>
        <span v-else-if="progress.isLocked(n)" class="chip">🔒 Yopiq</span>
        <span class="muted small">{{ week.month }}</span>
      </div>
      <div class="bar">
        <span :style="{ width: (dp.total ? (dp.done / dp.total) * 100 : 0) + '%' }" />
      </div>
      <div v-if="week.focus.length" class="row focus">
        <span v-for="f in week.focus" :key="f.label" class="chip">
          <b v-if="f.label">{{ f.label }}:</b> {{ f.value }}
        </span>
      </div>
    </div>

    <TaskList :day="n" />

    <DayMaterials :day="n" />

    <section class="card">
      <div class="row">
        <h3>{{ ownPhrases ? 'Haftaning iboralari' : 'Barcha iboralar — takrorlash' }}</h3>
        <span class="spacer" />
        <RouterLink
          :to="{ path: '/phrases', query: { week: week.number, tab: 'cards' } }"
          class="btn sm"
        >
          Flashcards →
        </RouterLink>
      </div>
      <ul class="phrases">
        <li v-for="p in phrases.slice(0, ownPhrases ? 99 : 8)" :key="p.en">
          <SpeakButton :text="p.en" />
          <div>
            <div>{{ p.en }}</div>
            <small class="muted">{{ p.uz }}</small>
          </div>
        </li>
      </ul>
    </section>

    <section v-if="week.questions.length" class="card">
      <h3>Tayyorlanadigan savollar</h3>
      <ul class="phrases">
        <li v-for="q in week.questions" :key="q.q">
          <SpeakButton :text="q.q" />
          <div>
            <div>{{ q.q }}</div>
            <small class="muted">{{ q.source }}</small>
          </div>
        </li>
      </ul>
    </section>

    <section class="card">
      <h3>Kun eslatmasi</h3>
      <textarea
        v-model="note"
        class="input"
        placeholder="Bugun nimani o'rgandim, nima qiyin bo'ldi, qaysi so'zlarni bilmadim…"
        @input="onNote"
        @focus="editing = true"
        @blur="editing = false"
      />
    </section>
  </div>
</template>

<style scoped>
.day-nav {
  display: flex;
  align-items: center;
  gap: 12px;
}
.day-nav .center {
  flex: 1;
  text-align: center;
  min-width: 0;
}
.day-nav h1 {
  margin: 0;
}
.day-nav .date {
  margin: 2px 0 0;
}
.summary {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.focus .chip {
  display: inline-block;
  white-space: normal;
}
.phrases {
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
</style>
