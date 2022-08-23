/* eslint-disable max-len */
import {
  app, BrowserWindow, nativeTheme, ipcMain,
} from 'electron';
import path from 'path';
import os from 'os';
import {
  createClient, createWS, getNames, getCurrentUser,
} from './controller';

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

app.disableHardwareAcceleration();

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    // eslint-disable-next-line global-require
    require('fs').unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'));
  }
// eslint-disable-next-line no-empty
} catch (_) { }

let mainWindow;

async function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 420,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
    frame: false,
  });

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools();
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  ipcMain.on('max', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
    // mainWindow is the reference to your window
      mainWindow.maximize();
    }
  });

  ipcMain.on('min', () => {
    // mainWindow is the reference to your window
    mainWindow.minimize();
  });

  ipcMain.on('exit', () => {
    // mainWindow is the reference to your window
    mainWindow.close();
  });

  let client;
  let ws;

  ipcMain.on('force-fetch', () => {
    getNames(mainWindow);
  });

  ipcMain.on('connector-start', async () => {
    if (client) {
      client.stop();
      client = null;
    }

    if (ws) {
      ws.unsubscribe('OnJsonApiEvent');
      ws = null;
    }

    try {
      client = await createClient();
      ws = await createWS();
      client.on('connect', (data) => {
        console.log('connected');
        console.log('session data', data);
      });

      client.on('disconnect', () => {
        mainWindow.webContents.send('current-user', { error: 'disconnected' });
        console.log('disconnected');
      });

      ws.on('open', () => {
        ws.subscribe('OnJsonApiEvent');
        console.log('ws open');
      });

      ws.on('message', (data) => {
        const parsed = data.toString() ? JSON.parse(data.toString())[2] : '';
        if (parsed.uri === '/lol-gameflow/v1/session') {
          console.log('phase:', parsed.data.phase);
          switch (parsed.data.phase) {
            case 'None':
              mainWindow.webContents.send('phase', 'none');
              break;
            case 'Lobby':
              mainWindow.webContents.send('phase', 'lobby');
              break;
            case 'Matchmaking':
              mainWindow.webContents.send('phase', 'matchmaking');
              break;
            case 'ReadyCheck':
              mainWindow.webContents.send('phase', 'ready-check');
              break;
            case 'ChampSelect':
              mainWindow.webContents.send('phase', 'champ-select');
              getNames(mainWindow);
              break;
            case 'GameStart':
              mainWindow.webContents.send('phase', 'game-start');
              break;
            case 'InProgress':
              mainWindow.webContents.send('phase', 'in-progress');
              break;
            case 'WaitingForStats':
              mainWindow.webContents.send('phase', 'waiting-for-stats');
              break;
            case 'PreEndOfGame':
              mainWindow.webContents.send('phase', 'pre-end-of-game');
              break;
            case 'EndOfGame':
              mainWindow.webContents.send('phase', 'end-of-game');
              break;
            default:
          }
        }
      });

      client.start();
      getCurrentUser(mainWindow);
      mainWindow.webContents.send('connection-status', { status: 'sucess' });
    } catch (error) {
      mainWindow.webContents.send('connection-status', { error });
      client = null;
      ws = null;
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
