import { describe, it, expect } from 'vitest';
import {
  calculateNewBounds,
  getResizeCursor,
  type WindowRect,
  type ResizeConstraints,
} from './useResizable';

describe('useResizable - Dynamic window resizing', () => {
  const defaultConstraints: ResizeConstraints = {
    minWidth: 200,
    minHeight: 140,
    maxWidth: 1200,
    maxHeight: 700,
    desktopWidth: 1280,
    desktopHeight: 768,
  };

  const initialBounds: WindowRect = {
    x: 100,
    y: 100,
    width: 400,
    height: 300,
  };

  it('resizes from the right edge (east)', () => {
    const result = calculateNewBounds('e', initialBounds, 50, 0, defaultConstraints);
    expect(result.x).toBe(100);
    expect(result.y).toBe(100);
    expect(result.width).toBe(450);
    expect(result.height).toBe(300);
  });

  it('resizes from the bottom edge (south)', () => {
    const result = calculateNewBounds('s', initialBounds, 0, 60, defaultConstraints);
    expect(result.x).toBe(100);
    expect(result.y).toBe(100);
    expect(result.width).toBe(400);
    expect(result.height).toBe(360);
  });

  it('resizes from the left edge (west), keeping the right edge fixed', () => {
    // start x=100, width=400 (right edge=500)
    // drag right by +50 -> new x=150, new width=350 (right edge remains 500)
    const result = calculateNewBounds('w', initialBounds, 50, 0, defaultConstraints);
    expect(result.x).toBe(150);
    expect(result.width).toBe(350);
    expect(result.x + result.width).toBe(500);
    expect(result.y).toBe(100);
    expect(result.height).toBe(300);
  });

  it('resizes from the top edge (north), keeping the bottom edge fixed', () => {
    // start y=100, height=300 (bottom edge=400)
    // drag down by +40 -> new y=140, new height=260 (bottom edge remains 400)
    const result = calculateNewBounds('n', initialBounds, 0, 40, defaultConstraints);
    expect(result.y).toBe(140);
    expect(result.height).toBe(260);
    expect(result.y + result.height).toBe(400);
    expect(result.x).toBe(100);
    expect(result.width).toBe(400);
  });

  it('resizes from bottom-right corner (southeast)', () => {
    const result = calculateNewBounds('se', initialBounds, 80, 50, defaultConstraints);
    expect(result.x).toBe(100);
    expect(result.y).toBe(100);
    expect(result.width).toBe(480);
    expect(result.height).toBe(350);
  });

  it('resizes from top-left corner (northwest)', () => {
    const result = calculateNewBounds('nw', initialBounds, -30, -20, defaultConstraints);
    expect(result.x).toBe(70);
    expect(result.y).toBe(80);
    expect(result.width).toBe(430);
    expect(result.height).toBe(320);
    expect(result.x + result.width).toBe(500);
    expect(result.y + result.height).toBe(400);
  });

  it('respects minWidth and minHeight constraints', () => {
    // Attempt to shrink below minWidth (200) and minHeight (140)
    const shrunk = calculateNewBounds('se', initialBounds, -350, -250, defaultConstraints);
    expect(shrunk.width).toBe(200);
    expect(shrunk.height).toBe(140);

    // Left shrink attempt beyond minWidth
    const leftShrunk = calculateNewBounds('w', initialBounds, 300, 0, defaultConstraints);
    expect(leftShrunk.width).toBe(200);
    expect(leftShrunk.x).toBe(300); // 500 - 200 = 300
  });

  it('respects desktop boundaries (x >= 0, y >= 0, width within desktop)', () => {
    // Drag west far past screen edge
    const outLeft = calculateNewBounds('w', initialBounds, -200, 0, defaultConstraints);
    expect(outLeft.x).toBe(0);
    expect(outLeft.width).toBe(500); // 500 - 0 = 500

    // Drag north far past screen top
    const outTop = calculateNewBounds('n', initialBounds, 0, -200, defaultConstraints);
    expect(outTop.y).toBe(0);
    expect(outTop.height).toBe(400); // 400 - 0 = 400

    // Drag east past desktop right boundary
    const nearRightEdgeBounds: WindowRect = { x: 1000, y: 100, width: 200, height: 200 };
    const outRight = calculateNewBounds('e', nearRightEdgeBounds, 500, 0, defaultConstraints);
    expect(outRight.width).toBe(280); // 1280 - 1000 = 280
  });

  it('maps directions to classic Windows resize cursors', () => {
    expect(getResizeCursor('n')).toBe('ns-resize');
    expect(getResizeCursor('s')).toBe('ns-resize');
    expect(getResizeCursor('e')).toBe('ew-resize');
    expect(getResizeCursor('w')).toBe('ew-resize');
    expect(getResizeCursor('nw')).toBe('nwse-resize');
    expect(getResizeCursor('se')).toBe('nwse-resize');
    expect(getResizeCursor('ne')).toBe('nesw-resize');
    expect(getResizeCursor('sw')).toBe('nesw-resize');
  });
});
