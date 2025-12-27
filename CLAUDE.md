# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Goblinstadt Ressourcen Manager is a Progressive Web App (PWA) for tracking game resources in the Goblinstadt tabletop RPG game. It's designed as an offline-first mobile application, optimized for iPhone Pro Max (430x932px), and can be installed to the home screen like a native app.

The app tracks four resource categories with 8 resources each:
- **Schlitzohr** (Rogue): Enterhaken, Seil, Handschuhe, Dietrich, Truhe, Messer, Schloss, Umhang
- **Gelehrter/Magier** (Mage): Tinte, Verzauberung, Zauberhut, Feder, Bucher, Zauberstab, Pergament, Amulet
- **Wundpfleger/Heiler** (Healer): Schere, Bandage, Zutaten, Nadel, Tranke, Wundhaken, Skalpell, Morser
- **Knappe/Krieger** (Warrior): Axt, Helm, Rustung, Schleifstein, Kettenringe, Schwert, Schild, Trophaen

## Architecture

### Tech Stack
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Styling**: Self-hosted Tailwind CSS (Play CDN), custom CSS with CSS variables
- **Storage**: localStorage for persistent client-side state
- **PWA**: Service Worker with cache-first strategy
- **Icons**: Font Awesome 6.4.0 + RPG Awesome 0.2.0 (both self-hosted)
- **Fonts**: Google Fonts (Cinzel, Roboto) - self-hosted
- **Language**: German (UI text, comments, variable names)
- **Security**: 100% self-hosted, zero CDN dependencies (~1MB total assets)

### File Structure
```
GoblinstadtRessManager/
├── index.html              # Main HTML structure with PWA meta tags
├── app.js                  # Core application logic and state management (~740 lines)
├── styles.css              # Dark/light mode styling with animations (~1037 lines)
├── sw.js                   # Service Worker for offline functionality (v10)
├── manifest.json           # PWA manifest for home screen installation
├── icon-192x192.png        # App icon (small)
├── icon-512x512.png        # App icon (large)
├── assets/
│   └── vendor/             # Self-hosted dependencies (~1MB total)
│       ├── font-awesome/   # Font Awesome 6.4.0
│       │   ├── css/all.min.css
│       │   └── webfonts/   # woff2 font files
│       ├── rpg-awesome/    # RPG Awesome 0.2.0
│       │   ├── css/rpg-awesome.min.css
│       │   └── fonts/      # woff font files
│       ├── tailwind/       # Tailwind CSS Play CDN
│       │   └── tailwind-play.js
│       └── fonts/          # Google Fonts (self-hosted)
│           ├── fonts.css   # @font-face definitions
│           ├── cinzel-*.woff2
│           └── roboto-*.woff2
├── README.md               # GitHub documentation
├── LICENSE                 # MIT License
└── agent-os/               # Development specifications (historical)
    └── specs/              # Feature implementation specs
```

### Core Application Logic (app.js)

**State Management**:
- State is stored in `localStorage` under key `goblinstadt-resources`
- Active tab is persisted under key `goblinstadt-active-tab`
- Theme preference is stored under key `goblinstadt-theme-preference`
- State structure: `{ [category]: { [resource]: count } }`
- All resource counts are non-negative integers

**Key Data Structures**:
- `resourceTypes`: Object mapping category keys to arrays of resource names
- `categoryNames`: Display names for tabs (schlitzohr -> "Schlitzohr", gelehrter -> "Magier", etc.)
- `resourceIcons`: Nested object mapping category -> resource -> icon class (Font Awesome/RPG Awesome)
- `classEmblems`: Icon classes for character class emblems shown in tabs

**Key Functions**:
- `initializeState()`: Creates fresh state with all resources at 0
- `saveState()`: Persists state to localStorage
- `loadState()`: Retrieves state from localStorage
- `updateResource(category, resource, action, value)`: Updates resource count with actions: 'add', 'subtract', 'set'
- `updateResourceDisplay(category, resource)`: Selective DOM update for instant feedback (no full re-render)
- `renderUI()`: Full render of all resource cards for active category with totals in tab names
- `createResourceCard(category, resource)`: Creates individual resource card with visual stack representation
- `getCategoryTotal(category)`: Calculates sum of all resources in a category

