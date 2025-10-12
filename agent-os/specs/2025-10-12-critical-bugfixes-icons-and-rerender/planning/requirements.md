# Spec Requirements: Critical Bugfixes - Icons and Rerender

## Initial Description
Fix two critical issues with the recently implemented modernization:

1. **Missing Icons Problem**: Some resources do not have icons displaying. Every resource (all 32) must have a visible icon. Need to investigate which icons are missing and fix the icon mappings or fallbacks.

2. **Disruptive Re-render on +/- Actions**: When clicking +/- buttons to add/subtract resources, the entire page rebuilds with the same animation as tab switching. This is disruptive and slow. The +/- actions must be instant without full page re-render, while tab switching should keep its current animation.

## Requirements Discussion

### Bug 1: Missing Icons Investigation

**Q1:** Which resources are currently showing missing/incorrect icons?
**Answer:** User provided a complete list of 9 resources with icon issues:
1. Truhe (Rogue/Schlitzohr) - treasure chest icon missing
2. Messer (Rogue/Schlitzohr) - knife icon missing
3. Umhang (Rogue/Schlitzohr) - cloak icon missing
4. Zauberhut (Mage/Gelehrter) - wizard hat icon missing
5. Mörser (Healer/Wundpfleger) - mortar and pestle icon missing
6. Rüstung (Warrior/Knappe) - armor icon missing
7. Kettenringe (Warrior/Knappe) - chainmail icon missing
8. Schleifstein (Warrior/Knappe) - currently using wrong icon (material-icons "build"), needs replacement
9. Heiler emblem (tab icon for Healer) - currently using simple + icon from Font Awesome, doesn't fit with other RPG-themed emblems

**Q2:** For Schleifstein specifically, what icon priority should we follow?
**Answer:** Option C → A → B priority:
- **First choice (C)**: RPG Awesome icon library (preferred)
- **Second choice (A)**: Material Icons "build" (current implementation)
- **Third choice (B)**: Other Material Icons alternatives

User preference is for RPG-themed icons to maintain visual consistency with the rest of the application.

**Q3:** What is the root cause of these missing icons?
**Answer:** After analyzing the code in `app.js` lines 17-59, the icon mapping uses three icon libraries:
- Font Awesome 6.4.0 (fas/fa prefix)
- RPG Awesome 0.2.0 (ra prefix)
- Material Icons (material-icons class)

The problem is that some mapped icon classes don't exist in their respective libraries:
- `fas fa-treasure-chest` - Font Awesome doesn't have this icon
- `ra ra-dagger` - RPG Awesome uses different naming (ra-plain-dagger, ra-knife)
- `ra ra-cape` - RPG Awesome doesn't have a cape icon
- `ra ra-wizard-hat` - RPG Awesome doesn't have this specific icon name
- `ra ra-mortar-pestle` - RPG Awesome doesn't have this icon
- `ra ra-heavy-armor` - Need to verify if this exists in RPG Awesome 0.2.0
- `ra ra-chain-mail` - Need to verify naming convention
- `fas fa-plus` for Heiler emblem - works but doesn't fit RPG theme

### Bug 2: Disruptive Re-render Investigation

**Q4:** When you click +/- buttons, what exactly happens?
**Answer:** The entire `renderUI()` function is called (line 162 in app.js), which:
1. Clears the entire resources container with `innerHTML = ''` (line 367)
2. Rebuilds all 8 resource cards from scratch
3. Applies fadeSlideIn animation to all cards (CSS lines 815-827)
4. Applies staggered animation delays (350ms total for 8 cards)
5. Also applies the count update animation with scale and glow (CSS lines 786-801)

This causes a jarring user experience where the entire screen flashes and all cards re-animate on every single +/- click.

**Q5:** What animations should remain and which should be removed?
**Answer:** User specified:
- **KEEP**: Sparkle animation on resource increase (lines 172-185 in app.js)
- **KEEP**: Tab-switch animation (fadeSlideIn) when switching between categories
- **REMOVE**: fadeSlideIn animation when clicking +/- (currently applies to all renderUI calls)
- **REMOVE**: Count update animation (scale + glow) for +/- actions (CSS lines 786-801, triggered at line 169)

**Q6:** What is the preferred technical solution?
**Answer:** User approved approach to only update specific elements instead of full re-render:
- Create a new function (e.g., `updateResourceDisplay()`) that updates only the changed resource
- Update the count number element
- Update the stacks display (visual stack representation)
- Update the remainder badge
- Update the tab totals
- Do NOT rebuild the entire card HTML
- Do NOT trigger fadeSlideIn animation

