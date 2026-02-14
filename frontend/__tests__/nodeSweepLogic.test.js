import { describe, it, expect } from 'vitest';
import { createEmptyGrid, manhattanDistance, isValidPlacement } from '@/components/node-sweep/nodeSweepLogic';

describe('createEmptyGrid', () => {
  it('creates a 6x6 grid of all null', () => {
    const grid = createEmptyGrid();
    expect(grid.length).toBe(6);
    expect(grid[0].length).toBe(6);
    expect(grid.every(row => row.every(cell => cell === null))).toBe(true);
  });

  it('creates a custom-sized grid', () => {
    const grid = createEmptyGrid(8);
    expect(grid.length).toBe(8);
    expect(grid[0].length).toBe(8);
  });
});

describe('manhattanDistance', () => {
  it('returns 0 for the same cell', () => {
    expect(manhattanDistance(3, 3, 3, 3)).toBe(0);
  });

  it('returns correct distance for adjacent cells', () => {
    expect(manhattanDistance(0, 0, 0, 1)).toBe(1);
    expect(manhattanDistance(0, 0, 1, 0)).toBe(1);
  });

  it('returns correct distance for diagonal cells', () => {
    expect(manhattanDistance(0, 0, 1, 1)).toBe(2);
  });

  it('returns correct distance for distant cells', () => {
    expect(manhattanDistance(0, 0, 5, 5)).toBe(10);
  });

  it('is symmetric', () => {
    expect(manhattanDistance(1, 2, 4, 5)).toBe(manhattanDistance(4, 5, 1, 2));
  });
});

describe('isValidPlacement', () => {
  it('accepts valid placements', () => {
    expect(isValidPlacement([[0, 0], [1, 1], [2, 2]])).toBe(true);
  });

  it('accepts partial placements', () => {
    expect(isValidPlacement([[0, 0]])).toBe(true);
    expect(isValidPlacement([[0, 0], [1, 1]])).toBe(true);
  });

  it('rejects more than 3 nodes', () => {
    expect(isValidPlacement([[0, 0], [1, 1], [2, 2], [3, 3]])).toBe(false);
  });

  it('rejects out-of-bounds positions', () => {
    expect(isValidPlacement([[-1, 0]])).toBe(false);
    expect(isValidPlacement([[0, 6]])).toBe(false);
    expect(isValidPlacement([[6, 0]])).toBe(false);
  });

  it('rejects duplicate positions', () => {
    expect(isValidPlacement([[0, 0], [0, 0]])).toBe(false);
  });

  it('accepts empty placement', () => {
    expect(isValidPlacement([])).toBe(true);
  });
});
