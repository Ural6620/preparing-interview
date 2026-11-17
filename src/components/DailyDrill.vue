<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  newQuestionsForDay,
  newPhrasesForDay,
  reviewQuestionsForDay,
  reviewPhrasesForDay,
  REVIEW_AFTER,
} from '@/lib/drill'
import { useProgressStore } from '@/stores/progress'
import QuestionCard from './QuestionCard.vue'
import SpeakButton from './SpeakButton.vue'

const props = defineProps({
  day: { type: Number, required: true },
})
const progress = useProgressStore()

const newQs = computed(() => newQuestionsForDay(props.day))
const reviewQs = computed(() => reviewQuestionsForDay(props.day, progress.data.qaStatus))
const newPhrases = computed(() => newPhrasesForDay(props.day))
const reviewPhrases = computed(() => reviewPhrasesForDay(props.day))

const showReviewPhrases = ref(false)
const showUz = ref(false)

// today's counter only makes sense on the day you are working on
const isCurrent = computed(() => props.day === progress.currentDay)
const all = computed(() => [...newQs.value, ...reviewQs.value])
const doneCount = computed(() => all.value.filter((q) => progress.ratedToday(q.key)).length)
</script>

<template>
  <section
    v-if="newQs.length || reviewQs.length || newPhrases.length"
    id="drill"
    class="card drill"
  >
    <div class="row head">
      <h3>🧠 Bugungi yodlash</h3>
      <span class="spacer" />
      <span
        v-if="isCurrent && all.length"
        class="chip"
        :class="doneCount === all.length ? 'success' : 'accent'"
      >
        {{ doneCount }}/{{ all.length }} savol
      </span>
    </div>
    <p class="small muted how">
      Savolni oching → avval o'zingiz <b>ovoz chiqarib</b> javob bering → namuna bilan solishtiring
      va eshitib takrorlang → <b>✅ Bilaman</b> yoki <b>🔁 Takrorlash</b>. Takrorlashlar
      {{ REVIEW_AFTER.join(', ') }} kundan keyin qaytadi; "Takrorlash" belgilanganlar esa
      yodlaguningizcha har kuni chiqadi.
    </p>

    <!-- phrases -->
    <div v-if="newPhrases.length" class="block">
      <div class="row">
        <h4>🗣 Yangi iboralar ({{ newPhrases.length }})</h4>
        <span class="spacer" />
        <button class="btn sm ghost" @click="showUz = !showUz">
          {{ showUz ? "O'zbekchasini yashirish" : "O'zbekcha" }}
        </button>
      </div>
      <ul class="phrases">
        <li v-for="p in newPhrases" :key="p.en">
          <SpeakButton :text="p.en" />
          <div>
            <div>{{ p.en }}</div>
            <small v-if="showUz" class="muted">{{ p.uz }}</small>
          </div>
        </li>
      </ul>
      <p class="small muted">Har birini 5 marta eshitib, ovoz chiqarib takrorlang (shadowing).</p>
    </div>

    <div v-if="reviewPhrases.length" class="block">
      <button class="linkish small" @click="showReviewPhrases = !showReviewPhrases">
        {{ showReviewPhrases ? '▾' : '▸' }} Iboralarni takrorlash ({{ reviewPhrases.length }})
      </button>
      <ul v-if="showReviewPhrases" class="phrases">
        <li v-for="p in reviewPhrases" :key="p.en">
          <SpeakButton :text="p.en" />
          <div>
            <div>{{ p.en }}</div>
            <small class="muted">{{ p.uz }}</small>
          </div>
        </li>
      </ul>
    </div>

    <!-- questions -->
    <div v-if="newQs.length" class="block">
      <h4>❓ Yangi savollar ({{ newQs.length }})</h4>
      <div v-for="(q, i) in newQs" :key="q.key" class="qwrap">
        <RouterLink :to="`/learn/${q.domain.id}/${q.topic.id}`" class="small muted topic">
          {{ q.domain.icon }} {{ q.topic.title }}
        </RouterLink>
        <QuestionCard
          :question="q"
          :qkey="q.key"
          :index="i"
          :drill="q.domain.kind === 'drill'"
          sticky
        />
      </div>
    </div>

    <div v-if="reviewQs.length" class="block">
      <h4>🔁 Takrorlash ({{ reviewQs.length }})</h4>
      <div v-for="(q, i) in reviewQs" :key="q.key" class="qwrap">
        <RouterLink :to="`/learn/${q.domain.id}/${q.topic.id}`" class="small muted topic">
          {{ q.domain.icon }} {{ q.topic.title }}
        </RouterLink>
        <QuestionCard
          :question="q"
          :qkey="q.key"
          :index="i"
          :drill="q.domain.kind === 'drill'"
          sticky
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.drill {
  display: flex;
  flex-direction: column;
  gap: 14px;
  scroll-margin-top: 72px;
}
.drill h3,
.drill h4,
.how {
  margin: 0;
}
.block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.phrases {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.phrases li {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}
.block > p {
  margin: 0;
}
.qwrap {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.topic {
  text-decoration: none;
}
.linkish {
  align-self: flex-start;
  background: none;
  border: 0;
  padding: 0;
  color: var(--accent);
  cursor: pointer;
  font: inherit;
}
</style>
