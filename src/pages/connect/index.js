const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const { start } = require('./start-connect.js')

const devTools = false

module.exports.createWindowConnect = parent => {
  parent.hide()
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    // parent,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
      devTools
    },    
  })
  
  parent.hide()

  mainWindow.loadFile(path.join(__dirname, 'index.html'))
  mainWindow.setMenu(null)
  if(devTools) mainWindow.webContents.openDevTools()

  mainWindow.on('ready-to-show', () => parent.hide())
  mainWindow.on('close', () => parent.show())
}

ipcMain.on('import-users-path', async event => {
  const { filePaths, canceled } = await dialog.showOpenDialog({ defaultPath: `${app.getPath('documents')}/users.json`, filters:[{ name: 'JSON File', extensions: ['json'] }] })
  if(canceled) return console.log('canceled!')
  event.reply('import-users-path-result', filePaths[0])
})

ipcMain.on('start-browser-connect', (event, data) => start(data, event.sender))