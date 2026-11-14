<script setup>
import { ref } from 'vue'
import { speak, stopSpeaking, ttsSupported } from '@/lib/speech'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  text: { type: String, required: true },
  rate: { type: Number, default: 0.9 },
  size: { type: String, default: 'sm' },
})

const playing = ref(false)

function toggle() {
  if (playing.value) {
    stopSpeaking()
    playing.value = false
    return
  }
  playing.value = true
  speak(props.text, { rate: props.rate, onend: () => (playing.value = false) })
}
</script>

<template>
  <button
    v-if="ttsSupported"
    type="button"
    class="btn icon ghost speak"
    :class="[size, { playing }]"
    :title="playing ? 'To\'xtatish' : 'Eshitish'"
    @click.stop="toggle"
  >
    <AppIcon :name="playing ? 'stop' : 'volume'" :size="size === 'sm' ? 17 : 20" />
  </button>
</template>

<style scoped>
.speak {
  color: var(--accent);
  flex-shrink: 0;
}
.speak.playing {
  background: var(--accent-soft);
}
</style>
