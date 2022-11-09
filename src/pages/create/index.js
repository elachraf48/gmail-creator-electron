const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const { readFile } = require('fs/promises')
const { start } = require('./start-create.js')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

module.exports.createWindowCreation = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'))

  
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

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

ipcMain.on('save-data-path', async event => {
  const { filePath, canceled } = await dialog.showSaveDialog({ defaultPath: `${app.getPath('documents')}/users.json`, filters:[{ name: 'JSON File', extensions: ['json'] }] })
  if(canceled) return console.log('canceled!')
  event.reply('save-data-path-result', filePath)
})

ipcMain.on('select-proxy-list', async event => {
  const { filePaths, canceled } = await dialog.showOpenDialog({ defaultPath: app.getPath('home'), filters:[{ name: 'Text File', extensions: ['txt'] }] })
  if(canceled) return console.log('canceled!')
  const data = await readFile(filePaths[0], { encoding: 'utf8' })
  event.reply('select-proxy-list-result', data)
})

ipcMain.on('start-browser', (event, data) => start(data, event.sender))