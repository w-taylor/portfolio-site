import { describe, it, expect } from 'vitest';
import { gameReducer, initialState } from '@/components/node-sweep/NodeSweepClient';
import { createEmptyGrid } from '@/components/node-sweep/nodeSweepLogic';

function freshState(overrides = {}) {
  return { ...initialState, myGrid: createEmptyGrid(), attackGrid: createEmptyGrid(), ...overrides };
}

describe('gameReducer', () => {
  describe('simple setters', () => {
    it('RESET returns to initial state', () => {
      const dirty = freshState({ phase: 'playing', myTurn: true, winner: 'you', placedNodes: [[0, 0]], nodesConfirmed: true });
      const result = gameReducer(dirty, { type: 'RESET' });
      expect(result.phase).toBe('menu');
      expect(result.myTurn).toBe(false);
      expect(result.winner).toBeNull();
      expect(result.placedNodes).toEqual([]);
      expect(result.serverIndex).toBeNull();
      expect(result.nodesConfirmed).toBe(false);
      expect(result.myGrid.every(r => r.every(c => c === null))).toBe(true);
      expect(result.attackGrid.every(r => r.every(c => c === null))).toBe(true);
    });

    it('SET_PHASE updates phase', () => {
      const result = gameReducer(freshState(), { type: 'SET_PHASE', phase: 'joining' });
      expect(result.phase).toBe('joining');
    });

    it('SET_STATUS updates status', () => {
      const result = gameReducer(freshState(), { type: 'SET_STATUS', status: 'Connection error' });
      expect(result.status).toBe('Connection error');
    });

    it('SET_JOIN_CODE updates joinCode', () => {
      const result = gameReducer(freshState(), { type: 'SET_JOIN_CODE', joinCode: 'ABCD' });
      expect(result.joinCode).toBe('ABCD');
    });

    it('SET_MODE updates mode', () => {
      const result = gameReducer(freshState(), { type: 'SET_MODE', mode: 'bot' });
      expect(result.mode).toBe('bot');
    });
  });

  describe('game lifecycle', () => {
    it('GAME_CREATED with gameCode sets phase to waiting', () => {
      const result = gameReducer(freshState(), {
        type: 'GAME_CREATED', player: 1, gameCode: 'XYZ123',
      });
      expect(result.phase).toBe('waiting');
      expect(result.gameCode).toBe('XYZ123');
      expect(result.player).toBe(1);
      expect(result.status).toBe('Waiting for opponent...');
    });

    it('GAME_CREATED without gameCode (bot) sets phase to setup', () => {
      const result = gameReducer(freshState(), {
        type: 'GAME_CREATED', player: 1, gameCode: undefined,
      });
      expect(result.phase).toBe('setup');
      expect(result.player).toBe(1);
      expect(result.status).toContain('Place a server node');
    });

    it('GAME_JOINED sets player and phase to setup', () => {
      const result = gameReducer(freshState(), { type: 'GAME_JOINED', player: 2 });
      expect(result.phase).toBe('setup');
      expect(result.player).toBe(2);
      expect(result.status).toContain('Place a server node');
    });

    it('OPPONENT_JOINED sets phase to setup and updates status', () => {
      const state = freshState({ phase: 'waiting', status: 'Waiting for opponent...' });
      const result = gameReducer(state, { type: 'OPPONENT_JOINED' });
      expect(result.phase).toBe('setup');
      expect(result.status).toContain('Opponent joined');
    });

    it('NODES_PLACED updates status to waiting message and sets nodesConfirmed', () => {
      const state = freshState({ phase: 'setup' });
      const result = gameReducer(state, { type: 'NODES_PLACED' });
      expect(result.status).toBe('Waiting for game to start...');
      expect(result.nodesConfirmed).toBe(true);
    });

    it('TURN_START yourTurn=true sets myTurn and correct status', () => {
      const state = freshState({ phase: 'setup' });
      const result = gameReducer(state, { type: 'TURN_START', yourTurn: true });
      expect(result.phase).toBe('playing');
      expect(result.myTurn).toBe(true);
      expect(result.status).toContain('Your turn');
    });

    it('TURN_START yourTurn=false sets opponent turn status', () => {
      const state = freshState({ phase: 'setup' });
      const result = gameReducer(state, { type: 'TURN_START', yourTurn: false });
      expect(result.phase).toBe('playing');
      expect(result.myTurn).toBe(false);
      expect(result.status).toContain("Opponent's turn");
    });

    it('GAME_OVER sets phase to finished and stores winner', () => {
      const state = freshState({ phase: 'playing' });
      const result = gameReducer(state, { type: 'GAME_OVER', winner: 'you' });
      expect(result.phase).toBe('finished');
      expect(result.winner).toBe('you');
    });

    it('OPPONENT_DISCONNECTED sets phase to disconnected', () => {
      const state = freshState({ phase: 'playing' });
      const result = gameReducer(state, { type: 'OPPONENT_DISCONNECTED' });
      expect(result.phase).toBe('disconnected');
      expect(result.status).toBe('Opponent disconnected.');
    });

    it('GAME_EXPIRED sets phase to disconnected', () => {
      const state = freshState({ phase: 'playing' });
      const result = gameReducer(state, { type: 'GAME_EXPIRED' });
      expect(result.phase).toBe('disconnected');
      expect(result.status).toContain('expired');
    });
  });

  describe('grid mutations', () => {
    it('PROBE_RESULT writes hit/distance to attackGrid', () => {
      const state = freshState();
      const result = gameReducer(state, {
        type: 'PROBE_RESULT', row: 2, col: 3, hit: false, distance: 4,
      });
      expect(result.attackGrid[2][3]).toEqual({ hit: false, isServer: false, distance: 4 });
    });

    it('PROBE_RESULT with invalidated cells marks them', () => {
      const state = freshState();
      // Place a prior miss at (0,0) so it can be invalidated
      state.attackGrid[0][0] = { hit: false, distance: 5 };
      const result = gameReducer(state, {
        type: 'PROBE_RESULT', row: 1, col: 1, hit: true, isServer: false, distance: 0,
        invalidated: [[0, 0]],
      });
      expect(result.attackGrid[0][0].invalidated).toBe(true);
      expect(result.attackGrid[1][1].hit).toBe(true);
    });

    it('PROBE_RESULT does not invalidate cells that were hits', () => {
      const state = freshState();
      state.attackGrid[0][0] = { hit: true, isServer: false, distance: 0 };
      const result = gameReducer(state, {
        type: 'PROBE_RESULT', row: 1, col: 1, hit: false, distance: 3,
        invalidated: [[0, 0]],
      });
      // Hit cell should NOT get invalidated flag
      expect(result.attackGrid[0][0].invalidated).toBeUndefined();
    });

    it('OPPONENT_PROBED marks cell as probed on myGrid', () => {
      const state = freshState();
      const result = gameReducer(state, {
        type: 'OPPONENT_PROBED', row: 4, col: 5, hit: true,
      });
      expect(result.myGrid[4][5]).toEqual({ probed: true, hit: true });
    });
  });

  describe('node placement', () => {
    it('PLACE_NODE appends to placedNodes and sets serverIndex if null', () => {
      const state = freshState();
      const result = gameReducer(state, { type: 'PLACE_NODE', position: [1, 2] });
      expect(result.placedNodes).toEqual([[1, 2]]);
      expect(result.serverIndex).toBe(0);
    });

    it('PLACE_NODE does not change serverIndex when already set', () => {
      const state = freshState({ placedNodes: [[0, 0]], serverIndex: 0 });
      const result = gameReducer(state, { type: 'PLACE_NODE', position: [2, 2] });
      expect(result.placedNodes).toEqual([[0, 0], [2, 2]]);
      expect(result.serverIndex).toBe(0);
    });

    it('REMOVE_NODE removes correct node and adjusts serverIndex', () => {
      const state = freshState({ placedNodes: [[0, 0], [1, 1], [2, 2]], serverIndex: 2 });
      const result = gameReducer(state, { type: 'REMOVE_NODE', index: 0 });
      expect(result.placedNodes).toEqual([[1, 1], [2, 2]]);
      expect(result.serverIndex).toBe(1); // shifted down
    });

    it('REMOVE_NODE the server node sets serverIndex to null', () => {
      const state = freshState({ placedNodes: [[0, 0], [1, 1], [2, 2]], serverIndex: 1 });
      const result = gameReducer(state, { type: 'REMOVE_NODE', index: 1 });
      expect(result.placedNodes).toEqual([[0, 0], [2, 2]]);
      expect(result.serverIndex).toBeNull();
    });
  });

  describe('stats', () => {
    it('GO_TO_STATS sets phase and loading true', () => {
      const result = gameReducer(freshState(), { type: 'GO_TO_STATS' });
      expect(result.phase).toBe('stats');
      expect(result.statsLoading).toBe(true);
      expect(result.stats).toBeNull();
      expect(result.statsError).toBeNull();
    });

    it('STATS_LOADED sets loading false and stores stats', () => {
      const state = freshState({ phase: 'stats', statsLoading: true });
      const stats = { total_games: 10, bot_winrate: 0.5 };
      const result = gameReducer(state, { type: 'STATS_LOADED', stats });
      expect(result.statsLoading).toBe(false);
      expect(result.stats).toEqual(stats);
    });

    it('STATS_ERROR sets loading false and stores error', () => {
      const state = freshState({ phase: 'stats', statsLoading: true });
      const result = gameReducer(state, { type: 'STATS_ERROR', error: 'Network failure' });
      expect(result.statsLoading).toBe(false);
      expect(result.statsError).toBe('Network failure');
    });
  });

  describe('default', () => {
    it('unknown action type returns state unchanged', () => {
      const state = freshState({ phase: 'playing', myTurn: true });
      const result = gameReducer(state, { type: 'NONEXISTENT' });
      expect(result).toBe(state);
    });
  });
});
