/* ─────────────────────────────────────────────
   MORNING AWAKENING — Step 11, pg 86
───────────────────────────────────────────── */
import { store }        from '../store.js';
import { traditionBox } from '../components/TraditionBox.js';
import { esc, todayStr } from '../utils.js';

const PRAYERS = [
  'Good morning, Father. Thank you for all that I am becoming through your love and grace.',
  'Father, please direct my thinking today.',
  'Please reveal Thy will for me today and grant me the power to carry it out.',
  'When I am indecisive, please grant me "inspiration, an intuitive thought, or a decision."',
  'Please remove my fear and procrastination and direct my attention to what you would have me be.',
  'Please save me from unhealthy obsessing and help me to think about the 24 hours ahead.',
  'Lord, please grant me the right thought or action.',
  'Please help me watch for agitation, doubt, or people pleasing.',
  'Lord, please help me to "relax and take it easy… don\'t struggle."',
  'I ask Thee to grant me freedom from self-will.',
  'Please grant me freedom from self-pity. Thank you for my challenges, Lord.',
  'Please direct my thoughts to rigorous honesty and selfless motives. Help me think of others.',
  'Lord, please show me my next step and grant whatever I need to take care of every situation.',
  'I will pray and meditate as I seek relief from anxiety, worry, fear, excitement, or disturbance.',
  'Lord, I pray that Thou will grant me the strength and humility to restrain my tongue and pen.',
  'My Creator, I am now willing that you should have all of me, good and bad. I pray that you now remove from me every single defect of character (and limitation) which stands in the way of my usefulness to you and my fellows today. Grant me strength, as I go out from here, to do your bidding. (pg 76)',
  'Thy will be done through me this day, I pray. Amen.',
];

export function render(state) {
  const today = todayStr();
  const log   = state.morningLog[today] || { checked: [], intent: '' };
  const done  = log.checked.length;

  return `
  <div class="card">
    <div class="scripture">
      "On awakening we think about the twenty-four hours ahead."
      <cite>— Big Book, pg 86</cite>
    </div>
    <p>
      Begin each morning with this prayer and reflection.
      Check off each prayer as you read and meditate on it.
    </p>
    <p style="font-size:.78rem; color:var(--accent); margin-top:6px; font-weight:700;">
      Today: ${today} &nbsp;·&nbsp; ${done} / ${PRAYERS.length} completed
    </p>
  </div>

  <div class="card">
    <h3 style="margin-bottom:16px;">Morning Prayers</h3>
    ${PRAYERS.map((p, i) => `
    <div class="daily-check${log.checked.includes(i) ? ' checked-item' : ''}">
      <input type="checkbox" id="mp-${i}"
        class="morning-check" data-idx="${i}"
        ${log.checked.includes(i) ? 'checked' : ''}>
      <label for="mp-${i}">${esc(p)}</label>
    </div>`).join('')}
  </div>

  <div class="card">
    <h3 style="margin-bottom:12px;">Today's Intention</h3>
    <div class="form-group">
      <label>What will I focus on today? What does God's will look like for me in the next 24 hours?</label>
      <textarea id="morning-intent" rows="5"
        placeholder="Write your intention for today…">${esc(log.intent || '')}</textarea>
    </div>
    <div class="btn-actions">
      <button class="btn btn-primary" id="btn-save-intent">Save Intention</button>
    </div>
  </div>

  ${traditionBox('daily practice')}`;
}

export function setupHandlers(state) {
  const today = todayStr();

  // Checkbox toggles
  document.querySelectorAll('.morning-check').forEach(cb => {
    cb.addEventListener('change', () => {
      const idx = parseInt(cb.dataset.idx);
      const log = { ...(store.state.morningLog[today] || { checked: [], intent: '' }) };
      const pos = log.checked.indexOf(idx);
      if (pos === -1) log.checked.push(idx);
      else            log.checked.splice(pos, 1);
      store.update({ morningLog: { ...store.state.morningLog, [today]: log } });
      // Toggle strikethrough without full re-render
      cb.closest('.daily-check').classList.toggle('checked-item', cb.checked);
    });
  });

  // Save intention
  document.getElementById('btn-save-intent')?.addEventListener('click', () => {
    const val = document.getElementById('morning-intent').value;
    const log = { ...(store.state.morningLog[today] || { checked: [], intent: '' }), intent: val };
    store.update({ morningLog: { ...store.state.morningLog, [today]: log } });
    // Brief visual confirmation
    const btn = document.getElementById('btn-save-intent');
    btn.textContent = '✓ Saved';
    setTimeout(() => { btn.textContent = 'Save Intention'; }, 1500);
  });
}
