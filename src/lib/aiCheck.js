import Anthropic from '@anthropic-ai/sdk'
import { reactive, watch } from 'vue'
import { app, auth, firebaseEnabled } from '@/lib/firebase'

// Default: Gemini through Firebase AI Logic — free, no key, works for anyone
// signed in with Google. Optional: a user's own Claude / ChatGPT key, kept only
// in this browser (localStorage) — never written to Firestore.
const KEY = 'interview-prep:ai'

/** Free Gemini checks per user per day (soft limit, counted in the progress doc). */
export const DAILY_FREE_LIMIT = 30

export const PROVIDERS = {
  gemini: {
    label: 'Gemini — bepul',
    defaultModel: 'gemini-3.8-flash',
    free: true,
  },
  claude: {
    label: 'Claude (Anthropic)',
    defaultModel: 'claude-opus-5-5',
    keyHint: 'sk-ant-...',
    keyUrl: 'https://console.anthropic.com/settings/keys',
  },
  openai: {
    label: 'ChatGPT (OpenAI)',
    defaultModel: 'gpt-5-mini',
    keyHint: 'sk-...',
    keyUrl: 'https://platform.openai.com/api-keys',
  },
}

function load() {
  const defaults = { provider: firebaseEnabled ? 'gemini' : 'claude', apiKey: '', model: '' }
  let saved = {}
  try {
    saved = JSON.parse(localStorage.getItem(KEY) || '{}')
  } catch {
    /* storage blocked */
  }
  const s = { ...defaults, ...saved }
  if (!PROVIDERS[s.provider]) s.provider = defaults.provider
  // a paid provider picked earlier but never given a key → use the free one
  if (firebaseEnabled && s.provider !== 'gemini' && !s.apiKey) s.provider = 'gemini'
  return s
}

export const aiSettings = reactive(load())
watch(aiSettings, (v) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(v))
  } catch {
    /* storage blocked — settings live for this session only */
  }
})

export const isFree = () => aiSettings.provider === 'gemini'

export const aiReady = () =>
  isFree() ? Boolean(firebaseEnabled && auth?.currentUser) : Boolean(aiSettings.apiKey.trim())
const modelOf = () => aiSettings.model.trim() || PROVIDERS[aiSettings.provider].defaultModel

const SYSTEM = `You are a strict but kind mentor checking homework for a full-stack developer preparing for English-language technical interviews. The student's English level is A2–B1.

You get one task from their study plan and the student's submission (text, code, or a transcript of what they said).

Decide whether the submission really completes the task:
- passed = true only if the submission addresses what the task asks, with no serious technical mistakes, and is a genuine attempt of reasonable size.
- passed = false if it is off-topic, much too short, technically wrong in an important way, or misses a required part of the task.
- Grammar mistakes alone are not a reason to fail, but list the important ones.

Write "feedback" and "todo" in Uzbek (Latin script), simple and short. Write "corrections" as English sentences: the student's wrong sentence → corrected version.`

const SCHEMA = {
  type: 'object',
  properties: {
    passed: { type: 'boolean' },
    score: { type: 'integer', description: '0-100' },
    feedback: {
      type: 'string',
      description: 'Uzbek: 2-4 sentences on what is good and what is wrong',
    },
    todo: {
      type: 'string',
      description: 'Uzbek: what exactly to redo/fix if not passed; empty string if passed',
    },
    corrections: {
      type: 'array',
      items: { type: 'string' },
      description: 'English grammar fixes, max 5',
    },
  },
  required: ['passed', 'score', 'feedback', 'todo', 'corrections'],
  additionalProperties: false,
}

// Models that accept server-side refusal fallbacks
const FALLBACK_MODELS = [
  'claude-fable-5-2',
  'claude-fable-5-1',
  'claude-opus-5-5',
  'claude-opus-5',
  'claude-sonnet-5-5',
]

// ---------- Gemini via Firebase AI Logic (free tier, no key) ----------
let aiInstance = null
async function getAi() {
  if (aiInstance) return aiInstance
  // AI Logic requires App Check: the site proves requests come from this app.
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY
  if (siteKey) {
    const { initializeAppCheck, ReCaptchaEnterpriseProvider } = await import('firebase/app-check')
    // local dev: prints a debug token to the console — register it in Firebase → App Check
    if (import.meta.env.DEV) self.FIREBASE_APPCHECK_DEBUG_TOKEN = true
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(siteKey),
      isTokenAutoRefreshEnabled: true,
    })
  }
  const { getAI, GoogleAIBackend } = await import('firebase/ai')
  aiInstance = getAI(app, { backend: new GoogleAIBackend() })
  return aiInstance
}

// Gemini's JSON Schema subset: same shape, without the OpenAI-only strictness flag
const { additionalProperties: _strict, ...GEMINI_SCHEMA } = SCHEMA

