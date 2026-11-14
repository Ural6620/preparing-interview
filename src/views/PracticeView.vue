<script setup>
import { computed, ref, onBeforeUnmount } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { domains, questions } from '@/lib/knowledge'
import { speak, stopSpeaking, ttsSupported } from '@/lib/speech'
import { useProgressStore } from '@/stores/progress'
import SpeakButton from '@/components/SpeakButton.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import AppIcon from '@/components/AppIcon.vue'
import { inlineMd } from '@/lib/inlineMd'

const route = useRoute()
const progress = useProgressStore()

const interviewDomains = domains.filter((d) => d.kind !== 'drill')
const selected = ref(
  route.query.d ? [String(route.query.d)] : interviewDomains.filter((d) => d.id !== 'behavioral').map((d) => d.id),
)
const count = ref(5)
const onlyWeak = ref(false)
const autoRead = ref(ttsSupported)
const middleToo = ref(true)

function toggleDomain(id) {
  selected.value = selected.value.includes(id) ? selected.value.filter((x) => x !== id) : [...selected.value, id]
}

const pool = computed(() =>
  questions.filter(
    (q) =>
      selected.value.includes(q.domain.id) &&
      (middleToo.value || q.level !== 'middle') &&
      (!onlyWeak.value || progress.data.qaStatus[q.key] !== 'ok'),
  ),
)

// ---- session ----
const phase = ref('setup') // setup | ask | reveal | done
const session = ref([])
const i = ref(0)
const results = ref([]) // 'ok' | 'partial' | 'miss'
const seconds = ref(0)
let timer = null

const current = computed(() => session.value[i.value])

function start() {
  const arr = [...pool.value].sort(() => Math.random() - 0.5).slice(0, count.value)
  if (!arr.length) return
  session.value = arr
  results.value = []
  i.value = 0
  ask()
}

function ask() {
  phase.value = 'ask'
  seconds.value = 0
  clearInterval(timer)
  timer = setInterval(() => seconds.value++, 1000)
  if (autoRead.value) speak(current.value.q)
}

function showAnswer() {
  clearInterval(timer)
  stopSpeaking()
  phase.value = 'reveal'
}

function rate(r) {
  results.value.push(r)
  progress.setQaStatus(current.value.key, r === 'ok' ? 'ok' : 'review')
  if (i.value + 1 < session.value.length) {
    i.value++
    ask()
  } else {
    phase.value = 'done'
  }
}

function stop() {
  clearInterval(timer)
  stopSpeaking()
  phase.value = results.value.length ? 'done' : 'setup'
}
onBeforeUnmount(stop)

