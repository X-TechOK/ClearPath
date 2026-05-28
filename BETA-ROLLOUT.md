# ClearPath · Beta rollout guide

Everything you need to get the app onto testers' phones and keep shipping updates.

---

## 1. Files you're hosting

The whole app is four files plus an `icons/` folder:

```
step-work-app/
├── index.html              ← the app itself (single-file React via Babel)
├── paper-ink.css           ← design tokens + global styles
├── manifest.webmanifest    ← PWA manifest (name, icons, colors)
├── service-worker.js       ← caching + offline support
└── icons/                  ← icon PNGs (you'll add these later)
    ├── icon-192.png             (Android home screen)
    ├── icon-512.png             (Android splash screen)
    ├── icon-maskable-512.png    (adaptive Android icon)
    └── apple-touch-icon-180.png (iOS home screen)
```

Until you drop in icon PNGs, browsers will show a default placeholder. The app still works — it just looks unfinished on the home screen.

### Icon specs (when you're ready)

| File | Size | Purpose |
|------|------|---------|
| `icon-192.png` | 192×192 | Standard Android |
| `icon-512.png` | 512×512 | Android splash + install prompt |
| `icon-maskable-512.png` | 512×512 | Adaptive icon — design fills the central 80% safe zone so Android can mask it into circles/squares |
| `apple-touch-icon-180.png` | 180×180 | iOS home screen (no transparency — fill the whole square) |

Tools: [maskable.app](https://maskable.app) helps you preview/generate the maskable icon. You can produce all four from one 1024×1024 source.

---

## 2. Deploying to GitHub Pages (~10 minutes)

**One-time setup:**

1. Make a GitHub account if you don't have one. Free, no credit card.
2. Create a new repository. Name it something like `clearpath` (the URL will become `yourname.github.io/clearpath`). Set it to **Public** (GitHub Pages on private repos requires a paid plan).
3. On your computer, install [GitHub Desktop](https://desktop.github.com) — it's the easiest tool for non-developers.
4. In GitHub Desktop: **File → Clone repository** → pick the repo you just made.
5. Copy the contents of `step-work-app/` into the cloned folder.
6. In GitHub Desktop: write a commit message like "initial release", click **Commit to main**, then **Push origin**.
7. On the GitHub website: go to your repo → **Settings → Pages**. Under "Build and deployment", pick "Deploy from a branch", branch `main`, folder `/ (root)`. Click Save.
8. Wait 1–2 minutes. Your app is now live at `https://yourname.github.io/clearpath/`.

**Shipping an update:**

1. Edit `index.html` (or whatever file).
2. Open `service-worker.js` and bump `CACHE_VERSION`. Example: `'v0.5.0'` → `'v0.5.1'`. This is what makes testers' phones fetch the new code instead of serving the cached old version.
3. In GitHub Desktop: commit with a message describing the change, push origin.
4. GitHub Pages redeploys automatically in 1–2 minutes.

**Pro tip:** if a tester reports they're stuck on the old version, tell them to fully close the app (swipe it away in the multitasker), then reopen. The service worker will fetch the new version on next launch.

---

## 3. What to tell beta testers

Send them the URL and one of these short instructions, depending on their device.

### iPhone / iPad

> 1. Open this link in **Safari** (not Chrome — iOS only installs PWAs from Safari):
>    `https://yourname.github.io/clearpath/`
> 2. Tap the **Share** button at the bottom of the screen (the square with an arrow pointing up).
> 3. Scroll down and tap **Add to Home Screen**.
> 4. Tap **Add** in the top right.
> 5. The ClearPath icon now lives on your home screen — tap it like any other app.

### Android phone / tablet

> 1. Open this link in **Chrome**:
>    `https://yourname.github.io/clearpath/`
> 2. Chrome will show an "Install app" prompt at the bottom of the screen. Tap **Install**.
> 3. If you miss the prompt, tap the three-dot menu in the top right → **Install app** → **Install**.
> 4. The ClearPath icon now lives on your home screen.

### Desktop (Chrome, Edge, Brave)

> 1. Open the link.
> 2. Look for an "install" icon in the address bar (a small download-arrow icon, or a plus inside a square).
> 3. Click it → **Install**.
> 4. ClearPath now opens in its own window and shows up like a regular desktop app.

---

## 4. What testers can and can't do

**Works on day one:**
- Full offline use — once installed, the app loads even with no internet.
- All inventory work, contacts, meetings, daily practice, journal.
- PIN lock per device.
- Encrypted export → send the `.swbak.json` file to themselves via email/cloud → import on another device.

**Doesn't work yet (and that's OK for beta):**
- **Push notifications** — the Reminders screen saves the times but nothing actually fires. iOS in particular is restrictive about PWA notifications. Plan to address this when wrapping for the App Store later.
- **Auto-sync between devices** — testers move data via the manual encrypted backup file. Set expectations upfront so no one tries to use the app on two devices simultaneously and gets confused when changes don't appear.

---

## 5. Privacy posture for testers

Tell them upfront, in plain words: "Your data lives only on your device. We don't have a server. We can't see your inventory, your contacts, your journal, or your PIN. If you lose the device, your data is gone unless you saved a backup file."

This matters for a 12-step app — anonymity is foundational. It's also a competitive advantage to lead with.

---

## 6. Collecting feedback

Suggest one of these light-weight channels (pick what fits your tester group):

- **Plain email** — simplest, no signup required, easy to share screenshots.
- **A shared Google Form** — three open questions: "What worked? What broke? What's missing?"
- **A private Discord or Signal group** — best for active conversation across multiple testers.

Avoid surveys with rating scales for the first few rounds — at this stage you want stories, not statistics.

---

## 7. When to graduate from PWA to App Store

Hold off until at least one of these is true:

- Push notifications become a real friction point for testers.
- A meaningful share of testers ask "where do I find this in the App Store?"
- You're ready to set up Apple Developer ($99/yr) and Google Play ($25 one-time) accounts plus monetization plumbing.

When that day comes, the same `index.html` ships unchanged — you wrap it in [Capacitor](https://capacitorjs.com) (~1 week of setup work) and submit to both stores. Nothing about your current code is throwaway.

---

## 8. Quick sanity-check before each release

Before pushing an update:

- [ ] `service-worker.js` `CACHE_VERSION` bumped
- [ ] Loaded the new build in an incognito window to confirm it actually starts
- [ ] Tested the change on a phone too (sizing + tap targets behave differently)
- [ ] If the change touches stored data, did an Export → Import round-trip on test data first
