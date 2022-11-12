const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const { start } = require('./start-warmup.js')

const devTools = false

module.exports.createWindowWarmUp = parent => {
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

ipcMain.on('start-browser-warmup', (event, data) => start(data, event.sender))