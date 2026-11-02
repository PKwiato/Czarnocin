<template>
  <div class="case-viewer-app">
    <!-- Pasek narzędzi markera aktowego -->
    <div class="win-toolbar marker-toolbar">
      <span class="marker-label">Zakreślacz:</span>
      <button
        type="button"
        class="btn-retro marker-btn"
        :class="{ active: selectedColor === 'yellow' }"
        style="background-color: #f5e642; border-color: #a89a13;"
        @click="setColor('yellow')"
        title="Oznacz fakty lub alibi"
      >
        🟨 Żółty: fakty / alibi
      </button>

      <button
        type="button"
        class="btn-retro marker-btn"
        :class="{ active: selectedColor === 'red' }"
        style="background-color: #f87171; border-color: #b91c1c;"
        @click="setColor('red')"
        title="Oznacz kłamstwo lub sprzeczność"
      >
        🟥 Czerwony: sprzeczność
      </button>

      <button
        type="button"
        class="btn-retro marker-btn"
        :class="{ active: selectedColor === 'blue' }"
        style="background-color: #93c5fd; border-color: #1d4ed8;"
        @click="setColor('blue')"
        title="Oznacz relacje lub powiązania"
      >
        🟦 Niebieski: powiązania
      </button>

      <span class="toolbar-sep">|</span>

      <button
        type="button"
        class="btn-retro pin-btn"
        :disabled="!hasSelection"
        @click="handlePinEvidence"
        title="Zaznacz fragment tekstu w dokumencie i kliknij, aby wpiąć do akt sprawy"
      >
        📎 Wepnij zaznaczenie do akt
      </button>

      <span v-if="feedbackMsg" class="pin-feedback">{{ feedbackMsg }}</span>

      <div class="toolbar-right">
        <button
          type="button"
          class="btn-retro hint-toggle-btn"
          :class="{ active: showOperationalHints }"
          @click="showOperationalHints = !showOperationalHints"
          title="Przełącz wyświetlanie wskazówek operacyjnych śledczego"
        >
          💡 Wskazówki {{ showOperationalHints ? 'WŁ' : 'WYŁ' }}
        </button>
      </div>
    </div>

    <!-- Główna zawartość: lista akt po lewej + podgląd pisma po prawej -->
    <div class="viewer-main">
      <!-- Lista dokumentów śledczych -->
      <aside class="docs-sidebar border-inset">
        <div class="sidebar-header">
          <span>Akta sprawy (Ds. 112/02)</span>
          <span class="sidebar-count">{{ caseStore.unlockedDocumentIds.length }} / {{ caseStore.documents.length }}</span>
        </div>
        <div class="docs-list">
          <div
            v-for="doc in caseStore.documents"
            :key="doc.id"
            class="doc-item"
            :class="{
              active: caseStore.activeDocumentId === doc.id,
              locked: !isUnlocked(doc.id),
            }"
            @click="selectDocument(doc.id)"
          >
            <span class="doc-id">{{ doc.id }}</span>
            <span class="doc-title" :title="doc.title">{{ doc.title }}</span>
            <span v-if="getPinnedCount(doc.id) > 0" class="badge-pinned" title="Wpięte cytaty">
              📎{{ getPinnedCount(doc.id) }}
            </span>
            <span v-if="!isUnlocked(doc.id)" class="doc-lock" title="Dokument zablokowany">🔒</span>
          </div>
        </div>
      </aside>

      <!-- Podgląd wybranego dokumentu -->
      <section ref="viewportRef" class="doc-viewport border-inset" @mouseup="handleTextSelection">
        <div v-if="currentDoc && isUnlocked(currentDoc.id)" class="dossier-scroll-container">
          <!-- Wskazówka operacyjna (gdy włączona) -->
          <div v-if="showOperationalHints && currentDoc.markersHint" class="doc-hint-banner">
            <span class="hint-pin">📌</span>
            <div class="hint-content">
              <strong>Notatka analityczna (wskazówka operacyjna):</strong>
              <div class="hint-text">{{ currentDoc.markersHint }}</div>
            </div>
          </div>

          <!-- Strony dokumentu stylizowane na karty akt policyjnych -->
          <div
            v-for="(pageHtml, index) in renderedPages"
            :key="index"
            class="dossier-paper"
          >
            <!-- Pasek nagłówkowy karty akt -->
            <div class="paper-header-strip">
              <span class="strip-left">KMP CZARNOCIN · AKTA ŚLEDZTWA</span>
              <span class="strip-center">SYGN. AKT Ds. 112/02</span>
              <span class="strip-right">KARTA AKT: STRONA {{ index + 1 }} Z {{ currentDoc.pagesCount }}</span>
            </div>

            <div class="sheet-watermark">KMP CZARNOCIN · DOWÓD W SPRAWIE</div>

            <!-- Właściwa treść dokumentu procesowego z 2002 roku -->
            <div class="page-html-content" v-html="pageHtml"></div>

            <!-- Stopka strony -->
            <div class="paper-footer-strip">
              <span>— Karta {{ index + 1 }} z {{ currentDoc.pagesCount }} —</span>
            </div>
          </div>
        </div>

        <div v-else-if="currentDoc && !isUnlocked(currentDoc.id)" class="doc-locked-notice">
          <div class="locked-icon">🔒</div>
          <h3>DOKUMENT ZABLOKOWANY</h3>
          <p>
            Materiał dowodowy <strong>{{ currentDoc.id }}: {{ currentDoc.title }}</strong> nie został jeszcze włączony do akt śledztwa.<br />
            Wykonaj odpowiednie zlecenie operacyjne w dyspozytorze czynności terenowych, aby odblokować ten materiał.
          </p>
          <button
            type="button"
            class="btn-retro open-dispatcher-btn"
            style="margin-top: 12px; font-weight: bold; padding: 4px 10px;"
            @click="openFieldDispatcher"
          >
            📋 Otwórz Dyspozytor Zleceń w Terenie
          </button>
        </div>

        <div v-else class="doc-locked-notice">
          <p>Wybierz dokument z listy akt po lewej stronie.</p>
        </div>
      </section>
    </div>

    <!-- Dolny pasek statusu dokumentu -->
    <footer class="window-statusbar">
      <span>Sygnatura: <strong>{{ currentDoc?.id || '---' }}</strong></span>
      <span class="status-sep">|</span>
      <span>Tytuł: {{ currentDoc?.title || 'Brak dokumentu' }}</span>
      <span class="status-sep">|</span>
      <span>Stron w teczce: <strong>{{ currentDoc?.pagesCount || 1 }}</strong></span>
      <span class="status-sep">|</span>
      <span>Wpięte dowody z tego pisma: <strong>{{ pinnedCount }}</strong></span>
      <span class="status-sep">|</span>
      <span style="margin-left: auto;">
        Aktywny zakreślacz:
        <span class="status-color-badge" :class="'badge-' + selectedColor">
          {{ colorLabel(selectedColor) }}
        </span>
      </span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useActiveCaseStore } from '../../stores/activeCaseStore';
