/* ─────────────────────────────────────────────
   RESENTMENT LIST — Step 4, pg 64–65
───────────────────────────────────────────── */
import { store }         from '../store.js';
import { Modal }         from '../components/Modal.js';
import { traditionBox }  from '../components/TraditionBox.js';
import { uid, esc }      from '../utils.js';

export function render(state) {
  const items = state.resentments;
  const ppl   = items.filter(r => r.type === 'Person');
  const inst  = items.filter(r => r.type === 'Institution');
  const prin  = items.filter(r => r.type === 'Principle');

  return `
  <div class="card">
    <div class="scripture">
      "We listed people, institutions, or principles with whom we were angry."
      <cite>— Big Book, pg 64</cite>
    </div>
    <div class="scripture">
      "We went back through our lives. Nothing counted but thoroughness and honesty."
      <cite>— Big Book, pg 65</cite>
    </div>
  </div>

  <div class="prayer-box">
    <h4>🙏 Third Step Prayer — pg 63</h4>
    <p style="font-size:.75rem; color:var(--muted); margin-bottom:12px;">
      Say this prayer every time you sit down to write.
    </p>
    <div class="prayer-text">
      "God, I offer myself to Thee — to build with me and to do with me as Thou wilt.
      Relieve me of the bondage of self, that I may better do Thy will.
      Take away my difficulties, that victory over them may bear witness to those I would help
      of Thy Power, Thy Love, and Thy Way of life.
      May I do Thy will always."
    </div>
    <p style="font-size:.72rem; color:var(--muted); margin-top:10px; font-style:italic;">
      — Big Book, pg 63
    </p>
  </div>

  <div class="card">
    <h3 style="margin-bottom:12px;">Instructions</h3>
    <div class="note-box">
      <p><strong>1.</strong> Say the Third Step prayer (above) every time you sit down to write.</p>
    </div>
    <div class="note-box">
      <p>
        <strong>2.</strong> Put down every name that causes you to have any memory carrying resentful,
        angry, negative, or fearful echoes. Simply list the name and nothing else.
        <strong>DO NOT EDIT!</strong> If a name comes to mind, <strong>PUT IT DOWN!</strong>
        If you can't remember a name, write something that jogs your memory.
        When you can sit prayerfully for half an hour with no further names coming to mind, you are done.
        <em>(Negative memories: anger, envy, jealousy, competitiveness, vengeful, etc.)</em>
      </p>
      <div class="sponsor-note">
        💬 Discuss moving to the next section with your sponsor when this list is complete.
      </div>
    </div>
  </div>

  <div class="card">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <h3>Your List (${items.length})</h3>
      <button class="btn btn-primary btn-sm" id="btn-add-resentment">+ Add Entry</button>
    </div>

    ${items.length === 0
      ? '<div class="empty-state">No entries yet. Click "+ Add Entry" to begin.</div>'
      : ''}

    ${ppl.length  ? groupSection('People', ppl)       : ''}
    ${inst.length ? groupSection('Institutions', inst) : ''}
    ${prin.length ? groupSection('Principles', prin)   : ''}
  </div>

  ${items.length >= 3 ? `
  <div class="ready-banner">
    ✅ When you can sit for half an hour with no new names coming to mind,
    discuss moving to <strong>&nbsp;Causes &amp; Affects&nbsp;</strong> with your sponsor.
  </div>
  <div class="btn-actions">
    <button class="btn btn-primary" onclick="navigate('causes')">
      Continue to Causes &amp; Affects →
    </button>
  </div>` : ''}

  ${traditionBox('resentment list')}`;
}

function groupSection(label, items) {
  return `
  <div class="section-label">${label} (${items.length})</div>
  <div class="entry-list" style="margin-bottom:14px;">
    ${items.map(r => `
    <div class="entry-card">
      <div class="entry-body">
        <div class="entry-title">${esc(r.name)}</div>
        <div class="entry-meta">
          <span class="tag tag-blue">${r.type}</span>
          ${r.category ? `<span class="tag tag-orange">${esc(r.category)}</span>` : ''}
        </div>
      </div>
      <button class="btn btn-danger btn-sm delete-resentment" data-id="${r.id}">✕</button>
    </div>`).join('')}
  </div>`;
}

export function setupHandlers() {
  document.getElementById('btn-add-resentment')
    ?.addEventListener('click', openAddModal);

  document.querySelectorAll('.delete-resentment').forEach(btn =>
    btn.addEventListener('click', () => deleteEntry(btn.dataset.id))
  );
}

function openAddModal() {
  Modal.open('Add to Resentment List', `
    <div class="form-group">
      <label>Name / Description</label>
      <input type="text" id="r-name" placeholder="e.g. Dad, Church, Speed Limits">
      <p class="hint">If you can't remember a name, write something that jogs your memory.</p>
    </div>
    <div class="form-group">
      <label>Type</label>
      <select id="r-type">
        <option value="Person">Person</option>
        <option value="Institution">Institution</option>
        <option value="Principle">Principle</option>
      </select>
    </div>
    <div class="form-group">
      <label>Optional Note / Category</label>
      <input type="text" id="r-cat" placeholder="e.g. family, work, legal…">
    </div>
    <div class="btn-actions">
      <button class="btn btn-primary" id="modal-save-btn">Add</button>
      <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
    </div>
  `);

  document.getElementById('modal-save-btn').addEventListener('click', saveEntry);
  document.getElementById('modal-cancel-btn').addEventListener('click', () => Modal.close());
  document.getElementById('r-name').focus();
}

function saveEntry() {
  const name = document.getElementById('r-name').value.trim();
  if (!name) { alert('Please enter a name or description.'); return; }

  const updated = [...store.state.resentments, {
    id:       uid(),
    name,
    type:     document.getElementById('r-type').value,
    category: document.getElementById('r-cat').value.trim(),
  }];

  store.update({ resentments: updated });
  Modal.close();
  navigate('lists');
}

function deleteEntry(id) {
  if (!confirm('Remove this entry?')) return;
  store.update({ resentments: store.state.resentments.filter(r => r.id !== id) });
  navigate('lists');
}
