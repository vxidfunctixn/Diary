'use strict'

import { app, protocol, BrowserWindow, ipcMain, nativeTheme } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import path from 'path'
const isDevelopment = process.env.NODE_ENV !== 'production'

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      secure: true,
      standard: true
    }
  }
])

async function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    minWidth: 486,
    height: 800,
    minHeight: 320,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(app.getAppPath(), 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  })
  // win.removeMenu()
  win.setBackgroundColor('#00000000')

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }

  win.on('maximize', () => {
    win.webContents.send('window-maximized')
  })

  win.on('unmaximize', () => {
    win.webContents.send('window-unmaximized')
  })

  win.on('focus', () => {
    win.webContents.send('window-focus')
  })

  win.on('blur', () => {
    win.webContents.send('window-blur')
  })

  const sendNativeTheme = () => {
    if(nativeTheme.shouldUseDarkColors) {
      win.webContents.send('native-theme-dark')
    } else {
      win.webContents.send('native-theme-light')
    }
  }

  sendNativeTheme()

  nativeTheme.on('updated', () => {
    sendNativeTheme()
  })

  ipcMain.on('app-control', (event, action) => {
    switch (action) {
      case 'minimize':
        win.minimize()
        break
      case 'maximize':
        if (win.isMaximized()) {
          win.unmaximize()
        } else {
          win.maximize()
        }
        break
      case 'exit':
        win.close()
        break
      default:
        break
    }
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('ready', async () => {
  createWindow()
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
