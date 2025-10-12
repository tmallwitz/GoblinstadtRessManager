# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Goblinstadt Ressourcen Manager is a Progressive Web App (PWA) for tracking game resources in the Goblinstadt game. It's designed as an offline-first mobile application, optimized for iPhone Pro Max (430×930px), and can be installed to the home screen like a native app.

The app tracks four resource categories with 8 resources each:
- **Schlitzohr** (Rogue): Enterhaken, Seil, Handschuhe, Dietrich, Truhe, Messer, Schloss, Umhang
- **Gelehrter/Magier** (Mage): Tinte, Verzauberung, Zauberhut, Feder, Bücher, Zauberstab, Pergament, Amulet
- **Wundpfleger/Heiler** (Healer): Schere, Bandage, Zutaten, Nadel, Tränke, Wundhaken, Skalpell, Mörser
- **Knappe/Krieger** (Warrior): Axt, Helm, Rüstung, Schleifstein, Kettenringe, Schwert, Schild, Trophäen

## Architecture

### Tech Stack
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Storage**: localStorage for persistent client-side state
- **PWA**: Service Worker with cache-first strategy
- **Language**: German (UI text, comments, variable names)

### File Structure
```
├── index.html          # Main HTML structure with PWA meta tags
├── app.js              # Core application logic and state management
├── styles.css          # Dark mode optimized styles with CSS variables
├── sw.js               # Service Worker for offline functionality
├── manifest.json       # PWA manifest for home screen installation
└── icon-*.png          # App icons (192x192, 512x512)
```

### Core Application Logic (app.js)

**State Management**:
- State is stored in `localStorage` under key `goblinstadt-resources`
- Active tab is persisted under key `goblinstadt-active-tab`
- State structure: `{ [category]: { [resource]: count } }`
- All resource counts are non-negative integers

**Key Functions**:
- `initializeState()`: Creates fresh state with all resources at 0
- `saveState()`: Persists state to localStorage
- `loadState()`: Retrieves state from localStorage
- `updateResource(category, resource, action, value)`: Updates resource count with actions: 'add', 'subtract', 'set'
- `renderUI()`: Renders all resource cards for active category with totals in tab names
- `createResourceCard(category, resource)`: Creates individual resource card with visual stack representation

**Visual Stack System**:
- Resources are visualized in stacks of 10 (each full stack = 10 items)
- Remainder values (0-9) are color-coded:
  - 0-4: Red (needs restocking)
  - 5-7: Yellow (moderate)
  - 8-9: Green (almost full)
- Function `getRemainderClass(remainder)` determines color coding

**CSV Import/Export**:
- Format matches Excel layout: `Schlitzohr,,Magier,,Krieger,,Heiler` (columns alternate resource name, count)
- Export includes totals row with grand total
- Import validates resource names against `resourceTypes` before updating state

### Service Worker Strategy (sw.js)

- Cache name: `goblinstadt-cache-v3`
- **Cache-first strategy**: Always serve from cache if available, fall back to network
- Aggressive pre-caching of all app resources on install
- Auto-cleanup of old caches on activation
- Uses `skipWaiting()` and `clients.claim()` for immediate activation

### Styling (styles.css)

- **Dark mode by default**: Uses CSS custom properties for theming
- Layout optimized for iPhone Pro Max viewport (430×930px max)
- Fixed height sections:
  - Header: 60px
  - Tabs: 40px
  - Content: flex (80% of remaining space)
  - Footer: 40px minimum
- Grid layout: 2 columns portrait, 4 columns landscape
- Touch-optimized: `touch-action: manipulation` prevents zoom, large touch targets (32px buttons)

## Development Commands

This is a static web app with no build process. To develop:

1. **Local testing**: Use any HTTP server (required for Service Worker)
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx http-server -p 8000
   ```

2. **Test on mobile device**: Access via local network IP
   - Find your IP: `ipconfig` (Windows) or `ifconfig` (Unix)
   - Access: `http://[YOUR_IP]:8000`

3. **Force Service Worker update**: Increment `CACHE_NAME` version in `sw.js`

## Important Conventions

### State Invariants
- Resource counts must always be ≥ 0 (enforced in `updateResource()`)
- State must contain all categories and resources defined in `resourceTypes`
- `activeCategory` must be a valid key in `resourceTypes`

### Order of Operations
- Variable `activeCategory` MUST be declared before `loadState()` is called (line 18-19 in app.js)
- Service Worker registration happens after DOM load to avoid blocking UI

### UI Behavior
- Tab switching immediately saves state via `saveState()`
- Edit modal focuses input and selects value on open
- Modal closes on: X button, Save button, Escape key, or click outside
- Resource cards show: name, total count, visual stacks, remainder badge, +/-/Edit buttons

### CSV Format Requirements
- Header row: `Schlitzohr,,Magier,,Krieger,,Heiler` (no counts)
- Data rows: alternate resource name and count for each category
- Final row: comma, then totals for each category, then grand total
- Import validates resource names against `resourceTypes` before accepting

## Testing Checklist

When making changes, verify:
1. State persists after page reload
2. Tab switching preserves active tab
3. CSV export/import maintains data integrity
4. Visual stacks correctly show full stacks + color-coded remainder
5. Offline mode works (Service Worker serves from cache)
6. Touch interactions work smoothly (no zoom, no lag)
7. Dark mode rendering is correct
8. Tab names show correct totals: `CategoryName (Total)`

## PWA Installation

Users can install via:
- iOS Safari: Share → Add to Home Screen
- Android Chrome: Automatic install prompt via `beforeinstallprompt` event
- Desktop: Browser install button in address bar
