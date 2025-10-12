# Specification: Goblinstadt Resource Manager - Visual Modernization

## Goal

Transform the Goblinstadt Resource Manager PWA from a functional but plain interface into a visually stunning, game-inspired experience while preserving all existing functionality. The modernization will introduce RPG-themed design elements, smooth animations, character class theming, and Tailwind CSS integration - all while maintaining the vanilla JavaScript architecture and ensuring all 8 resources per character class fit on screen without scrolling on iPhone 16 Pro Max.

## User Stories

- As a Goblinstadt player, I want the app to look visually appealing and game-like so that tracking resources feels like part of the gaming experience
- As a mobile user, I want smooth, eye-catching animations when interacting with resources so that the app feels modern and responsive
- As a character player, I want clear visual theming for each character class (Rogue, Mage, Healer, Warrior) so I can instantly recognize which class I'm managing
- As a resource manager, I want all 8 resources for my character visible without scrolling so I can view everything at a glance
- As an existing user, I want all current features (CSV import/export, offline mode, localStorage) to continue working exactly as before so I don't lose functionality
- As a mobile gamer, I want fantasy-themed visual effects that make resource management feel magical and engaging

## Core Requirements

### Functional Requirements (Preservation)

**All existing functionality must be preserved:**

- CSV import/export with current Excel-compatible format (column alternation: Schlitzohr,,Magier,,Krieger,,Heiler)
- localStorage state persistence with existing key structure (`goblinstadt-resources`, `goblinstadt-active-tab`)
- Offline-first PWA capability with Service Worker cache-first strategy
- Visual stack system: stacks of 10 with color-coded remainders (0-4 red, 5-7 yellow, 8-9 green)
- Tab-based navigation between 4 character classes
- Resource operations: Add (+1, +5, +10), Subtract (-1, -5, -10), Edit (direct value input)
- Non-negative integer constraint on all resource counts
- Active tab persistence across sessions
- Total counts displayed in tab names format: `ClassName (Total)`
- Modal edit dialog with keyboard support (Enter to save, Escape to close)
- Touch-optimized interface with `touch-action: manipulation` to prevent zoom
- Online/offline status indicator
- Home screen installation capability for iOS Safari and Android Chrome

**No new functional features:**
- No swipe gestures for tab navigation
- No haptic feedback
- No sound effects
- No achievement/progression systems
- No multi-language support (German only)

### Non-Functional Requirements

**Performance:**
- Animations must maintain 60fps performance
- Touch interactions must remain immediately responsive
- Service Worker must cache all new assets for offline functionality
- Page load time must not increase significantly with new styling

**Accessibility:**
- Maintain large touch targets (minimum 32px for all interactive elements)
- Ensure sufficient color contrast in dark mode (WCAG AA compliance: 4.5:1 for normal text)
- Preserve keyboard navigation support
- Maintain semantic HTML structure
- Keep focus management for modal dialogs

**Browser Compatibility:**
- iOS Safari (primary target)
- Android Chrome (secondary)
- Desktop browsers (tertiary)

**Maintainability:**
- Vanilla JavaScript architecture preserved (no React/Vue/Angular)
- No build process required (static web app with CDN resources)
- Service Worker implementation maintained
- Code structure and existing function signatures preserved
- German language for all code comments and variables (following existing convention)

## Visual Design

### Design Theme: Fantasy RPG Aesthetic

**Overall Visual Direction:**
- Dark mode optimized medieval fantasy theme
- RPG-style ornate card borders and frames
- Rich gradients and sophisticated shadows
- Character class-specific color theming
- Modern but game-like appearance
- Visually rich but functional and clean

### Color System

**Base Dark Mode Palette (Enhanced):**
```css
:root {
  /* Background gradients */
  --bg-primary: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  --bg-secondary: #1e1e1e;

  /* Text colors */
  --text-primary: #e0e0e0;
  --text-secondary: #b0b0b0;
  --text-muted: #707070;

  /* Card backgrounds with gradients */
  --card-bg: linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%);
  --card-border: #404040;

  /* Existing remainder colors (preserved) */
  --red-remainder: #5c2626;
  --yellow-remainder: #5c5c26;
  --green-remainder: #265c26;

  /* Shadow system */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 20px rgba(255, 255, 255, 0.1);
}
```

**Character Class Theme Colors (from existing tab colors):**

```css
/* Schlitzohr/Rogue - Gold/Yellow theme */
--rogue-primary: #FFD700;
--rogue-secondary: #FFA500;
--rogue-gradient: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
--rogue-glow: 0 0 20px rgba(255, 215, 0, 0.3);

/* Gelehrter/Magier/Mage - Purple theme */
--mage-primary: #8A2BE2;
--mage-secondary: #9370DB;
--mage-gradient: linear-gradient(135deg, #8A2BE2 0%, #9370DB 100%);
--mage-glow: 0 0 20px rgba(138, 43, 226, 0.3);

/* Wundpfleger/Heiler/Healer - Blue theme */
--healer-primary: #1E90FF;
--healer-secondary: #4169E1;
--healer-gradient: linear-gradient(135deg, #1E90FF 0%, #4169E1 100%);
--healer-glow: 0 0 20px rgba(30, 144, 255, 0.3);

/* Knappe/Krieger/Warrior - Red theme */
--warrior-primary: #DC143C;
--warrior-secondary: #B22222;
--warrior-gradient: linear-gradient(135deg, #DC143C 0%, #B22222 100%);
--warrior-glow: 0 0 20px rgba(220, 20, 60, 0.3);
```

### Typography

**Font Stack:**
- Headings: Consider fantasy-style web fonts like "Cinzel" or "MedievalSharp" from Google Fonts (CDN)
- Body text: Keep "Segoe UI" for readability
- Fallback: System fonts for performance

**Font Sizes (responsive):**
```css
--font-size-xs: 0.7rem;
--font-size-sm: 0.8rem;
--font-size-base: 0.85rem;
--font-size-lg: 0.95rem;
--font-size-xl: 1.2rem;
--font-size-2xl: 1.5rem;
```

