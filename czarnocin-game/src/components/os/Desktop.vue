<template>
  <div
    class="desktop-area"
    @click="deselectAll"
    @contextmenu.prevent="openContextMenu"
  >
    <!-- Siatka ikon systemowych po lewej stronie -->
    <div class="desktop-icons">
      <div
        v-for="icon in desktopIcons"
        :key="icon.id"
        class="desktop-icon"
        :class="{ selected: selectedIconId === icon.id }"
        :style="{ top: `${icon.top}px` }"
        @click.stop="selectIcon(icon.id)"
        @dblclick.stop="handleIconDblClick(icon.targetAppId)"
      >
        <img
          :src="icon.iconSrc"
          :alt="icon.label"
          class="desktop-icon-img"
          draggable="false"
        />
        <span class="desktop-icon-label">{{ icon.label }}</span>
      </div>
    </div>

    <!-- Kontener wirtualnych okien dochodzeniowych -->
    <div class="desktop-windows-viewport">
      <slot></slot>
    </div>

    <!-- Menu kontekstowe pulpitu -->
    <ContextMenu
      :is-open="isContextMenuOpen"
      :position="contextMenuPos"
      :items="contextMenuItems"
      @close="isContextMenuOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { WindowAppId } from '../../types/os.types';
import { useWindowManagerStore } from '../../stores/windowManagerStore';
import { useSoundEffects } from '../../composables/useSoundEffects';
import ContextMenu, { type ContextMenuItem } from './ContextMenu.vue';

interface DesktopIconConfig {
  id: string;
  label: string;
  iconSrc: string;
  targetAppId?: WindowAppId;
  top: number;
}

const windowManager = useWindowManagerStore();
const { playSound } = useSoundEffects();

const selectedIconId = ref<string | null>(null);
const isContextMenuOpen = ref(false);
const contextMenuPos = ref({ x: 0, y: 0 });

const desktopIcons: DesktopIconConfig[] = [
  {
    id: 'case-folder',
    label: 'Akta sprawy',
    iconSrc: '/assets/icons/case_folder_32.png',
    targetAppId: 'case-viewer',
    top: 16,
  },
  {
    id: 'ksip',
    label: 'Baza KSIP',
    iconSrc: '/assets/icons/ksip_terminal_32.png',
    targetAppId: 'ksip',
    top: 96,
  },
  {
    id: 'floppy',
    label: 'Stacja A:',
    iconSrc: '/assets/icons/floppy_35_32.png',
    top: 176,
  },
  {
    id: 'mail',
    label: 'Poczta służbowa',
    iconSrc: '/assets/icons/mail_32.png',
    targetAppId: 'mail',
    top: 256,
  },
  {
    id: 'notes',
    label: 'C:\\TEMP\\NOTATKI',
    iconSrc: '/assets/icons/notepad_32.png',
    targetAppId: 'notepad',
    top: 336,
  },
  {
    id: 'photos',
    label: 'Zdjęcia oględzin',
    iconSrc: '/assets/icons/photos_32.png',
    targetAppId: 'photo-viewer',
    top: 416,
  },
  {
    id: 'recycle-bin',
    label: 'Kosz',
    iconSrc: '/assets/icons/recycle_bin_32.png',
    top: 496,
  },
];

const selectIcon = (id: string) => {
  playSound('click');
  selectedIconId.value = id;
};

const deselectAll = () => {
  selectedIconId.value = null;
  isContextMenuOpen.value = false;
};

const handleIconDblClick = (appId?: WindowAppId) => {
  playSound('click');
  if (appId) {
    windowManager.openWindow(appId);
  } else {
    playSound('floppy_seek');
  }
};

const openContextMenu = (e: MouseEvent) => {
  contextMenuPos.value = { x: e.offsetX, y: e.offsetY };
  isContextMenuOpen.value = true;
};

const contextMenuItems: ContextMenuItem[] = [
  {
    label: 'Uporządkuj ikony',
    action: () => playSound('click'),
  },
  {
    label: 'Odśwież pulpit',
    action: () => playSound('click'),
  },
  { separator: true },
  {
    label: 'Właściwości ekranu...',
    action: () => playSound('click'),
  },
];
</script>

<style scoped>
.desktop-area {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 32px;
  background-color: #12262b;
  overflow: hidden;
}

.desktop-icons {
  position: absolute;
  top: 0;
  left: 14px;
  width: 84px;
  height: 100%;
  pointer-events: auto;
  z-index: 1;
}

.desktop-windows-viewport {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: auto;
}
</style>
