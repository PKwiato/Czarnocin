<template>
  <div class="timeline-app">
    <!-- Pasek informacyjny z przełącznikiem widoków i akcjami -->
    <div class="timeline-header">
      <div class="header-left">
        <span class="header-hint">
          Kliknij dowolny element na osi, aby otworzyć powiązany dokument procesowy.
        </span>
      </div>

      <div class="header-actions">
        <!-- Przełącznik widoku Wykres / Lista zdarzeń -->
        <div class="view-toggle-group">
          <button
            type="button"
            class="btn-retro view-toggle-btn"
            :class="{ active: currentView === 'canvas' }"
            @click="currentView = 'canvas'"
            title="Przełącz na graficzny wykres osi czasu"
          >
            📊 Wykres
          </button>
          <button
            type="button"
            class="btn-retro view-toggle-btn"
            :class="{ active: currentView === 'list' }"
            @click="currentView = 'list'"
            title="Przełącz na chronologiczną listę zdarzeń (15 zdarzeń)"
          >
            📋 Zdarzenia ({{ timelineStore.events.length }})
          </button>
        </div>

        <button
          v-if="timelineStore.conflictDetected"
          type="button"
          class="btn-retro pin-conflict-btn"
          @click="handlePinConflictEvidence"
          title="Wepnij notatkę analityczną o sprzeczności alibi z bilingiem do akt"
        >
          ⚡ Wepnij analizę
        </button>
      </div>
    </div>

    <!-- 1. Główny obszar wykresu osi czasu (Wzorowany na makiecie) -->
    <div
      v-if="currentView === 'canvas'"
      class="timeline-canvas-container border-inset"
      @dragover.prevent
      @dragenter.prevent
      @drop.prevent="handleTimelineDrop"
    >
      <!-- Podziałka godzinowa -->
      <div class="time-ruler">
        <span class="ruler-tick" style="left: 4px">19:30</span>
        <span class="ruler-tick" style="left: 54px">20:00</span>
        <span class="ruler-tick" style="left: 154px">21:00</span>
        <span class="ruler-tick" style="left: 254px">22:00</span>
        <span class="ruler-tick" style="left: 354px">23:00</span>
        <span class="ruler-tick" style="left: 440px">24:00</span>
      </div>

      <!-- Tor 1: Alibi i świadkowie -->
      <div class="timeline-track" style="top: 26px">
        <span class="track-label">Alibi (świadkowie):</span>
        <div
          v-if="hasAlibiBar"
          class="timeline-bar bar-alibi"
          :class="{ 'bar-active': isDocumentActive('AKT-006') }"
          style="left: 104px; width: 200px"
          title="Zeznanie M.: Bar „Pod Lipą” (20:30–22:30) — Kliknij, aby otworzyć dokument AKT-006"
          @click="openDocument('AKT-006')"
        >
          <span class="bar-doc-badge">AKT-006</span>
          Zeznanie M.: Bar „Pod Lipą” (20:30–22:30)
        </div>
      </div>

      <!-- Tor 2: Telefonia komórkowa BTS -->
      <div class="timeline-track" style="top: 68px">
        <span class="track-label">Wydruk bilingu BTS:</span>
        <div
          class="timeline-bar bar-bts-centrum"
          :class="{ 'bar-active': isDocumentActive('AKT-011') }"
          style="left: 174px; width: 44px"
          title="21:12 BTS Centrum — Kliknij, aby otworzyć biling AKT-011"
          @click="openDocument('AKT-011')"
        >
          <span class="bar-doc-badge">AKT-011</span>
          Centrum
        </div>
        <div
          v-if="hasBtsHuta"
          class="timeline-bar bar-bts-huta"
          :class="{ 'bar-active': isDocumentActive('AKT-011') }"
          style="left: 222px; width: 88px"
          title="21:41–22:19 BTS Huta-Płn. (Sprzeczność!) — Kliknij, aby otworzyć biling AKT-011"
          @click="openDocument('AKT-011')"
        >
          <span class="bar-doc-badge">AKT-011</span>
          BTS Huta-Płn.
        </div>
      </div>

      <!-- Tor 3: Ruch na bocznicy kolejowej -->
      <div class="timeline-track" style="top: 110px">
        <span class="track-label">Brama nr 3 Huty:</span>
        <div
          class="timeline-bar bar-scene"
          :class="{ 'bar-active': isDocumentActive('AKT-012') }"
          style="left: 228px; width: 95px"
          title="21:45 wjazd Żuka, 22:15 wyjazd Żuka — Kliknij, aby otworzyć książkę wjazdów AKT-012"
          @click="openDocument('AKT-012')"
        >
          <span class="bar-doc-badge">AKT-012</span>
          Żuk SBI 7305 (21:45–22:15)
        </div>

        <div
          class="timeline-bar bar-scene-body"
          :class="{ 'bar-active': isDocumentActive('AKT-002') }"
          style="left: 426px; width: 68px"
          title="23:50 Ujawnienie zwłok Henryka D. — Kliknij, aby otworzyć protokół oględzin AKT-002"
          @click="openDocument('AKT-002')"
        >
          <span class="bar-doc-badge">AKT-002</span>
          Zwłoki 23:50
        </div>
      </div>

      <!-- Pasmo kolizji czasowej (Czerwone pionowe linie) -->
      <div
        v-if="timelineStore.conflictDetected"
        class="conflict-window"
        style="left: 222px; width: 88px"
        title="Okno sprzeczności: 21:41–22:19 — Kliknij, aby otworzyć biling BTS AKT-011"
        @click="openDocument('AKT-011')"
      >
        <span class="conflict-marker-label">KOLIZJA</span>
      </div>
    </div>

    <!-- 2. Alternatywny widok tabelaryczny: Chronologiczna lista zdarzeń -->
    <div
      v-else
      class="timeline-list-container border-inset"
    >
      <table class="events-table">
        <thead>
          <tr>
            <th style="width: 52px">Godz.</th>
            <th style="width: 60px">Tor</th>
            <th>Zdarzenie / Ustalenie operacyjne</th>
            <th style="width: 76px; text-align: center">Dokument</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="ev in timelineStore.events"
            :key="ev.id"
            class="event-row"
            :class="{
              'row-active': isDocumentActive(ev.documentId),
              'row-conflict': ev.isConflict,
            }"
            @click="openDocument(ev.documentId)"
          >
            <td class="event-time">
              <strong>{{ ev.time }}</strong>
            </td>
            <td>
              <span class="track-badge" :class="`badge-track-${ev.track}`">
                {{ formatTrack(ev.track) }}
              </span>
            </td>
            <td class="event-desc">
              <span class="event-title">{{ ev.title }}</span>
              <span class="event-detail"> — {{ ev.description }}</span>
              <span v-if="ev.isConflict" class="badge-conflict-tag">⚡ KOLIZJA</span>
            </td>
            <td style="text-align: center">
              <button
                type="button"
                class="btn-retro doc-link-btn"
                @click.stop="openDocument(ev.documentId)"
                :title="`Otwórz dokument ${ev.documentId}`"
              >
                {{ ev.documentId }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Dolny baner informacyjny o sprzeczności -->
    <div
      v-if="timelineStore.conflictDetected"
      class="conflict-banner"
    >
      ⚠️ <strong>Sprzeczność:</strong> 21:41–22:19 podejrzany w dwóch miejscach jednocześnie. Logowanie na
      <button
        type="button"
        class="doc-link-pill"
        @click="openDocument('AKT-011')"
        title="Otwórz biling BTS Huta-Płn. (AKT-011)"
      >
        BTS Huta-Płn. [AKT-011]
      </button>
      wyklucza pobyt w
      <button
        type="button"
        class="doc-link-pill"
        @click="openDocument('AKT-006')"
        title="Otwórz protokół przesłuchania Zbigniewa M. (AKT-006)"
      >
        barze Pod Lipą [AKT-006]
      </button>.
    </div>

    <div v-else class="conflict-empty-hint">
      Umieść dowody alibi i bilingu, aby zbadać ewentualne sprzeczności czasowe.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTimelineStore } from '../../stores/timelineStore';
