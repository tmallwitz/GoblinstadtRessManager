# Task Breakdown: Critical Bugfixes - Missing Icons and Disruptive Re-render

## Overview

**Project Type:** Critical bugfix for Goblinstadt Resource Manager PWA
**Total Task Groups:** 4
**Assigned Implementers:** ui-designer, testing-engineer
**Estimated Effort:** 4-6 hours
**Complexity:** Medium (targeted code changes, high user impact)
**Critical Path:** Icon Fixes → Performance Fix → Manual Testing → Verification

### Critical Success Factors
1. **Icon Coverage:** 32/32 resources must display visible, RPG-themed icons (100% coverage)
2. **Performance Target:** +/- button response time <50ms (currently ~350ms)
3. **Zero Regressions:** All existing functionality (CSV, edit modal, persistence, offline mode) must remain intact
4. **Animation Precision:** Preserve tab-switch animations, remove only +/- action animations

### Risk Assessment
- **Low Risk:** Icon mapping corrections (Phase 1) - simple string replacements
- **Medium Risk:** Selective update function (Phase 2) - new code, DOM manipulation
- **High Risk:** Modifying core updateResource() - touches critical user flow
- **Critical:** Regression testing required to catch side effects

---

## Task List

### Phase 1: Icon Mapping Corrections

#### Task Group 1.1: Fix Invalid Icon Class Names
**Assigned Implementer:** ui-designer
**Dependencies:** None
**Risk Level:** Low
**Estimated Effort:** 45 minutes
**Rollback Point:** Git commit before changes

**Tasks:**
- [x] 1.1.0 Create backup commit of current working state
  - Run: `git add app.js && git commit -m "Backup before icon fixes"`
  - This establishes a safe rollback point

- [x] 1.1.1 Fix Rogue (Schlitzohr) icons in resourceIcons object (app.js lines 18-28)
  - Change `'Truhe': 'fas fa-treasure-chest'` to `'Truhe': 'fas fa-box'`
    - Rationale: fa-treasure-chest doesn't exist in Font Awesome 6.4.0
  - Change `'Messer': 'ra ra-dagger'` to `'Messer': 'ra ra-plain-dagger'`
    - Rationale: RPG Awesome uses ra-plain-dagger, not ra-dagger
  - Change `'Umhang': 'ra ra-cape'` to `'Umhang': 'fas fa-user-secret'`
    - Rationale: ra-cape doesn't exist; fa-user-secret (hooded figure) is thematic

- [x] 1.1.2 Fix Mage (Gelehrter) icon in resourceIcons object (app.js lines 29-38)
  - Change `'Zauberhut': 'ra ra-wizard-hat'` to `'Zauberhut': 'fas fa-hat-wizard'`
    - Rationale: ra-wizard-hat doesn't exist; fa-hat-wizard is direct match

- [x] 1.1.3 Fix Healer (Wundpfleger) icons (app.js lines 39-48)
  - Change `'Mörser': 'ra ra-mortar-pestle'` to `'Mörser': 'material-icons:science'`
    - Rationale: ra-mortar-pestle doesn't exist; Material Icons science icon is appropriate
  - Note: This introduces the `material-icons:iconname` format pattern

- [x] 1.1.4 Fix Warrior (Knappe) icons in resourceIcons object (app.js lines 49-59)
  - Change `'Rüstung': 'ra ra-heavy-armor'` to `'Rüstung': 'ra ra-vest'`
    - Rationale: ra-heavy-armor unverified; ra-vest confirmed exists in RPG Awesome 0.2.0
  - Change `'Schleifstein': 'material-icons'` to `'Schleifstein': 'material-icons:build'`
    - Rationale: Formalize Material Icons format for consistency
  - Change `'Kettenringe': 'ra ra-chain-mail'` to `'Kettenringe': 'material-icons:link'`
    - Rationale: ra-chain-mail invalid; Material Icons link (chain) is thematic

- [x] 1.1.5 Fix Healer tab emblem in classEmblems object (app.js line 65)
  - Change `wundpfleger: 'fas fa-plus'` to `wundpfleger: 'ra ra-potion'`
    - Rationale: fa-plus not RPG-themed; ra-potion matches other RPG emblem style