const summary = computed(() => ({
  ok: results.value.filter((r) => r === 'ok').length,
  partial: results.value.filter((r) => r === 'partial').length,
  miss: results.value.filter((r) => r === 'miss').length,
}))
const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <p class="eyebrow">Interview simulyatsiyasi</p>
        <h1>Mock interview</h1>
      </div>
      <button v-if="phase === 'ask' || phase === 'reveal'" class="btn sm" @click="stop">Tugatish</button>
    </div>

    <!-- SETUP -->
    <template v-if="phase === 'setup'">
      <section class="card setup">
        <h3>Sohalar</h3>
        <div class="chips">
          <button
            v-for="d in interviewDomains"
            :key="d.id"
            class="chip"
            :class="{ accent: selected.includes(d.id) }"
            @click="toggleDomain(d.id)"
          >
            {{ d.icon }} {{ d.title }}
          </button>
        </div>

        <h3>Savollar soni</h3>
        <div class="tabs">
          <button v-for="n in [5, 10, 15]" :key="n" :class="{ active: count === n }" @click="count = n">{{ n }} ta</button>
        </div>

        <label class="row small"><input v-model="onlyWeak" type="checkbox" /> Faqat hali "bilaman" deb belgilanmaganlar</label>
        <label class="row small"><input v-model="middleToo" type="checkbox" /> Middle darajadagi savollar ham</label>
        <label v-if="ttsSupported" class="row small"><input v-model="autoRead" type="checkbox" /> Savolni ovoz chiqarib o'qish (quloq bilan tushunish mashqi)</label>

        <button class="btn primary big" :disabled="!pool.length" @click="start">
          <AppIcon name="play" :size="16" /> Boshlash ({{ Math.min(count, pool.length) }} / {{ pool.length }})
        </button>
      </section>

      <section class="card tips small muted">
        <b>Qanday ishlaydi:</b> savol chiqadi → siz ovoz chiqarib 1–2 daqiqa javob berasiz (haqiqiy interview kabi) →
        namuna javobni ochasiz → o'zingizni halol baholaysiz. Baholar Bilim bazasidagi progressga yoziladi.
      </section>
    </template>

    <!-- QUESTION -->
    <template v-else-if="phase === 'ask' || phase === 'reveal'">
      <div class="progress-row small muted">
        <span>Savol {{ i + 1 }} / {{ session.length }}</span>
        <div class="bar"><span :style="{ width: ((i + (phase === 'reveal' ? 1 : 0)) / session.length) * 100 + '%' }" /></div>
        <span>{{ current.domain.icon }} {{ current.topic.title }}</span>
      </div>

      <section class="card qbox">
        <p class="q" v-html="inlineMd(current.q)" />
        <div class="row">
          <SpeakButton :text="current.q" size="md" />
          <span class="timer" :class="{ warn: seconds > 120 }">⏱ {{ fmt(seconds) }}</span>
        </div>
        <button v-if="phase === 'ask'" class="btn primary big" @click="showAnswer">Javob berdim — namunani ko'rsat</button>
      </section>

      <section v-if="phase === 'reveal'" class="card">
        <div class="row">
          <span class="label">Namuna javob</span>
          <SpeakButton :text="current.a" />
        </div>
        <p class="en" v-html="inlineMd(current.a)" />
        <details v-if="current.uz" class="small muted">
          <summary>O'zbekcha</summary>
          {{ current.uz }}
        </details>
        <CodeBlock v-if="current.example" :code="current.example" />
        <p v-if="current.followUp" class="small follow"><b>Follow-up:</b> {{ current.followUp }}</p>

        <p class="small muted rate-label">O'zingizni baholang:</p>
        <div class="rate">
          <button class="btn" @click="rate('miss')">😕 Bilmadim</button>
          <button class="btn" @click="rate('partial')">🤏 Qisman</button>
          <button class="btn primary" @click="rate('ok')">✅ Yaxshi</button>
        </div>
      </section>
    </template>

    <!-- DONE -->
    <template v-else>
      <section class="card done">
        <h2>Natija</h2>
        <div class="row">
          <span class="chip success">✅ {{ summary.ok }}</span>
          <span class="chip warn">🤏 {{ summary.partial }}</span>
          <span class="chip">😕 {{ summary.miss }}</span>
        </div>
        <ul class="small">
          <li v-for="(q, k) in session.slice(0, results.length)" :key="q.key">
            {{ results[k] === 'ok' ? '✅' : results[k] === 'partial' ? '🤏' : '😕' }}
            <RouterLink :to="`/learn/${q.domain.id}/${q.topic.id}`">{{ q.q }}</RouterLink>
          </li>
        </ul>
        <p class="small muted">
          Qiynalgan savollarni <RouterLink to="/notebook?tab=mistakes">Xato daftari</RouterLink>ga yozing va
          <RouterLink to="/speak">Gapirish</RouterLink> bo'limida qayta yozib oling.
        </p>
        <div class="row">
          <button class="btn primary" @click="start">Yana boshlash</button>
          <button class="btn" @click="phase = 'setup'">Sozlamalar</button>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.setup {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.setup h3 {
  margin: 4px 0 0;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.chips .chip {
  border: 0;
  cursor: pointer;
  padding: 6px 12px;
  font-size: 0.85rem;
}
.big {
  min-height: 50px;
  font-size: 1rem;
}
.tips {
  margin: 0;
}
.progress-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.progress-row .bar {
  flex: 1;
  min-width: 80px;
}
.qbox {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.q {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
}
.timer {
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  color: var(--muted);
}
.timer.warn {
  color: var(--warn);
}
.label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--accent);
}
.en {
  font-size: 1.05rem;
}
details {
  margin-bottom: 10px;
}
.follow {
  margin-top: 10px;
}
.rate-label {
  margin: 14px 0 6px;
}
.rate {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.done ul {
  padding-left: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
