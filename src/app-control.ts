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

    ipcMain.on('update-titlebar-color', (_event: IpcMainEvent, theme: 'light' | 'dark') => {
      const symbolColor = theme === 'dark' ? '#ffffff' : '#000000'
      try {
        this.win.setTitleBarOverlay({
          color: '#00000000',
          symbolColor: symbolColor,
          height: 42
        })
        console.log('TitleBar color updated:', theme, symbolColor)
      } catch (error) {
        console.error('Failed to update titleBar color:', error)
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
