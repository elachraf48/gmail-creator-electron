const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const { readFile } = require('fs/promises')
const { createWindowCreation } = require('./pages/create/index.js')
const { createWindowConnect } = require('./pages/connect/index.js')

if (require('electron-squirrel-startup')) {
  app.quit()
}

const abc = "edffef"

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
      devTools: false,
    },
  })

  mainWindow.loadFile(path.join(__dirname, 'index.html'))
  mainWindow.setMenu(null)

  ipcMain.on('start-create-window', () => {
    createWindowCreation(mainWindow)
    mainWindow.hide()
  })
  
  ipcMain.on('start-connect-window', () => {
    createWindowConnect(mainWindow)
    mainWindow.hide()
  })

  ipcMain.on('start-open-window', () => {
    createWindowConnect(mainWindow)
    mainWindow.hide()
  })

  ipcMain.on('start-not-spam-window', () => {
    createWindowConnect(mainWindow)
    mainWindow.hide()
  })

  ipcMain.on('start-warmup-window', () => {
    createWindowConnect(mainWindow)
    mainWindow.hide()
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.on('select-browser', async event => {
  const { filePaths, canceled } = await dialog.showOpenDialog({ defaultPath: 'C:\\Program Files\\Google\\Chrome\\Application', filters: [{ name: 'Browser', extensions: ['exe'] }] })
  if(canceled) return console.log('canceled!')
  event.reply('select-browser-result', filePaths[0])
})

ipcMain.on('select-profile-path', async event => {
  const { filePaths, canceled } = await dialog.showOpenDialog({ defaultPath: app.getPath('documents'), properties: [ 'openDirectory', 'promptToCreate' ] })
  if(canceled) return console.log('canceled!')
  event.reply('select-profile-path-result', filePaths[0])
})

ipcMain.on('select-proxy-list', async event => {
  const { filePaths, canceled } = await dialog.showOpenDialog({ defaultPath: app.getPath('home'), filters:[{ name: 'Text File', extensions: ['txt'] }] })
  if(canceled) return console.log('canceled!')
  const data = await readFile(filePaths[0], { encoding: 'utf8' })
  event.reply('select-proxy-list-result', data)
})

ipcMain.on('message-box', (_, { type, message }) => dialog.showMessageBox({ type, message, buttons: ['OK'], title: type }))