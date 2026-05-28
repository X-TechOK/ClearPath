/* ─────────────────────────────────────────────
   CAUSES & AFFECTS — pg 64–65
───────────────────────────────────────────── */
import { store }        from '../store.js';
import { Modal }        from '../components/Modal.js';
import { traditionBox } from '../components/TraditionBox.js';
import { uid, esc }     from '../utils.js';

const INSTINCTS = [
  { key: 'self_esteem',   label: 'Self-Esteem' },
  { key: 'security',      label: 'Security' },
  { key: 'ambitions',     label: 'Ambitions' },
  { key: 'personal',      label: 'Personal Relations' },
  { key: 'sex',           label: 'Sex Relations' },
  { key: 'fear',          label: 'Fear (always present)' },
  { key: 'sponsor_flag',  label: 'Sponsor Flag' },
];

export function render(state) {
  const items    = state.causes;        // flat array of cause rows
  const resNames = [...new Set(state.resentments.map(r => r.name))];
  // Names already present in the causes table
  const usedNames = [...new Set(items.map(c => c.name))];

  // Group cause rows by resentment name for display
  const groups = resNames
    .filter(n => usedNames.includes(n))
    .map(n => ({ name: n, rows: items.filter(c => c.name === n) }));

  // Names not yet in any cause row — available in the "add group" dropdown
  const availableNames = resNames.filter(n => !usedNames.includes(n));

  return `
  <div class="card">
    <div class="scripture">
      "Resentment is the number one offender."
      <cite>— Big Book, pg 64</cite>
    </div>
    <div class="scripture">
      "On our grudge list we set opposite each name our injuries."
      <cite>— Big Book, pg 65</cite>
    </div>
    <div class="scripture">
      "Was it our self-esteem, our security, our ambitions, our personal, or sex relations,
      which had been interfered with?"
      <cite>— Big Book, pg 64–65 (Instincts) · 12 &amp; 12, pg 42</cite>
    </div>
    <div class="scripture">
      "Notice that the word 'fear' is bracketed alongside the difficulties…"
      <cite>— Big Book, pg 67</cite>
    </div>
  </div>

  <div class="card">
    <h3 style="margin-bottom:12px;">Instructions</h3>
    <div class="note-box">
      <p>
        <strong>The Cause:</strong>
        Write down every cause of a resentment on a separate line beside that person's name.
        <strong>Write only facts — 10 words or less.</strong>
        When there is no specific cause but a resentment still exists, leave the name on the list
        and discuss it with your sponsor.
      </p>
    </div>
    <div class="note-box">
      <p>
        <strong>Affects my…:</strong>
        Check every instinct that was affected for each cause. Fear is always present.
        Use <strong>Sponsor Flag</strong> to mark entries you want to bring up with your sponsor.
      </p>
    </div>
    <div class="sponsor-note">
      💬 Focus on the causes and don't worry too much about the Affects. After reviewing
      the causes with your sponsor you'll go back to refine the Affects selections as a final
      exercise before moving on to the Faults section.
    </div>
  </div>

  <div class="card">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <h3>Causes &amp; Affects (${items.length} cause${items.length !== 1 ? 's' : ''})</h3>
      ${availableNames.length
        ? `<button class="btn btn-primary btn-sm" id="btn-add-cause-group">+ Add Name</button>`
        : resNames.length === 0
          ? `<span style="font-size:.75rem;color:var(--muted);">Add resentments first</span>`
          : `<span style="font-size:.75rem;color:var(--muted);">All names added ✓</span>`
      }
    </div>

    ${items.length === 0
      ? '<div class="empty-state">No causes yet. Click "+ Add Name" to begin working through your resentment list.</div>'
      : groups.map(group => causesGroupHTML(group)).join('')
    }
  </div>

  ${items.length >= 3 ? `
  <div class="ready-banner">
    ✅ When all causes and affects are complete, discuss moving to
    <strong>&nbsp;Our Faults&nbsp;</strong> with your sponsor.
  </div>
  <div class="btn-actions">
    <button class="btn btn-primary" onclick="navigate('faults')">
      Continue to Our Faults →
    </button>
  </div>` : ''}

  ${traditionBox('Causes & Affects work')}`;
}

