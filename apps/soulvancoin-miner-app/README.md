# Soulvan Miner - Electron Desktop Application

A desktop mining application for Soulvan Coin built with Electron.

## Download

### Windows

**Latest Stable Release:**
```
https://github.com/44547/soulvan-coin-core/releases/latest/download/Soulvan-Miner-Setup.exe
```

**Specific Version (replace X.Y.Z with version number, e.g., 0.4.1):**
```
https://github.com/44547/soulvan-coin-core/releases/download/vX.Y.Z/Soulvan-Miner-Setup-X.Y.Z.exe
```

**Example for version 0.4.1:**
```
https://github.com/44547/soulvan-coin-core/releases/download/v0.4.1/Soulvan-Miner-Setup-0.4.1.exe
```

### Linux and macOS

Linux (.deb, .AppImage) and macOS (.dmg) builds are available on demand via manual workflow dispatch. See [Cross-Platform Builds](#cross-platform-builds) below.

## Automatic Release Process

### Tag-Based Windows Releases

When a new version tag is pushed (e.g., `v0.4.1`), the following happens automatically:

1. **Windows Release Workflow** (`release-windows.yml`):
   - Triggers on tag push matching pattern `v*.*.*`
   - Extracts version from tag (e.g., `v0.4.1` → `0.4.1`)
   - Temporarily aligns `package.json` version with the tag version for the build
   - Builds the Windows installer using `electron-builder`
   - Creates two release assets:
     - `Soulvan-Miner-Setup-0.4.1.exe` (versioned)
     - `Soulvan-Miner-Setup.exe` (stable/latest alias)
   - Uploads both to the GitHub Release

2. **Version Bump Workflow** (`bump-version-on-tag.yml`):
   - Triggers on the same tag push
   - Opens a Pull Request to sync `apps/soulvancoin-miner-app/package.json` version with the tag
   - This PR should be merged to keep the repository in sync with released versions

### How to Create a New Release

1. Ensure your changes are committed and pushed
2. Create and push a tag:
   ```bash
   git tag v0.4.1
   git push origin v0.4.1
   ```
3. The Windows release workflow will automatically build and publish the installer
4. Review and merge the version bump PR created by the automation

## Version Management

The project uses a two-step version management approach:

- **Build-time alignment**: The release workflow temporarily updates `package.json` version during the build to match the tag
- **Repository sync**: A separate workflow creates a PR to permanently update `package.json` in the repository

This ensures:
- Releases are always built with the correct version number
- The repository version stays in sync with releases
- Clear audit trail via PRs for version changes

## Cross-Platform Builds

Linux and macOS builds can be created manually via the `release-cross.yml` workflow:

### Running the Manual Build Workflow

1. Go to **Actions** → **Release Cross-Platform (Manual)**
2. Click **Run workflow**
3. Configure options:
   - **version**: (Optional) Specify a version to build (e.g., `0.4.1`). Leave empty to use the current `package.json` version
   - **build_linux**: Check to build Linux packages (.deb, .AppImage)
   - **build_macos**: Check to build macOS package (.dmg)
4. Click **Run workflow**

The artifacts will be uploaded to the workflow run and can be downloaded from the Actions page.

## Code Signing

### Windows Code Signing

To enable Windows code signing, add the following secrets to your repository:

- `WIN_CSC_LINK` or `CSC_LINK`: Base64-encoded certificate file (.pfx)
- `WIN_CSC_KEY_PASSWORD` or `CSC_KEY_PASSWORD`: Certificate password

Then uncomment the signing environment variables in `.github/workflows/release-windows.yml`:

```yaml
env:
  WIN_CSC_LINK: ${{ secrets.WIN_CSC_LINK }}
  WIN_CSC_KEY_PASSWORD: ${{ secrets.WIN_CSC_KEY_PASSWORD }}
  CSC_LINK: ${{ secrets.WIN_CSC_LINK }}
  CSC_KEY_PASSWORD: ${{ secrets.WIN_CSC_KEY_PASSWORD }}
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### macOS Code Signing and Notarization

To enable macOS code signing and notarization, add the following secrets:

- `APPLE_ID`: Your Apple ID email
- `APPLE_APP_SPECIFIC_PASSWORD`: App-specific password for notarization
- `APPLE_TEAM_ID`: Your Apple Developer Team ID
- `CSC_LINK`: Base64-encoded certificate file (.p12)
- `CSC_KEY_PASSWORD`: Certificate password

Then uncomment the signing environment variables in `.github/workflows/release-cross.yml`:

```yaml
env:
  APPLE_ID: ${{ secrets.APPLE_ID }}
  APPLE_APP_SPECIFIC_PASSWORD: ${{ secrets.APPLE_APP_SPECIFIC_PASSWORD }}
  APPLE_TEAM_ID: ${{ secrets.APPLE_TEAM_ID }}
  CSC_LINK: ${{ secrets.CSC_LINK }}
  CSC_KEY_PASSWORD: ${{ secrets.CSC_KEY_PASSWORD }}
```

## Development

### Prerequisites

- Node.js 20.x or higher
- npm

### Installation

```bash
cd apps/soulvancoin-miner-app
npm install
```

### Running in Development

```bash
npm start
```

### Building

**Windows:**
```bash
npm run dist
```

**Linux:**
```bash
npm run dist:linux
```

**macOS:**
```bash
npm run dist:mac
```

## Project Structure

```
apps/soulvancoin-miner-app/
├── build/
│   └── entitlements.mac.plist  # macOS entitlements for code signing
├── main.js                     # Electron main process
├── preload.js                  # Preload script for security
├── index.html                  # Main UI
├── renderer.js                 # Renderer process logic
└── package.json               # Dependencies and build configuration
```

## License

MIT
