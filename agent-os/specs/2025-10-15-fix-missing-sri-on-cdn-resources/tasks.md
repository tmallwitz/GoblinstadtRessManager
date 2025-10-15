# Task Breakdown: Fix Missing SRI on CDN Resources

## Overview
Total Task Groups: 6
Assigned roles: ui-designer, testing-engineer

## Task List

### Task Group 1: Directory Structure Setup
**Assigned implementer:** ui-designer
**Dependencies:** None

- [x] 1.0 Create directory structure for self-hosted resources
  - [x] 1.1 Create `/assets/` directory
  - [x] 1.2 Create `/assets/vendor/` directory
  - [x] 1.3 Create `/assets/vendor/tailwind/` directory
  - [x] 1.4 Create `/assets/vendor/fonts/` directory
  - [x] 1.5 Create `/docs/` directory
  - [x] 1.6 Verify directory structure matches specification

**Acceptance Criteria:**
- Directory structure exists: `assets/vendor/tailwind/`, `assets/vendor/fonts/`, `docs/`
- All directories are accessible and writable
- No errors when creating nested directories

---

### Task Group 2: Self-Host Tailwind CSS
**Assigned implementer:** ui-designer
**Dependencies:** Task Group 1

- [x] 2.0 Download and configure self-hosted Tailwind CSS
  - [x] 2.1 Download Tailwind CSS Play CDN script
    - Source URL: `https://cdn.tailwindcss.com`
    - Save to: `Z:\vibe\GoblinstadtRessManager\assets\vendor\tailwind\tailwind-play.js`
    - Verify file downloads successfully and contains JavaScript code
  - [x] 2.2 Update index.html to reference self-hosted Tailwind
    - Change line 23 from: `<script src="https://cdn.tailwindcss.com"></script>`
    - Change to: `<script src="assets/vendor/tailwind/tailwind-play.js"></script>`
    - Preserve existing inline Tailwind config (lines 24-41) exactly as-is
  - [x] 2.3 Verify Tailwind CSS loads and functions correctly
    - Open index.html in browser
    - Verify dark mode styling applies
    - Verify Tailwind utility classes work (colors, responsive layout)
    - Check browser console for no errors related to Tailwind

**Acceptance Criteria:**
- Tailwind CSS Play CDN script downloaded to correct location
- index.html references self-hosted Tailwind script
- Inline Tailwind config preserved unchanged
- Browser renders app with correct Tailwind styling (dark mode, colors, responsive)
- No console errors related to Tailwind

---

### Task Group 3: Self-Host Google Fonts
**Assigned implementer:** ui-designer
**Dependencies:** Task Group 1

- [x] 3.0 Download and configure self-hosted fonts
    - [x] 3.1 Identify required font files
    - Roboto: regular (400), bold (700) weights
    - Cinzel: regular (400), semibold (600), bold (700) weights
    - Format: WOFF2 (modern browsers, smallest file size)
    - [x] 3.2 Download font files using Google Fonts API
    - Access Google Fonts CSS URL: `https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Cinzel:wght@400;600;700&display=swap`
    - Extract WOFF2 URLs from CSS response
    - Download each WOFF2 file to `Z:\vibe\GoblinstadtRessManager\assets\vendor\fonts\`
    - File names: `roboto-regular.woff2`, `roboto-bold.woff2`, `cinzel-regular.woff2`, `cinzel-semibold.woff2`, `cinzel-bold.woff2`
    - [x] 3.3 Create local fonts.css stylesheet
    - Create file: `Z:\vibe\GoblinstadtRessManager\assets\vendor\fonts\fonts.css`
    - Add @font-face declarations for all 5 font files
    - Use relative paths: `url('./roboto-regular.woff2')`
    - Specify correct font-family, font-weight, and font-style for each
    - Follow Google Fonts CSS structure as reference
    - [x] 3.4 Update index.html to reference self-hosted fonts
    - Remove line 15: `<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap" rel="stylesheet">`
    - Add after line 14: `<link rel="stylesheet" href="assets/vendor/fonts/fonts.css">`
    - [x] 3.5 Verify fonts load and render correctly
    - Open index.html in browser
    - Verify Cinzel font renders in header and category names
    - Verify Roboto font renders in body text
    - Check Network tab to confirm font files load from local server
    - Check browser console for no font-related errors

**Acceptance Criteria:**
- All 5 WOFF2 font files downloaded to correct location
- fonts.css created with correct @font-face declarations
- index.html references self-hosted fonts stylesheet
- Google Fonts CDN link removed from index.html
- Cinzel and Roboto fonts render correctly in browser
- Font files load from local server (verified in Network tab)
- No console errors related to fonts

---

### Task Group 4: Add SRI Hashes to CDN Resources
**Assigned implementer:** ui-designer
**Dependencies:** None (can run in parallel with Task Groups 2-3)

