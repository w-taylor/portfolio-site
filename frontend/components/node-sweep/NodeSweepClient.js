'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './NodeSweepClient.module.css';
import { createEmptyGrid, isValidPlacement } from './nodeSweepLogic';

export default function NodeSweepClient() {
  const [phase, setPhase] = useState('menu'); // menu, joining, waiting, setup, playing, finished
  const [mode, setMode] = useState(null);
  const [gameCode, setGameCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [player, setPlayer] = useState(null);
  const [myTurn, setMyTurn] = useState(false);
  const [status, setStatus] = useState('');
  const [winner, setWinner] = useState(null);

  // Setup state
  const [placedNodes, setPlacedNodes] = useState([]);
  const [serverIndex, setServerIndex] = useState(0);

  // Grid state
  const [myGrid, setMyGrid] = useState(createEmptyGrid);
  const [attackGrid, setAttackGrid] = useState(createEmptyGrid);

  const wsRef = useRef(null);

  const handleMessage = useCallback((event) => {
    const data = JSON.parse(event.data);

    switch (data.type) {
      case 'game_created':
        setPlayer(data.player);
        if (data.game_code) {
          setGameCode(data.game_code);
          setPhase('waiting');
          setStatus('Waiting for opponent...');
        } else {
          setPhase('setup');
          setStatus('Place 3 nodes on your grid. Click a node to mark it as server.');
        }
        break;

      case 'game_joined':
        setPlayer(data.player);
        setPhase('setup');
        setStatus('Place 3 nodes on your grid. Click a node to mark it as server.');
        break;

      case 'opponent_joined':
        setPhase('setup');
        setStatus('Opponent joined! Place 3 nodes on your grid.');
        break;

      case 'nodes_placed':
        setStatus('Waiting for game to start...');
        break;

      case 'turn_start':
        setPhase('playing');
        setMyTurn(data.your_turn);
        setStatus(data.your_turn ? 'Your turn — probe the attack grid' : "Opponent's turn...");
        break;

      case 'probe_result': {
        setAttackGrid(prev => {
          const next = prev.map(r => [...r]);
          next[data.row][data.col] = {
            hit: data.hit,
            isServer: data.is_server || false,
            distance: data.distance,
          };
          if (data.invalidated) {
            for (const [r, c] of data.invalidated) {
              if (next[r][c] && !next[r][c].hit) {
                next[r][c] = { ...next[r][c], invalidated: true };
              }
            }
          }
          return next;
        });
        break;
      }

      case 'opponent_probed': {
        setMyGrid(prev => {
          const next = prev.map(r => [...r]);
          const existing = next[data.row][data.col];
          next[data.row][data.col] = {
            ...(existing && typeof existing === 'object' ? existing : {}),
            probed: true,
            hit: data.hit,
          };
          return next;
        });
        break;
      }

      case 'game_over':
        setPhase('finished');
        setWinner(data.winner);
        break;

      case 'error':
        setStatus(`Error: ${data.message}`);
        break;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  function connectWs() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws/node-sweep`);
    ws.onmessage = handleMessage;
    ws.onerror = () => setStatus('Connection error');
    ws.onclose = () => {
      if (phase !== 'finished' && phase !== 'menu') {
        setStatus('Connection lost');
      }
    };
    wsRef.current = ws;
    return ws;
  }

  function startBot() {
    setMode('bot');
    const ws = connectWs();
    ws.onopen = () => ws.send(JSON.stringify({ type: 'create_game', mode: 'bot' }));
  }

  function createMultiplayer() {
    setMode('multiplayer');
    const ws = connectWs();
    ws.onopen = () => ws.send(JSON.stringify({ type: 'create_game', mode: 'multiplayer' }));
  }

  function joinMultiplayer() {
    if (!joinCode.trim()) return;
    setMode('multiplayer');
    const ws = connectWs();
    ws.onopen = () => ws.send(JSON.stringify({ type: 'join_game', game_code: joinCode.trim() }));
  }

  function handleSetupClick(row, col) {
    const existingIdx = placedNodes.findIndex(([r, c]) => r === row && c === col);

    if (existingIdx !== -1) {
      // Clicking existing node: cycle server designation
      setServerIndex(existingIdx);
      return;
    }

    if (placedNodes.length >= 3) return;

    const newNodes = [...placedNodes, [row, col]];
    if (isValidPlacement(newNodes)) {
      setPlacedNodes(newNodes);
    }
  }

  function confirmPlacement() {
    if (placedNodes.length !== 3) return;
    wsRef.current.send(JSON.stringify({
      type: 'place_nodes',
      positions: placedNodes,
      server_index: serverIndex,
    }));
  }

  function handleProbe(row, col) {
    if (!myTurn || phase !== 'playing') return;
    if (attackGrid[row][col] !== null) return;
    wsRef.current.send(JSON.stringify({ type: 'probe', row, col }));
  }

  function newGame() {
    if (wsRef.current) wsRef.current.close();
    setPhase('menu');
    setMode(null);
    setGameCode('');
    setJoinCode('');
    setPlayer(null);
    setMyTurn(false);
    setStatus('');
    setWinner(null);
    setPlacedNodes([]);
    setServerIndex(0);
    setMyGrid(createEmptyGrid());
    setAttackGrid(createEmptyGrid());
  }

  function renderMyCell(row, col) {
    const cellData = myGrid[row][col];
    const isPlaced = placedNodes.findIndex(([r, c]) => r === row && c === col);
    const isSetup = phase === 'setup';

    let className = styles.cell;
    let content = '';

    if (isSetup && isPlaced !== -1) {
      if (isPlaced === serverIndex) {
        className += ` ${styles.cellServer}`;
        content = 'S';
      } else {
        className += ` ${styles.cellDecoy}`;
        content = 'D';
      }
      if (isSetup) className += ` ${styles.cellClickable}`;
    } else if (phase === 'playing' || phase === 'finished') {
      if (isPlaced !== -1) {
        if (isPlaced === serverIndex) {
          className += ` ${styles.cellServer}`;
          content = 'S';
        } else {
          className += ` ${styles.cellDecoy}`;
          content = 'D';
        }
      }
      if (cellData && typeof cellData === 'object' && cellData.probed) {
        className += ` ${styles.cellOpponentProbed}`;
      }
    }

    if (isSetup && isPlaced === -1) {
      className += ` ${styles.cellClickable}`;
    }

    return (
      <div
        key={`my-${row}-${col}`}
        className={className}
        onClick={isSetup ? () => handleSetupClick(row, col) : undefined}
      >
        {content}
      </div>
    );
  }

  function renderAttackCell(row, col) {
    const cellData = attackGrid[row][col];
    let className = styles.cell;
    let content = '';

    if (cellData !== null && typeof cellData === 'object') {
      if (cellData.hit) {
        if (cellData.isServer) {
          className += ` ${styles.cellHitServer}`;
          content = 'S';
        } else {
          className += ` ${styles.cellHitDecoy}`;
          content = 'D';
        }
      } else if (cellData.invalidated) {
        className += ` ${styles.cellInvalidated}`;
        content = 'X';
      } else {
        className += ` ${styles.cellMiss}`;
        content = cellData.distance;
      }
    } else if (phase === 'playing' && myTurn) {
      className += ` ${styles.cellClickable}`;
    }

    return (
      <div
        key={`atk-${row}-${col}`}
        className={className}
        onClick={cellData === null && myTurn && phase === 'playing' ? () => handleProbe(row, col) : undefined}
      >
        {content}
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

  // Menu phase
  if (phase === 'menu') {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>NODE SWEEP</h1>
        <div className={styles.menu}>
          <span className={styles.menuLabel}>Play vs Bot</span>
          <button className={styles.menuButton} onClick={startBot}>Start Game</button>
          <div className={styles.menuSection}>
            <span className={styles.menuLabel}>Multiplayer</span>
            <button className={styles.menuButton} onClick={createMultiplayer}>Create Game</button>
            <button className={styles.menuButton} onClick={() => setPhase('joining')}>Join Game</button>
          </div>
        </div>
      </div>
    );
  }

  // Join game code entry
  if (phase === 'joining') {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>NODE SWEEP</h1>
        <div className={styles.menu}>
          <span className={styles.menuLabel}>Enter game code</span>
          <input
            className={styles.codeInput}
            placeholder="CODE"
            value={joinCode}
            onChange={e => setJoinCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && joinMultiplayer()}
            maxLength={5}
            autoFocus
          />
          <button className={styles.menuButton} onClick={joinMultiplayer}>Connect</button>
          <button className={styles.menuButton} onClick={() => { setPhase('menu'); setJoinCode(''); setStatus(''); }}>Back</button>
          {status && <div className={styles.statusBar}>{status}</div>}
        </div>
      </div>
    );
  }

  // Waiting for opponent (multiplayer)
  if (phase === 'waiting') {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>NODE SWEEP</h1>
        <div className={styles.gameCode}>
          <div>Share this code with your opponent:</div>
          <div className={styles.gameCodeValue}>{gameCode}</div>
          <button className={styles.menuButton} onClick={() => { setPhase('menu'); setJoinCode(''); setStatus(''); }}>Back</button>
        </div>
        <div className={`${styles.statusBar} ${styles.statusWaiting}`}>{status}</div>
      </div>
    );
  }

  // Setup + Playing + Finished
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>NODE SWEEP</h1>

      <div className={styles.gridsWrapper}>
        {renderGrid(renderMyCell, 'Your Grid')}
        {(phase === 'playing' || phase === 'finished') && renderGrid(renderAttackCell, 'Attack Grid')}
      </div>

      {phase === 'setup' && (
        <div className={styles.setupControls}>
          <div className={styles.setupHint}>
            {placedNodes.length < 3
              ? `Place ${3 - placedNodes.length} more node${3 - placedNodes.length !== 1 ? 's' : ''}`
              : 'Click a node to set it as the server (S). Then confirm.'}
          </div>
          {placedNodes.length === 3 && (
            <button onClick={confirmPlacement}>Confirm Placement</button>
          )}
        </div>
      )}

      <div className={`${styles.statusBar} ${!myTurn && phase === 'playing' ? styles.statusWaiting : ''}`}>
        {status}
      </div>

      {phase === 'finished' && (
        <div className={styles.overlay}>
          <div className={`${styles.overlayTitle} ${winner !== 'you' ? styles.overlayLoss : ''}`}>
            {winner === 'you' ? 'ACCESS GRANTED' : 'CONNECTION TERMINATED'}
          </div>
          <button onClick={newGame}>New Game</button>
        </div>
      )}
    </div>
  );
}
