import { ref } from 'vue';

export interface DragPosition {
  x: number;
  y: number;
}

export function useDraggable(
  initialPosition: DragPosition = { x: 0, y: 0 },
  onPositionChange?: (pos: DragPosition) => void
) {
  const position = ref<DragPosition>({ ...initialPosition });
  const isDragging = ref(false);

  let startMouseX = 0;
  let startMouseY = 0;
  let startPosX = 0;
  let startPosY = 0;

  const onMouseDown = (e: MouseEvent) => {
    // Zapobiegaj przeciąganiu przy kliknięciu w przyciski sterujące
    if ((e.target as HTMLElement).closest('.win-btn-control')) {
      return;
    }

    isDragging.value = true;
    startMouseX = e.clientX;
    startMouseY = e.clientY;
    startPosX = position.value.x;
    startPosY = position.value.y;

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging.value) return;

    const deltaX = e.clientX - startMouseX;
    const deltaY = e.clientY - startMouseY;

    // Granice pulpitu (1280 x 800)
    const newX = Math.max(0, Math.min(1280 - 100, startPosX + deltaX));
    const newY = Math.max(0, Math.min(800 - 60, startPosY + deltaY));

    position.value = { x: newX, y: newY };
    if (onPositionChange) {
      onPositionChange(position.value);
    }
  };

  const onMouseUp = () => {
    isDragging.value = false;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  return {
    position,
    isDragging,
    onMouseDown,
  };
}
