<script setup>
import { useAuthStore } from '@/stores/auth'
import { plan } from '@/lib/plan'

const auth = useAuthStore()
const features = [
  ['📅', '90 kunlik reja', "Har kuni 4 ta vazifa — sayt qayerda to'xtaganingizni eslab qoladi"],
  ['🗣️', 'Gapirish mashqi', "Ovoz yozish, jonli transkript, so'z/daqiqa va filler so'zlar"],
  ['🔊', 'Iboralar + talaffuz', `${plan.phrases.length} ta tayyor ibora, eshitib takrorlash`],
  ['📱', 'Telefon va kompyuter', 'Google akkaunt orqali hamma qurilmada bir xil progress'],
]
</script>

<template>
  <div class="login">
    <div class="box">
      <div class="logo">IP</div>
      <h1>Interview Prep</h1>
      <p class="muted lead">
        Full-stack interview'ga 90 kunda tayyorlanish: ingliz tilida gapirish + texnik bilim.
      </p>

      <button class="btn primary google" :disabled="auth.busy" @click="auth.login()">
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
          <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
          <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
        </svg>
        {{ auth.busy ? 'Kutilmoqda…' : 'Google bilan kirish' }}
      </button>
      <p v-if="auth.error" class="error">{{ auth.error }}</p>

      <ul class="features">
        <li v-for="[emoji, title, text] in features" :key="title">
          <span class="emoji">{{ emoji }}</span>
          <span>
            <strong>{{ title }}</strong>
            <small>{{ text }}</small>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.login {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px 16px;
}
.box {
  width: 100%;
  max-width: 420px;
  text-align: center;
}
.logo {
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: var(--accent);
  color: var(--accent-text);
  font-weight: 800;
  font-size: 1.2rem;
}
.lead {
  margin-bottom: 24px;
}
.google {
  width: 100%;
  min-height: 50px;
  font-size: 1rem;
}
.error {
  margin-top: 12px;
  color: var(--danger);
  font-size: 0.9rem;
}
.features {
  list-style: none;
  padding: 0;
  margin: 28px 0 0;
  display: grid;
  gap: 10px;
  text-align: left;
}
.features li {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  background: var(--surface);
  border: 1px solid var(--border);
}
.emoji {
  font-size: 1.3rem;
  line-height: 1.2;
}
.features strong {
  display: block;
  font-size: 0.95rem;
}
.features small {
  color: var(--muted);
}
</style>