### Spacing and Layout

**Critical Layout Constraint:**
All 8 resources must fit on iPhone 16 Pro Max portrait (430×932px viewport) WITHOUT scrolling.

**Revised Layout Heights:**
```
Header: 55px (reduced from 60px)
Tabs: 45px (increased from 40px for emblems)
Content: ~680px (calculated: 932 - 55 - 45 - 45 - 107)
Footer: 45px + status indicators ~62px total
```

**Resource Card Dimensions:**
```
Grid: 2 columns × 4 rows
Card height: (680px - (3 gaps × 8px)) / 4 = ~164px per card
Card width: (430px - 12px padding - 8px gap) / 2 = ~205px per card
Gap: 8px between cards
Padding: 6px container padding
```

**Card Internal Layout:**
```
Card padding: 8px
Header: 28px (icon + name + count)
Visual stacks: 20px
Controls: ~100px (3 rows of buttons)
Total: ~156px (fits within 164px)
```

### Spacing Scale (Tailwind-inspired):**
```css
--spacing-1: 0.25rem; /* 4px */
--spacing-2: 0.5rem;  /* 8px */
--spacing-3: 0.75rem; /* 12px */
--spacing-4: 1rem;    /* 16px */
--spacing-5: 1.25rem; /* 20px */
--spacing-6: 1.5rem;  /* 24px */
```

## Reusable Components

### Existing Code to Leverage

**State Management Pattern:**
- `initializeState()`: Creates fresh state structure
- `saveState()`: Persists to localStorage
- `loadState()`: Retrieves from localStorage
- State structure: `{ [category]: { [resource]: count } }`

**UI Rendering Pattern:**
- `renderUI()`: Main rendering orchestrator
- `createResourceCard(category, resource)`: Card factory function
- `getCategoryTotal(category)`: Calculates category totals
- `getRemainderClass(remainder)`: Color coding logic (preserved as-is)

**Modal Management:**
- `showEditModal(category, resource)`: Opens edit dialog
- `hideEditModal()`: Closes edit dialog
- `saveEditedValue()`: Processes edited values
- Modal keyboard handlers: Enter (save), Escape (close), click outside (close)

**CSV Operations:**
- `exportCSV()`: Generates Excel-compatible CSV format
- `importCSV(file)`: Parses and validates CSV import

**Event Handling:**
- Tab switching: `switchTab(category)`
- Resource updates: `updateResource(category, resource, action, value)`
- All event listeners established in DOMContentLoaded

**Service Worker Pattern:**
- Cache-first strategy with offline fallback
- Cache name versioning for updates
- Pre-caching of all app resources
- Skip waiting and immediate claim on activation

### New Components Required

**RPG-Style Resource Card Frame:**
- Ornate border design using CSS (cannot reuse existing simple border)
- Class-themed gradient backgrounds
- Glow effects using box-shadow
- Reason: Current cards use plain borders and solid backgrounds

**Resource Icon System:**
- 32 themed icons (8 per character class)
- Icon font integration (Game Icons, Font Awesome, Material Icons)
- Fallback to custom SVG if specific icons unavailable
- Reason: Current implementation has no iconography

**Character Class Emblems:**
- 4 class emblems for tab buttons
- SVG or icon font based
- Reason: Current tabs are text-only

**Animation System:**
- CSS keyframe animations for various effects
- Transition utilities
- Fantasy-themed particle effects (sparkles, glows)
- Reason: Current app has minimal animations (only scale on button active)

**Tailwind CSS Integration:**
- CDN-based Tailwind CSS (no build process)
- Custom configuration via CDN URL parameters or inline config
- Integration with existing CSS custom properties
- Reason: No CSS framework currently in use

## Technical Approach

### Tailwind CSS Integration Strategy

**Implementation Method:**
Use Tailwind CSS via CDN (Play CDN) to maintain no-build-process requirement.

**Integration Steps:**
1. Add Tailwind CDN script to `<head>` in index.html:
```html
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          'rogue': '#FFD700',
          'mage': '#8A2BE2',
          'healer': '#1E90FF',
          'warrior': '#DC143C',
        },
        fontFamily: {
          'fantasy': ['Cinzel', 'serif'],
        }
      }
    }
  }
</script>
```

2. Keep existing `styles.css` for:
   - CSS custom properties (color system)
   - Complex animations (keyframes)
   - Component-specific styling
   - PWA-specific styles

3. Use Tailwind classes for:
   - Layout utilities (flex, grid)
   - Spacing utilities (p-*, m-*)
   - Responsive utilities
   - Transition utilities

**Hybrid Approach:**
- Existing `styles.css` remains primary stylesheet
- Tailwind provides utility layer on top
- CSS custom properties bridge both systems
- No conflict between methodologies

### Icon Libraries Integration

**Primary Icon Sources (CDN-based):**

1. **Game Icons (game-icons.net):**
```html
<!-- No direct CDN, use Font Awesome or Material Icons as primary -->
```

2. **Font Awesome 6 (Free):**
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

3. **Material Icons:**
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
```

4. **RPG Awesome (specialized RPG icons):**
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/rpg-awesome/0.2.0/css/rpg-awesome.min.css">
```

**Fallback Strategy:**
For icons not available in libraries, create inline SVG sprites:
```html
<svg style="display:none">
  <symbol id="icon-grappling-hook" viewBox="0 0 24 24">
    <!-- SVG path data -->
  </symbol>
</svg>
```

### Resource Icon Mapping

