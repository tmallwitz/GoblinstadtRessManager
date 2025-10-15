# Specification: Light & Dark Mode Theme Toggle

## Goal
Implement a user-controllable light/dark theme toggle with automatic system preference detection for the Goblinstadt Ressourcen Manager PWA, allowing users to choose their preferred theme while maintaining the app's offline-first architecture and visual consistency.

## User Stories
- As a user, I want the app to automatically detect my system color preference (light/dark mode) so that it matches my device's theme on first visit
- As a user, I want to manually toggle between light and dark themes using a button in the header so I can choose my preferred viewing mode
- As a user, I want my theme choice to be remembered when I return to the app so I don't have to toggle it again
- As a user, I want smooth color transitions between themes so the change feels polished and not jarring
- As a user installing the PWA, I want the status bar color to match the active theme so it feels like a native app

## Core Requirements

### Functional Requirements
- Detect system color scheme preference using CSS `prefers-color-scheme` media query
- Provide manual theme toggle button in header with sun/moon icon
- Toggle switches between light and dark themes
- Save user's theme preference to localStorage
- Load saved preference on app initialization before rendering UI
- Prioritize manual preference over system preference (manual overrides automatic)
- Default to dark mode when no system preference is detected and no saved preference exists
- Update PWA theme-color meta tag dynamically based on active theme

### Non-Functional Requirements
- Theme application must be instantaneous (no flash of unstyled content or wrong theme on load)
- Theme preference persistence must survive browser refresh and PWA reinstallation
- Color transitions must be smooth using existing CSS transition properties (no complex animations)
- Toggle button must be touch-optimized (32px minimum) consistent with existing UI
- Toggle icon must be visible and neutral in both light and dark themes
- Maintain accessibility with sufficient color contrast in both themes
- Respect user's system preference when no manual choice has been made

## Visual Design

### Theme Toggle Button Location
- Position: Header, next to the title "Goblinstadt Ressourcen"
- Layout: Right side of header with flexbox (title on left, toggle + offline status on right)
- Icon: Sun (☀) for light mode, Moon (☽) for dark mode
- Size: 32px button (touch-optimized, matching other interactive elements)
- Style: Neutral colors that work in both themes, simple icons that invert appropriately

### Theme Colors
**Light Mode** (existing CSS variables):
- Background: `#f5f5f5` (light gray)
- Secondary background: `#ffffff` (white)
- Text: `#333333` (dark gray)
- Borders: `#dddddd` (light gray)
- Cards: `#ffffff` (white)

**Dark Mode** (existing CSS variables):
- Background: `#121212` (very dark gray)
- Secondary background: `#1e1e1e` (dark gray)
- Text: `#e0e0e0` (light gray)
- Borders: `#404040` (medium gray)
- Cards: `#1e1e1e` to `#2a2a2a` gradient

**Theme-color Meta Tag Values**:
- Light mode: `#ffffff` (matches light mode header)
- Dark mode: `#222222` (matches dark mode header, already defined)

## Reusable Components

### Existing Code to Leverage
**localStorage Pattern** (`app.js` lines 104-121):
- `saveState()` function saves to localStorage
- `loadState()` function retrieves from localStorage
- Keys use format: `goblinstadt-{feature}`
- Pattern: Check if saved value exists, use it, otherwise use default

**Button Styling** (`styles.css` lines 497-586):
- `.btn` class provides base button styling
- Touch-optimized with 32px min height
- Ripple effect on press
- Gradient backgrounds with hover effects
- Follow this pattern for theme toggle button

**CSS Custom Properties** (`styles.css` lines 9-106):
- `:root` defines light mode variables
- `.dark-mode` class overrides with dark values
- Complete set of variables already exists
- Apply theme by toggling class on `<html>` element

**Service Worker Cache Versioning** (`sw.js` line 2):
- Current version: `goblinstadt-cache-v9`
- Increment to `v10` for theme update
- Pattern: Update `CACHE_NAME` constant