import { useEvidenceStore } from '../../stores/evidenceStore';
import { useWindowManagerStore } from '../../stores/windowManagerStore';
import { useEvidenceExtractor } from '../../composables/useEvidenceExtractor';
import { useSoundEffects } from '../../composables/useSoundEffects';
import type { EvidenceItem, HighlightColor } from '../../types/evidence.types';

const caseStore = useActiveCaseStore();
const evidenceStore = useEvidenceStore();
const windowManager = useWindowManagerStore();
const { playSound } = useSoundEffects();
const { selectedColor, setColor, captureSelection, pinEvidence } = useEvidenceExtractor();

const viewportRef = ref<HTMLElement | null>(null);
const hasSelection = ref(false);
const feedbackMsg = ref('');
const showOperationalHints = ref(true);

const currentDoc = computed(() => caseStore.activeDocument);

watch(
  () => caseStore.activeDocumentId,
  () => {
    if (viewportRef.value) {
      viewportRef.value.scrollTop = 0;
    }
  }
);

const isUnlocked = (docId: string) => {
  return caseStore.unlockedDocumentIds.includes(docId);
};

const getPinnedCount = (docId: string) => {
  return evidenceStore.byDocumentId(docId).length;
};

const pinnedCount = computed(() => {
  if (!currentDoc.value) return 0;
  return getPinnedCount(currentDoc.value.id);
});

