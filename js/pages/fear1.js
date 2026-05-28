/* ─────────────────────────────────────────────
   FEAR INVENTORY (Fear 1) — pg 67–68
───────────────────────────────────────────── */
import { store }                from '../store.js';
import { Modal }                from '../components/Modal.js';
import { traditionBox }         from '../components/TraditionBox.js';
import { uid, esc, safeKey }    from '../utils.js';
import { DEFAULT_FEAR_CATS }    from '../store.js';

export function render(state) {
  const items = state.fears;
  const cats  = state.fearCategories && state.fearCategories.length
    ? state.fearCategories
    : DEFAULT_FEAR_CATS;

  const totals = {};
  cats.forEach(c => { totals[c] = items.filter(f => f.categories.includes(c)).length; });

  return `
  <div class="card">
    <div class="scripture">
      "Where had we been selfish, dishonest, self-seeking and frightened?"
      <cite>— Big Book, pg 67</cite>
    </div>
    <div class="scripture">
      "We reviewed our fears thoroughly."
      <cite>— Big Book, pg 68</cite>
    </div>
  </div>

  <div class="card">
    <h3 style="margin-bottom:12px;">Instructions</h3>
    <div class="note-box">
      <p>
        <strong>1.</strong> Each name and cause from your Causes &amp; Affects carries forward here.
        For each entry, identify the fears that were coloring your memory of that cause.
      </p>
    </div>
    <div class="note-box">
      <p>
        <strong>2.</strong> At the end, add any additional standalone fears — even those
        with no resentment attached — <em>"even though we had no resentment in connection
        with them." (pg 68)</em>
      </p>
    </div>
    <div class="note-box">
      <p>
        <strong>3.</strong> Check every fear category that applies to each entry.
        Add up your totals — patterns will emerge.
      </p>
    </div>
    <div class="sponsor-note">
      💬 Discuss your results and category totals with your sponsor, then move to the Fear Deep Dive.
    </div>
  </div>

  <div class="card">
    <div style="display:flex; align-items:baseline; justify-content:space-between; margin-bottom:8px;">
      <h3>Fear Totals by Category</h3>
      <button class="btn btn-secondary btn-sm" id="btn-edit-cats">✏ Edit Categories</button>
    </div>
    <div class="scripture" style="margin-bottom:14px;">
      "We asked ourselves why we had them."
      <cite>— Big Book, pg 68</cite>
    </div>
    <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:10px;">
      ${cats.map(c => `
      <div style="background:var(--surface2); border:1.5px solid var(--border);
                  border-radius:10px; padding:10px 14px;">
        <div style="font-size:1.3rem; font-weight:800; color:var(--accent);">${totals[c] || 0}</div>
        <div style="font-size:.73rem; color:var(--muted); margin-top:2px;">${esc(c)}</div>
      </div>`).join('')}
    </div>
    <p style="font-size:.73rem; color:var(--muted); margin-top:10px;">
      First-time through? Fine-tune your category list so it fits your experience before adding fear entries.
      Click <strong>✏ Edit Categories</strong> to add, rename, or remove categories.
    </p>
  </div>

  <div class="card">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <h3>Fear Entries (${items.length})</h3>
      <button class="btn btn-primary btn-sm" id="btn-add-fear">+ Add Entry</button>
    </div>

    ${items.length === 0
      ? '<div class="empty-state">No entries yet. Click "+ Add Entry" to begin.</div>'
      : `<div class="entry-list">
          ${items.map(f => `
          <div class="entry-card">
            <div class="entry-body">
              <div class="entry-title">${esc(f.name)}</div>
              ${f.cause ? `<div class="entry-meta" style="margin-bottom:5px;">${esc(f.cause)}</div>` : ''}
              <div>${f.categories.map(c => `<span class="tag tag-orange">${esc(c)}</span>`).join('')}</div>
            </div>
            <button class="btn btn-danger btn-sm delete-fear" data-id="${f.id}">✕</button>
          </div>`).join('')}
        </div>`}
  </div>

  ${items.length >= 3 ? `
  <div class="ready-banner">
    ✅ Review your category totals with your sponsor, then move to the
    <strong>&nbsp;Fear Deep Dive&nbsp;</strong>.
  </div>
  <div class="btn-actions">
    <button class="btn btn-primary" onclick="navigate('fear2')">
      Continue to Fear Deep Dive →
    </button>
  </div>` : ''}

  ${traditionBox('Fear Inventory')}`;
}

export function setupHandlers(state) {
  document.getElementById('btn-add-fear')
    ?.addEventListener('click', () => openAddModal(state));

  document.getElementById('btn-edit-cats')
    ?.addEventListener('click', () => openEditCatsModal(state));

  document.querySelectorAll('.delete-fear').forEach(btn =>
    btn.addEventListener('click', () => deleteEntry(btn.dataset.id))
  );
}