**Schlitzohr/Rogue (8 resources):**
```javascript
const rogueIcons = {
  'Enterhaken': 'ra ra-grappling-hook', // RPG Awesome
  'Seil': 'fas fa-rope', // Font Awesome (or custom SVG)
  'Handschuhe': 'fas fa-mitten', // Font Awesome
  'Dietrich': 'fas fa-key', // Font Awesome
  'Truhe': 'fas fa-treasure-chest', // Font Awesome
  'Messer': 'ra ra-dagger', // RPG Awesome
  'Schloss': 'fas fa-lock', // Font Awesome
  'Umhang': 'ra ra-cape', // RPG Awesome or Material Icon
};
```

**Gelehrter/Magier/Mage (8 resources):**
```javascript
const mageIcons = {
  'Tinte': 'fas fa-ink-bottle', // Font Awesome (or fas fa-flask)
  'Verzauberung': 'ra ra-magic-swirl', // RPG Awesome
  'Zauberhut': 'ra ra-wizard-hat', // RPG Awesome
  'Feder': 'fas fa-feather', // Font Awesome
  'Bücher': 'fas fa-book-open-reader', // Font Awesome
  'Zauberstab': 'ra ra-crystal-wand', // RPG Awesome
  'Pergament': 'fas fa-scroll', // Font Awesome
  'Amulet': 'ra ra-amulet', // RPG Awesome
};
```

**Wundpfleger/Heiler/Healer (8 resources):**
```javascript
const healerIcons = {
  'Schere': 'fas fa-scissors', // Font Awesome
  'Bandage': 'fas fa-bandage', // Font Awesome
  'Zutaten': 'ra ra-herbs', // RPG Awesome
  'Nadel': 'fas fa-syringe', // Font Awesome
  'Tränke': 'ra ra-potion', // RPG Awesome
  'Wundhaken': 'fas fa-hook', // Font Awesome (or custom SVG)
  'Skalpell': 'fas fa-scalpel', // Font Awesome
  'Mörser': 'ra ra-mortar-pestle', // RPG Awesome
};
```

**Knappe/Krieger/Warrior (8 resources):**
```javascript
const warriorIcons = {
  'Axt': 'ra ra-axe', // RPG Awesome
  'Helm': 'ra ra-helmet', // RPG Awesome
  'Rüstung': 'ra ra-heavy-armor', // RPG Awesome
  'Schleifstein': 'fas fa-whetstone', // Font Awesome (or Material Icon)
  'Kettenringe': 'ra ra-chain-mail', // RPG Awesome
  'Schwert': 'ra ra-sword', // RPG Awesome
  'Schild': 'ra ra-shield', // RPG Awesome
  'Trophäen': 'fas fa-trophy', // Font Awesome
};
```

**Implementation in createResourceCard():**
```javascript
// Add icon to card header
const iconContainer = document.createElement('div');
iconContainer.className = 'resource-icon';
iconContainer.innerHTML = `<i class="${getResourceIcon(category, resource)}"></i>`;
header.insertBefore(iconContainer, resourceName);
```

### Character Class Emblems

**Class Emblem Icons (for tabs):**
```javascript
const classEmblems = {
  'schlitzohr': 'ra ra-hood', // Rogue hood icon
  'gelehrter': 'ra ra-book', // Mage book icon
  'wundpfleger': 'fas fa-cross', // Healer cross icon
  'knappe': 'ra ra-crossed-swords', // Warrior swords icon
};
```

**Tab Button Enhancement:**
```html
<button class="tab-button active" data-category="schlitzohr">
  <i class="ra ra-hood"></i>
  <span>Schlitzohr (0)</span>
</button>
```

## Animation Specifications

### Animation Philosophy

**Timing and Easing:**
```css
/* Standard transitions */
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-bounce: 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Fantasy easing */
--ease-magic: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Keyframe Animations

**1. Resource Count Update Animation:**
```css
@keyframes countUpdate {
  0% {
    transform: scale(1);
    color: var(--text-primary);
  }
  50% {
    transform: scale(1.3);
    color: var(--class-primary);
    text-shadow: 0 0 10px var(--class-primary);
  }
  100% {
    transform: scale(1);
    color: var(--text-primary);
  }
}

.resource-count.updating {
  animation: countUpdate 400ms var(--ease-magic);
}
```

**2. Tab Switch Transition:**
```css
@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.resource-card {
  animation: fadeSlideIn 350ms var(--transition-base);
  animation-fill-mode: both;
}

.resource-card:nth-child(1) { animation-delay: 0ms; }
.resource-card:nth-child(2) { animation-delay: 50ms; }
.resource-card:nth-child(3) { animation-delay: 100ms; }
.resource-card:nth-child(4) { animation-delay: 150ms; }
.resource-card:nth-child(5) { animation-delay: 200ms; }
.resource-card:nth-child(6) { animation-delay: 250ms; }
.resource-card:nth-child(7) { animation-delay: 300ms; }
.resource-card:nth-child(8) { animation-delay: 350ms; }
```

**3. Button Press Animation:**
```css
@keyframes buttonPress {
  0% { transform: scale(1); }
  50% { transform: scale(0.92); }
  100% { transform: scale(1); }
}

.btn:active {
  animation: buttonPress 150ms ease-out;
}
```

**4. Magical Sparkle Effect:**
```css
@keyframes sparkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1) rotate(180deg);
  }
}

.sparkle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, var(--class-primary), transparent);
  border-radius: 50%;
  pointer-events: none;
  animation: sparkle 800ms ease-out forwards;
}
```

**5. Stack Pulse Animation:**
```css
@keyframes stackPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(76, 175, 80, 0);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 8px rgba(76, 175, 80, 0.6);
  }
}

.stack.new {
  animation: stackPulse 600ms ease-out;
}
```

**6. Modal Fade In:**
```css
@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal:not(.hidden) {
  animation: modalFadeIn 200ms ease-out;
}

.modal.hidden {
  animation: modalFadeOut 200ms ease-in;
}

@keyframes modalFadeOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.9);
  }
}
```

**7. Glow Pulse (Remainder Color Change):**
```css
@keyframes glowPulse {
  0%, 100% {
    box-shadow: 0 0 0 rgba(255, 255, 255, 0);
  }
  50% {
    box-shadow: 0 0 15px var(--remainder-color);
  }
}

