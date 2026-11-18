<script setup>
import { computed, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { algorithms, getPattern } from '@/lib/knowledge'
import { daysForProblem } from '@/lib/curriculum'
import { useProgressStore } from '@/stores/progress'
import SpeakButton from '@/components/SpeakButton.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import AppIcon from '@/components/AppIcon.vue'
import { inlineMd } from '@/lib/inlineMd'

const route = useRoute()
const progress = useProgressStore()

const tab = ref(route.query.tab === 'patterns' ? 'patterns' : 'problems')
const patternFilter = ref(route.query.pattern || '')
const statusFilter = ref('')
const openId = ref(route.query.open || null)
const reveal = ref({}) // { [id]: { hint, approach, solution } }

const { patterns, problems } = algorithms

const status = (id) => progress.data.problems[id] || ''
const stats = computed(() => {
  const s = { solved: 0, unaided: 0, Easy: 0, Medium: 0, Hard: 0 }
  for (const p of problems) {
    const st = status(p.id)
    if (st) {
      s.solved++
      s[p.difficulty]++
    }
    if (st === 'unaided') s.unaided++
  }
  return s
})

const list = computed(() =>
  problems.filter(
    (p) =>
      (!patternFilter.value || p.pattern === patternFilter.value) &&
      (!statusFilter.value ||
        (statusFilter.value === 'todo' ? !status(p.id) : status(p.id) === statusFilter.value)),
  ),
)

function toggleReveal(id, part) {
  reveal.value = {
    ...reveal.value,
    [id]: { ...reveal.value[id], [part]: !reveal.value[id]?.[part] },
  }
}
function setStatus(id, s) {
  progress.setProblem(id, status(id) === s ? '' : s)
}
const diffClass = { Easy: 'success', Medium: 'warn', Hard: 'danger' }
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <p class="eyebrow">{{ problems.length }} masala · {{ patterns.length }} pattern</p>
        <h1>Algoritm masalalari</h1>
      </div>
    </div>

    <div v-if="!problems.length" class="card empty">Masalalar hali yuklanmagan.</div>

    <template v-else>
      <div class="stats">
        <div class="card stat">
          <span class="label">Yechildi</span
          ><strong
            >{{ stats.solved }}<small>/{{ problems.length }}</small></strong
          >
        </div>
        <div class="card stat">
          <span class="label">Yordamsiz</span><strong>{{ stats.unaided }}</strong>
        </div>
        <div class="card stat">
          <span class="label">Easy / Medium</span
          ><strong>{{ stats.Easy }}<small> / </small>{{ stats.Medium }}</strong>
        </div>
      </div>

      <div class="tabs">
        <button :class="{ active: tab === 'problems' }" @click="tab = 'problems'">Masalalar</button>
        <button :class="{ active: tab === 'patterns' }" @click="tab = 'patterns'">
          Pattern'lar
        </button>
      </div>

      <!-- PATTERNS -->
      <template v-if="tab === 'patterns'">
        <section v-for="pt in patterns" :key="pt.id" class="card pattern">
          <div class="row">
            <h3>{{ pt.title }}</h3>
            <span class="spacer" />
            <button class="btn sm" @click="((patternFilter = pt.id), (tab = 'problems'))">
              Masalalar ({{ problems.filter((p) => p.pattern === pt.id).length }}) →
            </button>
          </div>
          <p v-html="inlineMd(pt.summary)" />
          <p class="small"><b>Qachon:</b> {{ pt.whenToUse }}</p>
          <div class="say">
            <span class="small"><b>Interview'da ayting:</b></span>
            <p>"{{ pt.sayIt }}" <SpeakButton :text="pt.sayIt" /></p>
          </div>
          <CodeBlock v-if="pt.template" :code="pt.template" />
        </section>
      </template>

      <!-- PROBLEMS -->
      <template v-else>
        <div class="filters">
          <select v-model="patternFilter" class="input">
            <option value="">Barcha pattern'lar</option>
            <option v-for="pt in patterns" :key="pt.id" :value="pt.id">{{ pt.title }}</option>
          </select>
          <select v-model="statusFilter" class="input">
            <option value="">Hammasi</option>
            <option value="todo">Yechilmagan</option>
            <option value="solved">Yordam bilan yechilgan</option>
            <option value="unaided">Yordamsiz yechilgan</option>
          </select>
        </div>

        <article v-for="p in list" :key="p.id" class="card problem" :class="status(p.id)">
          <header @click="openId = openId === p.id ? null : p.id">
            <span class="tick">{{
              status(p.id) === 'unaided' ? '★' : status(p.id) ? '✓' : ''
            }}</span>
            <div class="ptitle">
              <strong>{{ p.title }}</strong>
              <div class="row meta">
                <span class="chip" :class="diffClass[p.difficulty]">{{ p.difficulty }}</span>
                <span class="chip">{{ getPattern(p.pattern)?.title || p.pattern }}</span>
                <span v-if="daysForProblem(p.id).length" class="small muted"
                  >Kun {{ daysForProblem(p.id).join(', ') }}</span
                >
              </div>
            </div>
            <AppIcon
              :name="openId === p.id ? 'chevronLeft' : 'chevronRight'"
              :size="16"
              class="muted chev"
            />
          </header>

          <div v-if="openId === p.id" class="pbody">
            <p v-html="inlineMd(p.task)" />
            <div class="row">
              <a :href="p.url" target="_blank" rel="noopener" class="btn sm primary">
                LeetCode'da ochish <AppIcon name="external" :size="14" />
              </a>
            </div>

            <div class="step">
              <button class="btn sm" @click="toggleReveal(p.id, 'hint')">💡 Maslahat</button>
              <p v-if="reveal[p.id]?.hint" class="reveal" v-html="inlineMd(p.hint)" />
            </div>
            <div class="step">
              <button class="btn sm" @click="toggleReveal(p.id, 'approach')">
                🗣 Inglizcha tushuntirish
              </button>
              <div v-if="reveal[p.id]?.approach" class="reveal">
                <p>{{ p.approach }} <SpeakButton :text="p.approach" /></p>
                <p class="small">
                  <b>Complexity:</b> time {{ p.complexity?.time }}, space {{ p.complexity?.space }}
                </p>
                <p v-if="p.edgeCases?.length" class="small">
                  <b>Edge cases:</b> {{ p.edgeCases.join(' · ') }}
                </p>
              </div>
            </div>
            <div class="step">
              <button class="btn sm" @click="toggleReveal(p.id, 'solution')">🔓 Yechim</button>
              <CodeBlock v-if="reveal[p.id]?.solution" :code="p.solution" />
            </div>

            <div class="row status-row">
              <span class="small muted">Natija:</span>
              <button
                class="btn sm"
                :class="{ active: status(p.id) === 'solved' }"
                @click="setStatus(p.id, 'solved')"
              >
                ✓ Yordam bilan
              </button>
              <button
                class="btn sm"
                :class="{ active: status(p.id) === 'unaided' }"
                @click="setStatus(p.id, 'unaided')"
              >
                ★ Yordamsiz
              </button>
            </div>
          </div>
        </article>
        <p v-if="!list.length" class="card empty">Bu filtrda masala yo'q.</p>
      </template>
    </template>

    <p class="small muted">
      Maslahat: avval 20–25 daqiqa o'zingiz urinib ko'ring, ovoz chiqarib. Keyin maslahatni, oxirida
      yechimni oching.
      <RouterLink to="/reference">Live coding shabloni →</RouterLink>
    </p>
  </div>
</template>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
}
.stat .label {
  font-size: 0.75rem;
  color: var(--muted);
  font-weight: 600;
}
.stat strong {
  font-size: 1.4rem;
}
.stat small {
  font-size: 0.85rem;
  color: var(--faint);
}
.filters {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.pattern {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.pattern h3,
.pattern p {
  margin: 0;
}
.say {
  background: var(--accent-soft);
  padding: 10px 12px;
  border-radius: var(--radius-sm);
}
.say p {
  margin: 2px 0 0;
}
.problem {
  padding: 0;
}
.problem.solved {
  border-color: color-mix(in srgb, var(--success) 35%, var(--border));
}
.problem.unaided {
  border-color: var(--success);
}
.problem header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  cursor: pointer;
}
.tick {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: 8px;
  border: 2px solid var(--border);
  display: grid;
  place-items: center;
  font-weight: 800;
  color: #fff;
}
.solved .tick,
.unaided .tick {
  background: var(--success);
  border-color: var(--success);
}
.ptitle {
  flex: 1;
  min-width: 0;
}
.meta {
  gap: 6px;
  margin-top: 4px;
}
.chip.danger {
  background: var(--danger-soft);
  color: var(--danger);
}
.pbody {
  padding: 0 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.pbody p {
  margin: 0;
}
.step {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
.step .codeblock {
  width: 100%;
}
.reveal {
  width: 100%;
  background: var(--surface-2);
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.status-row .btn.active {
  background: var(--success-soft);
  border-color: var(--success);
  color: var(--success);
}
</style>
