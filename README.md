# 🏰 Goblinstadt Ressourcen Manager

[![PWA](https://img.shields.io/badge/PWA-Enabled-blue)](https://web.dev/progressive-web-apps/)
[![Offline](https://img.shields.io/badge/Offline-Ready-green)](https://developers.google.com/web/fundamentals/codelabs/offline)
[![Security](https://img.shields.io/badge/Security-Self--Hosted-brightgreen)](docs/sri-maintenance.md)

A beautiful, offline-first Progressive Web App (PWA) for tracking resources in the Goblinstadt tabletop RPG game. Designed for mobile-first gameplay with a fantasy-themed dark mode interface.

## ✨ Features

### 🎮 Game Resource Management
- **4 Character Classes**: Schlitzohr (Rogue), Magier (Mage), Heiler (Healer), Krieger (Warrior)
- **32 Unique Resources**: 8 resources per class with custom RPG-themed icons
- **Visual Stack System**: Resources displayed in stacks of 10 with color-coded remainder badges
  - 🔴 Red (0-4): Needs restocking
  - 🟡 Yellow (5-7): Moderate supply
  - 🟢 Green (8-9): Almost full stack

### 📱 Progressive Web App
- **Offline-First**: Works perfectly without internet connection
- **Install to Home Screen**: Functions like a native app on iOS and Android
- **Service Worker**: Aggressive caching for instant load times (cache v9)
- **Responsive Design**: Optimized for mobile (430×930px), adapts to desktop
- **Touch-Optimized**: Large touch targets, no zoom, smooth interactions

### 🎨 Modern UI/UX
- **Dark Mode**: Fantasy-themed dark interface with class-colored accents
- **Smooth Animations**: Fade-in tab switching with sparkle effects on resource increases
- **Instant Feedback**: <50ms response time for +/- buttons (no disruptive re-renders)
- **Class-Themed Colors**: Golden (Rogue), Purple (Mage), Blue (Healer), Red (Warrior)
- **RPG Icons**: Font Awesome + RPG Awesome icon libraries

### 💾 Data Management
- **CSV Import/Export**: Compatible with Excel format
- **localStorage Persistence**: Automatically saves state
- **Tab Totals**: Real-time category and grand totals
- **Edit Modal**: Quick value adjustments
- **Reset Function**: Clear all resources with confirmation

### 🔒 Security & Privacy
- **100% Self-Hosted**: Zero CDN dependencies (~1MB total assets)
- **Complete Offline Capability**: No external network requests
- **Supply Chain Security**: All resources under direct control
- **No Tracking**: Client-side only, no data leaves your device

## 🚀 Quick Start

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tmallwitz/GoblinstadtRessManager.git
   cd GoblinstadtRessManager
   ```

2. **Serve locally** (required for Service Worker)
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx http-server -p 8000

   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Install as PWA

**iOS (Safari):**
1. Open the app in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"
4. Tap "Add"

**Android (Chrome):**
1. Open the app in Chrome
2. Tap the menu (⋮)
3. Tap "Install app" or "Add to Home Screen"

**Desktop (Chrome/Edge):**
1. Look for the install icon (⊕) in the address bar
2. Click "Install"

## 📖 Usage

### Basic Operations

- **Switch Classes**: Tap character class tabs (Schlitzohr, Magier, Heiler, Krieger)
- **Add Resources**: Use +1, +5, or +10 buttons
- **Remove Resources**: Use -1, -5, or -10 buttons
- **Edit Value**: Click "Edit" button to set exact amount
- **View Totals**: Totals displayed in tab names and bottom of each resource card

### Data Management

**Export to CSV:**
1. Click "Export CSV" button
2. File downloads as `goblinstadt_ressourcen.csv`
3. Open in Excel or any spreadsheet app

**Import from CSV:**
1. Click "Import CSV" button
2. Select your CSV file
3. Confirm to replace current data

**Reset All:**
1. Click "Zurücksetzen" button
2. Confirm to reset all resources to 0

## 🛠️ Tech Stack

### Frontend
- **Vanilla JavaScript** (ES6+) - No frameworks, pure performance
- **HTML5** - Semantic markup with PWA meta tags
- **CSS3** - Custom properties, animations, responsive grid

### Styling
- **Tailwind CSS** (Self-hosted Play CDN) - Utility-first CSS framework
- **Custom CSS** - Fantasy-themed dark mode with class colors

### Icons & Fonts
- **Font Awesome 6.4.0** (Self-hosted) - General icons
- **RPG Awesome 0.2.0** (Self-hosted) - Fantasy-themed icons
- **Google Fonts** (Self-hosted)
  - Cinzel - Fantasy headers (regular, semibold, bold)
  - Roboto - Body text (regular, bold)

### PWA
- **Service Worker** - Offline functionality with cache-first strategy
- **Web App Manifest** - Install to home screen support
- **localStorage** - Client-side state persistence

## 📁 Project Structure

```
GoblinstadtRessManager/
├── index.html              # Main HTML structure
├── app.js                  # Core application logic (664 lines)
├── styles.css              # Dark mode styling with animations
├── sw.js                   # Service Worker (v9, cache-first)
├── manifest.json           # PWA manifest
├── icon-192x192.png        # App icon (small)
├── icon-512x512.png        # App icon (large)
├── assets/                 # Self-hosted vendor assets (~1MB)
│   └── vendor/
│       ├── font-awesome/   # Font Awesome 6.4.0 (281KB)
│       ├── rpg-awesome/    # RPG Awesome 0.2.0 (165KB)
│       ├── tailwind/       # Tailwind CSS Play CDN (398KB)
│       └── fonts/          # Google Fonts (158KB)
├── docs/
│   └── sri-maintenance.md  # Security documentation
└── agent-os/               # Development specifications
    └── specs/              # Feature implementation specs
```

## 🔐 Security

This app implements **complete supply chain security** by self-hosting all external dependencies:

- ✅ **Zero CDN dependencies** (previously 5)
- ✅ **No external network requests** after initial load
- ✅ **Immune to CDN compromises** and outages
- ✅ **Perfect offline functionality**
- ✅ **All assets under direct control** (~1MB total)

For maintenance procedures, see [docs/sri-maintenance.md](docs/sri-maintenance.md).

## 🎯 Browser Support

- ✅ **Chrome/Edge** 90+ (Desktop & Mobile)
- ✅ **Safari** 14+ (iOS & macOS)
- ✅ **Firefox** 88+ (Desktop & Mobile)

**Service Worker Requirements:**
- HTTPS (production) or localhost (development)
- Modern browser with Service Worker support

## 🧪 Development

### Local Development

1. Make changes to source files
2. Service Worker caches aggressively - **force refresh** to see changes:
   - Chrome: DevTools → Application → Service Workers → Unregister
   - Safari: Develop → Empty Caches
   - Or: Increment `CACHE_NAME` version in `sw.js`

### Testing Checklist

**Functionality:**
- [ ] All 32 resources display with correct icons
- [ ] +/- buttons update instantly (no flash/animation)
- [ ] Tab switching shows smooth fade-in animation
- [ ] Sparkle effects appear on resource increase
- [ ] Edit modal opens, saves, closes correctly
- [ ] CSV export downloads file
- [ ] CSV import updates resources
- [ ] Reset clears all to 0
- [ ] localStorage persists after reload

**PWA:**
- [ ] Works offline (test with DevTools Network → Offline)
- [ ] Install prompt appears (on supported browsers)
- [ ] Installed app launches correctly
- [ ] Service Worker caches all resources

**Visual:**
- [ ] Dark mode renders correctly
- [ ] All icons display (no blank spaces)
- [ ] Class colors show correctly (tabs, glows, sparkles)
- [ ] Responsive layout works (portrait/landscape, mobile/desktop)

## 📝 Resource Types

| Category | Resources |
|----------|-----------|
| **Schlitzohr** (Rogue) | Enterhaken, Seil, Handschuhe, Dietrich, Truhe, Messer, Schloss, Umhang |
| **Gelehrter** (Mage) | Tinte, Verzauberung, Zauberhut, Feder, Bücher, Zauberstab, Pergament, Amulet |
| **Wundpfleger** (Healer) | Schere, Bandage, Zutaten, Nadel, Tränke, Wundhaken, Skalpell, Mörser |
| **Knappe** (Warrior) | Axt, Helm, Rüstung, Schleifstein, Kettenringe, Schwert, Schild, Trophäen |

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style (German comments, descriptive names)
- Test offline functionality
- Ensure Service Worker caching works correctly
- Update `CACHE_NAME` version when changing cached files
- Maintain mobile-first responsive design
- Keep self-hosted architecture (no external CDN dependencies)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Icon Libraries**: [Font Awesome](https://fontawesome.com/), [RPG Awesome](https://nagoshiashumari.github.io/Rpg-Awesome/)
- **Fonts**: [Google Fonts](https://fonts.google.com/) (Cinzel, Roboto)
- **Framework**: [Tailwind CSS](https://tailwindcss.com/)
- **Built with**: ❤️ and [Claude Code](https://claude.com/claude-code)

---

**Viel Spaß beim Spielen! 🎲🏰**
