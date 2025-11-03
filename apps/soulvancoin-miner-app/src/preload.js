const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Miner operations
  getMiners: () => ipcRenderer.invoke('get-miners'),
  startMining: (config) => ipcRenderer.invoke('start-mining', config),
  stopMining: () => ipcRenderer.invoke('stop-mining'),
  getMiningStats: () => ipcRenderer.invoke('get-mining-stats'),

  // Miner events
  onMinerStart: (callback) => ipcRenderer.on('miner-start', (event, data) => callback(data)),
  onMinerLog: (callback) => ipcRenderer.on('miner-log', (event, data) => callback(data)),
  onMinerStats: (callback) => ipcRenderer.on('miner-stats', (event, data) => callback(data)),
  onMinerExit: (callback) => ipcRenderer.on('miner-exit', (event, data) => callback(data)),
  onMinerError: (callback) => ipcRenderer.on('miner-error', (event, data) => callback(data)),

  // File operations
  openFileDialog: (options) => ipcRenderer.invoke('open-file-dialog', options),

  // AI operations
  generateMusic: (options) => ipcRenderer.invoke('generate-music', options),
  processPhoto: (inputPath, options) => ipcRenderer.invoke('process-photo', inputPath, options),
  getPhotoStyles: () => ipcRenderer.invoke('get-photo-styles')
});