import { useEvidenceStore } from '../../stores/evidenceStore';
import { useActiveCaseStore } from '../../stores/activeCaseStore';
import { useWindowManagerStore } from '../../stores/windowManagerStore';
import { useSoundEffects } from '../../composables/useSoundEffects';
import type { EvidenceItem } from '../../types/evidence.types';

const timelineStore = useTimelineStore();
const evidenceStore = useEvidenceStore();
const caseStore = useActiveCaseStore();
const windowManager = useWindowManagerStore();
const { playSound } = useSoundEffects();

const currentView = ref<'canvas' | 'list'>('canvas');

const hasAlibiBar = computed(() =>
  timelineStore.placedEventIds.includes('ev-time-02') || timelineStore.placedEventIds.includes('TE-06')
);

const hasBtsHuta = computed(() =>
  timelineStore.placedEventIds.includes('ev-time-04') || timelineStore.placedEventIds.includes('TE-10')
);

const isDocumentActive = (docId: string) => {
  return caseStore.activeDocumentId === docId;
};

/**
 * Otwiera powiązany dokument procesowy w Przeglądarce Akt (CaseViewerApp)
 * i wynosi okno na wierzch pulpitu śledczego.
 */
const openDocument = (docId: string) => {
  playSound('click');
  caseStore.setActiveDocument(docId);
  windowManager.openWindow('case-viewer');
  windowManager.focusWindow('case-viewer');
};

