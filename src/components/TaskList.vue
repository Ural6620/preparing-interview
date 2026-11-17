<script setup>
import { computed, ref } from 'vue'
import { marked } from 'marked'
import { RouterLink } from 'vue-router'
import { getDay } from '@/lib/plan'
import { useProgressStore } from '@/stores/progress'
import { aiReady, checkTask, isFree, DAILY_FREE_LIMIT } from '@/lib/aiCheck'
import AppIcon from './AppIcon.vue'
import AiSettings from './AiSettings.vue'

const props = defineProps({
  day: { type: Number, required: true },
})

const progress = useProgressStore()
const dayData = computed(() => getDay(props.day))
const locked = computed(() => progress.isLocked(props.day))
const copied = ref(-1)

const AI_PROMPT =
  'Act as a senior full-stack interviewer. Ask one question at a time. After each answer, give feedback on my technical answer and correct my English. My level is A2–B1, so keep your English simple.'

function actionsFor(task, i) {
  const t = task.text
  const out = []
  if (task.title.startsWith('Chunks')) {
    out.push({ label: '🧠 Bugungi yodlash', to: { path: `/day/${props.day}`, hash: '#drill' } })
    out.push({ label: 'Iboralar', to: { path: '/phrases', query: { week: dayData.value.week } } })
  }
  if (
    /audio|monolog|jonli|tell me about yourself|ovoz chiqarib|mock|hikoya|tayyorgarliksiz/i.test(
      t,
    ) ||
    /xulosa/i.test(task.title)
  )
    out.push({ label: 'Gapirish', to: { path: '/speak', query: { day: props.day, task: i } } })
  if (/Q&A bank/i.test(t))
    out.push({ label: 'Q&A bank', to: { path: '/notebook', query: { tab: 'qa' } } })
  if (/talaffuz/i.test(t))
    out.push({ label: 'Talaffuz', to: { path: '/phrases', query: { tab: 'pron' } } })
  if (/PSTR|STAR|shablon/i.test(t)) out.push({ label: 'Shablonlar', to: '/reference' })
  if (/^AI:|\(AI\)|Mock #\d \(AI\)/.test(t)) out.push({ label: 'AI prompt', copy: true })
  return out
}

async function copyPrompt(task, i) {
  const topic = task.text.replace(/<[^>]+>/g, '').replace(/\*\*/g, '')
  const text = `${AI_PROMPT}\n\nToday's topic: ${topic}`
  try {
    await navigator.clipboard.writeText(text)
    copied.value = i
    setTimeout(() => (copied.value = -1), 2000)
  } catch {
    window.prompt('Nusxa oling:', text)
  }
}

const html = (s) => marked.parseInline(s)

// ---------- AI check ----------
const openCheck = ref(-1) // index of the task whose check panel is open
const answer = ref('')
const checking = ref(false)
const checkError = ref('')
const showSettings = ref(false)

function toggleCheck(i) {
  checkError.value = ''
  if (openCheck.value === i) {
    openCheck.value = -1
    return
  }
  openCheck.value = i
  answer.value = progress.aiCheckOf(props.day, i)?.answer || ''
  showSettings.value = !aiReady()
}

async function runCheck(task, i) {
  checkError.value = ''
  if (!aiReady()) {
    showSettings.value = true
    return
  }
  if (isFree() && progress.aiUsedToday >= DAILY_FREE_LIMIT) {
    checkError.value = `Bugungi bepul limit (${DAILY_FREE_LIMIT} ta) tugadi. Ertaga davom eting yoki sozlamalarda o'z kalitingizni ulang.`
    return
  }
  checking.value = true
  try {
    const text = answer.value.trim()
    const result = await checkTask({ day: props.day, task, answer: text })
    if (isFree()) progress.noteAiUse()
    progress.saveAiCheck(props.day, i, { ...result, answer: text })
  } catch (e) {
    checkError.value = e.message || String(e)
  } finally {
    checking.value = false
  }
}
</script>

<template>
  <div v-if="dayData && locked" class="lock-note">
    🔒 Bu kun hali yopiq. Avval
    <RouterLink :to="`/day/${progress.currentDay}`">Kun {{ progress.currentDay }}</RouterLink>
    ning barcha vazifalarini bajaring — keyin bu kun ochiladi.
  </div>
  <ul v-if="dayData" class="tasks">
    <li
      v-for="(task, i) in dayData.tasks"
      :key="i"
      class="task"
      :class="{ done: progress.isDone(day, i) }"
    >
      <button
        class="check"
        role="checkbox"
        :aria-checked="progress.isDone(day, i)"
        :aria-label="task.title"
        :disabled="locked"
        :title="locked ? `Avval Kun ${progress.currentDay} ni tugating` : ''"
        @click="progress.toggleTask(day, i)"
      >
        <AppIcon v-if="progress.isDone(day, i)" name="check" :size="16" />
      </button>
      <div class="body">
        <div class="title-row">
          <strong>{{ task.title }}</strong>
          <span v-if="task.minutes" class="chip"
            ><AppIcon name="clock" :size="12" /> {{ task.minutes }} daq</span
          >
        </div>
        <p class="text" v-html="html(task.text)" />
        <div v-if="actionsFor(task, i).length" class="actions">
          <template v-for="a in actionsFor(task, i)" :key="a.label">
            <button v-if="a.copy" class="btn sm" @click="copyPrompt(task, i)">
              {{ copied === i ? 'Nusxalandi ✓' : a.label }}
            </button>
            <RouterLink v-else :to="a.to" class="btn sm">{{ a.label }} →</RouterLink>
          </template>
        </div>
        <div class="actions">
          <button
            v-if="!locked"
            class="btn sm ai-btn"
            :class="{ on: openCheck === i }"
            @click="toggleCheck(i)"
          >
            <AppIcon name="check" :size="14" /> AI tekshiruv
          </button>
          <span
            v-if="progress.aiCheckOf(day, i)"
            class="chip"
            :class="progress.aiCheckOf(day, i).passed ? 'success' : 'warn'"
          >
            {{
              progress.aiCheckOf(day, i).passed
                ? `O'tdingiz · ${progress.aiCheckOf(day, i).score}`
                : 'Qaytadan qiling'
            }}
          </span>
        </div>

        <div v-if="openCheck === i" class="check-panel">
          <template v-if="showSettings">
            <div class="row">
              <strong class="small">AI ni ulang</strong>
              <span class="spacer" />
              <button v-if="aiReady()" class="btn sm" @click="showSettings = false">Tayyor</button>
            </div>
            <AiSettings />
          </template>
          <template v-else>
            <textarea
              v-model="answer"
              rows="6"
              placeholder="Vazifa bo'yicha qilgan ishingizni shu yerga yozing: javob, kod, yoki gapirgan matningiz (transkript)."
            />
            <div class="row">
              <button
                class="btn primary sm"
                :disabled="checking || answer.trim().length < 10"
                @click="runCheck(task, i)"
              >
                {{ checking ? 'Tekshirilmoqda…' : 'Tekshirish' }}
              </button>
              <span class="spacer" />
              <button class="btn sm" @click="showSettings = true">AI sozlamalari</button>
            </div>
            <p v-if="checkError" class="error small">{{ checkError }}</p>

            <div
              v-if="progress.aiCheckOf(day, i) && !checking"
              class="result"
              :class="progress.aiCheckOf(day, i).passed ? 'pass' : 'fail'"
            >
              <strong>
                {{ progress.aiCheckOf(day, i).passed ? "✅ O'tdingiz!" : '❌ Qaytadan qiling' }}
                <span class="muted small">· {{ progress.aiCheckOf(day, i).score }}/100</span>
              </strong>
              <p>{{ progress.aiCheckOf(day, i).feedback }}</p>
              <p v-if="!progress.aiCheckOf(day, i).passed && progress.aiCheckOf(day, i).todo">
                <b>Nima qilish kerak:</b> {{ progress.aiCheckOf(day, i).todo }}
              </p>
              <ul v-if="progress.aiCheckOf(day, i).corrections?.length" class="small">
                <li v-for="c in progress.aiCheckOf(day, i).corrections" :key="c">{{ c }}</li>
              </ul>
            </div>
          </template>
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.lock-note {
  margin-bottom: 10px;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  color: var(--muted);
  font-size: 0.92rem;
}
.tasks {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.task {
  display: flex;
  gap: 14px;
  padding: 14px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--surface);
  transition: background 0.2s;
}
.task.done {
  background: var(--success-soft);
  border-color: transparent;
}
.task.done .title-row strong {
  text-decoration: line-through;
  text-decoration-color: var(--faint);
}
.check {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  margin-top: 1px;
  border-radius: 8px;
  border: 2px solid var(--border);
  background: var(--surface);
  color: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.check:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}
.task.done .check {
  background: var(--success);
  border-color: var(--success);
}
.body {
  min-width: 0;
  flex: 1;
}
.title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 10px;
}
.text {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 0.93rem;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
}
.ai-btn.on {
  border-color: var(--accent);
  color: var(--accent);
}
.check-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
  padding: 12px;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
}
.check-panel textarea {
  width: 100%;
  resize: vertical;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text);
  font: inherit;
}
.error {
  margin: 0;
  color: var(--danger);
}
.result {
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: var(--surface);
  border-left: 4px solid var(--warn);
}
.result.pass {
  border-left-color: var(--success);
}
.result p {
  margin: 6px 0 0;
}
.result ul {
  margin: 6px 0 0;
  padding-left: 18px;
}
</style>
