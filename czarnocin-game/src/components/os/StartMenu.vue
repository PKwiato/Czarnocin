<template>
  <div v-if="isOpen" class="start-menu border-outset" @click.stop>
    <!-- Pionowy niebieski pasek Windows 2000 -->
    <div class="start-sidebar">
      <span class="start-sidebar-text"><b>KSIP</b> 2002</span>
    </div>

    <!-- Lista programów -->
    <div class="start-programs">
      <div class="start-user-info">
        <strong>{{ authStore.fullName }}</strong>
        <span class="start-rank">{{ authStore.rankTitle }}</span>
      </div>

      <hr class="start-divider" />

      <button
        v-for="item in menuItems"
        :key="item.id"
        type="button"
        class="start-item"
        @click="openApp(item.id)"
      >
        <img :src="item.icon" :alt="item.name" class="start-item-icon" />
        <span class="start-item-title">{{ item.name }}</span>
      </button>

      <hr class="start-divider" />

      <button type="button" class="start-item" @click="openNotepad">
        <img :src="`${BASE_URL}assets/icons/notepad_16.png`" alt="Notatki" class="start-item-icon" />
        <span class="start-item-title">C:\TEMP\NOTATKI</span>
      </button>

      <button type="button" class="start-item" @click="handleLogout">
        <span class="start-item-icon-text">🔒</span>
        <span class="start-item-title">Wyloguj ze stanowiska...</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WindowAppId } from '../../types/os.types';
import { useAuthStore } from '../../stores/authStore';
import { useWindowManagerStore } from '../../stores/windowManagerStore';
import { useSoundEffects } from '../../composables/useSoundEffects';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'logout'): void;
}>();

const authStore = useAuthStore();
const windowManager = useWindowManagerStore();
const { playSound } = useSoundEffects();
const BASE_URL = import.meta.env.BASE_URL;

const menuItems: Array<{ id: WindowAppId; name: string; icon: string }> = [
  { id: 'case-viewer', name: 'Akta Sprawy (Ds. 112/02)', icon: './assets/icons/case_folder_16.png' },
  { id: 'ksip', name: 'Baza KSIP — Wyszukiwarka', icon: './assets/icons/ksip_terminal_16.png' },
  { id: 'timeline', name: 'Generator Osi Czasu', icon: './assets/icons/timeline_16.png' },
  { id: 'warrant', name: 'Wniosek o Tymczasowy Areszt', icon: './assets/icons/warrant_16.png' },
  { id: 'field-dispatcher', name: 'Zlecenia w Terenie', icon: './assets/icons/dispatcher_16.png' },
  { id: 'photo-viewer', name: 'Zdjęcia Oględzin (IMG)', icon: './assets/icons/photos_16.png' },
  { id: 'mail', name: 'Poczta Służbowa', icon: './assets/icons/mail_16.png' },
];

const openApp = (id: WindowAppId) => {
  playSound('click');
  windowManager.openWindow(id);
  emit('close');
};

const openNotepad = () => {
  playSound('click');
  windowManager.openWindow('notepad');
  emit('close');
};

const handleLogout = () => {
  playSound('click');
  emit('logout');
  emit('close');
};
</script>

<style scoped>
.start-menu {
  position: absolute;
  left: 2px;
  bottom: 32px;
  width: 260px;
  background-color: var(--win-gray);
  display: flex;
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
  z-index: 10005;
}

.start-sidebar {
  width: 28px;
  background: linear-gradient(180deg, #0a246a, #000080);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 12px;
}

.start-sidebar-text {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  color: #ffffff;
  font-family: var(--font-os);
  font-size: 13px;
  letter-spacing: 2px;
}

.start-programs {
  flex: 1;
  padding: 4px;
  display: flex;
  flex-direction: column;
}

.start-user-info {
  padding: 6px 8px;
  font-size: 11px;
  display: flex;
  flex-direction: column;
  background-color: var(--win-gray-light);
  border: 1px inset #ffffff;
  margin-bottom: 4px;
}

.start-rank {
  color: #0a246a;
  font-weight: 500;
  font-size: 10px;
}

.start-divider {
  border: none;
  border-top: 1px solid #808080;
  border-bottom: 1px solid #ffffff;
  margin: 3px 2px;
}

.start-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 8px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 11px;
  color: #111111;
  border-radius: 1px;
}

.start-item:hover {
  background-color: #0a246a;
  color: #ffffff;
}

.start-item-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.start-item-icon-text {
  font-size: 14px;
  width: 16px;
  text-align: center;
}

.start-item-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
