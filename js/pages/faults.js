/* ─────────────────────────────────────────────
   OUR FAULTS — pg 66–67
───────────────────────────────────────────── */
import { store }        from '../store.js';
import { Modal }        from '../components/Modal.js';
import { traditionBox } from '../components/TraditionBox.js';
import { uid, esc }     from '../utils.js';

export function render(state) {
  const items = state.faults;

  // Build available cause options: causes not yet worked in faults
  const usedKeys = new Set(items.map(f => f.causeId));
  const available = state.causes.filter(c => !usedKeys.has(c.id));
  const allDone   = state.causes.length > 0 && available.length === 0;

  return `
  <div class="card">
    <div class="scripture">
      "We turned back to the list… we resolutely looked for our own mistakes.
      Where were we to blame?"
      <cite>— Big Book, pg 66–67</cite>
    </div>
    <div class="scripture">
      "Where had we been selfish, dishonest, self-seeking and frightened?"
      <cite>— Big Book, pg 67</cite>
    </div>
  </div>

  <div class="card">
    <h3 style="margin-bottom:12px;">Instructions</h3>
    <div class="note-box">
      <p><strong>1.</strong> Work through each name and cause from your Causes &amp; Affects, one at a time.
      Each cause will disappear from the list once you have worked it.</p>
    </div>
    <div class="note-box">
      <p><strong>2.</strong> Answer as many questions as possible for each cause.</p>
    </div>
    <div class="note-box">
      <p><strong>3. Answers must focus solely on you</strong> — not the other person, institution, or principle.</p>
    </div>
    <div class="note-box">
      <p>
        <strong>4. Answer guide:</strong><br><br>
        <strong>Selfish ("…selfish…" pg 67):</strong> What did I want? (Be specific.)
        Why did I want it? (Always some form of wanting to feel good about myself,
        or not wanting to feel bad about myself.)<br><br>
        <strong>Dishonest ("…dishonest…" pg 67):</strong>
        What were the facts of the situation? What am I not seeing or admitting?
        What lie did I tell myself? (Always present.) What lie do I tell others?
        Have I ever done the thing I resented? Were my expectations reasonable?
        What is the real truth? Did I withhold a truth or action to manipulate the situation?<br><br>
        <strong>Self-Seeking ("…self-seeking…" pg 67):</strong>
        What actions did I take to get what I wanted? (Always present.)
        What actions did I omit? (Less common but just as dysfunctional.)
      </p>
    </div>
  </div>

  <div class="card">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <h3>Fault Entries (${items.length})</h3>
      ${state.causes.length === 0
        ? `<span style="font-size:.75rem;color:var(--muted);">Complete Causes &amp; Affects first</span>`
        : allDone
          ? `<span style="font-size:.75rem;color:var(--success);">All causes worked ✓</span>`
          : `<button class="btn btn-primary btn-sm" id="btn-add-fault">+ Work a Cause</button>`
      }
    </div>

    ${state.causes.length === 0
      ? '<div class="empty-state">Complete your Causes &amp; Affects first — entries will appear here.</div>'
      : items.length === 0
        ? '<div class="empty-state">No fault entries yet. Click "+ Work a Cause" to begin.</div>'
        : `<div class="entry-list">
            ${items.map(f => `
            <div class="entry-card col">
              <div class="entry-header">
                <div>
                  <div class="entry-title">${esc(f.name)}</div>
                  <div class="entry-meta">${esc(f.cause)}</div>
                </div>
                <button class="btn btn-danger btn-sm delete-fault" data-id="${f.id}">✕</button>
              </div>
              ${f.selfish      ? `<p style="font-size:.8rem;margin-top:6px;"><span class="tag tag-orange">Selfish</span> ${esc(f.selfish)}</p>` : ''}
              ${f.dishonest    ? `<p style="font-size:.8rem;margin-top:5px;"><span class="tag tag-blue">Dishonest</span> ${esc(f.dishonest)}</p>` : ''}
              ${f.self_seeking ? `<p style="font-size:.8rem;margin-top:5px;"><span class="tag tag-purple">Self-Seeking</span> ${esc(f.self_seeking)}</p>` : ''}
              ${f.frightened   ? `<p style="font-size:.8rem;margin-top:5px;"><span class="tag tag-red">Frightened</span> ${esc(f.frightened)}</p>` : ''}
            </div>`).join('')}
          </div>`}
  </div>

  ${allDone && items.length > 0 ? `
  <div class="ready-banner">
    ✅ All causes worked. Discuss moving to
    <strong>&nbsp;Fear Inventory&nbsp;</strong> with your sponsor.
  </div>
  <div class="btn-actions">
    <button class="btn btn-primary" onclick="navigate('fear1')">
      Continue to Fear Inventory →
    </button>
  </div>` : items.length >= 2 && !allDone ? `
  <div class="ready-banner" style="background:rgba(194,124,14,.08); border-color:rgba(194,124,14,.3);">
    ⏳ Keep working through the remaining causes.
    When all are complete, discuss moving to <strong>&nbsp;Fear Inventory&nbsp;</strong> with your sponsor.
  </div>` : ''}

  ${traditionBox('Our Faults work')}`;
}

