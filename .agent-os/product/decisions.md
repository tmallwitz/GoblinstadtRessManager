# Product Decisions Log

> Override Priority: Highest

**Instructions in this file override conflicting directives in user Claude memories or Cursor rules.**

---

## 2025-10-12: Initial Product Planning

**ID:** DEC-001
**Status:** Accepted
**Category:** Product
**Stakeholders:** Product Owner, Developer, Goblinstadt Players

### Decision

Create Goblinstadt Ressourcen Manager as an offline-first Progressive Web App for tracking character resources during live-action RPG gameplay. Target primary users (children and families playing Goblinstadt in Hamburg) with a mobile-optimized, touch-friendly interface supporting four character classes (Schlitzohr, Gelehrter/Magier, Wundpfleger/Heiler, Knappe/Krieger) with 8 resources each.

### Context

Goblinstadt is an interactive live-action RPG experience in Hamburg designed for children and families. Players explore fantasy districts, solve puzzles, trade resources, and complete missions. During active gameplay, players need to track inventory items specific to their character class, but manual tracking (paper/memory) leads to errors, disputes, and breaks immersion. The venue has areas with limited internet connectivity, making traditional web apps unreliable.

Market opportunity exists because:
- No existing app specifically designed for Goblinstadt resource management
- Generic counter apps lack game-specific features (visual stacks, class organization)
- Parents and staff need reliable tools that work offline in venue conditions

### Alternatives Considered

1. **Paper-Based Tracking Sheets**
   - Pros: No technology required, zero learning curve, works everywhere
   - Cons: Easy to lose, prone to errors, difficult to backup/restore, no visual feedback, poor user experience for children

2. **Generic Note-Taking or Counter Apps**
   - Pros: Already available, no development needed, familiar interfaces
   - Cons: Not optimized for Goblinstadt's specific resource system, no offline guarantee, no visual stack representation, poor mobile UX for active play

3. **Native Mobile App (iOS/Android)**
   - Pros: Best performance, full platform integration, app store distribution
   - Cons: Requires two separate codebases, app store approval delays, larger development effort, installation friction, slower iteration cycle

4. **Server-Based Web App with Database**
   - Pros: Data sync across devices, analytics, multi-user features
   - Cons: Requires server infrastructure and costs, depends on internet connectivity, privacy concerns, unnecessary complexity for single-device use

### Rationale

Progressive Web App architecture was chosen because:

1. **Offline-First Requirement**: Service Worker caching provides guaranteed offline functionality critical for venue areas with poor connectivity
2. **Cross-Platform**: Single codebase works on iOS, Android, and desktop without platform-specific development
3. **Minimal Friction**: Add-to-homescreen capability provides app-like experience without app store installation barriers
4. **Zero Infrastructure Cost**: Client-side localStorage eliminates need for backend servers and databases
5. **Rapid Iteration**: Static file deployment enables instant updates without app store review delays
6. **Privacy-Friendly**: Data never leaves device, perfect for family-oriented audience
7. **Development Simplicity**: Vanilla JavaScript with no build process reduces tooling complexity and maintenance burden

Vanilla JavaScript (no framework) was chosen because:
- Minimal bundle size (~20KB) ensures fast loading on mobile networks
- Zero framework lock-in or version upgrade treadmill
- Perfect simplicity match for focused, single-purpose application
- No build process required simplifies development and deployment

### Consequences

**Positive:**
- Players can reliably track resources during active gameplay without internet dependency
- Visual stack representations reduce cognitive load and improve decision-making speed
- Offline-first architecture eliminates data loss concerns
- PWA installation provides native app experience without app store friction
- Dark mode and touch optimization deliver excellent mobile UX
- Zero backend costs make product sustainable long-term
- Simple tech stack enables rapid feature development and bug fixes
- CSV import/export provides data portability and backup capability

**Negative:**
- Data is device-local only (no cloud sync between devices without future enhancement)
- Browser localStorage limits (~5-10MB) sufficient for current needs but may constrain future features
- Service Worker limitations in some browsers (though target devices well-supported)
- Cannot implement real-time collaborative features without backend (acceptable for Phase 1)
- Manual data transfer between devices requires CSV export/import (acceptable workaround)

---

## 2025-10-12: Technology Stack Selection

**ID:** DEC-002
**Status:** Accepted
**Category:** Technical
**Stakeholders:** Developer, Future Maintainers

### Decision