const colorLabel = (color: HighlightColor) => {
  switch (color) {
    case 'yellow':
      return 'Żółty (alibi / fakt)';
    case 'red':
      return 'Czerwony (sprzeczność)';
    case 'blue':
      return 'Niebieski (powiązanie)';
    default:
      return color;
  }
};

const selectDocument = (docId: string) => {
  playSound('click');
  caseStore.setActiveDocument(docId);
  hasSelection.value = false;
  feedbackMsg.value = '';
};

const openFieldDispatcher = () => {
  playSound('click');
  windowManager.openWindow('field-dispatcher');
  windowManager.focusWindow('field-dispatcher');
};

const handleTextSelection = () => {
  const text = captureSelection();
  hasSelection.value = text.length > 3;
};

const handlePinEvidence = () => {
  if (!currentDoc.value) return;

  const res = pinEvidence(currentDoc.value.id, currentDoc.value.title);
  if (res.success) {
    playSound('printer');
    feedbackMsg.value = 'Wpięto do akt!';
    hasSelection.value = false;
    setTimeout(() => {
      feedbackMsg.value = '';
    }, 2500);
  } else {
    feedbackMsg.value = res.message;
  }
};

/**
 * Konwertuje ewentualne pozostałości markdown (tabele, pogrubienia, kursywy) do czystego HTML
 */
function sanitizeAndFormatHtml(content: string): string {
  if (!content) return '';

  let html = content;

  // Konwersja tabel z bloków <div class='table-block'>| a | b |...</div>
  html = html.replace(/<div class=['"]table-block['"]>([\s\S]*?)<\/div>/gi, (_, tableContent: string) => {
    const lines = tableContent.trim().split('\n').map((l) => l.trim()).filter((l) => l.startsWith('|') && l.endsWith('|'));
    if (lines.length < 2) return tableContent;

    const headers = lines[0].split('|').slice(1, -1).map((h) => h.trim());
    let startIdx = 1;
    if (lines[1] && lines[1].includes('---')) {
      startIdx = 2;
    }

    let out = '<table class="dossier-table"><thead><tr>';
    for (const h of headers) {
      out += `<th>${h}</th>`;
    }
    out += '</tr></thead><tbody>';
    for (let i = startIdx; i < lines.length; i++) {
      const cells = lines[i].split('|').slice(1, -1).map((c) => c.trim());
      out += '<tr>';
      for (const c of cells) {
        out += `<td>${c}</td>`;
      }
      out += '</tr>';
    }
    out += '</tbody></table>';
    return out;
  });

  // Konwersja pogrubień **tekst**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Konwersja kursywy *tekst*
  html = html.replace(/(^|[^*])\*([^*]+)\*([^*]|$)/g, '$1<em>$2</em>$3');

  // Usunięcie znaczników deweloperskich, np. <p>---</p>
  html = html.replace(/<p>\s*---\s*<\/p>/g, '');

  return html;
}

/**
 * Podświetla w tekście HTML fragmenty wpięte do bazy dowodowej
 */
function highlightEvidenceInHtml(htmlContent: string, items: EvidenceItem[]): string {
  if (!items || items.length === 0) return htmlContent;

  let result = htmlContent;
  // Sortowanie po długości cytatu malejąco, aby najpierw dopasować dłuższe frazy
  const sortedItems = [...items].sort((a, b) => b.quote.length - a.quote.length);

  for (const item of sortedItems) {
    if (!item.quote || item.quote.trim().length < 3) continue;

    const rawQuote = item.quote.trim();
    // Uelastycznienie cudzysłowów i spacji
    const escaped = rawQuote
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/["„”]/g, '["„”]')
      .replace(/\s+/g, '\\s+');

    const regex = new RegExp(`(${escaped})`, 'i');

    // Podział na znaczniki HTML i czysty tekst, aby nie niszczyć atrybutów tagów
    const parts = result.split(/(<[^>]*>)/g);
    let matched = false;
    for (let i = 0; i < parts.length; i++) {
      if (!parts[i].startsWith('<')) {
        if (!matched && regex.test(parts[i])) {
          parts[i] = parts[i].replace(
            regex,
            `<mark class="marker-highlight marker-${item.color}" data-evidence-id="${item.id}" title="Wpięty dowód: ${item.sourceTitle}">$1</mark>`
          );
          matched = true;
        }
      }
    }
    result = parts.join('');
  }

  return result;
}

