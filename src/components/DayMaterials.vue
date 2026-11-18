<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { getPattern } from '@/lib/knowledge'
import { topicsForDay, problemsForDay } from '@/lib/curriculum'
import { useProgressStore } from '@/stores/progress'

const props = defineProps({
  day: { type: Number, required: true },
  compact: { type: Boolean, default: false },
})
const progress = useProgressStore()

const topics = computed(() => topicsForDay(props.day))
const problems = computed(() => problemsForDay(props.day))
// self-assessment: first day and every 4 weeks
const assess = computed(() => props.day === 1 || props.day % 28 === 0)

function topicDone(t) {
  return t.questions.filter((_, i) => progress.data.qaStatus[`${t.id}-${i}`] === 'ok').length
}
</script>

<template>
  <section v-if="topics.length || problems.length || assess" class="card materials">
    <h3>📚 Bugungi materiallar</h3>
    <div class="items">
      <RouterLink
        v-for="t in compact ? topics.slice(0, 4) : topics"
        :key="t.id"
        :to="`/learn/${t.domain.id}/${t.id}`"
        class="item"
      >
        <span class="ico">{{ t.domain.icon }}</span>
        <span class="txt">
          <strong>{{ t.title }}</strong>
          <small class="muted"
            >{{ t.domain.title }} · {{ topicDone(t) }}/{{ t.questions.length }} savol</small
          >
        </span>
      </RouterLink>
      <RouterLink
        v-for="p in problems"
        :key="p.id"
        :to="{ path: '/problems', query: { open: p.id } }"
        class="item"
      >
        <span class="ico">{{ progress.data.problems[p.id] ? '✅' : '🧩' }}</span>
        <span class="txt">
          <strong>{{ p.title }}</strong>
          <small class="muted"
            >{{ p.difficulty }} · {{ getPattern(p.pattern)?.title || p.pattern }}</small
          >
        </span>
      </RouterLink>
      <RouterLink v-if="assess" to="/plan#assessment" class="item">
        <span class="ico">📊</span>
        <span class="txt">
          <strong>O'z-o'zini baholash</strong>
          <small class="muted">5 soha + ingliz tili, 1–5 ball</small>
        </span>
      </RouterLink>
    </div>
    <RouterLink v-if="compact && topics.length > 4" :to="`/day/${day}`" class="small">
      Yana {{ topics.length - 4 }} ta →
    </RouterLink>
  </section>
</template>

<style scoped>
.materials {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.materials h3 {
  margin: 0;
}
.items {
  display: grid;
  gap: 8px;
}
@media (min-width: 720px) {
  .items {
    grid-template-columns: 1fr 1fr;
  }
}
.item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  color: var(--text);
  text-decoration: none;
  border: 1px solid transparent;
}
.item:hover {
  border-color: var(--accent);
}
.ico {
  font-size: 1.2rem;
  flex-shrink: 0;
}
.txt {
  min-width: 0;
}
.txt strong {
  display: block;
  font-size: 0.92rem;
  line-height: 1.3;
}
.txt small {
  font-size: 0.78rem;
}
</style>
