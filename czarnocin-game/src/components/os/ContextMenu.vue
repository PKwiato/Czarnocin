<template>
  <div
    v-if="isOpen"
    class="context-menu border-outset"
    :style="{ left: `${position.x}px`, top: `${position.y}px` }"
    @click.stop
  >
    <div
      v-for="(item, index) in items"
      :key="index"
    >
      <div v-if="item.separator" class="context-divider"></div>
      <button
        v-else
        type="button"
        class="context-item"
        :disabled="item.disabled"
        @click="handleClick(item.action)"
      >
        <span v-if="item.icon" class="context-icon">{{ item.icon }}</span>
        <span class="context-label">{{ item.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface ContextMenuItem {
  label?: string;
  icon?: string;
  separator?: boolean;
  disabled?: boolean;
  action?: () => void;
}

const props = defineProps<{
  isOpen: boolean;
  position: { x: number; y: number };
  items: ContextMenuItem[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const handleClick = (action?: () => void) => {
  if (action) {
    action();
  }
  emit('close');
};
</script>

<style scoped>
.context-menu {
  position: absolute;
  width: 170px;
  background-color: var(--win-gray);
  padding: 2px;
  z-index: 10010;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
}

.context-divider {
  border-top: 1px solid #808080;
  border-bottom: 1px solid #ffffff;
  margin: 3px 2px;
}

.context-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
  background: none;
  border: none;
  text-align: left;
  font-size: 11px;
  color: #111111;
  cursor: pointer;
}

.context-item:hover:not(:disabled) {
  background-color: #0a246a;
  color: #ffffff;
}

.context-item:disabled {
  color: #808080;
  cursor: not-allowed;
}

.context-icon {
  font-size: 12px;
  width: 14px;
}

.context-label {
  flex: 1;
}
</style>
