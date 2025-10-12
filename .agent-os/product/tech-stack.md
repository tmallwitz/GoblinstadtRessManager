# Technical Stack

## Application Framework
**None (Vanilla JavaScript ES6+)**

The application uses no framework, relying on native browser APIs and vanilla JavaScript for maximum simplicity, minimal bundle size, and optimal performance on mobile devices.

## Database System
**localStorage (Client-Side Browser Storage)**

All data is stored locally on the user's device using the Web Storage API. No server-side database is required as this is a purely client-side application.

## JavaScript Framework
**None (Vanilla JavaScript)**

Modern ES6+ JavaScript without external dependencies. All functionality is implemented using native DOM APIs, Web APIs, and standard JavaScript language features.

## Import Strategy
**None (Direct Script Loading)**

Simple `<script>` tag inclusion without module bundling or import maps. All code is in standalone JavaScript files loaded directly by the browser.

## CSS Framework
**Custom CSS with CSS Variables**

Hand-written CSS using CSS custom properties (variables) for theming. No external CSS framework to minimize payload and maintain full control over mobile optimization.

## UI Component Library
**None (Custom Components)**

All UI components are built from scratch using native HTML elements with custom styling and vanilla JavaScript event handling.

## Fonts Provider
**System Fonts**

Uses `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif` - system font stack for optimal performance and zero external font loading.

## Icon Library
**None (Text-Based Buttons)**

Buttons use text labels (+1, -1, etc.) rather than icon fonts to minimize dependencies and maintain clarity on small screens.

## Application Hosting
**Static File Hosting (TBD)**

Suitable hosts: GitHub Pages, Netlify, Vercel, or any static file server. No server-side processing required.

## Database Hosting
**n/a**

No external database - all data stored in browser localStorage on user devices.

## Asset Hosting
**Same as Application Hosting**

Icons (192x192.png, 512x512.png) hosted alongside application files. No CDN required due to minimal asset count.

## Deployment Solution
**Manual Upload or Git-Based Deployment (TBD)**

Can use git push to GitHub Pages, Netlify auto-deploy from Git, or manual FTP/file upload to static hosting.

## Code Repository URL
**TBD**

Currently local repository. To be hosted on GitHub, GitLab, or similar Git hosting service.

## Additional Technologies

### Progressive Web App (PWA)
- **Service Worker API**: Offline caching and background sync capabilities
- **Web App Manifest**: Home screen installation metadata
- **Cache API**: Asset and resource caching for offline functionality

### Storage Technologies
- **localStorage**: Primary data persistence (resource counts, active tab)
- **Service Worker Cache**: App asset storage for offline use

### Web APIs Used
- **File API**: CSV import via FileReader
- **Blob API**: CSV export file generation
- **URL API**: Blob URL creation for downloads
- **Event API**: Online/offline detection
- **beforeinstallprompt**: PWA installation prompt handling

## Architecture Decisions

### Why Vanilla JavaScript?
- Zero build step complexity
- Minimal download size (~20KB total uncompressed)
- No framework version lock-in or breaking changes
- Perfect for simple, focused applications
- Optimal performance on mobile devices

### Why localStorage?
- No server infrastructure cost or complexity
- Zero network dependency for core functionality
- Instant read/write performance
- Appropriate for single-user device-local data
- Privacy-friendly (data never leaves device)

### Why Offline-First PWA?
- Critical for venue areas with poor connectivity
- Instant loading after first visit
- Works in airplane mode or completely offline
- Native app-like experience without app store friction

### Why No Build Process?
- Simplifies development workflow
- Enables direct editing and testing
- Reduces tooling dependencies
- Faster iteration cycle
- Easy deployment to any static host
