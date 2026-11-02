<template>
  <div class="system-tray">
    <button
      type="button"
      class="tray-btn"
      :title="isMuted ? 'Dźwięk: wyciszony' : 'Dźwięk: włączony'"
      @click="toggleMute"
    >
      {{ isMuted ? '🔇' : '🔊' }}
    </button>

    <button
      type="button"
      class="tray-btn"
      :title="crtActive ? 'Filtr CRT: włączony' : 'Filtr CRT: wyłączony'"
      @click="$emit('toggle-crt')"
    >
      📺
    </button>

    <span class="tray-separator">|</span>

    <span class="tray-rank" :title="`Ranga: ${rankDisplay}`">
      {{ rankDisplay }}
    </span>

    <span class="tray-separator">|</span>

    <span
      class="tray-budget"
      :class="{ 'budget-low': timeStore.budgetHoursLeft <= 20 }"
      :title="`Budżet operacyjny: ${timeStore.budgetHoursLeft} z ${timeStore.budgetHoursTotal} roboczogodzin`"
    >
      Budżet: <strong>{{ timeStore.budgetHoursLeft }}h</strong>
    </span>

    <span class="tray-separator">|</span>

    <span class="tray-time" :title="timeStore.currentDate">
      {{ formattedDateTime }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useVirtualClock } from '../../composables/useVirtualClock';
import { useSoundEffects } from '../../composables/useSoundEffects';

defineProps<{
  crtActive: boolean;
}>();

defineEmits<{
  (e: 'toggle-crt'): void;
}>();

const { timeStore, formattedDateTime, rankDisplay } = useVirtualClock();
const { isMuted, toggleMute } = useSoundEffects();
</script>

<style scoped>
.tray-btn {
  background: none;
  border: none;
  font-size: 11px;
  cursor: pointer;
  padding: 0 2px;
}

.tray-separator {
  color: #808080;
  font-size: 10px;
}

.tray-rank {
  font-weight: bold;
  color: #0a246a;
}

.tray-budget strong {
  color: #111111;
}

.budget-low {
  color: #7a0a14 !important;
  font-weight: bold;
}

.tray-time {
  font-weight: 500;
}
</style>