**Q7:** Should sparkle effects remain on resource increase?
**Answer:** YES - keep sparkle animations. They are visual feedback for successful increment actions and are not disruptive.

## Existing Code to Reference

No similar features were identified for reuse. This is a bugfix for existing implementation.

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
No visual mockups available. Fix should maintain existing visual design while correcting icon mappings and animation behavior.

## Requirements Summary

### Functional Requirements

#### Bug 1: Icon Fixes
1. **Audit all 32 resource icons** to verify they display correctly
2. **Replace incorrect icon mappings** with valid icon classes from available libraries:
   - Truhe: Find chest/treasure alternative (possibly Material Icons or Font Awesome)
   - Messer: Change to `ra-knife` or `ra-plain-dagger` from RPG Awesome
   - Umhang: Find alternative (possibly Material Icons "checkroom" or Font Awesome alternative)
   - Zauberhut: Find wizard hat alternative (possibly Font Awesome "hat-wizard" or Material Icons)
   - Mörser: Find mortar/pestle alternative (Material Icons may have pharmacy-related icons)
   - Rüstung: Verify `ra-heavy-armor` exists, or use alternative like `ra-vest`
   - Kettenringe: Verify `ra-chain-mail` naming, possibly needs hyphenation fix
   - Schleifstein: Replace with RPG Awesome icon if available, otherwise keep Material Icons "build"
   - Heiler emblem: Replace `fas fa-plus` with RPG-themed medical/healing icon (possibly `ra-potion` or medical symbol)

3. **Implement icon fallback system** if not already present
4. **Test all icons display** across all four categories

#### Bug 2: Re-render Fix
1. **Create selective update function** that updates only changed resource elements
2. **Modify updateResource() function** (lines 148-186) to call selective update instead of full renderUI()
3. **Preserve tab-switch animation** - renderUI() should only be called when switching tabs
4. **Remove animations from +/- actions**:
   - Remove fadeSlideIn animation trigger for increment/decrement
   - Remove count update animation (scale + glow) from +/- button clicks
5. **Keep sparkle effects** on resource increase
6. **Update elements**:
   - Resource count number (`.resource-count`)
   - Stacks display (`.stacks-display` children)
   - Remainder badge (`.remainder` with color class)
   - Tab totals in tab labels

### Non-Functional Requirements
- **Performance**: Updating a single resource should be instant (<50ms)
- **Visual Consistency**: Icon style should match existing RPG theme
- **Accessibility**: Icons should be semantic and recognizable
- **Maintainability**: Icon mappings should be clear and documented

### Reusability Opportunities
No existing similar features identified. This bugfix creates reusable patterns:
- Selective DOM update function can be referenced for future performance optimizations
- Icon audit process can be template for future icon additions

### Scope Boundaries

**In Scope:**
- Fix all 9 identified icon issues
- Replace incorrect icon class names with valid alternatives
- Implement selective resource update to avoid full re-render
- Remove disruptive animations from +/- actions
- Keep tab-switch animations unchanged
- Keep sparkle effects on increment
- Update tab totals without full re-render

**Out of Scope:**
- Adding new icon libraries
- Redesigning the icon visual style
- Changing animation timings for tab-switch
- Adding new animations
- Refactoring other parts of the codebase not related to these bugs

### Technical Considerations

#### Icon Library Constraints
Current libraries loaded via CDN (index.html lines 12-14):
- Font Awesome 6.4.0: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`
- RPG Awesome 0.2.0: `https://cdnjs.cloudflare.com/ajax/libs/rpg-awesome/0.2.0/css/rpg-awesome.min.css`
- Material Icons: `https://fonts.googleapis.com/icon?family=Material+Icons`

Must use only icons available in these libraries.

#### Icon Mapping Location
Icon mappings defined in `app.js` lines 17-67:
- `resourceIcons` object (lines 18-59)
- `classEmblems` object (lines 62-67)
- `getResourceIcon()` function (lines 70-72)

#### Animation System Location
CSS animations in `styles.css`:
- Count update animation: lines 786-801
- fadeSlideIn animation: lines 804-827
- Card animation delays: lines 820-827
- Updating class: line 799-801

JavaScript animation triggers in `app.js`:
- renderUI() full rebuild: lines 365-401
- updateResource() triggers: lines 148-186
- animateElement() helper: lines 124-131

