const { ExternalMiner, loadMinerConfigs } = require('../mining/external_miners');
const { generateMusic } = require('../ai/music_ai');
const { processPhoto, getAvailableStyles } = require('../ai/photo_ai');
const fs = require('fs');
const path = require('path');

describe('Miner Configuration', () => {
  test('should load miner configs', () => {
    const configs = loadMinerConfigs();
    expect(configs).toBeDefined();
    expect(configs.xmrig).toBeDefined();
    expect(configs.lolminer).toBeDefined();
    expect(configs.srbminer).toBeDefined();
    expect(configs.teamredminer).toBeDefined();
    expect(configs.gminer).toBeDefined();
    expect(configs.nbminer).toBeDefined();
    expect(configs.trex).toBeDefined();
  });

  test('should have required fields in miner configs', () => {
    const configs = loadMinerConfigs();
    Object.keys(configs).forEach(key => {
      const config = configs[key];
      expect(config.name).toBeDefined();
      expect(config.description).toBeDefined();
      expect(config.executable).toBeDefined();
      expect(config.supportedAlgos).toBeDefined();
      expect(config.commandTemplate).toBeDefined();
      expect(config.hashRatePatterns).toBeDefined();
      expect(Array.isArray(config.supportedAlgos)).toBe(true);
      expect(Array.isArray(config.hashRatePatterns)).toBe(true);
    });
  });
});

describe('ExternalMiner', () => {
  const mockConfig = {
    name: 'TestMiner',
    executable: 'test-miner',
    commandTemplate: '{EXECUTABLE} -a {ALGO} -o {POOL} -u {WALLET}.{WORKERNAME} -t {THREADS}',
    hashRatePatterns: ['speed\\s+([\\d.]+)\\s+([kMGT]?H/s)']
  };

  test('should build command with variables', () => {
    const miner = new ExternalMiner(mockConfig, {
      executablePath: '/path/to/miner',
      algorithm: 'randomx',
      pool: 'pool.example.com:3333',
      wallet: 'WALLET123',
      workerName: 'worker1',
      threads: '4'
    });

    const cmd = miner.buildCommand();
    expect(cmd.executable).toBe('/path/to/miner');
    expect(cmd.args).toContain('-a');
    expect(cmd.args).toContain('randomx');
    expect(cmd.args).toContain('-o');
    expect(cmd.args).toContain('pool.example.com:3333');
  });

  test('should parse hashrate with different units', () => {
    const miner = new ExternalMiner(mockConfig, {});
    
    const tests = [
      { line: 'speed 100.5 H/s', expected: { value: 100.5, unit: 'H/s', baseHashrate: 100.5 } },
      { line: 'speed 50.2 kH/s', expected: { value: 50.2, unit: 'kH/s', baseHashrate: 50200 } },
      { line: 'speed 25.5 MH/s', expected: { value: 25.5, unit: 'MH/s', baseHashrate: 25500000 } },
      { line: 'speed 1.5 GH/s', expected: { value: 1.5, unit: 'GH/s', baseHashrate: 1500000000 } }
    ];

    tests.forEach(test => {
      const result = miner.parseHashrate(test.line);
      expect(result).toBeDefined();
      expect(result.value).toBeCloseTo(test.expected.value);
      expect(result.unit).toBe(test.expected.unit);
      expect(result.baseHashrate).toBeCloseTo(test.expected.baseHashrate);
    });
  });

  test('should parse shares', () => {
    const miner = new ExternalMiner(mockConfig, {});
    
    expect(miner.parseShares('share accepted')).toEqual({ type: 'accepted' });
    expect(miner.parseShares('share rejected')).toEqual({ type: 'rejected' });
    expect(miner.parseShares('[OK] share submitted')).toEqual({ type: 'accepted' });
    expect(miner.parseShares('random log line')).toBeNull();
  });
});

describe('Music AI', () => {
  const outputDir = path.join(__dirname, '../output');

  beforeAll(() => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  });

  test('should generate WAV file', () => {
    const result = generateMusic({
      duration: 2,
      frequency: 440,
      outputPath: path.join(outputDir, 'test_music.wav')
    });

    expect(result.success).toBe(true);
    expect(result.filePath).toBeDefined();
    expect(fs.existsSync(result.filePath)).toBe(true);

    // Check WAV file header
    const fileBuffer = fs.readFileSync(result.filePath);
    expect(fileBuffer.slice(0, 4).toString()).toBe('RIFF');
    expect(fileBuffer.slice(8, 12).toString()).toBe('WAVE');

    // Cleanup
    fs.unlinkSync(result.filePath);
  });

  test('should return file path', () => {
    const result = generateMusic({
      duration: 1,
      frequency: 440,
      outputPath: path.join(outputDir, 'test_music_2.wav')
    });

    expect(result.filePath).toBeDefined();
    expect(typeof result.filePath).toBe('string');
    
    // Cleanup
    if (fs.existsSync(result.filePath)) {
      fs.unlinkSync(result.filePath);
    }
  });
});

describe('Photo AI', () => {
  const outputDir = path.join(__dirname, '../output');
  const testImagePath = path.join(__dirname, 'test_image.png');

  beforeAll(() => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Create a simple test image (1x1 PNG)
    const pngData = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
      0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
      0xde, 0x00, 0x00, 0x00, 0x0c, 0x49, 0x44, 0x41,
      0x54, 0x08, 0xd7, 0x63, 0xf8, 0xcf, 0xc0, 0x00,
      0x00, 0x03, 0x01, 0x01, 0x00, 0x18, 0xdd, 0x8d,
      0xb4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e,
      0x44, 0xae, 0x42, 0x60, 0x82
    ]);
    fs.writeFileSync(testImagePath, pngData);
  });

  afterAll(() => {
    // Cleanup test image
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
  });

  test('should get available styles', () => {
    const styles = getAvailableStyles();
    expect(Array.isArray(styles)).toBe(true);
    expect(styles.length).toBeGreaterThan(0);
    expect(styles).toContain('enhanced');
  });

  test('should process photo', () => {
    const result = processPhoto(testImagePath, {
      style: 'enhanced',
      outputPath: path.join(outputDir, 'test_photo_output.png')
    });

    expect(result.success).toBe(true);
    expect(result.inputPath).toBe(testImagePath);
    expect(result.outputPath).toBeDefined();
    expect(fs.existsSync(result.outputPath)).toBe(true);

    // Cleanup
    fs.unlinkSync(result.outputPath);
  });

  test('should throw error for non-existent file', () => {
    expect(() => {
      processPhoto('/non/existent/file.png');
    }).toThrow();
  });
});
