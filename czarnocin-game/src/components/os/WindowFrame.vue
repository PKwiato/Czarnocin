<template>
  <div
    v-show="win && win.isOpen && !win.isMinimized"
    ref="frameEl"
    class="window-frame"
    :class="{ active: isActive, resizing: isResizing, dragging: isDragging }"
    :style="windowStyle"
    @mousedown="bringToFront"
  >
    <!-- Belka tytułowa okna z gradientem retro -->
    <header
      class="window-titlebar"
      :class="{ inactive: !isActive }"
      @mousedown="onTitleMouseDown"
      @dblclick="onTitleDblClick"
    >
      <div class="window-title-content">
        <img
          v-if="win.icon"
          :src="win.icon"
          :alt="win.title"
          class="window-title-icon"
          draggable="false"
        />
        <span>{{ win.title }}</span>
      </div>

      <div class="window-controls">
        <button
          v-if="allowMinimize"
          type="button"
          class="win-btn-control"
          title="Minimalizuj"
          @click.stop="minimize"
        >
          _
        </button>
        <button
          v-if="allowMaximize"
          type="button"
          class="win-btn-control"
          title="Maksymalizuj / Przywróć"
          @click.stop="toggleMaximize"
        >
          {{ win.isMaximized ? '❐' : '□' }}
        </button>
        <button
          v-if="allowClose"
          type="button"
          class="win-btn-control"
          title="Zamknij"
          @click.stop="close"
        >
          ✕
        </button>
      </div>
    </header>

    <!-- Zawartość okna -->
    <div class="window-body">
      <slot></slot>
    </div>

    <!-- Dynamiczne uchwyty do zmiany rozmiaru w klasycznym stylu Windows 95/98/2000 -->
    <template v-if="allowResize && !win.isMaximized">
      <div
        class="win-resize-handle win-resize-n"
        title=""
        @mousedown.stop.prevent="startResize($event, 'n')"
      />
      <div
        class="win-resize-handle win-resize-s"
        title=""
        @mousedown.stop.prevent="startResize($event, 's')"
      />
      <div
        class="win-resize-handle win-resize-w"
        title=""
        @mousedown.stop.prevent="startResize($event, 'w')"
      />
      <div
        class="win-resize-handle win-resize-e"
        title=""
        @mousedown.stop.prevent="startResize($event, 'e')"
      />
      <div
        class="win-resize-handle win-resize-nw"
        title=""
        @mousedown.stop.prevent="startResize($event, 'nw')"
      />
      <div
        class="win-resize-handle win-resize-ne"
        title=""
        @mousedown.stop.prevent="startResize($event, 'ne')"
      />
      <div
        class="win-resize-handle win-resize-sw"
        title=""
        @mousedown.stop.prevent="startResize($event, 'sw')"
      />
      <div
        class="win-resize-handle win-resize-se"
        title=""
        @mousedown.stop.prevent="startResize($event, 'se')"
      >
        <!-- Klasyczny ząbkowany grip narożny Windows 98/2000 w prawym dolnym rogu -->
        <div class="win-resize-grip" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="9" y="1" width="2" height="2" fill="#FFFFFF"/>
            <rect x="10" y="2" width="2" height="2" fill="#808080"/>
            <rect x="5" y="5" width="2" height="2" fill="#FFFFFF"/>
            <rect x="6" y="6" width="2" height="2" fill="#808080"/>
            <rect x="9" y="5" width="2" height="2" fill="#FFFFFF"/>
            <rect x="10" y="6" width="2" height="2" fill="#808080"/>
            <rect x="1" y="9" width="2" height="2" fill="#FFFFFF"/>
            <rect x="2" y="10" width="2" height="2" fill="#808080"/>
            <rect x="5" y="9" width="2" height="2" fill="#FFFFFF"/>
            <rect x="6" y="10" width="2" height="2" fill="#808080"/>
            <rect x="9" y="9" width="2" height="2" fill="#FFFFFF"/>
            <rect x="10" y="10" width="2" height="2" fill="#808080"/>
          </svg>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onUnmounted } from 'vue';
import type { WindowAppId } from '../../types/os.types';
import { useWindowManagerStore } from '../../stores/windowManagerStore';
import { useSoundEffects } from '../../composables/useSoundEffects';
import { useResizable } from '../../composables/useResizable';

const props = withDefaults(
  defineProps<{
    windowId: WindowAppId;
    allowMinimize?: boolean;
    allowMaximize?: boolean;
    allowClose?: boolean;
    allowResize?: boolean;
    minWidth?: number;
    minHeight?: number;
  }>(),
  {
    allowMinimize: true,
    allowMaximize: true,
    allowClose: true,
    allowResize: true,
    minWidth: 260,
    minHeight: 140,
  }
);

const windowManager = useWindowManagerStore();
const { playSound } = useSoundEffects();
const frameEl = ref<HTMLElement | null>(null);

const win = computed(() => windowManager.windows[props.windowId]);
const isActive = computed(() => windowManager.activeWindowId === props.windowId);

/**
 * Zwraca współczynnik skalowania ekranu wirtualnego monitora (1280x800).
 * Zapewnia, że ruch myszą jest zsynchronizowany z oknem 1:1 przy dowolnej rozdzielczości.
 */
const getVirtualScale = (): number => {
  const virtualScreen = frameEl.value?.closest('.virtual-screen') as HTMLElement | null;
  if (!virtualScreen) return 1;
  const rect = virtualScreen.getBoundingClientRect();
  return (rect.width / 1280) || 1;
};

