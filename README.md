# Idle Tech Empire — v1.3 Immersion & Interaction

A futuristic incremental computing-empire game built with vanilla HTML, CSS and JavaScript.

## v1.3 visual update
- Refined metallic processor package with animated silicon core indicators.
- Processor thermal states: normal, warm and hot lighting based on the existing displayed thermal load.
- Stylized animated server and manufacturing hardware scenes inside facility cards.
- Stronger page transitions, card depth, hover/touch feedback and button interaction effects.
- Research completion states receive a visual treatment.
- Ambient particle rendering is throttled and paused while the browser tab is hidden.
- Reduced-motion preferences are respected.
- Responsive visual details for mobile layouts.

## Gameplay and save compatibility
This is a presentation-only update. The existing game logic, economy, upgrades, research, facilities, achievements, prestige formulas, DOM IDs and `idleTechEmpire_v1` LocalStorage save key are retained from the supplied v1.2 source. No save migration is required because no game-state schema changes were introduced.

Always export a save backup before replacing a deployed build. Existing saves remain local to the same browser and site origin.

## Run locally
Open `index.html` in a modern browser. No build step, package manager, framework, external API, remote font or paid asset is required.

## Deploy with GitHub Pages
1. Export your current game save as a backup.
2. Extract this ZIP.
3. Upload the contents of `Idle-Compute-Empire-main` to the root of your existing repository.
4. Commit to the branch configured for GitHub Pages.
5. Refresh the live site. If assets appear cached, hard-refresh the page.

## Project structure
```text
Idle-Compute-Empire-main/
├── index.html
├── css/styles.css
└── js/
    ├── achievements.js
    ├── economy.js
    ├── facilities.js
    ├── game.js
    ├── research.js
    ├── save.js
    ├── upgrades.js
    └── visuals.js
```

## Verification status
JavaScript syntax, required script paths, required game DOM IDs and ZIP integrity were checked during packaging. Full interactive browser testing on physical Android and desktop devices has not been performed. Please test benchmark, purchases, research, facilities, prestige and save loading after deployment.
