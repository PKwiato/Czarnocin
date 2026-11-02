<template>
  <div class="field-dispatcher-app">
    <div class="dispatcher-header">
      <span>Zlecanie czynności śledczych w terenie (odlicza roboczogodziny z budżetu):</span>
    </div>

    <!-- Tabela czynności operacyjnych -->
    <div class="dispatcher-viewport border-inset">
      <table class="retro-table">
        <thead>
          <tr>
            <th style="width: 45px">Kod</th>
            <th>Czynność operacyjna</th>
            <th style="width: 55px">Koszt</th>
            <th style="width: 75px">Zgoda</th>
            <th style="width: 80px">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="action in actions" :key="action.id">
            <td><strong>{{ action.id }}</strong></td>
            <td>
              <div class="action-name">{{ action.name }}</div>
              <div v-if="action.unlockedDocumentIds.length > 0" class="action-unlocks">
                Odblokowuje: {{ action.unlockedDocumentIds.join(', ') }}
              </div>
            </td>
            <td><strong>{{ action.costHours }}h</strong></td>
            <td>
              <span v-if="action.requiresSuperiorApproval" class="approval-tag">
                Wymagana
              </span>
              <span v-else class="approval-none">Nie</span>
            </td>
            <td>
              <button
                v-if="!action.isExecuted"
                type="button"
                class="btn-retro btn-dispatch"
                :disabled="isExecuting || timeStore.budgetHoursLeft < action.costHours"
                @click="executeAction(action)"
              >
                Zleć
              </button>
              <span v-else class="executed-badge">Wykonano</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Dolna belka informacyjna -->
    <footer class="dispatcher-footer">
      <span v-if="feedbackMsg" class="dispatcher-feedback">{{ feedbackMsg }}</span>
      <span v-else class="dispatcher-budget-info">
        Pozostały budżet operacyjny: <strong>{{ timeStore.budgetHoursLeft }} / {{ timeStore.budgetHoursTotal }}h</strong>
      </span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { FieldAction } from '../../types/case.types';
import { useActiveCaseStore } from '../../stores/activeCaseStore';
import { useVirtualTimeStore } from '../../stores/virtualTimeStore';
import { useSoundEffects } from '../../composables/useSoundEffects';

const caseStore = useActiveCaseStore();
const timeStore = useVirtualTimeStore();
const { playSound } = useSoundEffects();

const isExecuting = ref(false);
const feedbackMsg = ref('');

const actions = computed(() => caseStore.fieldActions);

const executeAction = async (action: FieldAction) => {
  if (timeStore.budgetHoursLeft < action.costHours) {
    feedbackMsg.value = 'Niewystarczający budżet roboczogodzin na to zlecenie.';
    return;
  }

  isExecuting.value = true;
  playSound('floppy_seek');

  try {
    const res = await caseStore.runFieldAction(action.id);
    if (res.success) {
      playSound('printer');
      feedbackMsg.value = `Zlecenie ${action.id} wykonane. Włączono nowe dokumenty do akt.`;
      setTimeout(() => {
        feedbackMsg.value = '';
      }, 3500);
    } else {
      feedbackMsg.value = res.message;
    }
  } finally {
    isExecuting.value = false;
  }
};
</script>

<style scoped>
.field-dispatcher-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 6px 8px;
  background-color: var(--win-gray);
  box-sizing: border-box;
  font-size: 11px;
}

.dispatcher-header {
  margin-bottom: 6px;
  font-size: 11px;
}

.dispatcher-viewport {
  flex: 1;
  background-color: #ffffff;
  overflow-y: auto;
  min-height: 0;
}

.action-name {
  font-weight: 500;
}

.action-unlocks {
  font-size: 10px;
  color: #666666;
  font-family: var(--font-mono);
}

.approval-tag {
  color: #a06000;
  font-weight: bold;
  font-size: 10px;
}

.approval-none {
  color: #888888;
  font-size: 10px;
}

.btn-dispatch {
  font-size: 10px;
  padding: 1px 6px;
  width: 100%;
  font-weight: bold;
}

.executed-badge {
  color: #0a5a1a;
  font-weight: bold;
  font-size: 10px;
}

.dispatcher-footer {
  display: flex;
  align-items: center;
  padding-top: 4px;
}

.dispatcher-feedback {
  color: #0a5a1a;
  font-weight: bold;
}
</style>
