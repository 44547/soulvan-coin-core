const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  auth: {
    btcVerify: (address, message, signature) => 
      ipcRenderer.invoke('auth:btcVerify', { address, message, signature })
  },
  payments: {
    swapLinks: (from, amount, to, toAddress, refundAddress) => 
      ipcRenderer.invoke('payments:swapLinks', { from, amount, to, toAddress, refundAddress }),
    openExternal: (url) => 
      ipcRenderer.invoke('payments:openExternal', url)
  }
});
