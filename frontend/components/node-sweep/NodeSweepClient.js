'use client';

import { useReducer, useRef, useEffect, useCallback } from 'react';
import styles from './NodeSweepClient.module.css';
import {
  createEmptyGrid,
  isValidPlacement,
  getMyGridCellState,
  getAttackGridCellState,
} from './nodeSweepLogic';

// --- Helpers ---

function buildClassName(base, modifierMap) {
  let result = base;
  for (const [cls, active] of Object.entries(modifierMap)) {
    if (active) result += ` ${cls}`;
  }
  return result;
}

// --- Reducer ---

const initialState = {
  phase: 'menu',
  mode: null,
  gameCode: '',
  joinCode: '',
  player: null,
  myTurn: false,
  status: '',
  winner: null,
  placedNodes: [],
  serverIndex: null,
  myGrid: createEmptyGrid(),
  attackGrid: createEmptyGrid(),
  stats: null,
  statsLoading: false,
  statsError: null,
  nodesConfirmed: false,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'RESET':
      return { ...initialState, serverIndex: null, nodesConfirmed: false, myGrid: createEmptyGrid(), attackGrid: createEmptyGrid() };

    case 'SET_PHASE':
      return { ...state, phase: action.phase };

    case 'SET_STATUS':
      return { ...state, status: action.status };

    case 'SET_JOIN_CODE':
      return { ...state, joinCode: action.joinCode };

    case 'SET_MODE':
      return { ...state, mode: action.mode };

    case 'GAME_CREATED':
      if (action.gameCode) {
        return { ...state, player: action.player, gameCode: action.gameCode, phase: 'waiting', status: 'Waiting for opponent...' };
      }
      return { ...state, player: action.player, phase: 'setup', status: 'Place a server node (S) and two decoy nodes (D) on your grid.' };

    case 'GAME_JOINED':
      return { ...state, player: action.player, phase: 'setup', status: 'Place a server node (S) and two decoy nodes (D) on your grid.' };

    case 'OPPONENT_JOINED':
      return { ...state, phase: 'setup', status: 'Opponent joined! Place 3 nodes on your grid.' };

    case 'NODES_PLACED':
      return { ...state, nodesConfirmed: true, status: 'Waiting for game to start...' };

    case 'TURN_START':
      return {
        ...state,
        phase: 'playing',
        myTurn: action.yourTurn,
        status: action.yourTurn ? 'Your turn — probe the attack grid' : "Opponent's turn...",
      };

    case 'PROBE_RESULT': {
      const nextAttack = state.attackGrid.map(r => [...r]);
      nextAttack[action.row][action.col] = {
        hit: action.hit,
        isServer: action.isServer || false,
        distance: action.distance,
      };
      if (action.invalidated) {
        for (const [r, c] of action.invalidated) {
          if (nextAttack[r][c] && !nextAttack[r][c].hit) {
            nextAttack[r][c] = { ...nextAttack[r][c], invalidated: true };
          }
        }
      }
      return { ...state, attackGrid: nextAttack };
    }

    case 'OPPONENT_PROBED': {
      const nextMy = state.myGrid.map(r => [...r]);
      const existing = nextMy[action.row][action.col];
      nextMy[action.row][action.col] = {
        ...(existing && typeof existing === 'object' ? existing : {}),
        probed: true,
        hit: action.hit,
      };
      return { ...state, myGrid: nextMy };
    }

    case 'GAME_OVER':
      return { ...state, phase: 'finished', winner: action.winner };

    case 'OPPONENT_DISCONNECTED':
      return { ...state, phase: 'disconnected', status: 'Opponent disconnected.' };

    case 'GAME_EXPIRED':
      return { ...state, phase: 'disconnected', status: 'Game expired due to inactivity.' };

    case 'GO_TO_STATS':
      return { ...state, phase: 'stats', statsLoading: true, statsError: null, stats: null };

    case 'STATS_LOADED':
      return { ...state, statsLoading: false, stats: action.stats };

    case 'STATS_ERROR':
      return { ...state, statsLoading: false, statsError: action.error };

    case 'PLACE_NODE': {
      const newNodes = [...state.placedNodes, action.position];
      const newServerIndex = state.serverIndex === null ? newNodes.length - 1 : state.serverIndex;
      return { ...state, placedNodes: newNodes, serverIndex: newServerIndex };
    }

    case 'REMOVE_NODE': {
      const newNodes = state.placedNodes.filter((_, i) => i !== action.index);
      let newServerIndex = state.serverIndex;
      if (action.index === state.serverIndex) {
        newServerIndex = null;
      } else if (state.serverIndex !== null && action.index < state.serverIndex) {
        newServerIndex = state.serverIndex - 1;
      }
      return { ...state, placedNodes: newNodes, serverIndex: newServerIndex };
    }

    default:
      return state;
  }
}

