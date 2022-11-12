const { BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { start } = require('./start-not-spam.js')

const devTools = false

module.exports.createWindowNotSpam = parent => {
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

  mainWindow.loadFile(path.join(__dirname, 'index.html'))
  mainWindow.setMenu(null)
  if(devTools) mainWindow.webContents.openDevTools()

  mainWindow.on('ready-to-show', () => parent.hide())
  mainWindow.on('close', () => parent.show())
}

ipcMain.on('start-browser-not-spam', (event, data) => start(data, event.sender))