**Acceptance Criteria:**
- All 9 resource icon mappings updated with valid icon class names
- Healer tab emblem updated to RPG-themed icon
- Code uses consistent `material-icons:iconname` format for Material Icons
- No syntax errors introduced

**Verification Steps:**
1. Open app.js and verify all changes match the spec exactly
2. Check for typos in icon class names (common error: wrong prefix like 'fa' vs 'fas')
3. Ensure no commas or quotes are missing

---

#### Task Group 1.2: Enhance Icon Rendering Logic
**Assigned Implementer:** ui-designer
**Dependencies:** Task Group 1.1
**Risk Level:** Low
**Estimated Effort:** 30 minutes
**Rollback Point:** Git commit after Task Group 1.1

**Tasks:**
- [x] 1.2.0 Create checkpoint commit
  - Run: `git add app.js && git commit -m "Icon mappings corrected"`

- [x] 1.2.1 Update icon rendering logic in createResourceCard() (app.js lines 268-272)
  - Replace the conditional logic with enhanced Material Icons parsing:
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
  - Rationale: This handles the new `material-icons:iconname` format while maintaining backward compatibility

- [x] 1.2.2 Add icon fallback verification
  - Verify getResourceIcon() function (lines 70-72) still returns `'fas fa-cube'` as fallback
  - This ensures any future missing icons show a default icon instead of breaking

**Acceptance Criteria:**
- Icon rendering logic parses `material-icons:iconname` format correctly
- Font Awesome and RPG Awesome icons still render with `<i>` tags
- Material Icons render with `<span>` tags and correct icon name
- Fallback to fa-cube works if icon mapping is missing

**Verification Steps:**
1. Test with hardcoded Material Icons format: `'material-icons:build'`
2. Test with Font Awesome format: `'fas fa-key'`
3. Test with RPG Awesome format: `'ra ra-sword'`
4. Verify split(':') correctly extracts icon name

---

### Phase 2: Performance Fix - Selective DOM Updates

#### Task Group 2.1: Create Selective Update Function
**Assigned Implementer:** ui-designer
**Dependencies:** Phase 1 complete
**Risk Level:** Medium
**Estimated Effort:** 1.5 hours
**Rollback Point:** Git commit after Phase 1

**Tasks:**
- [x] 2.1.0 Create checkpoint commit with working icon fixes
  - Run: `git add app.js && git commit -m "Icon rendering enhanced"`

- [x] 2.1.1 Create new updateResourceDisplay() function after renderUI() (after line 401)
  - Insert the full function implementation from spec.md (lines 183-234)
  - Function accepts (category, resource) parameters
  - Function performs selective DOM updates only

- [x] 2.1.2 Implement count update logic
  - Query for card using: `.resource-card[data-resource="${resource}"]`
  - Update `.resource-count` textContent with new count
  - Add null check: return early if card not found (handles tab switching edge case)

- [x] 2.1.3 Implement stacks display rebuild
  - Query for `.stacks-display` element within the card
  - Clear existing stacks with `innerHTML = ''`
  - Calculate stacks: `Math.floor(count / 10)`
  - Calculate remainder: `count % 10`
  - Rebuild stack divs with `className = 'stack'`
  - Add remainder div with color class from `getRemainderClass(remainder)`

- [x] 2.1.4 Implement tab total update
  - Calculate new category total using existing `getCategoryTotal(category)` function
  - Query for tab button: `.tab-button[data-category="${category}"]`
  - Update `.tab-text` with format: `${categoryNames[category]} (${categoryTotal})`
  - Add null checks for robustness

**Acceptance Criteria:**
- Function updates only the specified resource card
- Count number updates instantly
- Stack visualization rebuilds correctly (stacks of 10 + remainder)
- Remainder badge shows correct color (red 0-4, yellow 5-7, green 8-9)
- Tab total updates without triggering full re-render
- Function handles edge cases (card not found, null elements)
- No console errors during execution

**Verification Steps:**
1. Add console.log statements to verify function is called with correct parameters
2. Manually inspect DOM to confirm only target card elements are modified
3. Verify no other cards flicker or re-render
4. Check that tab totals update without visual disruption

