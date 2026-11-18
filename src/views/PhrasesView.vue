<script setup>
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { plan, phraseSets } from '@/lib/plan'
import { speak, stopSpeaking, ttsSupported } from '@/lib/speech'
import SpeakButton from '@/components/SpeakButton.vue'
import AppIcon from '@/components/AppIcon.vue'

const route = useRoute()
const router = useRouter()

const tab = ref(['list', 'cards', 'pron'].includes(route.query.tab) ? route.query.tab : 'list')
const weekFilter = ref(route.query.week ? Number(route.query.week) : 0)
const rate = ref(0.9)

const weeksWithPhrases = phraseSets
// a week without its own table (12, 13) falls back to "all"
if (weekFilter.value && !weeksWithPhrases.some((w) => w.number === weekFilter.value))
  weekFilter.value = 0

watch([tab, weekFilter], () => {
  router.replace({
    query: { tab: tab.value, ...(weekFilter.value ? { week: weekFilter.value } : {}) },
  })
  stopShadow()
  resetCards()
})

const groups = computed(() =>
  weeksWithPhrases.filter((w) => !weekFilter.value || w.number === weekFilter.value),
)
const list = computed(() => groups.value.flatMap((w) => w.phrases))

// ---------- shadowing: play each phrase, leave a gap to repeat it ----------
const shadowIdx = ref(-1)
let shadowTimer
function startShadow() {
  if (!ttsSupported) return
  playShadow(0)
}
function playShadow(i) {
  if (i >= list.value.length) return stopShadow()
  shadowIdx.value = i
  document.getElementById(`ph-${i}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  const text = list.value[i].en
  speak(text, {
    rate: rate.value,
    onend: () => {
      // time to repeat ≈ how long the phrase is, plus a buffer
      const gap = 1500 + text.split(' ').length * 450
      shadowTimer = setTimeout(() => playShadow(i + 1), gap)
    },
  })
}
function stopShadow() {
  clearTimeout(shadowTimer)
  stopSpeaking()
  shadowIdx.value = -1
}
onBeforeUnmount(stopShadow)

// ---------- flashcards ----------
const deck = ref([])
const cardIdx = ref(0)
const revealed = ref(false)
const score = ref({ known: 0, again: 0 })
function resetCards(shuffle = false) {
  const arr = [...list.value]
  if (shuffle) arr.sort(() => Math.random() - 0.5)
  deck.value = arr
  cardIdx.value = 0
  revealed.value = false
  score.value = { known: 0, again: 0 }
}
resetCards()
const card = computed(() => deck.value[cardIdx.value])
function reveal() {
  revealed.value = true
  if (ttsSupported) speak(card.value.en, { rate: rate.value })
}
function answer(known) {
  score.value[known ? 'known' : 'again']++
  if (!known) deck.value.push(card.value) // see it again later
  cardIdx.value++
  revealed.value = false
}

// ---------- pronunciation ----------
function sayable(row) {
  if (/O\(n²\)/.test(row.word)) return 'O of n squared'
  if (row.word === 'nginx') return 'engine x'
  return row.word.replace('/', ',')
}
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <p class="eyebrow">
          {{ plan.phrases.length }} ta ibora · {{ plan.pronunciation.length }} ta so'z
        </p>
        <h1>Iboralar</h1>
      </div>
      <label v-if="ttsSupported" class="rate small muted">
        Tezlik
        <select v-model.number="rate" class="input">
          <option :value="0.7">Sekin</option>
          <option :value="0.9">Normal</option>
          <option :value="1.05">Tez</option>
        </select>
      </label>
    </div>

    <div class="tabs">
      <button :class="{ active: tab === 'list' }" @click="tab = 'list'">Ro'yxat + shadowing</button>
      <button :class="{ active: tab === 'cards' }" @click="tab = 'cards'">Flashcards</button>
      <button :class="{ active: tab === 'pron' }" @click="tab = 'pron'">Talaffuz</button>
    </div>

    <p v-if="!ttsSupported" class="card small">
      Brauzeringiz ovozli o'qishni qo'llamaydi. Chrome yoki Safari'dan foydalaning.
    </p>

    <select v-if="tab !== 'pron'" v-model.number="weekFilter" class="input week-select">
      <option :value="0">Barcha haftalar</option>
      <option v-for="w in weeksWithPhrases" :key="w.number" :value="w.number">
        {{ w.title }}
      </option>
    </select>

    <!-- LIST -->
    <template v-if="tab === 'list'">
      <div class="card shadow-box">
        <div>
          <strong>Shadowing</strong>
          <p class="small muted">
            Sayt iborani o'qiydi → siz pauzada ovoz chiqarib takrorlaysiz. Ohang va urg'uni
            ko'chiring.
          </p>
        </div>
        <button
          v-if="shadowIdx < 0"
          class="btn primary"
          :disabled="!ttsSupported"
          @click="startShadow"
        >
          <AppIcon name="play" :size="16" /> Boshlash
        </button>
        <button v-else class="btn" @click="stopShadow">
          <AppIcon name="stop" :size="16" /> To'xtatish
        </button>
      </div>

      <section v-for="w in groups" :key="w.number" class="card">
        <h3>{{ w.number }}-hafta — {{ w.title }}</h3>
        <ul class="phrases">
          <li
            v-for="p in w.phrases"
            :id="`ph-${list.indexOf(p)}`"
            :key="p.en"
            :class="{ active: shadowIdx === list.indexOf(p) }"
          >
            <SpeakButton :text="p.en" :rate="rate" />
            <div>
              <div class="en">{{ p.en }}</div>
              <small class="muted">{{ p.uz }}</small>
            </div>
          </li>
        </ul>
      </section>
    </template>

    <!-- FLASHCARDS -->
    <template v-else-if="tab === 'cards'">
      <div v-if="card" class="flash card" @click="!revealed && reveal()">
        <span class="chip">{{ cardIdx + 1 }} / {{ deck.length }}</span>
        <p class="uz">{{ card.uz }}</p>
        <template v-if="revealed">
          <p class="en-big">{{ card.en }}</p>
          <SpeakButton :text="card.en" :rate="rate" size="md" />
        </template>
        <p v-else class="muted small">Inglizchasini ovoz chiqarib ayting, keyin bosing 👆</p>
      </div>
      <div v-if="card && revealed" class="grid two">
        <button class="btn" @click="answer(false)">🔁 Yana ko'rsat</button>
        <button class="btn primary" @click="answer(true)">✓ Bildim</button>
      </div>
      <div v-if="!card" class="card empty">
        <h2>Tugadi! 🎉</h2>
        <p>Bildim: {{ score.known }} · Qayta: {{ score.again }}</p>
      </div>
      <div class="row">
        <button class="btn sm" @click="resetCards(true)">
          <AppIcon name="shuffle" :size="15" /> Aralashtirib boshlash
        </button>
        <button class="btn sm ghost" @click="resetCards(false)">Qaytadan</button>
      </div>
    </template>

    <!-- PRONUNCIATION -->
    <section v-else class="card">
      <p class="small muted">So'zni bosing — eshiting, keyin 3 marta takrorlang.</p>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>So'z</th>
              <th>Qanday o'qiladi</th>
              <th>Odatiy xato</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in plan.pronunciation" :key="r.word">
              <td class="play-cell"><SpeakButton :text="sayable(r)" :rate="rate" /></td>
              <td>
                <strong>{{ r.word }}</strong>
              </td>
              <td>{{ r.how }}</td>
              <td class="muted wrong">{{ r.mistake }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped>
.rate {
  display: flex;
  align-items: center;
  gap: 8px;
}
.rate .input {
  width: auto;
  min-height: 36px;
  padding: 4px 8px;
}
.week-select {
  max-width: 420px;
}
.shadow-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.shadow-box p {
  margin: 2px 0 0;
}
.phrases {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.phrases li {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  padding: 6px;
  border-radius: 10px;
  transition: background 0.2s;
}
.phrases li.active {
  background: var(--accent-soft);
}
.en {
  font-weight: 500;
}
.flash {
  min-height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
  cursor: pointer;
  user-select: none;
}
.uz {
  font-size: 1.15rem;
  color: var(--muted);
  margin: 0;
}
.en-big {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
}
.play-cell {
  width: 40px;
  padding-right: 0;
}
.wrong {
  text-decoration: line-through;
  text-decoration-color: var(--danger);
}
</style>