.remainder.changed {
  animation: glowPulse 500ms ease-out;
}
```

### Animation Triggers

**JavaScript Animation Helpers:**
```javascript
// Add animation class and remove after completion
function animateElement(element, animationClass, duration = 400) {
  element.classList.add(animationClass);
  setTimeout(() => {
    element.classList.remove(animationClass);
  }, duration);
}

// Sparkle effect on count increase
function createSparkle(x, y, color) {
  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle';
  sparkle.style.left = `${x}px`;
  sparkle.style.top = `${y}px`;
  sparkle.style.setProperty('--class-primary', color);
  document.body.appendChild(sparkle);

  setTimeout(() => {
    sparkle.remove();
  }, 800);
}

// Updated updateResource function with animations
function updateResource(category, resource, action, value) {
  const previousCount = state[category][resource];

  if (action === 'add') {
    state[category][resource] += value;
  } else if (action === 'subtract') {
    state[category][resource] = Math.max(0, state[category][resource] - value);
  } else if (action === 'set') {
    state[category][resource] = Math.max(0, value);
  }

  const newCount = state[category][resource];

  saveState();
  renderUI();

  // Animate the count change
  const countElement = document.querySelector(
    `.resource-card[data-resource="${resource}"] .resource-count`
  );
  if (countElement) {
    animateElement(countElement, 'updating', 400);
  }

  // Create sparkles for increases
  if (newCount > previousCount && countElement) {
    const rect = countElement.getBoundingClientRect();
    const color = getClassColor(category);
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        createSparkle(
          rect.left + Math.random() * rect.width,
          rect.top + Math.random() * rect.height,
          color
        );
      }, i * 100);
    }
  }
}
```

### Transition Utilities

**CSS Transition Classes:**
```css
.transition-all {
  transition: all var(--transition-base);
}

.transition-colors {
  transition: background-color var(--transition-fast),
              border-color var(--transition-fast),
              color var(--transition-fast);
}

.transition-transform {
  transition: transform var(--transition-base);
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.hover-glow:hover {
  box-shadow: 0 0 15px var(--class-primary);
}
```

## Component Specifications

### Enhanced Resource Card

**HTML Structure:**
```html
<div class="resource-card" data-category="schlitzohr" data-resource="Enterhaken">
  <div class="card-ornate-border"></div>

  <div class="card-header">
    <div class="resource-icon">
      <i class="ra ra-grappling-hook"></i>
    </div>
    <span class="resource-name">Enterhaken</span>
    <span class="resource-count">15</span>
  </div>

  <div class="stacks-display">
    <div class="stack"></div>
    <div class="remainder remainder-5-7">5</div>
  </div>

  <div class="controls">
    <div class="buttons-row">
      <button class="btn btn-inc">+1</button>
      <button class="btn btn-inc">+5</button>
      <button class="btn btn-inc">+10</button>
    </div>
    <div class="buttons-row">
      <button class="btn btn-dec">-1</button>
      <button class="btn btn-dec">-5</button>
      <button class="btn btn-dec">-10</button>
    </div>
    <button class="edit-btn">Edit</button>
  </div>
</div>
```

**CSS Styling:**
```css
.resource-card {
  position: relative;
  background: var(--card-bg);
  border: 2px solid var(--card-border);
  border-radius: 8px;
  padding: 8px;
  box-shadow: var(--shadow-md), inset 0 0 30px rgba(0, 0, 0, 0.3);
  transition: all var(--transition-base);
  overflow: hidden;
}

/* Ornate border effect */
.card-ornate-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 3px;
  background: linear-gradient(45deg, var(--class-primary), transparent, var(--class-secondary))
              border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box,
                linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0.6;
}

/* Class-specific card backgrounds */
.resource-card[data-category="schlitzohr"] {
  border-color: var(--rogue-primary);
}
.resource-card[data-category="schlitzohr"]:hover {
  box-shadow: var(--shadow-md), var(--rogue-glow);
}

.resource-card[data-category="gelehrter"] {
  border-color: var(--mage-primary);
}
.resource-card[data-category="gelehrter"]:hover {
  box-shadow: var(--shadow-md), var(--mage-glow);
}

.resource-card[data-category="wundpfleger"] {
  border-color: var(--healer-primary);
}
.resource-card[data-category="wundpfleger"]:hover {
  box-shadow: var(--shadow-md), var(--healer-glow);
}

.resource-card[data-category="knappe"] {
  border-color: var(--warrior-primary);
}
.resource-card[data-category="knappe"]:hover {
  box-shadow: var(--shadow-md), var(--warrior-glow);
}

/* Card header with icon */
.card-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  height: 28px;
}

.resource-icon {
  font-size: 1.2rem;
  color: var(--class-primary);
  filter: drop-shadow(0 0 4px var(--class-primary));
  width: 24px;
  text-align: center;
}

.resource-name {
  flex: 1;
  font-weight: bold;
  font-size: 0.85rem;
  color: var(--text-primary);
}

.resource-count {
  font-weight: bold;
  font-size: 1rem;
  color: var(--class-primary);
  text-shadow: 0 0 8px var(--class-primary);
  min-width: 30px;
  text-align: right;
}
```

### Enhanced Tab Buttons

**HTML Structure:**
```html
<button class="tab-button active" data-category="schlitzohr">
  <div class="tab-emblem">
    <i class="ra ra-hood"></i>
  </div>
  <span class="tab-text">Schlitzohr (15)</span>
