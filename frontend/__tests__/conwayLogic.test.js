import { describe, it, expect } from 'vitest';
import { GRID_SIZE, createEmptyGrid, checkCell, getNeighbors, computeNextGrid } from '@/components/conway/conwayLogic';

function gridWith(aliveCells) {
  const grid = createEmptyGrid();
  for (const [r, c] of aliveCells) {
    grid[r][c] = true;
  }
  return grid;
}

describe('createEmptyGrid', () => {
  it('creates a 15x15 grid of all false', () => {
    const grid = createEmptyGrid();
    expect(grid.length).toBe(15);
    expect(grid[0].length).toBe(15);
    expect(grid.every(row => row.every(cell => cell === false))).toBe(true);
  });
});

describe('checkCell', () => {
  const grid = gridWith([[2, 3]]);

  it('returns 1 for a live cell', () => {
    expect(checkCell(grid, 2, 3)).toBe(1);
  });

  it('returns 0 for a dead cell', () => {
    expect(checkCell(grid, 0, 0)).toBe(0);
  });

  it('returns 0 for out-of-bounds coordinates', () => {
    expect(checkCell(grid, -1, 0)).toBe(0);
    expect(checkCell(grid, 0, -1)).toBe(0);
    expect(checkCell(grid, GRID_SIZE, 0)).toBe(0);
    expect(checkCell(grid, 0, GRID_SIZE)).toBe(0);
  });
});

describe('getNeighbors', () => {
  it('counts neighbors in the middle of the grid', () => {
    // Three live cells surrounding (5, 5)
    const grid = gridWith([[4, 4], [4, 5], [5, 6]]);
    expect(getNeighbors(grid, 5, 5)).toBe(3);
  });

  it('counts neighbors at a corner', () => {
    // Top-left corner only has 3 possible neighbors
    const grid = gridWith([[0, 1], [1, 0], [1, 1]]);
    expect(getNeighbors(grid, 0, 0)).toBe(3);
  });

  it('counts neighbors at an edge', () => {
    // Top edge, cell (0, 5) — 5 possible neighbors
    const grid = gridWith([[0, 4], [0, 6], [1, 5]]);
    expect(getNeighbors(grid, 0, 5)).toBe(3);
  });

  it('does not count the cell itself', () => {
    const grid = gridWith([[5, 5]]);
    expect(getNeighbors(grid, 5, 5)).toBe(0);
  });
});

describe('computeNextGrid', () => {
  it('kills a cell with fewer than 2 neighbors (underpopulation)', () => {
    // Single live cell with no neighbors dies
    const grid = gridWith([[5, 5]]);
    const next = computeNextGrid(grid);
    expect(next[5][5]).toBe(false);
  });

  it('kills a cell with more than 3 neighbors (overpopulation)', () => {
    // Cell at (5,5) with 4 neighbors dies
    const grid = gridWith([[5, 5], [4, 4], [4, 5], [5, 4], [5, 6]]);
    const next = computeNextGrid(grid);
    expect(next[5][5]).toBe(false);
  });

  it('keeps a cell alive with 2 neighbors', () => {
    const grid = gridWith([[5, 5], [4, 5], [6, 5]]);
    const next = computeNextGrid(grid);
    expect(next[5][5]).toBe(true);
  });

  it('keeps a cell alive with 3 neighbors', () => {
    const grid = gridWith([[5, 5], [4, 5], [6, 5], [5, 4]]);
    const next = computeNextGrid(grid);
    expect(next[5][5]).toBe(true);
  });

  it('births a dead cell with exactly 3 neighbors', () => {
    const grid = gridWith([[4, 5], [6, 5], [5, 4]]);
    expect(grid[5][5]).toBe(false);
    const next = computeNextGrid(grid);
    expect(next[5][5]).toBe(true);
  });

  it('does not birth a dead cell with 2 neighbors', () => {
    const grid = gridWith([[4, 5], [6, 5]]);
    const next = computeNextGrid(grid);
    expect(next[5][5]).toBe(false);
  });

  it('blinker oscillates correctly', () => {
    // Horizontal line of 3 becomes vertical, then back
    const horizontal = gridWith([[5, 4], [5, 5], [5, 6]]);
    const vertical = computeNextGrid(horizontal);
    expect(vertical[4][5]).toBe(true);
    expect(vertical[5][5]).toBe(true);
    expect(vertical[6][5]).toBe(true);
    expect(vertical[5][4]).toBe(false);
    expect(vertical[5][6]).toBe(false);

    const backToHorizontal = computeNextGrid(vertical);
    expect(backToHorizontal[5][4]).toBe(true);
    expect(backToHorizontal[5][5]).toBe(true);
    expect(backToHorizontal[5][6]).toBe(true);
    expect(backToHorizontal[4][5]).toBe(false);
    expect(backToHorizontal[6][5]).toBe(false);
  });

  it('block (2x2 square) is a still life', () => {
    const block = gridWith([[5, 5], [5, 6], [6, 5], [6, 6]]);
    const next = computeNextGrid(block);
    expect(next[5][5]).toBe(true);
    expect(next[5][6]).toBe(true);
    expect(next[6][5]).toBe(true);
    expect(next[6][6]).toBe(true);
  });

  it('empty grid stays empty', () => {
    const grid = createEmptyGrid();
    const next = computeNextGrid(grid);
    expect(next.every(row => row.every(cell => cell === false))).toBe(true);
  });
});
