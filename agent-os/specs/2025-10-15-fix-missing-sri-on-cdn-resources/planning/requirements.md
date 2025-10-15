# Spec Requirements: Fix Missing SRI on CDN Resources

## Initial Description
**Feature: Fix Missing Subresource Integrity (SRI) on CDN Resources**

Security Vulnerability Details:
- Severity: Medium
- Category: Supply Chain Security
- Location: index.html:12-23
- Issue: The application loads 5 external CDN resources (Font Awesome, RPG Awesome, Material Icons, Google Fonts, and Tailwind CSS) without Subresource Integrity (SRI) hashes or crossorigin attributes.

Problem:
This allows potential supply chain attacks if any CDN provider is compromised, with malicious content persisting through the Service Worker cache. An attacker who compromises a CDN could inject malicious JavaScript into CSS/JS files that would be cached by the Service Worker and persist across sessions.

Proposed Solution:
1. Add SRI integrity attributes and crossorigin="anonymous" to all CDN resources
2. Consider self-hosting critical dependencies to eliminate CDN dependency entirely (given the PWA/offline-first nature of the application)

## Requirements Discussion

### First Round Questions

**Q1:** Primary Fix Strategy - Given this is an offline-first PWA, which approach would you prefer: (a) Add SRI hashes to all existing CDN resources, (b) Self-host all dependencies for maximum security and offline reliability, or (c) Hybrid approach (self-host critical dependencies like Tailwind, add SRI to icon libraries)?
**Answer:** Hybrid approach - Self-host critical dependencies (Tailwind CSS and Google Fonts) since this is an offline-first PWA, and add SRI hashes to icon libraries (Font Awesome, RPG Awesome, Material Icons) which are lower risk and benefit from CDN caching.

**Q2:** SRI Hash Generation Documentation - Should we document the hash generation process (e.g., how to regenerate SRI hashes when updating CDN versions) in the codebase for future maintainability?
**Answer:** Document the hash generation process in a separate markdown file (`docs/sri-maintenance.md` or similar) for future maintainability.

**Q3:** SRI Validation Failure Fallback - If SRI validation fails (indicating potential tampering), should we: (a) Let it fail (security over functionality), (b) Provide local fallback versions, or (c) Show user a warning but load anyway?
**Answer:** Let it fail - security over functionality. If SRI validation fails, it indicates tampering, so a broken UI is safer than loading potentially compromised resources.

**Q4:** Tailwind CSS Specific Handling - Tailwind CSS is loaded as a `<script>` tag (not a stylesheet). Should we self-host this specifically since script injection is higher risk than CSS injection?
**Answer:** Self-host Tailwind CSS since it's loaded as a script (higher security risk) and contains inline configuration.

**Q5:** Google Fonts Sub-resources - Google Fonts stylesheet loads additional font files. Should we: (a) Add SRI only to the main stylesheet, (b) Self-host the fonts entirely, or (c) Accept that sub-resources can't have SRI?
**Answer:** Self-host the fonts entirely for consistency, security, and better alignment with the PWA's offline-first architecture.

**Q6:** Testing Scenarios - To verify the fix, should we test: (a) Resources load correctly with valid hashes, (b) Offline mode still works, (c) Browser console shows no CORS errors, (d) PWA installation still works, (e) All of the above?
**Answer:** Verify all mentioned scenarios:
- Resources load correctly with valid hashes in online mode
- Offline mode still works (Service Worker cache)
- Browser console shows no CORS or SRI errors
- PWA installation and functionality remain intact
- SRI hash validation works correctly
- Self-hosted resources serve properly

**Q7:** Service Worker Cache Version - The current cache version is v4. Should we bump it to v5 to force clients to re-fetch resources with the new SRI attributes?
**Answer:** Bump cache version from v4 to v5 to force clients to re-fetch resources with new SRI attributes and self-hosted files.

**Q8:** Scope Limitations - Should we limit this fix to ONLY the CDN security issue, or also review other potential security concerns in the codebase (e.g., localStorage injection, input validation)?
**Answer:** Only touch files directly related to the CDN security issue:
- index.html (CDN links)
- sw.js (cache version, cached resources list)
- Add self-hosted copies of Tailwind and fonts
- Add SRI documentation file

Do NOT touch: manifest.json, app icons, app.js, styles.css, or other unrelated code.

### Existing Code to Reference

**Similar Features Identified:**
No similar existing patterns in the codebase (this is the first security hardening effort).

### Follow-up Questions
No follow-up questions were necessary. User provided comprehensive answers to all initial questions.

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
No visual analysis required for this security fix.

## Requirements Summary

### Functional Requirements

