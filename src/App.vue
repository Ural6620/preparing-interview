<script setup>
import { watch } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProgressStore } from '@/stores/progress'
import AppIcon from '@/components/AppIcon.vue'
import LoginScreen from '@/components/LoginScreen.vue'

const auth = useAuthStore()
const progress = useProgressStore()

watch(
  () => [auth.ready, auth.user?.uid],
  () => {
    if (auth.ready) progress.bind(auth.user)
  },
  { immediate: true },
)

function confirmLogout() {
  if (confirm(`${auth.user.email} — akkauntdan chiqasizmi?`)) auth.logout()
}

const nav = [
  { to: '/', label: 'Bugun', icon: 'home' },
  { to: '/plan', label: 'Reja', icon: 'calendar' },
  { to: '/learn', label: 'Bilim', icon: 'cap' },
  { to: '/problems', label: 'Masalalar', icon: 'code', desktopOnly: true },
  { to: '/practice', label: 'Mock interview', icon: 'target', desktopOnly: true },
  { to: '/speak', label: 'Gapirish', icon: 'mic' },
  { to: '/phrases', label: 'Iboralar', icon: 'chat', desktopOnly: true },
  { to: '/notebook', label: 'Daftar', icon: 'notebook', desktopOnly: true },
  { to: '/reference', label: "Ma'lumot", icon: 'book', desktopOnly: true },
  { to: '/more', label: 'Yana', icon: 'grid', mobileOnly: true },
]
</script>

<template>
  <div v-if="!auth.ready" class="splash">
    <div class="spinner" />
  </div>

  <LoginScreen v-else-if="!auth.canUse" />

  <div v-else class="shell">
    <aside class="sidebar">
      <RouterLink to="/" class="brand">
        <span class="logo">IP</span>
        <span>
          <strong>Interview Prep</strong>
          <small>Har kuni 1 soha · EN + UZ</small>
        </span>
      </RouterLink>
      <nav>
        <RouterLink
          v-for="item in nav.filter((n) => !n.mobileOnly)"
          :key="item.to"
          :to="item.to"
          class="side-link"
          :class="{ exact: item.to === '/' }"
        >
          <AppIcon :name="item.icon" />
          {{ item.label }}
        </RouterLink>
      </nav>
      <div class="side-user">
        <template v-if="auth.user">
          <img v-if="auth.user.photo" :src="auth.user.photo" alt="" referrerpolicy="no-referrer" />
          <div class="who">
            <strong>{{ auth.user.name }}</strong>
            <small>{{ auth.user.email }}</small>
          </div>
          <button class="btn icon sm ghost" title="Chiqish" @click="auth.logout()">
            <AppIcon name="logout" :size="18" />
          </button>
        </template>
        <small v-else class="muted">Lokal rejim — progress shu brauzerda saqlanadi</small>
      </div>
    </aside>

    <header class="topbar">
      <RouterLink to="/" class="brand">
        <span class="logo">IP</span>
        <strong>Interview Prep</strong>
      </RouterLink>
      <div class="row">
        <RouterLink to="/reference" class="btn icon sm ghost" title="Ma'lumotnoma">
          <AppIcon name="book" :size="18" />
        </RouterLink>
        <button v-if="auth.user" class="avatar-btn" title="Chiqish" @click="confirmLogout">
          <img
            v-if="auth.user.photo"
            :src="auth.user.photo"
            alt="Chiqish"
            referrerpolicy="no-referrer"
          />
          <AppIcon v-else name="logout" :size="18" />
        </button>
      </div>
    </header>

    <main class="content">
      <p v-if="progress.syncError" class="sync-error">
        Sinxronlashda xato: {{ progress.syncError }}
      </p>
      <div v-if="!progress.loaded" class="splash inline"><div class="spinner" /></div>
      <RouterView v-else />
    </main>

    <nav class="bottom-nav">
      <RouterLink
        v-for="item in nav.filter((n) => !n.desktopOnly)"
        :key="item.to"
        :to="item.to"
        class="bottom-link"
        :class="{ exact: item.to === '/' }"
      >
        <AppIcon :name="item.icon" :size="22" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.splash {
  min-height: 100vh;
  display: grid;
  place-items: center;
}
.splash.inline {
  min-height: 40vh;
}
.spinner {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.shell {
  min-height: 100vh;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text);
  text-decoration: none;
}
.brand small {
  display: block;
  color: var(--muted);
  font-size: 0.75rem;
}
.logo {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: var(--accent);
  color: var(--accent-text);
  font-weight: 800;
  font-size: 0.85rem;
  flex-shrink: 0;
}

/* ---- mobile first ---- */
.sidebar {
  display: none;
}
.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  padding-top: max(10px, env(safe-area-inset-top));
  background: color-mix(in srgb, var(--bg) 88%, transparent);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}
.avatar-btn {
  border: 0;
  padding: 0;
  background: none;
  cursor: pointer;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
}
.avatar-btn img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.content {
  padding: 16px 16px calc(var(--nav-h) + 24px + env(safe-area-inset-bottom));
  max-width: 920px;
  margin: 0 auto;
}

.sync-error {
  background: var(--danger-soft);
  color: var(--danger);
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
}

.bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  height: calc(var(--nav-h) + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  background: var(--surface);
  border-top: 1px solid var(--border);
}
.bottom-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  color: var(--faint);
  text-decoration: none;
  font-size: 0.7rem;
  font-weight: 600;
  -webkit-tap-highlight-color: transparent;
}
.bottom-link.router-link-active:not(.exact),
.bottom-link.exact.router-link-exact-active {
  color: var(--accent);
}

/* ---- desktop ---- */
@media (min-width: 900px) {
  .shell {
    display: grid;
    grid-template-columns: 250px 1fr;
  }
  .topbar,
  .bottom-nav {
    display: none;
  }
  .sidebar {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 22px 14px;
    border-right: 1px solid var(--border);
    background: var(--surface);
  }
  .sidebar nav {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .side-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 10px;
    color: var(--muted);
    text-decoration: none;
    font-weight: 600;
  }
  .side-link:hover {
    background: var(--surface-2);
    color: var(--text);
  }
  .side-link.router-link-active:not(.exact),
  .side-link.exact.router-link-exact-active {
    background: var(--accent-soft);
    color: var(--accent);
  }
  .side-user {
    margin-top: auto;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border-radius: 12px;
    background: var(--surface-2);
    min-width: 0;
  }
  .side-user img {
    width: 34px;
    height: 34px;
    border-radius: 50%;
  }
  .side-user .who {
    min-width: 0;
    flex: 1;
    line-height: 1.25;
  }
  .side-user .who strong,
  .side-user .who small {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.85rem;
  }
  .side-user .who small {
    color: var(--muted);
    font-size: 0.75rem;
  }
  .content {
    padding: 32px 32px 48px;
    width: 100%;
  }
}
</style>
