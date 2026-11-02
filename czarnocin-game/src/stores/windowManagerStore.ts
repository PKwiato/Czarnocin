import { defineStore } from 'pinia';
import type { WindowAppId, WindowState } from '../types/os.types';

export interface WindowManagerStoreState {
  windows: Record<WindowAppId, WindowState>;
  activeWindowId: WindowAppId | null;
  topZIndex: number;
}

const defaultWindows: Record<WindowAppId, WindowState> = {
  'case-viewer': {
    id: 'case-viewer',
    title: 'Marker Aktowy — Akta Śledztwa Ds. 112/02',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    position: { x: 116, y: 16 },
    size: { width: 530, height: 478 },
    icon: '/assets/icons/case_folder_16.png',
  },
  'timeline': {
    id: 'timeline',
    title: 'Generator Osi Czasu — Sprawa 1',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 11,
    position: { x: 664, y: 16 },
    size: { width: 500, height: 262 },
    icon: '/assets/icons/timeline_16.png',
  },
  'ksip': {
    id: 'ksip',
    title: 'Baza KSIP — Wyszukiwarka Krzyżowa',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 12,
    position: { x: 664, y: 292 },
    size: { width: 500, height: 202 },
    icon: '/assets/icons/ksip_terminal_16.png',
  },
  'warrant': {
    id: 'warrant',
    title: 'Wniosek o Aresztowanie — Formularz Sankcji',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 13,
    position: { x: 116, y: 508 },
    size: { width: 640, height: 244 },
    icon: '/assets/icons/warrant_16.png',
  },
  'field-dispatcher': {
    id: 'field-dispatcher',
    title: 'Dyspozytor Zleceń w Terenie',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 14,
    position: { x: 774, y: 508 },
    size: { width: 390, height: 244 },
    icon: '/assets/icons/dispatcher_16.png',
  },
  'photo-viewer': {
    id: 'photo-viewer',
    title: 'Przeglądarka Zdjęć Oględzin (IMG-01 do IMG-12)',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 9,
    position: { x: 200, y: 80 },
    size: { width: 640, height: 480 },
    icon: '/assets/icons/photos_16.png',
  },
  'mail': {
    id: 'mail',
    title: 'Poczta Służbowa — KMP Czarnocin',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 8,
    position: { x: 240, y: 100 },
    size: { width: 600, height: 420 },
    icon: '/assets/icons/mail_16.png',
  },
  'notepad': {
    id: 'notepad',
    title: 'Notatnik Śledczego — C:\\TEMP\\NOTATKI',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 7,
    position: { x: 280, y: 120 },
    size: { width: 480, height: 360 },
    icon: '/assets/icons/notepad_16.png',
  },
};

export const useWindowManagerStore = defineStore('windowManager', {
  state: (): WindowManagerStoreState => ({
    windows: { ...defaultWindows },
    activeWindowId: 'case-viewer',
    topZIndex: 20,
  }),

  getters: {
    openWindowsList(state): WindowState[] {
      return Object.values(state.windows).filter((w) => w.isOpen);
    },

    taskbarWindowsList(state): WindowState[] {
      return Object.values(state.windows).filter((w) => w.isOpen);
    },
  },

  actions: {
    openWindow(id: WindowAppId) {
      const win = this.windows[id];
      if (!win) return;

      win.isOpen = true;
      win.isMinimized = false;
      this.focusWindow(id);
    },

    closeWindow(id: WindowAppId) {
      const win = this.windows[id];
      if (!win) return;

      win.isOpen = false;
      win.isMinimized = false;

      if (this.activeWindowId === id) {
        // Aktywuj okno o najwyższym zIndex spośród otwartych i niezminimalizowanych
        const remaining = this.openWindowsList
          .filter((w) => !w.isMinimized && w.id !== id)
          .sort((a, b) => b.zIndex - a.zIndex);

        this.activeWindowId = remaining.length > 0 ? remaining[0].id : null;
      }
    },

    toggleWindow(id: WindowAppId) {
      const win = this.windows[id];
      if (!win) return;

      if (!win.isOpen) {
        this.openWindow(id);
      } else if (win.isMinimized) {
        this.restoreWindow(id);
      } else if (this.activeWindowId === id) {
        this.minimizeWindow(id);
      } else {
        this.focusWindow(id);
      }
    },

    focusWindow(id: WindowAppId) {
      const win = this.windows[id];
      if (!win) return;

      if (win.isMinimized) {
        win.isMinimized = false;
      }

      this.topZIndex += 1;
      win.zIndex = this.topZIndex;
      this.activeWindowId = id;
    },

    minimizeWindow(id: WindowAppId) {
      const win = this.windows[id];
      if (!win) return;

      win.isMinimized = true;
      if (this.activeWindowId === id) {
        const remaining = this.openWindowsList
          .filter((w) => !w.isMinimized && w.id !== id)
          .sort((a, b) => b.zIndex - a.zIndex);

        this.activeWindowId = remaining.length > 0 ? remaining[0].id : null;
      }
    },

    restoreWindow(id: WindowAppId) {
      const win = this.windows[id];
      if (!win) return;

      win.isMinimized = false;
      this.focusWindow(id);
    },

    updatePosition(id: WindowAppId, position: { x: number; y: number }) {
      const win = this.windows[id];
      if (!win) return;
      win.position = { ...position };
    },

    updateSize(id: WindowAppId, size: { width: number; height: number }) {
      const win = this.windows[id];
      if (!win) return;
      win.size = { ...size };
    },

    updateBounds(
      id: WindowAppId,
      bounds: { x?: number; y?: number; width?: number; height?: number }
    ) {
      const win = this.windows[id];
      if (!win) return;
      if (bounds.x !== undefined) win.position.x = bounds.x;
      if (bounds.y !== undefined) win.position.y = bounds.y;
      if (bounds.width !== undefined) win.size.width = bounds.width;
      if (bounds.height !== undefined) win.size.height = bounds.height;
    },
  },
});