#### DOM Structure
Resource card structure (app.js lines 242-353):
```
.resource-card[data-category][data-resource]
  .card-ornate-border
  .card-header
    .resource-icon
    .resource-name
    .resource-count
  .stacks-display
    .stack (multiple)
    .remainder
  .controls
    .buttons-row (increment)
    .buttons-row (decrement)
    .edit-btn
```

#### Selective Update Strategy
New function should:
1. Accept category and resource parameters
2. Find card by data attributes: `document.querySelector('.resource-card[data-resource="${resource}"]')`
3. Update `.resource-count` textContent
4. Rebuild `.stacks-display` innerHTML (stacks + remainder)
5. Update tab total for category
6. NOT call renderUI()
7. NOT clear container
8. Maintain sparkle effect creation for increments

### Testing Criteria

#### Icon Fix Verification
- [ ] All 32 resources display visible icons (not fallback cube)
- [ ] Truhe shows appropriate chest/treasure icon
- [ ] Messer shows appropriate knife/dagger icon
- [ ] Umhang shows appropriate cloak/cape icon
- [ ] Zauberhut shows appropriate wizard hat icon
- [ ] Mörser shows appropriate mortar/pestle icon
- [ ] Rüstung shows appropriate armor icon
- [ ] Kettenringe shows appropriate chainmail icon
- [ ] Schleifstein shows appropriate whetstone icon (RPG Awesome preferred)
- [ ] Heiler tab emblem shows RPG-themed healing icon (not simple +)
- [ ] All icons maintain class-colored glow effects
- [ ] Icons display correctly in dark mode
- [ ] Icons are semantically appropriate for their resource

#### Re-render Fix Verification
- [ ] Clicking +1/+5/+10 does NOT trigger full page re-render
- [ ] Clicking -1/-5/-10 does NOT trigger full page re-render
- [ ] Count updates instantly when clicking +/- buttons
- [ ] Stack display updates instantly showing correct stacks and remainder
- [ ] Remainder color updates correctly (red/yellow/green)
- [ ] Tab totals update without full re-render
- [ ] fadeSlideIn animation does NOT play on +/- clicks
- [ ] Count update animation (scale+glow) does NOT play on +/- clicks
- [ ] Sparkle effects STILL play on increment actions
- [ ] Tab switching STILL shows fadeSlideIn animation
- [ ] Edit modal STILL works correctly
- [ ] CSV import STILL triggers full re-render (expected)
- [ ] Page load STILL shows initial animation (expected)
- [ ] No console errors during +/- operations
- [ ] Performance: +/- response time is under 50ms

#### Regression Testing
- [ ] All four tabs display correctly
- [ ] Tab switching preserves animations
- [ ] Resource totals calculate correctly
- [ ] Edit modal functions properly
- [ ] CSV export includes correct data
- [ ] CSV import updates UI correctly
- [ ] Reset button works as expected
- [ ] localStorage persistence works
- [ ] Service Worker cache functions
- [ ] Offline mode works
- [ ] Mobile touch interactions work
- [ ] Landscape mode displays correctly

## Icon Mapping Research

### Current Incorrect Mappings (app.js lines 17-59)

```javascript
// Schlitzohr/Rogue
'Truhe': 'fas fa-treasure-chest',     // INVALID - doesn't exist in Font Awesome
'Messer': 'ra ra-dagger',             // INVALID - RPG Awesome uses 'ra-plain-dagger' or 'ra-knife'
'Umhang': 'ra ra-cape',               // INVALID - doesn't exist in RPG Awesome

// Gelehrter/Mage
'Zauberhut': 'ra ra-wizard-hat',      // INVALID - doesn't exist in RPG Awesome

// Wundpfleger/Healer
'Mörser': 'ra ra-mortar-pestle',      // INVALID - doesn't exist in RPG Awesome

// Knappe/Warrior
'Rüstung': 'ra ra-heavy-armor',       // NEEDS VERIFICATION
'Schleifstein': 'material-icons',     // WRONG ICON - uses "build" text, not RPG-themed
'Kettenringe': 'ra ra-chain-mail',    // NEEDS VERIFICATION - might be naming issue

// Class Emblems
wundpfleger: 'fas fa-plus',           // WORKS but not RPG-themed, inconsistent with others
```

### Recommended Icon Replacements

Based on available libraries, recommended fixes:

1. **Truhe (Treasure Chest)**
   - Option A: `fas fa-box` - Font Awesome (simple box)
   - Option B: `fas fa-archive` - Font Awesome (archive box)
   - Option C: `fas fa-gift` - Font Awesome (gift box, closest to chest visually)
   - **RECOMMENDED**: `fas fa-gift` or create custom chest icon using Material Icons `inventory_2`

