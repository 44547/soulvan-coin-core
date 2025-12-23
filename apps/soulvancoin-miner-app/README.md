# Soulvan Coin Miner App

A comprehensive Windows Electron desktop application for cryptocurrency mining with AI-powered music generation and photo processing features.

## Features

### Mining
- **Multi-Miner Support**: Pre-configured support for popular mining software:
  - XMRig (RandomX, KawPow, CryptoNight)
  - lolMiner (Ethash, Autolykos2, Beam)
  - SRBMiner-MULTI (RandomX, Ethash, HeavyHash)
  - TeamRedMiner (Ethash, KawPow, Autolykos2)
  - GMiner (Ethash, KawPow, Equihash variants)
  - NBMiner (Ethash, Ergo, Conflux)
  - T-Rex (Ethash, KawPow, Octopus)

- **Advanced Controls**:
  - Algorithm selection
  - Worker name configuration
  - Thread count adjustment
  - Live log streaming
  - Real-time statistics (hashrate, shares, uptime)

### AI Features

#### Music AI
- Generate mono 16-bit WAV audio files
- Customizable duration and frequency
- Built-in audio preview player

#### Photo AI
- Process images with various styles (enhanced, vintage, noir, vibrant, soft, sharp)
- Side-by-side preview of original and processed images
- Native file picker integration

### UI Features
- Modern, gradient-themed interface
- Tabbed navigation (Mining, Music AI, Photo AI)
- Navbar with brand image support (see `assets/README.md`)
- Responsive design

## Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Setup

```bash
cd apps/soulvancoin-miner-app
npm install
```

## Usage

### Development

```bash
npm start
```

### Building

#### Windows
```bash
npm run build:win
```

#### macOS
```bash
npm run build:mac
```

#### Linux
```bash
npm run build:linux
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
```

## Configuration

### Miner Configuration
Miner presets are defined in `config/miners.json`. Each miner includes:
- Command templates with variable substitution
- Supported algorithms
- Hashrate parsing patterns

### Brand Image
Add your custom brand image to `assets/title.png` to display it in the navbar. See `assets/README.md` for details.

## CI/CD

### Automated Windows Builds
Triggered on git tags (v*):
- Builds Windows installer (NSIS)
- Runs tests and linting
- Creates GitHub Release with stable download links
- Supports code signing via environment variables

### Manual Builds
Use the manual workflow to build for Linux or macOS:
1. Go to Actions → Manual Build (Linux/macOS)
2. Select platform (linux, macos, or all)
3. Run workflow

### Version Syncing
When a new tag is pushed, a PR is automatically created to sync the `package.json` version.

## Code Signing

### Windows
Set these secrets in your GitHub repository:
- `WIN_CSC_LINK`: Path to certificate file
- `WIN_CSC_KEY_PASSWORD`: Certificate password

### macOS
Set this secret in your GitHub repository:
- `APPLE_IDENTITY`: Apple Developer ID

## Architecture

### Main Process (`main.js`)
- Handles Electron app lifecycle
- Manages IPC communication
- Coordinates miner operations and AI modules

### Renderer Process (`src/renderer.js`)
- Handles UI interactions
- Updates statistics and logs
- Manages tab switching

### Preload Script (`src/preload.js`)
- Exposes secure IPC methods to renderer
- Implements context isolation

### External Miners (`mining/external_miners.js`)
- Spawns and manages miner processes
- Parses output for hashrate and share data
- Emits structured events (start, log, stats, exit, error)
- Supports variable substitution in command templates

### AI Modules
- `ai/music_ai.js`: Generates WAV audio files
- `ai/photo_ai.js`: Processes images with styles

## Development

### Project Structure

```
apps/soulvancoin-miner-app/
├── ai/                    # AI modules
│   ├── music_ai.js
│   └── photo_ai.js
├── assets/                # App assets
│   └── README.md
├── config/                # Configuration files
│   └── miners.json
├── mining/                # Mining logic
│   └── external_miners.js
├── src/                   # UI files
│   ├── index.html
│   ├── renderer.js
│   ├── preload.js
│   └── styles.css
├── tests/                 # Test files
│   └── app.test.js
├── main.js                # Electron main process
├── package.json
└── README.md
```

## License

MIT