// --- Custom Hook ---

function useNodeSweepGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const wsRef = useRef(null);

  const handleMessage = useCallback((event) => {
    const data = JSON.parse(event.data);

    switch (data.type) {
      case 'game_created':
        dispatch({ type: 'GAME_CREATED', player: data.player, gameCode: data.game_code });
        break;
      case 'game_joined':
        dispatch({ type: 'GAME_JOINED', player: data.player });
        break;
      case 'opponent_joined':
        dispatch({ type: 'OPPONENT_JOINED' });
        break;
      case 'nodes_placed':
        dispatch({ type: 'NODES_PLACED' });
        break;
      case 'turn_start':
        dispatch({ type: 'TURN_START', yourTurn: data.your_turn });
        break;
      case 'probe_result':
        dispatch({
          type: 'PROBE_RESULT',
          row: data.row,
          col: data.col,
          hit: data.hit,
          isServer: data.is_server,
          distance: data.distance,
          invalidated: data.invalidated,
        });
        break;
      case 'opponent_probed':
        dispatch({ type: 'OPPONENT_PROBED', row: data.row, col: data.col, hit: data.hit });
        break;
      case 'game_over':
        dispatch({ type: 'GAME_OVER', winner: data.winner });
        break;
      case 'opponent_disconnected':
        dispatch({ type: 'OPPONENT_DISCONNECTED' });
        break;
      case 'game_expired':
        dispatch({ type: 'GAME_EXPIRED' });
        break;
      case 'error':
        dispatch({ type: 'SET_STATUS', status: `Error: ${data.message}` });
        break;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close(1000);
    };
  }, []);

  function connectWs() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws/node-sweep`);
    ws.onmessage = handleMessage;
    ws.onerror = () => dispatch({ type: 'SET_STATUS', status: 'Connection error' });
    ws.onclose = (e) => {
      if (e.code !== 1000) dispatch({ type: 'SET_STATUS', status: 'Connection lost' });
    };
    wsRef.current = ws;
    return ws;
  }

  function startGame(mode, joinCodeValue) {
    dispatch({ type: 'SET_STATUS', status: '' });
    dispatch({ type: 'SET_MODE', mode: mode === 'join' ? 'multiplayer' : mode });
    const ws = connectWs();
    if (mode === 'bot') {
      ws.onopen = () => ws.send(JSON.stringify({ type: 'create_game', mode: 'bot' }));
    } else if (mode === 'multiplayer') {
      ws.onopen = () => ws.send(JSON.stringify({ type: 'create_game', mode: 'multiplayer' }));
    } else if (mode === 'join') {
      ws.onopen = () => ws.send(JSON.stringify({ type: 'join_game', game_code: joinCodeValue }));
    }
  }

  function handleSetupClick(row, col) {
    if (state.nodesConfirmed) return;
    const existingIdx = state.placedNodes.findIndex(([r, c]) => r === row && c === col);
    if (existingIdx !== -1) {
      dispatch({ type: 'REMOVE_NODE', index: existingIdx });
      return;
    }
    if (state.placedNodes.length >= 3) return;
    const newNodes = [...state.placedNodes, [row, col]];
    if (isValidPlacement(newNodes)) {
      dispatch({ type: 'PLACE_NODE', position: [row, col] });
    }
  }

  function confirmPlacement() {
    if (state.placedNodes.length !== 3 || state.serverIndex === null) return;
    wsRef.current.send(JSON.stringify({
      type: 'place_nodes',
      positions: state.placedNodes,
      server_index: state.serverIndex,
    }));
  }

  function probe(row, col) {
    if (!state.myTurn || state.phase !== 'playing') return;
    if (state.attackGrid[row][col] !== null) return;
    wsRef.current.send(JSON.stringify({ type: 'probe', row, col }));
  }

  function newGame() {
    if (wsRef.current) wsRef.current.close(1000);
    dispatch({ type: 'RESET' });
  }

  const actions = {
    startBot: () => startGame('bot'),
    createMultiplayer: () => startGame('multiplayer'),
    joinMultiplayer: (code) => { if (code.trim()) startGame('join', code.trim()); },
    setJoinCode: (val) => dispatch({ type: 'SET_JOIN_CODE', joinCode: val }),
    goToJoin: () => dispatch({ type: 'SET_PHASE', phase: 'joining' }),
    goToMenu: () => { dispatch({ type: 'SET_PHASE', phase: 'menu' }); dispatch({ type: 'SET_JOIN_CODE', joinCode: '' }); dispatch({ type: 'SET_STATUS', status: '' }); },
    goToStats: () => {
      dispatch({ type: 'GO_TO_STATS' });
      fetch('/api/node-sweep/stats')
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch stats');
          return res.json();
        })
        .then(data => dispatch({ type: 'STATS_LOADED', stats: data }))
        .catch(err => dispatch({ type: 'STATS_ERROR', error: err.message }));
    },
    handleSetupClick,
    confirmPlacement,
    probe,
    newGame,
  };

  return { state, actions };
}

// --- Phase Sub-Components ---

function MenuPhase({ onStartBot, onCreateMultiplayer, onJoinGame, onStats, status }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>NODE SWEEP</h1>
      <div className={styles.menu}>
        <span className={styles.menuLabel}>Play vs Bot</span>
        <button className={styles.menuButton} onClick={onStartBot}>Start Game</button>
        <div className={styles.menuSection}>
          <span className={styles.menuLabel}>Multiplayer</span>
          <button className={styles.menuButton} onClick={onCreateMultiplayer}>Create Game</button>
          <button className={styles.menuButton} onClick={onJoinGame}>Join Game</button>
        </div>
        <span className={styles.menuLabel}>Global Stats</span>
        <button className={styles.menuButton} onClick={onStats}>View Stats</button>
      </div>
      {status && <div className={styles.statusBar}>{status}</div>}
    </div>
  );
}

function StatsPhase({ stats, loading, error, onBack }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>NODE SWEEP</h1>
      <div className={styles.menu}>
        <span className={styles.menuLabel}>Global Stats</span>
        {loading && (
          <div className={buildClassName(styles.statusBar, { [styles.statusWaiting]: true })}>Loading...</div>
        )}
        {error && (
          <div className={styles.statusBar}>Error: {error}</div>
        )}
        {stats && (
          stats.total_games === 0 ? (
            <div className={styles.statusBar}>No games played yet.</div>
          ) : (
            <ul className={styles.statsList}>
              <li>Total games played: <strong>{stats.total_games}</strong></li>
              <li>Bot winrate: <strong>{stats.bot_winrate !== null ? `${Math.round(stats.bot_winrate * 100)}%` : 'N/A'}</strong></li>
              <li>Avg probes to win: <strong>{stats.avg_probes_to_win ?? 'N/A'}</strong></li>
            </ul>
          )
        )}
        <button className={styles.menuButton} onClick={onBack}>Back</button>
      </div>
    </div>
  );
}

function JoiningPhase({ joinCode, onJoinCodeChange, onJoin, onBack, status }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>NODE SWEEP</h1>
      <div className={styles.menu}>
        <span className={styles.menuLabel}>Enter game code</span>
        <input
          className={styles.codeInput}
          placeholder="CODE"
          value={joinCode}
          onChange={e => onJoinCodeChange(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === 'Enter' && onJoin()}
          maxLength={6}
          autoFocus
        />
        <button className={styles.menuButton} onClick={onJoin}>Connect</button>
        <button className={styles.menuButton} onClick={onBack}>Back</button>
        {status && <div className={styles.statusBar}>{status}</div>}
      </div>
    </div>
  );
}

function WaitingPhase({ gameCode, onBack, status }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>NODE SWEEP</h1>
      <div className={styles.gameCode}>
        <div>Share this code with your opponent:</div>
        <div className={styles.gameCodeValue}>{gameCode}</div>
        <button className={styles.menuButton} onClick={onBack}>Back</button>
      </div>
      <div className={buildClassName(styles.statusBar, { [styles.statusWaiting]: true })}>{status}</div>
    </div>
  );
}

function GamePhase({ state, actions }) {
  const { phase, myGrid, attackGrid, placedNodes, serverIndex, myTurn, status, winner } = state;

  function renderMyCell(row, col) {
    const cell = getMyGridCellState(row, col, myGrid, placedNodes, serverIndex, phase, state.nodesConfirmed);

    const className = buildClassName(styles.cell, {
      [styles.cellServer]: cell.isServer,
      [styles.cellDecoy]: cell.isDecoy,
      [styles.cellClickable]: cell.isClickable,
      [styles.cellOpponentProbed]: cell.isProbed,
    });

    return (
      <div
        key={`my-${row}-${col}`}
        className={className}
        onClick={phase === 'setup' ? () => actions.handleSetupClick(row, col) : undefined}
      >
        {cell.content}
      </div>
    );
  }

  function renderAttackCell(row, col) {
    const cell = getAttackGridCellState(row, col, attackGrid, myTurn, phase);

    const className = buildClassName(styles.cell, {
      [styles.cellHitServer]: cell.isServer,
      [styles.cellHitDecoy]: cell.isHit && !cell.isServer,
      [styles.cellInvalidated]: cell.isInvalidated,
      [styles.cellMiss]: cell.isMiss,
      [styles.cellClickable]: cell.isClickable,
    });

    return (
      <div
        key={`atk-${row}-${col}`}
        className={className}
        onClick={cell.isClickable ? () => actions.probe(row, col) : undefined}
      >
        {cell.content}
      </div>
    );
  }

  function renderGrid(renderCell, label) {
    return (
      <div className={styles.gridSection}>
        <div className={styles.gridLabel}>{label}</div>
        <div className={styles.grid}>
          {Array.from({ length: 6 }, (_, r) =>
            Array.from({ length: 6 }, (_, c) => renderCell(r, c))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>NODE SWEEP</h1>

      <div className={styles.gridsWrapper}>
        {renderGrid(renderMyCell, 'Your Grid')}
        {(phase === 'playing' || phase === 'finished') && renderGrid(renderAttackCell, 'Attack Grid')}
      </div>

      {phase === 'setup' && !state.nodesConfirmed && (
        <div className={styles.setupControls}>
          <div className={styles.setupHint}>
            {placedNodes.length < 3
              ? `Place ${3 - placedNodes.length} more node${3 - placedNodes.length !== 1 ? 's' : ''}`
              : 'Click a node to remove it.'}
          </div>
          {placedNodes.length === 3 && (
            <button onClick={actions.confirmPlacement}>Confirm Placement</button>
          )}
        </div>
      )}

      <div className={buildClassName(styles.statusBar, { [styles.statusWaiting]: !myTurn && phase === 'playing' })}>
        {status}
      </div>

      {phase === 'finished' && (
        <div className={styles.overlay}>
          <div className={buildClassName(styles.overlayTitle, { [styles.overlayLoss]: winner !== 'you' })}>
            {winner === 'you' ? 'ACCESS GRANTED' : 'CONNECTION TERMINATED'}
          </div>
          <button onClick={actions.newGame}>New Game</button>
        </div>
      )}
    </div>
  );
}

// --- Main Component ---

export { gameReducer, initialState };

export default function NodeSweepClient() {
  const { state, actions } = useNodeSweepGame();

  switch (state.phase) {
    case 'menu':
      return (
        <MenuPhase
          onStartBot={actions.startBot}
          onCreateMultiplayer={actions.createMultiplayer}
          onJoinGame={actions.goToJoin}
          onStats={actions.goToStats}
          status={state.status}
        />
      );

    case 'stats':
      return (
        <StatsPhase
          stats={state.stats}
          loading={state.statsLoading}
          error={state.statsError}
          onBack={actions.goToMenu}
        />
      );

    case 'joining':
      return (
        <JoiningPhase
          joinCode={state.joinCode}
          onJoinCodeChange={actions.setJoinCode}
          onJoin={() => actions.joinMultiplayer(state.joinCode)}
          onBack={actions.goToMenu}
          status={state.status}
        />
      );

    case 'waiting':
      return (
        <WaitingPhase
          gameCode={state.gameCode}
          onBack={actions.goToMenu}
          status={state.status}
        />
      );

    case 'disconnected':
      return (
        <div className={styles.container} style={{ textAlign: 'center' }}>
          <h1 className={styles.title}>NODE SWEEP</h1>
          <div className={styles.statusBar}>{state.status}</div>
          <button className={styles.menuButton} onClick={actions.newGame}>Back to Menu</button>
        </div>
      );

    default:
      return <GamePhase state={state} actions={actions} />;
  }
}
