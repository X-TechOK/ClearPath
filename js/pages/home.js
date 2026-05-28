/* ─────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────── */
import { traditionBox } from '../components/TraditionBox.js';

export function render() {
  const tiles = [
    ['📋','Resentment List','pg 64–65','List every person, institution, or principle you resent','lists'],
    ['🔍','Causes & Affects','pg 64–65','Record causes and which instincts were affected','causes'],
    ['🪞','Our Faults','pg 66–67','Examine your own role in each resentment','faults'],
    ['😰','Fear Inventory','pg 67–68','Map fear categories to each cause','fear1'],
    ['💡','Fear Deep Dive','12 & 12, pg 49–53','Answer deep questions for each fear category','fear2'],
    ['🔒','Sex Relations','pg 68–71','Confidential review — use codes/initials only','sex'],
    ['🤝','8th Step Amends','pg 76–77','List all those harmed and your willingness','eighth'],
    ['🌅','Morning Awakening','pg 86','Daily morning prayer and direction-setting','awakening'],
    ['🌙','Evening Retire','pg 86','Nightly honest review of your day','retire'],
  ];

  return `
  <div class="card">
    <h3>Welcome to Step Work</h3>
    <p style="margin-top:6px; font-size:.9rem; color:var(--text); line-height:1.7;">
      This app guides you through the written inventory process — one section at a time,
      in the order the Big Book presents it. All of your work stays
      <strong>on your device only</strong>. Nothing is ever sent to a server.
      Work through each section with your sponsor before moving on.
    </p>
  </div>

  <div class="home-grid">
    ${tiles.map(([icon, name, ref, desc, page]) => `
      <div class="home-tile" onclick="navigate('${page}')">
        <div class="icon">${icon}</div>
        <h3>${name}</h3>
        <div class="ref">${ref}</div>
        <p>${desc}</p>
      </div>`).join('')}
  </div>

  ${traditionBox('recovery')}`;
}
