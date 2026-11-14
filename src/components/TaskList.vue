<script setup>
import { computed, ref } from 'vue'
import { marked } from 'marked'
import { RouterLink } from 'vue-router'
import { getDay } from '@/lib/plan'
import { useProgressStore } from '@/stores/progress'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  day: { type: Number, required: true },
})

const progress = useProgressStore()
const dayData = computed(() => getDay(props.day))
const copied = ref(-1)

const AI_PROMPT =
  'Act as a senior full-stack interviewer. Ask one question at a time. After each answer, give feedback on my technical answer and correct my English. My level is A2–B1, so keep your English simple.'

function actionsFor(task, i) {
  const t = task.text
  const out = []
  if (task.title.startsWith('Chunks')) out.push({ label: 'Iboralar', to: { path: '/phrases', query: { week: dayData.value.week } } })
  if (/audio|monolog|jonli|tell me about yourself|ovoz chiqarib|mock|hikoya|tayyorgarliksiz/i.test(t) || /xulosa/i.test(task.title))
    out.push({ label: 'Gapirish', to: { path: '/speak', query: { day: props.day, task: i } } })
  if (/Q&A bank/i.test(t)) out.push({ label: 'Q&A bank', to: { path: '/notebook', query: { tab: 'qa' } } })
  if (/talaffuz/i.test(t)) out.push({ label: 'Talaffuz', to: { path: '/phrases', query: { tab: 'pron' } } })
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
</script>

<template>
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
        @click="progress.toggleTask(day, i)"
      >
        <AppIcon v-if="progress.isDone(day, i)" name="check" :size="16" />
      </button>
      <div class="body">
        <div class="title-row">
          <strong>{{ task.title }}</strong>
          <span v-if="task.minutes" class="chip"><AppIcon name="clock" :size="12" /> {{ task.minutes }} daq</span>
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
      </div>
    </li>
  </ul>
</template>

<style scoped>
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
  gap: 6px;
  margin-top: 10px;
}
</style>
