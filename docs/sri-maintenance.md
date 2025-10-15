# SRI Maintenance Documentation

## 1. Overview

### Purpose of Subresource Integrity (SRI)

Subresource Integrity (SRI) is a security feature that enables browsers to verify that resources fetched from Content Delivery Networks (CDNs) haven't been tampered with. It works by comparing a cryptographic hash of the fetched resource against a hash specified in the HTML.

**How SRI Protects Against Supply Chain Attacks:**
- Prevents compromised CDNs from injecting malicious code into your application
- Ensures resources loaded from external sources match exactly what you expect
- Causes resources to fail loading if they've been modified (security over functionality)
- Provides cryptographic verification using SHA-512 hashing algorithm

### Hybrid Security Approach Rationale

This application implements a **hybrid security model** combining two strategies:

1. **Self-Hosted Critical Resources**: JavaScript execution and font files are served locally
   - Eliminates CDN dependency for offline-first PWA functionality
   - Removes single point of failure for critical resources
   - Protects against JavaScript injection attacks at the source

2. **CDN Resources with SRI Protection**: Icon libraries remain on CDN but with integrity validation
   - Benefits from CDN caching and global distribution networks
   - Lower injection risk (CSS-only resources)
   - SRI hashes prevent tampering

This approach balances security (self-hosting critical dependencies), performance (CDN for cacheable assets), and offline reliability (PWA functionality).

---

## 2. Current Resource Inventory

### Self-Hosted Resources

| Resource | Version | Local Path | Source URL | Purpose |
|----------|---------|------------|------------|---------|
| Tailwind CSS Play CDN | Latest (snapshot) | `assets/vendor/tailwind/tailwind-play.js` | https://cdn.tailwindcss.com | Utility-first CSS framework |
| Roboto Regular | Latest | `assets/vendor/fonts/roboto-regular.woff2` | Google Fonts API | Body text font |
| Roboto Bold | Latest | `assets/vendor/fonts/roboto-bold.woff2` | Google Fonts API | Bold text font |
| Cinzel Regular (400) | Latest | `assets/vendor/fonts/cinzel-regular.woff2` | Google Fonts API | Header font (regular weight) |
| Cinzel SemiBold (600) | Latest | `assets/vendor/fonts/cinzel-semibold.woff2` | Google Fonts API | Header font (semibold weight) |
| Cinzel Bold (700) | Latest | `assets/vendor/fonts/cinzel-bold.woff2` | Google Fonts API | Header font (bold weight) |
| Fonts CSS | N/A | `assets/vendor/fonts/fonts.css` | Local @font-face declarations | Font loading stylesheet |

**Note:** Self-hosted resources do NOT use SRI hashes because they are served from the same origin as the application.

### CDN Resources with SRI Protection

| Resource | Version | CDN URL | SRI Hash (SHA-512) | Purpose |
|----------|---------|---------|-------------------|---------|
| Font Awesome | 6.4.0 | https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css | `sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==` | General icon library |
| RPG Awesome | 0.2.0 | https://cdnjs.cloudflare.com/ajax/libs/rpg-awesome/0.2.0/css/rpg-awesome.min.css | `sha512-01mG/8rtthZxcE/oLY/1aVBq0UHYxd3r9MgSi33zFQ190gj+BfHY8XeoFiErGyVt1pE68U6InjMq+xkVTSf6yg==` | RPG-themed icon library |
| Material Icons | Latest | https://fonts.googleapis.com/icon?family=Material+Icons | `sha512-elM5AP2RRMpGuL4BTMqhieJeSlgasvy9h1aLrm7Xt3+7ULZnCevuXN4l/6OHNS1QvxFMgTyLpy9MLp2o841toQ==` | Material Design icons |

**Note:** All CDN resources include `crossorigin="anonymous"` attribute to enable CORS for SRI validation.

---

## 3. Hash Generation Process

### Method 1: Using OpenSSL (Command Line)

**Prerequisites:**
- OpenSSL installed on your system
- Downloaded copy of the resource file

**Steps:**

1. **Download the resource file:**
   ```bash
   curl -o resource.css https://example.com/path/to/resource.css
   ```

