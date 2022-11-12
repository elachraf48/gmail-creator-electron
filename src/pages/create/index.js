const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const { start } = require('./start-create.js')

const devTools = false

module.exports.createWindowCreation = parent => {
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

ipcMain.on('save-data-path', async event => {
  const { filePath, canceled } = await dialog.showSaveDialog({ defaultPath: `${app.getPath('documents')}/users.json`, filters:[{ name: 'JSON File', extensions: ['json'] }] })
  if(canceled) return console.log('canceled!')
  event.reply('save-data-path-result', filePath)
})

ipcMain.on('start-browser-create', (event, data) => start(data, event.sender))