import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore'

const envConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const isComplete = (c) => Boolean(c?.apiKey && c?.projectId && c?.appId)

// 1) .env.local (local dev)  2) Firebase Hosting serves the project's config at this URL,
// so a deployed site needs no env vars at all.  3) Neither → "local mode" (no login,
// progress kept in this browser only).
async function loadConfig() {
  if (isComplete(envConfig)) return envConfig
  try {
    const res = await fetch('/__/firebase/init.json')
    if (!res.headers.get('content-type')?.includes('json')) return null // dev server SPA fallback
    const c = await res.json()
    return isComplete(c) ? c : null
  } catch {
    return null
  }
}

const config = await loadConfig()

export const firebaseEnabled = Boolean(config)

export const app = config ? initializeApp(config) : null
export const auth = app ? getAuth(app) : null
// Persistent cache: the app keeps working offline on the phone and syncs when back online.
export const db = app
  ? initializeFirestore(app, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
    })
  : null
export const googleProvider = app ? new GoogleAuthProvider() : null
googleProvider?.setCustomParameters({ prompt: 'select_account' })
