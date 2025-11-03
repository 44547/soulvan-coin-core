# UI Documentation

## Overview
The Soulvan Miner app features a modern, gradient-themed interface with three main tabs: Mining, Music AI, and Photo AI.

## Navbar
- **Brand Section**: 
  - Optional logo image (from `assets/title.png`)
  - "Soulvan Miner" title text
  - Clean white background with subtle shadow

## Tab Navigation
Three tabs for different features:
1. **Mining** - Configure and control cryptocurrency mining
2. **Music AI** - Generate AI-powered music
3. **Photo AI** - Process photos with AI styles

## Mining Tab

### Configuration Section
Form inputs for miner setup:
- **Miner Type**: Dropdown with 7 presets (XMRig, lolMiner, SRBMiner-MULTI, TeamRedMiner, GMiner, NBMiner, T-Rex)
- **Executable Path**: Path to the miner executable
- **Algorithm**: Mining algorithm (e.g., randomx, ethash, kawpow)
- **Pool**: Pool address and port
- **Wallet Address**: Your cryptocurrency wallet
- **Worker Name**: Custom worker identifier (default: worker1)
- **Threads**: Number of CPU threads to use (default: 4)

Buttons:
- **Start Mining**: Green gradient button to begin mining
- **Stop Mining**: Red gradient button to stop (disabled until mining starts)

### Statistics Section
Real-time mining stats displayed in a grid:
- **Hashrate**: Current mining speed (e.g., "150.25 MH/s")
- **Accepted Shares**: Count of accepted shares
- **Rejected Shares**: Count of rejected shares
- **Uptime**: Time elapsed (formatted as "Xh Ym Zs")

Each stat is displayed in a purple gradient box with white text.

### Live Logs Section
- Dark terminal-style log viewer
- Color-coded output:
  - Green text for standard output (stdout)
  - Red text for errors (stderr)
- Auto-scrolls to latest entries
- Keeps last 500 log lines
- Timestamps for each entry

## Music AI Tab

### Music Generator Section
Form inputs:
- **Duration**: Length in seconds (1-60)
- **Frequency**: Tone frequency in Hz (20-20000)

Button:
- **Generate Music**: Purple gradient button

### Music Preview
Appears after generation:
- HTML5 audio player with controls
- File information display:
  - Output file path
  - Duration
  - Frequency
  - Sample rate (44100 Hz)

## Photo AI Tab

### Photo Processor Section
Form inputs:
- **Style**: Dropdown with 6 options
  - Enhanced
  - Vintage
  - Noir
  - Vibrant
  - Soft
  - Sharp

Buttons:
- **Select Photo**: Opens native file picker (filters: jpg, jpeg, png, gif, bmp, webp)
- **Process Photo**: Green button (disabled until photo selected)

### Photo Preview
Side-by-side comparison after processing:
- **Original**: Left side - source image
- **Processed**: Right side - styled output
- File information display:
  - Input path
  - Output path
  - Applied style

## Color Scheme
- **Primary Gradient**: Purple to violet (#667eea to #764ba2)
- **Success**: Green gradient (#56ab2f to #a8e063)
- **Danger**: Red gradient (#eb3349 to #f45c43)
- **Background**: Body uses primary gradient
- **Cards**: White with rounded corners and shadow

## Responsive Design
- Grid layouts adapt to screen size
- Minimum card width: 200px
- Maximum content width maintains readability
- Forms stack vertically on narrow screens

## User Interactions
- Smooth hover effects on buttons (lift on hover)
- Focus states for form inputs (border color change to purple)
- Disabled states clearly indicated (reduced opacity)
- Tab switching with fade-in animation
- Real-time updates without page refresh

## Accessibility
- Semantic HTML structure
- Labeled form inputs
- Button states (enabled/disabled)
- Color contrast for readability
- Terminal-style logs maintain mono font for clarity
