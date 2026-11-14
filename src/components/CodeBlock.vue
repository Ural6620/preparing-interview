<script setup>
import { ref } from 'vue'

const props = defineProps({ code: { type: String, required: true } })
const copied = ref(false)

// Short single-line "examples" are sentences, not code
const isCode = /[{}();=<>]|\n/.test(props.code)

async function copy() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    /* clipboard blocked */
  }
}
</script>

<template>
  <div v-if="isCode" class="codeblock">
    <button class="copy" type="button" @click="copy">{{ copied ? '✓' : 'Copy' }}</button>
    <pre><code>{{ code }}</code></pre>
  </div>
  <p v-else class="example-text">{{ code }}</p>
</template>

<style scoped>
.codeblock {
  position: relative;
}
pre {
  margin: 0;
  background: var(--surface-2);
  border: 1px solid var(--border);
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  overflow-x: auto;
  font-size: 0.82rem;
  line-height: 1.5;
}
code {
  background: none;
  padding: 0;
  font-size: inherit;
}
.copy {
  position: absolute;
  top: 6px;
  right: 6px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--muted);
  border-radius: 6px;
  font-size: 0.72rem;
  padding: 2px 8px;
  cursor: pointer;
}
.example-text {
  margin: 0;
  font-style: italic;
  color: var(--muted);
}
</style>
