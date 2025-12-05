import { app, protocol, BrowserWindow, shell } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { AppControl } from '@/app-control'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
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

async function createWindow(): Promise<void> {
  const win = new BrowserWindow({
    width: 1024,
    minWidth: 486,
    height: 800,
    minHeight: 320,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(app.getAppPath(), 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })
  // win.removeMenu()
  win.setBackgroundColor('#00000000')

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }

  // Enable remote debugging
  if (isDevelopment) {
    app.commandLine.appendSwitch('remote-debugging-port', '9223')
  }

  // Dodaj skrót F12 do otwierania/zamykania DevTools
  win.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12') {
      if (win.webContents.isDevToolsOpened()) {
        win.webContents.closeDevTools()
      } else {
        win.webContents.openDevTools()
      }
      event.preventDefault()
    }
  })

  // Otwieraj zewnętrzne linki w domyślnej przeglądarce
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
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
  if (isDevelopment) {
    try {
      // Instalacja Vue Devtools dla Vue 3 (wspiera także Pinia)
      await installExtension(VUEJS_DEVTOOLS, {
        loadExtensionOptions: { allowFileAccess: true }
      })
      console.log('Vue Devtools zostały zainstalowane')
    } catch (e) {
      console.error('Nie udało się zainstalować Vue Devtools:', e)
    }
  }

  createWindow()
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
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
