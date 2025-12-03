import { ipcMain, nativeTheme, BrowserWindow, IpcMainEvent } from 'electron'

type AppControlAction = 'minimize' | 'maximize' | 'exit'

export class AppControl {
  private win: BrowserWindow

  constructor(win: BrowserWindow) {
    this.win = win
    this.sendNativeTheme()
    this.initEvents()
  }

  private initEvents(): void {
    this.win.on('maximize', () => {
      this.win.webContents.send('window-maximized')
    })
    this.win.on('unmaximize', () => {
      this.win.webContents.send('window-unmaximized')
    })
    this.win.on('focus', () => {
      this.win.webContents.send('window-focus')
    })
    this.win.on('blur', () => {
      this.win.webContents.send('window-blur')
    })
    nativeTheme.on('updated', () => {
      this.sendNativeTheme()
    })

    ipcMain.on('app-control', (_event: IpcMainEvent, action: AppControlAction) => {
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

  private sendNativeTheme(): void {
    if (nativeTheme.shouldUseDarkColors) {
      this.win.webContents.send('native-theme-dark')
    } else {
      this.win.webContents.send('native-theme-light')
    }
  }
}