2. **Generate SHA-512 hash and encode as Base64:**
   ```bash
   openssl dgst -sha512 -binary resource.css | openssl base64 -A
   ```

3. **Format the integrity attribute:**
   ```
   integrity="sha512-[OUTPUT_FROM_STEP_2]"
   ```

**Example:**
```bash
# Download Font Awesome CSS
curl -o all.min.css https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css

# Generate hash
openssl dgst -sha512 -binary all.min.css | openssl base64 -A

# Output: iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==

# Format for HTML
integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
```

### Method 2: Using SRI Hash Generator (Online Tool)

**Website:** https://www.srihash.org/

**Steps:**

1. Enter the CDN URL in the input field
2. Click "Hash!"
3. Copy the generated `<link>` or `<script>` tag with integrity attribute
4. Extract the `integrity="sha512-..."` value

**Advantages:**
- No command-line tools required
- Automatically fetches the resource
- Provides ready-to-use HTML snippet
- Supports multiple hash algorithms (SHA-256, SHA-384, SHA-512)

**Disadvantages:**
- Requires internet connection
- Trusts third-party service to generate hash
- Less suitable for automated workflows

**Recommendation:** Use OpenSSL for production deployments; use srihash.org for quick verification during development.

---

## 4. Updating CDN Resources

When a CDN resource needs to be updated (e.g., Font Awesome 6.4.0 → 6.5.0), follow this 5-step process:

### Step 1: Download New Version

Download the new version of the resource to verify its contents before deployment.

```bash
curl -o new-resource.css https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css
```

**Verification:**
- Inspect the file to ensure it's the expected resource (not a 404 page or redirect)
- Check file size is reasonable (compare to previous version)
- Optionally: test the resource locally before proceeding

### Step 2: Generate New SRI Hash

Use OpenSSL or srihash.org to generate the SHA-512 hash for the new version.

```bash
openssl dgst -sha512 -binary new-resource.css | openssl base64 -A
```

**Important:** Always use SHA-512 (not SHA-256 or SHA-384) for maximum security.

### Step 3: Update index.html

Update the `<link>` or `<script>` tag in `index.html` with:
- New CDN URL (with updated version number)
- New integrity hash from Step 2
- Keep `crossorigin="anonymous"` attribute

**Before:**
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
      crossorigin="anonymous">
```

**After:**
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      integrity="sha512-NEW_HASH_HERE"
      crossorigin="anonymous">
```

### Step 4: Bump Service Worker Cache Version

Update the cache version in `sw.js` to force all clients to re-download resources with the new hash.

**File:** `sw.js` (line 2)

**Change:**
```javascript
// Before
const CACHE_NAME = 'goblinstadt-cache-v5';

// After
const CACHE_NAME = 'goblinstadt-cache-v6';
```

**Rationale:** Incrementing the cache version ensures:
- Service Worker installs fresh cache with new CDN resource
- Old cache is deleted during activation
- All users get the updated resource with new SRI hash
- No stale cached resources with old hashes

### Step 5: Test Thoroughly

Perform comprehensive testing before deploying the update:

1. **Clear browser cache and Service Worker:**
   - DevTools → Application → Clear storage → Clear site data

2. **Verify resource loads successfully:**
   - Open index.html in browser
   - Check Network tab: resource loads with 200 status
   - Check Console: no SRI integrity errors

3. **Test offline mode:**
   - DevTools → Network → Throttling → Offline
   - Reload page
   - Verify resource serves from Service Worker cache

4. **Test SRI validation:**
   - Temporarily change hash to incorrect value
   - Reload page
   - Verify browser console shows SRI error
   - Verify resource fails to load
   - Revert hash to correct value

5. **Visual regression testing:**
   - Verify icons/styles render identically to previous version
   - Test on multiple browsers (Chrome, Safari)

**Only deploy after all tests pass.**

---

## 5. Updating Self-Hosted Resources

Self-hosted resources (Tailwind CSS and fonts) don't use SRI hashes but still require careful update procedures.

### Updating Tailwind CSS Play CDN Script

**Current File:** `assets/vendor/tailwind/tailwind-play.js`

**Update Process:**

1. **Download latest version:**
   ```bash
   curl -o tailwind-play.js https://cdn.tailwindcss.com
   ```

