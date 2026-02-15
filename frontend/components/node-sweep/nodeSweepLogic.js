export function createEmptyGrid(size = 6) {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null)
  );
}

export function manhattanDistance(r1, c1, r2, c2) {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2);
}

export function isValidPlacement(positions, gridSize = 6) {
  if (positions.length > 3) return false;
  const seen = new Set();
  for (const [r, c] of positions) {
    if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) return false;
    const key = `${r},${c}`;
    if (seen.has(key)) return false;
    seen.add(key);
  }
  return true;
}

export function getMyGridCellState(row, col, grid, placedNodes, serverIndex, phase) {
  const cellData = grid[row][col];
  const placedIdx = placedNodes.findIndex(([r, c]) => r === row && c === col);
  const isSetup = phase === 'setup';
  const isActive = phase === 'playing' || phase === 'finished';

  const isServer = placedIdx !== -1 && placedIdx === serverIndex;
  const isDecoy = placedIdx !== -1 && placedIdx !== serverIndex;
  const isProbed = isActive && cellData && typeof cellData === 'object' && cellData.probed;
  const isClickable = isSetup;

  let content = '';
  if (placedIdx !== -1) {
    content = isServer ? 'S' : 'D';
  }

  return { isServer, isDecoy, isProbed, isClickable, content };
}

export function getAttackGridCellState(row, col, grid, myTurn, phase) {
  const cellData = grid[row][col];
  const hasData = cellData !== null && typeof cellData === 'object';

  const isHit = hasData && cellData.hit;
  const isServer = hasData && cellData.hit && cellData.isServer;
  const isMiss = hasData && !cellData.hit && !cellData.invalidated;
  const isInvalidated = hasData && !cellData.hit && cellData.invalidated;
  const isClickable = !hasData && phase === 'playing' && myTurn;

  let content = '';
  if (isServer) content = 'S';
  else if (isHit) content = 'D';
  else if (isInvalidated) content = 'X';
  else if (isMiss) content = cellData.distance;

  return { isHit, isServer, isMiss, isInvalidated, isClickable, content };
}
