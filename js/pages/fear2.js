/* ─────────────────────────────────────────────
   FEAR DEEP DIVE (Fear 2) — 12 & 12, pg 49–53
───────────────────────────────────────────── */
import { store, DEFAULT_FEAR_CATS } from '../store.js';
import { traditionBox }             from '../components/TraditionBox.js';
import { esc, safeKey }             from '../utils.js';

const FEAR_QS = [
  '1. Why did I have this fear?',
  '2. When did I first notice this fear in my life?',
  '3. How did I hold onto this fear?',
  '4. What did this fear make me do?',
  '5. What chain of circumstances did this fear set in motion in my life?',
  '6. How did I react to this fear?',
  '7. What decision did this fear cause me to make?',
  '8. How did self-reliance fail me?',
  '9. What should I have done instead? (Answer is always: "I should have trusted and relied upon God by…")',
];

export function render(state) {
  // Read categories from store (editable). Fall back to defaults if missing.
  const storeCats  = state.fearCategories && state.fearCategories.length
    ? state.fearCategories : DEFAULT_FEAR_CATS;
  // Show only categories the user has logged, or all store cats if none logged yet
  const usedCats = [...new Set(state.fears.flatMap(f => f.categories))];
  const allCats  = usedCats.length ? usedCats : storeCats;

  return `
  <div class="card">
    <div class="scripture">
      "Unreasonable fear that our instincts will not be satisfied drives us to covet the
      possessions of others, to lust for sex and power, to become angry when our instinctive
      demands are threatened, to be envious when the ambitions of others seem to be realized
      while ours are not."
      <cite>— 12 &amp; 12, pg 49</cite>
    </div>
    <div class="scripture">
      "Questions like these, more of which will come to mind easily in each individual case,
      will help turn up the root causes."
      <cite>— 12 &amp; 12, pgs 52–53</cite>
    </div>
  </div>

  <div class="card">
    <h3 style="margin-bottom:10px;">Instructions</h3>
    <div class="note-box">
      <p><strong>1.</strong> Answer all questions for each separate fear category. Work one category at a time.</p>
    </div>
    <div class="note-box">
      <p><strong>2.</strong> If you identified an additional fear category in the Fear Inventory, it will appear below.</p>
    </div>
    <div class="sponsor-note">
      💬 Discuss your answers with your sponsor before moving on to Sex Relations.
    </div>
  </div>

  ${allCats.map(cat => {
    const data = state.fear2[cat] || {};
    const k    = safeKey(cat);
    return `
    <div class="card">
      <h3 style="color:var(--accent2); margin-bottom:16px;">${esc(cat)}</h3>
      ${FEAR_QS.map((q, i) => `
      <div class="form-group">
        <label>${q}</label>
        <textarea
          id="f2-${k}-${i}"
          data-cat="${esc(cat)}"
          data-idx="${i}"
          class="fear2-textarea"
          placeholder="Write your answer here…">${esc(data[i] || '')}</textarea>
      </div>`).join('')}
    </div>`;
  }).join('')}

  <div class="ready-banner" style="margin-top:4px;">
    ✅ Once all categories are answered, discuss with your sponsor and move to
    <strong>&nbsp;Sex Relations&nbsp;</strong>.
  </div>
  <div class="btn-actions">
    <button class="btn btn-primary" onclick="navigate('sex')">
      Continue to Sex Relations →
    </button>
  </div>

  ${traditionBox('Fear Deep Dive')}`;
}

export function setupHandlers(state) {
  // Restore saved values (render already inlines them via esc(),
  // but we wire up blur-save here)
  document.querySelectorAll('.fear2-textarea').forEach(ta => {
    ta.addEventListener('blur', () => {
      const cat = ta.dataset.cat;
      const idx = parseInt(ta.dataset.idx);
      const val = ta.value;

      const fear2 = { ...store.state.fear2 };
      if (!fear2[cat]) fear2[cat] = {};
      fear2[cat][idx] = val;
      store.update({ fear2 });
    });
  });
}
