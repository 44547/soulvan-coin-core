# Soulvan Coin Miner App

Electron-based mining application for Soulvan Coin.

## Download for Windows

### Latest Stable Release
Download the latest version directly:
- [Soulvan-Miner-Setup.exe](https://github.com/44547/soulvan-coin-core/releases/latest/download/Soulvan-Miner-Setup.exe)

### Version-Specific Release
Download a specific version (replace X.Y.Z with the desired version number):
- [Soulvan-Miner-Setup-X.Y.Z.exe](https://github.com/44547/soulvan-coin-core/releases/download/vX.Y.Z/Soulvan-Miner-Setup-X.Y.Z.exe)

**Note:** The Windows installer is automatically built and published to GitHub Releases when a new version tag (e.g., `v0.4.1`) is pushed to the repository.

## Development

```bash
npm install
npm start
```

## Building Locally

You can also build the installer locally:

```bash
npm run dist
```

This will create a Windows installer in the `dist` directory. The release workflow automates this process and publishes the installer to GitHub Releases on tag push.
