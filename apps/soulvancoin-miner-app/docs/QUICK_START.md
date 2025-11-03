# Quick Start Guide

## Installation

### Prerequisites
1. **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
2. **Git** - For cloning the repository

### Clone and Setup

```bash
# Clone the repository
git clone https://github.com/44547/soulvan-coin-core.git
cd soulvan-coin-core/apps/soulvancoin-miner-app

# Install dependencies
npm install

# Start the application
npm start
```

## First Launch

When you first launch the app, you'll see:
- **Mining Tab** (default view)
- **Music AI Tab**
- **Photo AI Tab**

## Mining Setup

### Step 1: Download a Miner
Download one of the supported miners:
- **XMRig**: https://github.com/xmrig/xmrig/releases
- **lolMiner**: https://github.com/Lolliedieb/lolMiner-releases/releases
- **T-Rex**: https://github.com/trexminer/T-Rex/releases
- **NBMiner**: https://github.com/NebuTech/NBMiner/releases

Extract the miner to a known location.

### Step 2: Configure Miner

1. **Select Miner Type**: Choose from the dropdown (e.g., "XMRig")
2. **Executable Path**: Browse to the miner binary
   - Windows: `C:\Miners\xmrig\xmrig.exe`
   - Linux: `/home/user/miners/xmrig/xmrig`
   - macOS: `/Users/user/miners/xmrig/xmrig`

3. **Algorithm**: Enter the mining algorithm
   - For XMRig + Monero: `randomx`
   - For T-Rex + Ethereum: `ethash`
   - For lolMiner + Ethereum Classic: `etchash`

4. **Pool**: Enter pool address
   - Example: `pool.supportxmr.com:3333`
   - Example: `eth.2miners.com:2020`

5. **Wallet Address**: Your cryptocurrency wallet address
   - Get from your crypto wallet (e.g., Monero GUI, MetaMask)

6. **Worker Name** (optional): Custom identifier
   - Default: `worker1`
   - Can be: `myrig`, `laptop1`, etc.

7. **Threads** (optional): CPU threads to use
   - Default: `4`
   - Recommended: Leave 1-2 threads for system

### Step 3: Start Mining

1. Click **Start Mining**
2. Watch logs appear in "Live Logs" section
3. Statistics will update as mining progresses
4. Click **Stop Mining** to stop

### Example Configuration (Monero)

```
Miner Type: XMRig
Executable: C:\Miners\xmrig\xmrig.exe
Algorithm: randomx
Pool: pool.supportxmr.com:3333
Wallet: YOUR_MONERO_WALLET_ADDRESS
Worker: worker1
Threads: 4
```

## Using Music AI

### Generate Music

1. Switch to **Music AI** tab
2. Set duration (1-60 seconds)
   - Default: 5 seconds
3. Set frequency (20-20000 Hz)
   - Default: 440 Hz (A4 note)
   - Try: 261 Hz (C4), 329 Hz (E4), 523 Hz (C5)
4. Click **Generate Music**
5. Audio player appears with generated sound
6. Click play to listen

### Generated Files
Files are saved to: `apps/soulvancoin-miner-app/output/music_*.wav`

## Using Photo AI

### Process Photos

1. Switch to **Photo AI** tab
2. Select a style:
   - **Enhanced**: General improvement
   - **Vintage**: Old photo look
   - **Noir**: Black and white
   - **Vibrant**: Boosted colors
   - **Soft**: Gentle effect
   - **Sharp**: Increased clarity
3. Click **Select Photo**
4. Choose an image file (jpg, png, gif, bmp, webp)
5. Click **Process Photo**
6. View side-by-side comparison

### Processed Files
Files are saved to: `apps/soulvancoin-miner-app/output/photo_*.{ext}`

## Building for Distribution

### Windows Installer

```bash
npm run build:win
```

Output: `dist/Soulvan Miner Setup *.exe`

### macOS DMG

```bash
npm run build:mac
```

Output: `dist/Soulvan Miner-*.dmg`

### Linux AppImage

```bash
npm run build:linux
```

Output: `dist/Soulvan Miner-*.AppImage`

## Customization

### Adding Brand Image

1. Create or obtain a PNG logo (40px height recommended)
2. Save as `apps/soulvancoin-miner-app/assets/title.png`
3. Restart app - image appears in navbar

### Adding Application Icons

1. Create 512x512 PNG icon
2. Convert to platform formats:
   - `icon.png` (512x512)
   - `icon.ico` (Windows)
   - `icon.icns` (macOS)
3. Place in `apps/soulvancoin-miner-app/assets/`

Tools for conversion:
- electron-icon-builder
- png2icons
- Online converters

## Troubleshooting

### Miner Won't Start
- **Check executable path**: Ensure it points to actual binary
- **Check permissions**: Make binary executable (`chmod +x` on Linux/macOS)
- **Check algorithm**: Verify it's supported by the miner
- **Check logs**: Look for error messages in Live Logs

### No Statistics Showing
- **Wait**: Some miners take time to display hashrate
- **Check patterns**: Miner output might not match expected patterns
- **View logs**: Ensure miner is actually running

### Music Generation Fails
- **Check disk space**: Ensure enough space in output directory
- **Check permissions**: Ensure write access to output directory

### Photo Processing Fails
- **Check file format**: Ensure image is in supported format
- **Check file size**: Very large images might take time
- **Check permissions**: Ensure read access to input file

## Getting Help

### Documentation
- Main README: `apps/soulvancoin-miner-app/README.md`
- Architecture: `apps/soulvancoin-miner-app/docs/ARCHITECTURE.md`
- UI Guide: `apps/soulvancoin-miner-app/docs/UI_DOCUMENTATION.md`

### Logs
- Check "Live Logs" section in Mining tab
- Check console (Ctrl+Shift+I / Cmd+Option+I)

### Issues
Report bugs on GitHub: https://github.com/44547/soulvan-coin-core/issues

## Development

### Run Tests
```bash
npm test
```

### Run Linter
```bash
npm run lint
```

### Development Mode
```bash
npm start
```
Opens app with DevTools for debugging.

## Next Steps

1. **Optimize mining**: Adjust threads for best hashrate
2. **Monitor stats**: Keep eye on accepted vs rejected shares
3. **Experiment**: Try different algorithms and pools
4. **Customize**: Add your brand image and icons
5. **Share**: Build installer and distribute to others

Happy Mining! 🚀
