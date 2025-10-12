# Specification: Critical Bugfixes - Missing Icons and Disruptive Re-render

## Goal
Fix two critical bugs in the Goblinstadt Resource Manager that were discovered after the modernization project:
1. **Missing Icons**: 9 resources display no icons (showing blank spaces), breaking visual consistency and user experience
2. **Disruptive Re-render**: Clicking +/- buttons triggers a full page rebuild with 350ms animation, making simple increment/decrement actions feel slow and jarring

The solution must restore all missing icons with RPG-themed alternatives and implement selective DOM updates that provide instant feedback (<50ms) while preserving the smooth tab-switch animations and sparkle effects.

## User Stories
- As a player tracking Rogue resources, I want to see appropriate icons for Truhe, Messer, and Umhang so that I can quickly identify resources visually
- As a player tracking Mage resources, I want to see a wizard hat icon for Zauberhut so that it matches the RPG theme
- As a player tracking Healer resources, I want to see a mortar/pestle icon for Mörser and a thematic healing icon in the tab so that the interface feels cohesive
- As a player tracking Warrior resources, I want to see icons for Rüstung, Kettenringe, and Schleifstein so that all resources are equally recognizable
- As a user clicking +/- buttons, I want instant visual feedback without the entire screen flashing and re-animating so that resource tracking feels responsive
- As a user switching between character tabs, I want to keep the smooth fade-in animation so that navigation feels polished and intentional

## Core Requirements

### Functional Requirements

#### Bug 1: Missing Icons (9 Resources + 1 Tab Emblem)
1. **Replace invalid icon class names** in `resourceIcons` object (app.js lines 18-59)
2. **Fix all 9 resource icons**:
   - Truhe (Rogue): Replace `fas fa-treasure-chest` (invalid) with working alternative
   - Messer (Rogue): Replace `ra ra-dagger` (invalid) with `ra ra-plain-dagger`
   - Umhang (Rogue): Replace `ra ra-cape` (invalid) with thematic alternative
   - Zauberhut (Mage): Replace `ra ra-wizard-hat` (invalid) with `fas fa-hat-wizard`
   - Mörser (Healer): Replace `ra ra-mortar-pestle` (invalid) with Material Icons alternative
   - Rüstung (Warrior): Replace `ra ra-heavy-armor` (unverified) with verified alternative
   - Kettenringe (Warrior): Replace `ra ra-chain-mail` (invalid) with working alternative
   - Schleifstein (Warrior): Keep current `material-icons` but formalize the pattern
3. **Fix Heiler tab emblem**: Replace `fas fa-plus` with RPG-themed healing icon
4. **Verify all 32 resources** display visible icons across all four tabs
5. **Maintain icon rendering logic** for both Font Awesome/RPG Awesome (`<i>` tags) and Material Icons (`<span>` tags)

#### Bug 2: Disruptive Re-render on +/- Actions
1. **Create new selective update function** `updateResourceDisplay(category, resource)` that:
   - Updates only the count number (`.resource-count`)
   - Rebuilds only the stacks display (`.stacks-display`)
   - Updates only the remainder badge with correct color class
   - Updates only the relevant tab total
   - Does NOT call `renderUI()`
   - Does NOT clear or rebuild the entire card
2. **Modify `updateResource()` function** (app.js lines 148-186):
   - Replace `renderUI()` call with `updateResourceDisplay()` call
   - Remove `animateElement(countElement, 'updating', 400)` trigger
   - Keep sparkle effect creation for increments (lines 172-185)
3. **Preserve existing animations**:
   - Keep `fadeSlideIn` animation for tab switching (only when `renderUI()` is called)
   - Keep sparkle effects on resource increase
   - Remove count update animation (scale + glow) from +/- actions
4. **Performance target**: <50ms response time for increment/decrement operations

### Non-Functional Requirements
- **Visual Consistency**: All icons must be RPG-themed and semantically appropriate
- **Performance**: Instant visual feedback on +/- button clicks
- **Accessibility**: Icons must be recognizable and maintain class-colored glows
- **Backward Compatibility**: All existing functionality must continue working (CSV import/export, edit modal, reset, tab switching, localStorage persistence)
- **Code Maintainability**: Icon mapping pattern should be clear and extensible

## Visual Design