2. **Messer (Knife/Dagger)**
   - Option A: `ra ra-plain-dagger` - RPG Awesome
   - Option B: `ra ra-knife` - RPG Awesome
   - Option C: `ra ra-bone-knife` - RPG Awesome
   - **RECOMMENDED**: `ra ra-plain-dagger` (most appropriate for rogue theme)

3. **Umhang (Cloak/Cape)**
   - Option A: Material Icons `checkroom` (clothing/wardrobe)
   - Option B: `fas fa-user-secret` - Font Awesome (hooded figure)
   - Option C: `fas fa-tshirt` - Font Awesome (clothing)
   - **RECOMMENDED**: `fas fa-user-secret` (most thematic for rogue's cloak)

4. **Zauberhut (Wizard Hat)**
   - Option A: `fas fa-hat-wizard` - Font Awesome
   - Option B: Material Icons `celebration` (party hat, not ideal)
   - **RECOMMENDED**: `fas fa-hat-wizard` (direct match)

5. **Mörser (Mortar and Pestle)**
   - Option A: Material Icons `science` (flask/chemistry)
   - Option B: `fas fa-prescription-bottle` - Font Awesome
   - Option C: Material Icons `medication` (pharmacy)
   - **RECOMMENDED**: Material Icons `science` or keep current `ra ra-leaf` and change name if icon is actually displaying

6. **Rüstung (Armor)**
   - Option A: `ra ra-vest` - RPG Awesome (confirmed exists)
   - Option B: `ra ra-helmet` - RPG Awesome (already used for Helm)
   - Option C: `ra ra-heavy-armor` - Verify if exists in v0.2.0
   - **RECOMMENDED**: `ra ra-vest` (safe choice) or verify `ra ra-armor`

7. **Kettenringe (Chainmail)**
   - Option A: `ra ra-chain` - RPG Awesome (if exists)
   - Option B: Material Icons `link` (chain link)
   - Option C: `fas fa-link` - Font Awesome (already used for Seil/Rope)
   - **RECOMMENDED**: Verify exact naming in RPG Awesome 0.2.0, possibly `ra-chain`

8. **Schleifstein (Whetstone)**
   - Priority: RPG Awesome → Material Icons → Font Awesome
   - Option A: Check RPG Awesome for anvil/crafting icons
   - Option B: Material Icons `build` (current, works but not RPG-themed)
   - Option C: Material Icons `handyman` (tools)
   - **RECOMMENDED**: Material Icons `build` (current implementation is functional)

9. **Heiler Emblem (Healer Tab Icon)**
   - Option A: `ra ra-potion` - RPG Awesome (healing potion, very thematic)
   - Option B: `ra ra-hearts` - RPG Awesome (if exists)
   - Option C: `fas fa-heart-pulse` - Font Awesome (medical)
   - **RECOMMENDED**: `ra ra-potion` (matches RPG theme of other emblems)

### Special Handling for Material Icons

Schleifstein currently uses special handling (app.js lines 268-272):
```javascript
if (iconClass === 'material-icons') {
    iconContainer.innerHTML = '<span class="material-icons">build</span>';
} else {
    iconContainer.innerHTML = `<i class="${iconClass}"></i>`;
}
```

This pattern should be updated to store full icon information including the icon name for Material Icons:
```javascript
'Schleifstein': 'material-icons:build',  // format: library:iconname
```

Then update the rendering logic to parse this format.

## Technical Implementation Plan

### Phase 1: Icon Fixes (app.js)

1. Update `resourceIcons` object (lines 18-59):
```javascript
schlitzohr: {
    'Truhe': 'fas fa-gift',              // Changed from invalid fa-treasure-chest
    'Messer': 'ra ra-plain-dagger',      // Changed from invalid ra-dagger
    'Umhang': 'fas fa-user-secret',      // Changed from invalid ra-cape
    // ... keep others
},
gelehrter: {
    'Zauberhut': 'fas fa-hat-wizard',    // Changed from invalid ra-wizard-hat
    // ... keep others
},
wundpfleger: {
    'Mörser': 'material-icons:science',   // Changed from invalid ra-mortar-pestle
    // ... keep others
},
knappe: {
    'Rüstung': 'ra ra-vest',             // Changed from unverified ra-heavy-armor
    'Schleifstein': 'material-icons:build', // Formalize material icons format
    'Kettenringe': 'ra ra-chain',        // Fix naming if needed
    // ... keep others
}
```

2. Update `classEmblems` object (lines 62-67):
```javascript
wundpfleger: 'ra ra-potion',  // Changed from 'fas fa-plus'
```

3. Update `getResourceIcon()` function (lines 70-72) to handle Material Icons format:
```javascript
function getResourceIcon(category, resource) {
    const iconClass = resourceIcons[category]?.[resource] || 'fas fa-cube';
    return iconClass;
}
```

4. Update icon rendering in `createResourceCard()` (lines 268-272):
```javascript
const iconClass = getResourceIcon(category, resource);

// Handle material icons format
if (iconClass.startsWith('material-icons:')) {
    const iconName = iconClass.split(':')[1];
    iconContainer.innerHTML = `<span class="material-icons">${iconName}</span>`;
} else {
    iconContainer.innerHTML = `<i class="${iconClass}"></i>`;
}
```

### Phase 2: Selective Update Function (app.js)

Create new function after `renderUI()` (after line 401):

```javascript
// Selective update function - updates only one resource without full re-render
function updateResourceDisplay(category, resource) {
    const count = state[category][resource];
    const card = document.querySelector(`.resource-card[data-resource="${resource}"]`);

    if (!card) return; // Card not in current view

    // Update count
    const countElement = card.querySelector('.resource-count');
    if (countElement) {
        countElement.textContent = count;
    }

    // Update stacks display
    const stacksDisplay = card.querySelector('.stacks-display');
    if (stacksDisplay) {
        const stacks = Math.floor(count / 10);
        const remainder = count % 10;

        stacksDisplay.innerHTML = '';

        // Add completed stacks
        for (let i = 0; i < stacks; i++) {
            const stack = document.createElement('div');
            stack.className = 'stack';
            stacksDisplay.appendChild(stack);
        }

        // Add remainder
        const remainderElement = document.createElement('div');
        remainderElement.className = `remainder ${getRemainderClass(remainder)}`;
        remainderElement.textContent = remainder;
        stacksDisplay.appendChild(remainderElement);
    }

    // Update tab totals
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

### Phase 3: Modify updateResource() Function (lines 148-186)

Replace `renderUI()` call with selective update:

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

    // Remove count animation trigger - user doesn't want scale+glow on +/- clicks
    // REMOVED: animateElement(countElement, 'updating', 400);

    // Keep sparkle effects on increase (these are not disruptive)
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

### Phase 4: CSS Animation Adjustments (styles.css)

Keep animations but prevent them from triggering on +/- actions:

```css
/* Lines 815-827: Keep fadeSlideIn but it will only trigger on renderUI() calls */
.resource-card {
    animation: fadeSlideIn 350ms var(--transition-base);
    animation-fill-mode: both;
}

/* Lines 820-827: Keep staggered delays for tab switching */
.resource-card:nth-child(1) { animation-delay: 0ms; }
/* ... etc ... */

/* Lines 786-801: Count update animation - keep CSS but remove JS trigger */
@keyframes countUpdate {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.3);
        text-shadow: 0 0 10px currentColor;
    }
    100% {
        transform: scale(1);
    }
}

