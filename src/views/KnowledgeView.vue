<script setup>
import { computed, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { domains, getDomain, questions, TOTAL_QUESTIONS } from '@/lib/knowledge'
import { useProgressStore } from '@/stores/progress'
import QuestionCard from '@/components/QuestionCard.vue'
import AppIcon from '@/components/AppIcon.vue'

const route = useRoute()
const progress = useProgressStore()

const domain = computed(() => (route.params.domain ? getDomain(route.params.domain) : null))
const search = ref('')

function stats(qs) {
  const st = progress.data.qaStatus
  const ok = qs.filter((q) => st[q.key] === 'ok').length
  const review = qs.filter((q) => st[q.key] === 'review').length
  return { ok, review, total: qs.length, pct: qs.length ? Math.round((ok / qs.length) * 100) : 0 }
}
const domainStats = (d) => stats(questions.filter((q) => q.domain.id === d.id))
const topicStats = (t) => stats(questions.filter((q) => q.topic.id === t.id))
const overall = computed(() => stats(questions))

const results = computed(() => {
  const s = search.value.trim().toLowerCase()
  if (s.length < 2) return []
  return questions
    .filter((q) => (q.q + ' ' + q.a + ' ' + (q.uz || '') + ' ' + q.topic.title).toLowerCase().includes(s))
    .slice(0, 30)
})
</script>

<template>
  <!-- DOMAIN: list of topics -->
  <div v-if="domain" class="page">
    <RouterLink to="/learn" class="back small"><AppIcon name="chevronLeft" :size="14" /> Bilim bazasi</RouterLink>
    <div class="page-head">
      <div>
        <p class="eyebrow">{{ domain.topics.length }} mavzu · {{ domainStats(domain).total }} savol</p>
        <h1>{{ domain.icon }} {{ domain.title }}</h1>
      </div>
      <RouterLink :to="{ path: '/practice', query: { d: domain.id } }" class="btn primary">
        <AppIcon name="target" :size="16" /> Mock interview
      </RouterLink>
    </div>
    <p class="muted">{{ domain.intro }}</p>

    <RouterLink
      v-for="(t, i) in domain.topics"
      :key="t.id"
      :to="`/learn/${domain.id}/${t.id}`"
      class="card topic-row"
    >
      <span class="idx">{{ i + 1 }}</span>
      <div class="info">
        <strong>{{ t.title }}</strong>
        <small class="muted">
          {{ t.questions.length }} savol
          <template v-if="t.days?.length"> · Kun {{ t.days.slice(0, 4).join(', ') }}{{ t.days.length > 4 ? '…' : '' }}</template>
        </small>
        <div class="bar"><span :style="{ width: topicStats(t).pct + '%' }" /></div>
      </div>
      <AppIcon name="chevronRight" :size="18" class="muted" />
    </RouterLink>
  </div>

  <!-- ALL DOMAINS -->
  <div v-else class="page">
    <div class="page-head">
      <div>
        <p class="eyebrow">{{ TOTAL_QUESTIONS }} ta savol va namuna javob</p>
        <h1>Bilim bazasi</h1>
      </div>
      <RouterLink to="/practice" class="btn primary"><AppIcon name="target" :size="16" /> Mock interview</RouterLink>
    </div>

    <div class="card overall">
      <div class="row">
        <span class="chip success">✅ Bilaman: {{ overall.ok }}</span>
        <span class="chip warn">🔁 Takrorlash: {{ overall.review }}</span>
        <span class="chip">Qolgan: {{ overall.total - overall.ok - overall.review }}</span>
      </div>
      <div class="bar"><span :style="{ width: overall.pct + '%' }" /></div>
      <p class="small muted">
        Savolni oching → avval o'zingiz ovoz chiqarib javob bering → namuna javob bilan solishtiring → baholang.
      </p>
    </div>

    <label class="searchbox">
      <AppIcon name="search" :size="18" />
      <input v-model="search" class="input" placeholder="Qidirish: closure, index, JWT, Docker…" />
    </label>

    <template v-if="search.trim().length >= 2">
      <p class="small muted">{{ results.length }} ta natija</p>
      <div class="list">
        <div v-for="q in results" :key="q.key">
          <RouterLink :to="`/learn/${q.domain.id}/${q.topic.id}`" class="small crumb">
            {{ q.domain.icon }} {{ q.topic.title }}
          </RouterLink>
          <QuestionCard :question="q" :qkey="q.key" :drill="q.domain.kind === 'drill'" />
        </div>
      </div>
    </template>

    <div v-else class="grid two">
      <RouterLink v-for="d in domains" :key="d.id" :to="`/learn/${d.id}`" class="card domain">
        <div class="row">
          <span class="emoji">{{ d.icon }}</span>
          <strong>{{ d.title }}</strong>
        </div>
        <p class="small muted intro">{{ d.intro }}</p>
        <div class="row small muted">
          <span>{{ d.topics.length }} mavzu</span>·<span>{{ domainStats(d).total }} savol</span>
          <span class="spacer" />
          <span>{{ domainStats(d).pct }}%</span>
        </div>
        <div class="bar"><span :style="{ width: domainStats(d).pct + '%' }" /></div>
      </RouterLink>
      <RouterLink to="/problems" class="card domain">
        <div class="row">
          <span class="emoji">🧩</span>
          <strong>Algoritm masalalari</strong>
        </div>
        <p class="small muted intro">LeetCode masalalari: pattern, maslahat, inglizcha tushuntirish va yechim.</p>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  color: var(--muted);
}
.overall {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.overall p {
  margin: 0;
}
.searchbox {
  position: relative;
  display: block;
}
.searchbox svg {
  position: absolute;
  left: 12px;
  top: 12px;
  color: var(--faint);
}
.searchbox .input {
  padding-left: 40px;
}
.domain {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--text);
  text-decoration: none;
  transition: border-color 0.15s;
}
.domain:hover,
.topic-row:hover {
  border-color: var(--accent);
}
.emoji {
  font-size: 1.4rem;
}
.intro {
  margin: 0;
  flex: 1;
}
.topic-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  color: var(--text);
  text-decoration: none;
}
.idx {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: var(--accent-soft);
  color: var(--accent);
  font-weight: 800;
  flex-shrink: 0;
}
.info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.crumb {
  display: inline-block;
  margin-bottom: 4px;
  text-decoration: none;
}
</style>
