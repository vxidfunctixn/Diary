import { ipcMain, nativeTheme } from 'electron'

export class AppControl {
  constructor(win) {
    this.win = win
    this.sendNativeTheme()
    this.initEvents()
  }

  initEvents() {
    this.win.on('maximize',   () => { this.win.webContents.send('window-maximized') })
    this.win.on('unmaximize', () => { this.win.webContents.send('window-unmaximized') })
    this.win.on('focus',      () => { this.win.webContents.send('window-focus') })
    this.win.on('blur',       () => { this.win.webContents.send('window-blur') })
    nativeTheme.on('updated', () => { this.sendNativeTheme() })

    ipcMain.on('app-control', (event, action) => {
      switch (action) {
        case 'minimize':
          this.win.minimize()
          break
        case 'maximize':
          if (this.win.isMaximized()) {
            this.win.unmaximize()
          } else {
            this.win.maximize()
          }
          break
        case 'exit':
          this.win.close()
          break
        default:
          break
      }
    })
  }

  sendNativeTheme() {
    if(nativeTheme.shouldUseDarkColors) {
      this.win.webContents.send('native-theme-dark')
    } else {
      this.win.webContents.send('native-theme-light')
    }
  }
}