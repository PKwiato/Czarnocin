<template>
  <div
    class="evidence-card"
    :class="[`color-${evidence.color}`, { compact }]"
    :draggable="draggable"
    @dragstart="onDragStart"
  >
    <div class="evidence-header">
      <span class="evidence-tag" :class="`badge-${evidence.color}`">
        {{ evidence.documentId }}
      </span>
      <span class="evidence-source">{{ evidence.sourceTitle }}</span>
      <button
        v-if="removable"
        type="button"
        class="evidence-remove-btn"
        title="Usuń dowód"
        @click.stop="$emit('remove', evidence.id)"
      >
        ✕
      </button>
    </div>

    <div v-if="!compact" class="evidence-body">
      <p class="evidence-quote">„{{ evidence.quote }}”</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EvidenceItem } from '../../types/evidence.types';

const props = withDefaults(
  defineProps<{
    evidence: EvidenceItem;
    compact?: boolean;
    removable?: boolean;
    draggable?: boolean;
  }>(),
  {
    compact: false,
    removable: false,
    draggable: true,
  }
);

defineEmits<{
  (e: 'remove', id: string): void;
  (e: 'inspect', docId: string): void;
}>();

const onDragStart = (e: DragEvent) => {
  if (!props.draggable || !e.dataTransfer) return;
  e.dataTransfer.setData('application/json', JSON.stringify(props.evidence));
  e.dataTransfer.setData('text/plain', props.evidence.id);
  e.dataTransfer.effectAllowed = 'copyMove';
};
</script>

<style scoped>
.evidence-card {
  background-color: #ffffff;
  border: 1px solid #808080;
  padding: 4px 6px;
  cursor: grab;
  user-select: none;
  font-size: 11px;
  margin-bottom: 4px;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.15);
}

.evidence-card:active {
  cursor: grabbing;
}

.evidence-header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.evidence-tag {
  font-weight: bold;
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 1px 4px;
  border: 1px solid #808080;
  flex-shrink: 0;
}

.badge-yellow {
  background-color: #f2e24a;
  color: #111111;
}

.badge-red {
  background-color: #e8707a;
  color: #111111;
}

.badge-blue {
  background-color: #7fb2f0;
  color: #111111;
}

.badge-neutral {
  background-color: #ece9e0;
  color: #333333;
}

.evidence-source {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 10px;
  color: #444444;
}

.evidence-remove-btn {
  background: none;
  border: none;
  font-size: 10px;
  color: #7a0a14;
  cursor: pointer;
  padding: 0 2px;
}

.evidence-remove-btn:hover {
  font-weight: bold;
}

.evidence-body {
  margin-top: 3px;
  border-top: 1px dashed #d4d0c8;
  padding-top: 3px;
}

.evidence-quote {
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.3;
  color: #222222;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.compact {
  padding: 2px 4px;
  display: inline-flex;
  margin-right: 4px;
  margin-bottom: 2px;
}
</style>
