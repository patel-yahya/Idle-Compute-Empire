# Idle Tech Empire — v1.0

A browser-based incremental technology tycoon game built with vanilla HTML, CSS and JavaScript.

## Run the game
1. Extract the ZIP file.
2. Open `index.html` in Chrome, Firefox, Edge or another modern browser.
3. No installation, server, account or internet connection is required for gameplay. Google Fonts are optional; the game falls back to system fonts if offline.

## Features
- Manual CPU benchmarking and automatic compute production
- Six hardware upgrades with levels and scaling prices
- Six research technologies
- Manufacturing facilities and data centres
- Power capacity and overload efficiency penalty
- Achievements with credit rewards
- Prestige / Silicon Ascension with permanent production bonuses
- LocalStorage autosave and offline earnings (up to 8 hours at 50% efficiency)
- Responsive layout for mobile and desktop

## Project structure
- `index.html` — game layout and script loading
- `css/styles.css` — responsive visual design
- `js/economy.js` — number formatting and cost helpers
- `js/upgrades.js` — upgrade definitions
- `js/research.js` — research definitions
- `js/facilities.js` — manufacturing and data centre definitions
- `js/achievements.js` — achievement definitions
- `js/save.js` — local save/load
- `js/game.js` — game state, simulation, UI and interactions

## Saving
Progress is stored in browser LocalStorage on the device and browser profile where you play. Clearing browser site data can erase the save. Use the browser's built-in site data backup/export options if you need to preserve it.

## Notes
This is an original game implementation inspired by the idle tycoon genre. It does not use Adept Games' code, artwork or branding.