### New Components Required
**Theme Detection Function** (new in `app.js`):
- Required because: No existing system preference detection
- Purpose: Use `window.matchMedia('(prefers-color-scheme: dark)')` to detect preference
- Must run before any UI rendering to prevent FOUC

**Theme Toggle Button** (new in `index.html`):
- Required because: No existing theme toggle UI element
- Purpose: Allow manual theme switching
- Cannot reuse: Offline status indicator is informational only, not interactive

**Theme Application Function** (new in `app.js`):
- Required because: Need to apply theme class to HTML element
- Purpose: Add/remove `.dark-mode` class and update meta tag
- Must coordinate between system preference, saved preference, and manual toggle

## Technical Approach

### Database
No database changes required - localStorage only.

### API
No API changes required - client-side only feature.

### Frontend

#### HTML Changes (`index.html`)

**Theme Toggle Button** (add to header, line 44-49):
```html
<header>
    <h1>Goblinstadt Ressourcen</h1>
    <div class="header-right">
        <button id="theme-toggle" class="theme-toggle-btn" aria-label="Theme umschalten">
            <span class="theme-icon"></span>
        </button>
        <div id="offline-status">
            <span id="status-indicator">Online</span>
        </div>
    </div>
</header>
```

**Meta Tag** (already exists at line 6):
- Existing: `<meta name="theme-color" content="#222222">`
- Keep as-is, will be updated dynamically via JavaScript

#### CSS Changes (`styles.css`)

**Header Layout Update** (modify existing header styles, line 166-178):
- Change header from single-column to flexbox row
- Create `.header-right` container for toggle + offline status
- Maintain existing header height (55px)

**Theme Toggle Button Styles** (new section after header styles):
```css
.header-right {
    display: flex;
    align-items: center;
    gap: 8px;
}

.theme-toggle-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color var(--transition-fast);
}

.theme-toggle-btn:hover {
    background: var(--border-color);
}

.theme-icon::before {
    font-size: 1.2rem;
    display: block;
}

/* Sun icon for dark mode (shows what you'll get) */
.dark-mode .theme-icon::before {
    content: '☀';
    color: var(--text-primary);
}

/* Moon icon for light mode (shows what you'll get) */
.theme-icon::before {
    content: '☽';
    color: var(--text-primary);
}
```

**Transition Enhancement** (modify existing `:root` and `.dark-mode`, lines 10-106):
- Add transition to all theme-dependent properties
- Apply to: `background-color`, `color`, `border-color`, `box-shadow`
- Duration: Use existing `--transition-base` (250ms)
- Add to `body`, `.container`, `.resource-card`, `.modal-content`, etc.

#### JavaScript Changes (`app.js`)

**Theme Detection and Application** (add before state initialization, before line 86):

```javascript
// Theme Management - MUST run before UI rendering
const THEME_STORAGE_KEY = 'goblinstadt-theme-preference';

// Detect system theme preference
function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

// Load saved theme preference from localStorage
function loadThemePreference() {
    return localStorage.getItem(THEME_STORAGE_KEY);
}

// Save theme preference to localStorage
function saveThemePreference(theme) {
    if (theme === null) {
        localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
}

// Apply theme to document
function applyTheme(theme) {
    const html = document.documentElement;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (theme === 'dark') {
        html.classList.add('dark-mode');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', '#222222');
        }
    } else {
        html.classList.remove('dark-mode');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', '#ffffff');
        }
    }
}

// Get current active theme
function getCurrentTheme() {
    return document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light';
}

// Toggle theme
function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    saveThemePreference(newTheme);
}

// Initialize theme on app load
function initializeTheme() {
    // Priority: 1) Saved preference, 2) System preference, 3) Dark mode default
    const savedTheme = loadThemePreference();
    const themeToApply = savedTheme || getSystemTheme() || 'dark';
    applyTheme(themeToApply);
}

// Call immediately to prevent FOUC
initializeTheme();

// Listen for system theme changes (only if no manual preference set)
if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
        // Only apply system preference if user hasn't manually chosen
        if (!loadThemePreference()) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}
```

