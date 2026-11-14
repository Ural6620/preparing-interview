<script setup>
import { computed, ref } from 'vue'
import { todayISO } from '@/lib/plan'
import { useProgressStore } from '@/stores/progress'

const progress = useProgressStore()

const AREAS = [
  { id: 'fe', label: 'Frontend' },
  { id: 'be', label: 'Backend' },
  { id: 'db', label: 'Database' },
  { id: 'devops', label: 'DevOps' },
  { id: 'dsa', label: 'Algoritmlar' },
  { id: 'english', label: 'Ingliz tili' },
]
const LEVELS = ['', 'Bilmayman', "Ozgina", "O'rtacha", 'Yaxshi', "Ishonchli tushuntira olaman"]

const list = computed(() => [...progress.data.assessments].sort((a, b) => (a.day ?? 0) - (b.day ?? 0)))
const first = computed(() => list.value[0])
const last = computed(() => list.value.at(-1))

const draft = ref(Object.fromEntries(AREAS.map((a) => [a.id, last.value?.scores?.[a.id] ?? 2])))
const editing = ref(false)
const saved = ref(false)

function save() {
  progress.addItem('assessments', { date: todayISO(), day: progress.currentDay, scores: { ...draft.value } })
  editing.value = false
  saved.value = true
  setTimeout(() => (saved.value = false), 2500)
}

const weakest = computed(() => {
  if (!last.value) return []
  const min = Math.min(...AREAS.map((a) => last.value.scores[a.id] ?? 5))
  return AREAS.filter((a) => (last.value.scores[a.id] ?? 5) === min).map((a) => a.label)
})
function remove(id) {
  if (confirm("Bu baholash o'chirilsinmi?")) progress.removeItem('assessments', id)
}
</script>

<template>
  <section id="assessment" class="card sa">
    <div class="row">
      <h2>O'z-o'zini baholash</h2>
      <span class="spacer" />
      <button v-if="!editing" class="btn sm primary" @click="editing = true">+ Yangi baholash</button>
    </div>
    <p class="small muted">
      1, 28, 56 va 84-kunlarda har bir sohani 1–5 ball bilan halol baholang. Sayt o'sishingizni ko'rsatadi va eng zaif
      sohani topadi.
    </p>

    <div v-if="editing" class="form">
      <label v-for="a in AREAS" :key="a.id" class="slider">
        <span class="name">{{ a.label }}</span>
        <input v-model.number="draft[a.id]" type="range" min="1" max="5" step="1" />
        <span class="val"><b>{{ draft[a.id] }}</b> <small class="muted">{{ LEVELS[draft[a.id]] }}</small></span>
      </label>
      <div class="row">
        <button class="btn primary" @click="save">Saqlash (Kun {{ progress.currentDay }})</button>
        <button class="btn ghost" @click="editing = false">Bekor qilish</button>
      </div>
    </div>
    <p v-if="saved" class="small ok">Saqlandi ✓</p>

    <template v-if="list.length">
      <div v-if="weakest.length" class="weak small">
        🎯 Eng zaif soha: <b>{{ weakest.join(', ') }}</b> — Bilim bazasi va Mock interview'da shunga ko'proq vaqt bering.
      </div>
      <div class="bars">
        <div v-for="a in AREAS" :key="a.id" class="barrow">
          <span class="name small">{{ a.label }}</span>
          <div class="track">
            <span v-if="first !== last" class="ghost-bar" :style="{ width: (first.scores[a.id] / 5) * 100 + '%' }" />
            <span class="fill" :style="{ width: (last.scores[a.id] / 5) * 100 + '%' }" />
          </div>
          <span class="small num">
            {{ last.scores[a.id] }}
            <em v-if="first !== last && last.scores[a.id] !== first.scores[a.id]" :class="last.scores[a.id] > first.scores[a.id] ? 'up' : 'down'">
              {{ last.scores[a.id] > first.scores[a.id] ? '+' : '' }}{{ last.scores[a.id] - first.scores[a.id] }}
            </em>
          </span>
        </div>
        <p v-if="first !== last" class="small muted legend">
          Och rang — Kun {{ first.day }}, to'q — Kun {{ last.day }}
        </p>
      </div>
      <div class="table-wrap">
        <table class="small">
          <thead>
            <tr>
              <th>Kun</th>
              <th v-for="a in AREAS" :key="a.id">{{ a.label }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in list" :key="s.id">
              <td><b>{{ s.day }}</b><div class="muted">{{ s.date }}</div></td>
              <td v-for="a in AREAS" :key="a.id">{{ s.scores[a.id] }}</td>
              <td><button class="btn icon sm ghost" title="O'chirish" @click="remove(s.id)">×</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <p v-else-if="!editing" class="empty small">Hali baholash yo'q. Birinchisini hozir qiling — bu sizning boshlang'ich nuqtangiz.</p>
  </section>
</template>

<style scoped>
.sa {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.sa h2,
.sa p {
  margin: 0;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
}
.slider {
  display: grid;
  grid-template-columns: 100px 1fr;
  grid-template-areas: 'name range' '. val';
  align-items: center;
  gap: 2px 10px;
}
.slider .name {
  grid-area: name;
  font-weight: 600;
  font-size: 0.9rem;
}
.slider input {
  grid-area: range;
  width: 100%;
  accent-color: var(--accent);
}
.slider .val {
  grid-area: val;
  font-size: 0.85rem;
}
.ok {
  color: var(--success);
  font-weight: 600;
}
.weak {
  background: var(--warn-soft);
  color: var(--warn);
  padding: 8px 12px;
  border-radius: var(--radius-sm);
}
.bars {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.barrow {
  display: grid;
  grid-template-columns: 90px 1fr 50px;
  align-items: center;
  gap: 10px;
}
.track {
  position: relative;
  height: 10px;
  border-radius: 999px;
  background: var(--surface-2);
  overflow: hidden;
}
.track span {
  position: absolute;
  inset: 0 auto 0 0;
  border-radius: inherit;
}
.ghost-bar {
  background: color-mix(in srgb, var(--accent) 30%, transparent);
}
.fill {
  background: var(--accent);
  mix-blend-mode: normal;
  opacity: 0.85;
}
.num em {
  font-style: normal;
  font-weight: 700;
  margin-left: 2px;
}
.up {
  color: var(--success);
}
.down {
  color: var(--danger);
}
.legend {
  margin: 0;
}
</style>
