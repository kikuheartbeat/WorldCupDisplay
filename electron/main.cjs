const { app, BrowserWindow, Tray, Menu, screen, ipcMain } = require('electron');
const path = require('path');

let mainWindow = null;
let tray = null;
let isQuitting = false;

function createWindow() {
  const { width: screenWidth } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: 380,
    height: 64,
    x: Math.round((screenWidth - 380) / 2),
    y: 10,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  const isDev = process.argv.includes('--dev') || !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  mainWindow.webContents.on('console-message', (event, level, message) => {
    console.log(`[Renderer] ${message}`);
  });

  mainWindow.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault();
      mainWindow.hide();
    }
  });
}

function createTray() {
  tray = new Tray(path.join(__dirname, '..', 'assets', 'tray-icon.png'));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show/Hide',
      click: () => {
        if (mainWindow.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow.show();
        }
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip('World Cup Display');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
}

function createTrayIconIfMissing() {
  const fs = require('fs');
  const assetsDir = path.join(__dirname, '..', 'assets');
  const iconPath = path.join(assetsDir, 'tray-icon.png');

  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  if (!fs.existsSync(iconPath)) {
    const { nativeImage } = require('electron');
    const icon = nativeImage.createEmpty();
    const size = 32;
    const buffer = Buffer.alloc(size * size * 4);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        const cx = x - size / 2;
        const cy = y - size / 2;
        const dist = Math.sqrt(cx * cx + cy * cy);
        if (dist < size / 2 - 1) {
          buffer[idx] = 0;
          buffer[idx + 1] = 180;
          buffer[idx + 2] = 80;
          buffer[idx + 3] = 255;
        } else {
          buffer[idx + 3] = 0;
        }
      }
    }

    const img = nativeImage.createFromBuffer(buffer, { width: size, height: size });
    fs.writeFileSync(iconPath, img.toPNG());
  }
}

ipcMain.handle('get-expanded-size', () => {
  return { width: 380, height: 520 };
});

ipcMain.handle('get-collapsed-size', () => {
  return { width: 380, height: 64 };
});

ipcMain.on('set-window-size', (_, { width, height }) => {
  if (mainWindow) {
    const { width: screenWidth } = screen.getPrimaryDisplay().workAreaSize;
    const [winX, winY] = mainWindow.getPosition();
    const newX = Math.round((screenWidth - width) / 2);
    mainWindow.setBounds({ x: newX, y: winY, width, height }, true);
  }
});

app.whenReady().then(() => {
  createTrayIconIfMissing();
  createWindow();
  createTray();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  isQuitting = true;
});
