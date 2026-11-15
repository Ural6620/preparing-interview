<script setup>
import { ref } from 'vue'
import { aiSettings, PROVIDERS, DAILY_FREE_LIMIT, isFree } from '@/lib/aiCheck'
import { firebaseEnabled } from '@/lib/firebase'
import { useProgressStore } from '@/stores/progress'

const show = ref(false)
const progress = useProgressStore()
</script>

<template>
  <div class="ai-settings">
    <div class="providers">
      <label
        v-for="(p, id) in PROVIDERS"
        :key="id"
        class="prov"
        :class="{ on: aiSettings.provider === id }"
      >
        <input
          v-model="aiSettings.provider"
          type="radio"
          :value="id"
          :disabled="p.free && !firebaseEnabled"
        />
        {{ p.label }}
      </label>
    </div>

    <p v-if="isFree()" class="small free-note">
      ✅ Kalit kerak emas — Google akkauntingiz orqali bepul ishlaydi. Bugun:
      <b>{{ progress.aiUsedToday }}/{{ DAILY_FREE_LIMIT }}</b> ta tekshiruv.
    </p>

    <template v-else>
      <label class="field">
        <span class="small muted">API kalit</span>
        <div class="row key">
          <input
            v-model="aiSettings.apiKey"
            :type="show ? 'text' : 'password'"
            :placeholder="PROVIDERS[aiSettings.provider].keyHint"
            autocomplete="off"
            spellcheck="false"
          />
          <button type="button" class="btn sm" @click="show = !show">
            {{ show ? 'Yashirish' : "Ko'rsatish" }}
          </button>
        </div>
      </label>

      <label class="field">
        <span class="small muted">Model (ixtiyoriy)</span>
        <input
          v-model="aiSettings.model"
          :placeholder="PROVIDERS[aiSettings.provider].defaultModel"
          spellcheck="false"
        />
      </label>

      <p class="small muted">
        Kalitni
        <a :href="PROVIDERS[aiSettings.provider].keyUrl" target="_blank" rel="noopener"
          >shu yerdan</a
        >
        oling. Kalit faqat shu brauzerda saqlanadi, serverga yuborilmaydi — har bir qurilmada bir
        marta kiriting. To'lov sizning AI hisobingizdan yechiladi.
      </p>
    </template>
  </div>
</template>

<style scoped>
.ai-settings {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.providers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px;
}
.prov {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
}
.free-note {
  margin: 0;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: var(--success-soft);
}
.prov.on {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--accent);
}
.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.field input {
  width: 100%;
  min-width: 0;
  padding: 9px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text);
  font: inherit;
}
.key {
  gap: 6px;
  flex-wrap: nowrap;
}
.key input {
  flex: 1;
}
p {
  margin: 0;
}
</style>