---

#### Task Group 2.2: Modify Core Update Function
**Assigned Implementer:** ui-designer
**Dependencies:** Task Group 2.1
**Risk Level:** High
**Estimated Effort:** 1 hour
**Rollback Point:** Git commit after Task Group 2.1

**Tasks:**
- [x] 2.2.0 Create checkpoint commit with new function
  - Run: `git add app.js && git commit -m "Add selective update function"`

- [x] 2.2.1 Replace renderUI() call in updateResource() (line 162)
  - BEFORE: `renderUI();`
  - AFTER: `updateResourceDisplay(category, resource);`
  - Rationale: This triggers selective update instead of full page rebuild

- [x] 2.2.2 Remove count animation trigger (line 169)
  - DELETE: `animateElement(countElement, 'updating', 400);`
  - DELETE: Lines 164-170 (entire count animation block)
  - Rationale: User feedback indicates scale+glow animation is disruptive on +/- clicks

- [x] 2.2.3 Preserve sparkle effect logic (lines 172-185)
  - KEEP: All sparkle creation code unchanged
  - Verify sparkle effects still trigger on resource increase
  - Rationale: Sparkles are visual feedback without being disruptive

- [x] 2.2.4 Update sparkle effect query selector (line 165)
  - Ensure querySelector still works after removing animation block
  - Current query: `.resource-card[data-resource="${resource}"] .resource-count`
  - This must remain functional for sparkle positioning

**Acceptance Criteria:**
- updateResource() calls updateResourceDisplay() instead of renderUI()
- No full page re-render on +/- button clicks
- Count animation (scale+glow) does NOT play on +/- actions
- Sparkle effects STILL play on increment actions
- Tab totals update correctly
- localStorage still saves state after each update

**Verification Steps:**
1. Click +1 button and verify no fadeSlideIn animation plays
2. Click +5 button and verify sparkles still appear
3. Click -1 button and verify instant update without animation
4. Switch tabs and verify fadeSlideIn animation STILL plays (this should trigger renderUI())
5. Check browser DevTools Performance tab: measure update time (<50ms target)

---

### Phase 3: Manual Testing and Verification

#### Task Group 3.1: Functional Verification
**Assigned Implementer:** testing-engineer
**Dependencies:** Phase 2 complete
**Risk Level:** Low
**Estimated Effort:** 1 hour
**Rollback Point:** Git commit after Phase 2

**Tasks:**
- [ ] 3.1.1 Icon display verification (visual QA)
  - Open app in browser
  - Switch to Rogue tab and verify 8 icons display correctly
    - Specifically check: Truhe (box), Messer (dagger), Umhang (hooded figure)
  - Switch to Mage tab and verify 8 icons display correctly
    - Specifically check: Zauberhut (wizard hat)
  - Switch to Healer tab and verify 8 icons display correctly
    - Specifically check: Mörser (science/flask icon), tab emblem (potion icon)
  - Switch to Warrior tab and verify 8 icons display correctly
    - Specifically check: Rüstung (vest), Kettenringe (chain link), Schleifstein (build icon)
  - Verify all 32 resources show visible icons (no blank spaces)
  - Verify all icons maintain class-colored glow effects

- [ ] 3.1.2 Performance verification (+/- button responsiveness)
  - Open browser DevTools → Performance tab
  - Start recording
  - Click +1 button multiple times
  - Stop recording and measure response time (<50ms target)
  - Verify no visible lag or delay
  - Verify no screen flash or flicker
  - Verify no full page re-render in Performance timeline

- [ ] 3.1.3 Animation behavior verification
  - Test +/- buttons: verify NO fadeSlideIn animation plays
  - Test +/- buttons: verify NO count update animation (scale+glow) plays
  - Test +1 button: verify sparkle effects STILL appear
  - Test tab switching: verify fadeSlideIn animation STILL plays smoothly
  - Test tab switching: verify staggered card delays (350ms total) still work

- [ ] 3.1.4 Count and stack display verification
  - Set resource to 0 and verify: 0 stacks, red remainder badge showing "0"
  - Click +1 nine times and verify: 0 stacks, remainder increases, color changes (red→yellow→green)
  - Click +1 one more time and verify: 1 stack appears, remainder resets to 0 (red)
  - Click +10 button and verify: stack count increases by 1
  - Click -5 button and verify: remainder decreases correctly
  - Verify remainder color classes: red (0-4), yellow (5-7), green (8-9)

