/* ─────────────────────────────────────────────
   MODAL COMPONENT
   A single shared modal dialog.
   Usage:
     Modal.open('Title', '<p>HTML body</p>');
     Modal.close();
───────────────────────────────────────────── */

export const Modal = {
  _overlay: null,
  _title:   null,
  _body:    null,

  /** Call once after DOM is ready. */
  init() {
    this._overlay = document.getElementById('modal');
    this._title   = document.getElementById('modal-title');
    this._body    = document.getElementById('modal-body');

    // Close on overlay click (outside the modal card)
    this._overlay.addEventListener('click', e => {
      if (e.target === this._overlay) this.close();
    });

    // Close button
    document.getElementById('modal-close-btn')
      .addEventListener('click', () => this.close());

    // Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.close();
    });
  },

  open(title, bodyHTML) {
    this._title.textContent = title;
    this._body.innerHTML    = bodyHTML;
    this._overlay.classList.remove('hidden');
  },

  close() {
    this._overlay.classList.add('hidden');
    this._body.innerHTML = '';
  },
};
