export const GRID_SIZE = 15;

export function createEmptyGrid(): boolean[][] {
  return Array.from({ length: GRID_SIZE }, () => new Array(GRID_SIZE).fill(false));
}

export function checkCell(grid: boolean[][], r: number, c: number): number {
  if (r < 0 || r > GRID_SIZE - 1 || c < 0 || c > GRID_SIZE - 1) {
    return 0;
  }
  return grid[r][c] ? 1 : 0;
}

export function getNeighbors(grid: boolean[][], rIdx: number, cIdx: number): number {
  let nCount = 0;
  const rowAbove = rIdx - 1;
  const rowBelow = rIdx + 1;

  [rowAbove, rIdx, rowBelow].forEach((row) => {
    nCount += checkCell(grid, row, cIdx - 1);
    nCount += checkCell(grid, row, cIdx + 1);
    if (row !== rIdx) {
      nCount += checkCell(grid, row, cIdx);
    }
  });
  return nCount;
}

export function computeNextGrid(prevGrid: boolean[][]): boolean[][] {
  return prevGrid.map((gridRow, rowIdx) =>
    gridRow.map((gridCell, colIdx) => {
      const neighbors = getNeighbors(prevGrid, rowIdx, colIdx);
      if (gridCell && (neighbors < 2 || neighbors > 3)) return false;
      if (!gridCell && neighbors === 3) return true;
      return gridCell;
    })
  );
}