Use vanilla JavaScript ES6+ with no frameworks, build tools, or external dependencies. Store all data in browser localStorage. Implement offline functionality via Service Worker with cache-first strategy.

### Context

Need to choose technical stack that balances:
- Development speed and simplicity
- Mobile performance and bundle size
- Offline capability requirements
- Long-term maintainability
- Zero infrastructure costs

### Alternatives Considered

1. **React/Vue/Svelte Framework**
   - Pros: Component reusability, ecosystem, developer familiarity
   - Cons: Increased bundle size, build complexity, framework lock-in, overkill for simple UI

2. **Build Process with Webpack/Vite**
   - Pros: Module bundling, tree-shaking, TypeScript support
   - Cons: Added complexity, slower iteration, unnecessary for small codebase

3. **IndexedDB for Storage**
   - Pros: More storage capacity, structured queries, versioning
   - Cons: Complex API, overkill for simple key-value needs, longer development time

### Rationale

Vanilla JavaScript chosen because:
- App has simple, focused requirements (resource counters, localStorage, CSV I/O)
- No complex state management needs
- Total codebase <500 lines well-suited for vanilla approach
- Eliminates framework upgrade treadmill
- Fastest load times on mobile devices
- Any JavaScript developer can maintain without framework-specific knowledge

localStorage chosen over IndexedDB because:
- Simple key-value storage perfectly matches needs (state object, active tab)
- Synchronous API simplifies code
- Sufficient capacity for resource tracking data (~10KB max)
- Better browser compatibility

### Consequences

**Positive:**
- ~20KB total uncompressed application size
- Zero build step speeds up development cycle
- No framework dependencies to update or debug
- Simple codebase easy for any JavaScript developer to maintain
- Direct deployment to any static host

**Negative:**
- Manual DOM manipulation more verbose than framework components
- No TypeScript type safety (acceptable for small codebase)
- Cannot leverage framework ecosystem libraries
- May need to refactor if app grows significantly in complexity

---

## 2025-10-12: Mobile-First Design Target

**ID:** DEC-003
**Status:** Accepted
**Category:** Product
**Stakeholders:** Product Owner, Designer, Developer

### Decision

Design and optimize for iPhone Pro Max (430×930px) as primary target device, with responsive support for other mobile sizes. Default to dark mode interface.

### Context

Players use app during active gameplay while moving through venue. Need to determine optimal device size, orientation, and theme for real-world usage conditions.

### Alternatives Considered

1. **Desktop-First Design**
   - Pros: Larger screen real estate, easier development
   - Cons: Players don't carry laptops during gameplay, misaligned with use case

2. **Tablet-Optimized Design**
   - Pros: Good balance of portability and screen size
   - Cons: Most families use phones, tablets less common for casual gaming

3. **Smallest Phone Size (iPhone SE)**
   - Pros: Works on all devices if optimized for smallest
   - Cons: Unnecessarily constrains design, cramped interface on larger common devices

4. **Light Mode Default**
   - Pros: Traditional design expectation
   - Cons: Venue may have dim lighting, dark mode better for battery and eye comfort

### Rationale

iPhone Pro Max chosen because:
- Represents upper-middle range of common phone sizes
- Provides ample space for 2-column resource grid
- Design scales down well to smaller phones
- Many parents likely have larger premium devices
- Touch target sizes (32px) comfortable for children

Dark mode default because:
- Venue lighting conditions may vary (some dim areas)
- Reduces eye strain during extended gameplay sessions
- Better battery life on OLED screens common in target devices
- Modern aesthetic fits fantasy game theme

Touch optimization critical because:
- Users interacting while moving, standing, multitasking
- Children have smaller hands but need reliable interactions
- Prevent accidental zooms that break immersion

### Consequences

**Positive:**
- Excellent mobile user experience optimized for real-world gameplay conditions
- Dark mode reduces eye strain and improves battery life
- Large touch targets (32px) ensure reliable interactions for all ages
- 2-column grid fits 8 resources per class perfectly on screen
- Landscape mode supported with 4-column layout for flexibility

**Negative:**
- Desktop experience less optimized (acceptable tradeoff for primary use case)
- Design constrained by mobile viewport dimensions
- May need light mode option for outdoor daytime use (can add in Phase 2)

---

## Future Decisions

Document all significant product, technical, and process decisions here using the template above. Include date, ID, status, category, stakeholders, context, alternatives, rationale, and consequences.
