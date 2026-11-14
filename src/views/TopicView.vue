<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getDomain } from '@/lib/knowledge'
import { useProgressStore } from '@/stores/progress'
import QuestionCard from '@/components/QuestionCard.vue'
import SpeakButton from '@/components/SpeakButton.vue'
import AppIcon from '@/components/AppIcon.vue'
import { inlineMd } from '@/lib/inlineMd'

const route = useRoute()
const progress = useProgressStore()

const domain = computed(() => getDomain(route.params.domain))
const idx = computed(() => domain.value?.topics.findIndex((t) => t.id === route.params.topic) ?? -1)
const topic = computed(() => (idx.value >= 0 ? domain.value.topics[idx.value] : null))
const prev = computed(() => (idx.value > 0 ? domain.value.topics[idx.value - 1] : null))
const next = computed(() => (topic.value ? domain.value.topics[idx.value + 1] : null))
const drill = computed(() => domain.value?.kind === 'drill')

const okCount = computed(
  () => topic.value?.questions.filter((_, i) => progress.data.qaStatus[`${topic.value.id}-${i}`] === 'ok').length ?? 0,
)
</script>

<template>
  <div v-if="topic" class="page">
    <RouterLink :to="`/learn/${domain.id}`" class="back small">
      <AppIcon name="chevronLeft" :size="14" /> {{ domain.icon }} {{ domain.title }}
    </RouterLink>

    <div class="page-head">
      <div>
        <p class="eyebrow">Mavzu {{ idx + 1 }} / {{ domain.topics.length }}</p>
        <h1>{{ topic.title }}</h1>
      </div>
    </div>

    <div v-if="topic.days?.length" class="row days">
      <span class="small muted">Rejada:</span>
      <RouterLink v-for="d in topic.days" :key="d" :to="`/day/${d}`" class="chip accent">Kun {{ d }}</RouterLink>
    </div>

    <section class="card">
      <h2>Tushuntirish</h2>
      <p class="summary" v-html="inlineMd(topic.summary)" />
      <ul class="points">
        <li v-for="p in topic.keyPoints" :key="p" v-html="inlineMd(p)" />
      </ul>
    </section>

    <section v-if="topic.vocab?.length" class="card">
      <h2>Lug'at</h2>
      <ul class="vocab">
        <li v-for="v in topic.vocab" :key="v.en">
          <SpeakButton :text="v.en" />
          <div>
            <strong>{{ v.en }}</strong>
            <small class="muted">{{ v.uz }}</small>
          </div>
        </li>
      </ul>
    </section>

    <section class="qs">
      <div class="row">
        <h2>{{ drill ? 'Tarjima mashqi' : 'Interview savollari' }}</h2>
        <span class="spacer" />
        <span class="chip" :class="okCount === topic.questions.length ? 'success' : ''">
          {{ okCount }}/{{ topic.questions.length }}
        </span>
      </div>
      <p class="small muted">
        {{
          drill
            ? "O'zbekcha gapni o'qing → inglizchasini ovoz chiqarib ayting → javobni oching."
            : "Savolni oching. Avval o'zingiz javob bering, keyin namuna bilan solishtiring va eshitib takrorlang."
        }}
      </p>
      <QuestionCard
        v-for="(q, i) in topic.questions"
        :key="`${topic.id}-${i}`"
        :question="q"
        :qkey="`${topic.id}-${i}`"
        :index="i"
        :drill="drill"
      />
    </section>

    <section v-if="topic.resources?.length" class="card">
      <h2>Resurslar</h2>
      <ul class="res">
        <li v-for="r in topic.resources" :key="r.url">
          <a :href="r.url" target="_blank" rel="noopener">{{ r.title }} <AppIcon name="external" :size="13" /></a>
        </li>
      </ul>
    </section>

    <nav class="pager">
      <RouterLink v-if="prev" :to="`/learn/${domain.id}/${prev.id}`" class="btn">
        <AppIcon name="chevronLeft" :size="16" /> {{ prev.title }}
      </RouterLink>
      <span v-else />
      <RouterLink v-if="next" :to="`/learn/${domain.id}/${next.id}`" class="btn primary">
        {{ next.title }} <AppIcon name="chevronRight" :size="16" />
      </RouterLink>
    </nav>
  </div>

  <div v-else class="card empty">
    Mavzu topilmadi. <RouterLink to="/learn">Bilim bazasiga qaytish</RouterLink>
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
.days {
  gap: 6px;
}
.days .chip {
  text-decoration: none;
}
.summary {
  font-size: 1.02rem;
}
.points {
  margin: 0;
  padding-left: 1.2em;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.vocab {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}
@media (min-width: 720px) {
  .vocab {
    grid-template-columns: 1fr 1fr;
  }
}
.vocab li {
  display: flex;
  gap: 6px;
  align-items: flex-start;
}
.vocab small {
  display: block;
}
.qs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.qs h2,
.qs p {
  margin: 0;
}
.res {
  margin: 0;
  padding-left: 1.2em;
}
.pager {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}
.pager .btn {
  max-width: 100%;
  white-space: normal;
  text-align: left;
}
</style>
