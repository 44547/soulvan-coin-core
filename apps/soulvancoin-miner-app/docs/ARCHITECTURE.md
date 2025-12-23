# Architecture Documentation

## Overview
The Soulvan Miner app is built using Electron, providing a cross-platform desktop application with a Node.js backend and web-based frontend.

## Technology Stack
- **Electron**: Desktop app framework
- **Node.js**: Backend runtime
- **HTML/CSS/JavaScript**: Frontend UI
- **Jest**: Testing framework
- **ESLint**: Code linting
- **electron-builder**: Build and packaging

## Process Architecture

### Main Process (main.js)
The main process is the entry point and handles:
- Application lifecycle management
- Window creation and management
- IPC (Inter-Process Communication) handlers
- System-level operations
- Miner process orchestration
- AI module coordination

**Key Responsibilities:**
- Create and manage BrowserWindow instances
- Register IPC handlers for renderer communication
- Manage miner lifecycle (start/stop)
- Forward miner events to renderer
- Handle file dialogs
- Execute AI operations

### Renderer Process (src/renderer.js)
The renderer process handles the UI:
- User interactions
- UI updates
- Event listeners
- IPC communication with main process
- Tab switching

**Key Responsibilities:**
- Handle form submissions
- Update statistics display
- Stream log entries
- Display media previews
- Manage tab navigation

### Preload Script (src/preload.js)
Security bridge between main and renderer:
- Implements context isolation
- Exposes safe IPC methods via contextBridge
- Prevents direct Node.js access from renderer

## Component Architecture

### Mining Module (mining/external_miners.js)

**ExternalMiner Class:**
- Extends EventEmitter for event-driven architecture
- Manages subprocess lifecycle
- Parses miner output in real-time
- Tracks statistics

**Key Methods:**
- `buildCommand()`: Variable substitution in command templates
- `parseHashrate()`: Extract hashrate from logs (supports H/s, kH/s, MH/s, GH/s, TH/s, Sol/s)
- `parseShares()`: Detect accepted/rejected shares
- `start()`: Spawn miner process
- `stop()`: Terminate miner gracefully
- `getStats()`: Return current statistics

**Events Emitted:**
- `start`: Mining begins
- `log`: Log line received
- `stats`: Statistics updated
- `exit`: Process terminated
- `error`: Error occurred

### AI Modules

#### Music AI (ai/music_ai.js)
**Function: `generateMusic(options)`**
- Generates mono 16-bit WAV files
- Synthesizes sine wave audio
- Customizable duration and frequency
- Returns file path for playback

**Algorithm:**
1. Calculate audio parameters (sample rate, channels, bit depth)
2. Build WAV header (RIFF format)
3. Generate sine wave samples
4. Write header + data to file

#### Photo AI (ai/photo_ai.js)
**Function: `processPhoto(inputPath, options)`**
- Processes images with style presets
- Copies/transforms input to styled output
- Returns paths for preview

**Function: `getAvailableStyles()`**
- Returns list of available style presets

## Configuration System

### Miner Configuration (config/miners.json)
JSON structure defining miner presets:
```json
{
  "miners": {
    "minerId": {
      "name": "Display Name",
      "description": "Description",
      "executable": "binary-name",
      "supportedAlgos": ["algo1", "algo2"],
      "commandTemplate": "command with {VARIABLES}",
      "hashRatePatterns": ["regex1", "regex2"]
    }
  }
}
```

**Supported Variables:**
- `{EXECUTABLE}`: Path to miner binary
- `{ALGO}`: Mining algorithm
- `{POOL}`: Pool address
- `{WALLET}`: Wallet address
- `{WORKERNAME}`: Worker identifier
- `{THREADS}`: Thread count

## Data Flow

### Mining Flow
1. User configures miner in UI
2. Renderer sends `start-mining` IPC to main
3. Main creates ExternalMiner instance
4. ExternalMiner spawns subprocess
5. Subprocess output streams to EventEmitter
6. Events forwarded to renderer via IPC
7. Renderer updates UI (logs, stats)

