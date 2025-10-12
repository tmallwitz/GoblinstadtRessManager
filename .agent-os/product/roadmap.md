# Product Roadmap

## Phase 1: Core MVP (Completed)

**Goal:** Deliver fully functional offline-first resource tracker with all essential features for Goblinstadt gameplay.

**Success Criteria:** Players can track all 32 resources across 4 character classes, use the app completely offline, and persist data between sessions.

### Features

- [x] Four character class tabs (Schlitzohr, Gelehrter, Wundpfleger, Knappe) - `XS`
- [x] 8 resources per class with increment/decrement controls (+1, +5, +10, -1, -5, -10) - `S`
- [x] Visual stack display with color-coded remainders (0-4 red, 5-7 yellow, 8-9 green) - `M`
- [x] Direct value editing via modal - `XS`
- [x] localStorage persistence of resource counts and active tab - `S`
- [x] Service Worker implementation with cache-first strategy - `M`
- [x] PWA manifest for home screen installation - `XS`
- [x] CSV export functionality matching Excel format - `S`
- [x] CSV import with validation and confirmation - `S`
- [x] Dark mode interface with CSS variables - `S`
- [x] Mobile-first responsive design optimized for iPhone Pro Max - `M`
- [x] Touch gesture optimization (no-zoom, large targets) - `S`
- [x] Online/offline status indicator - `XS`
- [x] Reset functionality with confirmation - `XS`
- [x] Category totals displayed in tab names - `S`

### Dependencies

- None (MVP is self-contained)

## Phase 2: Enhanced User Experience

**Goal:** Improve usability based on player feedback and add convenience features for active gameplay sessions.

**Success Criteria:** Reduced friction during resource updates, faster navigation, and improved visual clarity in various lighting conditions.

### Features

- [ ] Undo/Redo functionality for accidental changes - `S`
- [ ] Keyboard shortcuts for power users - `S`
- [ ] Haptic feedback on button presses (iOS/Android) - `XS`
- [ ] Quick-add mode: tap resource name to increment by 1 - `XS`
- [ ] Resource history log showing last 10 changes per session - `M`
- [ ] Swipe gestures between character class tabs - `S`
- [ ] Customizable increment/decrement values - `M`
- [ ] Light mode theme option - `S`

### Dependencies

- User feedback from Phase 1 deployment
- Analytics on most-used features

## Phase 3: Multi-Session and Data Management

**Goal:** Support multiple gameplay sessions, group play, and advanced data management needs.

**Success Criteria:** Players can manage multiple characters, share data between devices, and track progress across sessions.

### Features

- [ ] Multiple character profiles per class - `M`
- [ ] Session snapshots (save/restore named states) - `M`
- [ ] Cloud backup via Google Drive or iCloud integration - `L`
- [ ] QR code sharing of current resource state - `S`
- [ ] Backup reminder after N hours of changes - `S`
- [ ] Import/export in additional formats (JSON, XML) - `S`
- [ ] Bulk operations (multiply all by X, divide all by Y) - `M`

### Dependencies

- Cloud storage API integration (OAuth)
- User accounts or device identification

## Phase 4: Social and Collaborative Features

**Goal:** Enable players to share, compare, and collaborate on resource management within groups.

**Success Criteria:** Friends and family can view each other's resources, trade efficiently, and coordinate gameplay.

### Features

- [ ] Local network sharing (discover nearby devices) - `L`
- [ ] Trade mode: propose and confirm resource transfers - `M`
- [ ] Leaderboards for total resources by class - `M`
- [ ] Achievement badges (reach 100 total, max all resources, etc.) - `M`
- [ ] Party view: see combined resources for group - `L`
- [ ] Trading history and statistics - `M`

### Dependencies

- WebRTC or local network APIs
- Backend service for leaderboards (optional)

## Phase 5: Advanced Analytics and Gamification

**Goal:** Provide insights into resource usage patterns and encourage engagement through gamification.

**Success Criteria:** Players gain strategic insights and increased motivation through data visualization and achievements.

### Features

- [ ] Resource usage charts and graphs - `M`
- [ ] Predictions for resource needs based on history - `L`
- [ ] Achievement system with unlockables - `L`
- [ ] Daily/weekly challenges - `M`
- [ ] Resource rarity indicators based on game balance - `M`
- [ ] Tips and strategy suggestions - `M`
- [ ] Integration with Goblinstadt official API (if available) - `XL`

### Dependencies

- Historical data collection
- Machine learning models (optional)
- Partnership with Goblinstadt organizers

## Effort Scale

- **XS**: 1 day
- **S**: 2-3 days
- **M**: 1 week
- **L**: 2 weeks
- **XL**: 3+ weeks

## Current Status

**Phase 1** is complete and production-ready. The app successfully delivers all core functionality with robust offline support and excellent mobile UX.

Next priorities should be determined based on:
1. User feedback from active players
2. Pain points observed during live gameplay
3. Feature requests from Goblinstadt staff
4. Technical debt or performance issues identified in production
