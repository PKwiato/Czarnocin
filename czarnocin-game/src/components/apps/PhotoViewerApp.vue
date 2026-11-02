<template>
  <div class="photo-viewer-app">
    <!-- Pasek narzędzi -->
    <div class="win-toolbar photo-toolbar">
      <span class="toolbar-label">Powiększenie:</span>
      <button
        type="button"
        class="btn-retro"
        :class="{ active: zoom === 100 }"
        @click="zoom = 100"
      >
        100%
      </button>
      <button
        type="button"
        class="btn-retro"
        :class="{ active: zoom === 200 }"
        @click="zoom = 200"
      >
        200%
      </button>
      <button
        type="button"
        class="btn-retro"
        :class="{ active: zoom === 400 }"
        @click="zoom = 400"
      >
        400%
      </button>

      <button
        type="button"
        class="btn-retro pin-photo-btn"
        :disabled="!currentPhoto"
        @click="handlePinPhoto"
      >
        📷 Dołącz odbitkę do akt
      </button>

      <span v-if="feedbackMsg" class="pin-feedback">{{ feedbackMsg }}</span>
    </div>

    <!-- Główny widok -->
    <div class="viewer-main">
      <!-- Miniatury kadrów -->
      <aside class="thumbnails-sidebar border-inset">
        <div class="sidebar-header">Kadry (Olympus 2.0MP)</div>
        <div class="thumbnails-list">
          <div
            v-for="photo in photos"
            :key="photo.id"
            class="thumb-item"
            :class="{ active: currentPhoto?.id === photo.id }"
            @click="selectPhoto(photo)"
          >
            <div class="thumb-badge">{{ photo.id }}</div>
            <div class="thumb-title">{{ photo.title }}</div>
          </div>
        </div>
      </aside>

      <!-- Okno podglądu zdjęcia -->
      <section class="photo-viewport border-inset">
        <div v-if="currentPhoto" class="photo-display-container">
          <div class="photo-wrapper" :style="{ transform: `scale(${zoom / 100})` }">
            <img
              :src="`/assets/cases/case-01/photos/${currentPhoto.fileName}`"
              :alt="currentPhoto.title"
              class="crime-scene-photo"
              draggable="false"
              @error="handleImgError"
            />
          </div>

          <!-- Metadane zdjęcia z 2002 roku -->
          <div class="photo-metadata-card border-groove">
            <div class="meta-row"><strong>Kadr:</strong> {{ currentPhoto.id }} · {{ currentPhoto.title }}</div>
            <div class="meta-row"><strong>Data wykonania:</strong> {{ currentPhoto.date }}</div>
            <div class="meta-row"><strong>Opis:</strong> {{ currentPhoto.description }}</div>
            <div class="meta-row">
              <strong>Notatka technika (st. asp. A. Lasota):</strong>
              <em>{{ currentPhoto.technicianNotes }}</em>
            </div>
            <div v-if="currentPhoto.isTrap" class="meta-trap-hint">
              ⚠️ Uwaga: Biegły ocenia bieżnik jako powszechne obuwie robocze (brak cech indywidualnych).
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Pasek statusu -->
    <footer class="window-statusbar">
      <span>Zdjęcie: {{ currentPhoto?.id || '---' }}</span>
      <span class="status-sep">|</span>
      <span>Plik: {{ currentPhoto?.fileName || '---' }}</span>
      <span class="status-sep">|</span>
      <span>Aparat: Olympus C-2000Z</span>
      <span class="status-sep">|</span>
      <span style="margin-left: auto">Skala: {{ zoom }}%</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { CasePhoto } from '../../types/case.types';
import type { EvidenceItem } from '../../types/evidence.types';
import photosJson from '../../data/cases/case-01/photos.json';
import { useEvidenceStore } from '../../stores/evidenceStore';
import { useSoundEffects } from '../../composables/useSoundEffects';

const photos = ref<CasePhoto[]>(photosJson as CasePhoto[]);
const currentPhoto = ref<CasePhoto | null>(photos.value[0] || null);
const zoom = ref(100);
const feedbackMsg = ref('');

const evidenceStore = useEvidenceStore();
const { playSound } = useSoundEffects();