async function askGemini(userText) {
  const ai = await getAi()
  const { getGenerativeModel } = await import('firebase/ai')
  const model = getGenerativeModel(ai, {
    model: modelOf(),
    systemInstruction: SYSTEM,
    generationConfig: { responseMimeType: 'application/json', responseJsonSchema: GEMINI_SCHEMA },
  })
  let text
  try {
    const result = await model.generateContent(userText)
    text = result.response.text()
  } catch (e) {
    const status = e?.customErrorData?.status
    if (e?.code === 'api-not-enabled')
      throw new Error("Firebase'da AI Logic yoqilmagan (sayt egasi sozlashi kerak).", { cause: e })
    if (status === 429)
      throw new Error("Bepul limit hozircha tugadi — birozdan so'ng qayta urinib ko'ring.", {
        cause: e,
      })
    if (status === 401 || status === 403)
      throw new Error("AI'ga ruxsat berilmadi (App Check sozlamasini tekshiring).", { cause: e })
    if (e?.code === 'fetch-error' && !status)
      throw new Error("Internet aloqasi yo'q.", { cause: e })
    if (e?.code === 'response-error')
      throw new Error('AI bu javobni tekshirishdan bosh tortdi.', { cause: e })
    throw new Error(`Gemini xatosi: ${e?.message || e}`, { cause: e })
  }
  if (!text) throw new Error("AI bo'sh javob qaytardi.")
  return JSON.parse(text)
}

async function askClaude(userText) {
  const client = new Anthropic({ apiKey: aiSettings.apiKey.trim(), dangerouslyAllowBrowser: true })
  const model = modelOf()
  const params = {
    model,
    max_tokens: 16000,
    system: SYSTEM,
    messages: [{ role: 'user', content: userText }],
    output_config: { format: { type: 'json_schema', schema: SCHEMA } },
  }
  let res
  try {
    res = FALLBACK_MODELS.includes(model)
      ? await client.beta.messages.create({
          ...params,
          betas: ['server-side-fallback-2026-07-01'],
          fallbacks: 'default',
        })
      : await client.messages.create(params)
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError)
      throw new Error("API kalit noto'g'ri. Sozlamalarni tekshiring.", { cause: e })
    if (e instanceof Anthropic.PermissionDeniedError)
      throw new Error("Bu kalitga ruxsat yo'q (balans yoki model ruxsati).", { cause: e })
    if (e instanceof Anthropic.NotFoundError)
      throw new Error(`"${model}" modeli topilmadi.`, { cause: e })
    if (e instanceof Anthropic.RateLimitError)
      throw new Error("Limit tugadi — birozdan so'ng qayta urinib ko'ring.", { cause: e })
    if (e instanceof Anthropic.APIConnectionError)
      throw new Error("Internet aloqasi yo'q.", { cause: e })
    if (e instanceof Anthropic.APIError)
      throw new Error(`Claude xatosi (${e.status}): ${e.message}`, { cause: e })
    throw e
  }
  if (res.stop_reason === 'refusal') throw new Error('AI bu javobni tekshirishdan bosh tortdi.')
  const text = res.content.find((b) => b.type === 'text')?.text
  if (!text) throw new Error("AI bo'sh javob qaytardi.")
  return JSON.parse(text)
}

async function askOpenAI(userText) {
  let res
  try {
    res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${aiSettings.apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: modelOf(),
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: userText },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: { name: 'check', strict: true, schema: SCHEMA },
        },
      }),
    })
  } catch {
    throw new Error("Internet aloqasi yo'q.")
  }
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (res.status === 401) throw new Error("API kalit noto'g'ri. Sozlamalarni tekshiring.")
    if (res.status === 429)
      throw new Error('Limit yoki balans tugadi — OpenAI hisobingizni tekshiring.')
    throw new Error(`ChatGPT xatosi (${res.status}): ${body.error?.message || res.statusText}`)
  }
  const msg = body.choices?.[0]?.message
  if (msg?.refusal) throw new Error('AI bu javobni tekshirishdan bosh tortdi.')
  if (!msg?.content) throw new Error("AI bo'sh javob qaytardi.")
  return JSON.parse(msg.content)
}

/**
 * Check a submission for one plan task.
 * @returns {Promise<{passed:boolean, score:number, feedback:string, todo:string, corrections:string[]}>}
 */
export async function checkTask({ day, task, answer }) {
  if (!aiReady())
    throw new Error(
      isFree() ? 'Bepul AI uchun Google akkaunt bilan kiring.' : 'Avval AI kalitini ulang.',
    )
  const clean = (s) => s.replace(/<[^>]+>/g, '').replace(/\*\*/g, '')
  const userText = `Day ${day} task — ${clean(task.title)}${task.minutes ? ` (${task.minutes} min)` : ''}:
${clean(task.text)}

Student's submission:
"""
${answer}
"""`
  const ask = { gemini: askGemini, openai: askOpenAI, claude: askClaude }[aiSettings.provider]
  const out = await ask(userText)
  return {
    passed: Boolean(out.passed),
    score: Number(out.score) || 0,
    feedback: String(out.feedback || ''),
    todo: String(out.todo || ''),
    corrections: Array.isArray(out.corrections) ? out.corrections.map(String) : [],
  }
}
