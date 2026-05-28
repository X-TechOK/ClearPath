/* ─────────────────────────────────────────────
   SEX RELATIONS — pg 68–71
───────────────────────────────────────────── */
import { store }        from '../store.js';
import { Modal }        from '../components/Modal.js';
import { traditionBox } from '../components/TraditionBox.js';
import { uid, esc }     from '../utils.js';

const SEX_QS = [
  {
    q:    '1. Where was I selfish?',
    ref:  'pg 69',
    hint: 'Examples: I used him/her for… Did I stay in the relationship for sex, attention, immediate gratification, security, self-esteem? How did I want him/her to be different? Did I withhold anything, fantasize?',
  },
  {
    q:    '2. Where was I dishonest?',
    ref:  'pg 69',
    hint: 'Examples: Told only what I wanted known… Told myself I could control his/her behavior… Did not tell the truth about what I needed or what bothered me…',
  },
  {
    q:    '3. Where was I inconsiderate?',
    ref:  'pg 69',
    hint: 'Examples: Based my feelings on his/her appearance… acted aloof, avoided, demanded, pretended, ignored, blamed, criticized, condemned… controlling or needy behaviors… did not invite God into the relationship.',
  },
  { q: '4. Who was hurt in this situation?',             ref: 'pg 69', hint: '' },
  { q: '5. Did I arouse jealousy, suspicion, or bitterness?', ref: 'pg 69', hint: '' },
  { q: '6. Where was I at fault?',                       ref: 'pg 69', hint: '' },
  { q: '7. What should I have done instead?',            ref: 'pg 69', hint: '' },
  { q: '8. What will I do in the future?',               ref: '',      hint: '' },
  { q: '9. Did I pray or have spiritual conversations with him/her?', ref: '', hint: '' },
  { q: '10. Did I pray for him/her?',                    ref: '',      hint: '' },
  { q: '11. Did I enjoy his/her company?',               ref: '',      hint: '' },
  { q: '12. Did we bring each other closer to God?',     ref: '',      hint: '' },
];

export function render(state) {
  const items = state.sexRelations;
  return `
  <div class="alert-danger">
    <h3>🔒 Confidentiality — MANDATORY</h3>
    <p>
      Use <strong>initials or codes only</strong> — no full names.
      Even where others are clearly at fault, a breach of confidentiality could cause
      irreparable harm to innocent people. Unless you are committed to filing criminal
      charges, the identities of people on this list <strong>MUST be indecipherable
      to others.</strong> All data stays on your device only.
    </p>
  </div>

  <div class="card">
    <div class="scripture">
      "We earnestly pray for the right ideal, for guidance in each questionable situation,
      for sanity, and for the strength to do the right thing."
      <cite>— Big Book, pg 70</cite>
    </div>
  </div>

  <div class="card">
    <h3 style="margin-bottom:12px;">Instructions</h3>
    <div class="note-box">
      <p><strong>1.</strong> List every person (male or female, including yourself), animal, or object with whom you have had physical sexual relations.</p>
    </div>
    <div class="note-box">
      <p><strong>2.</strong> If you cannot remember a name, use a short description that is meaningful to you.</p>
    </div>
    <div class="note-box">
      <p><strong>3.</strong> Include anyone with whom you continually flirted or acted suggestively.</p>
    </div>
    <div class="note-box">
      <p><strong>4.</strong> Include anyone or anything you may have repeatedly fantasized about sexually, whether you ever met them or not. Use of a category may be acceptable here.</p>
    </div>
    <div class="note-box">
      <p><strong>5.</strong> List practices without being graphic — such as "telephone or internet sex" or "viewing pornography online," etc.</p>
    </div>
    <div class="note-box">
      <p><strong>6.</strong> Answer all 12 questions for each person, animal, or object on your list.</p>
    </div>
    <div class="note-box">
      <p><strong>7.</strong> In a separate writing, write your sexual ideal. <em>"We earnestly pray for the right ideal, for guidance in each questionable situation, for sanity, and for the strength to do the right thing." (pg 70)</em></p>
    </div>
    <div class="sponsor-note">
      💬 When all questions have been answered for each person on your list (including yourself),
      discuss your work with your sponsor.
    </div>
  </div>

  <div class="card">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <h3>Entries (${items.length})</h3>
      <button class="btn btn-primary btn-sm" id="btn-add-sex">+ Add Entry</button>
    </div>

    ${items.length === 0
      ? '<div class="empty-state">No entries yet.</div>'
      : `<div class="entry-list">
          ${items.map(s => `
          <div class="entry-card col">
            <div class="entry-header">
              <div class="entry-title" style="color:var(--accent2);">🔒 ${esc(s.code)}</div>
              <button class="btn btn-danger btn-sm delete-sex" data-id="${s.id}">✕</button>
            </div>
            ${SEX_QS.map((item, i) =>
              s.answers[i]
                ? `<p style="font-size:.78rem; margin-top:5px;">
                     <strong>${esc(item.q)}</strong><br>
                     <span class="text-muted">${esc(s.answers[i])}</span>
                   </p>`
                : ''
            ).join('')}
          </div>`).join('')}
        </div>`}
  </div>

  ${items.length >= 1 ? `
  <div class="ready-banner">
    ✅ When all entries are complete, discuss with your sponsor. Then move to the
    <strong>&nbsp;8th Step Amends List&nbsp;</strong>.
  </div>
  <div class="btn-actions">
    <button class="btn btn-primary" onclick="navigate('eighth')">
      Continue to 8th Step →
    </button>
  </div>` : ''}

  ${traditionBox('Sex Relations inventory')}`;
}