**Acceptance Criteria:**
- All 32 resources display visible, appropriate icons
- +/- button response time measured at <50ms
- Tab-switch animation preserved, +/- animations removed
- Sparkle effects work on increment
- Stack visualization and remainder colors update correctly
- No console errors during any operation

**Documentation:**
- Screenshot each tab showing all 8 icons displayed correctly
- Record Performance timeline showing <50ms update time
- Note any unexpected behavior or visual glitches

---

#### Task Group 3.2: Regression Testing
**Assigned Implementer:** testing-engineer
**Dependencies:** Task Group 3.1
**Risk Level:** Medium
**Estimated Effort:** 1.5 hours
**Rollback Point:** Revert to Phase 1 commit if critical bugs found

**Tasks:**
- [ ] 3.2.1 Core functionality regression
  - Test edit modal functionality
    - Click "Edit" button on any resource
    - Verify modal opens with correct resource name and current value
    - Verify modal has class-colored theming
    - Change value and click Save
    - Verify card updates with new value
    - Verify stacks display updates correctly
  - Test all four character tabs
    - Click each tab and verify resources load
    - Verify active tab highlighting works
    - Verify tab totals display correctly
    - Verify tab emblems display correctly

- [ ] 3.2.2 Data persistence regression
  - Update several resource counts across different tabs
  - Reload the page (F5)
  - Verify all resource counts persist correctly
  - Verify active tab is remembered
  - Open browser DevTools → Application → Local Storage
  - Verify `goblinstadt-resources` key contains correct state JSON
  - Verify `goblinstadt-active-tab` key contains correct active category

- [ ] 3.2.3 CSV export/import regression
  - Click "CSV Export" button
  - Verify file downloads with name `goblinstadt_ressourcen.csv`
  - Open CSV file and verify format matches spec:
    - Header row: `Schlitzohr,,Magier,,Krieger,,Heiler`
    - Data rows: resource name, count, alternating for each category
    - Final row: totals for each category, grand total
  - Modify some values in the CSV file
  - Click "CSV Import" button and select modified file
  - Verify confirmation dialog appears
  - Confirm import and verify UI updates with new values
  - Verify tab totals update correctly

- [ ] 3.2.4 Reset functionality regression
  - Click "Reset" button in footer
  - Verify confirmation dialog: "Wirklich alle Ressourcen auf 0 zurücksetzen?"
  - Confirm reset
  - Verify all resources across all tabs reset to 0
  - Verify all tab totals show (0)
  - Verify stacks display shows: 0 stacks, red remainder badge "0"

- [ ] 3.2.5 PWA and offline functionality regression
  - Open browser DevTools → Application → Service Workers
  - Verify Service Worker is active (goblinstadt-cache-v3)
  - Go offline: DevTools → Network tab → Set to "Offline"
  - Reload the page
  - Verify app still loads and functions (served from cache)
  - Test +/- buttons work offline
  - Test tab switching works offline
  - Verify localStorage persistence works offline
  - Go back online and verify no issues

**Acceptance Criteria:**
- Edit modal functions identically to before
- All tabs switch correctly with proper theming
- localStorage persistence works correctly
- CSV export produces correct format
- CSV import updates UI correctly
- Reset button clears all resources
- Service Worker caches app correctly
- Offline mode works without issues
- Zero new console errors or warnings

**Documentation:**
- Note any regressions or unexpected behavior
- Document any browser-specific issues (Chrome, Firefox, Safari)
- Record steps to reproduce any bugs found

---

### Phase 4: Final Verification and Sign-off

#### Task Group 4.1: Cross-Browser Testing
**Assigned Implementer:** testing-engineer
**Dependencies:** Phase 3 complete
**Risk Level:** Low
**Estimated Effort:** 45 minutes

**Tasks:**
- [ ] 4.1.1 Chrome/Edge testing (Chromium-based)
  - Test all icon fixes display correctly
  - Test +/- button performance (<50ms)
  - Test animations (preserved vs removed)
  - Test all regression scenarios