const formatTrack = (track: string) => {
  switch (track) {
    case 'alibi':
      return 'Alibi';
    case 'bts':
      return 'BTS';
    case 'scene':
      return 'Bocznica';
    default:
      return track;
  }
};

const handleTimelineDrop = (e: DragEvent) => {
  if (!e.dataTransfer) return;
  try {
    const rawData = e.dataTransfer.getData('application/json');
    if (rawData) {
      const item = JSON.parse(rawData) as EvidenceItem;
      if (item.documentId) {
        openDocument(item.documentId);
        if (item.documentId === 'AKT-006' || item.documentId === 'AKT-010') {
          timelineStore.placeEvent('TE-06');
        } else if (item.documentId === 'AKT-011') {
          timelineStore.placeEvent('TE-10');
        }
      }
    }
  } catch (err) {
    console.warn('Błąd podczas upuszczania dowodu na oś czasu:', err);
  }
};

const handlePinConflictEvidence = () => {
  playSound('printer');

  const item: EvidenceItem = {
    id: `ev-analiza-kolizja-${Date.now()}`,
    caseId: 'case-01',
    documentId: 'AKT-011',
    type: 'document_quote',
    quote: '[ANALIZA OSI CZASU] Sprzeczność: 21:41–22:19 podejrzany logował się na stacji BTS Huta-Płn. (AKT-011), co fizycznie wyklucza jego obecność w barze Pod Lipą (AKT-006 / AKT-010).',
    color: 'red',
    sourceTitle: 'Generator Osi Czasu — Analiza Kolizji',
    targetRequirement: 'alibi',
    createdAt: new Date().toISOString(),
  };

  evidenceStore.addEvidence(item);
};
</script>

<style scoped>
.timeline-app {
  display: flex;
  flex-direction: column;
  padding: 6px 8px;
  background-color: var(--win-gray);
  box-sizing: border-box;
  font-size: 11px;
  height: 100%;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
  min-height: 24px;
}

.header-left {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-hint {
  font-size: 10.5px;
  color: #333333;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.view-toggle-group {
  display: flex;
  gap: 2px;
}

.view-toggle-btn {
  font-size: 10px;
  padding: 1px 6px;
  min-height: 20px;
}

.view-toggle-btn.active {
  box-shadow: inset 1px 1px 0 #000000, inset -1px -1px 0 #ffffff;
  background-color: #c0c0c0;
  font-weight: bold;
}

.pin-conflict-btn {
  font-weight: bold;
  color: #7a0a14;
  font-size: 10px;
  padding: 1px 7px;
  min-height: 20px;
}

/* Główny kontener wykresu */
.timeline-canvas-container {
  position: relative;
  height: 154px;
  background-color: #ffffff;
  overflow-x: auto;
  overflow-y: hidden;
  margin-bottom: 5px;
}

.time-ruler {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 20px;
  border-bottom: 1px solid #808080;
  font-size: 10px;
  color: #111111;
  background-color: #f5f5f5;
  user-select: none;
}

.ruler-tick {
  position: absolute;
  top: 2px;
}

.timeline-track {
  position: absolute;
  left: 0;
  width: 100%;
  height: 38px;
  border-bottom: 1px dashed #e0e0e0;
}

.track-label {
  position: absolute;
  left: 4px;
  top: 2px;
  font-size: 9px;
  color: #666666;
  user-select: none;
}

/* Paski zdarzeń na osi */
.timeline-bar {
  position: absolute;
  top: 15px;
  height: 20px;
  font-size: 10px;
  line-height: 20px;
  padding: 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
  transition: transform 0.08s ease, box-shadow 0.08s ease, filter 0.08s ease;
}

.timeline-bar:hover {
  filter: brightness(1.08);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4), inset 0 0 2px rgba(255, 255, 255, 0.8);
  transform: translateY(-1px);
  z-index: 5;
}