const renderedPages = computed(() => {
  if (!currentDoc.value) return [];
  const docEvidence = evidenceStore.byDocumentId(currentDoc.value.id);
  return currentDoc.value.pages.map((rawPage) => {
    const sanitized = sanitizeAndFormatHtml(rawPage);
    return highlightEvidenceInHtml(sanitized, docEvidence);
  });
});

onMounted(() => {
  if (!caseStore.caseData) {
    caseStore.loadCase();
  }
});
</script>

<style scoped>
.case-viewer-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--win-gray);
  user-select: text;
}

/* Toolbar */
.marker-toolbar {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 4px 8px;
  background-color: #d4d0c8;
  border-bottom: 1px solid #808080;
  box-shadow: inset 1px 1px 0 #ffffff;
  user-select: none;
}

.marker-label {
  font-size: 11px;
  font-weight: bold;
  color: #222;
}

.marker-btn {
  font-size: 11px;
  padding: 2px 8px;
  min-height: 22px;
  font-weight: 500;
  transition: all 0.1s ease;
}

.marker-btn.active {
  box-shadow: inset 2px 2px 0 #000000, inset -1px -1px 0 #ffffff;
  font-weight: bold;
}

.toolbar-sep {
  color: #808080;
  margin: 0 4px;
}

.pin-btn {
  font-weight: bold;
  font-size: 11px;
  min-height: 22px;
  padding: 2px 10px;
  background-color: #e8e8e8;
}

.pin-btn:not(:disabled) {
  background-color: #d8e8d8;
  color: #0b5118;
  border-color: #2e7d32;
  box-shadow: 0 0 4px rgba(46, 125, 50, 0.4);
}

.pin-feedback {
  font-size: 11px;
  font-weight: bold;
  color: #0a5a1a;
  background: #d4f7d4;
  padding: 2px 6px;
  border: 1px solid #2e7d32;
  border-radius: 2px;
  animation: fadeIn 0.2s ease-in;
}

.toolbar-right {
  margin-left: auto;
  display: flex;
  gap: 6px;
}

.hint-toggle-btn {
  font-size: 10px;
  padding: 2px 6px;
  min-height: 20px;
}

.hint-toggle-btn.active {
  background-color: #fff9c4;
  font-weight: bold;
}

/* Main Layout */
.viewer-main {
  flex: 1;
  display: flex;
  gap: 6px;
  padding: 6px;
  min-height: 0;
  overflow: hidden;
}

/* Sidebar */
.docs-sidebar {
  width: 190px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  overflow-y: auto;
  user-select: none;
}

.sidebar-header {
  padding: 4px 6px;
  background-color: #bdb9b0;
  font-size: 10px;
  font-weight: bold;
  border-bottom: 1px solid #808080;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-count {
  font-size: 9px;
  color: #333;
}

.docs-list {
  display: flex;
  flex-direction: column;
}

.doc-item {
  padding: 5px 6px;
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  border-bottom: 1px dotted #e0e0e0;
}

.doc-item:hover {
  background-color: #e8e8e8;
}

.doc-item.active {
  background-color: #0a246a;
  color: #ffffff;
}

.doc-item.locked {
  color: #888888;
  cursor: not-allowed;
  background-color: #f7f7f7;
}

.doc-id {
  font-family: var(--font-mono);
  font-weight: bold;
  font-size: 10px;
  flex: none;
}

.doc-title {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.badge-pinned {
  font-size: 9px;
  background-color: #fef08a;
  color: #854d0e;
  padding: 1px 4px;
  border-radius: 2px;
  font-weight: bold;
  border: 1px solid #ca8a04;
  flex: none;
}

.doc-item.active .badge-pinned {
  background-color: #facc15;
  color: #000000;
}

.doc-lock {
  font-size: 10px;
  flex: none;
}

/* Viewport & Paper Sheets */
.doc-viewport {
  flex: 1;
  background-color: #4a545c; /* retro desk slate background */
  overflow-y: auto;
  position: relative;
  padding: 16px;
}

.dossier-scroll-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100%;
}

/* Hint Banner */
.doc-hint-banner {
  max-width: 720px;
  width: 100%;
  background-color: #fef9c3;
  border: 1px solid #ca8a04;
  box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.25);
  padding: 8px 12px;
  margin-bottom: 14px;
  display: flex;
  gap: 8px;
  font-size: 11px;
  color: #713f12;
  box-sizing: border-box;
}