const selectPhoto = (photo: CasePhoto) => {
  playSound('click');
  currentPhoto.value = photo;
  feedbackMsg.value = '';
};

const handleImgError = (e: Event) => {
  // W przypadku braku pliku graficznego, wyświetl zastępczy placeholder
  (e.target as HTMLImageElement).style.display = 'none';
};

const handlePinPhoto = () => {
  if (!currentPhoto.value) return;

  const item: EvidenceItem = {
    id: `ev-${currentPhoto.value.id.toLowerCase()}-${Date.now()}`,
    caseId: 'case-01',
    documentId: currentPhoto.value.id,
    type: 'case_photo',
    quote: `[ZDJĘCIE OGLĘDZIN ${currentPhoto.value.id}] ${currentPhoto.value.title}. ${currentPhoto.value.description} Notatka technika: ${currentPhoto.value.technicianNotes}`,
    color: currentPhoto.value.isTrap ? 'neutral' : 'yellow',
    sourceTitle: `Fotografia ${currentPhoto.value.id}: ${currentPhoto.value.title}`,
    targetRequirement: currentPhoto.value.id === 'IMG-09' ? 'material_trace' : 'presence',
    createdAt: new Date().toISOString(),
    metadata: {
      fileName: currentPhoto.value.fileName,
      isTrap: currentPhoto.value.isTrap,
    },
  };

  const added = evidenceStore.addEvidence(item);
  if (added) {
    playSound('printer');
    feedbackMsg.value = 'Dołączono odbitkę!';
    setTimeout(() => {
      feedbackMsg.value = '';
    }, 2500);
  } else {
    feedbackMsg.value = 'Zdjęcie jest już w aktach.';
  }
};

onMounted(() => {
  if (photos.value.length > 0) {
    currentPhoto.value = photos.value[0];
  }
});
</script>

<style scoped>
.photo-viewer-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--win-gray);
}

.photo-toolbar {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 4px 6px;
  border-bottom: 1px solid #808080;
}

.toolbar-label {
  font-size: 11px;
}

.pin-photo-btn {
  margin-left: auto;
  font-weight: bold;
  font-size: 11px;
  min-height: 22px;
}

.pin-feedback {
  font-size: 11px;
  font-weight: bold;
  color: #0a5a1a;
}

.viewer-main {
  flex: 1;
  display: flex;
  gap: 6px;
  padding: 6px;
  min-height: 0;
  overflow: hidden;
}

.thumbnails-sidebar {
  width: 180px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  overflow-y: auto;
}

.sidebar-header {
  padding: 4px 6px;
  background-color: #bdb9b0;
  font-size: 10px;
  font-weight: bold;
  border-bottom: 1px solid #808080;
}

.thumbnails-list {
  display: flex;
  flex-direction: column;
}

.thumb-item {
  padding: 4px 6px;
  font-size: 11px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border-bottom: 1px dotted #e0e0e0;
}

.thumb-item:hover {
  background-color: #f0f0f0;
}

.thumb-item.active {
  background-color: #0a246a;
  color: #ffffff;
}

.thumb-badge {
  font-weight: bold;
  font-family: var(--font-mono);
  font-size: 10px;
}

.thumb-title {
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.photo-viewport {
  flex: 1;
  background-color: #1a1a1a;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

.photo-display-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.photo-wrapper {
  transform-origin: top center;
  transition: transform 0.15s ease-out;
  margin-bottom: 12px;
}

.crime-scene-photo {
  max-width: 100%;
  max-height: 280px;
  border: 2px solid #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
  display: block;
  background-color: #222222;
}

.photo-metadata-card {
  width: 100%;
  background-color: #f3f1e8;
  padding: 8px 12px;
  box-sizing: border-box;
  font-family: var(--font-mono);
  font-size: 11px;
  color: #111111;
}

.meta-row {
  margin-bottom: 4px;
}

.meta-trap-hint {
  margin-top: 6px;
  padding: 4px 6px;
  background-color: #fff0b0;
  border: 1px solid #7a0a14;
  color: #7a0a14;
  font-weight: bold;
}

.status-sep {
  margin: 0 6px;
  color: #808080;
}
</style>
