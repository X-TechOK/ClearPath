/* ─────────────────────────────────────────────
   STORE
   Single source of truth for all app state.
   Pages read from store.state and call
   store.update() to mutate and persist.

   Subscriber pattern: any module can call
   store.subscribe(fn) to be notified of changes.
   The router uses this to refresh progress badges.
───────────────────────────────────────────── */

import { saveState, loadState } from './storage.js';

/** Default fear categories — user can add/remove/rename, but these are the starting point. */
export const DEFAULT_FEAR_CATS = [
  "Other People's Opinions",
  "Not Getting What I Want",
  "Not Having Control",
  "Financial Insecurity",
  "Abandonment",
  "Physical Harm",
  "Failure",
  "Success",
];

/** Default empty state shape. */
const DEFAULT_STATE = {
  resentments:    [],   // { id, name, type, category }
  causes:         [],   // { id, name, cause, self_esteem, security, ambitions, personal, sex, fear, sponsor_flag }
  faults:         [],   // { id, causeId, name, cause, selfish, dishonest, self_seeking, frightened }
  fearCategories: [...DEFAULT_FEAR_CATS], // editable list of fear category strings
  fears:          [],   // { id, name, cause, categories: [] }
  fear2:          {},   // { categoryName: { 0: answer, 1: answer, … } }
  sexRelations:   [],   // { id, code, answers: { 0: '', … } }
  amends:         [],   // { id, name, cause, harms, direct: 'now'|'later'|'never'|'living'|'' }
  morningLog:     {},   // { 'YYYY-MM-DD': { checked: [], intent: '' } }
  eveningLog:     {},   // { 'YYYY-MM-DD': { checks: {}, notes: '' } }
};

let _state = structuredClone(DEFAULT_STATE);
const _subscribers = new Set();

/** Read-only snapshot of current state. */
export const store = {
  get state() { return _state; },

  /** Replace entire state (used on import / load). */
  setState(newState) {
    _state = { ...DEFAULT_STATE, ...newState };
    _notify();
    saveState(_state);
  },

  /** Merge a partial update into state and persist. */
  update(patch) {
    _state = { ..._state, ...patch };
    _notify();
    saveState(_state);
  },

  /** Subscribe to state changes. Returns an unsubscribe fn. */
  subscribe(fn) {
    _subscribers.add(fn);
    return () => _subscribers.delete(fn);
  },

  /** Load persisted state from IndexedDB on startup. */
  async init() {
    const saved = await loadState();
    if (saved) _state = { ...DEFAULT_STATE, ...saved };
    _notify();
  },

  /** Reset to factory defaults. */
  clear() {
    _state = structuredClone(DEFAULT_STATE);
    _notify();
    saveState(_state);
  },
};

function _notify() {
  _subscribers.forEach(fn => fn(_state));
}