**Theme Toggle Event Listener** (add in DOMContentLoaded, after line 657):

```javascript
// Setup theme toggle button handler
const themeToggleBtn = document.getElementById('theme-toggle');
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
}
```

### Service Worker (`sw.js`)

**Cache Version Update** (line 2):
```javascript
const CACHE_NAME = 'goblinstadt-cache-v10'; // Incremented from v9
```

No other Service Worker changes needed - cache-first strategy already handles updated files.

### Testing

#### Manual Testing Checklist
1. **First Visit Tests**:
   - Device in light mode → App opens in light mode
   - Device in dark mode → App opens in dark mode
   - Device with no preference → App opens in dark mode (default)

2. **Toggle Tests**:
   - Click toggle in light mode → Switches to dark mode
   - Click toggle in dark mode → Switches to light mode
   - Toggle icon changes appropriately (sun/moon)
   - Colors transition smoothly (no jarring flash)

3. **Persistence Tests**:
   - Toggle to light mode, refresh page → Stays in light mode
   - Toggle to dark mode, refresh page → Stays in dark mode
   - Clear localStorage, refresh → Uses system preference

4. **System Preference Tests**:
   - No saved preference, change device theme → App follows device theme
   - Saved preference exists, change device theme → App ignores device theme

5. **PWA Integration Tests**:
   - Install PWA in light mode → Status bar is light colored
   - Install PWA in dark mode → Status bar is dark colored
   - Toggle theme in PWA → Status bar color updates

6. **Visual Tests**:
   - All resource cards render correctly in both themes
   - Modal edit dialog renders correctly in both themes
   - Tab buttons and indicators visible in both themes
   - Button hover states work in both themes
   - Icons (resource, class emblems) maintain class colors in both themes

7. **Offline Tests**:
   - Go offline, refresh page → Theme persists
   - Toggle theme while offline → Works correctly
   - Service Worker serves correct theme CSS

#### Automated Testing
No automated tests required for this feature (manual testing sufficient for UI feature).

## Out of Scope

### Not Included in This Implementation
- **Animated theme transitions**: No complex fade/morph animations between themes
- **Theme-specific resource card variations**: Cards maintain same structure in both themes
- **Seasonal theme options**: No additional themes (Halloween, Christmas, etc.)
- **Custom theme color pickers**: Users cannot customize specific colors
- **Per-category theme customization**: Cannot set different themes per character class
- **Scheduled automatic theme switching**: No time-based theme changes (e.g., auto-dark at night)
- **High contrast mode**: No accessibility high-contrast variant
- **Theme sharing/export**: No ability to share theme preference with other users

### Future Enhancements
- Additional theme variants (e.g., sepia, high contrast)
- Per-category color customization
- Theme presets based on character class
- Export/import theme preferences with CSV
- Animated icon transitions between sun/moon

## Success Criteria

### Measurable Outcomes
- **Theme Persistence**: User's theme choice persists across 100% of page refreshes and PWA reinstalls
- **Load Performance**: Theme application occurs with 0 visible flashes of wrong theme (FOUC)
- **System Integration**: PWA status bar color matches active theme on iOS and Android
- **User Control**: Toggle button switches themes in <100ms with smooth color transitions

### User Experience Goals
- New users see a theme that matches their device preference automatically
- Users can easily find and use the theme toggle (visible in header)
- Theme choice feels personal and persistent (app "remembers" preference)
- Both themes maintain the RPG fantasy aesthetic and character class colors
- Color transitions feel polished and intentional, not accidental

### Technical Goals
- No breaking changes to existing functionality
- localStorage pattern consistent with existing code
- CSS maintains maintainability with custom properties
- Service Worker cache update forces refresh on all clients
- Code follows existing conventions (German comments, function organization)

## Edge Cases and Special Considerations

