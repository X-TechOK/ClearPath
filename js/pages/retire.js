/* ─────────────────────────────────────────────
   EVENING RETIRE — Step 11, pg 86
───────────────────────────────────────────── */
import { store }         from '../store.js';
import { traditionBox }  from '../components/TraditionBox.js';
import { esc, todayStr } from '../utils.js';

const QUESTIONS = [
  // Self-Examination
  { g: 'Self-Examination', q: '1. Was I resentful with anyone or anything today?' },
  { g: 'Self-Examination', q: '2. Was I selfish today?' },
  { g: 'Self-Examination', q: '3. Was I dishonest today?' },
  { g: 'Self-Examination', q: '4. Was I afraid today?' },
  { g: 'Self-Examination', q: '5. Did I experience anxiety today?' },
  { g: 'Self-Examination', q: '6. Did I feel pressure or stress today?' },
  { g: 'Self-Examination', q: '7. Did I notice myself hurrying today?' },
  { g: 'Self-Examination', q: '8. What could I have done better?' },
  { g: 'Self-Examination', q: '9. Was I thinking of myself most of the time?' },
  { g: 'Self-Examination', q: '10. Did I experience excitement today?' },
  { g: 'Self-Examination', q: '11. Was I carnal today?' },
  { g: 'Self-Examination', q: '12. Was I gluttonous today?' },
  { g: 'Self-Examination', q: '13. Did I exercise discipline in eating today?' },
  { g: 'Self-Examination', q: '14. Was I slothful or procrastinating today?' },
  { g: 'Self-Examination', q: '15. Do I owe an apology to anyone today?' },
  { g: 'Self-Examination', q: '16. Did I offer any defenses today?' },
  { g: 'Self-Examination', q: '17. Did I keep something to myself that should be discussed?' },
  // Positive Review
  { g: 'Positive Review', q: '18. Was I kind?' },
  { g: 'Positive Review', q: '19. Was I gentle?' },
  { g: 'Positive Review', q: '20. Was I cheerful?' },
  { g: 'Positive Review', q: '21. Did I show appreciation for anyone?' },
  { g: 'Positive Review', q: '22. Did I encourage anyone?' },
  { g: 'Positive Review', q: '23. Was I loving toward all?' },
  { g: 'Positive Review', q: '24. Did I consciously counter stress today by saying, "Thy will be done"?' },
  { g: 'Positive Review', q: '25. Did I counter hurrying by relaxing and matching the flow?' },
  { g: 'Positive Review', q: '26. Did I think of what I could do for others?' },
  { g: 'Positive Review', q: '27. Did I think of what I could pack into the stream of life?' },
  // Spiritual Practice
  { g: 'Spiritual Practice', q: '28. Did I read scriptures today?' },
  { g: 'Spiritual Practice', q: '29. Did I exercise today?' },
  { g: 'Spiritual Practice', q: '30. Did I speak to God from my heart today?' },
  { g: 'Spiritual Practice', q: '31. Did I invite God to answer me in my writing today?' },
  { g: 'Spiritual Practice', q: '32. Did I drift into worry, remorse, or morbid reflection?' },
  { g: 'Spiritual Practice', q: '33. God, I ask Thy forgiveness.' },
  { g: 'Spiritual Practice', q: '34. What corrective measures should I take?' },
];

const GROUPS = [...new Set(QUESTIONS.map(q => q.g))];

export function render(state) {
  const today = todayStr();
  const log   = state.eveningLog[today] || { checks: {}, notes: '' };
  const done  = Object.values(log.checks).filter(Boolean).length;

  return `
  <div class="card">
    <div class="scripture">
      "When we retire at night, we constructively review our day."
      <cite>— Big Book, pg 86</cite>
    </div>
    <p>
      Review each question honestly. This is not self-punishment — it is an honest
      daily accounting that keeps you spiritually fit.
    </p>
    <p style="font-size:.78rem; color:var(--accent); margin-top:6px; font-weight:700;">
      Tonight: ${today} &nbsp;·&nbsp; ${done} / ${QUESTIONS.length} reviewed
    </p>
  </div>

  ${GROUPS.map(g => {
    const qs = QUESTIONS.filter(q => q.g === g);
    return `
    <div class="card">
      <h3 style="color:var(--accent); margin-bottom:14px;">${g}</h3>
      ${qs.map(item => {
        const i = QUESTIONS.indexOf(item);
        return `
        <div class="daily-check${log.checks[i] ? ' checked-item' : ''}">
          <input type="checkbox" id="eq-${i}"
            class="evening-check" data-idx="${i}"
            ${log.checks[i] ? 'checked' : ''}>
          <label for="eq-${i}">${esc(item.q)}</label>
        </div>`;
      }).join('')}
    </div>`;
  }).join('')}

  <div class="card">
    <h3 style="margin-bottom:12px;">Evening Notes</h3>
    <div class="form-group">
      <label>Corrective measures, apologies owed, or additional reflections?</label>
      <textarea id="evening-notes" rows="5"
        placeholder="Write your evening reflections here…">${esc(log.notes || '')}</textarea>
    </div>
    <div class="btn-actions">
      <button class="btn btn-primary" id="btn-save-notes">Save Notes</button>
    </div>
  </div>

  ${traditionBox('daily practice')}`;
}

export function setupHandlers() {
  const today = todayStr();

  document.querySelectorAll('.evening-check').forEach(cb => {
    cb.addEventListener('change', () => {
      const idx  = parseInt(cb.dataset.idx);
      const log  = { ...(store.state.eveningLog[today] || { checks: {}, notes: '' }) };
      log.checks = { ...log.checks, [idx]: cb.checked };
      store.update({ eveningLog: { ...store.state.eveningLog, [today]: log } });
      cb.closest('.daily-check').classList.toggle('checked-item', cb.checked);
    });
  });

  document.getElementById('btn-save-notes')?.addEventListener('click', () => {
    const val = document.getElementById('evening-notes').value;
    const log = { ...(store.state.eveningLog[today] || { checks: {}, notes: '' }), notes: val };
    store.update({ eveningLog: { ...store.state.eveningLog, [today]: log } });
    const btn = document.getElementById('btn-save-notes');
    btn.textContent = '✓ Saved';
    setTimeout(() => { btn.textContent = 'Save Notes'; }, 1500);
  });
}
