// Text-to-speech (listen to phrases) and speech recognition (live transcript) helpers.

let voicesCache = []

function loadVoices() {
  if (!('speechSynthesis' in window)) return []
  voicesCache = window.speechSynthesis.getVoices()
  return voicesCache
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices()
  window.speechSynthesis.onvoiceschanged = loadVoices
}

export const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

function pickVoice(lang) {
  const voices = voicesCache.length ? voicesCache : loadVoices()
  const pref = [`${lang}`, 'en-US', 'en-GB']
  for (const p of pref) {
    const natural = voices.find((v) => v.lang === p && /natural|google|samantha|daniel/i.test(v.name))
    if (natural) return natural
    const any = voices.find((v) => v.lang === p)
    if (any) return any
  }
  return voices.find((v) => v.lang?.startsWith('en')) || null
}

export function speak(text, { rate = 0.9, lang = 'en-US', onend } = {}) {
  if (!ttsSupported) return
  window.speechSynthesis.cancel()
  // "..." placeholders sound odd when read out — turn them into a short pause.
  const clean = text
    .replace(/[`*]/g, '')
    .replace(/\.\.\./g, ',')
    .replace(/\s+/g, ' ')
    .trim()
  const u = new SpeechSynthesisUtterance(clean)
  u.lang = lang
  u.rate = rate
  const v = pickVoice(lang)
  if (v) u.voice = v
  if (onend) u.onend = onend
  window.speechSynthesis.speak(u)
}

export function stopSpeaking() {
  if (ttsSupported) window.speechSynthesis.cancel()
}

const Recognition =
  typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null

export const recognitionSupported = Boolean(Recognition)

export function createRecognizer({ onText, onEnd, lang = 'en-US' }) {
  if (!Recognition) return null
  const r = new Recognition()
  r.lang = lang
  r.continuous = true
  r.interimResults = true
  let finalText = ''
  let stopped = false
  r.onresult = (e) => {
    let interim = ''
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const t = e.results[i][0].transcript
      if (e.results[i].isFinal) finalText += t + ' '
      else interim += t
    }
    onText(finalText, interim)
  }
  // Mobile browsers end recognition after silence — restart until the user stops.
  r.onend = () => {
    if (!stopped) {
      try {
        r.start()
        return
      } catch {
        /* already started */
      }
    }
    onEnd?.(finalText)
  }
  r.onerror = (e) => {
    if (e.error === 'not-allowed' || e.error === 'service-not-allowed') stopped = true
  }
  return {
    start() {
      stopped = false
      finalText = ''
      r.start()
    },
    stop() {
      stopped = true
      r.stop()
    },
  }
}

const FILLERS = ['um', 'uh', 'erm', 'hmm', 'like', 'you know', 'actually', 'basically']

export function analyzeTranscript(text, seconds) {
  const words = text.toLowerCase().match(/[a-z']+/g) || []
  const minutes = seconds / 60
  const wpm = minutes > 0 ? Math.round(words.length / minutes) : 0
  const joined = ' ' + words.join(' ') + ' '
  const fillers = {}
  for (const f of FILLERS) {
    const count = joined.split(` ${f} `).length - 1
    if (count) fillers[f] = count
  }
  return { words: words.length, wpm, fillers }
}