function causesGroupHTML(group) {
  return `
  <div class="causes-group" data-name="${esc(group.name)}">
    <div class="causes-group-header">
      <span class="causes-group-name">${esc(group.name)}</span>
      <button class="btn btn-secondary btn-sm add-cause-row" data-name="${esc(group.name)}">+ Cause</button>
    </div>
    <div class="table-wrap">
      <table class="instinct-table">
        <thead>
          <tr>
            <th class="cause-col">Cause (≤10 words)</th>
            ${INSTINCTS.map(ins => `
            <th class="instinct-col" title="${esc(ins.label)}">
              <span class="vert-header">${esc(ins.label)}</span>
            </th>`).join('')}
            <th class="del-col"></th>
          </tr>
        </thead>
        <tbody>
          ${group.rows.map(c => `
          <tr>
            <td class="cause-col">${esc(c.cause)}</td>
            ${INSTINCTS.map(ins => `
            <td class="instinct-cell${c[ins.key] ? (ins.key === 'sponsor_flag' ? ' flag-on' : ' checked-on') : ''}">
              ${c[ins.key] ? (ins.key === 'sponsor_flag' ? '🚩' : '✓') : ''}
            </td>`).join('')}
            <td>
              <button class="btn btn-danger btn-sm delete-cause" data-id="${c.id}">✕</button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

export function setupHandlers(state) {
  // Add a whole new name group
  document.getElementById('btn-add-cause-group')
    ?.addEventListener('click', () => openNameModal(state));

  // Add a cause row to an existing name
  document.querySelectorAll('.add-cause-row').forEach(btn => {
    btn.addEventListener('click', () => openCauseModal(btn.dataset.name));
  });

  document.querySelectorAll('.delete-cause').forEach(btn =>
    btn.addEventListener('click', () => deleteEntry(btn.dataset.id))
  );
}

/** Step 1: pick a name from the remaining resentment list */
function openNameModal(state) {
  const usedNames    = [...new Set(store.state.causes.map(c => c.name))];
  const resNames     = [...new Set(state.resentments.map(r => r.name))];
  const availNames   = resNames.filter(n => !usedNames.includes(n));

  if (!availNames.length) return;

  Modal.open('Add Name to Work', `
    <p style="font-size:.82rem;color:var(--muted);margin-bottom:12px;">
      Select a name from your resentment list. Once added, it will no longer appear in this list.
    </p>
    <div class="form-group">
      <label>I am resentful at…</label>
      <select id="cn-sel">
        <option value="">-- select a name --</option>
        ${availNames.map(n => `<option value="${esc(n)}">${esc(n)}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label>First Cause — facts only, ≤10 words</label>
      <input type="text" id="cn-cause" placeholder="e.g. Did not return money he owed me">
    </div>
    <div class="form-group">
      <label>Affects My…</label>
      ${instinctCheckboxes()}
    </div>
    <div class="btn-actions">
      <button class="btn btn-primary" id="modal-save-btn">Add</button>
      <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
    </div>
  `);

  document.getElementById('modal-save-btn').addEventListener('click', saveNameAndCause);
  document.getElementById('modal-cancel-btn').addEventListener('click', () => Modal.close());
  document.getElementById('cn-sel').focus();
}

/** Step 2 (subsequent rows): add another cause row to an existing name */
function openCauseModal(name) {
  Modal.open(`Add Cause — ${name}`, `
    <div class="form-group">
      <label>Cause — facts only, ≤10 words</label>
      <input type="text" id="cc-cause" placeholder="e.g. Embarrassed me in front of family">
    </div>
    <div class="form-group">
      <label>Affects My…</label>
      ${instinctCheckboxes()}
    </div>
    <div class="btn-actions">
      <button class="btn btn-primary" id="modal-save-btn">Add Cause</button>
      <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
    </div>
  `);

  document.getElementById('modal-save-btn').addEventListener('click', () => saveCauseRow(name));
  document.getElementById('modal-cancel-btn').addEventListener('click', () => Modal.close());
  document.getElementById('cc-cause').focus();
}

function instinctCheckboxes() {
  return `<div class="checkbox-group">
    ${INSTINCTS.map(({ key, label }) =>
      `<label class="checkbox-chip" id="chip-${key}">
        <input type="checkbox" id="c-${key}"
          onchange="document.getElementById('chip-${key}').classList.toggle('checked',this.checked)">
        ${label}
      </label>`
    ).join('')}
  </div>`;
}

function readInstincts(prefix = 'c-') {
  const result = {};
  INSTINCTS.forEach(({ key }) => {
    result[key] = document.getElementById(prefix + key)?.checked ?? false;
  });
  return result;
}

function saveNameAndCause() {
  const name  = document.getElementById('cn-sel').value.trim();
  const cause = document.getElementById('cn-cause').value.trim();
  if (!name)  { alert('Please select a name.'); return; }
  if (!cause) { alert('Please enter a cause.'); return; }

  const entry = { id: uid(), name, cause, ...readInstincts() };
  store.update({ causes: [...store.state.causes, entry] });
  Modal.close();
  navigate('causes');
}

function saveCauseRow(name) {
  const cause = document.getElementById('cc-cause').value.trim();
  if (!cause) { alert('Please enter a cause.'); return; }

  const entry = { id: uid(), name, cause, ...readInstincts() };
  store.update({ causes: [...store.state.causes, entry] });
  Modal.close();
  navigate('causes');
}

function deleteEntry(id) {
  if (!confirm('Remove this cause entry?')) return;
  store.update({ causes: store.state.causes.filter(c => c.id !== id) });
  navigate('causes');
}
