# Idle Tech Empire — v1.2 Visual Revolution

A futuristic incremental computing-empire game built with **vanilla HTML, CSS and JavaScript**. This release focuses on presentation: a more immersive hybrid-realistic sci-fi interface, animated processor hardware, layered HUD panels, live ambient particles and stronger visual feedback.

## Run locally

Open `index.html` in a modern browser. No build step, package manager, server, API key or paid asset is required.

## Deploy with GitHub Pages

1. Back up your current save from the game before replacing files.
2. Extract this ZIP.
3. Upload the contents of `Idle-Compute-Empire-main` to the root of your existing repository, replacing the previous files.
4. Commit to the branch configured for GitHub Pages (typically `main`).
5. Refresh the deployed site. If the old CSS remains cached, hard-refresh or clear the site's cached files.

## v1.2 visual changes

- Immersive hybrid-realistic visual direction: physical-looking silicon package, metallic processor edges, scan rings, status readouts and server-rack lighting.
- Cinematic command-centre hero scene with animated lighting and floating processor.
- Refined HUD, navigation, resource panels, telemetry, upgrade cards and research panels.
- CPU laboratory stage with animated scan rings.
- Animated manufacturing gear and data-centre rack indicators.
- Lightweight ambient particle canvas, with reduced-motion support and mobile particle limits.
- Benchmark activation flash and improved touch-friendly controls.
- Responsive desktop and Android/mobile layouts.

## Compatibility and scope

- Existing gameplay systems and their DOM IDs are retained.
- Existing LocalStorage save key remains `idleTechEmpire_v1`.
- No economy, upgrade, research, facility, achievement or prestige formulas were intentionally changed.
- No new backend, framework, dependency, remote font, API or paid asset is used.
- Existing saves should load in the same browser and origin. Always export a backup before deploying any update.

## Project structure

```text
Idle-Compute-Empire-main/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── achievements.js
│   ├── economy.js
│   ├── facilities.js
│   ├── game.js
│   ├── research.js
│   ├── save.js
│   ├── upgrades.js
│   └── visuals.js
└── README.md
```

## Testing note

JavaScript syntax, required DOM IDs, script references and ZIP integrity were checked during packaging. This environment did not perform full interactive browser testing on physical Android and desktop devices. Please test benchmark, purchases, research, prestige and save loading on the deployed site before treating the release as fully production-verified.
