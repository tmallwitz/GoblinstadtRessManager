# Task Breakdown: Light & Dark Mode Theme Toggle

## Overview
Total Tasks: 4 task groups
Assigned roles: ui-designer, testing-engineer
Estimated implementation time: 2-3 hours

## Task List

### CSS Layer

#### Task Group 1: CSS Enhancements and Theme Toggle Styling
**Assigned implementer:** ui-designer
**Dependencies:** None

- [x] 1.0 Complete CSS layer for theme toggle
  - [x] 1.1 Write 2-8 focused tests for theme CSS functionality
    - Test that `.dark-mode` class applies dark theme colors to body/container
    - Test that theme toggle button renders correctly in both themes
    - Test that header layout accommodates toggle button without breaking
    - Test that all color transitions apply smoothly (check transition properties)
    - Limit to 2-8 highly focused tests maximum
    - Skip exhaustive testing of all color variables
  - [x] 1.2 Modify header layout in `styles.css` (lines ~166-178)
    - Change header from single-column to flexbox row layout
    - Create `.header-right` container for theme toggle + offline status
    - Maintain existing header height (55px)
    - Ensure title remains left-aligned
    - Position `.header-right` with `display: flex`, `align-items: center`, `gap: 8px`
    - Reference existing header styles for consistency
  - [x] 1.3 Create theme toggle button styles in `styles.css` (new section after header)
    - Style `.theme-toggle-btn`: 32px × 32px, transparent background, 4px border-radius
    - Add hover state: background changes to `var(--border-color)`
    - Style `.theme-icon::before`: 1.2rem font-size, block display
    - Default (light mode): content '☽' (moon), color `var(--text-primary)`
    - Dark mode: content '☀' (sun), color `var(--text-primary)`
    - Follow existing button patterns from `.btn` class (lines 497-586)
    - Touch-optimized: 32px minimum size
  - [x] 1.4 Add smooth color transitions to theme-dependent elements
    - Add transition to: `body`, `.container`, `.resource-card`, `.modal-content`, header, footer
    - Properties to transition: `background-color`, `color`, `border-color`, `box-shadow`
    - Duration: use existing `var(--transition-base)` (250ms)
    - Ensure transitions don't interfere with existing animations
  - [x] 1.5 Verify CSS custom properties are ready for theme switching
    - Confirm `:root` defines light mode variables (lines 10-68)
    - Confirm `.dark-mode` defines dark mode overrides (lines 71-106)
    - Verify character class colors remain identical in both themes (lines 109-133)
    - No CSS variable changes needed - just verification
  - [x] 1.6 Ensure CSS layer tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify theme toggle button styling works in both themes
    - Verify header layout doesn't break
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Header layout correctly accommodates theme toggle button
- Theme toggle button renders with correct sun/moon icons
- Smooth color transitions apply when toggling between themes
- All existing styles remain intact and functional

### JavaScript Layer

#### Task Group 2: Theme Detection and Application Logic
**Assigned implementer:** ui-designer
**Dependencies:** Task Group 1

- [x] 2.0 Complete JavaScript theme management
  - [x] 2.1 Write 2-8 focused tests for theme JavaScript functionality
    - Test that `initializeTheme()` applies dark mode by default
    - Test that `toggleTheme()` switches between light and dark
    - Test that theme preference saves to localStorage under `goblinstadt-theme-preference`
    - Test that saved preference loads on page reload
    - Test that `theme-color` meta tag updates correctly
    - Limit to 2-8 highly focused tests maximum
    - Skip exhaustive edge case testing
  - [x] 2.2 Add theme constants and detection functions in `app.js` (before line 86)
    - Define `THEME_STORAGE_KEY = 'goblinstadt-theme-preference'`
    - Create `getSystemTheme()`: uses `window.matchMedia('(prefers-color-scheme: dark)')`
    - Create `loadThemePreference()`: returns `localStorage.getItem(THEME_STORAGE_KEY)`
    - Create `saveThemePreference(theme)`: saves to localStorage or removes if null
    - Follow existing localStorage pattern from `loadState()`/`saveState()` (lines 104-122)
  - [x] 2.3 Create theme application function
    - Create `applyTheme(theme)`: adds/removes `.dark-mode` class on `document.documentElement`
    - Update `theme-color` meta tag: `#222222` for dark, `#ffffff` for light
    - Query selector: `document.querySelector('meta[name="theme-color"]')`
    - Use `setAttribute('content', colorValue)` to update
  - [x] 2.4 Create theme toggle and query functions
    - Create `getCurrentTheme()`: returns 'dark' if `.dark-mode` class exists, else 'light'
    - Create `toggleTheme()`: switches theme, applies it, saves preference
    - Ensure toggle updates both DOM class and meta tag
  - [x] 2.5 Create theme initialization function
    - Create `initializeTheme()`: priority order: saved preference > system preference > 'dark' default
    - Call `initializeTheme()` immediately after function definition (before state initialization)
    - CRITICAL: Must run before `renderUI()` to prevent FOUC
    - Add system theme change listener (only applies if no manual preference)
  - [x] 2.6 Add theme toggle event listener in DOMContentLoaded (after line 657)
    - Query `#theme-toggle` button
    - Attach click event listener to call `toggleTheme()`
    - Follow existing event listener pattern from modal/tab handlers
  - [x] 2.7 Ensure JavaScript layer tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify theme initializes correctly on load
    - Verify toggle switches theme and saves preference
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Theme initializes before UI renders (no FOUC)
- Saved theme preference persists across page reloads
- System preference detection works when no saved preference exists
- Manual toggle overrides system preference
- Meta tag updates dynamically with theme changes