- [x] 4.0 Generate and add SRI hashes to icon library CDN resources
  - [x] 4.1 Generate SRI hash for Font Awesome 6.4.0
    - Download CSS file from: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`
    - Generate SHA-512 hash: `openssl dgst -sha512 -binary all.min.css | openssl base64 -A`
    - Or use online tool: https://www.srihash.org/
    - Format: `sha512-[BASE64_HASH]`
    - Document hash value for later reference
  - [x] 4.2 Update Font Awesome link in index.html (line 12)
    - Current: `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">`
    - Add attributes: `integrity="sha512-[HASH_FROM_4.1]" crossorigin="anonymous"`
    - Result: `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-[HASH]" crossorigin="anonymous">`
  - [x] 4.3 Generate SRI hash for RPG Awesome 0.2.0
    - Download CSS file from: `https://cdnjs.cloudflare.com/ajax/libs/rpg-awesome/0.2.0/css/rpg-awesome.min.css`
    - Generate SHA-512 hash using same method as 4.1
    - Document hash value for later reference
  - [x] 4.4 Update RPG Awesome link in index.html (line 13)
    - Current: `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/rpg-awesome/0.2.0/css/rpg-awesome.min.css">`
    - Add attributes: `integrity="sha512-[HASH_FROM_4.3]" crossorigin="anonymous"`
  - [x] 4.5 Generate SRI hash for Material Icons
    - Download CSS file from: `https://fonts.googleapis.com/icon?family=Material+Icons`
    - Generate SHA-512 hash using same method as 4.1
    - Note: Google Fonts CSS may have slight variations; generate hash from actual fetched content
    - Document hash value for later reference
  - [x] 4.6 Update Material Icons link in index.html (line 14)
    - Current: `<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">`
    - Add attributes: `integrity="sha512-[HASH_FROM_4.5]" crossorigin="anonymous"`
  - [x] 4.7 Verify SRI hashes work correctly
    - Open index.html in browser
    - Verify all icon libraries load without errors
    - Check browser console for no SRI validation errors
    - Check browser console for no CORS errors
    - Verify icons render correctly in UI

**Acceptance Criteria:**
- SRI hashes generated for all 3 CDN icon libraries (Font Awesome, RPG Awesome, Material Icons)
- All 3 CDN links updated with `integrity` and `crossorigin="anonymous"` attributes
- All icon libraries load successfully in browser
- No SRI validation errors in console
- No CORS errors in console
- Icons render correctly in UI

---

### Task Group 5: Update Service Worker
**Assigned implementer:** ui-designer
**Dependencies:** Task Groups 2, 3, 4

- [x] 5.0 Update Service Worker cache version and resource list
  - [x] 5.1 Bump Service Worker cache version in sw.js
    - Change line 2 from: `const CACHE_NAME = 'goblinstadt-cache-v4';`
    - Change to: `const CACHE_NAME = 'goblinstadt-cache-v5';`
  - [x] 5.2 Remove CDN URLs for self-hosted resources from urlsToCache
    - Remove line 16: `'https://cdn.tailwindcss.com',`
    - Remove line 20: `'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap'`
  - [x] 5.3 Add self-hosted resource URLs to urlsToCache
    - Add after line 14: `'./assets/vendor/tailwind/tailwind-play.js',`
    - Add after above: `'./assets/vendor/fonts/fonts.css',`
    - Add after above: `'./assets/vendor/fonts/roboto-regular.woff2',`
    - Add after above: `'./assets/vendor/fonts/roboto-bold.woff2',`
    - Add after above: `'./assets/vendor/fonts/cinzel-regular.woff2',`
    - Add after above: `'./assets/vendor/fonts/cinzel-semibold.woff2',`
    - Add after above: `'./assets/vendor/fonts/cinzel-bold.woff2',`
  - [x] 5.4 Keep CDN icon library URLs in urlsToCache (now protected by SRI)
    - Keep line 17: Font Awesome CDN URL
    - Keep line 18: RPG Awesome CDN URL
    - Keep line 19: Material Icons CDN URL
  - [x] 5.5 Verify Service Worker updates correctly
    - Unregister existing Service Worker in browser DevTools (Application > Service Workers > Unregister)
    - Reload page to register new Service Worker
    - Verify Service Worker installation succeeds
    - Check browser console for "[ServiceWorker] Install" message
    - Verify old cache (v4) is deleted and new cache (v5) is created
    - Check Application > Cache Storage in DevTools to confirm v5 exists

**Acceptance Criteria:**
- Service Worker cache version bumped to v5
- Self-hosted resource URLs added to urlsToCache
- CDN URLs for self-hosted resources removed from urlsToCache
- CDN icon library URLs remain in urlsToCache
- Service Worker installs successfully
- Cache v5 created, cache v4 deleted
- All resources (local and CDN) cached during installation

---

### Task Group 6: Documentation and Testing
**Assigned implementer:** testing-engineer
**Dependencies:** Task Groups 1-5

