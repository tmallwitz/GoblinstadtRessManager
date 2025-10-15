# Specification: Fix Missing SRI on CDN Resources

## Goal
Eliminate supply chain security vulnerabilities in the Goblinstadt Ressourcen Manager PWA by implementing a hybrid security approach: self-hosting critical JavaScript dependencies (Tailwind CSS) and CSS resources (Google Fonts), while adding Subresource Integrity (SRI) hashes to remaining CDN-hosted icon libraries (Font Awesome, RPG Awesome, Material Icons).

## User Stories
- As a user, I want the app to be protected from compromised CDN attacks so that my data and experience remain secure
- As a user, I want the app to fail visibly rather than load tampered resources so that I am aware of potential security issues
- As an offline-first PWA user, I want critical resources self-hosted so that the app works reliably without CDN dependencies
- As a developer, I want clear documentation on SRI maintenance so that I can safely update dependencies in the future

## Core Requirements

### Functional Requirements
- Self-host Tailwind CSS Play CDN script locally in `/assets/vendor/tailwind/` directory
- Self-host Google Fonts (Roboto and Cinzel families) locally in `/assets/vendor/fonts/` directory
- Generate and add SRI integrity hashes for Font Awesome 6.4.0 CDN resource
- Generate and add SRI integrity hashes for RPG Awesome 0.2.0 CDN resource
- Generate and add SRI integrity hashes for Material Icons CDN resource
- Add `crossorigin="anonymous"` attribute to all CDN resources with SRI hashes
- Update `index.html` to reference self-hosted resources instead of CDN URLs for Tailwind and fonts
- Bump Service Worker cache version from `goblinstadt-cache-v4` to `goblinstadt-cache-v5`
- Update Service Worker `urlsToCache` array to include self-hosted files and remove CDN URLs for self-hosted resources
- Create comprehensive documentation file at `docs/sri-maintenance.md`

### Non-Functional Requirements

#### Security
- Prevent supply chain attacks via CDN compromise using cryptographic hash verification
- Ensure tampered CDN resources fail to load (no fallback - security over functionality)
- Protect Service Worker cache from storing malicious content
- Use SHA-512 hashing algorithm for maximum security (preferred over SHA-384 or SHA-256)
- Eliminate single points of failure by self-hosting critical dependencies

#### Performance
- Self-hosted resources load from local server (faster in offline mode, no CDN latency)
- CDN-hosted icon libraries benefit from browser caching and global CDN networks
- Service Worker pre-caches all self-hosted resources during installation for instant offline access
- Cache version bump forces immediate re-download to ensure all clients get secured resources

#### Compatibility
- Maintain full PWA functionality (home screen installation, offline mode)
- Ensure offline-first architecture continues to work with self-hosted resources
- Verify no CORS issues introduced by `crossorigin="anonymous"` attribute
- Test on both iOS Safari and Android Chrome browsers
- Ensure all icon libraries continue to render correctly

#### Maintainability
- Document exact versions of all external dependencies for reproducibility
- Provide step-by-step hash generation process for future updates
- Clearly distinguish self-hosted vs CDN resources with rationale
- Include testing instructions for verifying SRI implementation

## Visual Design
No visual design changes required. This is a security hardening implementation that maintains existing UI/UX.

## Reusable Components

### Existing Code to Leverage
- Service Worker cache strategy pattern from `sw.js` (lines 6-21: `urlsToCache` array)
- Service Worker cache versioning pattern from `sw.js` (line 2: `CACHE_NAME` constant)
- Service Worker installation and activation lifecycle from `sw.js` (lines 24-77)
- HTML external resource loading pattern from `index.html` (lines 11-23)

### New Components Required
- `/assets/vendor/` directory structure for self-hosted dependencies
- `/docs/` directory for maintenance documentation
- SRI hash attributes (new security feature not previously implemented)
- `crossorigin="anonymous"` attributes for CDN resources with SRI

## Technical Approach

