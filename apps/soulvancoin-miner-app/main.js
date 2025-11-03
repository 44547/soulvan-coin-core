/**
 * Electron main process for Soulvan Coin Miner App
 */

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Import modules
const { DemoMiner } = require('./mining/miner_core');
const { ExternalMiner } = require('./mining/external_miners');
const { PoolMining } = require('./mining/pool_mining');
const { SoloMining } = require('./mining/solo_mining');
const { SoulvanWallet } = require('./wallet/soulvan_integration');
const { TonWallet } = require('./wallet/ton_integration');
const { MusicAI } = require('./ai/music_ai');
const { PhotoAI } = require('./ai/photo_ai');
const { DAOGovernance } = require('./dao/governance');
const { Diagnostics } = require('./scripts/diagnostics');
const { Benchmark } = require('./scripts/benchmark');
const { DockerManager } = require('./docker/docker_manager');

// Global instances
let mainWindow;
let demoMiner = new DemoMiner();
let externalMiner = new ExternalMiner();
let poolMining = new PoolMining();
let soloMining = new SoloMining();
let soulvanWallet = new SoulvanWallet();
let tonWallet = new TonWallet();
let musicAI = new MusicAI();
let photoAI = new PhotoAI();
let daoGovernance = new DAOGovernance();
let diagnostics = new Diagnostics();
let benchmark = new Benchmark();
let dockerManager = new DockerManager();

// Track first wallet creation for cinematic onboarding
let isFirstWalletCreation = true;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'src/preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(__dirname, 'icon.png')
  });

  mainWindow.loadFile(path.join(__dirname, 'src/index.html'));

  // Open DevTools in development
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// ===== MINING IPC HANDLERS =====

ipcMain.handle('mining:startDemo', async (event, threads) => {
  try {
    return demoMiner.start(threads, (stats) => {
      mainWindow.webContents.send('mining:stats', stats);
    });
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('mining:stopDemo', async () => {
  try {
    return demoMiner.stop();
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('mining:getStats', async () => {
  try {
    return demoMiner.getStats();
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('mining:startExternal', async (event, config) => {
  try {
    return externalMiner.start(
      config,
      (text, isError) => {
        mainWindow.webContents.send('mining:log', { text, isError });
      },
      (stats) => {
        mainWindow.webContents.send('mining:stats', stats);
      }
    );
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('mining:stopExternal', async () => {
  try {
    return externalMiner.stop();
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('mining:getExternalStats', async () => {
  try {
    return externalMiner.getStats();
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('mining:getExternalLogs', async (event, limit) => {
  try {
    return externalMiner.getLogs(limit);
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('mining:loadPresets', async () => {
  try {
    const presetsPath = path.join(__dirname, 'config/miners.json');
    const data = fs.readFileSync(presetsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { error: error.message };
  }
});

// ===== WALLET IPC HANDLERS =====

ipcMain.handle('wallet:createSoulvan', async (event, name) => {
  try {
    const result = soulvanWallet.createWallet(name);
    result.isFirstTime = isFirstWalletCreation;
    if (isFirstWalletCreation) {
      isFirstWalletCreation = false;
    }
    return result;
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('wallet:createTon', async (event, name) => {
  try {
    const result = tonWallet.createWallet(name);
    result.isFirstTime = isFirstWalletCreation;
    if (isFirstWalletCreation) {
      isFirstWalletCreation = false;
    }
    return result;
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('wallet:getBalanceSoulvan', async (event, address) => {
  try {
    return soulvanWallet.getBalance(address);
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('wallet:getBalanceTon', async (event, address) => {
  try {
    return tonWallet.getBalance(address);
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('wallet:sendSoulvan', async (event, toAddress, amount) => {
  try {
    return soulvanWallet.send(toAddress, amount);
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('wallet:sendTon', async (event, toAddress, amount) => {
  try {
    return tonWallet.send(toAddress, amount);
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('wallet:getCurrentSoulvan', async () => {
  try {
    return soulvanWallet.getCurrentWallet();
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('wallet:getCurrentTon', async () => {
  try {
    return tonWallet.getCurrentWallet();
  } catch (error) {
    return { error: error.message };
  }
});

// ===== AI IPC HANDLERS =====

ipcMain.handle('ai:generateMusic', async (event, prompt, duration) => {
  try {
    return await musicAI.generate(prompt, duration);
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('ai:listMusicFiles', async () => {
  try {
    return musicAI.listGeneratedFiles();
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('ai:generateAvatar', async (event, prompt, style) => {
  try {
    return await photoAI.generateAvatar(prompt, style);
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('ai:listAvatarStyles', async () => {
  try {
    return photoAI.listStyles();
  } catch (error) {
    return { error: error.message };
  }
});

// ===== DAO IPC HANDLERS =====

ipcMain.handle('dao:createProposal', async (event, title, description, options) => {
  try {
    return daoGovernance.createProposal(title, description, options);
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('dao:vote', async (event, proposalId, option) => {
  try {
    return daoGovernance.vote(proposalId, option);
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('dao:listProposals', async (event, status) => {
  try {
    return daoGovernance.listProposals(status);
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('dao:getProposal', async (event, proposalId) => {
  try {
    return daoGovernance.getProposal(proposalId);
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('dao:closeProposal', async (event, proposalId) => {
  try {
    return daoGovernance.closeProposal(proposalId);
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('dao:getStats', async () => {
  try {
    return daoGovernance.getStats();
  } catch (error) {
    return { error: error.message };
  }
});

// ===== UTILITY SCRIPTS IPC HANDLERS =====

ipcMain.handle('scripts:runDiagnostics', async () => {
  try {
    return await diagnostics.runAll();
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('scripts:runBenchmark', async (event, iterations) => {
  try {
    return await benchmark.run(iterations);
  } catch (error) {
    return { error: error.message };
  }
});

// ===== DOCKER IPC HANDLERS =====

ipcMain.handle('docker:build', async (event, tag) => {
  try {
    return dockerManager.build(tag);
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('docker:run', async (event, command, tag) => {
  try {
    return dockerManager.run(command, tag);
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('docker:listImages', async () => {
  try {
    return dockerManager.listImages();
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('docker:isAvailable', async () => {
  try {
    return dockerManager.isDockerAvailable();
  } catch (error) {
    return false;
  }
});