2. **Replace existing file:**
   ```bash
   cp tailwind-play.js Z:\vibe\GoblinstadtRessManager\assets\vendor\tailwind\tailwind-play.js
   ```

3. **Verify inline config compatibility:**
   - Open `index.html`
   - Check that inline Tailwind config (lines 24-41) still works with new version
   - Test dark mode, custom colors, and responsive layout

4. **Bump Service Worker cache version:**
   ```javascript
   // sw.js line 2
   const CACHE_NAME = 'goblinstadt-cache-v6'; // Increment version
   ```

5. **Test thoroughly:**
   - Clear browser cache and Service Worker
   - Verify Tailwind utility classes work correctly
   - Test offline mode (script should load from cache)
   - Verify dark mode and custom theme colors render correctly

**Important:** Tailwind CSS Play CDN is a development tool. For production, consider using a specific Tailwind CSS version with a build process.

### Updating Google Fonts

**Current Files:**
- `assets/vendor/fonts/roboto-regular.woff2`
- `assets/vendor/fonts/roboto-bold.woff2`
- `assets/vendor/fonts/cinzel-regular.woff2`
- `assets/vendor/fonts/cinzel-semibold.woff2`
- `assets/vendor/fonts/cinzel-bold.woff2`
- `assets/vendor/fonts/fonts.css`

**Update Process:**

1. **Access Google Fonts CSS API:**
   ```
   https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Cinzel:wght@400;600;700&display=swap
   ```

2. **Extract WOFF2 URLs from CSS response:**
   - Open URL in browser
   - View page source
   - Find `@font-face` declarations
   - Copy WOFF2 URLs for each font weight

3. **Download updated WOFF2 files:**
   ```bash
   curl -o roboto-regular.woff2 [EXTRACTED_URL_FROM_STEP_2]
   # Repeat for all 5 font files
   ```

4. **Replace existing font files:**
   ```bash
   cp roboto-regular.woff2 Z:\vibe\GoblinstadtRessManager\assets\vendor\fonts\
   # Repeat for all 5 font files
   ```

5. **Update fonts.css if needed:**
   - Open `assets/vendor/fonts/fonts.css`
   - Verify file paths still match: `url('./roboto-regular.woff2')`
   - Verify font-family, font-weight, font-style declarations are correct

6. **Bump Service Worker cache version:**
   ```javascript
   // sw.js line 2
   const CACHE_NAME = 'goblinstadt-cache-v6'; // Increment version
   ```

7. **Test thoroughly:**
   - Clear browser cache and Service Worker
   - Verify Cinzel font renders in header and category names
   - Verify Roboto font renders in body text
   - Check DevTools Network tab: fonts load from local server
   - Test offline mode (fonts should load from cache)

**Note:** Font files rarely change for specific versions. Only update if you're adding new weights or switching font families.

### Service Worker Cache Version Bump Requirement

**CRITICAL:** Every time you update a self-hosted resource, you MUST bump the Service Worker cache version.

**Why:** The Service Worker uses a cache-first strategy for local resources. Without a cache version bump:
- Users will continue loading old cached versions indefinitely
- Updates will never reach users
- Offline mode will serve stale resources

**How to Bump:**
```javascript
// File: sw.js, line 2
const CACHE_NAME = 'goblinstadt-cache-v6'; // Increment number
```

**Cache Lifecycle:**
1. Service Worker detects new cache name during install
2. Creates new cache with incremented version
3. Pre-caches all resources (including updated files)
4. During activation: deletes old cache versions
5. All clients now use new cache with updated resources

---

## 6. Testing SRI Implementation

### Online Mode Resource Loading

**Purpose:** Verify all resources load successfully when network is available.

**Steps:**

1. Open index.html in browser (Chrome or Safari)
2. Open DevTools → Network tab
3. Reload page (Ctrl+R or Cmd+R)
4. Verify the following resources load with 200 status:
   - **Self-hosted:**
     - `assets/vendor/tailwind/tailwind-play.js`
     - `assets/vendor/fonts/fonts.css`
     - `assets/vendor/fonts/roboto-regular.woff2`
     - `assets/vendor/fonts/roboto-bold.woff2`
     - `assets/vendor/fonts/cinzel-regular.woff2`
     - `assets/vendor/fonts/cinzel-semibold.woff2`
     - `assets/vendor/fonts/cinzel-bold.woff2`
   - **CDN with SRI:**
     - Font Awesome CSS
     - RPG Awesome CSS
     - Material Icons CSS
