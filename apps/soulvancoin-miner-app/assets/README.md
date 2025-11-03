# Assets Directory

This directory contains application assets for the Soulvan Miner.

## Files

### title.png
**Optional** - Brand image displayed in the navbar next to the application title.
- Recommended size: 40px height (width will auto-scale)
- Format: PNG with transparency support
- If this file is not present, the image will be automatically hidden via the `onerror` handler

### icon.png / icon.ico / icon.icns
Application icons for different platforms:
- **icon.png** - Linux AppImage icon
- **icon.ico** - Windows installer icon
- **icon.icns** - macOS DMG icon

## Adding Your Brand Image

To add your custom brand image:

1. Create or obtain a PNG image for your brand/logo
2. Save it as `title.png` in this directory
3. The image will automatically appear in the navbar when you restart the application

If you don't want to display a brand image, simply leave this file absent - the navbar will display only the text title.
