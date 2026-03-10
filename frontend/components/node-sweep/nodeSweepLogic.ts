export interface NodeSweepCellData {
  probed?: boolean;
  hit?: boolean;
  isServer?: boolean;
  distance?: number;
  invalidated?: boolean;
}

export type NodeSweepCell = NodeSweepCellData | null;
export type NodeSweepGrid = NodeSweepCell[][];
export type Position = [number, number];

export interface MyGridCellState {
  isServer: boolean;
  isDecoy: boolean;
  isProbed: boolean;
  isClickable: boolean;
  content: string;
}

export interface AttackGridCellState {
  isHit: boolean;
  isServer: boolean;
  isMiss: boolean;
  isInvalidated: boolean;
  isClickable: boolean;
  content: string | number | undefined;
}

export function createEmptyGrid(size: number = 6): NodeSweepGrid {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null)
  );
}

export function manhattanDistance(r1: number, c1: number, r2: number, c2: number): number {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2);
}

export function isValidPlacement(positions: Position[], gridSize: number = 6): boolean {
  if (positions.length > 3) return false;
  const seen = new Set<string>();
  for (const [r, c] of positions) {
    if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) return false;
    const key = `${r},${c}`;
    if (seen.has(key)) return false;
    seen.add(key);
  }
  return true;
}

export function getMyGridCellState(
  row: number,
  col: number,
  grid: NodeSweepGrid,
  placedNodes: Position[],
  serverIndex: number | null,
  phase: string,
  nodesConfirmed: boolean = false
): MyGridCellState {
  const cellData = grid[row][col];
  const placedIdx = placedNodes.findIndex(([r, c]) => r === row && c === col);
  const isSetup = phase === 'setup';
  const isActive = phase === 'playing' || phase === 'finished';

  const isServer = placedIdx !== -1 && placedIdx === serverIndex;
  const isDecoy = placedIdx !== -1 && placedIdx !== serverIndex;
  const isProbed = isActive && cellData !== null && typeof cellData === 'object' && cellData.probed === true;
  const isClickable = isSetup && !nodesConfirmed;

  let content = '';
  if (placedIdx !== -1) {
    content = isServer ? 'S' : 'D';
  }

  return { isServer, isDecoy, isProbed, isClickable, content };
}

export function getAttackGridCellState(
  row: number,
  col: number,
  grid: NodeSweepGrid,
  myTurn: boolean,
  phase: string
): AttackGridCellState {
  const cellData = grid[row][col];
  const hasData = cellData !== null && typeof cellData === 'object';

  const isHit = hasData && cellData.hit === true;
  const isServer = hasData && cellData.hit === true && cellData.isServer === true;
  const isMiss = hasData && !cellData.hit && !cellData.invalidated;
  const isInvalidated = hasData && !cellData.hit && cellData.invalidated === true;
  const isClickable = !hasData && phase === 'playing' && myTurn;

  let content: string | number | undefined = '';
  if (isServer) content = 'S';
  else if (isHit) content = 'D';
  else if (isInvalidated) content = 'X';
  else if (isMiss) content = cellData.distance;

  return { isHit, isServer, isMiss, isInvalidated, isClickable, content };
}