### Mockup Reference
Visual evidence of missing icons in:
- `planning/visuals/Screenshot 2025-10-12 155533.png` - Rogue tab showing Truhe, Messer, Umhang without icons
- `planning/visuals/Screenshot 2025-10-12 155611.png` - Mage tab showing Zauberhut without icon
- `planning/visuals/Screenshot 2025-10-12 155640.png` - Healer tab showing Mörser without icon, simple + in tab emblem
- `planning/visuals/Screenshot 2025-10-12 155720.png` - Warrior tab showing Rüstung, Schleifstein, Kettenringe without icons

### Key UI Elements
- Resource cards maintain current layout and styling
- Icons must display with class-colored glow effects (existing CSS lines 381-399)
- Remainder badges must update color correctly (red 0-4, yellow 5-7, green 8-9)
- Tab totals must update without visual disruption
- No visual changes to animations on tab switch

## Reusable Components

### Existing Code to Leverage
- **Icon rendering pattern** (app.js lines 268-272): Already handles Material Icons vs Font Awesome split
- **Stack display generation** (app.js lines 286-301): Logic for creating stacks + remainder
- **Remainder color calculation** (app.js lines 189-197): `getRemainderClass()` function
- **Category total calculation** (app.js lines 356-362): `getCategoryTotal()` function
- **Class color retrieval** (app.js lines 74-83): `getClassColor()` function for sparkles
- **Data attribute selectors**: Cards already have `data-category` and `data-resource` attributes for targeting

### New Components Required
- **Selective update function**: New function to update individual card elements without full rebuild
  - Required because current architecture calls `renderUI()` which clears entire container
  - Cannot reuse existing code as no partial update mechanism exists
- **Material Icons format standardization**: Pattern to store icon library + icon name (e.g., `material-icons:build`)
  - Required to make Material Icons handling consistent with Font Awesome/RPG Awesome

## Technical Approach

### Database
Not applicable - client-side only PWA with localStorage persistence

### API
Not applicable - no backend API

### Frontend

#### Icon Mapping Corrections (app.js lines 18-59)

**Recommended icon replacements** based on available libraries (Font Awesome 6.4.0, RPG Awesome 0.2.0, Material Icons):

```javascript
const resourceIcons = {
    schlitzohr: {
        'Enterhaken': 'ra ra-grappling-hook',     // Keep (working)
        'Seil': 'fas fa-link',                     // Keep (working)
        'Handschuhe': 'fas fa-mitten',             // Keep (working)
        'Dietrich': 'fas fa-key',                  // Keep (working)
        'Truhe': 'fas fa-box',                     // CHANGED from invalid fa-treasure-chest
        'Messer': 'ra ra-plain-dagger',            // CHANGED from invalid ra-dagger
        'Schloss': 'fas fa-lock',                  // Keep (working)
        'Umhang': 'fas fa-user-secret'             // CHANGED from invalid ra-cape (hooded figure)
    },
    gelehrter: {
        'Tinte': 'fas fa-flask',                   // Keep (working)
        'Verzauberung': 'ra ra-lightning-bolt',    // Keep (working)
        'Zauberhut': 'fas fa-hat-wizard',          // CHANGED from invalid ra-wizard-hat
        'Feder': 'fas fa-feather',                 // Keep (working)
        'Bücher': 'fas fa-book',                   // Keep (working)
        'Zauberstab': 'ra ra-crystal-wand',        // Keep (working)
        'Pergament': 'fas fa-scroll',              // Keep (working)
        'Amulet': 'ra ra-gem-pendant'              // Keep (working)
    },
    wundpfleger: {
        'Schere': 'fas fa-scissors',               // Keep (working)
        'Bandage': 'fas fa-bandage',               // Keep (working)
        'Zutaten': 'ra ra-leaf',                   // Keep (working)
        'Nadel': 'fas fa-syringe',                 // Keep (working)
        'Tränke': 'ra ra-potion',                  // Keep (working)
        'Wundhaken': 'fas fa-hand-holding-medical',// Keep (working)
        'Skalpell': 'fas fa-cut',                  // Keep (working)
        'Mörser': 'material-icons:science'         // CHANGED from invalid ra-mortar-pestle
    },
    knappe: {
        'Axt': 'ra ra-axe',                        // Keep (working)
        'Helm': 'ra ra-helmet',                    // Keep (working)
        'Rüstung': 'ra ra-vest',                   // CHANGED from unverified ra-heavy-armor
        'Schleifstein': 'material-icons:build',    // FORMALIZED (was just 'material-icons')
        'Kettenringe': 'material-icons:link',      // CHANGED from invalid ra-chain-mail
        'Schwert': 'ra ra-sword',                  // Keep (working)
        'Schild': 'ra ra-shield',                  // Keep (working)
        'Trophäen': 'fas fa-trophy'                // Keep (working)
    }
};
```

