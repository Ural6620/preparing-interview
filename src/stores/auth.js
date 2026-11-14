import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from 'firebase/auth'
import { auth, googleProvider, firebaseEnabled } from '@/lib/firebase'

const ERRORS = {
  'auth/unauthorized-domain':
    "Bu domen Firebase'da ruxsat etilmagan. Firebase → Authentication → Settings → Authorized domains ga qo'shing.",
  'auth/network-request-failed': "Internet aloqasi yo'q. Qayta urinib ko'ring.",
  'auth/popup-closed-by-user': '',
  'auth/cancelled-popup-request': '',
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const ready = ref(!firebaseEnabled)
  const error = ref('')
  const busy = ref(false)

  const isLocal = !firebaseEnabled
  const canUse = computed(() => isLocal || Boolean(user.value))

  function setError(e) {
    const msg = ERRORS[e?.code]
    error.value = msg === undefined ? e?.message || String(e) : msg
  }

  if (firebaseEnabled) {
    getRedirectResult(auth).catch(setError)
    onAuthStateChanged(auth, (u) => {
      user.value = u
        ? { uid: u.uid, name: u.displayName, email: u.email, photo: u.photoURL }
        : null
      ready.value = true
    })
  }

  async function login() {
    if (!firebaseEnabled) return
    error.value = ''
    busy.value = true
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (e) {
      // Some in-app browsers (Telegram, Instagram) block popups — fall back to redirect.
      if (
        e?.code === 'auth/popup-blocked' ||
        e?.code === 'auth/operation-not-supported-in-this-environment'
      ) {
        await signInWithRedirect(auth, googleProvider)
        return
      }
      setError(e)
    } finally {
      busy.value = false
    }
  }

  async function logout() {
    if (firebaseEnabled) await signOut(auth)
  }

  return { user, ready, error, busy, isLocal, canUse, login, logout }
})
