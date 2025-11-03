# Soulvan Coin Miner & TON Desktop App

A fully functional Windows desktop application (Electron-based) for Soulvan Coin & TON mining with integrated AI features, wallet management, and DAO governance.

## Features

### 🔨 Mining
- **Built-in Demo Miner**: Generates synthetic hashrate and shares for UI testing
- **External Miner Support**: Spawn and manage external miners (e.g., XMRig)
  - Real-time log streaming
  - Automatic hashrate parsing (H/s, kH/s, MH/s, GH/s)
  - Share tracking (accepted/rejected)
  - Configurable via presets or manual configuration
- **Pool & Solo Mining**: Support for both pool and solo mining configurations

### 💰 Wallets
- **Soulvan Coin Wallet**: Create, restore, check balance, send transactions (demo mode)
- **TON Wallet**: Create, restore, check balance, send transactions (demo mode)
- **Cinematic Onboarding**: First-time wallet creation triggers a full-screen cinematic experience

### 🎨 AI Features
- **SoulvanMusic AI**: Generate audio tones based on text prompts, saved as mono 16-bit WAV files
- **PhotoAI Avatars**: Avatar generation stub with metadata (ready for real AI integration)

### 🏛️ DAO Governance
- Create proposals with custom options
- Vote on active proposals
- View proposal results
- In-memory storage (replace with blockchain integration later)

### 🛠️ Utilities
- **System Diagnostics**: OS, CPU, memory, GPU detection
- **Hashing Benchmark**: SHA-256 and SHA-512 performance testing
- **Docker Support**: Build and run containerized versions for CI/testing

### 🎭 Themes
- Four animated themes: Neo (Cyan/Magenta), Aurora (Purple/Blue), Noir (Gold/B&W), Sunset (Orange/Pink)
- Smooth transitions between themes
- Persistent theme selection

## Installation

### Prerequisites
- Node.js 16 or higher
- Windows OS (for full miner support)
- (Optional) Docker for containerized testing

### Setup

1. Navigate to the app directory:
```bash
cd apps/soulvancoin-miner-app
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Starting the Application

**Standard mode:**
```bash
npm start
```

**Development mode (with DevTools):**
```bash
npm run dev
```

### Running Tests

```bash
npm run tests
```

### Running Diagnostics

```bash
npm run diagnostics
```

### Running Benchmark

```bash
npm run benchmark
```

## Configuration

### External Miner Configuration

Edit `config/miners.json` to add or modify miner presets:

```json
{
  "presets": {
    "xmrig": {
      "name": "XMRig (Monero)",
      "executable": "xmrig.exe",
      "defaultPool": "pool.minexmr.com:4444",
      "defaultUsername": "YOUR_WALLET_ADDRESS",
      "defaultPassword": "x",
      "defaultThreads": 4,
      "defaultArgs": "--donate-level 1"
    }
  }
}
```

### Using External Miners

1. Download your preferred miner (e.g., XMRig from official sources)
2. Extract to a known location
3. In the app's Mining tab:
   - Select "External Miner" from the engine dropdown
   - Choose a preset or enter custom configuration
   - Enter the full path to the miner executable
   - Configure pool details and wallet address
   - Click "Start External Miner"

The app will:
- Spawn the miner process
- Stream logs to the UI in real-time
- Parse and display hashrate automatically
- Track accepted/rejected shares

## Application Structure

```
apps/soulvancoin-miner-app/
├── main.js                 # Electron main process
├── package.json            # Dependencies and scripts
├── README.md               # This file
├── config/
│   └── miners.json         # Miner presets
├── mining/
│   ├── miner_core.js       # Built-in demo miner
│   ├── external_miners.js  # External miner orchestration
│   ├── pool_mining.js      # Pool mining helpers
│   └── solo_mining.js      # Solo mining helpers
├── wallet/
│   ├── soulvan_integration.js  # Soulvan wallet (demo)
│   └── ton_integration.js      # TON wallet (demo)
├── ai/
│   ├── music_ai.js         # WAV audio generation
│   └── photo_ai.js         # Avatar generation stub
├── dao/
│   └── governance.js       # DAO proposals and voting
├── scripts/
│   ├── diagnostics.js      # System diagnostics
│   ├── benchmark.js        # Hashing benchmark
│   └── cli_wrappers.js     # CLI utilities
├── docker/
│   ├── Dockerfile.example  # Docker image for CI/testing
│   └── docker_manager.js   # Docker build/run helpers
├── tests/
│   └── miner_tests.js      # Automated miner tests
└── src/
    ├── index.html          # Main UI
    ├── preload.js          # IPC bridge
    ├── renderer.js         # UI logic
    ├── cinematic.js        # Onboarding experience
    └── styles/
        └── themes.css      # Theme system
