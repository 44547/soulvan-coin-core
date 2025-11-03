const fs = require('fs');
const path = require('path');

/**
 * Generate a simple mono 16-bit WAV file with a sine wave tone
 * This is a demo implementation that creates actual WAV audio
 */
function generateMusic(options = {}) {
  const {
    duration = 5, // seconds
    frequency = 440, // Hz (A4 note)
    sampleRate = 44100,
    outputPath = path.join(__dirname, '../output', `music_${Date.now()}.wav`)
  } = options;

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const numSamples = sampleRate * duration;
  const numChannels = 1; // Mono
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = numSamples * blockAlign;

  // Create WAV header
  const header = Buffer.alloc(44);
  
  // RIFF chunk descriptor
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  
  // fmt sub-chunk
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  header.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  
  // data sub-chunk
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  // Generate audio data (sine wave)
  const audioData = Buffer.alloc(dataSize);
  const amplitude = 32767 * 0.5; // 50% volume to avoid clipping
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sample = Math.sin(2 * Math.PI * frequency * t) * amplitude;
    const sampleInt16 = Math.round(sample);
    audioData.writeInt16LE(sampleInt16, i * 2);
  }

  // Write complete WAV file
  const wavFile = Buffer.concat([header, audioData]);
  fs.writeFileSync(outputPath, wavFile);

  return {
    success: true,
    filePath: outputPath,
    duration,
    frequency,
    sampleRate
  };
}

module.exports = {
  generateMusic
};