**Self-Hosted Resources:**
- Download and self-host Tailwind CSS Play CDN script
- Download and self-host Google Fonts (Roboto, subset needed by the app)
- Place self-hosted files in appropriate directory structure (e.g., `/assets/vendor/`)
- Update index.html to reference local copies instead of CDN URLs
- Update Service Worker cache list to include self-hosted files

**CDN Resources with SRI:**
- Generate SRI hashes for Font Awesome 6.4.0
- Generate SRI hashes for RPG Awesome 0.2.0
- Generate SRI hashes for Material Icons
- Add `integrity` attribute to each CDN resource link
- Add `crossorigin="anonymous"` attribute to each CDN resource link
- Document exact versions used for reproducibility

**Documentation:**
- Create `docs/sri-maintenance.md` file
- Document hash generation command (e.g., `openssl dgst -sha512 -binary file.css | openssl base64 -A`)
- Document process for updating CDN versions
- Document which resources are self-hosted vs CDN
- Include rationale for hybrid approach

**Service Worker Updates:**
- Bump cache version from `goblinstadt-cache-v4` to `goblinstadt-cache-v5`
- Update cached files list to include self-hosted Tailwind and fonts
- Remove Google Fonts CDN from cache list (now self-hosted)
- Ensure Tailwind CDN is removed from cache list (now self-hosted)

### Non-Functional Requirements

**Security:**
- Prevent supply chain attacks via CDN compromise
- Ensure tampered resources fail to load (security over functionality)
- No fallback for failed SRI validation
- Protect Service Worker cache from storing malicious content

**Performance:**
- Self-hosted resources should load from local server (faster than CDN in offline mode)
- CDN resources benefit from browser/CDN caching
- Service Worker pre-caches all resources for offline use

**Compatibility:**
- Maintain PWA functionality
- Ensure offline-first architecture still works
- Verify no CORS issues with crossorigin attribute
- Test on both mobile and desktop browsers

**Maintainability:**
- Clear documentation for future updates
- Explicit version numbers for all dependencies
- Documented process for regenerating SRI hashes

### Reusability Opportunities
No similar code patterns exist in the codebase to reuse. This is the first security hardening implementation.

### Scope Boundaries

**In Scope:**
- Modifying index.html to update CDN resource references
- Downloading and adding self-hosted Tailwind CSS
- Downloading and adding self-hosted Google Fonts
- Adding SRI hashes to Font Awesome CDN link
- Adding SRI hashes to RPG Awesome CDN link
- Adding SRI hashes to Material Icons CDN link
- Adding crossorigin attribute to all CDN resources
- Updating sw.js cache version from v4 to v5
- Updating sw.js cached resources list
- Creating docs/sri-maintenance.md documentation file

**Out of Scope:**
- Other security concerns (localStorage injection, input validation)
- Modifications to manifest.json
- Modifications to app icons
- Modifications to app.js
- Modifications to styles.css
- Changes to application functionality
- UI/UX improvements
- Performance optimizations beyond security fix
- Other code refactoring

### Technical Considerations

**File Structure Changes:**
```
├── assets/
│   └── vendor/
│       ├── tailwind/
│       │   └── tailwind-play.js
│       └── fonts/
│           ├── roboto-regular.woff2
│           └── [other font files]
├── docs/
│   └── sri-maintenance.md
├── index.html (modified)
└── sw.js (modified)
```

**CDN Resources Requiring SRI:**
1. Font Awesome 6.4.0 - https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css
2. RPG Awesome 0.2.0 - https://cdn.jsdelivr.net/npm/rpg-awesome@0.2.0/css/rpg-awesome.min.css
3. Material Icons - https://fonts.googleapis.com/icon?family=Material+Icons

**Resources to Self-Host:**
1. Tailwind CSS Play CDN - https://cdn.tailwindcss.com
2. Google Fonts (Roboto family)

**SRI Hash Algorithm:**
- Use SHA-384 or SHA-512 for hash generation (SHA-512 preferred for maximum security)
- Format: `integrity="sha512-[base64-encoded-hash]"`

**Service Worker Cache Strategy:**
- Existing strategy: cache-first with network fallback
- Cache version bump forces immediate re-download of all resources
- Pre-cache all self-hosted resources on Service Worker install

**Testing Requirements:**
1. Online mode - verify all resources load correctly
2. Offline mode - verify Service Worker serves cached resources
3. Browser console - verify no CORS errors
4. Browser console - verify no SRI validation errors
5. PWA installation - verify install prompt and home screen functionality
6. Resource tampering simulation - verify SRI validation fails appropriately
7. Self-hosted resources - verify correct MIME types and successful loading

**Documentation Requirements:**
- Hash generation commands and examples
- Process for updating CDN resource versions
- List of self-hosted vs CDN resources with rationale
- Version numbers and URLs for all external dependencies
- Instructions for testing SRI implementation