```

## UI Guide

### Mining Tab
- **Demo Miner**: Quick testing with synthetic data
- **External Miner**: Real mining with external executables
- **Real-time Stats**: Hashrate, shares, uptime
- **Log Viewer**: Live streaming logs from external miner

### Wallet Tab
- Create new Soulvan or TON wallets
- Check balances
- Send transactions (demo mode)
- **First wallet creation triggers cinematic onboarding**

### SoulvanMusic AI Tab
- Enter a text prompt (keywords: "low", "high", "bass", "treble")
- Set duration (1-30 seconds)
- Generate WAV audio file
- View file path and preview

### PhotoAI Avatars Tab
- Enter description prompt
- Select style
- Generate avatar metadata (stub for future implementation)

### DAO Governance Tab
- Create proposals with custom voting options
- Vote on active proposals
- View results and statistics
- Close proposals to determine winners

### Utility Scripts Tab
- Run system diagnostics (OS, CPU, RAM, GPU)
- Run hashing benchmarks
- View detailed JSON output

### Tests Tab
- Run automated miner tests
- Verify functionality
- View test results

### Docker Tab
- Check Docker availability
- Build Docker images
- Run containerized tests/diagnostics/benchmarks
- List images

## Security Notes

⚠️ **Important Security Considerations:**

1. **Demo Mode**: Wallets are currently in demo mode with in-memory storage. Private keys are not secure.
2. **External Miners**: Only download miners from official, trusted sources
3. **Path Security**: Validate executable paths before running external miners
4. **Network**: External miners connect to mining pools - ensure you trust the pool
5. **Production**: Replace demo wallet implementations with real RPC/SDK integrations before production use
6. **Electron Version**: This app uses Electron 27.x. For production deployment, consider upgrading to the latest Electron version to address known vulnerabilities (run `npm audit` for details)

## Next Steps

### For Production Use:

1. **Wallet Integration**:
   - Replace demo wallets with real Soulvan Coin RPC client
   - Integrate TON SDK for real TON wallet functionality
   - Implement secure key storage (hardware wallet support, encryption)

2. **Mining**:
   - Add more miner presets
   - Implement miner auto-detection
   - Add profitability calculations
   - Support for multiple simultaneous miners

3. **AI Features**:
   - Integrate real AI models for PhotoAI avatars
   - Enhance SoulvanMusic AI with more sophisticated audio generation
   - Add voice synthesis capabilities

4. **DAO**:
   - Integrate with blockchain for persistent proposals
   - Implement token-weighted voting
   - Add proposal execution logic
   - Multi-signature support

5. **UI/UX**:
   - Add more themes
   - Implement charts and graphs for mining history
   - Add notification system
   - Settings persistence

6. **Performance**:
   - Optimize log rendering for long mining sessions
   - Add database for historical data
   - Implement worker threads for heavy computations

## Troubleshooting

### Electron won't start
- Ensure Node.js 16+ is installed
- Run `npm install` again
- Check for errors in the console

### External miner not starting
- Verify the executable path is correct
- Check that the miner file has execute permissions
- Ensure pool URL is in format `hostname:port`
- Check miner logs for specific errors

### GPU not detected in diagnostics
- Ensure GPU drivers are installed
- For NVIDIA: Install nvidia-smi
- For Windows: wmic should be available by default

### Docker commands failing
- Verify Docker Desktop is running
- Check Docker version: `docker --version`
- Ensure you have permissions to run Docker commands

## License

MIT License - See LICENSE file in repository root

## Contributing

This app is part of the Soulvan Coin ecosystem. Contributions are welcome!

## Support

For issues or questions, please open an issue in the main repository.

---

**Built with ❤️ for the Soulvan Coin community**
