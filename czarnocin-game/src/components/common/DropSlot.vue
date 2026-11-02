<template>
  <div
    class="drop-slot"
    :class="{ 'drag-over': isDragOver, empty: items.length === 0 }"
    @dragover.prevent="onDragOver"
    @dragenter.prevent="onDragEnter"
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
  >
    <div v-if="items.length > 0" class="slot-items">
      <EvidenceCard
        v-for="item in items"
        :key="item.id"
        :evidence="item"
        :compact="true"
        :removable="true"
        @remove="$emit('remove', item.id)"
      />
      <span v-if="items.length < maxItems" class="slot-hint">
        + przeciągnij kolejny dowód
      </span>
    </div>

    <div v-else class="slot-placeholder">
      {{ placeholder || '[ przeciągnij dowód z akt sprawy, KSIP lub zdjęć ]' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { EvidenceItem } from '../../types/evidence.types';
import EvidenceCard from './EvidenceCard.vue';
import { useSoundEffects } from '../../composables/useSoundEffects';

const props = withDefaults(
  defineProps<{
    items: EvidenceItem[];
    placeholder?: string;
    requirementId?: string;
    maxItems?: number;
  }>(),
  {
    placeholder: '',
    requirementId: '',
    maxItems: 4,
  }
);

const emit = defineEmits<{
  (e: 'drop-evidence', item: EvidenceItem): void;
  (e: 'remove', id: string): void;
}>();

const { playSound } = useSoundEffects();
const isDragOver = ref(false);

const onDragOver = () => {
  isDragOver.value = true;
};

const onDragEnter = () => {
  isDragOver.value = true;
};

const onDragLeave = () => {
  isDragOver.value = false;
};

const onDrop = (e: DragEvent) => {
  isDragOver.value = false;
  if (!e.dataTransfer) return;

  try {
    const rawData = e.dataTransfer.getData('application/json');
    if (rawData) {
      const item = JSON.parse(rawData) as EvidenceItem;
      playSound('click');
      emit('drop-evidence', item);
    }
  } catch (err) {
    console.warn('Błąd podczas upuszczania dowodu:', err);
  }
};
</script>

<style scoped>
.drop-slot {
  min-height: 28px;
  background-color: #f8f6ee;
  border: 1px dashed #808080;
  padding: 3px 5px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.drop-slot.drag-over {
  background-color: #fffae0;
  border: 2px dashed #0a246a;
}

.slot-items {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  width: 100%;
}

.slot-placeholder {
  font-family: var(--font-mono);
  font-size: 11px;
  color: #767676;
}

.slot-hint {
  font-size: 10px;
  color: #888888;
  font-style: italic;
  margin-left: 4px;
}
</style>
