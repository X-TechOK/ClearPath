/* ─────────────────────────────────────────────
   TRADITION BOX COMPONENT
   Renders the 7th Tradition + coffee donation
   prompt. Used at the bottom of every section.
───────────────────────────────────────────── */

/**
 * @param {string} stepName  e.g. "resentment list", "Fear Inventory"
 * @returns {string}         HTML string
 */
export function traditionBox(stepName) {
  return `
  <div class="tradition-box">
    <h4>🙏 The 7th Tradition</h4>
    <p>
      "Every A.A. group ought to be fully self-supporting, declining outside contributions."
      <br><br>
      This app is free and always will be — built in the spirit of service.
      If it has helped your ${stepName} work, consider practicing the 7th tradition
      and buying the developer a cup of coffee to help maintain and continue
      to refine this tool for everyone in the fellowship.
    </p>
    <a class="coffee-link" href="https://www.buymeacoffee.com" target="_blank" rel="noopener">
      ☕ Buy the Developer a Coffee
    </a>
    <p style="margin-top:10px; font-size:.73rem;">
      No obligation. One day at a time. Keep coming back.
    </p>
  </div>`;
}
