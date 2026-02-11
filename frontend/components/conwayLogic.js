export const GRID_SIZE = 15;

export function createEmptyGrid() {
  return Array.from({ length: GRID_SIZE }, () => new Array(GRID_SIZE).fill(false));
}

export function checkCell(grid, r, c) {
  if (r < 0 || r > GRID_SIZE - 1 || c < 0 || c > GRID_SIZE - 1) {
    return 0;
  }
  return grid[r][c] ? 1 : 0;
}

export function getNeighbors(grid, rIdx, cIdx) {
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

export function computeNextGrid(prevGrid) {
  return prevGrid.map((gridRow, rowIdx) =>
    gridRow.map((gridCell, colIdx) => {
      const neighbors = getNeighbors(prevGrid, rowIdx, colIdx);
      if (gridCell && (neighbors < 2 || neighbors > 3)) return false;
      if (!gridCell && neighbors === 3) return true;
      return gridCell;
    })
  );
}
