/* ─────────────────────────────────────────────
   STORAGE
   Persistent local storage layer using IndexedDB
   with a localStorage fallback.

   Phase 2 hook: replace save/load here to add
   encrypted cloud sync — all pages call only
   storage.save() and storage.load(), so the
   change is isolated to this one file.
───────────────────────────────────────────── */

const DB_NAME    = 'StepWorkApp';
const DB_VERSION = 1;
const STORE_NAME = 'state';
const STATE_KEY  = 'appState';

let db = null;

/** Open (or upgrade) the IndexedDB database. */
async function openDB() {
  if (db) return db;
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = e => {
      e.target.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = e => { db = e.target.result; resolve(db); };
    req.onerror   = () => reject(req.error);
  });
}

/** Save the full state object. */
export async function saveState(state) {
  try {
    const database = await openDB();
    return new Promise((resolve, reject) => {
      const tx  = database.transaction(STORE_NAME, 'readwrite');
      const req = tx.objectStore(STORE_NAME).put(state, STATE_KEY);
      req.onsuccess = () => resolve();
      req.onerror   = () => reject(req.error);
    });
  } catch (e) {
    // Fallback to localStorage
    try { localStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch {}
  }
}

/** Load the full state object, or return null if nothing stored. */
export async function loadState() {
  try {
    const database = await openDB();
    return new Promise((resolve, reject) => {
      const tx  = database.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(STATE_KEY);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror   = () => reject(req.error);
    });
  } catch (e) {
    // Fallback to localStorage
    try {
      const raw = localStorage.getItem(STATE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
}

/** Export state as a downloadable JSON file. */
export function exportJSON(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  a.href     = url;
  a.download = `step-work-backup-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Import state from a JSON file chosen by the user. */
export function importJSON(onSuccess) {
  const input = document.createElement('input');
  input.type  = 'file';
  input.accept = '.json';
  input.onchange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    try {
      const data = JSON.parse(text);
      onSuccess(data);
    } catch {
      alert('Invalid backup file — could not parse JSON.');
    }
  };
  input.click();
}