.resource-count.updating {
    animation: countUpdate 400ms var(--ease-magic);
}
/* This animation class is now NOT applied by updateResource(),
   only manually by other functions if needed */
```

### Expected Behavior After Fixes

1. **Icons**: All 32 resources display appropriate, thematic icons
2. **+/- Buttons**: Instant count update, no page flash, no card rebuild
3. **Tab Switch**: Smooth fadeSlideIn animation with staggered delays (unchanged)
4. **Sparkles**: Still appear on increment (visual feedback)
5. **Performance**: Sub-50ms response time on increment/decrement
6. **Visual**: Remainder color updates immediately with count
7. **Totals**: Tab totals update without re-rendering all tabs

## Code Changes Summary

**Files Modified:**
1. `app.js` - Icon mappings, rendering logic, update function (3 sections)
2. No CSS changes needed (animations stay, just different JS triggers)
3. No HTML changes needed

**Lines Modified:**
- app.js lines 18-67: Icon mapping corrections
- app.js lines 70-72: Icon getter function enhancement
- app.js lines 148-186: Update resource function refactor
- app.js lines 268-272: Icon rendering logic update
- app.js after line 401: New updateResourceDisplay() function insertion

**Testing Priority:**
1. Icon display verification (visual test)
2. +/- button responsiveness (performance test)
3. Animation behavior (tab switch vs +/- clicks)
4. Sparkle effects preservation
5. Regression testing (all existing features)
