const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { verifyBitcoinLogin } = require('./auth/bitcoin_auth');
const { buildSwapLinks } = require('./src/payments');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'src', 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers

// Bitcoin authentication
ipcMain.handle('auth:btcVerify', async (event, { address, message, signature }) => {
  try {
    const result = await verifyBitcoinLogin(address, message, signature);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Payment swap links
ipcMain.handle('payments:swapLinks', async (event, { from, amount, to, toAddress, refundAddress }) => {
  try {
    const links = buildSwapLinks({ from, to, amount, toAddress, refundAddress });
    return { success: true, links };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Open external URL
ipcMain.handle('payments:openExternal', async (event, url) => {
  try {
    await shell.openExternal(url);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
