/* ─────────────────────────────────────────────
   8TH STEP — AMENDS LIST  pg 76–77
───────────────────────────────────────────── */
import { store }        from '../store.js';
import { Modal }        from '../components/Modal.js';
import { traditionBox } from '../components/TraditionBox.js';
import { uid, esc }     from '../utils.js';

const WILLINGNESS = [
  { key: 'now',    label: 'Direct – Now',    cls: 'active-now' },
  { key: 'later',  label: 'Direct – Not Yet',cls: 'active-later' },
  { key: 'never',  label: 'Never',           cls: 'active-never' },
  { key: 'living', label: 'Living Amends',   cls: 'active-living' },
];

export function render(state) {
  const items = state.amends;
  return `
  <div class="card">
    <div class="scripture">
      "Made a list of all persons we had harmed and became willing to make amends to them all."
      <cite>— Big Book, pg 59 (Step 8)</cite>
    </div>
    <div class="scripture">
      "I'm resentful at: … The Cause: …"
      <cite>— Big Book, pg 65</cite>
    </div>
  </div>

  <div class="card">
    <h3 style="margin-bottom:12px;">Instructions</h3>
    <div class="note-box">
      <p>
        <strong>1.</strong> All names and causes from your Causes &amp; Affects carry
        forward here — people, institutions, and principles.
      </p>
    </div>
    <div class="note-box">
      <p>
        <strong>2.</strong> Add coded names from your Sex Relations inventory to this list.
        (No need to copy all the questions — just the coded name.)
      </p>
    </div>
    <div class="note-box">
      <p><strong>3.</strong> List anyone you have harmed who does not appear on the previous lists.</p>
    </div>
    <div class="note-box">
      <p>
        <strong>4.</strong> For each entry, list all harms done — both specific and general —
        done to the subject of your resentment.
      </p>
    </div>
    <div class="note-box">
      <p>
        <strong>5.</strong> Indicate your current willingness for each entry:
        <strong>Direct – Now</strong> · <strong>Direct – Not Yet</strong> ·
        <strong>Never</strong> · <strong>Living Amends</strong> (indirect, changed behavior over time).
      </p>
    </div>
    <div class="sponsor-note">
      💬 Review all of this work with your sponsor to plan your amends — either
      direct or living (indirect). Then begin Step 9 (pg 77–84).
    </div>
  </div>

  <div class="card">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <h3>Amends List (${items.length})</h3>
      <button class="btn btn-primary btn-sm" id="btn-add-amend">+ Add Entry</button>
    </div>

    ${items.length === 0
      ? '<div class="empty-state">No entries yet.</div>'
      : `<div class="entry-list">
          ${items.map(a => `
          <div class="entry-card col">
            <div class="entry-header">
              <div>
                <div class="entry-title">${esc(a.name)}</div>
                ${a.cause ? `<div class="entry-meta">${esc(a.cause)}</div>` : ''}
                ${a.harms ? `<p style="font-size:.78rem; color:var(--muted); margin-top:5px;"><strong>Harms:</strong> ${esc(a.harms)}</p>` : ''}
              </div>
              <button class="btn btn-danger btn-sm delete-amend" data-id="${a.id}">✕</button>
            </div>
            <div class="amends-row">
              <span class="amends-label">Willingness:</span>
              ${WILLINGNESS.map(w => `
              <button class="amends-btn ${a.direct === w.key ? w.cls : ''} set-amend"
                data-id="${a.id}" data-val="${w.key}">
                ${w.label}
              </button>`).join('')}
            </div>
          </div>`).join('')}
        </div>`}
  </div>

  ${items.length >= 2 ? `
  <div class="ready-banner">
    ✅ Review this list carefully with your sponsor. Plan each amend individually.
    Then begin Step 9 (pg 77–84).
  </div>` : ''}

  ${traditionBox('8th Step work')}`;
}

export function setupHandlers(state) {
  document.getElementById('btn-add-amend')
    ?.addEventListener('click', () => openAddModal(state));

  document.querySelectorAll('.delete-amend').forEach(btn =>
    btn.addEventListener('click', () => deleteEntry(btn.dataset.id))
  );

  document.querySelectorAll('.set-amend').forEach(btn =>
    btn.addEventListener('click', () => setWillingness(btn.dataset.id, btn.dataset.val))
  );
}

function openAddModal(state) {
  const names = [
    ...new Set([
      ...state.causes.map(c => c.name),
      ...state.sexRelations.map(s => s.code),
    ])
  ];

  const nameOpts = names.length
    ? `<select id="a-name-sel">
        <option value="">-- select from list --</option>
        ${names.map(n => `<option value="${esc(n)}">${esc(n)}</option>`).join('')}
       </select>`
    : '';

  Modal.open('Add Amends Entry', `
    <div class="form-group">
      <label>Name / Code</label>
      ${nameOpts}
      <input type="text" id="a-name-manual"
        placeholder="${names.length ? 'Or type a name / code not on the list' : 'Name or code'}"
        style="${names.length ? 'margin-top:8px;' : ''}">
    </div>
    <div class="form-group">
      <label>Cause (optional)</label>
      <input type="text" id="a-cause"
        placeholder="Brief description of the resentment or harm">
    </div>
    <div class="form-group">
      <label>Harms Done (specific and general)</label>
      <textarea id="a-harms"
        placeholder="List all specific and general harms you caused this person, institution, or principle…"></textarea>
    </div>
    <div class="btn-actions">
      <button class="btn btn-primary" id="modal-save-btn">Add</button>
      <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
    </div>
  `);

  document.getElementById('modal-save-btn').addEventListener('click', saveEntry);
  document.getElementById('modal-cancel-btn').addEventListener('click', () => Modal.close());
}

function saveEntry() {
  const manEl = document.getElementById('a-name-manual');
  const selEl = document.getElementById('a-name-sel');
  const name  = manEl?.value.trim() || selEl?.value.trim() || '';

  if (!name) { alert('Name or code required.'); return; }

  store.update({ amends: [...store.state.amends, {
    id:     uid(),
    name,
    cause:  document.getElementById('a-cause').value.trim(),
    harms:  document.getElementById('a-harms').value.trim(),
    direct: '',
  }]});

  Modal.close();
  navigate('eighth');
}

function setWillingness(id, val) {
  const amends = store.state.amends.map(a =>
    a.id === id ? { ...a, direct: a.direct === val ? '' : val } : a
  );
  store.update({ amends });
  navigate('eighth');
}

function deleteEntry(id) {
  if (!confirm('Remove this entry?')) return;
  store.update({ amends: store.state.amends.filter(a => a.id !== id) });
  navigate('eighth');
}