5. Check browser console for **zero errors**
6. Verify Network tab shows self-hosted resources served from local origin
7. Verify Network tab shows CDN resources served from external origins

**Expected Result:** All resources load successfully, no errors in console.

### Offline Mode Functionality

**Purpose:** Verify PWA works completely offline using Service Worker cache.

**Steps:**

1. Open index.html in browser
2. Wait for Service Worker to install and activate
3. Open DevTools → Application → Service Workers
4. Verify Service Worker status shows "activated and is running"
5. Open DevTools → Network tab
6. Select Throttling → Offline
7. Reload page (Ctrl+R or Cmd+R)
8. Verify page loads completely from Service Worker cache
9. Check Network tab: all resources show "(ServiceWorker)" as source
10. Verify **no network requests** attempted (all served from cache)
11. Check browser console for **zero errors**
12. Verify app functionality:
    - Icons render correctly (Font Awesome, RPG Awesome, Material Icons)
    - Fonts render correctly (Cinzel in header, Roboto in body)
    - Tailwind CSS styles apply (dark mode, colors, responsive layout)
    - All resource tracking features work

**Expected Result:** App functions identically in offline mode, all resources from cache, zero errors.

### Browser Console Checks

**What to Check:**

1. **No SRI validation errors:**
   - Format: `Failed to find a valid digest in the 'integrity' attribute`
   - Indicates SRI hash mismatch between expected and actual resource

2. **No CORS errors:**
   - Format: `Access to ... has been blocked by CORS policy`
   - Indicates `crossorigin="anonymous"` attribute causing issues

3. **No resource loading errors:**
   - Format: `Failed to load resource: the server responded with a status of 404`
   - Indicates broken URLs or missing files

4. **No Service Worker errors:**
   - Format: `ServiceWorker registration failed`
   - Indicates Service Worker cache issues

**How to Check:**
- Open DevTools → Console tab
- Filter for Errors (red "X" icon)
- Verify zero errors after page load and Service Worker activation

### Tampering Simulation (Security Verification)

**Purpose:** Verify SRI hashes correctly reject tampered CDN resources.

**Steps:**

1. Open `index.html` in code editor
2. Find a CDN resource with SRI hash (e.g., Font Awesome on line 12)
3. Modify one character in the integrity hash:
   ```html
   <!-- Before -->
   integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="

   <!-- After (changed 'i' to 'x' at beginning) -->
   integrity="sha512-xecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
   ```
4. Save file
5. Clear browser cache (Ctrl+Shift+Delete)
6. Reload index.html in browser
7. Open DevTools → Console tab
8. **Verify SRI integrity error appears:**
   ```
   Failed to find a valid digest in the 'integrity' attribute for resource
   'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
   with computed SHA-512 integrity 'iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=='.
   The resource has been blocked.
   ```
9. **Verify affected resource fails to load:**
   - DevTools → Network tab shows resource with "blocked" status
   - Icons from that library don't render in UI
10. **Revert hash to correct value**
11. Reload page
12. Verify resource loads successfully again

**Expected Result:**
- Incorrect hash causes resource to be blocked by browser
- SRI error appears in console
- Resource fails to load (security working as intended)
- Correct hash allows resource to load normally

**Security Note:** This is the correct behavior! SRI is designed to fail visibly rather than load potentially compromised resources. There is **no fallback by design** - if a hash doesn't match, the resource is blocked for security.

---

## 7. Rationale for Hybrid Approach

### Why Self-Host Tailwind CSS and Fonts?

**Tailwind CSS:**
- **Security:** JavaScript execution poses highest injection risk; self-hosting eliminates CDN attack vector
- **Offline-First:** PWA must work offline; CDN dependency would break core functionality
- **Reliability:** Single point of failure eliminated for critical rendering resource
- **Performance:** No CDN latency on repeated visits; Service Worker serves from cache instantly

