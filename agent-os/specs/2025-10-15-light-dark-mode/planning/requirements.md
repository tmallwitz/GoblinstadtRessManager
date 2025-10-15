# Spec Requirements: Light & Dark Mode

## Initial Description
Implement Light & Dark Mode for the Goblinstadt Ressourcen Manager PWA.

## Requirements Discussion

### First Round Questions

**Q1:** I assume you want BOTH a manual toggle AND automatic system preference detection (prefers-color-scheme), with the manual toggle overriding the system preference. Is that correct?
**Answer:** YES - BOTH manual toggle AND automatic system preference detection (prefers-color-scheme), with manual toggle overriding system preference

**Q2:** For the theme toggle placement, I'm thinking we should add it to the header next to the title as a sun/moon icon button. Should we place it there, or would you prefer it in the footer or settings area?
**Answer:** YES - In the header next to the title as a sun/moon icon button

**Q3:** I assume we should save the user's theme preference to localStorage (similar to how we save activeTab) with a key like 'goblinstadt-theme-preference'. Is that correct?
**Answer:** YES - Save to localStorage with key like 'goblinstadt-theme-preference'

**Q4:** For light mode colors, should we define a complete new color scheme or adapt the existing dark mode variables (primary-bg, secondary-bg, etc.) with lighter values that maintain the same visual hierarchy?
**Answer:** Keep the existing light mode CSS variables as-is (they're already well-defined)

**Q5:** For the theme toggle behavior on first visit: should we default to dark mode (current state) if no system preference is detected, or default to light mode?
**Answer:** First visit: Use system preference if available, otherwise default to dark mode. After manual toggle: Always use the user's chosen preference. Smooth color transitions using existing CSS transitions.

**Q6:** Should the PWA manifest theme-color meta tag dynamically update based on the active theme for native-like status bar coloring on mobile?
**Answer:** YES - Dynamically update the theme-color meta tag based on active theme

**Q7:** Should we increment the Service Worker cache version (currently v3) to v4 to ensure all users get the updated theme functionality?
**Answer:** YES - Increment to v4 to ensure users get the updated functionality

**Q8:** For the toggle icon styling, should we use neutral colors that work in both themes, or tie it to the character class colors used elsewhere in the app?
**Answer:** Use neutral styling that works in both themes (not character class colors) - simple sun/moon icons that invert appropriately

**Q9:** Is there anything we should explicitly NOT include in this implementation? For example: animated theme transitions, theme-specific resource card variations, seasonal theme options, etc.?
**Answer:** Keep it simple - no animated theme transitions, no theme-specific resource card variations, no seasonal options. Just clean light/dark toggle.

### Existing Code to Reference
No similar existing features identified for reference.

### Follow-up Questions
No follow-up questions were needed.

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
N/A - No visual files to analyze.

## Requirements Summary

### Functional Requirements

**Theme Detection & Application:**
- Detect system color scheme preference using `prefers-color-scheme` media query
- Apply appropriate theme (light or dark) based on detection or stored preference
- Support manual theme toggle that overrides system preference
- Default to dark mode when no system preference is available and no user preference is stored

**Theme Toggle Control:**
- Sun/moon icon button in the header next to the title
- Toggle switches between light and dark themes
- Icon indicates current theme (sun for light mode, moon for dark mode)
- Touch-optimized button size (32px minimum) consistent with existing UI

**Preference Persistence:**
- Save user's manual theme choice to localStorage under key `goblinstadt-theme-preference`
- Possible values: `'light'`, `'dark'`, or `null` (use system preference)
- Load saved preference on app initialization
- Prioritize stored preference over system preference

**PWA Integration:**
- Dynamically update `theme-color` meta tag based on active theme
- Light theme uses light primary background color
- Dark theme uses dark primary background color
- Ensures native-like status bar coloring on mobile devices

**Service Worker Update:**
- Increment cache version from v3 to v4
- Ensure all users receive updated theme functionality
- Maintain cache-first strategy for offline support

### Non-Functional Requirements

**Visual Design:**
- Use existing light mode CSS variables (already defined in styles.css)
- Maintain visual hierarchy and consistency across both themes
- Neutral icon styling that works in both light and dark modes
- Icons should invert appropriately for visibility

**User Experience:**
- Smooth color transitions using existing CSS transition properties
- No jarring color changes
- No animated theme transitions (keep it simple)
- Immediate visual feedback when toggling theme

**Performance:**
- Theme application should be instantaneous
- No flash of unstyled content (FOUC) or wrong theme on page load
- Minimal JavaScript overhead for theme detection and switching

**Accessibility:**
- Theme toggle button must have proper ARIA labels
- Sufficient color contrast in both light and dark modes
- Respect user's system preference when no manual choice is made

### Reusability Opportunities

**Existing Patterns to Follow:**
- localStorage persistence pattern (similar to `goblinstadt-active-tab`)
- Button styling and touch optimization from existing +/-/Edit buttons
- CSS variable system already in place for theming
- Service Worker cache versioning pattern

**Existing Code Structures:**
- State management pattern in app.js (load/save functions)
- Event listener setup for UI controls
- CSS custom properties for color management

### Scope Boundaries

**In Scope:**
- Automatic system preference detection via `prefers-color-scheme`
- Manual theme toggle with sun/moon icon in header
- localStorage persistence of user preference
- Light and dark theme CSS using existing variables
- Dynamic `theme-color` meta tag updates
- Service Worker cache version bump to v4
- Smooth color transitions between themes
- Default to dark mode when no preference detected

**Out of Scope:**
- Animated theme transitions (no complex animations)
- Theme-specific resource card variations
- Seasonal theme options or additional theme variants
- Custom theme color pickers
- Per-category theme customization
- Scheduled automatic theme switching (e.g., day/night based on time)

### Technical Considerations

**localStorage Keys:**
- New key: `goblinstadt-theme-preference`
- Values: `'light'` | `'dark'` | `null`

**CSS Implementation:**
- Leverage existing CSS custom properties in styles.css
- Light mode variables are already defined
- Add theme class to `<html>` or `<body>` element for theme switching
- Use `:root` and `[data-theme="light"]` or similar selector pattern

**JavaScript Changes:**
- Add theme detection function using `window.matchMedia('(prefers-color-scheme: dark)')`
- Add theme toggle function
- Add localStorage save/load for theme preference
- Apply theme class on page load (before render to prevent FOUC)
- Update `theme-color` meta tag dynamically

**Service Worker:**
- Update `CACHE_NAME` from `goblinstadt-cache-v3` to `goblinstadt-cache-v4`
- No other changes needed to cache strategy

**HTML Changes:**
- Add theme toggle button in header
- Ensure `theme-color` meta tag exists for dynamic updates

**Icon Implementation:**
- Simple SVG or Unicode sun (☀) and moon (☾) icons
- Styled to be visible and neutral in both themes
- Appropriate size for touch interaction (32px button)

**Load Order Priority:**
- Theme detection and application MUST happen before UI rendering
- Should occur early in app.js initialization
- Prevents flash of wrong theme on page load

**Browser Compatibility:**
- `prefers-color-scheme` supported in all modern browsers
- `window.matchMedia` widely supported
- localStorage widely supported
- No compatibility concerns for PWA target platforms (iOS Safari, Android Chrome)