export function setupHandlers() {
  document.getElementById('btn-add-sex')
    ?.addEventListener('click', openAddModal);

  document.querySelectorAll('.delete-sex').forEach(btn =>
    btn.addEventListener('click', () => deleteEntry(btn.dataset.id))
  );
}

function openAddModal() {
  Modal.open('Add Sex Relations Entry', `
    <div style="background:rgba(192,57,43,.08); border:1px solid rgba(192,57,43,.25);
                border-radius:8px; padding:10px 14px; margin-bottom:14px;
                font-size:.8rem; color:var(--danger);">
      🔒 Use initials or codes only — no full names.
    </div>
    <div class="form-group">
      <label>Code / Initials</label>
      <input type="text" id="sx-code" placeholder="e.g. M.L.R., Person A, Code-7">
    </div>
    ${SEX_QS.map((item, i) => `
    <div class="form-group">
      <label>${esc(item.q)}${item.ref ? ` <span style="font-size:.65rem; color:var(--muted);">${item.ref}</span>` : ''}</label>
      ${item.hint ? `<p class="hint" style="margin-bottom:6px;">${esc(item.hint)}</p>` : ''}
      <textarea id="sx-${i}" placeholder="Your answer…"></textarea>
    </div>`).join('')}
    <div class="btn-actions">
      <button class="btn btn-primary" id="modal-save-btn">Save Entry</button>
      <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
    </div>
  `);

  document.getElementById('modal-save-btn').addEventListener('click', saveEntry);
  document.getElementById('modal-cancel-btn').addEventListener('click', () => Modal.close());
  document.getElementById('sx-code').focus();
}

function saveEntry() {
  const code = document.getElementById('sx-code').value.trim();
  if (!code) { alert('Please enter a code or initials.'); return; }

  const answers = {};
  SEX_QS.forEach((_, i) => {
    answers[i] = document.getElementById('sx-' + i)?.value.trim() || '';
  });

  store.update({ sexRelations: [...store.state.sexRelations, { id: uid(), code, answers }] });
  Modal.close();
  navigate('sex');
}

function deleteEntry(id) {
  if (!confirm('Remove this entry? This cannot be undone.')) return;
  store.update({ sexRelations: store.state.sexRelations.filter(s => s.id !== id) });
  navigate('sex');
}
