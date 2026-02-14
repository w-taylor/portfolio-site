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