**Theme Management**:
- `initializeTheme()`: Called immediately on load to prevent FOUC
- `getSystemTheme()`: Detects OS dark/light preference via `prefers-color-scheme`
- `loadThemePreference()` / `saveThemePreference(theme)`: localStorage persistence
- `applyTheme(theme)`: Adds/removes `dark-mode` class on `<html>`, updates meta theme-color
- `toggleTheme()`: Switches between light and dark modes
- Theme priority: 1) Saved preference, 2) System preference, 3) Dark mode default

**Visual Stack System**:
- Resources are visualized in stacks of 10 (each full stack = 10 items)
- Remainder values (0-9) are color-coded:
  - 0-4: Red (`remainder-0-4`) - needs restocking
  - 5-7: Yellow (`remainder-5-7`) - moderate
  - 8-9: Green (`remainder-8-9`) - almost full
- Function `getRemainderClass(remainder)` determines color coding

**Animation System**:
- `animateElement(element, animationClass, duration)`: Generic animation helper
- `createSparkle(x, y, color)`: Creates particle effects on resource increase
- CSS animations: fadeSlideIn (cards), countUpdate, buttonPress, sparkle, stackPulse, modalFadeIn, glowPulse

**CSV Import/Export**:
- Format matches Excel layout: `Schlitzohr,,Magier,,Krieger,,Heiler` (columns alternate resource name, count)
- Export includes totals row with grand total
- Import validates resource names against `resourceTypes` before updating state

### Service Worker Strategy (sw.js)

- Cache name: `goblinstadt-cache-v10`
- App prefix: `goblinstadt-`
- **Cache-first strategy**: Always serve from cache if available, fall back to network
- **100% self-hosted**: All resources are local, no external CDN requests
- Aggressive pre-caching of all app resources on install (33 files)
- Auto-cleanup of old caches on activation (removes any cache starting with `goblinstadt-` except current)
- Uses `skipWaiting()` and `clients.claim()` for immediate activation
- Network failures return cached `index.html` for navigation requests

**Cached Resources**:
- Core app: `index.html`, `styles.css`, `app.js`, `sw.js`, `manifest.json`, icons
- Tailwind: `assets/vendor/tailwind/tailwind-play.js`
- Fonts CSS: `assets/vendor/fonts/fonts.css`
- Font files: Roboto (regular, bold), Cinzel (regular, semibold, bold) - all woff2
- Font Awesome: CSS + 4 woff2 webfonts
- RPG Awesome: CSS + woff webfont

### Styling (styles.css)

**Theme System**:
- Light mode: Default `:root` variables
- Dark mode: `.dark-mode` class overrides with gradients and enhanced shadows
- CSS custom properties for all colors, shadows, transitions, spacing, font sizes
- Smooth transitions on theme switch (`--transition-base: 250ms`)

