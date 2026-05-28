/* ─────────────────────────────────────────────
   APP.JS  —  Router & Shell
   Bootstraps the app, wires navigation,
   manages theme, and updates progress badges.
───────────────────────────────────────────── */

import { store }        from './store.js';
import { Modal }        from './components/Modal.js';

// ── Page modules (each exports render + setupHandlers)
import { render as renderHome }      from './pages/home.js';
import { render as renderLists,
         setupHandlers as setupLists }    from './pages/lists.js';
import { render as renderCauses,
         setupHandlers as setupCauses }   from './pages/causes.js';
import { render as renderFaults,
         setupHandlers as setupFaults }   from './pages/faults.js';
import { render as renderFear1,
         setupHandlers as setupFear1 }    from './pages/fear1.js';
import { render as renderFear2,
         setupHandlers as setupFear2 }    from './pages/fear2.js';
import { render as renderSex,
         setupHandlers as setupSex }      from './pages/sex.js';
import { render as renderEighth,
         setupHandlers as setupEighth }   from './pages/eighth.js';
import { render as renderAwakening,
         setupHandlers as setupAwakening} from './pages/awakening.js';
import { render as renderRetire,
         setupHandlers as setupRetire }   from './pages/retire.js';
import { render as renderExport,
         setupHandlers as setupExport }   from './pages/export.js';

// ── Page registry
const PAGES = {
  home:      { render: renderHome,      setup: null,           title: 'Welcome' },
  lists:     { render: renderLists,     setup: setupLists,     title: 'Resentment List (Step 4 · pg 64)' },
  causes:    { render: renderCauses,    setup: setupCauses,    title: 'Causes & Affects (pg 64–65)' },
  faults:    { render: renderFaults,    setup: setupFaults,    title: 'Our Faults (pg 66–67)' },
  fear1:     { render: renderFear1,     setup: setupFear1,     title: 'Fear Inventory (pg 67–68)' },
  fear2:     { render: renderFear2,     setup: setupFear2,     title: 'Fear Deep Dive (12 & 12)' },
  sex:       { render: renderSex,       setup: setupSex,       title: 'Sex Relations (pg 68–71)' },
  eighth:    { render: renderEighth,    setup: setupEighth,    title: '8th Step – Amends List (pg 76–77)' },
  awakening: { render: renderAwakening, setup: setupAwakening, title: 'Morning Awakening (pg 86)' },
  retire:    { render: renderRetire,    setup: setupRetire,    title: 'Evening Retire (pg 86)' },
  export:    { render: renderExport,    setup: setupExport,    title: 'Export / Backup' },
};

let _currentPage = 'home';

// ── NAVIGATE ─────────────────────────────────
export function navigate(page) {
  if (!PAGES[page]) return;
  _currentPage = page;

  // Highlight active nav item
  document.querySelectorAll('.nav-item').forEach(el =>
    el.classList.toggle('active', el.dataset.page === page)
  );

  // Render page
  const { render, setup, title } = PAGES[page];
  document.getElementById('content').innerHTML = render(store.state);
  document.getElementById('page-title').textContent = title;

  // Run any post-render handler (e.g. restoring textarea values)
  if (setup) setup(store.state);

  window.scrollTo(0, 0);

  // Close sidebar on mobile after navigation
  if (window.innerWidth <= 700) {
    document.getElementById('sidebar').classList.remove('open');
  }
}

// ── THEME ─────────────────────────────────────
let _isDark = false;

function toggleTheme() {
  _isDark = !_isDark;
  document.documentElement.setAttribute('data-theme', _isDark ? 'dark' : 'light');
  document.getElementById('theme-icon').textContent  = _isDark ? '☀️' : '🌙';
  document.getElementById('theme-label').textContent = _isDark ? 'Light Mode' : 'Dark Mode';
}

// ── SIDEBAR TOGGLE ────────────────────────────
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ── PROGRESS BADGES ───────────────────────────
function updateProgress(state) {
  const sections = [
    state.resentments.length > 0,
    state.causes.length > 0,
    state.faults.length > 0,
    state.fears.length > 0,
    Object.values(state.fear2).some(q => Object.keys(q).length > 0),
    state.sexRelations.length > 0,
    state.amends.length > 0,
  ];
  const done = sections.filter(Boolean).length;
  const pct  = Math.round(done / 7 * 100);

  const fill  = document.getElementById('progress-fill');
  const label = document.getElementById('progress-label');
  if (fill)  fill.style.width = pct + '%';
  if (label) label.textContent = `${done} of 7 sections started`;

  const map = {
    'badge-lists':  state.resentments.length,
    'badge-causes': state.causes.length,
    'badge-faults': state.faults.length,
    'badge-fear1':  state.fears.length,
    'badge-sex':    state.sexRelations.length,
    'badge-eighth': state.amends.length,
  };
  Object.entries(map).forEach(([id, n]) => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = n;
      el.closest('.nav-item')?.classList.toggle('done', n > 0);
    }
  });
}

// ── BOOT ──────────────────────────────────────
async function boot() {
  // 1. Load persisted state
  await store.init();

  // 2. Init modal
  Modal.init();

  // 3. Wire nav clicks (sidebar items use data-page attribute)
  document.querySelectorAll('.nav-item[data-page]').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.page));
  });

  // 4. Wire topbar controls
  document.getElementById('menu-toggle')
    .addEventListener('click', toggleSidebar);
  document.getElementById('theme-toggle-btn')
    .addEventListener('click', toggleTheme);

  // 5. Subscribe progress updater to store changes
  store.subscribe(updateProgress);
  updateProgress(store.state);

  // 6. Expose navigate globally so inline onclick handlers in page HTML can use it
  window.navigate = navigate;

  // 7. Render initial page
  navigate('home');
}

document.addEventListener('DOMContentLoaded', boot);
