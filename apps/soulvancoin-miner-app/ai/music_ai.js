/**
 * SoulvanMusic AI - WAV audio generation
 * Generates simple audio tones and saves as WAV files
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

class MusicAI {
  constructor() {
    this.appDataDir = path.join(os.homedir(), '.soulvancoin-miner', 'music');
    this.ensureAppDataDir();
  }

  ensureAppDataDir() {
    if (!fs.existsSync(this.appDataDir)) {
      fs.mkdirSync(this.appDataDir, { recursive: true });
    }
  }

  async generate(prompt, duration = 3) {
    // Parse prompt for frequency hints (simple demo)
    const frequency = this.parsePromptForFrequency(prompt);
    
    // Generate audio tone
    const sampleRate = 44100;
    const numSamples = Math.floor(sampleRate * duration);
    const samples = this.generateTone(frequency, sampleRate, numSamples);
    
    // Create WAV file
    const filename = `music_${Date.now()}.wav`;
    const filepath = path.join(this.appDataDir, filename);
    
    this.writeWAV(filepath, samples, sampleRate);
    
    // Generate preview points (for waveform visualization)
    const previewPoints = this.generatePreviewPoints(samples, 100);
    
    return {
      success: true,
      filepath,
      filename,
      duration,
      frequency,
      sampleRate,
      previewPoints,
      message: `Audio generated based on prompt: "${prompt}"`
    };
  }

  parsePromptForFrequency(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    // Map keywords to frequencies
    if (lowerPrompt.includes('low') || lowerPrompt.includes('bass')) {
      return 200 + Math.random() * 100;
    } else if (lowerPrompt.includes('high') || lowerPrompt.includes('treble')) {
      return 1000 + Math.random() * 500;
    } else if (lowerPrompt.includes('middle') || lowerPrompt.includes('mid')) {
      return 500 + Math.random() * 200;
    } else {
      // Default: middle A (440 Hz) with some variation
      return 440 + Math.random() * 100 - 50;
    }
  }

  generateTone(frequency, sampleRate, numSamples) {
    const samples = new Int16Array(numSamples);
    const amplitude = 16000; // Max amplitude for 16-bit audio
    
    for (let i = 0; i < numSamples; i++) {
      // Generate sine wave with envelope (fade in/out)
      const t = i / sampleRate;
      const envelope = this.getEnvelope(i, numSamples);
      samples[i] = Math.floor(amplitude * envelope * Math.sin(2 * Math.PI * frequency * t));
    }
    
    return samples;
  }

  getEnvelope(sample, totalSamples) {
    const fadeLength = Math.floor(totalSamples * 0.1); // 10% fade
    
    if (sample < fadeLength) {
      // Fade in
      return sample / fadeLength;
    } else if (sample > totalSamples - fadeLength) {
      // Fade out
      return (totalSamples - sample) / fadeLength;
    } else {
      return 1.0;
    }
  }

  writeWAV(filepath, samples, sampleRate) {
    const numChannels = 1; // Mono
    const bitsPerSample = 16;
    const byteRate = sampleRate * numChannels * bitsPerSample / 8;
    const blockAlign = numChannels * bitsPerSample / 8;
    const dataSize = samples.length * 2; // 2 bytes per sample
    
    const buffer = Buffer.alloc(44 + dataSize);
    
    // WAV header
    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(36 + dataSize, 4);
    buffer.write('WAVE', 8);
    
    // fmt chunk
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16); // fmt chunk size
    buffer.writeUInt16LE(1, 20); // PCM format
    buffer.writeUInt16LE(numChannels, 22);
    buffer.writeUInt32LE(sampleRate, 24);
    buffer.writeUInt32LE(byteRate, 28);
    buffer.writeUInt16LE(blockAlign, 32);
    buffer.writeUInt16LE(bitsPerSample, 34);
    
    // data chunk
    buffer.write('data', 36);
    buffer.writeUInt32LE(dataSize, 40);
    
    // Write samples
    for (let i = 0; i < samples.length; i++) {
      buffer.writeInt16LE(samples[i], 44 + i * 2);
    }
    
    fs.writeFileSync(filepath, buffer);
  }

  generatePreviewPoints(samples, numPoints) {
    const step = Math.floor(samples.length / numPoints);
    const points = [];
    
    for (let i = 0; i < numPoints; i++) {
      const index = i * step;
      if (index < samples.length) {
        points.push(samples[index] / 32768); // Normalize to -1 to 1
      }
    }
    
    return points;
  }

  listGeneratedFiles() {
    try {
      const files = fs.readdirSync(this.appDataDir);
      return files.filter(f => f.endsWith('.wav')).map(f => ({
        filename: f,
        filepath: path.join(this.appDataDir, f),
        size: fs.statSync(path.join(this.appDataDir, f)).size
      }));
    } catch (error) {
      return [];
    }
  }
}

module.exports = { MusicAI };