**Character Class Theme Colors**:
- Schlitzohr/Rogue: Gold (#FFD700) with gradient and glow
- Gelehrter/Mage: Purple (#8A2BE2) with gradient and glow
- Wundpfleger/Healer: Blue (#1E90FF) with gradient and glow
- Knappe/Warrior: Red (#DC143C) with gradient and glow

**Layout**:
- Optimized for iPhone Pro Max viewport (430x932px max)
- Fixed height sections:
  - Header: 55px (includes theme toggle button)
  - Tabs: 45px (with class emblems)
  - Content: flex (calc(100% - 145px))
  - Footer: 45px minimum
- Grid layout: 2 columns portrait, 4 columns landscape
- Touch-optimized: `touch-action: manipulation` prevents zoom, large touch targets (32px buttons)

**Key CSS Classes**:
- `.dark-mode`: Applied to `<html>` for dark theme
- `.resource-card[data-category="X"]`: Category-specific border colors and glows
- `.tab-button.active`: Active tab styling with class-colored bottom border
- `.remainder-0-4`, `.remainder-5-7`, `.remainder-8-9`: Color-coded remainder badges
- `.btn-inc`, `.btn-dec`, `.edit-btn`: Button styles with gradients and hover effects
- `.theme-toggle-btn`: Header theme toggle button (shows sun/moon icon)

## Development Commands

This is a static web app with no build process. To develop:

1. **Local testing**: Use any HTTP server (required for Service Worker)
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx http-server -p 8000

   # Using PHP
   php -S localhost:8000
   ```

2. **Test on mobile device**: Access via local network IP
   - Find your IP: `ipconfig` (Windows) or `ifconfig` / `ip addr` (Unix)
   - Access: `http://[YOUR_IP]:8000`

3. **Force Service Worker update**: Increment `CACHE_NAME` version in `sw.js`
   - Current: `goblinstadt-cache-v10`

4. **Clear Service Worker cache**:
   - Chrome: DevTools -> Application -> Service Workers -> Unregister
   - Safari: Develop -> Empty Caches
   - Firefox: DevTools -> Application -> Service Workers -> Unregister

## Important Conventions

### State Invariants
- Resource counts must always be >= 0 (enforced in `updateResource()`)
- State must contain all categories and resources defined in `resourceTypes`
- `activeCategory` must be a valid key in `resourceTypes`
- Theme must be 'light', 'dark', or null (for system default)

### Order of Operations
- Variable `activeCategory` MUST be declared before `loadState()` is called (line 163 in app.js)
- `initializeTheme()` is called immediately at module level to prevent FOUC (Flash of Unstyled Content)
- Service Worker registration happens after DOM load to avoid blocking UI

### UI Behavior
- Tab switching immediately saves state via `saveState()` and does full `renderUI()`
- +/- buttons use `updateResourceDisplay()` for instant feedback without full re-render
- Sparkle particle effects appear when resource count increases
- Edit modal focuses input and selects value on open
- Modal closes on: X button, Save button, Escape key, or click outside
- Resource cards show: icon, name, total count, visual stacks, remainder badge, +/-/Edit buttons
- Theme toggle button in header shows moon (light mode) or sun (dark mode)

### CSV Format Requirements
- Header row: `Schlitzohr,,Magier,,Krieger,,Heiler` (no counts)
- Data rows: alternate resource name and count for each category
- Final row: comma, then totals for each category, then grand total
- Import validates resource names against `resourceTypes` before accepting

### Self-Hosted Dependencies
When updating vendor dependencies:
1. Download new version and place in `assets/vendor/`
2. Update paths in `index.html` if filenames changed
3. Update `urlsToCache` array in `sw.js` with new file paths
4. Increment `CACHE_NAME` version in `sw.js`
5. Test offline functionality

## Testing Checklist

When making changes, verify:

**Functionality:**
1. State persists after page reload
2. Tab switching preserves active tab
3. +/- buttons provide instant feedback (no flicker/re-render)
4. CSV export/import maintains data integrity
5. Visual stacks correctly show full stacks + color-coded remainder
6. Edit modal opens, saves, and closes correctly
7. Reset clears all resources to 0 with confirmation

**PWA/Offline:**
8. Offline mode works (Service Worker serves from cache)
9. All 33 cached files load without network
10. Install prompt appears on supported browsers
11. Installed app launches correctly

**Theme:**
12. Light/dark mode toggle works correctly
13. Theme persists after page reload
14. System preference is respected when no manual choice
15. Smooth color transitions on theme switch

**Visual:**
16. All 32 resource icons display correctly (no blanks)
17. Class-colored borders, glows, and accents render correctly
18. Tab names show correct totals: `CategoryName (Total)`
19. Touch interactions work smoothly (no zoom, no lag)
20. Responsive layout adapts to portrait/landscape

## PWA Installation

Users can install via:
- iOS Safari: Share -> Add to Home Screen
- Android Chrome: Automatic install prompt via `beforeinstallprompt` event, or Menu -> Install app
- Desktop: Browser install button in address bar

## Common Tasks

### Adding a New Resource
1. Add resource name to appropriate array in `resourceTypes` (app.js)
2. Add icon mapping in `resourceIcons` (app.js)
3. Update CSV import/export if format changes
4. Increment Service Worker cache version

### Updating Icon Libraries
1. Download new version to `assets/vendor/`
2. Update CSS link in `index.html`
3. Update `urlsToCache` in `sw.js` with all new file paths
4. Increment `CACHE_NAME` in `sw.js`

### Changing Theme Colors
1. Modify CSS custom properties in `styles.css`:
   - `:root` for light mode
   - `.dark-mode` for dark mode
   - Character class colors (--rogue-primary, --mage-primary, etc.)
2. Update `meta[name="theme-color"]` handling in `applyTheme()` if needed

### Debugging Service Worker Issues
1. Check DevTools -> Application -> Service Workers
2. Verify all files in `urlsToCache` exist and paths are correct
3. Check Console for `[ServiceWorker]` log messages
4. Force update by incrementing `CACHE_NAME` version
