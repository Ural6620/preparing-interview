<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useProgressStore } from '@/stores/progress'
import SpeakButton from './SpeakButton.vue'
import CodeBlock from './CodeBlock.vue'
import { inlineMd } from '@/lib/inlineMd'

const props = defineProps({
  question: { type: Object, required: true }, // { q, a, uz, example, followUp, level }
  qkey: { type: String, required: true },
  drill: { type: Boolean, default: false }, // translation drill (grammar)
  index: { type: Number, default: null },
  // daily drill: a rating always (re)sets the status for today instead of toggling it off
  sticky: { type: Boolean, default: false },
})

const progress = useProgressStore()
const open = ref(false)
const showUz = ref(false)
const status = computed(() => progress.data.qaStatus[props.qkey] || '')

const doneToday = computed(() => props.sticky && progress.ratedToday(props.qkey))

function rate(s) {
  if (props.sticky) {
    progress.setQaStatus(props.qkey, s)
    open.value = false // next card
  } else progress.setQaStatus(props.qkey, status.value === s ? '' : s)
}
</script>

<template>
  <article class="qcard" :class="[status, { open, today: doneToday }]">
    <header @click="open = !open">
      <span class="num">{{
        status === 'ok' ? '✓' : status === 'review' ? '↻' : index != null ? index + 1 : '•'
      }}</span>
      <div class="qtext">
        <small v-if="drill" class="muted">Inglizchaga tarjima qiling:</small>
        <strong v-html="inlineMd(question.q)" />
      </div>
      <span v-if="doneToday" class="chip success lvl">bugun ✓</span>
      <span v-if="question.level === 'middle'" class="chip warn lvl">middle</span>
      <SpeakButton v-if="!drill" :text="question.q" />
    </header>

    <div v-if="open" class="body">
      <div class="answer">
        <div class="row ans-head">
          <span class="label">{{ drill ? 'Javob' : 'Namuna javob' }}</span>
          <SpeakButton :text="question.a" />
          <span class="spacer" />
          <button v-if="question.uz" class="btn sm ghost" @click="showUz = !showUz">
            {{ showUz ? 'Yashirish' : drill ? 'Qoida' : "O'zbekcha" }}
          </button>
        </div>
        <p class="en" v-html="inlineMd(question.a)" />
        <p v-if="showUz" class="uz" v-html="inlineMd(question.uz)" />
      </div>

      <CodeBlock v-if="question.example" :code="question.example" />

      <p v-if="question.followUp" class="follow small">
        <b>Follow-up:</b> {{ question.followUp }}
        <SpeakButton :text="question.followUp" />
      </p>

      <div class="row actions">
        <button class="btn sm" :class="{ active: status === 'ok' }" @click="rate('ok')">
          ✅ Bilaman
        </button>
        <button class="btn sm" :class="{ active: status === 'review' }" @click="rate('review')">
          🔁 Takrorlash
        </button>
        <span class="spacer" />
        <RouterLink
          v-if="!drill"
          :to="{ path: '/speak', query: { q: question.q } }"
          class="btn sm ghost"
        >
          🎙 Javobni yozib olish
        </RouterLink>
      </div>
    </div>
  </article>
</template>

<style scoped>
.qcard {
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
}
.qcard.today {
  opacity: 0.7;
}
.qcard.ok {
  border-color: color-mix(in srgb, var(--success) 40%, var(--border));
}
.qcard.review {
  border-color: color-mix(in srgb, var(--warn) 45%, var(--border));
}
header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 12px 12px 14px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.num {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: var(--surface-2);
  color: var(--muted);
  font-size: 0.8rem;
  font-weight: 700;
}
.ok .num {
  background: var(--success);
  color: #fff;
}
.review .num {
  background: var(--warn-soft);
  color: var(--warn);
}
.qtext {
  flex: 1;
  min-width: 0;
}
.qtext small {
  display: block;
}
.lvl {
  font-size: 0.7rem;
}
.body {
  padding: 0 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.answer {
  background: var(--accent-soft);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
}
.ans-head {
  gap: 4px;
}
.label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--accent);
}
.en {
  margin: 4px 0 0;
  font-size: 1rem;
}
.uz {
  margin: 8px 0 0;
  padding-top: 8px;
  border-top: 1px dashed color-mix(in srgb, var(--accent) 30%, transparent);
  color: var(--muted);
  font-size: 0.92rem;
}
.follow {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}
.actions .btn.active {
  background: var(--accent-soft);
  border-color: var(--accent);
  color: var(--accent);
}
</style>