.timeline-bar:active {
  transform: translateY(0);
  box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.timeline-bar.bar-active {
  outline: 2px solid #0a246a;
  box-shadow: 0 0 6px rgba(10, 36, 106, 0.7);
  font-weight: bold;
  z-index: 6;
}

.bar-doc-badge {
  background-color: rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(0, 0, 0, 0.25);
  font-family: var(--font-mono);
  font-size: 8.5px;
  font-weight: bold;
  padding: 0 2px;
  margin-right: 3px;
  border-radius: 1px;
  display: inline-block;
  line-height: 13px;
}

.bar-alibi {
  background-color: #f2e24a;
  border: 1px solid #8a7d00;
  color: #111111;
}

.bar-bts-centrum {
  background-color: #7fb2f0;
  border: 1px solid #3a6ea5;
  color: #111111;
}

.bar-bts-huta {
  background-color: #e8707a;
  border: 1px solid #7a0a14;
  color: #111111;
  font-weight: bold;
}

.bar-scene {
  background-color: #d4d0c8;
  border: 1px solid #808080;
  color: #222222;
}

.bar-scene-body {
  background-color: #c2410c;
  border: 1px solid #7c2d12;
  color: #ffffff;
  font-weight: bold;
}

/* Okno kolizji czasowej */
.conflict-window {
  position: absolute;
  top: 20px;
  height: 134px;
  border-left: 2px dashed #b00020;
  border-right: 2px dashed #b00020;
  background-color: rgba(232, 112, 122, 0.25);
  cursor: pointer;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 4px;
  transition: background-color 0.15s ease;
  user-select: none;
}

.conflict-window:hover {
  background-color: rgba(232, 112, 122, 0.45);
  box-shadow: 0 0 6px rgba(176, 0, 32, 0.4);
}

.conflict-marker-label {
  font-size: 9px;
  font-weight: bold;
  color: #7a0a14;
  letter-spacing: 1px;
}

/* Widok listy tabelarycznej */
.timeline-list-container {
  height: 154px;
  background-color: #ffffff;
  overflow-y: auto;
  margin-bottom: 5px;
}

.events-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 10.5px;
}

.events-table th {
  position: sticky;
  top: 0;
  background-color: #bdb9b0;
  border-bottom: 1px solid #808080;
  padding: 3px 5px;
  text-align: left;
  font-size: 10px;
  font-weight: bold;
  z-index: 2;
  user-select: none;
}

.events-table td {
  padding: 3px 5px;
  border-bottom: 1px dotted #e0e0e0;
  vertical-align: middle;
}

.event-row {
  cursor: pointer;
  transition: background-color 0.1s ease;
}

.event-row:hover {
  background-color: #e8ecf8;
}

.event-row.row-active {
  background-color: #d2e1f8;
  font-weight: bold;
}

.event-row.row-conflict {
  background-color: #fff2f2;
}

.event-row.row-conflict.row-active {
  background-color: #fdd;
}

.event-time {
  font-family: var(--font-mono);
  font-size: 10px;
}

.track-badge {
  font-size: 9px;
  padding: 1px 3px;
  border-radius: 2px;
  font-weight: bold;
}

.badge-track-alibi {
  background-color: #fef08a;
  color: #854d0e;
}

.badge-track-bts {
  background-color: #bfdbfe;
  color: #1e40af;
}

.badge-track-scene {
  background-color: #e2e8f0;
  color: #334155;
}

.event-desc {
  line-height: 1.35;
}

.event-title {
  font-weight: 600;
}

.event-detail {
  color: #444444;
}

.badge-conflict-tag {
  margin-left: 4px;
  font-size: 9px;
  font-weight: bold;
  color: #b91c1c;
  background: #fee2e2;
  padding: 0 3px;
  border: 1px solid #f87171;
}

.doc-link-btn {
  font-family: var(--font-mono);
  font-size: 9.5px;
  font-weight: bold;
  padding: 1px 5px;
  min-height: 18px;
}

/* Baner sprzeczności */
.conflict-banner {
  padding: 3px 8px;
  background-color: #fff0b0;
  border: 1px solid #7a0a14;
  font-size: 10.5px;
  color: #7a0a14;
  line-height: 1.4;
}

.doc-link-pill {
  background-color: #ffffff;
  border: 1px solid #7a0a14;
  color: #7a0a14;
  font-size: 10px;
  font-weight: bold;
  font-family: var(--font-mono);
  padding: 0 4px;
  cursor: pointer;
  margin: 0 2px;
  line-height: 16px;
  vertical-align: baseline;
  transition: all 0.1s ease;
}

.doc-link-pill:hover {
  background-color: #7a0a14;
  color: #ffffff;
}

.conflict-empty-hint {
  padding: 4px 8px;
  color: #666666;
  font-style: italic;
  font-size: 10.5px;
}
</style>