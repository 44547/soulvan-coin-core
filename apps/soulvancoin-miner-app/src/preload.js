/**
 * Electron preload script
 * Exposes safe IPC channels to the renderer process
 */

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use ipcRenderer
contextBridge.exposeInMainWorld('electronAPI', {
  // Mining APIs
  mining: {
    startDemo: (threads) => ipcRenderer.invoke('mining:startDemo', threads),
    stopDemo: () => ipcRenderer.invoke('mining:stopDemo'),
    getStats: () => ipcRenderer.invoke('mining:getStats'),
    startExternal: (config) => ipcRenderer.invoke('mining:startExternal', config),
    stopExternal: () => ipcRenderer.invoke('mining:stopExternal'),
    getExternalStats: () => ipcRenderer.invoke('mining:getExternalStats'),
    getExternalLogs: (limit) => ipcRenderer.invoke('mining:getExternalLogs', limit),
    loadPresets: () => ipcRenderer.invoke('mining:loadPresets'),
    onStats: (callback) => ipcRenderer.on('mining:stats', (event, stats) => callback(stats)),
    onLog: (callback) => ipcRenderer.on('mining:log', (event, log) => callback(log))
  },

  // Wallet APIs
  wallet: {
    createSoulvan: (name) => ipcRenderer.invoke('wallet:createSoulvan', name),
    createTon: (name) => ipcRenderer.invoke('wallet:createTon', name),
    getBalanceSoulvan: (address) => ipcRenderer.invoke('wallet:getBalanceSoulvan', address),
    getBalanceTon: (address) => ipcRenderer.invoke('wallet:getBalanceTon', address),
    sendSoulvan: (toAddress, amount) => ipcRenderer.invoke('wallet:sendSoulvan', toAddress, amount),
    sendTon: (toAddress, amount) => ipcRenderer.invoke('wallet:sendTon', toAddress, amount),
    getCurrentSoulvan: () => ipcRenderer.invoke('wallet:getCurrentSoulvan'),
    getCurrentTon: () => ipcRenderer.invoke('wallet:getCurrentTon')
  },

  // AI APIs
  ai: {
    generateMusic: (prompt, duration) => ipcRenderer.invoke('ai:generateMusic', prompt, duration),
    listMusicFiles: () => ipcRenderer.invoke('ai:listMusicFiles'),
    generateAvatar: (prompt, style) => ipcRenderer.invoke('ai:generateAvatar', prompt, style),
    listAvatarStyles: () => ipcRenderer.invoke('ai:listAvatarStyles')
  },

  // DAO APIs
  dao: {
    createProposal: (title, description, options) => ipcRenderer.invoke('dao:createProposal', title, description, options),
    vote: (proposalId, option) => ipcRenderer.invoke('dao:vote', proposalId, option),
    listProposals: (status) => ipcRenderer.invoke('dao:listProposals', status),
    getProposal: (proposalId) => ipcRenderer.invoke('dao:getProposal', proposalId),
    closeProposal: (proposalId) => ipcRenderer.invoke('dao:closeProposal', proposalId),
    getStats: () => ipcRenderer.invoke('dao:getStats')
  },

  // Utility Scripts APIs
  scripts: {
    runDiagnostics: () => ipcRenderer.invoke('scripts:runDiagnostics'),
    runBenchmark: (iterations) => ipcRenderer.invoke('scripts:runBenchmark', iterations)
  },

  // Docker APIs
  docker: {
    build: (tag) => ipcRenderer.invoke('docker:build', tag),
    run: (command, tag) => ipcRenderer.invoke('docker:run', command, tag),
    listImages: () => ipcRenderer.invoke('docker:listImages'),
    isAvailable: () => ipcRenderer.invoke('docker:isAvailable')
  }
});
