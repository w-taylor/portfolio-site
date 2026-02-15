import { describe, it, expect } from 'vitest';
import {
  createEmptyGrid,
  manhattanDistance,
  isValidPlacement,
  getMyGridCellState,
  getAttackGridCellState,
} from '@/components/node-sweep/nodeSweepLogic';

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

describe('getMyGridCellState', () => {
  const emptyGrid = createEmptyGrid();
  const placedNodes = [[0, 0], [1, 1], [2, 2]];

  it('identifies server node during setup', () => {
    const cell = getMyGridCellState(0, 0, emptyGrid, placedNodes, 0, 'setup');
    expect(cell.isServer).toBe(true);
    expect(cell.isDecoy).toBe(false);
    expect(cell.content).toBe('S');
    expect(cell.isClickable).toBe(true);
  });

  it('identifies decoy node during setup', () => {
    const cell = getMyGridCellState(1, 1, emptyGrid, placedNodes, 0, 'setup');
    expect(cell.isServer).toBe(false);
    expect(cell.isDecoy).toBe(true);
    expect(cell.content).toBe('D');
  });

  it('returns empty state for unplaced cell', () => {
    const cell = getMyGridCellState(3, 3, emptyGrid, placedNodes, 0, 'setup');
    expect(cell.isServer).toBe(false);
    expect(cell.isDecoy).toBe(false);
    expect(cell.content).toBe('');
    expect(cell.isClickable).toBe(true);
  });

  it('detects probed cell during playing phase', () => {
    const grid = createEmptyGrid();
    grid[0][0] = { probed: true, hit: true };
    const cell = getMyGridCellState(0, 0, grid, placedNodes, 0, 'playing');
    expect(cell.isProbed).toBe(true);
    expect(cell.isClickable).toBe(false);
  });

  it('is not clickable during playing phase', () => {
    const cell = getMyGridCellState(3, 3, emptyGrid, placedNodes, 0, 'playing');
    expect(cell.isClickable).toBe(false);
  });
});

describe('getAttackGridCellState', () => {
  it('identifies clickable empty cell when it is your turn', () => {
    const grid = createEmptyGrid();
    const cell = getAttackGridCellState(0, 0, grid, true, 'playing');
    expect(cell.isClickable).toBe(true);
    expect(cell.content).toBe('');
  });

  it('is not clickable when not your turn', () => {
    const grid = createEmptyGrid();
    const cell = getAttackGridCellState(0, 0, grid, false, 'playing');
    expect(cell.isClickable).toBe(false);
  });

  it('identifies a miss with distance', () => {
    const grid = createEmptyGrid();
    grid[0][0] = { hit: false, distance: 3 };
    const cell = getAttackGridCellState(0, 0, grid, true, 'playing');
    expect(cell.isMiss).toBe(true);
    expect(cell.isHit).toBe(false);
    expect(cell.content).toBe(3);
    expect(cell.isClickable).toBe(false);
  });

  it('identifies a decoy hit', () => {
    const grid = createEmptyGrid();
    grid[1][1] = { hit: true, isServer: false, distance: 0 };
    const cell = getAttackGridCellState(1, 1, grid, true, 'playing');
    expect(cell.isHit).toBe(true);
    expect(cell.isServer).toBe(false);
    expect(cell.content).toBe('D');
  });

  it('identifies a server hit', () => {
    const grid = createEmptyGrid();
    grid[2][2] = { hit: true, isServer: true, distance: 0 };
    const cell = getAttackGridCellState(2, 2, grid, true, 'playing');
    expect(cell.isHit).toBe(true);
    expect(cell.isServer).toBe(true);
    expect(cell.content).toBe('S');
  });

  it('identifies an invalidated cell', () => {
    const grid = createEmptyGrid();
    grid[3][3] = { hit: false, distance: 2, invalidated: true };
    const cell = getAttackGridCellState(3, 3, grid, true, 'playing');
    expect(cell.isInvalidated).toBe(true);
    expect(cell.isMiss).toBe(false);
    expect(cell.content).toBe('X');
  });
});