- [x] 6.0 Create documentation and perform comprehensive testing
  - [x] 6.1 Create SRI maintenance documentation
    - Create file: `Z:\vibe\GoblinstadtRessManager\docs\sri-maintenance.md`
    - Section 1: Overview - Purpose of SRI and hybrid approach rationale
    - Section 2: Current Resource Inventory - Table with all external resources, status (self-hosted/CDN), versions, and SRI hashes
    - Section 3: Hash Generation Process - Step-by-step commands (OpenSSL, srihash.org)
    - Section 4: Updating CDN Resources - 5-step process (download, generate hash, update HTML, bump SW version, test)
    - Section 5: Updating Self-Hosted Resources - Process for Tailwind and fonts, SW version bump requirement
    - Section 6: Testing SRI Implementation - Verification steps (online, offline, console checks, tampering simulation)
    - Section 7: Rationale for Hybrid Approach - Explain why Tailwind/fonts self-hosted vs icons on CDN
    - Section 8: Security Considerations - Notes on SRI failure behavior (no fallback by design)
  - [x] 6.2 Test online mode resource loading
    - Open index.html in browser with network enabled
    - Verify all self-hosted resources load from local server
    - Verify all CDN resources load with SRI validation
    - Check Network tab to confirm resource sources
    - Check browser console for zero errors
  - [x] 6.3 Test offline mode functionality
    - Enable offline mode in DevTools (Network tab > Throttling > Offline)
    - Reload page
    - Verify app loads completely from Service Worker cache
    - Verify no network requests made
    - Verify all resources render correctly (fonts, icons, styles)
    - Check browser console for zero errors
  - [x] 6.4 Test PWA installation functionality
    - Clear browser data and reload page
    - Verify PWA install prompt appears (if supported)
    - Install app to home screen (mobile) or desktop
    - Launch app from home screen/desktop
    - Verify app launches and functions correctly
  - [x] 6.5 Test SRI validation (tampering simulation)
    - Modify one SRI hash in index.html to incorrect value
    - Reload page
    - Verify browser console shows SRI integrity error
    - Verify affected resource fails to load
    - Revert hash to correct value and verify resource loads again
  - [x] 6.6 Verify CORS compatibility
    - Check browser console for zero CORS errors
    - Verify `crossorigin="anonymous"` attribute does not cause issues
    - Test on both desktop and mobile browsers (Chrome, Safari)
  - [x] 6.7 Verify visual rendering (no UI regressions)
    - Font Awesome icons render in all four category tabs
    - RPG Awesome icons render (if used)
    - Material Icons render (if used)
    - Cinzel font displays in header and category names
    - Roboto font displays in body text
    - Tailwind CSS dark mode, colors, and responsive layout work correctly
  - [x] 6.8 Verify Service Worker cache behavior
    - Check Application > Cache Storage in DevTools
    - Verify cache v5 contains all expected resources
    - Verify cache v4 is deleted
    - Verify self-hosted resources cached with correct paths
    - Verify CDN resources cached with SRI attributes

**Acceptance Criteria:**
- SRI maintenance documentation created with all 8 required sections
- Online mode: all resources load successfully, zero console errors
- Offline mode: app loads completely from cache, zero console errors
- PWA installation: works identically to before
- SRI tampering simulation: causes resource load failure (verified security)
- CORS compatibility: zero CORS errors with `crossorigin="anonymous"`
- Visual rendering: no UI regressions, all fonts and icons render correctly
- Service Worker: cache v5 created with all resources, v4 deleted

---

## Execution Order

Recommended implementation sequence:
1. **Task Group 1**: Directory Structure Setup (prerequisite for self-hosting)
2. **Task Groups 2, 3, 4**: Self-Host Tailwind CSS, Self-Host Google Fonts, Add SRI Hashes (can be executed in parallel)
3. **Task Group 5**: Update Service Worker (requires completion of groups 2-4)
4. **Task Group 6**: Documentation and Testing (final verification)

## Testing Strategy

- **Minimal tests during development**: Each task group includes verification steps in acceptance criteria
- **Comprehensive testing in Task Group 6**: testing-engineer performs full end-to-end testing
- **No automated test suite**: This is a static PWA; manual testing in browser is appropriate
- **Focus on critical user flows**: Online mode, offline mode, PWA installation, SRI validation

## Resource Inventory Summary

**Self-Hosted Resources (eliminates CDN dependency):**
- Tailwind CSS Play CDN script → `assets/vendor/tailwind/tailwind-play.js`
- Google Fonts (Roboto + Cinzel) → `assets/vendor/fonts/*.woff2` + `fonts.css`

**CDN Resources with SRI (protected by cryptographic hash):**
- Font Awesome 6.4.0 (icon library)
- RPG Awesome 0.2.0 (icon library)
- Material Icons (icon library)

**Rationale for Hybrid Approach:**
- **Self-hosted**: Critical dependencies (JavaScript execution, fonts) for maximum security and offline reliability
- **CDN with SRI**: Icon libraries benefit from CDN caching, low injection risk, SRI prevents tampering

## Security Posture Improvement

- **Before**: 5 CDN resources without integrity validation (supply chain attack vector)
- **After**: 2 self-hosted resources (no CDN dependency) + 3 CDN resources with SRI hashes (tamper-proof)
- **Impact**: Eliminates JavaScript injection risk, protects font loading, validates icon libraries
- **Offline-first**: PWA now fully functional without external dependencies for critical resources
