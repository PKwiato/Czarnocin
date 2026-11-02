<template>
  <footer class="taskbar">
    <!-- Przycisk Start z logo retro -->
    <button
      type="button"
      class="btn-retro start-btn"
      :class="{ active: isStartMenuOpen }"
      @click="toggleStartMenu"
    >
      <span class="start-flag">🪟</span>
      <strong>Start</strong>
    </button>

    <!-- Lista otwartych programów na pasku zadań -->
    <div class="taskbar-items">
      <button
        v-for="win in openWindows"
        :key="win.id"
        type="button"
        class="btn-retro taskbar-item-btn"
        :class="{ active: activeWindowId === win.id && !win.isMinimized }"
        @click="handleTaskbarClick(win.id)"
      >
        <img
          v-if="win.icon"
          :src="win.icon"
          :alt="win.title"
          class="taskbar-item-icon"
        />
        <span class="taskbar-item-title">{{ win.title }}</span>
      </button>
    </div>

    <!-- Zasobnik systemowy -->
    <SystemTray :crt-active="crtActive" @toggle-crt="$emit('toggle-crt')" />

    <!-- Rozwijane Menu Start -->
    <StartMenu
      :is-open="isStartMenuOpen"
      @close="isStartMenuOpen = false"
      @logout="$emit('logout')"
    />
  </footer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { WindowAppId } from '../../types/os.types';
import { useWindowManagerStore } from '../../stores/windowManagerStore';
import { useSoundEffects } from '../../composables/useSoundEffects';
import SystemTray from './SystemTray.vue';
import StartMenu from './StartMenu.vue';

defineProps<{
  crtActive: boolean;
}>();

defineEmits<{
  (e: 'toggle-crt'): void;
  (e: 'logout'): void;
}>();

const windowManager = useWindowManagerStore();
const { playSound } = useSoundEffects();

const isStartMenuOpen = ref(false);

const openWindows = computed(() => windowManager.taskbarWindowsList);
const activeWindowId = computed(() => windowManager.activeWindowId);

const toggleStartMenu = () => {
  playSound('click');
  isStartMenuOpen.value = !isStartMenuOpen.value;
};

const handleTaskbarClick = (id: WindowAppId) => {
  playSound('click');
  windowManager.toggleWindow(id);
};
</script>

<style scoped>
.start-flag {
  font-size: 13px;
  line-height: 1;
}

.taskbar-item-icon {
  width: 14px;
  height: 14px;
  object-fit: contain;
  margin-right: 4px;
  flex-shrink: 0;
}

.taskbar-item-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