### HTML Layer

#### Task Group 3: Theme Toggle Button Integration
**Assigned implementer:** ui-designer
**Dependencies:** Task Groups 1-2

- [x] 3.0 Complete HTML integration
  - [x] 3.1 Write 2-8 focused tests for theme toggle HTML integration
    - Test that theme toggle button exists in DOM
    - Test that button click triggers theme change
    - Test that header layout accommodates toggle without overflow
    - Test that button has proper ARIA label for accessibility
    - Limit to 2-8 highly focused tests maximum
  - [x] 3.2 Modify header structure in `index.html` (lines 44-49)
    - Wrap existing offline status in new `.header-right` div
    - Add theme toggle button before offline status
    - Button structure:
      ```html
      <button id="theme-toggle" class="theme-toggle-btn" aria-label="Theme umschalten">
          <span class="theme-icon"></span>
      </button>
      ```
    - Maintain existing h1 title and offline status structure
  - [x] 3.3 Verify meta tag for dynamic theme-color updates
    - Confirm `<meta name="theme-color" content="#222222">` exists at line 6
    - Keep existing content value - JavaScript will update dynamically
    - No changes needed - just verification
  - [x] 3.4 Verify hardcoded dark-mode class on html element (line 2)
    - Note: `<html lang="de" class="dark-mode">` has hardcoded class
    - Decision: Keep as default fallback, JavaScript will override based on preference
    - JavaScript initialization will handle theme application correctly
  - [x] 3.5 Update Service Worker cache version in `sw.js` (line 2)
    - Change `CACHE_NAME` from `'goblinstadt-cache-v9'` to `'goblinstadt-cache-v10'`
    - Forces all clients to update and receive new theme functionality
    - Follow existing cache versioning pattern
  - [x] 3.6 Ensure HTML integration tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify theme toggle button renders in header
    - Verify button click triggers theme change
    - Verify ARIA label exists for accessibility
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- Theme toggle button renders correctly in header
- Header layout accommodates toggle without breaking
- Button has proper ARIA label "Theme umschalten"
- Service Worker cache updated to v10

### Testing

#### Task Group 4: Integration Testing & Manual Verification
**Assigned implementer:** testing-engineer
**Dependencies:** Task Groups 1-3