### File Structure Changes
```
Z:\vibe\GoblinstadtRessManager\
├── assets/                     (NEW DIRECTORY)
│   └── vendor/                 (NEW DIRECTORY)
│       ├── tailwind/           (NEW DIRECTORY)
│       │   └── tailwind-play.js   (NEW FILE - self-hosted Tailwind CSS)
│       └── fonts/              (NEW DIRECTORY)
│           ├── roboto-regular.woff2   (NEW FILE)
│           ├── roboto-bold.woff2      (NEW FILE)
│           ├── cinzel-regular.woff2   (NEW FILE)
│           ├── cinzel-semibold.woff2  (NEW FILE)
│           ├── cinzel-bold.woff2      (NEW FILE)
│           └── fonts.css              (NEW FILE - local @font-face declarations)
├── docs/                       (NEW DIRECTORY)
│   └── sri-maintenance.md      (NEW FILE)
├── index.html                  (MODIFIED)
└── sw.js                       (MODIFIED)
```

### Self-Hosted Resources Implementation

#### Tailwind CSS (index.html lines 22-41)
- **Current**: `<script src="https://cdn.tailwindcss.com"></script>` with inline config
- **Change to**: `<script src="assets/vendor/tailwind/tailwind-play.js"></script>` with same inline config
- **Rationale**: Script injection is high security risk; self-hosting eliminates CDN attack vector
- **Download source**: https://cdn.tailwindcss.com (save as `tailwind-play.js`)
- **Note**: Preserve existing inline Tailwind config (lines 24-41) exactly as-is

#### Google Fonts (index.html lines 14-15)
- **Current**: Two CDN links for Cinzel font and Material Icons stylesheet
- **Change to**: Single local stylesheet reference `<link rel="stylesheet" href="assets/vendor/fonts/fonts.css">`
- **Rationale**: Offline-first PWA should not depend on external font CDNs; improves load time
- **Required font files**:
  - Roboto: regular, bold (used implicitly by browser defaults)
  - Cinzel: regular (400), semibold (600), bold (700) - specified in line 15
- **fonts.css content**: Create @font-face declarations for all font files with relative paths
- **Download source**: Use Google Fonts CSS API to identify exact WOFF2 URLs, then download files

### SRI Implementation for CDN Resources

#### Font Awesome 6.4.0 (index.html line 12)
- **Current**: `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">`
- **Change to**: Add `integrity="sha512-[HASH]" crossorigin="anonymous"`
- **Rationale**: Icon library can remain on CDN for caching benefits; SRI prevents tampering
- **Hash generation**: Download CSS file, generate SHA-512 hash, encode as base64

#### RPG Awesome 0.2.0 (index.html line 13)
- **Current**: `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/rpg-awesome/0.2.0/css/rpg-awesome.min.css">`
- **Change to**: Add `integrity="sha512-[HASH]" crossorigin="anonymous"`
- **Rationale**: Specialized icon library benefits from CDN; low risk with SRI protection

#### Material Icons (index.html line 14)
- **Current**: `<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">`
- **Change to**: Add `integrity="sha512-[HASH]" crossorigin="anonymous"`
- **Rationale**: Google-hosted icons with SRI protection
- **Note**: CSS content may vary slightly; generate hash from actual fetched content

### Service Worker Updates (sw.js)

#### Cache Version Bump (line 2)
- **Current**: `const CACHE_NAME = 'goblinstadt-cache-v4';`
- **Change to**: `const CACHE_NAME = 'goblinstadt-cache-v5';`
- **Rationale**: Forces all clients to re-download resources with new SRI attributes and self-hosted files

#### Cache List Updates (lines 6-21)
- **Remove from urlsToCache**:
  - `'https://cdn.tailwindcss.com'` (now self-hosted)
  - `'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap'` (now self-hosted)
- **Add to urlsToCache**:
  - `'./assets/vendor/tailwind/tailwind-play.js'`
  - `'./assets/vendor/fonts/fonts.css'`
  - `'./assets/vendor/fonts/roboto-regular.woff2'`
  - `'./assets/vendor/fonts/roboto-bold.woff2'`
  - `'./assets/vendor/fonts/cinzel-regular.woff2'`
  - `'./assets/vendor/fonts/cinzel-semibold.woff2'`
  - `'./assets/vendor/fonts/cinzel-bold.woff2'`
- **Keep in urlsToCache** (with SRI in HTML):
  - Font Awesome CDN URL
  - RPG Awesome CDN URL
  - Material Icons CDN URL

### Documentation File Structure (docs/sri-maintenance.md)