.hint-pin {
  font-size: 14px;
  flex: none;
}

.hint-content {
  flex: 1;
}

.hint-text {
  margin-top: 2px;
  color: #854d0e;
}

/* Dossier Paper Sheet */
.dossier-paper {
  max-width: 720px;
  width: 100%;
  background-color: #fcfbf7; /* authentic ivory / aged police dossier paper */
  border: 1px solid #c7c2b6;
  box-shadow: 2px 3px 8px rgba(0, 0, 0, 0.4);
  padding: 28px 38px 24px 38px;
  margin-bottom: 20px;
  position: relative;
  box-sizing: border-box;
  font-family: var(--font-mono);
  font-size: 12.5px;
  line-height: 1.65;
  color: #1a1a1a;
}

.paper-header-strip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #222222;
  padding-bottom: 4px;
  margin-bottom: 16px;
  font-size: 9.5px;
  color: #555555;
  font-weight: bold;
  letter-spacing: 0.5px;
  user-select: none;
}

.sheet-watermark {
  position: absolute;
  top: 42px;
  right: 38px;
  font-size: 9px;
  color: rgba(120, 120, 120, 0.35);
  letter-spacing: 1.5px;
  pointer-events: none;
  font-weight: bold;
  user-select: none;
}

.paper-footer-strip {
  margin-top: 24px;
  padding-top: 8px;
  border-top: 1px dashed #aaaaaa;
  text-align: center;
  font-size: 10px;
  color: #777777;
  user-select: none;
}

/* Page HTML content typography & components */
.page-html-content :deep(.doc-header-block) {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.page-html-content :deep(.doc-emblem-text) {
  font-weight: bold;
  font-size: 11px;
  line-height: 1.35;
  color: #111111;
}

.page-html-content :deep(.doc-meta-right) {
  text-align: right;
  font-size: 10.5px;
  color: #333333;
  line-height: 1.35;
}

.page-html-content :deep(.doc-stamp-box) {
  border: 2px solid #1e3a8a;
  color: #1e3a8a;
  display: inline-block;
  padding: 4px 8px;
  font-weight: bold;
  font-size: 10px;
  line-height: 1.25;
  transform: rotate(-2deg);
  margin-bottom: 14px;
  box-shadow: 1px 1px 0 rgba(30, 58, 138, 0.3);
  text-align: center;
}

.page-html-content :deep(.doc-title) {
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  margin: 12px 0 16px 0;
  padding-bottom: 4px;
  border-bottom: 2px solid #222222;
  letter-spacing: 0.5px;
}

.page-html-content :deep(.doc-section-title) {
  font-size: 12px;
  font-weight: bold;
  margin: 14px 0 8px 0;
  padding-bottom: 3px;
  border-bottom: 1px dotted #888888;
  color: #111111;
}

.page-html-content :deep(.doc-paragraph) {
  margin-bottom: 12px;
  text-align: justify;
  line-height: 1.65;
}

.page-html-content :deep(.doc-list) {
  margin: 8px 0 14px 22px;
  line-height: 1.6;
}

.page-html-content :deep(.doc-list li) {
  margin-bottom: 4px;
}

.page-html-content :deep(.doc-key-facts) {
  background-color: #f5f3ec;
  border: 1px solid #bbb5a8;
  padding: 10px 14px;
  margin: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
}

.page-html-content :deep(.fact-row) {
  display: flex;
  gap: 6px;
}

.page-html-content :deep(.fact-row strong) {
  flex: none;
  min-width: 140px;
}

.page-html-content :deep(.person-data-box) {
  background-color: #f7f6f0;
  border-left: 3px solid #0a246a;
  padding: 8px 12px;
  margin-bottom: 12px;
  font-size: 11.5px;
  line-height: 1.5;
}

.page-html-content :deep(.billing-info-box) {
  background-color: #f0f4f8;
  border-left: 3px solid #2563eb;
  padding: 8px 12px;
  margin-bottom: 12px;
  font-size: 11.5px;
  line-height: 1.5;
}

.page-html-content :deep(.invoice-box) {
  background-color: #fdfdfc;
  border: 1px solid #888888;
  padding: 12px;
  margin: 12px 0;
}

.page-html-content :deep(.invoice-top) {
  display: flex;
  justify-content: space-between;
  line-height: 1.4;
  font-size: 11px;
}

.page-html-content :deep(.doc-note-handwritten) {
  margin-top: 14px;
  background-color: #fffde7;
  border: 1px dashed #ca8a04;
  padding: 10px 14px;
  box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.15);
}