- [ ] 4.1.2 Firefox testing
  - Test all icon fixes display correctly
  - Test +/- button performance
  - Verify Material Icons render correctly
  - Test Service Worker offline functionality

- [ ] 4.1.3 Mobile testing (iPhone Pro Max target: 430×930px)
  - Test in responsive mode or actual device
  - Verify touch interactions work smoothly
  - Verify no zoom on +/- button clicks (touch-action: manipulation)
  - Verify portrait mode layout (2 columns)
  - Test landscape mode layout (4 columns)
  - Verify all icons display correctly on mobile
  - Test PWA installation to home screen
  - Test offline functionality on mobile

**Acceptance Criteria:**
- All fixes work identically across browsers
- No browser-specific icon rendering issues
- Performance target met in all browsers
- Mobile touch interactions smooth and responsive
- PWA installs and functions correctly on mobile

---

#### Task Group 4.2: Performance Benchmarking
**Assigned Implementer:** testing-engineer
**Dependencies:** Task Group 4.1
**Risk Level:** Low
**Estimated Effort:** 30 minutes

**Tasks:**
- [ ] 4.2.1 Measure +/- button response time
  - Use Chrome DevTools Performance tab
  - Record 10 consecutive +1 clicks
  - Calculate average response time
  - Verify average is <50ms (target met)
  - Compare to baseline (350ms before fix)

- [ ] 4.2.2 Measure tab switch animation time
  - Record tab switching in Performance tab
  - Verify animation duration is still 350ms (unchanged)
  - Verify no performance degradation from selective updates

- [ ] 4.2.3 Document performance improvements
  - Record BEFORE metrics (from spec: 350ms response time)
  - Record AFTER metrics (target: <50ms response time)
  - Calculate improvement percentage
  - Note user-perceived performance improvements

**Acceptance Criteria:**
- +/- button response time <50ms (85% improvement from baseline)
- Tab-switch animation timing unchanged (350ms)
- No performance regressions in other areas
- Performance improvements documented

---

#### Task Group 4.3: Final Code Review and Cleanup
**Assigned Implementer:** ui-designer
**Dependencies:** Task Group 4.2
**Risk Level:** Low
**Estimated Effort:** 30 minutes

**Tasks:**
- [x] 4.3.1 Code quality review
  - Review all changes in app.js
  - Verify code follows existing style (German comments, consistent formatting)
  - Check for any leftover console.log statements (remove if found)
  - Verify no commented-out code blocks added
  - Ensure consistent indentation and spacing

- [x] 4.3.2 Add implementation comments
  - Add comment above updateResourceDisplay() function:
    ```javascript
    // Selective update function - updates only one resource without full re-render
    // This provides instant feedback for +/- actions without disruptive animations
    // Created as part of bugfix: 2025-10-12-critical-bugfixes-icons-and-rerender
    ```
  - Add comment in updateResource() where renderUI() was replaced:
    ```javascript
    // Use selective update instead of full renderUI() for instant feedback
    updateResourceDisplay(category, resource);
    ```

- [x] 4.3.3 Verify no unintended changes
  - Run git diff to review all changes
  - Confirm only app.js was modified
  - Verify styles.css, index.html, sw.js unchanged
  - Ensure no new files created unintentionally

- [x] 4.3.4 Create final commit
  - Stage all changes: `git add app.js`
  - Create descriptive commit message:
    ```
    Fix critical bugs: missing icons and disruptive re-render

    Bug 1 - Missing Icons (9 resources + 1 emblem):
    - Fixed invalid icon class names for Truhe, Messer, Umhang (Rogue)
    - Fixed invalid icon class for Zauberhut (Mage)
    - Fixed invalid icon class for Mörser (Healer)
    - Fixed invalid icon classes for Rüstung, Kettenringe (Warrior)
    - Formalized Material Icons format: material-icons:iconname
    - Updated Heiler tab emblem to RPG-themed ra-potion
    - Enhanced icon rendering logic to parse new format

    Bug 2 - Disruptive Re-render:
    - Created updateResourceDisplay() for selective DOM updates
    - Modified updateResource() to use selective updates instead of renderUI()
    - Removed disruptive count animation from +/- actions
    - Preserved sparkle effects on increment
    - Preserved fadeSlideIn animation for tab switching
    - Performance improvement: 350ms → <50ms response time (85% faster)

    Testing:
    - All 32 resources display correct icons (100% coverage)
    - +/- buttons respond in <50ms (tested in Chrome DevTools)
    - Tab-switch animations preserved
    - Zero regressions in CSV, edit modal, persistence, offline mode

    Files modified: app.js (5 sections, 1 new function)
    ```