- [x] 4.0 Review and test complete theme toggle feature
  - [x] 4.1 Review tests from Task Groups 1-3
    - Review the 2-8 CSS tests from ui-designer (Task 1.1)
    - Review the 2-8 JavaScript tests from ui-designer (Task 2.1)
    - Review the 2-8 HTML tests from ui-designer (Task 3.1)
    - Total existing tests: approximately 6-24 tests
  - [x] 4.2 Analyze test coverage gaps for theme toggle feature only
    - Identify critical theme workflows that lack test coverage
    - Focus on: first visit behavior, persistence, system preference handling
    - Prioritize end-to-end workflows over unit test gaps
    - Do NOT assess entire application test coverage
  - [x] 4.3 Write up to 10 additional strategic tests maximum
    - Test first visit with system preference (dark mode device → app shows dark)
    - Test first visit with no system preference → app defaults to dark
    - Test toggle persistence: toggle to light, reload, verify light mode persists
    - Test manual override: save preference, change system preference, verify app ignores system
    - Test offline behavior: toggle theme while offline, verify it works
    - Test PWA meta tag: verify theme-color updates when toggling
    - Maximum 10 new tests to fill critical gaps only
    - Skip edge cases like localStorage quota or rapid toggle spam
  - [x] 4.4 Run comprehensive manual testing checklist
    - **First Visit Tests**: Device in light mode → app in light mode; Device in dark mode → app in dark mode; No preference → dark mode default
    - **Toggle Tests**: Click in light mode → switches to dark; Click in dark mode → switches to light; Icon changes (sun/moon); Smooth color transitions
    - **Persistence Tests**: Toggle to light, refresh → stays light; Toggle to dark, refresh → stays dark; Clear localStorage, refresh → uses system preference
    - **System Preference Tests**: No saved preference, change device theme → app follows; Saved preference exists, change device theme → app ignores
    - **Visual Tests**: All resource cards render in both themes; Modal renders in both themes; Tab buttons visible in both themes; Button hover states work; Character class colors consistent
    - **Offline Tests**: Go offline, refresh → theme persists; Toggle while offline → works correctly
  - [x] 4.5 Run feature-specific tests only
    - Run ONLY tests related to theme toggle feature (tests from 1.1, 2.1, 3.1, and 4.3)
    - Expected total: approximately 16-34 tests maximum
    - Do NOT run the entire application test suite
    - Verify all theme-related workflows pass
  - [x] 4.6 Document any issues or edge cases discovered
    - Note any browser compatibility issues
    - Document any visual inconsistencies between themes
    - Report any accessibility concerns
    - Keep documentation brief and actionable

**Acceptance Criteria:**
- All feature-specific tests pass (approximately 16-34 tests total)
- Manual testing checklist completed successfully
- Theme toggle works correctly in all tested scenarios
- No more than 10 additional tests added by testing-engineer
- Testing focused exclusively on theme toggle feature
- All critical theme workflows verified

## Execution Order

Recommended implementation sequence:
1. **CSS Layer** (Task Group 1) - Foundation for theme styling
2. **JavaScript Layer** (Task Group 2) - Core theme logic and state management
3. **HTML Layer** (Task Group 3) - UI integration and Service Worker update
4. **Testing** (Task Group 4) - Comprehensive verification and gap analysis

## Implementation Notes

### Critical Constraints
- **Load Order**: Theme initialization MUST occur before `renderUI()` to prevent FOUC
- **localStorage Key**: Use `goblinstadt-theme-preference` to match existing convention
- **Service Worker**: Increment cache from v9 to v10 to force client updates
- **No Breaking Changes**: All existing functionality must remain intact
- **German Language**: UI text in German (e.g., "Theme umschalten")

### Code Standards Alignment
- **Tech Stack**: Vanilla JavaScript, CSS custom properties, no frameworks
- **Coding Style**: English function names (camelCase), German UI text/comments
- **CSS Methodology**: CSS custom properties (variables), no framework utilities
- **Test Coverage**: Minimal focused tests (2-8 per group), strategic coverage only
- **DRY Principle**: Reuse existing localStorage patterns, button styles, transition variables

### File Modification Summary
- `styles.css`: Add ~50 lines (header layout, theme toggle styles, transitions)
- `app.js`: Add ~80 lines (theme functions, initialization, event listener)
- `index.html`: Modify ~10 lines (header structure with toggle button)
- `sw.js`: Change 1 line (cache version increment)

### Reusable Patterns
- **localStorage Pattern**: Follow `saveState()`/`loadState()` pattern (app.js lines 104-122)
- **Button Styling**: Follow `.btn` class pattern (styles.css lines 497-586)
- **Event Listeners**: Follow existing DOMContentLoaded pattern (app.js lines 598-657)
- **CSS Variables**: Use existing `:root` and `.dark-mode` structure (styles.css lines 9-106)

### Special Considerations
- **Character Class Colors**: Must remain identical in both themes (already configured)
- **Remainder Color Coding**: Red/yellow/green coding works in both themes (no changes needed)
- **Icon Accessibility**: Theme toggle needs `aria-label="Theme umschalten"`
- **System Preference Listener**: Only applies automatic theme change if no manual preference exists
- **Hardcoded Dark Mode**: HTML has `class="dark-mode"` - JavaScript will override based on preference