</button>
```

**CSS Styling:**
```css
.tab-button {
  flex: 1;
  padding: 6px 4px;
  background: var(--tab-inactive);
  border: none;
  border-bottom: 4px solid transparent;
  cursor: pointer;
  font-weight: bold;
  transition: all var(--transition-base);
  font-size: 0.75rem;
  height: 100%;
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.tab-emblem {
  font-size: 1rem;
  opacity: 0.6;
  transition: all var(--transition-base);
}

.tab-button.active .tab-emblem {
  opacity: 1;
  transform: scale(1.1);
  filter: drop-shadow(0 0 4px var(--class-primary));
}

.tab-text {
  font-size: 0.7rem;
  line-height: 1;
}

.tab-button.active {
  background: var(--card-bg);
  color: var(--text-primary);
}

.tab-button[data-category="schlitzohr"].active {
  border-bottom-color: var(--rogue-primary);
}
.tab-button[data-category="schlitzohr"].active .tab-emblem {
  color: var(--rogue-primary);
}

.tab-button[data-category="gelehrter"].active {
  border-bottom-color: var(--mage-primary);
}
.tab-button[data-category="gelehrter"].active .tab-emblem {
  color: var(--mage-primary);
}

.tab-button[data-category="wundpfleger"].active {
  border-bottom-color: var(--healer-primary);
}
.tab-button[data-category="wundpfleger"].active .tab-emblem {
  color: var(--healer-primary);
}

.tab-button[data-category="knappe"].active {
  border-bottom-color: var(--warrior-primary);
}
.tab-button[data-category="knappe"].active .tab-emblem {
  color: var(--warrior-primary);
}
```

### Enhanced Modal

**CSS Styling:**
```css
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.95) 100%);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background: linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%);
  padding: 20px;
  border-radius: 12px;
  width: 85%;
  max-width: 300px;
  position: relative;
  border: 2px solid var(--class-primary);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6),
              0 0 40px var(--class-primary);
}

.modal-content::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, var(--class-primary), transparent, var(--class-secondary));
  border-radius: 12px;
  z-index: -1;
  opacity: 0.3;
}

.close-modal {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-primary);
  transition: all var(--transition-fast);
}

.close-modal:hover {
  color: var(--class-primary);
  transform: rotate(90deg);
  text-shadow: 0 0 10px var(--class-primary);
}

#edit-resource-name {
  font-size: 1.1rem;
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 12px;
  color: var(--class-primary);
  text-align: center;
  text-shadow: 0 0 8px var(--class-primary);
}

.edit-form input {
  flex: 1;
  padding: 10px;
  border: 2px solid var(--card-border);
  border-radius: 6px;
  font-size: 1rem;
  background: linear-gradient(145deg, #1a1a1a, #242424);
  color: var(--text-primary);
  text-align: center;
  font-weight: bold;
  transition: all var(--transition-base);
}

.edit-form input:focus {
  outline: none;
  border-color: var(--class-primary);
  box-shadow: 0 0 12px var(--class-primary);
}

.edit-form button {
  background: linear-gradient(145deg, var(--class-primary), var(--class-secondary));
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
  transition: all var(--transition-base);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.edit-form button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4),
              0 0 15px var(--class-primary);
}

.edit-form button:active {
  transform: translateY(0);
}
```

### Enhanced Buttons

**CSS Styling:**
```css
.btn {
  padding: 0;
  min-width: 32px;
  height: 32px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.75rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: white;
  margin: 2px;
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.3s, height 0.3s;
}

.btn:active::before {
  width: 100%;
  height: 100%;
}