### Edge Case 1: localStorage Quota
**Scenario**: User's browser localStorage is full or disabled
**Solution**: Theme defaults to system preference or dark mode. App remains functional without theme persistence.

### Edge Case 2: Old Service Worker Cache
**Scenario**: User has old cached version without theme toggle
**Solution**: Service Worker v10 auto-updates and clears v9 cache. User gets theme feature on next visit.

### Edge Case 3: Browser Doesn't Support prefers-color-scheme
**Scenario**: Very old browsers without media query support
**Solution**: `window.matchMedia` check safely fails, defaults to dark mode. Toggle still works.

### Edge Case 4: Mid-Session System Theme Change
**Scenario**: User changes device theme while app is open
**Solution**:
- If no manual preference: App follows system theme change automatically
- If manual preference exists: App ignores system change, respects user choice

### Edge Case 5: HTML Class Already Set
**Scenario**: `index.html` has hardcoded `.dark-mode` class (line 2)
**Solution**: JavaScript theme initialization runs immediately and overwrites based on preference. Remove hardcoded class or let JS override.

### Edge Case 6: Theme Toggle Spam
**Scenario**: User rapidly clicks theme toggle button
**Solution**: CSS transitions handle visual smoothness. No debouncing needed - each click is valid.

### Special Consideration: Load Order
**Critical**: Theme initialization must run BEFORE any UI rendering to prevent FOUC.

**Implementation Order**:
1. `initializeTheme()` called immediately when `app.js` loads (line ~90)
2. Theme applied to `<html>` element
3. CSS variables cascade to all elements
4. Then `loadState()` and `renderUI()` execute

**Why**: If theme applies after rendering, user sees brief flash of wrong theme.

### Special Consideration: Icon Accessibility
**Requirement**: Theme toggle button needs ARIA label for screen readers.

**Implementation**:
```html
<button id="theme-toggle" aria-label="Theme umschalten">
```

**German Text**: "Theme umschalten" = "Toggle theme"

### Special Consideration: Character Class Colors
**Requirement**: Character class colors (rogue gold, mage purple, healer blue, warrior red) must remain consistent across both themes.

**Solution**: Character class color variables (lines 109-133 in `styles.css`) are defined in both `:root` and `.dark-mode` with identical values. No changes needed.

### Special Consideration: Remainder Color Coding
**Requirement**: Resource remainder colors (red 0-4, yellow 5-7, green 8-9) must remain readable in both themes.

**Current Implementation**:
- Light mode: Bright backgrounds (`#ffcccc`, `#ffffcc`, `#ccffcc`)
- Dark mode: Muted backgrounds (`#5c2626`, `#5c5c26`, `#265c26`)

**Solution**: Keep existing implementation. Both provide sufficient contrast with their respective text colors.

## Implementation Notes

### Code Style
- **Language**: German for UI text and comments (matches existing codebase)
- **Function names**: English camelCase (matches existing pattern)
- **Constants**: UPPER_SNAKE_CASE for storage keys
- **Comments**: Describe "why" not "what" (matches existing style)

### File Modification Summary
- `index.html`: Add theme toggle button to header (~10 lines)
- `styles.css`: Add theme toggle styles, update header layout (~50 lines)
- `app.js`: Add theme management functions (~80 lines)
- `sw.js`: Update cache version (1 line)

### Rollout Plan
1. Update `sw.js` cache version first (forces client update)
2. Add theme JavaScript functions to `app.js` (no dependencies)
3. Add theme toggle button to `index.html` (references JS functions)
4. Add theme button styles to `styles.css` (completes feature)
5. Test locally with Python HTTP server
6. Deploy to production (all files updated atomically)

### Backwards Compatibility
- Users without saved preference: Auto-detect system theme (new behavior)
- Users with v9 cache: Auto-update to v10, gain theme feature
- Existing localStorage data: Unchanged, theme adds new key only
- Existing functionality: No breaking changes, theme is purely additive