### Music Generation Flow
1. User sets parameters in UI
2. Renderer sends `generate-music` IPC to main
3. Main calls music_ai.generateMusic()
4. WAV file created in output directory
5. File path returned to renderer
6. Renderer displays audio player

### Photo Processing Flow
1. User clicks "Select Photo"
2. Renderer sends `open-file-dialog` IPC to main
3. Main shows native file picker
4. User selects image
5. Path returned to renderer
6. User clicks "Process Photo"
7. Renderer sends `process-photo` IPC to main
8. Main calls photo_ai.processPhoto()
9. Styled image created
10. Paths returned for preview

## Security Model

### Context Isolation
- Renderer has no direct Node.js access
- All Node.js operations go through preload script
- IPC handlers validate inputs

### Code Signing (Placeholders)
- Windows: Certificate via `WIN_CSC_LINK` and `WIN_CSC_KEY_PASSWORD`
- macOS: Identity via `APPLE_IDENTITY`
- Entitlements defined in build/entitlements.mac.plist

## Build System

### Development
```bash
npm start  # Launch in dev mode with DevTools
```

### Testing
```bash
npm test   # Run Jest tests
npm run lint  # Run ESLint
```

### Production Builds
```bash
npm run build:win    # Windows NSIS installer
npm run build:mac    # macOS DMG
npm run build:linux  # Linux AppImage
```

**electron-builder Configuration:**
- Defined in package.json under "build"
- Platform-specific settings
- Code signing placeholders
- Output to dist/

## CI/CD Pipeline

### Automated Windows Builds (build-release.yml)
**Triggers:** Git tags (v*)
**Jobs:**
1. **build-windows**: Build Windows installer on Windows runner
2. **test**: Run tests on Ubuntu runner

**Steps:**
- Checkout code
- Setup Node.js with npm cache
- Install dependencies
- Run tests and linter
- Build installer (with code signing if secrets present)
- Upload artifacts
- Create GitHub Release

### Manual Builds (manual-build.yml)
**Triggers:** Manual workflow dispatch
**Inputs:** Platform choice (linux, macos, all)
**Jobs:**
- Conditional builds based on platform selection
- Upload artifacts for download

### Version Sync (version-sync.yml)
**Triggers:** Git tags (v*)
**Steps:**
- Extract version from tag
- Update package.json version
- Create PR with changes

## Testing Strategy

### Unit Tests (tests/app.test.js)
**Coverage:**
- Miner configuration loading
- Command building with variables
- Hashrate parsing (all units)
- Share parsing
- WAV generation
- Photo processing
- Error handling

**Test Framework:** Jest
**Test Environment:** Node.js

## File Structure
```
apps/soulvancoin-miner-app/
├── ai/                     # AI modules
│   ├── music_ai.js         # Music generation
│   └── photo_ai.js         # Photo processing
├── assets/                 # Static assets
│   └── README.md           # Asset documentation
├── build/                  # Build configuration
│   └── entitlements.mac.plist  # macOS entitlements
├── config/                 # Configuration files
│   └── miners.json         # Miner presets
├── docs/                   # Documentation
│   ├── ARCHITECTURE.md     # This file
│   └── UI_DOCUMENTATION.md # UI guide
├── mining/                 # Mining logic
│   └── external_miners.js  # Miner orchestration
├── src/                    # UI files
│   ├── index.html          # HTML structure
│   ├── renderer.js         # UI logic
│   ├── preload.js          # Security bridge
│   └── styles.css          # Styling
├── tests/                  # Test files
│   └── app.test.js         # Unit tests
├── main.js                 # Main process entry
├── package.json            # Dependencies & scripts
├── jest.config.js          # Jest configuration
├── .eslintrc.js            # ESLint configuration
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

## Extension Points

### Adding New Miners
1. Add preset to config/miners.json
2. Define command template with variables
3. Add hashrate parsing patterns
4. Test with actual miner binary

### Adding New AI Features
1. Create module in ai/ directory
2. Add IPC handler in main.js
3. Expose via preload.js
4. Add UI in src/
5. Update renderer.js with logic

### Adding New UI Tabs
1. Add button in .tabs section (index.html)
2. Add content div with id={name}-tab
3. Add event listener in renderer.js
4. Style in styles.css
