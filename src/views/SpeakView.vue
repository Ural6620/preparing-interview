<script setup>
import { computed, ref, onBeforeUnmount, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { plan, getDay, todayISO } from '@/lib/plan'
import { useProgressStore } from '@/stores/progress'
import { createRecognizer, recognitionSupported, analyzeTranscript, speak, ttsSupported } from '@/lib/speech'
import AppIcon from '@/components/AppIcon.vue'

const route = useRoute()
const progress = useProgressStore()

// ---------- prompts ----------
function quoted(text) {
  return [...text.matchAll(/"([^"]+)"/g)].map((m) => m[1])
}
const interviewQuestions = (() => {
  const set = new Set(['Tell me about yourself'])
  for (const d of plan.days)
    for (const t of d.tasks)
      if (/Q&A bank|Monolog|audio/i.test(t.text)) quoted(t.text).forEach((q) => set.add(q))
  plan.questions.forEach((q) => set.add(q.q))
  return [...set].filter((q) => !/day in the life|Ask me about/i.test(q))
})()

const RANDOM_TOPICS = [
  'Describe your favourite programming language and why you like it',
  'Explain how the internet works to a non-technical friend',
  'What did you do last weekend?',
  'Describe a tool that makes you more productive',
  'What happens when you type a URL into the browser?',
  'Talk about a technology you want to learn next year',
  'Describe your ideal workday',
  'Explain the difference between frontend and backend',
  'What makes a good code review?',
  'Talk about a book, video or course that helped you grow',
]

const dayNum = computed(() => (route.query.day ? Number(route.query.day) : null))
const dayTaskPrompt = computed(() => {
  if (!dayNum.value) return null
  const d = getDay(dayNum.value)
  if (!d) return null
  const i = Number(route.query.task ?? 1)
  const task = d.tasks[i] || d.tasks[1]
  const tech = d.tasks[2]?.text.replace(/\*\*/g, '') || ''
  if (/xulosa/i.test(task.title))
    return {
      text: `Summarize what you learned today. Topic: ${tech}`,
      hint: "Bugun o'rganganingni 2 daqiqa inglizcha tushuntir",
      target: 120,
    }
  const clean = task.text.replace(/\*\*/g, '')
  const q = quoted(clean)[0]
  const mins = clean.match(/(\d+(?:\.\d+)?)\s*daq/)
  return { text: q || clean, hint: clean, target: mins ? Math.round(parseFloat(mins[1]) * 60) : 120 }
})

const category = ref(route.query.q ? 'custom' : dayTaskPrompt.value ? 'day' : 'interview')
const promptText = ref('')
const target = ref(120)

function pickPrompt() {
  if (category.value === 'day' && dayTaskPrompt.value) {
    promptText.value = dayTaskPrompt.value.text
    target.value = dayTaskPrompt.value.target
  } else if (category.value === 'interview') {
    promptText.value = interviewQuestions[0]
    target.value = 90
  } else if (category.value === 'random') {
    shuffleTopic()
    target.value = 180
  } else {
    promptText.value = ''
  }
}
function shuffleTopic() {
  const pool = category.value === 'interview' ? interviewQuestions : RANDOM_TOPICS
  let next
  do next = pool[Math.floor(Math.random() * pool.length)]
  while (pool.length > 1 && next === promptText.value)
  promptText.value = next
}
watch(category, pickPrompt)
pickPrompt()
if (route.query.q) promptText.value = String(route.query.q) // opened from the Q&A bank

// ---------- recording ----------
const state = ref('idle') // idle | recording | done
const seconds = ref(0)
const audioUrl = ref('')
const audioExt = ref('webm')
const errorMsg = ref('')
const useTranscript = ref(recognitionSupported)
const finalText = ref('')
const interimText = ref('')

let recorder = null
let stream = null
let tick = null
let recognizer = null
let startedAt = 0

function pickMime() {
  if (typeof MediaRecorder === 'undefined') return ''
  for (const m of ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg'])
    if (MediaRecorder.isTypeSupported(m)) return m
  return ''
}

async function start() {
  errorMsg.value = ''
  finalText.value = ''
  interimText.value = ''
  if (audioUrl.value) URL.revokeObjectURL(audioUrl.value)
  audioUrl.value = ''
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  } catch {
    errorMsg.value = "Mikrofonga ruxsat berilmadi. Brauzer sozlamalaridan ruxsat bering."
    return
  }
  const mime = pickMime()
  audioExt.value = mime.includes('mp4') ? 'm4a' : mime.includes('ogg') ? 'ogg' : 'webm'
  recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined)
  const chunks = []
  recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data)
  recorder.onstop = () => {
    audioUrl.value = URL.createObjectURL(new Blob(chunks, { type: mime || 'audio/webm' }))
  }
  recorder.start()

  if (useTranscript.value) {
    recognizer = createRecognizer({
      onText: (f, i) => {
        finalText.value = f
        interimText.value = i
      },
    })
    try {
      recognizer?.start()
    } catch {
      recognizer = null
    }
  }

  startedAt = Date.now()
  seconds.value = 0
  tick = setInterval(() => (seconds.value = Math.floor((Date.now() - startedAt) / 1000)), 250)
  state.value = 'recording'
}