/* ── Add Fear Entry modal ── */
function openAddModal(state) {
  const cats = state.fearCategories && state.fearCategories.length
    ? state.fearCategories : DEFAULT_FEAR_CATS;

  Modal.open('Add Fear Entry', `
    <div class="form-group">
      <label>Name / Situation</label>
      <input type="text" id="fear-name"
        placeholder="Person, cause, or 'Standalone Fear: …'">
    </div>
    <div class="form-group">
      <label>Brief Description</label>
      <input type="text" id="fear-cause" placeholder="What is the fear about?">
    </div>
    <div class="form-group">
      <label>Fear Categories (check all that apply)</label>
      <div class="checkbox-group">
        ${cats.map(c => {
          const k = safeKey(c);
          return `<label class="checkbox-chip" id="fchip-${k}">
            <input type="checkbox" id="fc-${k}"
              onchange="document.getElementById('fchip-${k}').classList.toggle('checked',this.checked)">
            ${esc(c)}
          </label>`;
        }).join('')}
      </div>
    </div>
    <div class="btn-actions">
      <button class="btn btn-primary" id="modal-save-btn">Add</button>
      <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
    </div>
  `);

  document.getElementById('modal-save-btn').addEventListener('click', () => saveEntry(state));
  document.getElementById('modal-cancel-btn').addEventListener('click', () => Modal.close());
  document.getElementById('fear-name').focus();
}

function saveEntry(state) {
  const cats = state.fearCategories && state.fearCategories.length
    ? state.fearCategories : DEFAULT_FEAR_CATS;

  const name = document.getElementById('fear-name').value.trim();
  if (!name) { alert('Please enter a name or description.'); return; }

  const selected = cats.filter(c =>
    document.getElementById('fc-' + safeKey(c))?.checked
  );

  store.update({ fears: [...store.state.fears, {
    id: uid(), name,
    cause:      document.getElementById('fear-cause').value.trim(),
    categories: selected,
  }]});

  Modal.close();
  navigate('fear1');
}

/* ── Edit Categories modal ── */
function openEditCatsModal(state) {
  const cats = [...(state.fearCategories && state.fearCategories.length
    ? state.fearCategories : DEFAULT_FEAR_CATS)];

  Modal.open('Edit Fear Categories', `
    <p style="font-size:.8rem;color:var(--muted);margin-bottom:12px;">
      Rename, remove, or add categories. Default categories can always be restored.
    </p>
    <div id="cat-list" style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px;">
      ${cats.map((c, i) => `
      <div class="cat-row" style="display:flex;gap:8px;align-items:center;">
        <input type="text" class="cat-input" data-idx="${i}" value="${esc(c)}"
          style="flex:1;padding:7px 10px;border:1px solid var(--border);border-radius:8px;
                 background:var(--surface);color:var(--text);font-size:.82rem;">
        <button class="btn btn-danger btn-sm remove-cat" data-idx="${i}">✕</button>
      </div>`).join('')}
    </div>
    <div style="display:flex;gap:8px;margin-bottom:10px;">
      <input type="text" id="new-cat-input" placeholder="New category name…"
        style="flex:1;padding:7px 10px;border:1px solid var(--border);border-radius:8px;
               background:var(--surface);color:var(--text);font-size:.82rem;">
      <button class="btn btn-secondary btn-sm" id="btn-add-cat">+ Add</button>
    </div>
    <div class="btn-actions">
      <button class="btn btn-primary" id="modal-save-cats">Save Categories</button>
      <button class="btn btn-secondary" id="modal-reset-cats">Restore Defaults</button>
      <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
    </div>
  `);

  // Wire up remove buttons
  bindCatModalHandlers();

  document.getElementById('modal-cancel-btn').addEventListener('click', () => Modal.close());
}

function bindCatModalHandlers() {
  document.querySelectorAll('.remove-cat').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.cat-row').remove();
    });
  });

  document.getElementById('btn-add-cat').addEventListener('click', () => {
    const input = document.getElementById('new-cat-input');
    const val   = input.value.trim();
    if (!val) return;

    const list    = document.getElementById('cat-list');
    const rows    = list.querySelectorAll('.cat-row');
    const newIdx  = rows.length;
    const row     = document.createElement('div');
    row.className = 'cat-row';
    row.style.cssText = 'display:flex;gap:8px;align-items:center;';
    row.innerHTML = `
      <input type="text" class="cat-input" data-idx="${newIdx}" value="${esc(val)}"
        style="flex:1;padding:7px 10px;border:1px solid var(--border);border-radius:8px;
               background:var(--surface);color:var(--text);font-size:.82rem;">
      <button class="btn btn-danger btn-sm remove-cat" data-idx="${newIdx}">✕</button>`;
    row.querySelector('.remove-cat').addEventListener('click', () => row.remove());
    list.appendChild(row);
    input.value = '';
    input.focus();
  });

  document.getElementById('modal-save-cats').addEventListener('click', () => {
    const inputs  = document.querySelectorAll('.cat-input');
    const newCats = [...inputs]
      .map(el => el.value.trim())
      .filter(Boolean);
    if (!newCats.length) { alert('You need at least one category.'); return; }
    store.update({ fearCategories: newCats });
    Modal.close();
    navigate('fear1');
  });

  document.getElementById('modal-reset-cats').addEventListener('click', () => {
    if (!confirm('Restore the original default categories? Your current list will be replaced.')) return;
    store.update({ fearCategories: [...DEFAULT_FEAR_CATS] });
    Modal.close();
    navigate('fear1');
  });
}

function deleteEntry(id) {
  if (!confirm('Remove this fear entry?')) return;
  store.update({ fears: store.state.fears.filter(f => f.id !== id) });
  navigate('fear1');
}
