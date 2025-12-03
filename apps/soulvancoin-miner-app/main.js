const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { ExternalMiner, loadMinerConfigs } = require('./mining/external_miners');
const { generateMusic } = require('./ai/music_ai');
const { processPhoto, getAvailableStyles } = require('./ai/photo_ai');

let mainWindow;
let currentMiner = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'src/preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.png')
  });

  mainWindow.loadFile('src/index.html');

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
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

// Before quit, stop any running miner
app.on('before-quit', () => {
  if (currentMiner && currentMiner.isRunning) {
    currentMiner.stop();
  }
});

// IPC Handlers

// Get available miners
ipcMain.handle('get-miners', async () => {
  const miners = loadMinerConfigs();
  return miners;
});

// Start mining
ipcMain.handle('start-mining', async (event, config) => {
  if (currentMiner && currentMiner.isRunning) {
    return { success: false, error: 'Miner is already running' };
  }

  const miners = loadMinerConfigs();
  const minerConfig = miners[config.minerType];

  if (!minerConfig) {
    return { success: false, error: 'Invalid miner type' };
  }

  try {
    currentMiner = new ExternalMiner(minerConfig, {
      executablePath: config.executablePath,
      algorithm: config.algorithm,
      pool: config.pool,
      wallet: config.wallet,
      workerName: config.workerName,
      threads: config.threads
    });

    // Forward events to renderer
    currentMiner.on('start', (data) => {
      mainWindow.webContents.send('miner-start', data);
    });

    currentMiner.on('log', (data) => {
      mainWindow.webContents.send('miner-log', data);
    });

    currentMiner.on('stats', (data) => {
      mainWindow.webContents.send('miner-stats', data);
    });

    currentMiner.on('exit', (data) => {
      mainWindow.webContents.send('miner-exit', data);
      currentMiner = null;
    });

    currentMiner.on('error', (error) => {
      mainWindow.webContents.send('miner-error', { error: error.message });
    });

    currentMiner.start();

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Stop mining
ipcMain.handle('stop-mining', async () => {
  if (!currentMiner || !currentMiner.isRunning) {
    return { success: false, error: 'No miner is running' };
  }

  try {
    currentMiner.stop();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Get mining stats
ipcMain.handle('get-mining-stats', async () => {
  if (!currentMiner) {
    return { success: false, error: 'No miner initialized' };
  }

  return {
    success: true,
    stats: currentMiner.getStats(),
    isRunning: currentMiner.isRunning
  };
});

// Open file dialog
ipcMain.handle('open-file-dialog', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: options.properties || ['openFile'],
    filters: options.filters || []
  });

  if (result.canceled) {
    return { success: false, canceled: true };
  }

  return {
    success: true,
    filePaths: result.filePaths
  };
});

// Generate music
ipcMain.handle('generate-music', async (event, options) => {
  try {
    const result = generateMusic(options);
    return { success: true, ...result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Process photo
ipcMain.handle('process-photo', async (event, inputPath, options) => {
  try {
    const result = processPhoto(inputPath, options);
    return { success: true, ...result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Get photo styles
ipcMain.handle('get-photo-styles', async () => {
  return {
    success: true,
    styles: getAvailableStyles()
  };
});
