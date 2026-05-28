/* ─────────────────────────────────────────────
   EXPORT / BACKUP PAGE
───────────────────────────────────────────── */
import { store }               from '../store.js';
import { traditionBox }        from '../components/TraditionBox.js';
import { exportJSON, importJSON } from '../storage.js';

export function render() {
  return `
  <div class="card">
    <h3>Export &amp; Backup</h3>
    <p style="margin-top:8px;">
      Your data is stored in your browser's IndexedDB — it persists across browser sessions
      on this device. Export a backup JSON file regularly, especially before clearing your
      browser data or switching devices.
    </p>
    <div class="btn-actions" style="margin-top:16px;">
      <button class="btn btn-primary" id="btn-export">⬇ Download Backup (.json)</button>
      <button class="btn btn-secondary" id="btn-import">⬆ Import Backup</button>
    </div>
  </div>

  <div class="card">
    <h3>About Your Privacy</h3>
    <p style="margin-top:8px; line-height:1.7;">
      This app stores all data locally on your device only. No accounts, no servers,
      no analytics. Your inventory is never transmitted anywhere.
    </p>
    <p style="margin-top:8px; line-height:1.7;">
      <strong>Phase 2 (coming later):</strong> Optional encrypted cloud backup will be
      available. Your data will be encrypted on your device before upload — the server
      will only ever store unreadable ciphertext.
    </p>
  </div>

  <div class="card" style="border-color:rgba(192,57,43,.25);">
    <h3 style="color:var(--danger);">Clear All Data</h3>
    <p style="margin-top:8px; color:var(--muted);">
      This permanently deletes all your step work from this device.
      Export a backup first — this cannot be undone.
    </p>
    <div class="btn-actions" style="margin-top:14px;">
      <button class="btn btn-danger" id="btn-clear">🗑 Clear All Data</button>
    </div>
  </div>

  ${traditionBox('your recovery work')}`;
}

export function setupHandlers() {
  document.getElementById('btn-export')?.addEventListener('click', () => {
    exportJSON(store.state);
  });

  document.getElementById('btn-import')?.addEventListener('click', () => {
    importJSON(data => {
      if (confirm('This will replace all current data with the backup. Continue?')) {
        store.setState(data);
        navigate('home');
      }
    });
  });

  document.getElementById('btn-clear')?.addEventListener('click', () => {
    if (!confirm('Are you sure? All your work will be permanently deleted.')) return;
    if (!confirm('This cannot be undone. Confirm clear?')) return;
    store.clear();
    navigate('home');
  });
}
