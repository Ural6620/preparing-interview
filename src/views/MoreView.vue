<script setup>
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppIcon from '@/components/AppIcon.vue'
import AiSettings from '@/components/AiSettings.vue'

const auth = useAuthStore()
const items = [
  {
    to: '/problems',
    icon: 'code',
    title: 'Algoritm masalalari',
    text: 'LeetCode, pattern, yechim',
  },
  {
    to: '/practice',
    icon: 'target',
    title: 'Mock interview',
    text: 'Tasodifiy savollar, namuna javob',
  },
  { to: '/phrases', icon: 'chat', title: 'Iboralar', text: 'Shadowing, flashcards, talaffuz' },
  { to: '/notebook', icon: 'notebook', title: 'Daftar', text: 'Xatolar, Q&A bank, audio jurnal' },
  {
    to: '/plan#assessment',
    icon: 'chart',
    title: "O'z-o'zini baholash",
    text: "5 soha bo'yicha o'sish",
  },
  { to: '/reference', icon: 'book', title: "Ma'lumotnoma", text: 'Shablonlar, resurslar, akkaunt' },
]
</script>

<template>
  <div class="page">
    <div class="page-head">
      <h1>Yana</h1>
    </div>
    <div class="grid two">
      <RouterLink v-for="i in items" :key="i.to" :to="i.to" class="card item">
        <span class="ico"><AppIcon :name="i.icon" :size="22" /></span>
        <span>
          <strong>{{ i.title }}</strong>
          <small class="muted">{{ i.text }}</small>
        </span>
      </RouterLink>
    </div>
    <section class="card">
      <h3>AI tekshiruv</h3>
      <p class="small muted">Vazifalarni AI tekshiradi: o'tdingiz yoki qaytadan qiling.</p>
      <AiSettings />
    </section>
    <div v-if="auth.user" class="card row account">
      <img v-if="auth.user.photo" :src="auth.user.photo" alt="" referrerpolicy="no-referrer" />
      <div class="who">
        <strong>{{ auth.user.name }}</strong>
        <small class="muted">{{ auth.user.email }}</small>
      </div>
      <button class="btn sm" @click="auth.logout()">
        <AppIcon name="logout" :size="16" /> Chiqish
      </button>
    </div>
  </div>
</template>

<style scoped>
.item {
  display: flex;
  align-items: center;
  gap: 14px;
  color: var(--text);
  text-decoration: none;
}
.item small {
  display: block;
}
.ico {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: var(--accent-soft);
  color: var(--accent);
  flex-shrink: 0;
}
.account img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.who {
  flex: 1;
  min-width: 0;
}
.who small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