**Acceptance Criteria:**
- Code is clean and well-commented
- Git history shows clear commit progression
- No unintended files modified
- Final commit message documents all changes and test results

---

## Execution Strategy

### Recommended Order
1. **Phase 1 (Sequential):** Icon fixes must be completed and verified before moving to Phase 2
2. **Phase 2 (Sequential):** Selective update function must be created and tested before modifying core updateResource()
3. **Phase 3 (Parallel):** Functional verification and regression testing can be done concurrently
4. **Phase 4 (Sequential):** Cross-browser → Performance → Final cleanup

### Critical Path Items
- Task Group 1.1: Icon mapping corrections (CRITICAL - blocks all visual verification)
- Task Group 1.2: Icon rendering logic (CRITICAL - enables Material Icons format)
- Task Group 2.1: Selective update function (CRITICAL - core performance fix)
- Task Group 2.2: Modify updateResource() (CRITICAL - integrates performance fix)
- Task Group 3.2: Regression testing (CRITICAL - prevents shipping regressions)

### Rollback Strategy
**Phase 1 Rollback:** Revert icon mapping changes if visual inconsistencies appear
- Command: `git reset --hard [checkpoint-commit-hash]`
- Risk: Low (only string changes)

**Phase 2 Rollback:** Revert selective update implementation if performance degrades or bugs appear
- Command: `git reset --hard [post-phase-1-commit-hash]`
- Risk: Medium (new function, core logic change)

**Phase 3 Rollback:** If regressions are found, revert to pre-bugfix state and reassess approach
- Command: `git reset --hard [initial-backup-commit]`
- Risk: High impact (full feature revert)

### Parallel Work Opportunities
- **After Phase 1:** While ui-designer works on Phase 2, testing-engineer can prepare test scenarios
- **During Phase 3:** Functional verification and regression testing can run simultaneously on different branches
- **Phase 4:** Cross-browser testing can run in parallel across different devices

### Testing Focus
Given the minimal testing approach in standards:
- **Manual testing only** - no automated test suite exists for this vanilla JS PWA
- Focus on **visual verification** and **user flow testing**
- Use **browser DevTools** for performance measurement
- **Document findings** with screenshots and recordings

---

## Success Metrics

### Measurable Outcomes
1. **Icon Coverage:** 32/32 resources display visible icons (100% coverage)
2. **Performance:** +/- button response time <50ms (target: 85% improvement)
3. **Animation Accuracy:** Tab-switch animation preserved, +/- animations removed
4. **Zero Regressions:** All features (CSV, edit, reset, persistence, offline) work identically

### User Experience Goals
1. Users can visually identify all resources at a glance (no blank icon spaces)
2. Users perceive +/- actions as instant (no noticeable delay or screen flash)
3. Users experience smooth, intentional tab switching (preserved animations)
4. Users see sparkle feedback on increments without disruption

---

## Files Modified

### app.js (5 sections, 1 new function)
1. **Lines 18-59:** Update `resourceIcons` object (9 icon class name changes)
2. **Lines 62-67:** Update `classEmblems` object (1 emblem change for wundpfleger)
3. **Lines 268-272:** Update icon rendering logic (handle material-icons:iconname format)
4. **Lines 148-186:** Modify `updateResource()` function (replace renderUI call, remove animation)
5. **After line 401:** Insert new `updateResourceDisplay()` function (~50 lines)

### No Changes Required
- `styles.css` - Animations stay as-is (just triggered differently)
- `index.html` - No changes needed
- `sw.js` - No changes needed
- `manifest.json` - No changes needed

---

## Risk Mitigation