.page-html-content :deep(.handwritten-title) {
  font-size: 10.5px;
  color: #666666;
  margin-bottom: 4px;
}

.page-html-content :deep(.handwritten-text) {
  font-family: 'Comic Sans MS', 'Segoe Print', cursive, sans-serif;
  font-size: 14px;
  color: #1e3a8a;
  font-weight: bold;
}

.page-html-content :deep(.doc-footer-notice) {
  margin-top: 12px;
  padding: 8px 10px;
  background-color: #fef2f2;
  border-left: 3px solid #b91c1c;
  font-size: 11px;
  color: #450a0a;
  line-height: 1.45;
}

/* Dossier Retro Table */
.page-html-content :deep(.dossier-table) {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
  font-size: 11px;
  line-height: 1.4;
  background-color: #ffffff;
}

.page-html-content :deep(.dossier-table th) {
  background-color: #dedad2;
  border: 1px solid #777777;
  padding: 5px 8px;
  font-weight: bold;
  text-align: left;
  color: #111111;
}

.page-html-content :deep(.dossier-table td) {
  border: 1px solid #999999;
  padding: 4px 8px;
  vertical-align: top;
  color: #222222;
}

.page-html-content :deep(.dossier-table tr:nth-child(even)) {
  background-color: #f7f6f0;
}

/* Signatures */
.page-html-content :deep(.doc-signatures) {
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.page-html-content :deep(.doc-sig-right) {
  margin-left: auto;
  text-align: center;
  font-size: 11px;
}

.page-html-content :deep(.doc-sig-left) {
  text-align: center;
  font-size: 11px;
}

.page-html-content :deep(.sig-line) {
  margin-top: 20px;
  border-top: 1px dotted #444444;
  padding-top: 4px;
  font-weight: bold;
  font-style: italic;
}

.page-html-content :deep(.doc-signatures-grid) {
  margin-top: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 20px;
  font-size: 11px;
}

.page-html-content :deep(.doc-signatures-grid div) {
  border-bottom: 1px dotted #666;
  padding-bottom: 4px;
}

/* Highlighting Marks */
.page-html-content :deep(.marker-highlight) {
  padding: 1px 3px;
  border-radius: 2px;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.page-html-content :deep(.marker-highlight:hover) {
  filter: brightness(0.92);
}

.page-html-content :deep(.marker-yellow) {
  background-color: #f5e642 !important;
  color: #111111 !important;
  border-bottom: 2px solid #ca8a04;
}

.page-html-content :deep(.marker-red) {
  background-color: #fca5a5 !important;
  color: #111111 !important;
  border-bottom: 2px solid #dc2626;
}

.page-html-content :deep(.marker-blue) {
  background-color: #93c5fd !important;
  color: #111111 !important;
  border-bottom: 2px solid #2563eb;
}

/* Locked view */
.doc-locked-notice {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #ffffff;
  background-color: #374151;
  padding: 24px;
}

.locked-icon {
  font-size: 42px;
  margin-bottom: 12px;
}

.doc-locked-notice h3 {
  font-size: 14px;
  margin-bottom: 8px;
  color: #fca5a5;
  letter-spacing: 1px;
}

.doc-locked-notice p {
  max-width: 480px;
  font-size: 12px;
  line-height: 1.5;
  color: #d1d5db;
}

/* Statusbar */
.window-statusbar {
  user-select: none;
  font-size: 11px;
  padding: 3px 8px;
  display: flex;
  align-items: center;
}

.status-sep {
  margin: 0 8px;
  color: #808080;
}

.status-color-badge {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 2px;
  font-weight: bold;
  border: 1px solid #777777;
}

.badge-yellow {
  background-color: #fef08a;
  color: #854d0e;
}

.badge-red {
  background-color: #fecaca;
  color: #991b1b;
}

.badge-blue {
  background-color: #bfdbfe;
  color: #1e40af;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