**Tab emblem fix** (app.js lines 62-67):
```javascript
const classEmblems = {
    schlitzohr: 'ra ra-hood',           // Keep (working)
    gelehrter: 'ra ra-book',            // Keep (working)
    wundpfleger: 'ra ra-potion',        // CHANGED from 'fas fa-plus' (more RPG-themed)
    knappe: 'ra ra-crossed-swords'      // Keep (working)
};
```

#### Icon Rendering Enhancement (app.js lines 268-272)

Update to handle `material-icons:iconname` format:

```javascript
const iconClass = getResourceIcon(category, resource);

// Handle material icons format (library:iconname)
if (iconClass.startsWith('material-icons:')) {
    const iconName = iconClass.split(':')[1];
    iconContainer.innerHTML = `<span class="material-icons">${iconName}</span>`;
} else {
    iconContainer.innerHTML = `<i class="${iconClass}"></i>`;
}
```

#### Selective Update Function (new, insert after line 401)

```javascript
/**
 * Selective update function - updates only one resource card without full re-render
 * This provides instant feedback for +/- actions without disruptive animations
 *
 * @param {string} category - Resource category (schlitzohr, gelehrter, wundpfleger, knappe)
 * @param {string} resource - Resource name
 */
function updateResourceDisplay(category, resource) {
    const count = state[category][resource];
    const card = document.querySelector(`.resource-card[data-resource="${resource}"]`);

    if (!card) return; // Card not in current view

    // Update count display
    const countElement = card.querySelector('.resource-count');
    if (countElement) {
        countElement.textContent = count;
    }

    // Update stacks display (rebuild this section only)
    const stacksDisplay = card.querySelector('.stacks-display');
    if (stacksDisplay) {
        const stacks = Math.floor(count / 10);
        const remainder = count % 10;

        stacksDisplay.innerHTML = '';

        // Add completed stacks (each stack = 10 items)
        for (let i = 0; i < stacks; i++) {
            const stack = document.createElement('div');
            stack.className = 'stack';
            stacksDisplay.appendChild(stack);
        }

        // Add remainder badge with color coding
        const remainderElement = document.createElement('div');
        remainderElement.className = `remainder ${getRemainderClass(remainder)}`;
        remainderElement.textContent = remainder;
        stacksDisplay.appendChild(remainderElement);
    }

    // Update tab total for this category
    const categoryTotal = getCategoryTotal(category);
    const tabButton = document.querySelector(`.tab-button[data-category="${category}"]`);
    if (tabButton) {
        const tabText = tabButton.querySelector('.tab-text');
        if (tabText) {
            tabText.textContent = `${categoryNames[category]} (${categoryTotal})`;
        }
    }
}
```

#### Modified updateResource() Function (app.js lines 148-186)

Replace `renderUI()` call and remove count animation:

```javascript
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

    // CHANGED: Use selective update instead of full renderUI()
    updateResourceDisplay(category, resource);

    // REMOVED: animateElement(countElement, 'updating', 400);
    // Reason: User feedback - this scale+glow animation is disruptive on every +/- click

    // Keep sparkle effects on increase (visual feedback without disruption)
    if (newCount > previousCount) {
        const countElement = document.querySelector(
            `.resource-card[data-resource="${resource}"] .resource-count`
        );
        if (countElement) {
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
}
```

### Testing

#### Icon Display Verification
1. Load app and verify all 32 resources show visible icons (no blank spaces)
2. Switch to each tab and visually confirm:
   - Rogue: Truhe (box icon), Messer (dagger icon), Umhang (hooded figure icon)
   - Mage: Zauberhut (wizard hat icon)
   - Healer: Mörser (science/flask icon), tab emblem shows potion icon
   - Warrior: Rüstung (vest icon), Kettenringe (chain link icon), Schleifstein (build icon)
3. Verify all icons maintain class-colored glow effects
4. Test dark mode to ensure icons remain visible

#### Performance Verification
1. Click +1/+5/+10 buttons and verify:
   - Count updates instantly (no delay)
   - Stack display updates instantly
   - Remainder badge updates with correct color
   - No full-page flash or fade-in animation
   - Tab total updates immediately
2. Click -1/-5/-10 buttons and verify same instant behavior
3. Verify sparkle effects still appear on increment
4. Measure response time using browser DevTools Performance tab (<50ms target)

