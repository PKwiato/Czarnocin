<template>
  <div class="ksip-app">
    <!-- Pasek wyszukiwania -->
    <div class="ksip-search-bar">
      <label for="ksip-query-input">Szukaj:</label>
      <input
        id="ksip-query-input"
        v-model="searchQuery"
        type="text"
        class="input-retro ksip-input"
        placeholder="Wpisz np. SBI 7305, TRANS-MET, nazwisko, PESEL lub telefon..."
        @keydown.enter="handleSearch"
      />
      <button
        type="button"
        class="btn-retro ksip-search-btn"
        :disabled="isSearching || isLimitExceeded"
        @click="handleSearch"
      >
        {{ isSearching ? 'Szukanie...' : 'Szukaj w KSIP' }}
      </button>
    </div>

    <!-- Tabela wyników KSIP -->
    <div class="ksip-results-viewport border-inset">
      <table v-if="results.length > 0" class="retro-table">
        <thead>
          <tr>
            <th style="width: 75px">Sygnatura</th>
            <th style="width: 80px">Kategoria</th>
            <th>Tytuł wpisu / Dane</th>
            <th style="width: 140px">Akcja</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rec in results" :key="rec.id">
            <td><strong>{{ rec.id }}</strong></td>
            <td>{{ formatCategory(rec.category) }}</td>
            <td>
              <div class="rec-title">{{ rec.displayTitle }}</div>
              <div class="rec-details">
                <span v-for="(v, k) in rec.fields" :key="k" class="rec-kv">
                  <strong>{{ k }}:</strong> {{ v }}
                </span>
              </div>
            </td>
            <td>
              <button
                type="button"
                class="btn-retro btn-pin-record"
                @click="pinRecord(rec)"
              >
                Wepnij odpis ({{ rec.id }})
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Komunikat pustego wyniku lub startu -->
      <div v-else class="ksip-empty-state">
        <p v-if="message">{{ message }}</p>
        <p v-else>
          Wpisz zapytanie w polu powyżej, aby przeszukać Krajowy System Informacji Policji.<br />
          Dostępne rejestry: Pojazdy (CEPiK), Ewidencja Ludności, Notowania Kryminalne, Wykaz Firm (KRS).
        </p>
      </div>
    </div>

    <!-- Pasek dolny z limitem zapytań i ostrzeżeniem BSW -->
    <footer class="ksip-footer">
      <span class="ksip-counter" :class="{ 'counter-alert': queriesUsed >= 8 }">
        Zapytania: <strong>{{ queriesUsed }} z {{ queryLimit }}</strong> (limit Mł. Asp.)
      </span>
      <span v-if="feedbackMsg" class="ksip-feedback">{{ feedbackMsg }}</span>
      <span v-if="isLimitExceeded" class="bsw-warning">
        ⛔ Blokada: limit wyczerpany! Ryzyko kontroli BSW.
      </span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { KsipRecord } from '../../types/case.types';
import { ksipService } from '../../services/ksipService';
import { useEvidenceStore } from '../../stores/evidenceStore';
import { useSoundEffects } from '../../composables/useSoundEffects';

const searchQuery = ref('TRANS-MET');
const results = ref<KsipRecord[]>([]);
const queriesUsed = ref(3); // Startujemy z 3 zgodnie z makietą
const queryLimit = 10;
const isSearching = ref(false);
const message = ref('');
const feedbackMsg = ref('');

const evidenceStore = useEvidenceStore();
const { playSound } = useSoundEffects();

const isLimitExceeded = computed(() => queriesUsed.value >= queryLimit);

const formatCategory = (cat: string) => {
  const map: Record<string, string> = {
    vehicle: 'Pojazd',
    person: 'Kartoteka',
    company: 'Firma / KRS',
    phone: 'Telefon',
  };
  return map[cat] || cat;
};

const handleSearch = async () => {
  if (!searchQuery.value.trim() || isLimitExceeded.value) return;

  playSound('click');
  isSearching.value = true;
  message.value = '';

  try {
    const res = await ksipService.search(searchQuery.value, queriesUsed.value, queryLimit);
    results.value = res.records;
    queriesUsed.value = res.queriesUsed;
    if (res.message) {
      message.value = res.message;
    }
  } catch (err) {
    message.value = 'Wystąpił błąd podczas przeszukiwania bazy KSIP.';
  } finally {
    isSearching.value = false;
  }
};

const pinRecord = (record: KsipRecord) => {
  playSound('printer');
  const item = ksipService.createEvidenceFromRecord(record);
  const added = evidenceStore.addEvidence(item);

  if (added) {
    feedbackMsg.value = `Wpięto odpis ${record.id} do akt sprawy.`;
    setTimeout(() => {
      feedbackMsg.value = '';
    }, 2500);
  } else {
    feedbackMsg.value = `Odpis ${record.id} jest już w aktach.`;
  }
};

// Automatyczne załadowanie początkowego zapytania zgodnego z makietą
handleSearch();
</script>

<style scoped>
.ksip-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 6px 8px;
  background-color: var(--win-gray);
  box-sizing: border-box;
  font-size: 11px;
}

.ksip-search-bar {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 6px;
}

.ksip-input {
  flex: 1;
  height: 24px;
}

.ksip-search-btn {
  font-weight: bold;
  font-size: 11px;
  white-space: nowrap;
}

.ksip-results-viewport {
  flex: 1;
  background-color: #ffffff;
  overflow-y: auto;
  min-height: 0;
}

.rec-title {
  font-weight: bold;
  margin-bottom: 2px;
}

.rec-details {
  font-size: 10px;
  color: #333333;
}

.rec-kv {
  display: inline-block;
  margin-right: 8px;
}

.btn-pin-record {
  font-size: 10px;
  padding: 2px 6px;
  width: 100%;
}

.ksip-empty-state {
  padding: 20px;
  text-align: center;
  color: #666666;
  font-style: italic;
  line-height: 1.5;
}

.ksip-footer {
  display: flex;
  align-items: center;
  padding-top: 4px;
  font-size: 11px;
}

.counter-alert {
  color: #a06000;
}

.ksip-feedback {
  margin-left: 12px;
  font-weight: bold;
  color: #0a5a1a;
}

.bsw-warning {
  margin-left: auto;
  color: #7a0a14;
  font-weight: bold;
}
</style>