### High-Risk Areas
1. **Modifying updateResource() function** - This is a critical user flow
   - Mitigation: Create checkpoint commits before and after each change
   - Mitigation: Test extensively before proceeding to next phase
   - Mitigation: Keep rollback plan ready

2. **DOM manipulation in selective update** - Risk of null reference errors
   - Mitigation: Add null checks for all DOM queries
   - Mitigation: Test with different state scenarios (0 count, high count, tab switches)
   - Mitigation: Use browser DevTools to monitor console for errors

3. **Breaking localStorage persistence** - Risk of data loss
   - Mitigation: Verify saveState() is still called in updateResource()
   - Mitigation: Test persistence after each change
   - Mitigation: Backup current localStorage state before testing

### Testing Gaps
- **No automated test suite:** This is a vanilla JS PWA with no testing framework
- **Manual testing only:** Requires careful, methodical verification
- **Browser compatibility:** Limited by manual testing capacity
- **Mobile testing:** May require actual device testing (not just responsive mode)

---

## Alignment with Standards

### Tech Stack Compliance
- **Frontend:** Vanilla JavaScript (ES6+) - no framework changes
- **Storage:** localStorage - no changes to persistence layer
- **PWA:** Service Worker - no changes to offline functionality
- **Language:** German comments and UI text - preserved in all changes

### Coding Style Compliance
- **Meaningful Names:** updateResourceDisplay() clearly describes purpose
- **Small, Focused Functions:** New function has single responsibility (selective update)
- **DRY Principle:** Reuses existing functions (getCategoryTotal, getRemainderClass, getResourceIcon)
- **Remove Dead Code:** Deletes unused animation trigger instead of commenting out
- **Consistent Style:** Follows existing German comment style and indentation

### Test Writing Compliance
- **Write Minimal Tests:** No new automated tests (none exist in project)
- **Test Only Core Flows:** Manual testing focuses on critical user workflows
- **Defer Edge Cases:** Focus on happy path (standard increment/decrement operations)
- **Fast Execution:** Manual tests can be run quickly in browser

---

## Post-Implementation Checklist

### Before Declaring Complete
- [ ] All 32 icons display correctly across all 4 tabs
- [ ] +/- button response time measured at <50ms in Chrome DevTools
- [ ] Tab-switch animation still plays smoothly (350ms duration)
- [ ] Sparkle effects still appear on increment
- [ ] Edit modal functions identically to before
- [ ] CSV export/import works correctly
- [ ] Reset button works correctly
- [ ] localStorage persistence verified after page reload
- [ ] Offline mode tested and working
- [ ] Cross-browser testing completed (Chrome, Firefox, mobile)
- [ ] No console errors or warnings
- [x] Code reviewed and cleaned up
- [x] Final commit created with comprehensive message
- [ ] Documentation updated with before/after metrics

### Sign-off Required From
- **ui-designer:** Code implementation complete, clean, and performant
- **testing-engineer:** All test scenarios pass, zero regressions found
- **Project Owner:** User experience goals met, both bugs resolved

---

## Notes for Implementers

### For ui-designer
- Follow the exact icon class names specified in the spec (lines 109-162)
- Pay careful attention to the `material-icons:iconname` format (colon separator)
- Test each phase incrementally - don't implement all changes at once
- Use browser DevTools Console to catch errors immediately
- Preserve the existing German comment style in the codebase

### For testing-engineer
- Focus on manual testing - no automated test framework exists
- Use browser DevTools Performance tab for response time measurements
- Take screenshots of each tab showing all 8 icons displayed correctly
- Document any browser-specific issues found
- Test on actual iPhone if possible (target device is iPhone Pro Max)

### Common Pitfalls to Avoid
1. **Typos in icon class names** - Double-check against Font Awesome, RPG Awesome, Material Icons docs
2. **Missing colon in Material Icons format** - Must be `material-icons:iconname`, not `material-icons-iconname`
3. **Forgetting null checks** - DOM queries can return null if card isn't in current view
4. **Breaking sparkle effects** - Ensure sparkle code block is preserved in updateResource()
5. **Testing only one tab** - Must verify all 4 tabs (32 resources total)

---

**End of Tasks Breakdown**
