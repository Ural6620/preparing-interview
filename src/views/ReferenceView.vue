<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import { RouterLink } from 'vue-router'
import { plan } from '@/lib/plan'
import { speak, ttsSupported } from '@/lib/speech'
import { useAuthStore } from '@/stores/auth'
import { useProgressStore } from '@/stores/progress'

const auth = useAuthStore()
const progress = useProgressStore()

// Trackers (mistakes, progress, audio journal) are interactive pages elsewhere in the app
const HIDDEN = /Xato daftari|Progress tracker|Texnik talaffuz/i

const sections = computed(() =>
  plan.reference
    .filter((s) => !HIDDEN.test(s.title))
    .map((s) => ({ ...s, html: marked.parse(s.md) })),
)

// Tap any italic English sentence (templates) to hear it
function onClick(e) {
  const em = e.target.closest('em')
  if (em && ttsSupported) speak(em.textContent.replace(/\[[^\]]*\]/g, '…'))
}

function reset() {
  if (confirm("Barcha progress, daftar va jurnal o'chiriladi. Ishonchingiz komilmi?")) progress.resetAll()
}
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <p class="eyebrow">Shablonlar, resurslar, maqsadlar</p>
        <h1>Ma'lumotnoma</h1>
      </div>
    </div>

    <nav class="toc row">
      <a v-for="s in sections" :key="s.title" :href="`#${encodeURIComponent(s.title)}`" class="chip">{{ s.title }}</a>
      <RouterLink :to="{ path: '/phrases', query: { tab: 'pron' } }" class="chip accent">Texnik talaffuz →</RouterLink>
    </nav>

    <p v-if="ttsSupported" class="small muted">💡 Kursiv inglizcha jumlalarni bosing — ovoz chiqarib o'qib beradi.</p>

    <section v-for="s in sections" :id="encodeURIComponent(s.title)" :key="s.title" class="card">
      <h2>{{ s.title }}</h2>
      <!-- content comes from our own plan.md -->
      <div class="md" @click="onClick" v-html="s.html" />
    </section>

    <section class="card account">
      <h2>Akkaunt</h2>
      <p v-if="auth.user" class="small muted">
        {{ auth.user.name }} · {{ auth.user.email }} — progress Google akkauntingizga bog'langan va
        barcha qurilmalarda sinxronlanadi.
      </p>
      <p v-else class="small muted">Lokal rejim: progress faqat shu brauzerda saqlanadi.</p>
      <div class="row">
        <button v-if="auth.user" class="btn" @click="auth.logout()">Chiqish</button>
        <button class="btn danger" @click="reset">Progressni nolga tushirish</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.toc {
  gap: 6px;
}
.toc .chip {
  text-decoration: none;
}
.md :deep(em) {
  cursor: pointer;
  border-bottom: 1px dashed var(--accent);
}
.md :deep(em:hover) {
  color: var(--accent);
}
section {
  scroll-margin-top: 70px;
}
</style>
