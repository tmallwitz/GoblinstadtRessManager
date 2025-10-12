# Product Mission

## Pitch

Goblinstadt Ressourcen Manager is a mobile-first Progressive Web App that helps Goblinstadt players track and manage their character resources during gameplay by providing an intuitive, offline-capable interface optimized for live-action RPG sessions.

## Users

### Primary Customers

- **Goblinstadt Players**: Children and families participating in the interactive RPG experience in Hamburg who need to track resources for their character classes during gameplay sessions
- **Game Masters & Staff**: Organizers who may need to monitor or reset player resources between sessions or events

### User Personas

**Young Adventurer** (8-14 years old)
- **Role:** Player in Goblinstadt live-action RPG
- **Context:** Actively exploring fantasy districts, solving puzzles, trading resources, and completing missions at the Hamburg location
- **Pain Points:** Difficulty remembering resource counts during active play, losing track of items collected, confusion about which resources belong to their character class
- **Goals:** Easily track their character's resources without interrupting gameplay, visualize progress toward full stacks, quickly update counts during trades and missions

**Parent Player** (30-45 years old)
- **Role:** Player or supervising adult participating with children
- **Context:** Playing alongside children while managing family logistics and gameplay coordination
- **Pain Points:** Need to quickly check resource status for multiple family members, want reliable offline functionality in venue areas with poor connectivity
- **Goals:** Efficiently manage resources for family group, export data for record-keeping, use app without internet dependency

**Event Coordinator** (20-35 years old)
- **Role:** Goblinstadt staff member managing sessions
- **Context:** Overseeing multiple player groups, resetting resources between events, maintaining game balance
- **Pain Points:** Manual tracking is time-consuming, need to bulk reset resources for new sessions, difficulty exporting data for event analysis
- **Goals:** Quick batch operations, CSV import/export for session management, reliable data persistence

## The Problem

### Resource Tracking During Active Play

Players participating in the immersive Goblinstadt experience struggle to accurately track their character resources (items like Enterhaken, Tinte, Bandage, Schwert) while actively exploring, trading, and completing missions. Manual tracking with paper or memory leads to errors, disputes, and breaks immersion. This results in frustrated players, interrupted gameplay flow, and reduced enjoyment of the experience.

**Our Solution:** A touch-optimized mobile app with visual stack representations that makes resource updates instant and intuitive without breaking immersion.

### Offline Play Requirements

The Goblinstadt venue may have areas with limited or no internet connectivity, yet players need continuous access to their resource data throughout their session. Traditional web apps fail in offline scenarios, causing data loss and gameplay disruption. Players lose trust in digital tools and revert to unreliable manual methods.

**Our Solution:** An offline-first PWA with Service Worker caching that works reliably without internet and persists all data locally on the device.

### Visual Resource Management Complexity

Goblinstadt uses a stacking system where resources are organized in groups of 10, with remainder values indicating proximity to full stacks. Players need to quickly assess their inventory status to make strategic decisions about trading and resource collection. Numeric-only displays fail to convey this information intuitively for younger players and during fast-paced gameplay.

**Our Solution:** Visual stack representations with color-coded remainders (red 0-4, yellow 5-7, green 8-9) that provide instant status recognition.

## Differentiators

### Offline-First Architecture

Unlike typical web-based resource trackers that require constant internet connectivity, Goblinstadt Ressourcen Manager uses Service Worker technology with aggressive cache-first strategies to ensure 100% offline functionality. This results in zero data loss, instant app loading, and complete independence from venue WiFi reliability - critical for immersive live-action gameplay.

### Game-Specific Visual Design

Unlike generic inventory or counter apps, we provide visual stack representations specifically designed for Goblinstadt's resource system with color-coded remainder indicators. This results in faster decision-making for players and eliminates the cognitive load of mental math during active play sessions.

### Mobile-First Touch Optimization

Unlike desktop-oriented tools or responsive-but-compromised designs, our interface is purpose-built for iPhone Pro Max dimensions with large touch targets (32px minimum), zero-zoom gestures, and dark mode optimization for venue lighting conditions. This results in frustration-free operation even for younger players with small hands during active movement.

## Key Features

### Core Features

- **Four Character Class Tabs:** Dedicated interfaces for Schlitzohr (Rogue), Gelehrter/Magier (Mage), Wundpfleger/Heiler (Healer), and Knappe/Krieger (Warrior) with class-specific color coding and all 8 resources per class
- **Visual Stack Display:** Graphical representation of complete stacks (groups of 10) with color-coded remainder badges that instantly communicate inventory status
- **Quick Increment/Decrement:** Touch-optimized buttons for +1, +5, +10 and -1, -5, -10 adjustments that enable rapid updates during trades and mission completion
- **Direct Value Editing:** Modal-based editing for precise resource count adjustments with keyboard support
- **Persistent Local Storage:** Automatic saving of all resource data to device localStorage with active tab memory across app sessions
- **Category Totals:** Real-time display of total resources per character class in tab names for quick overview

### Data Management Features

- **CSV Export:** One-tap export of all resource data in Excel-compatible format with totals row and grand total for record-keeping
- **CSV Import:** Bulk import functionality that validates resource names and safely replaces current data with confirmation prompt
- **Reset Functionality:** Quick reset button with confirmation to zero out all resources for new gameplay sessions

### Progressive Web App Features

- **Home Screen Installation:** Add-to-homescreen capability on iOS and Android for native app-like experience
- **Offline Indicator:** Visual online/offline status indicator so users know their connectivity state
- **Service Worker Caching:** Aggressive pre-caching of all app assets for instant loading and offline reliability
- **Dark Mode Interface:** Default dark theme optimized for venue lighting conditions and battery conservation
- **Touch Gesture Optimization:** Prevention of accidental zoom, proper touch action handling, and responsive feedback for all interactions
