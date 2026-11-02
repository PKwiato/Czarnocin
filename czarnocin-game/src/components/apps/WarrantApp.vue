<template>
  <div class="warrant-app">
    <!-- Wybór podejrzanego -->
    <div class="warrant-suspect-bar">
      <label for="warrant-suspect-select"><strong>Wskazany podejrzany:</strong></label>
      <select
        id="warrant-suspect-select"
        v-model="suspectName"
        class="input-retro suspect-select"
      >
        <option value="Zbigniew M.">Zbigniew M. (właściciel punktu skupu złomu)</option>
        <option value="Tadeusz W.">Tadeusz W. (podejrzany z bójki pod barem)</option>
      </select>
    </div>

    <!-- Tabela 4 wymogów formalnych z multi-slotami -->
    <div class="warrant-table-container border-inset">
      <table class="retro-table warrant-table">
        <thead>
          <tr>
            <th style="width: 140px">Wymóg formalny</th>
            <th>Podpięte dowody procesowe (Multi-Slot Drop)</th>
            <th style="width: 100px">Status</th>
          </tr>
        </thead>
        <tbody>
          <!-- 1. Obalenie alibi -->
          <tr>
            <td>
              <strong>1. Obalenie alibi</strong>
              <div class="req-hint">Kłamstwo + BTS lub barmanka</div>
            </td>
            <td>
              <DropSlot
                :items="slots.alibi"
                placeholder="[ przeciągnij zeznanie (AKT-006) + biling BTS (AKT-011) ]"
                requirement-id="alibi"
                @drop-evidence="(e) => handleDrop('alibi', e)"
                @remove="(id) => handleRemove('alibi', id)"
              />
              <div v-if="availableEvidenceFor('alibi').length > 0" class="quick-add-bar">
                <select class="input-retro quick-select" @change="(e) => handleQuickAdd('alibi', e)">
                  <option value="">+ Dodaj dowód z teczki...</option>
                  <option v-for="item in availableEvidenceFor('alibi')" :key="item.id" :value="item.id">
                    {{ item.documentId }}: {{ item.sourceTitle }}
                  </option>
                </select>
              </div>
            </td>
            <td>
              <span class="status-badge" :class="`status-${getStatus('alibi')}`">
                {{ formatStatus(getStatus('alibi')) }}
              </span>
            </td>
          </tr>

          <!-- 2. Obecność na miejscu zdarzenia -->
          <tr>
            <td>
              <strong>2. Obecność na miejscu</strong>
              <div class="req-hint">Wjazd pojazdu + rejestr KSIP</div>
            </td>
            <td>
              <DropSlot
                :items="slots.presence"
                placeholder="[ przeciągnij zeznanie stróża (AKT-012) + wpis KSIP (K-01) ]"
                requirement-id="presence"
                @drop-evidence="(e) => handleDrop('presence', e)"
                @remove="(id) => handleRemove('presence', id)"
              />
              <div v-if="availableEvidenceFor('presence').length > 0" class="quick-add-bar">
                <select class="input-retro quick-select" @change="(e) => handleQuickAdd('presence', e)">
                  <option value="">+ Dodaj dowód z teczki...</option>
                  <option v-for="item in availableEvidenceFor('presence')" :key="item.id" :value="item.id">
                    {{ item.documentId }}: {{ item.sourceTitle }}
                  </option>
                </select>
              </div>
            </td>
            <td>
              <span class="status-badge" :class="`status-${getStatus('presence')}`">
                {{ formatStatus(getStatus('presence')) }}
              </span>
            </td>
          </tr>

          <!-- 3. Ślad materialny / Narzędzie zbrodni -->
          <tr>
            <td>
              <strong>3. Ślad materialny</strong>
              <div class="req-hint">Ekspertyza noża D-1</div>
            </td>
            <td>
              <DropSlot
                :items="slots.material_trace"
                placeholder="[ przeciągnij ekspertyzę LK z odciskiem palca (AKT-014) ]"
                requirement-id="material_trace"
                @drop-evidence="(e) => handleDrop('material_trace', e)"
                @remove="(id) => handleRemove('material_trace', id)"
              />
              <div v-if="availableEvidenceFor('material_trace').length > 0" class="quick-add-bar">
                <select class="input-retro quick-select" @change="(e) => handleQuickAdd('material_trace', e)">
                  <option value="">+ Dodaj dowód z teczki...</option>
                  <option v-for="item in availableEvidenceFor('material_trace')" :key="item.id" :value="item.id">
                    {{ item.documentId }}: {{ item.sourceTitle }}
                  </option>
                </select>
              </div>
            </td>
            <td>
              <span class="status-badge" :class="`status-${getStatus('material_trace')}`">
                {{ formatStatus(getStatus('material_trace')) }}
              </span>
            </td>
          </tr>

          <!-- 4. Motyw czynu -->
          <tr>
            <td>
              <strong>4. Motyw czynu</strong>
              <div class="req-hint">Szantaż / faktury za kradzież</div>
            </td>
            <td>
              <DropSlot
                :items="slots.motive"
                placeholder="[ przeciągnij zeznanie siostry (AKT-013) + fakturę/biling ]"
                requirement-id="motive"
                @drop-evidence="(e) => handleDrop('motive', e)"
                @remove="(id) => handleRemove('motive', id)"
              />
              <div v-if="availableEvidenceFor('motive').length > 0" class="quick-add-bar">
                <select class="input-retro quick-select" @change="(e) => handleQuickAdd('motive', e)">
                  <option value="">+ Dodaj dowód z teczki...</option>
                  <option v-for="item in availableEvidenceFor('motive')" :key="item.id" :value="item.id">
                    {{ item.documentId }}: {{ item.sourceTitle }}
                  </option>
                </select>
              </div>
            </td>
            <td>
              <span class="status-badge" :class="`status-${getStatus('motive')}`">
                {{ formatStatus(getStatus('motive')) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Taca zebranych dowodów śledczych (Evidence Tray) -->
    <div class="evidence-tray border-inset">
      <div class="tray-header">
        <span class="tray-title">📁 <strong>Teczka zebranych dowodów ({{ evidenceStore.evidenceList.length }}):</strong></span>
        <span class="tray-hint">Przeciągnij do tabeli powyżej lub użyj menu rozwijanego</span>
      </div>
      <div class="tray-items">
        <div
          v-for="ev in evidenceStore.evidenceList"
          :key="ev.id"
          class="tray-item-pill"
          :class="`pill-${ev.color}`"
          :draggable="true"
          title="Przeciągnij do odpowiedniego wiersza wniosku"
          @dragstart="(e) => onTrayDragStart(e, ev)"
        >
          <span class="pill-tag">{{ ev.documentId }}</span>
          <span class="pill-text">{{ ev.sourceTitle }}</span>
        </div>
        <div v-if="evidenceStore.evidenceList.length === 0" class="tray-empty">
          Brak wpiętych dowodów. Wepnij cytaty z akt sprawy (CaseViewer), odpisy z KSIP lub analizę z Osi Czasu.
        </div>
      </div>
    </div>

    <!-- Pasek akcji i złożenia wniosku -->
    <footer class="warrant-footer">
      <span class="warrant-warning">
        Błąd merytoryczny = natychmiastowe odrzucenie wniosku i kara dyscyplinarna (-10h budżetu).
      </span>
      <button
        type="button"
        class="btn-retro warrant-submit-btn"
        :disabled="isSubmitting"
        @click="handleSubmitWarrant"
      >
        ⚖️ Złóż do prokuratora
      </button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { EvidenceItem, WarrantRequirementId } from '../../types/evidence.types';
import type { WarrantFormState, WarrantEvaluationResult } from '../../types/warrant.types';
import { warrantService } from '../../services/warrantService';
import { useEvidenceStore } from '../../stores/evidenceStore';
import { useSoundEffects } from '../../composables/useSoundEffects';
import DropSlot from '../common/DropSlot.vue';

const emit = defineEmits<{
  (e: 'warrant-evaluated', result: WarrantEvaluationResult): void;
}>();

const evidenceStore = useEvidenceStore();
const { playSound } = useSoundEffects();

const suspectName = ref('Zbigniew M.');
const isSubmitting = ref(false);

const slots = reactive<Record<WarrantRequirementId, EvidenceItem[]>>({
  alibi: [
    {
      id: 'ev-warrant-akt-006',
      caseId: 'case-01',
      documentId: 'AKT-006',
      type: 'document_quote',
      quote: 'w barze „Pod Lipą” od 20:30 do 22:30',
      color: 'yellow',
      sourceTitle: 'Zeznanie M.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ev-warrant-akt-011',
      caseId: 'case-01',
      documentId: 'AKT-011',
      type: 'document_quote',
      quote: 'Logowanie BTS Huta-Płn. o 21:41 i 22:19',
      color: 'red',
      sourceTitle: 'Biling BTS Huta',
      createdAt: new Date().toISOString(),
    },
  ],
  presence: [
    {
      id: 'ev-warrant-akt-012',
      caseId: 'case-01',
      documentId: 'AKT-012',
      type: 'document_quote',
      quote: 'Żuk SBI 7305 na bocznicy o 21:45',
      color: 'yellow',
      sourceTitle: 'Zeznanie stróża bramy',
      createdAt: new Date().toISOString(),
    },
  ],
  material_trace: [],
  motive: [],
});

const availableEvidenceFor = (req: WarrantRequirementId): EvidenceItem[] => {
  const currentDocIds = slots[req].map((e) => e.documentId);
  return evidenceStore.evidenceList.filter((e) => !currentDocIds.includes(e.documentId));
};

const handleQuickAdd = (req: WarrantRequirementId, e: Event) => {
  const select = e.target as HTMLSelectElement;
  const evId = select.value;
  if (!evId) return;

  const item = evidenceStore.evidenceList.find((i) => i.id === evId);
  if (item) {
    handleDrop(req, item);
    playSound('click');
  }
  select.value = '';
};

const onTrayDragStart = (e: DragEvent, item: EvidenceItem) => {
  if (!e.dataTransfer) return;
  e.dataTransfer.setData('application/json', JSON.stringify(item));
  e.dataTransfer.setData('text/plain', item.id);
  e.dataTransfer.effectAllowed = 'copyMove';
};

const handleDrop = (req: WarrantRequirementId, item: EvidenceItem) => {
  const targetList = slots[req];
  const exists = targetList.some((e) => e.documentId === item.documentId);
  if (!exists) {
    targetList.push(item);
  }
};

const handleRemove = (req: WarrantRequirementId, id: string) => {
  slots[req] = slots[req].filter((e) => e.id !== id);
};

const getStatus = (req: WarrantRequirementId): 'complete' | 'partial' | 'empty' => {
  const count = slots[req].length;
  if (count === 0) return 'empty';
  if (req === 'material_trace' && count >= 1) return 'complete';
  if (count >= 2) return 'complete';
  return 'partial';
};

const formatStatus = (status: 'complete' | 'partial' | 'empty'): string => {
  switch (status) {
    case 'complete':
      return 'Uzupełniono';
    case 'partial':
      return 'Niepełny (1/2)';
    case 'empty':
      return 'Brak';
  }
};

const handleSubmitWarrant = async () => {
  playSound('stamp');
  isSubmitting.value = true;

  const form: WarrantFormState = {
    caseId: 'case-01',
    suspectName: suspectName.value,
    requirements: { ...slots },
    submittedAt: new Date().toISOString(),
  };

  try {
    const { result } = await warrantService.submitWarrant(form);
    emit('warrant-evaluated', result);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.warrant-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 6px 8px;
  background-color: var(--win-gray);
  box-sizing: border-box;
  font-size: 11px;
}

.warrant-suspect-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.suspect-select {
  flex: 1;
  height: 24px;
}

.warrant-table-container {
  flex: 1;
  background-color: #ffffff;
  overflow-y: auto;
  min-height: 0;
}

.warrant-table td {
  vertical-align: middle;
}

.req-hint {
  font-size: 10px;
  color: #666666;
  font-style: italic;
  font-weight: normal;
}

.status-badge {
  font-weight: bold;
  font-size: 11px;
}

.status-complete {
  color: #0a5a1a;
}

.status-partial {
  color: #a06000;
}

.status-empty {
  color: #7a0a14;
}

.quick-add-bar {
  margin-top: 3px;
}

.quick-select {
  font-size: 10px;
  height: 20px;
  padding: 1px 3px;
  max-width: 100%;
}

.evidence-tray {
  margin-top: 6px;
  padding: 4px 6px;
  background-color: #f0ede5;
  max-height: 72px;
  overflow-y: auto;
  font-size: 10px;
}

.tray-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.tray-hint {
  font-size: 10px;
  color: #555555;
  font-style: italic;
}

.tray-items {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tray-item-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 5px;
  border: 1px solid #707070;
  cursor: grab;
  font-size: 10px;
  user-select: none;
  background: #ffffff;
}

.tray-item-pill:active {
  cursor: grabbing;
}

.pill-tag {
  font-weight: bold;
  font-family: var(--font-mono);
}

.pill-text {
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pill-yellow {
  background-color: #fff9c4;
}

.pill-red {
  background-color: #ffcdd2;
}

.pill-blue {
  background-color: #bbdefb;
}

.tray-empty {
  font-style: italic;
  color: #777777;
}

.warrant-footer {
  display: flex;
  align-items: center;
  padding-top: 6px;
}

.warrant-warning {
  color: #7a0a14;
  font-size: 11px;
}

.warrant-submit-btn {
  margin-left: auto;
  font-weight: bold;
  font-size: 11px;
  min-height: 24px;
  padding: 3px 12px;
}
</style>
