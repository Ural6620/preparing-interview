<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { plan } from '@/lib/plan'
import { useProgressStore } from '@/stores/progress'
import SpeakButton from '@/components/SpeakButton.vue'
import AppIcon from '@/components/AppIcon.vue'

const route = useRoute()
const router = useRouter()
const progress = useProgressStore()

const tab = ref(['mistakes', 'qa', 'audio'].includes(route.query.tab) ? route.query.tab : 'mistakes')
watch(tab, (t) => router.replace({ query: { tab: t } }))

// ---------- mistakes ----------
const TYPES = ['grammatika', 'talaffuz', 'texnik aniqlik', 'jim qolish', 'tarjima']
const mForm = ref({ said: '', correct: '', type: 'grammatika' })
const mFilter = ref('')
function addMistake() {
  if (!mForm.value.said.trim() && !mForm.value.correct.trim()) return
  progress.addItem('mistakes', { ...mForm.value, date: new Date().toISOString().slice(0, 10) })
  mForm.value = { said: '', correct: '', type: mForm.value.type }
}
const mistakes = computed(() =>
  progress.data.mistakes.filter((m) => !mFilter.value || m.type === mFilter.value),
)
const mistakeStats = computed(() => {
  const s = {}
  for (const m of progress.data.mistakes) s[m.type] = (s[m.type] || 0) + 1
  return s
})

// ---------- Q&A bank ----------
// Suggested questions = quoted questions from "Q&A bank" tasks + behavioral questions
const suggestions = (() => {
  const set = new Set()
  for (const d of plan.days)
    for (const t of d.tasks)
      if (/Q&A bank/.test(t.text)) {
        const quoted = [...t.text.matchAll(/"([^"]+)"/g)].map((m) => m[1])
        if (quoted.length) quoted.forEach((q) => set.add(q))
        else
          t.text
            .replace(/^Q&A bank[^:]*:\s*/, '')
            .replace(/—.*$/, '')
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s && s.length < 40)
            .forEach((s) => set.add(`What is ${s}?`.replace(/What is (.+ vs .+)\?/, 'What is the difference: $1?')))
      }
  plan.questions.forEach((q) => set.add(q.q))
  return [...set]
})()

const emptyQa = () => ({ question: '', answer: '', example: '', followUp: '', status: 'review' })
const qForm = ref(emptyQa())
const editingId = ref(null)
const openId = ref(null)
const qSearch = ref('')
const showSuggest = ref(false)

const existingQuestions = computed(() => new Set(progress.data.qa.map((q) => q.question.toLowerCase())))
const freshSuggestions = computed(() => suggestions.filter((s) => !existingQuestions.value.has(s.toLowerCase())))

function useSuggestion(q) {
  qForm.value = { ...emptyQa(), question: q }
  editingId.value = null
  showSuggest.value = false
  document.getElementById('qa-form')?.scrollIntoView({ behavior: 'smooth' })
}
function saveQa() {
  if (!qForm.value.question.trim()) return
  if (editingId.value) progress.updateItem('qa', editingId.value, { ...qForm.value })
  else progress.addItem('qa', { ...qForm.value })
  qForm.value = emptyQa()
  editingId.value = null
}
function editQa(q) {
  qForm.value = { ...emptyQa(), ...q }
  editingId.value = q.id
  document.getElementById('qa-form')?.scrollIntoView({ behavior: 'smooth' })
}
function toggleStatus(q) {
  progress.updateItem('qa', q.id, { status: q.status === 'ok' ? 'review' : 'ok' })
}
const qaList = computed(() => {
  const s = qSearch.value.toLowerCase()
  return progress.data.qa.filter(
    (q) => !s || q.question.toLowerCase().includes(s) || q.answer?.toLowerCase().includes(s),
  )
})
const qaReady = computed(() => progress.data.qa.filter((q) => q.status === 'ok').length)