The documentation file must include:
1. **Overview**: Purpose of SRI and hybrid approach rationale
2. **Current Resource Inventory**: Table listing all external resources, their status (self-hosted vs CDN), versions, and SRI hashes
3. **Hash Generation Process**: Step-by-step commands for generating SHA-512 SRI hashes
   - Using OpenSSL: `openssl dgst -sha512 -binary file.css | openssl base64 -A`
   - Using online tools: Mention srihash.org for convenience
   - Format: `integrity="sha512-[hash]"`
4. **Updating CDN Resources**: Process for updating CDN resource versions
   - Step 1: Download new version
   - Step 2: Generate new SRI hash
   - Step 3: Update index.html with new URL and hash
   - Step 4: Bump Service Worker cache version
   - Step 5: Test thoroughly
5. **Updating Self-Hosted Resources**: Process for updating self-hosted dependencies
   - Tailwind CSS update process
   - Font files update process
   - Service Worker cache version bump requirement
6. **Testing SRI Implementation**: Verification steps
   - Online mode resource loading
   - Offline mode functionality
   - Browser console checks (no CORS/SRI errors)
   - Simulating tampering (modify hash to verify failure)
7. **Rationale for Hybrid Approach**: Explain why Tailwind/fonts are self-hosted vs why icons remain on CDN
8. **Security Considerations**: Notes on SRI failure behavior (no fallback by design)

## Out of Scope

### Explicitly Excluded
- Other security concerns (localStorage injection vulnerabilities, input validation, XSS protection)
- Modifications to `manifest.json` (PWA manifest)
- Modifications to app icon files (`icon-192x192.png`, `icon-512x512.png`)
- Modifications to `app.js` (application logic)
- Modifications to `styles.css` (application styles)
- Changes to application functionality or business logic
- UI/UX improvements or redesigns
- Performance optimizations beyond security requirements
- Code refactoring unrelated to security fix
- Testing framework setup or unit tests
- Build process or bundler introduction
- Additional security features (CSP headers, HTTPS enforcement, etc.)

### Out of Scope Items
- Content Security Policy (CSP) implementation (future enhancement)
- HTTPS enforcement for local development (infrastructure concern)
- Automated SRI hash generation build step (future enhancement)
- Subresource integrity for dynamically loaded resources (not applicable to this static app)
- Alternative CDN providers or CDN failover strategies
- Font subsetting or optimization (performance optimization)
- Web font loading optimization strategies (performance optimization)

## Success Criteria

### Measurable Outcomes
- All five external resources (3 CDN with SRI, 2 self-hosted) load successfully in online mode
- Service Worker successfully caches all self-hosted resources on installation
- Browser console shows zero CORS errors related to `crossorigin="anonymous"` attribute
- Browser console shows zero SRI validation errors with valid hashes
- PWA installation prompt and home screen functionality work identically to before
- Offline mode serves all resources from cache without network requests
- Tampering simulation (modifying SRI hash) causes resource load failure (verified security)

### Performance Metrics
- Page load time in online mode: No regression compared to baseline (CDN latency vs local latency tradeoff is neutral)
- Page load time in offline mode: Improvement expected (all resources local, no CDN dependency)
- Service Worker cache size: Increase expected (self-hosted files added), should remain under 5MB total

### User Experience Goals
- No visual changes to UI (icons, fonts, layout remain identical)
- No behavioral changes to PWA functionality (installation, offline mode work identically)
- Improved security posture (invisible to user but protects against supply chain attacks)
- Offline reliability improvement (self-hosted critical resources eliminate CDN failure point)

### Testing Validation Checklist
- [ ] Font Awesome icons render correctly in all four category tabs
- [ ] RPG Awesome icons render correctly (if used in UI)
- [ ] Material Icons render correctly (if used in UI)
- [ ] Cinzel font displays correctly in header and category names
- [ ] Roboto font displays correctly in body text
- [ ] Tailwind CSS utility classes function correctly (dark mode, colors, responsive layout)
- [ ] PWA installs to home screen on iOS Safari
- [ ] PWA installs to home screen on Android Chrome
- [ ] Offline mode loads all resources from cache (verified via Network tab throttling)
- [ ] Browser console shows no errors in online mode
- [ ] Browser console shows no errors in offline mode
- [ ] Simulating SRI tampering causes resource load failure with integrity error in console
- [ ] Service Worker cache v5 is created and v4 is deleted on first load after update
- [ ] Self-hosted files are served with correct MIME types (application/javascript for .js, text/css for .css, font/woff2 for fonts)