.btn-inc {
  background: linear-gradient(145deg, #4CAF50, #45a049);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.btn-inc:hover {
  background: linear-gradient(145deg, #5CBF60, #4CAF50);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4), 0 0 10px rgba(76, 175, 80, 0.4);
}

.btn-dec {
  background: linear-gradient(145deg, #F44336, #e53935);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.btn-dec:hover {
  background: linear-gradient(145deg, #FF5346, #F44336);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4), 0 0 10px rgba(244, 67, 54, 0.4);
}

.edit-btn {
  background: linear-gradient(145deg, #2196F3, #1976D2);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.8rem;
  height: 32px;
  padding: 0 10px;
  margin: 4px 2px 0 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: all var(--transition-fast);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.edit-btn:hover {
  background: linear-gradient(145deg, #31A6FF, #2196F3);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4), 0 0 10px rgba(33, 150, 243, 0.4);
  transform: translateY(-1px);
}

.edit-btn:active {
  transform: translateY(0);
}
```

## PWA Considerations

### Service Worker Cache Updates

**Update Required Files:**
```javascript
// sw.js - Update cache version
const CACHE_NAME = 'goblinstadt-cache-v4'; // Increment from v3

const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/styles.css',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  // Add new CDN resources
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/rpg-awesome/0.2.0/css/rpg-awesome.min.css',
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap'
];
```

**Cache Strategy:**
- Keep cache-first strategy for core app files
- Add network-first with cache fallback for CDN resources
- Implement stale-while-revalidate for icon fonts

**Updated Service Worker Logic:**
```javascript
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // CDN resources: network-first with cache fallback
  if (url.origin !== location.origin) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // App resources: cache-first (existing behavior)
  event.respondWith(
    caches.match(request)
      .then(response => response || fetch(request))
  );
});
```

### Manifest Updates

**Update manifest.json for new theme colors:**
```json
{
  "name": "Goblinstadt Ressourcen Manager",
  "short_name": "Goblinstadt",
  "description": "RPG Resource Manager für Goblinstadt",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#1a1a1a",
  "orientation": "portrait",
  "icons": [
    {
      "src": "icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### Offline Functionality Testing

**Verification Steps:**
1. Load app online to cache all resources
2. Go offline (airplane mode or DevTools)
3. Verify all features work:
   - Tab switching
   - Resource updates
   - Visual animations (CSS-based)
   - localStorage persistence
   - CSV export (download still works)
   - Modal interactions
4. Verify CSS and icon fonts render from cache
5. Verify no console errors for missing resources

## Testing Criteria

### Visual Design Testing

**Layout & Responsiveness:**
- [ ] All 8 resources fit on iPhone 16 Pro Max portrait (430×932px) without scrolling
- [ ] Resource cards display correctly in 2-column grid
- [ ] All 4 character class tabs display with emblems and totals
- [ ] Landscape mode displays 4-column grid correctly
- [ ] Footer buttons (Reset, Export, Import) remain accessible
- [ ] Touch targets maintain minimum 32px size

**Theming:**
- [ ] Each character class displays correct theme colors (Gold/Rogue, Purple/Mage, Blue/Healer, Red/Warrior)
- [ ] Active tab shows class-colored border and emblem glow
- [ ] Resource cards show class-colored borders and hover glows
- [ ] Modal dialog shows class-colored borders and effects

**Icons:**
- [ ] All 32 resource icons display correctly
- [ ] All 4 class emblems display in tabs
- [ ] Icons use correct color and glow effects
- [ ] Fallback icons work if CDN unavailable (offline mode)

**Dark Mode:**
- [ ] Enhanced dark mode gradients render correctly
- [ ] Text remains readable with sufficient contrast (WCAG AA: 4.5:1)
- [ ] Shadows and glows enhance depth without obscuring content
- [ ] Color-coded remainders (red/yellow/green) remain visible

### Animation Testing

**Performance:**
- [ ] All animations maintain 60fps (use Chrome DevTools Performance tab)
- [ ] Resource count updates animate smoothly
- [ ] Tab switching shows staggered fade-in of cards
- [ ] Button presses show immediate visual feedback
- [ ] Modal open/close animations are smooth
- [ ] Sparkle effects don't cause jank or lag

**Interactions:**
- [ ] Count update triggers number scale animation and sparkles
- [ ] Adding resources creates 3 sparkle particles
- [ ] Tab switch triggers card fade-in with stagger delays
- [ ] Button hover shows glow effect
- [ ] Button active shows press animation
- [ ] Modal close button rotates on hover
- [ ] Stack additions trigger pulse animation

**Touch Responsiveness:**
- [ ] Button taps register immediately (no animation blocking)
- [ ] Double-tap zoom remains disabled (`touch-action: manipulation`)
- [ ] No lag between tap and visual feedback
- [ ] Animations don't interfere with rapid interactions

### Functional Testing (Regression)

**State Management:**
- [ ] Resources increment correctly (+1, +5, +10)
- [ ] Resources decrement correctly (-1, -5, -10)
- [ ] Resources cannot go below 0
- [ ] Edit modal allows direct value input
- [ ] State persists to localStorage after each change
- [ ] Active tab persists across page reloads
- [ ] Tab totals calculate correctly

**CSV Operations:**
- [ ] Export generates correct Excel-compatible format
- [ ] Export includes all 32 resources with counts
- [ ] Export includes totals row with grand total
- [ ] Import parses CSV correctly
- [ ] Import validates resource names
- [ ] Import shows confirmation message
- [ ] Import replaces state correctly

**PWA Features:**
- [ ] Service Worker registers successfully
- [ ] Offline mode works (all features functional)
- [ ] Online/offline status indicator updates correctly
- [ ] Home screen installation prompt appears (Android Chrome)
- [ ] App installs to home screen successfully
- [ ] Installed app launches in standalone mode
- [ ] Cache includes all new CDN resources

**Modal Interactions:**
- [ ] Modal opens on Edit button click
- [ ] Modal focuses input and selects value
- [ ] Enter key saves and closes modal
- [ ] Escape key closes modal without saving
- [ ] X button closes modal without saving
- [ ] Click outside modal closes without saving
- [ ] Modal animations play on open/close

### Browser Testing

**iOS Safari (Primary):**
- [ ] App displays correctly on iPhone 16 Pro Max
- [ ] All animations work smoothly
- [ ] Touch interactions are responsive
- [ ] No zoom on double-tap
- [ ] Home screen installation works
- [ ] Offline mode functional

**Android Chrome (Secondary):**
- [ ] App displays correctly on various Android devices
- [ ] All animations work smoothly
- [ ] Install prompt appears
- [ ] Offline mode functional

**Desktop Browsers (Tertiary):**
- [ ] App displays correctly in Chrome desktop
- [ ] App displays correctly in Firefox desktop
- [ ] App displays correctly in Safari desktop
- [ ] Mouse interactions work (hover effects)

### Accessibility Testing

**Keyboard Navigation:**
- [ ] Tab key navigates through all interactive elements
- [ ] Enter/Space activates buttons
- [ ] Focus indicators are visible
- [ ] Modal traps focus correctly

**Screen Reader Testing:**
- [ ] Semantic HTML elements used correctly
- [ ] ARIA labels present where needed
- [ ] Resource counts announced correctly
- [ ] Tab switches announced correctly
- [ ] Button actions clearly described

**Color Contrast:**
- [ ] All text meets WCAG AA contrast ratio (4.5:1)
- [ ] Remainder colors remain distinguishable
- [ ] Class theme colors provide sufficient contrast
- [ ] Icon colors are visible against backgrounds

## Success Metrics

### Visual Appeal Metrics

**Subjective Assessment (User Feedback):**
- App appears modern and visually appealing
- RPG/fantasy theme is evident and cohesive
- Character classes are clearly distinguishable
- Resource cards are attractive and easy to read
- Animations enhance the experience (not distracting)
- Overall "gameification" goal achieved

**Objective Measures:**
- All 32 resource icons display correctly
- All 4 class emblems present and visible
- Class-themed colors applied to all relevant components
- Ornate card borders render on all resource cards
- Animations play on all specified interactions

### Technical Performance Metrics

**Performance:**
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.0s
- Animation frame rate: consistently 60fps
- No JavaScript errors in console
- All CDN resources load successfully

**Functionality Preservation:**
- 100% of existing features work identically
- localStorage read/write successful
- CSV import/export produces identical results
- Service Worker caches all resources
- Offline mode fully functional

### Code Quality Metrics

**Architecture:**
- Vanilla JavaScript architecture maintained (no frameworks)
- No build process required (static web app)
- All existing function signatures preserved
- State management pattern unchanged
- Event handling pattern unchanged

**Maintainability:**
- CSS organized with clear comments
- Animation keyframes documented
- Icon mappings clearly defined
- Tailwind classes used consistently
- German comments and variable names maintained

## Implementation Phases

### Phase 1: Foundation Setup (No Visual Changes)

**Tasks:**
1. Add Tailwind CSS CDN to `index.html` `<head>`
2. Add icon library CDNs (Font Awesome, RPG Awesome, Material Icons)
3. Add Google Fonts CDN for fantasy typography (Cinzel)
4. Update Service Worker cache version to v4
5. Add new CDN URLs to Service Worker cache list
6. Test that app still works identically with new resources loaded

**Deliverables:**
- Updated `index.html` with CDN links
- Updated `sw.js` with new cache version and URLs
- Verification that offline mode still works

**Testing:**
- Load app online
- Go offline
- Verify all CDN resources cached
- Verify app functionality unchanged

### Phase 2: Enhanced CSS System

**Tasks:**
1. Add new CSS custom properties for theme colors, shadows, transitions
2. Create character class theme color variables
3. Add animation keyframes to `styles.css`
4. Add transition utility classes
5. Update existing components to use new variables
6. Test color system with all 4 character classes

**Deliverables:**
- Enhanced `:root` CSS variables
- `.dark-mode` class with full theme
- Animation `@keyframes` definitions
- Utility classes for transitions

**Testing:**
- Verify colors render correctly for each class
- Check contrast ratios for accessibility
- Test animations play smoothly
- Verify no visual regressions

### Phase 3: Resource Card Redesign

**Tasks:**
1. Add icon mapping object to `app.js`
2. Update `createResourceCard()` function to include icons
3. Add ornate border element to card structure
4. Apply class-themed styling to cards
5. Update card layout for optimized spacing
6. Add data attributes for category and resource
7. Adjust card dimensions to fit 8 cards on screen
8. Test all 32 resource cards render correctly

**Deliverables:**
- Icon mapping for all 32 resources
- Updated `createResourceCard()` function
- Enhanced `.resource-card` CSS
- Class-specific card styling

**Testing:**
- Verify all 8 cards fit on iPhone 16 Pro Max portrait
- Check all 32 icons display correctly
- Test ornate borders render on all cards
- Verify class colors apply correctly

### Phase 4: Tab Enhancement

**Tasks:**
1. Add class emblem icons to tab buttons
2. Update tab button HTML structure
3. Apply class-themed styling to active tabs
4. Update `renderUI()` to maintain emblem rendering
5. Test tab switching preserves emblems and totals

**Deliverables:**
- Class emblem mapping
- Enhanced tab button HTML
- Updated `.tab-button` CSS
- Active tab styling with emblems

**Testing:**
- Verify emblems display in all tabs
- Check active tab styling with class colors
- Test tab switching maintains correct state
- Verify totals still display correctly

### Phase 5: Animation Implementation

**Tasks:**
1. Add animation helper functions to `app.js`
2. Update `updateResource()` to trigger count animations
3. Add sparkle effect creation function
4. Implement tab switch card stagger animation
5. Add button press animations
6. Implement modal fade animations
7. Add stack pulse animation for new stacks
8. Test all animations for performance

**Deliverables:**
- `animateElement()` helper function
- `createSparkle()` effect function
- `getClassColor()` utility function
- Updated `updateResource()` with animations
- Updated `renderUI()` with stagger delays

**Testing:**
- Verify animations maintain 60fps
- Check sparkles appear on resource increases
- Test tab switch stagger effect
- Verify button animations on all interactions
- Test modal animations on open/close

### Phase 6: Modal Enhancement

**Tasks:**
1. Update modal HTML structure (already minimal)
2. Apply enhanced modal styling with class-themed borders
3. Add modal fade-in/fade-out animations
4. Update close button with rotation effect
5. Test modal interactions with new styling

**Deliverables:**
- Enhanced `.modal` and `.modal-content` CSS
- Modal animation styles
- Dynamic class color application to modal

**Testing:**
- Verify modal displays with correct class colors
- Check modal animations play smoothly
- Test all close methods (X, Enter, Escape, outside click)
- Verify input focus and selection still work

### Phase 7: Button and Control Enhancements

**Tasks:**
1. Apply gradient backgrounds to all buttons
2. Add hover glow effects
3. Implement ripple effect on button press
4. Update button dimensions for optimized layout
5. Test button interactions on touch and mouse

**Deliverables:**
- Enhanced `.btn`, `.btn-inc`, `.btn-dec` CSS
- Updated `.edit-btn` CSS
- Ripple effect animation

**Testing:**
- Verify button hover effects on desktop
- Check button press animations on touch
- Test buttons remain accessible (32px minimum)
- Verify ripple effect doesn't block interactions

### Phase 8: Layout Optimization

**Tasks:**
1. Adjust header height if needed
2. Optimize tab height for emblems
3. Calculate and adjust card dimensions
4. Test grid layout fits 8 cards without scrolling
5. Verify footer remains accessible
6. Test landscape mode layout
7. Test responsive behavior on various devices

**Deliverables:**
- Optimized layout dimensions
- Updated media queries
- Verified grid calculations

**Testing:**
- Load app on iPhone 16 Pro Max portrait
- Verify all 8 resources visible without scrolling
- Test landscape mode shows 4 columns
- Check footer buttons remain accessible
- Test on various screen sizes

### Phase 9: Integration Testing

**Tasks:**
1. Test all features end-to-end
2. Verify PWA functionality (offline, install)
3. Test CSV import/export with new styling
4. Verify localStorage persistence
5. Test all animations together
6. Check performance metrics
7. Test on all target browsers
8. Conduct accessibility testing

**Deliverables:**
- Full integration test results
- Performance benchmark data
- Browser compatibility report
- Accessibility audit results

**Testing:**
- Execute full test suite from Testing Criteria section
- Measure performance metrics
- Test on physical devices
- Verify no regressions in functionality

### Phase 10: Final Polish and Documentation

**Tasks:**
1. Fine-tune animation timings based on feedback
2. Adjust colors for optimal contrast
3. Optimize performance if needed
4. Add code comments for new functionality
5. Update CLAUDE.md with new implementation details
6. Create deployment checklist

**Deliverables:**
- Polished, production-ready app
- Updated documentation
- Deployment instructions
- Performance optimization notes

**Testing:**
- Final visual review
- Final performance check
- Final functionality verification
- Final accessibility check

## Out of Scope

**Features Explicitly Excluded:**
- Framework migration (React, Vue, Angular, Svelte)
- Build process implementation (webpack, Vite, Parcel)
- Advanced UX patterns (swipe gestures, pull-to-refresh)
- Haptic feedback via Vibration API
- Sound effects or audio feedback
- Achievement system or gamification mechanics
- Progression/leveling systems
- Multi-language support or internationalization (i18n)
- Backend integration or API connections
- User accounts or authentication
- Cloud synchronization
- Data analytics or tracking
- A/B testing infrastructure
- Push notifications
- Sharing functionality
- Leaderboards or social features

**Technology Changes Excluded:**
- Server-side rendering
- Static site generation
- Database integration
- State management libraries (Redux, Vuex, Zustand)
- Testing framework additions
- Linting or formatting tool changes
- TypeScript migration
- Module bundling

**Design Changes Excluded:**
- Light mode theme
- Custom fonts beyond Google Fonts
- Animated backgrounds
- Video elements
- 3D graphics or WebGL effects
- Complex particle systems beyond sparkles
- Custom icon illustrations (use icon fonts)
- Logo design or branding assets

## Success Criteria Summary

**Visual Success:**
1. App has modern, RPG-themed aesthetic that feels game-like
2. All 4 character classes have distinct visual theming
3. All 32 resources have appropriate themed icons
4. Ornate card borders and gradients enhance visual richness
5. Dark mode is visually sophisticated with depth and atmosphere

**Technical Success:**
1. All existing functionality works identically (zero regressions)
2. Vanilla JavaScript architecture preserved (no frameworks)
3. No build process required (static web app)
4. Offline PWA functionality maintained
5. Service Worker caches all new resources correctly

**Performance Success:**
1. Animations maintain 60fps consistently
2. Touch interactions remain immediately responsive
3. Page load time does not increase significantly
4. No console errors for missing resources or errors

**User Experience Success:**
1. All 8 resources fit on iPhone 16 Pro Max portrait without scrolling
2. Touch targets remain minimum 32px for accessibility
3. Animations enhance experience without being distracting
4. Character class theming aids quick visual recognition
5. No learning curve for existing users (same interactions)

**Code Quality Success:**
1. Code remains maintainable and well-documented
2. German comments and variable names maintained
3. Existing function signatures preserved
4. CSS organized logically with clear structure
5. Icon mappings clearly documented

## Notes for Developers

**Development Workflow:**
1. Use local HTTP server for testing: `python -m http.server 8000`
2. Test on actual device via local network IP: `http://[YOUR_IP]:8000`
3. Use Chrome DevTools Device Mode for initial testing
4. Increment Service Worker cache version after CSS/asset changes
5. Force refresh (Ctrl+Shift+R) to bypass cache during development

**Key Implementation Details:**
- Always add `data-category` and `data-resource` attributes to resource cards for animation targeting
- Use `animateElement()` helper for consistent animation application
- Apply class-themed colors via CSS custom properties set dynamically
- Maintain existing event listener structure (all in DOMContentLoaded)
- Preserve German language for all UI text, comments, and variables

**Common Pitfalls to Avoid:**
- Don't use JavaScript animations where CSS animations suffice (better performance)
- Don't block rendering with animation logic (use requestAnimationFrame if needed)
- Don't forget to update Service Worker cache version after asset changes
- Don't remove or modify existing localStorage keys or structure
- Don't change CSV import/export format (must remain Excel-compatible)
- Don't add build process or compilation steps (static web app requirement)

**Performance Optimization Tips:**
- Use `will-change` CSS property sparingly for animated elements
- Prefer `transform` and `opacity` animations (GPU-accelerated)
- Use `contain: layout` on resource cards to limit reflow
- Debounce rapid animations if performance issues occur
- Test on lower-end devices to ensure smooth performance

**Accessibility Reminders:**
- Maintain semantic HTML structure
- Ensure all interactive elements are keyboard accessible
- Provide sufficient color contrast (WCAG AA: 4.5:1)
- Test with actual screen readers (NVDA, JAWS, VoiceOver)
- Don't rely solely on color to convey information
- Ensure focus indicators are visible

**Browser-Specific Considerations:**
- iOS Safari: Test home screen installation and standalone mode
- Android Chrome: Test install prompt and manifest
- Desktop: Test mouse hover effects work correctly
- All browsers: Verify CDN resources load or fail gracefully offline

**File Organization:**
- Keep `index.html` minimal (structure and CDN links)
- Keep `styles.css` for all custom styling (CSS variables, animations, components)
- Keep `app.js` for all JavaScript logic (no styling logic)
- Keep `sw.js` separate for Service Worker logic
- Update `manifest.json` only for PWA metadata

**Version Control:**
- Commit each phase separately for clear history
- Test thoroughly before committing
- Update Service Worker cache version in same commit as asset changes
- Document breaking changes in commit messages

**Testing on Physical Devices:**
- iPhone 16 Pro Max (primary target): Verify all 8 resources fit without scrolling
- Various Android devices: Test responsive layout
- Older devices: Check animation performance
- Low-end devices: Verify app remains usable

This specification provides a comprehensive guide for modernizing the Goblinstadt Resource Manager PWA while preserving all existing functionality and maintaining the vanilla JavaScript, no-build-process architecture.
