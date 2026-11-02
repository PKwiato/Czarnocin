import { ref } from 'vue';

export type ResizeDirection =
  | 'n'
  | 's'
  | 'e'
  | 'w'
  | 'nw'
  | 'ne'
  | 'sw'
  | 'se';

export interface WindowRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ResizeConstraints {
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  desktopWidth: number;
  desktopHeight: number;
}

export function getResizeCursor(direction: ResizeDirection): string {
  switch (direction) {
    case 'n':
    case 's':
      return 'ns-resize';
    case 'e':
    case 'w':
      return 'ew-resize';
    case 'nw':
    case 'se':
      return 'nwse-resize';
    case 'ne':
    case 'sw':
      return 'nesw-resize';
  }
}

/**
 * Oblicza nowe współrzędne oraz wymiary okna przy dynamicznym skalowaniu
 * z zachowaniem granic pulpitu oraz minimalnych/maksymalnych wymiarów retro okna.
 */
export function calculateNewBounds(
  direction: ResizeDirection,
  startBounds: WindowRect,
  deltaX: number,
  deltaY: number,
  constraints: ResizeConstraints
): WindowRect {
  const { minWidth, minHeight, maxWidth, maxHeight, desktopWidth, desktopHeight } = constraints;
  let { x, y, width, height } = startBounds;

  // Przesunięcie w osi poziomej (X)
  if (direction.includes('e')) {
    const maxAvailableWidth = desktopWidth - startBounds.x;
    const targetWidth = startBounds.width + deltaX;
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, maxAvailableWidth, targetWidth));
    width = Math.round(clampedWidth);
  } else if (direction.includes('w')) {
    const rightEdge = startBounds.x + startBounds.width;
    const targetX = startBounds.x + deltaX;
    const minX = Math.max(0, rightEdge - maxWidth);
    const maxX = rightEdge - minWidth;
    const clampedX = Math.max(minX, Math.min(maxX, targetX));
    x = Math.round(clampedX);
    width = Math.round(rightEdge - clampedX);
  }

  // Przesunięcie w osi pionowej (Y)
  if (direction.includes('s')) {
    const maxAvailableHeight = desktopHeight - startBounds.y;
    const targetHeight = startBounds.height + deltaY;
    const clampedHeight = Math.max(minHeight, Math.min(maxHeight, maxAvailableHeight, targetHeight));
    height = Math.round(clampedHeight);
  } else if (direction.includes('n')) {
    const bottomEdge = startBounds.y + startBounds.height;
    const targetY = startBounds.y + deltaY;
    const minY = Math.max(0, bottomEdge - maxHeight);
    const maxY = bottomEdge - minHeight;
    const clampedY = Math.max(minY, Math.min(maxY, targetY));
    y = Math.round(clampedY);
    height = Math.round(bottomEdge - clampedY);
  }

  return { x, y, width, height };
}

export interface UseResizableOptions {
  getBounds: () => WindowRect;
  onUpdateBounds: (bounds: WindowRect) => void;
  getScale?: () => number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  desktopWidth?: number;
  desktopHeight?: number;
  onStart?: () => void;
  onEnd?: () => void;
}

export function useResizable(options: UseResizableOptions) {
  const isResizing = ref(false);
  const activeDirection = ref<ResizeDirection | null>(null);

  let startMouseX = 0;
  let startMouseY = 0;
  let startBounds: WindowRect = { x: 0, y: 0, width: 0, height: 0 };

  const startResize = (e: MouseEvent, direction: ResizeDirection) => {
    isResizing.value = true;
    activeDirection.value = direction;
    startMouseX = e.clientX;
    startMouseY = e.clientY;
    startBounds = { ...options.getBounds() };

    options.onStart?.();

    const cursor = getResizeCursor(direction);
    document.body.style.cursor = cursor;
    document.body.style.userSelect = 'none';

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isResizing.value || !activeDirection.value) return;

    const scale = options.getScale ? options.getScale() : 1;
    const deltaX = (e.clientX - startMouseX) / scale;
    const deltaY = (e.clientY - startMouseY) / scale;

    const newBounds = calculateNewBounds(
      activeDirection.value,
      startBounds,
      deltaX,
      deltaY,
      {
        minWidth: options.minWidth ?? 240,
        minHeight: options.minHeight ?? 140,
        maxWidth: options.maxWidth ?? 1280,
        maxHeight: options.maxHeight ?? 768,
        desktopWidth: options.desktopWidth ?? 1280,
        desktopHeight: options.desktopHeight ?? 768,
      }
    );

    options.onUpdateBounds(newBounds);
  };

  const onMouseUp = () => {
    if (!isResizing.value) return;
    isResizing.value = false;
    activeDirection.value = null;

    document.body.style.cursor = '';
    document.body.style.userSelect = '';

    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);

    options.onEnd?.();
  };

  const cleanup = () => {
    if (isResizing.value) {
      onMouseUp();
    }
  };

  return {
    isResizing,
    activeDirection,
    startResize,
    cleanup,
  };
}