const windowStyle = computed(() => {
  if (!win.value) return {};

  if (win.value.isMaximized) {
    return {
      top: '0px',
      left: '0px',
      width: '100%',
      height: '100%',
      zIndex: win.value.zIndex,
    };
  }

  return {
    top: `${win.value.position.y}px`,
    left: `${win.value.position.x}px`,
    width: `${win.value.size.width}px`,
    height: `${win.value.size.height}px`,
    zIndex: win.value.zIndex,
  };
});

const bringToFront = () => {
  windowManager.focusWindow(props.windowId);
};

const minimize = () => {
  playSound('click');
  windowManager.minimizeWindow(props.windowId);
};

const toggleMaximize = () => {
  playSound('click');
  if (win.value) {
    win.value.isMaximized = !win.value.isMaximized;
    windowManager.focusWindow(props.windowId);
  }
};

const close = () => {
  playSound('click');
  windowManager.closeWindow(props.windowId);
};

// ==========================================
// Obsługa przesuwania okna (Przeciąganie belki)
// ==========================================
const isDragging = ref(false);
let startDragMouseX = 0;
let startDragMouseY = 0;
let startDragPos = { x: 0, y: 0 };

const onTitleMouseDown = (e: MouseEvent) => {
  if (win.value?.isMaximized) return;
  if ((e.target as HTMLElement).closest('.win-btn-control')) return;

  bringToFront();
  playSound('click');

  isDragging.value = true;
  startDragMouseX = e.clientX;
  startDragMouseY = e.clientY;
  startDragPos = { ...win.value.position };

  document.body.style.userSelect = 'none';

  window.addEventListener('mousemove', onTitleMouseMove);
  window.addEventListener('mouseup', onTitleMouseUp);
};

const onTitleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !win.value) return;

  const scale = getVirtualScale();
  const deltaX = (e.clientX - startDragMouseX) / scale;
  const deltaY = (e.clientY - startDragMouseY) / scale;

  // Granice pulpitu (1280 x 768 bez paska zadań)
  const newX = Math.max(0, Math.min(1280 - 120, startDragPos.x + deltaX));
  const newY = Math.max(0, Math.min(768 - 30, startDragPos.y + deltaY));

  windowManager.updatePosition(props.windowId, {
    x: Math.round(newX),
    y: Math.round(newY),
  });
};

const onTitleMouseUp = () => {
  if (!isDragging.value) return;
  isDragging.value = false;
  document.body.style.userSelect = '';
  window.removeEventListener('mousemove', onTitleMouseMove);
  window.removeEventListener('mouseup', onTitleMouseUp);
};

const onTitleDblClick = (e: MouseEvent) => {
  if ((e.target as HTMLElement).closest('.win-btn-control')) return;
  if (props.allowMaximize) {
    toggleMaximize();
  }
};

// ==========================================
// Obsługa dynamicznego resizowania okna retro
// ==========================================
const { isResizing, startResize, cleanup: cleanupResize } = useResizable({
  getBounds: () => ({
    x: win.value?.position.x ?? 0,
    y: win.value?.position.y ?? 0,
    width: win.value?.size.width ?? props.minWidth,
    height: win.value?.size.height ?? props.minHeight,
  }),
  onUpdateBounds: (bounds) => {
    windowManager.updateBounds(props.windowId, bounds);
  },
  getScale: getVirtualScale,
  minWidth: props.minWidth,
  minHeight: props.minHeight,
  maxWidth: 1280,
  maxHeight: 768,
  desktopWidth: 1280,
  desktopHeight: 768,
  onStart: () => {
    bringToFront();
    playSound('click');
  },
});

onUnmounted(() => {
  onTitleMouseUp();
  cleanupResize();
});
</script>

<style scoped>
.window-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--win-gray);
  position: relative;
}

.window-frame.resizing,
.window-frame.dragging {
  transition: none !important;
}

/* ==========================================================================
   Klasyczne uchwyty zmiany rozmiaru (Windows 95 / 98 / 2000)
   ========================================================================== */
.win-resize-handle {
  position: absolute;
  z-index: 25;
  user-select: none;
  touch-action: none;
}

/* 4 krawędzie ramki */
.win-resize-n {
  top: -4px;
  left: 10px;
  right: 10px;
  height: 8px;
  cursor: ns-resize;
}

.win-resize-s {
  bottom: -4px;
  left: 10px;
  right: 18px;
  height: 8px;
  cursor: ns-resize;
}

.win-resize-w {
  left: -4px;
  top: 10px;
  bottom: 10px;
  width: 8px;
  cursor: ew-resize;
}

.win-resize-e {
  right: -4px;
  top: 10px;
  bottom: 18px;
  width: 8px;
  cursor: ew-resize;
}

/* 4 narożniki ramki */
.win-resize-nw {
  top: -4px;
  left: -4px;
  width: 14px;
  height: 14px;
  cursor: nwse-resize;
  z-index: 26;
}

.win-resize-ne {
  top: -4px;
  right: -4px;
  width: 14px;
  height: 14px;
  cursor: nesw-resize;
  z-index: 26;
}

.win-resize-sw {
  bottom: -4px;
  left: -4px;
  width: 14px;
  height: 14px;
  cursor: nesw-resize;
  z-index: 26;
}

.win-resize-se {
  bottom: 0px;
  right: 0px;
  width: 16px;
  height: 16px;
  cursor: nwse-resize;
  z-index: 26;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

/* Klasyczny trójkątny uchwyt teksturowany Windows 98/2000 w rogu */
.win-resize-grip {
  width: 12px;
  height: 12px;
  display: block;
  pointer-events: none;
  margin-right: 1px;
  margin-bottom: 1px;
  opacity: 0.85;
}

.win-resize-se:hover .win-resize-grip {
  opacity: 1;
}
</style>