**Google Fonts:**
- **Security:** Font files are binary resources with lower injection risk, but still worth self-hosting
- **Offline-First:** Typography is core to UI; must render without external dependencies
- **Performance:** WOFF2 files cached locally load faster than CDN on repeat visits
- **Privacy:** Self-hosting eliminates Google's tracking of font requests

### Why Keep Icons on CDN with SRI?

**Font Awesome, RPG Awesome, Material Icons:**
- **Lower Risk:** CSS-only resources (no JavaScript execution)
- **SRI Protection:** Cryptographic hashes prevent tampering; compromised CDN resources won't load
- **CDN Benefits:** Icon libraries benefit from global CDN caching and distribution
- **File Size:** Icon libraries can be large; CDN browser caching benefits all sites using them
- **Update Flexibility:** Icons update less frequently than core dependencies; SRI allows CDN benefits without security tradeoff

### Security vs Performance Tradeoff

**Decision Matrix:**

| Resource Type | Security Risk | Offline Need | Decision |
|---------------|---------------|--------------|----------|
| JavaScript (Tailwind) | **High** | **Critical** | **Self-Host** |
| Fonts (Cinzel, Roboto) | Low | **Critical** | **Self-Host** |
| Icon CSS (Font Awesome) | Low | Moderate | **CDN + SRI** |
| Icon CSS (RPG Awesome) | Low | Moderate | **CDN + SRI** |
| Icon CSS (Material) | Low | Moderate | **CDN + SRI** |

**Hybrid Approach Benefits:**
- Maximum security for highest-risk resources (JavaScript self-hosted)
- Offline reliability for critical PWA functionality (fonts, JavaScript self-hosted)
- Performance optimization for cacheable assets (icons on CDN with SRI)
- Balanced file size impact (large icon libraries leverage CDN caching)

---

## 8. Security Considerations

### SRI Failure Behavior: No Fallback by Design

**Important:** When an SRI hash validation fails, the browser **intentionally blocks** the resource from loading. There is **no fallback mechanism**, and this is **the correct security behavior**.

**Why No Fallback?**
- If a resource fails SRI validation, it means the content doesn't match the expected hash
- This could indicate:
  - CDN compromise (attacker modified the resource)
  - Man-in-the-middle attack (resource tampered during transmission)
  - CDN error (wrong version served)
- Loading the resource anyway would defeat the purpose of SRI
- **Security always takes precedence over functionality**