function stop() {
  clearInterval(tick)
  if (recorder?.state === 'recording') recorder.stop()
  stream?.getTracks().forEach((t) => t.stop())
  recognizer?.stop()
  recognizer = null
  state.value = 'done'
  journal.value.topic = promptText.value
}

onBeforeUnmount(() => {
  if (state.value === 'recording') stop()
  if (audioUrl.value) URL.revokeObjectURL(audioUrl.value)
})

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
const transcript = computed(() => (finalText.value + ' ' + interimText.value).trim())
const analysis = computed(() => analyzeTranscript(finalText.value, seconds.value))
const overTarget = computed(() => seconds.value > target.value)

const fileName = computed(() => {
  const slug = (promptText.value || 'speaking').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)
  return `${dayNum.value ? `kun-${dayNum.value}-` : ''}${todayISO()}-${slug}.${audioExt.value}`
})

// ---------- journal ----------
const journal = ref({ topic: '', pauses: '', note: '' })
const saved = ref(false)
function saveJournal() {
  progress.addItem('audioLog', {
    date: todayISO(),
    day: dayNum.value ?? progress.currentDay,
    topic: journal.value.topic || promptText.value,
    seconds: seconds.value,
    pauses: journal.value.pauses === '' ? null : Number(journal.value.pauses),
    note: journal.value.note,
    wpm: finalText.value ? analysis.value.wpm : null,
    transcript: finalText.value.slice(0, 3000),
  })
  journal.value = { topic: '', pauses: '', note: '' }
  saved.value = true
  setTimeout(() => (saved.value = false), 2500)
}
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <p class="eyebrow">{{ dayNum ? `Kun ${dayNum}` : 'Speaking practice' }}</p>
        <h1>Gapirish</h1>
      </div>
    </div>

    <section class="card prompt-card">
      <div class="tabs">
        <button v-if="dayTaskPrompt" :class="{ active: category === 'day' }" @click="category = 'day'">Bugungi vazifa</button>
        <button :class="{ active: category === 'interview' }" @click="category = 'interview'">Interview savollari</button>
        <button :class="{ active: category === 'random' }" @click="category = 'random'">Tasodifiy mavzu</button>
        <button :class="{ active: category === 'custom' }" @click="category = 'custom'">O'zim yozaman</button>
      </div>

      <select
        v-if="category === 'interview'"
        v-model="promptText"
        class="input"
        :disabled="state === 'recording'"
      >
        <option v-for="q in interviewQuestions" :key="q" :value="q">{{ q }}</option>
      </select>
      <textarea
        v-else-if="category === 'custom'"
        v-model="promptText"
        class="input"
        rows="2"
        placeholder="Mavzu yoki savol yozing…"
      />

      <div v-if="promptText" class="prompt">
        <p class="q">{{ promptText }}</p>
        <div class="row">
          <button v-if="ttsSupported" class="btn sm" @click="speak(promptText)">
            <AppIcon name="volume" :size="15" /> Savolni eshitish
          </button>
          <button v-if="category === 'interview' || category === 'random'" class="btn sm" @click="shuffleTopic">
            <AppIcon name="shuffle" :size="15" /> Boshqasi
          </button>
        </div>
        <p v-if="category === 'day' && dayTaskPrompt" class="small muted hint">{{ dayTaskPrompt.hint }}</p>
      </div>

      <label class="row small muted target">
        Maqsad vaqti:
        <select v-model.number="target" class="input">
          <option :value="60">1 daq</option>
          <option :value="90">1.5 daq</option>
          <option :value="120">2 daq</option>
          <option :value="180">3 daq</option>
          <option :value="300">5 daq</option>
          <option :value="360">6 daq</option>
          <option :value="480">8 daq</option>
        </select>
      </label>
    </section>

    <section class="card recorder" :class="state">
      <div class="timer" :class="{ over: overTarget }">
        {{ fmt(seconds) }} <small>/ {{ fmt(target) }}</small>
      </div>
      <div class="bar"><span :style="{ width: Math.min(100, (seconds / target) * 100) + '%' }" /></div>

      <button v-if="state !== 'recording'" class="rec-btn" @click="start">
        <AppIcon name="mic" :size="30" />
      </button>
      <button v-else class="rec-btn recording" @click="stop">
        <AppIcon name="stop" :size="28" />
      </button>
      <p class="small muted">
        {{
          state === 'recording'
            ? 'Yozilmoqda… gapiring. Tugatganda bosing.'
            : state === 'done'
              ? 'Qayta yozish uchun bosing'
              : 'Bosing va gapirishni boshlang'
        }}
      </p>

      <label v-if="recognitionSupported && state !== 'recording'" class="row small muted">
        <input v-model="useTranscript" type="checkbox" /> Jonli transkript (matnga aylantirish)
      </label>
      <p v-if="errorMsg" class="error small">{{ errorMsg }}</p>

      <div v-if="useTranscript && (state === 'recording' || transcript)" class="transcript">
        {{ finalText }}<span class="muted">{{ interimText }}</span>
        <span v-if="!transcript" class="muted">…</span>
      </div>
    </section>

    <section v-if="state === 'done'" class="card">
      <h3>Natija</h3>
      <audio v-if="audioUrl" :src="audioUrl" controls class="audio" />
      <div class="row metrics">
        <span class="chip accent">⏱ {{ fmt(seconds) }}</span>
        <template v-if="finalText">
          <span class="chip">{{ analysis.words }} so'z</span>
          <span class="chip" :class="analysis.wpm >= 100 ? 'success' : 'warn'">{{ analysis.wpm }} so'z/daq</span>
          <span v-for="(c, w) in analysis.fillers" :key="w" class="chip warn">"{{ w }}" × {{ c }}</span>
        </template>
      </div>
      <p v-if="finalText" class="small muted">
        Interview uchun 110–150 so'z/daqiqa yaxshi. "um/uh" o'rniga "Let me think…" deng.
      </p>
      <div class="row">
        <a v-if="audioUrl" :href="audioUrl" :download="fileName" class="btn sm">
          <AppIcon name="download" :size="15" /> Audioni yuklab olish
        </a>
      </div>
      <p class="small muted">
        Audio faqat shu qurilmada — saqlab qo'ying. 1, 28, 56, 84-kunlarda solishtirasiz.
      </p>

      <hr />
      <h3>Audio jurnaliga yozish</h3>
      <div class="grid two">
        <label class="field">Mavzu <input v-model="journal.topic" class="input" /></label>
        <label class="field">
          Jim qolishlar soni
          <input v-model="journal.pauses" class="input" type="number" min="0" inputmode="numeric" />
        </label>
      </div>
      <label class="field">
        Eslatma (qayerda qiynaldim, qaysi so'z kerak bo'ldi)
        <textarea v-model="journal.note" class="input" rows="2" />
      </label>
      <div class="row">
        <button class="btn primary" @click="saveJournal">Saqlash</button>
        <span v-if="saved" class="small success-text">Saqlandi ✓</span>
        <span class="spacer" />
        <RouterLink :to="{ path: '/notebook', query: { tab: 'audio' } }" class="small">Jurnalni ko'rish →</RouterLink>
      </div>
    </section>

    <section class="card tips">
      <h3>Maslahatlar</h3>
      <ul class="small muted">
        <li>Bilmasangiz: <em>"That's a good question. Let me think for a second."</em></li>
        <li>Qisqa gaplar bilan gapiring — present simple yetarli.</li>
        <li>Yozib olganingizni eshiting va xatolarni <RouterLink to="/notebook">Xato daftari</RouterLink>ga yozing.</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.prompt-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.prompt {
  padding: 14px;
  border-radius: var(--radius-sm);
  background: var(--accent-soft);
}
.q {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 10px;
}
.hint {
  margin: 10px 0 0;
}
.target .input {
  width: auto;
  min-height: 34px;
  padding: 4px 8px;
}
.recorder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}
.recorder .bar {
  width: 100%;
  max-width: 360px;
}
.timer {
  font-size: 2.6rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
.timer small {
  font-size: 1rem;
  color: var(--faint);
  font-weight: 600;
}
.timer.over {
  color: var(--warn);
}
.rec-btn {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  border: 0;
  display: grid;
  place-items: center;
  background: var(--accent);
  color: var(--accent-text);
  cursor: pointer;
  box-shadow: 0 6px 20px color-mix(in srgb, var(--accent) 35%, transparent);
  -webkit-tap-highlight-color: transparent;
}
.rec-btn.recording {
  background: #dc2626;
  color: #fff;
  animation: pulse 1.4s ease-in-out infinite;
}
@keyframes pulse {
  50% {
    box-shadow: 0 0 0 14px rgb(220 38 38 / 0.15);
  }
}
.transcript {
  width: 100%;
  text-align: left;
  padding: 12px;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  min-height: 60px;
  max-height: 240px;
  overflow-y: auto;
}
.error {
  color: var(--danger);
}
.audio {
  width: 100%;
  margin-bottom: 10px;
}
.metrics {
  gap: 6px;
  margin-bottom: 8px;
}
hr {
  border: 0;
  border-top: 1px solid var(--border);
  margin: 16px 0;
}
.field {
  margin-bottom: 12px;
}
.success-text {
  color: var(--success);
  font-weight: 600;
}
.tips ul {
  margin: 0;
  padding-left: 1.2em;
}
</style>
