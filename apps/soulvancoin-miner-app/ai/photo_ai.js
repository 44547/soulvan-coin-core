const fs = require('fs');
const path = require('path');

/**
 * Photo AI - Demo stub that copies selected image to styled output filename
 * In a real implementation, this could apply filters, effects, or AI-based enhancements
 */
function processPhoto(inputPath, options = {}) {
  const {
    style = 'enhanced',
    outputPath = path.join(
      __dirname,
      '../output',
      `photo_${style}_${Date.now()}${path.extname(inputPath)}`
    )
  } = options;

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Check if input file exists
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }

  // For demo purposes, just copy the file with a styled name
  // In production, this could apply actual image processing
  fs.copyFileSync(inputPath, outputPath);

  return {
    success: true,
    inputPath,
    outputPath,
    style,
    message: `Photo processed with ${style} style`
  };
}

/**
 * List available photo styles
 */
function getAvailableStyles() {
  return [
    'enhanced',
    'vintage',
    'noir',
    'vibrant',
    'soft',
    'sharp'
  ];
}

module.exports = {
  processPhoto,
  getAvailableStyles
};