function confirmRemove(name, id) {
  if (confirm("O'chirilsinmi?")) progress.removeItem(name, id)
}

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <p class="eyebrow">Shaxsiy daftar</p>
        <h1>Daftar</h1>
      </div>
    </div>

    <div class="tabs">
      <button :class="{ active: tab === 'mistakes' }" @click="tab = 'mistakes'">
        Xato daftari <small>({{ progress.data.mistakes.length }})</small>
      </button>
      <button :class="{ active: tab === 'qa' }" @click="tab = 'qa'">
        Q&A bank <small>({{ progress.data.qa.length }})</small>
      </button>
      <button :class="{ active: tab === 'audio' }" @click="tab = 'audio'">
        Audio jurnal <small>({{ progress.data.audioLog.length }})</small>
      </button>
    </div>

    <!-- MISTAKES -->
    <template v-if="tab === 'mistakes'">
      <form class="card form" @submit.prevent="addMistake">
        <div class="grid two">
          <label class="field">Men aytdim <input v-model="mForm.said" class="input" placeholder="I am work with Vue" /></label>
          <label class="field">To'g'risi <input v-model="mForm.correct" class="input" placeholder="I work with Vue" /></label>
        </div>
        <div class="row">
          <select v-model="mForm.type" class="input type-select">
            <option v-for="t in TYPES" :key="t" :value="t">{{ t }}</option>
          </select>
          <button class="btn primary"><AppIcon name="plus" :size="16" /> Qo'shish</button>
        </div>
      </form>

      <div v-if="progress.data.mistakes.length" class="row chips">
        <button class="chip" :class="{ accent: !mFilter }" @click="mFilter = ''">Hammasi</button>
        <button
          v-for="t in TYPES"
          :key="t"
          class="chip"
          :class="{ accent: mFilter === t }"
          @click="mFilter = t"
        >
          {{ t }} · {{ mistakeStats[t] || 0 }}
        </button>
      </div>

      <div v-if="!mistakes.length" class="card empty">
        Hali xato yozilmagan. Audio tahlilida topgan xatolaringizni shu yerga yozing — eng tez o'sish shu.
      </div>
      <ul v-else class="list">
        <li v-for="m in mistakes" :key="m.id" class="card mistake">
          <div class="body">
            <div class="said">{{ m.said }}</div>
            <div class="correct">
              <SpeakButton v-if="m.correct" :text="m.correct" />
              {{ m.correct }}
            </div>
            <div class="row small muted">
              <span class="chip">{{ m.type }}</span>
              {{ m.date }}
            </div>
          </div>
          <button class="btn icon sm ghost" title="O'chirish" @click="confirmRemove('mistakes', m.id)">
            <AppIcon name="trash" :size="16" />
          </button>
        </li>
      </ul>
    </template>

    <!-- Q&A BANK -->
    <template v-else-if="tab === 'qa'">
      <div class="card">
        <div class="row">
          <span class="chip success">✅ Tayyor: {{ qaReady }}</span>
          <span class="chip warn">🔁 Takrorlash: {{ progress.data.qa.length - qaReady }}</span>
          <span class="spacer" />
          <button class="btn sm" @click="showSuggest = !showSuggest">
            Rejadagi savollar ({{ freshSuggestions.length }})
          </button>
        </div>
        <div v-if="showSuggest" class="suggest">
          <button v-for="s in freshSuggestions" :key="s" class="chip accent" @click="useSuggestion(s)">+ {{ s }}</button>
          <p v-if="!freshSuggestions.length" class="small muted">Hammasi qo'shilgan 👏</p>
        </div>
      </div>

      <form id="qa-form" class="card form" @submit.prevent="saveQa">
        <h3>{{ editingId ? 'Tahrirlash' : 'Yangi savol' }}</h3>
        <label class="field">Savol <input v-model="qForm.question" class="input" placeholder="What is the event loop?" /></label>
        <label class="field">
          Qisqa javob (inglizcha)
          <textarea v-model="qForm.answer" class="input" rows="3" placeholder="JavaScript is single-threaded. The event loop…" />
        </label>
        <div class="grid two">
          <label class="field">Misol <textarea v-model="qForm.example" class="input" rows="2" /></label>
          <label class="field">Follow-up <textarea v-model="qForm.followUp" class="input" rows="2" /></label>
        </div>
        <div class="row">
          <select v-model="qForm.status" class="input type-select">
            <option value="review">🔁 Takrorlash kerak</option>
            <option value="ok">✅ Tayyor</option>
          </select>
          <button class="btn primary">{{ editingId ? 'Saqlash' : "Qo'shish" }}</button>
          <button v-if="editingId" type="button" class="btn ghost" @click="(editingId = null), (qForm = emptyQa())">
            Bekor qilish
          </button>
        </div>
      </form>

      <input v-if="progress.data.qa.length > 3" v-model="qSearch" class="input" placeholder="Qidirish…" />

      <div v-if="!progress.data.qa.length" class="card empty">
        Savol-javoblaringizni shu yerda to'plang. Interview oldidan aynan shu bank takrorlanadi.
      </div>
      <ul v-else class="list">
        <li v-for="q in qaList" :key="q.id" class="card qa">
          <div class="qa-head" @click="openId = openId === q.id ? null : q.id">
            <span class="status" :title="q.status === 'ok' ? 'Tayyor' : 'Takrorlash'">{{ q.status === 'ok' ? '✅' : '🔁' }}</span>
            <strong class="qtext">{{ q.question }}</strong>
            <AppIcon :name="openId === q.id ? 'chevronLeft' : 'chevronRight'" :size="16" class="muted chev" />
          </div>
          <div v-if="openId === q.id" class="qa-body">
            <div v-if="q.answer" class="ans">
              <SpeakButton :text="q.answer" />
              <p>{{ q.answer }}</p>
            </div>
            <p v-if="q.example" class="small"><b>Example:</b> {{ q.example }}</p>
            <p v-if="q.followUp" class="small"><b>Follow-up:</b> {{ q.followUp }}</p>
            <div class="row">
              <button class="btn sm" @click="toggleStatus(q)">{{ q.status === 'ok' ? '🔁 Takrorlashga' : '✅ Tayyor' }}</button>
              <button class="btn sm" @click="editQa(q)"><AppIcon name="edit" :size="14" /> Tahrirlash</button>
              <RouterLink :to="{ path: '/speak', query: { q: q.question } }" class="btn sm">
                <AppIcon name="mic" :size="14" /> Gapirish
              </RouterLink>
              <span class="spacer" />
              <button class="btn icon sm ghost" title="O'chirish" @click="confirmRemove('qa', q.id)">
                <AppIcon name="trash" :size="16" />
              </button>
            </div>
          </div>
        </li>
      </ul>
    </template>

    <!-- AUDIO JOURNAL -->
    <template v-else>
      <div v-if="!progress.data.audioLog.length" class="card empty">
        Hali yozuv yo'q.
        <RouterLink to="/speak">Gapirish</RouterLink> sahifasida yozib, natijani jurnalga saqlang.
      </div>
      <div v-else class="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Kun</th>
              <th>Mavzu</th>
              <th>Vaqt</th>
              <th>Jim</th>
              <th>So'z/daq</th>
              <th>Eslatma</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in progress.data.audioLog" :key="a.id">
              <td>
                <strong>{{ a.day }}</strong>
                <div class="small muted">{{ a.date }}</div>
              </td>
              <td>
                {{ a.topic }}
                <details v-if="a.transcript" class="small muted">
                  <summary>Transkript</summary>
                  {{ a.transcript }}
                </details>
              </td>
              <td>{{ fmt(a.seconds || 0) }}</td>
              <td>{{ a.pauses ?? '—' }}</td>
              <td>{{ a.wpm ?? '—' }}</td>
              <td class="small">{{ a.note }}</td>
              <td>
                <button class="btn icon sm ghost" title="O'chirish" @click="confirmRemove('audioLog', a.id)">
                  <AppIcon name="trash" :size="16" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<style scoped>
.tabs small {
  font-weight: 500;
  color: var(--faint);
}
.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.form h3 {
  margin: 0;
}
.type-select {
  width: auto;
  flex: 1 1 160px;
  max-width: 240px;
}
.chips {
  gap: 6px;
}
.chips .chip {
  border: 0;
  cursor: pointer;
}
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.mistake {
  display: flex;
  gap: 10px;
  padding: 14px;
}
.mistake .body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.said {
  color: var(--danger);
  text-decoration: line-through;
  text-decoration-thickness: 1px;
}
.correct {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--success);
  font-weight: 600;
}
.suggest {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}
.suggest .chip {
  border: 0;
  cursor: pointer;
  white-space: normal;
  text-align: left;
}
.qa {
  padding: 0;
}
.qa-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  cursor: pointer;
}
.qtext {
  flex: 1;
}
.qa-body {
  padding: 0 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ans {
  display: flex;
  gap: 6px;
  align-items: flex-start;
}
.ans p {
  margin: 4px 0 0;
  white-space: pre-wrap;
}
details summary {
  cursor: pointer;
}
</style>