#### Animation Preservation
1. Switch between tabs and verify fadeSlideIn animation still plays smoothly
2. Verify staggered card animation delays (350ms total) on tab switch
3. Verify sparkle effects on increment actions
4. Verify modal animations unchanged
5. Confirm count update animation does NOT play on +/- clicks

#### Regression Testing
1. Test edit modal functionality (opens, saves, closes)
2. Test CSV export (downloads file with correct format)
3. Test CSV import (reads file, updates UI correctly)
4. Test reset button (confirms, resets all to 0)
5. Test localStorage persistence (reload page, verify state preserved)
6. Test all four character tabs switch correctly
7. Test offline mode (Service Worker serves from cache)
8. Test landscape mode layout (4 columns)
9. Test portrait mode layout (2 columns)

## Out of Scope
- Adding new icon libraries beyond Font Awesome 6.4.0, RPG Awesome 0.2.0, Material Icons
- Redesigning icon visual styles or animations
- Changing animation timing for tab-switch effects
- Adding new animations beyond what exists
- Refactoring other parts of the codebase not related to these two bugs
- Performance optimizations beyond the selective update fix
- Adding icon customization features for users

## Success Criteria

### Measurable Outcomes
1. **Icon Coverage**: 32/32 resources display visible, appropriate icons (100% coverage)
2. **Performance**: +/- button response time measured at <50ms (currently ~350ms)
3. **Animation Accuracy**: Tab switch animation preserved, +/- actions have no animation delay
4. **Zero Regressions**: All existing features (CSV, edit, reset, persistence) function identically

### User Experience Goals
1. Users can visually identify all resources at a glance
2. Users perceive +/- actions as instant (no noticeable delay)
3. Users experience smooth, intentional tab switching (preserved animations)
4. Users see sparkle feedback on increments without disruption

## Implementation Phases

### Phase 1: Icon Mapping Corrections (Low Risk)
**Files**: `app.js` (lines 18-67)
**Changes**:
- Update 9 invalid icon class names in `resourceIcons` object
- Update Heiler tab emblem in `classEmblems` object
- Formalize Material Icons format (library:iconname pattern)

**Testing**: Visual verification of all 32 resource icons + 4 tab emblems

### Phase 2: Icon Rendering Enhancement (Low Risk)
**Files**: `app.js` (lines 268-272)
**Changes**:
- Update icon rendering logic to parse `material-icons:iconname` format
- Add conditional logic to split on `:` and extract icon name

**Testing**: Verify Material Icons render correctly (Mörser, Schleifstein, Kettenringe)

### Phase 3: Selective Update Function (Medium Risk)
**Files**: `app.js` (insert after line 401)
**Changes**:
- Create new `updateResourceDisplay()` function
- Implement DOM queries for card elements
- Implement stack rebuilding logic
- Implement tab total update logic

**Testing**: Verify function updates correct elements, does not cause side effects

### Phase 4: Modify updateResource() Function (Medium Risk)
**Files**: `app.js` (lines 148-186)
**Changes**:
- Replace `renderUI()` call with `updateResourceDisplay()` call
- Remove `animateElement(countElement, 'updating', 400)` line
- Preserve sparkle effect logic

**Testing**:
- Verify +/- buttons update displays instantly
- Verify no animations play on +/- clicks
- Verify sparkles still appear on increments
- Verify tab totals update correctly

### Phase 5: Comprehensive Regression Testing (Critical)
**Files**: All
**Testing**: Full test suite as documented in Testing Criteria section above

## Code Changes Summary

### Files Modified
- `app.js` - 4 sections modified, 1 new function added

### Specific Line Changes
1. **Lines 18-59**: Update `resourceIcons` object (9 icon class name changes)
2. **Lines 62-67**: Update `classEmblems` object (1 emblem change for wundpfleger)
3. **Lines 268-272**: Update icon rendering logic (handle material-icons:iconname format)
4. **Lines 148-186**: Modify `updateResource()` function (replace renderUI call, remove animation)
5. **After line 401**: Insert new `updateResourceDisplay()` function (~50 lines)

### No Changes Required
- `styles.css` - All animations stay as-is (just triggered differently)
- `index.html` - No changes needed
- `sw.js` - No changes needed
- `manifest.json` - No changes needed

### Testing Priority Order
1. Icon display verification (visual QA)
2. +/- button performance (DevTools measurement)
3. Animation behavior verification (tab switch vs +/- clicks)
4. Sparkle effects preservation
5. Full regression suite