export function setupHandlers(state) {
  document.getElementById('btn-add-fault')
    ?.addEventListener('click', () => openAddModal(state));

  document.querySelectorAll('.delete-fault').forEach(btn =>
    btn.addEventListener('click', () => deleteEntry(btn.dataset.id))
  );
}

function openAddModal(state) {
  const usedKeys  = new Set(store.state.faults.map(f => f.causeId));
  const available = state.causes.filter(c => !usedKeys.has(c.id));

  if (!available.length) {
    alert('All causes have been worked. Great job!');
    return;
  }

  const options = available.map((c, i) =>
    `<option value="${c.id}">${esc(c.name)}: ${esc(c.cause.substring(0, 60))}</option>`
  ).join('');

  Modal.open('Work a Cause', `
    <div class="form-group">
      <label>Name &amp; Cause</label>
      <select id="f-ref">
        <option value="">-- select cause to work --</option>
        ${options}
      </select>
    </div>
    <div class="form-group">
      <label>Where was I selfish? What did I want and why?</label>
      <textarea id="f-selfish" placeholder="Be specific. Always some form of wanting to feel good or not feel bad about myself."></textarea>
    </div>
    <div class="form-group">
      <label>Where was I dishonest? What lie did I tell myself or others?</label>
      <textarea id="f-dishonest" placeholder="Facts, what I'm not admitting, the lie I tell myself (always present)…"></textarea>
    </div>
    <div class="form-group">
      <label>Where was I self-seeking? What did I do or omit to get what I wanted?</label>
      <textarea id="f-self_seeking" placeholder="Actions taken (always present). Actions omitted (less common but just as dysfunctional)."></textarea>
    </div>
    <div class="form-group">
      <label>Where was I frightened? What underlying fear was present?</label>
      <textarea id="f-frightened" placeholder="What fear drove my behavior in this situation?"></textarea>
    </div>
    <div class="btn-actions">
      <button class="btn btn-primary" id="modal-save-btn">Save</button>
      <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
    </div>
  `);

  document.getElementById('modal-save-btn').addEventListener('click', () => saveEntry(state));
  document.getElementById('modal-cancel-btn').addEventListener('click', () => Modal.close());
}

function saveEntry(state) {
  const refEl = document.getElementById('f-ref');
  if (!refEl || !refEl.value) { alert('Please select a cause to work.'); return; }

  const causeId = refEl.value;
  const c = state.causes.find(x => x.id === causeId);
  if (!c) { alert('Cause not found.'); return; }

  store.update({ faults: [...store.state.faults, {
    id:          uid(),
    causeId:     c.id,
    name:        c.name,
    cause:       c.cause,
    selfish:     document.getElementById('f-selfish').value.trim(),
    dishonest:   document.getElementById('f-dishonest').value.trim(),
    self_seeking: document.getElementById('f-self_seeking').value.trim(),
    frightened:  document.getElementById('f-frightened').value.trim(),
  }]});

  Modal.close();
  navigate('faults');
}

function deleteEntry(id) {
  if (!confirm('Remove this entry? The cause will become available to work again.')) return;
  store.update({ faults: store.state.faults.filter(f => f.id !== id) });
  navigate('faults');
}
