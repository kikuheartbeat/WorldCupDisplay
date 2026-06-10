const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  setWindowSize: (size) => ipcRenderer.send('set-window-size', size),
  getExpandedSize: () => ipcRenderer.invoke('get-expanded-size'),
  getCollapsedSize: () => ipcRenderer.invoke('get-collapsed-size'),
});