**User Impact:**
- If a CDN resource fails SRI validation, the associated functionality breaks
- Examples:
  - Font Awesome SRI failure → icons don't render
  - Tailwind CSS SRI failure → styling breaks (but Tailwind is self-hosted, so this won't happen)
- Users will see a broken UI, but their security is protected

**Developer Response:**
- Monitor browser console for SRI errors
- If SRI errors appear:
  1. Verify the CDN URL is correct
  2. Regenerate the SRI hash from the actual CDN resource
  3. Update `index.html` with the correct hash
  4. Bump Service Worker cache version
  5. Deploy update
- Never disable SRI or bypass hash validation

### Best Practices for SRI Security

1. **Always Use SHA-512:**
   - SHA-512 provides maximum cryptographic security
   - Avoid SHA-256 or SHA-384 unless absolutely necessary for compatibility

2. **Verify Hashes from Trusted Sources:**
   - Generate hashes yourself using OpenSSL
   - Don't copy hashes from untrusted websites or forums
   - When using srihash.org, verify the resource URL is correct before generating hash

3. **Keep CDN URLs Versioned:**
   - Use specific versions: `font-awesome/6.4.0/` (not `font-awesome/latest/`)
   - Versioned URLs ensure hash remains valid
   - "Latest" URLs can change content, breaking SRI validation

4. **Document All SRI Hashes:**
   - Maintain this inventory (Section 2) with current hashes
   - Document hash generation date and method
   - Track which version of each resource is in production

5. **Test SRI Validation Regularly:**
   - Periodically run tampering simulation (Section 6)
   - Verify SRI errors appear in console when hashes are incorrect
   - Ensure development team understands SRI failure behavior

6. **Monitor for SRI Errors in Production:**
   - Set up error logging to track SRI validation failures
   - SRI errors may indicate:
     - CDN changed resource without version bump
     - Attack attempt on CDN
     - Client-side tampering (browser extension, malware)
   - Investigate all SRI errors immediately

### Service Worker and SRI Interaction

**Important Consideration:** The Service Worker caches CDN resources **after** SRI validation.

**Cache Flow:**
1. Browser requests CDN resource (e.g., Font Awesome CSS)
2. Browser fetches resource from CDN
3. **SRI validation occurs BEFORE caching**
4. If hash matches: resource is cached by Service Worker
5. If hash fails: resource is blocked, NOT cached

**Security Benefit:**
- Service Worker cache cannot store tampered resources
- Once cached, resources serve from local cache (no SRI needed for cached resources)
- Cache invalidation (version bump) forces fresh SRI validation on update

**Implication for Offline Mode:**
- Offline mode serves pre-validated resources from cache
- No SRI re-validation needed when serving from cache
- Updating CDN resource requires cache version bump to trigger re-validation

### Limitations of SRI

**What SRI Does NOT Protect Against:**

1. **Initial Page Load (HTML):**
   - SRI protects external resources (CSS, JS)
   - index.html itself has no SRI protection
   - Mitigation: Serve HTML over HTTPS with strong security headers

2. **Inline Scripts and Styles:**
   - SRI only validates external resources
   - Inline `<script>` and `<style>` tags are not protected by SRI
   - Mitigation: Use Content Security Policy (CSP) to restrict inline code

3. **Dynamic Resource Loading:**
   - SRI works for static `<link>` and `<script>` tags
   - Dynamically loaded resources (e.g., `fetch()`, `XMLHttpRequest`) don't automatically use SRI
   - Mitigation: This static PWA doesn't use dynamic resource loading

4. **Resource Availability:**
   - SRI doesn't protect against CDN outages
   - If CDN is down, resource fails to load (even with correct hash)
   - Mitigation: Service Worker caches CDN resources for offline access

**Future Enhancements:**
- Implement Content Security Policy (CSP) headers to complement SRI
- Consider self-hosting all resources if CDN reliability becomes a concern
- Set up automated SRI hash validation in CI/CD pipeline

---

## Maintenance Checklist

Use this checklist when updating resources:

### Updating CDN Resource
- [ ] Download new version of resource
- [ ] Generate SHA-512 hash using OpenSSL or srihash.org
- [ ] Update CDN URL in index.html (if version changed)
- [ ] Update integrity hash in index.html
- [ ] Verify `crossorigin="anonymous"` attribute is present
- [ ] Bump Service Worker cache version in sw.js
- [ ] Update this documentation (Section 2 inventory table)
- [ ] Clear browser cache and Service Worker
- [ ] Test online mode (resource loads, no SRI errors)
- [ ] Test offline mode (resource serves from cache)
- [ ] Test tampering simulation (incorrect hash causes block)
- [ ] Commit changes to version control

### Updating Self-Hosted Resource
- [ ] Download new version of resource
- [ ] Replace existing file in `assets/vendor/` directory
- [ ] Verify file paths in HTML are correct
- [ ] Bump Service Worker cache version in sw.js
- [ ] Update this documentation (Section 2 inventory table)
- [ ] Clear browser cache and Service Worker
- [ ] Test online mode (resource loads from local server)
- [ ] Test offline mode (resource serves from cache)
- [ ] Verify visual rendering (no UI regressions)
- [ ] Commit changes to version control

### Quarterly Security Audit
- [ ] Review all CDN resource versions (check for security updates)
- [ ] Verify all SRI hashes are still valid (run tampering simulation)
- [ ] Test PWA offline functionality
- [ ] Review browser console for any SRI or CORS errors
- [ ] Update documentation with any changes
- [ ] Document audit date and findings

---

## Additional Resources

- **SRI Specification:** https://www.w3.org/TR/SRI/
- **SRI Hash Generator:** https://www.srihash.org/
- **MDN Web Docs - Subresource Integrity:** https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity
- **Can I Use SRI:** https://caniuse.com/subresource-integrity (browser compatibility)
- **OWASP - Third Party JavaScript Management:** https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Javascript_Management_Cheat_Sheet.html

---

**Document Version:** 1.0
**Last Updated:** 2025-10-15
**Maintained By:** Development Team
