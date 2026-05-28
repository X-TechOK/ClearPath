/* ─────────────────────────────────────────────
   UTILS
   Pure helper functions shared across all modules.
   No DOM dependencies. No state dependencies.
───────────────────────────────────────────── */

/**
 * Generate a short random unique ID.
 */
export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * HTML-escape a string to prevent injection.
 */
export function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Return today's date as YYYY-MM-DD.
 */
export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Toggle a "checked" CSS class on a chip label when its
 * hidden checkbox changes.
 */
export function toggleChip(chipId, inputId) {
  const chip  = document.getElementById(chipId);
  const input = document.getElementById(inputId);
  if (chip && input) chip.classList.toggle('checked', input.checked);
}

/**
 * Make a CSS-safe key from an arbitrary string
 * (removes quotes, spaces → underscores).
 */
export function safeKey(s) {
  return String(s).replace(/['\s]/g, '_');
}

/**
 * Build a <select> element's option HTML from an array of strings.
 * @param {string[]} names
 * @param {string}   placeholder
 */
export function selectOptions(names, placeholder = '-- select --') {
  const opts = names
    .map(n => `<option value="${esc(n)}">${esc(n)}</option>`)
    .join('');
  return `<option value="">${placeholder}</option>${opts}`;
}
