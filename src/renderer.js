const { ipcRenderer } = require('electron')

const windowCreatebtn = document.getElementById('window-create')
const windowConnectbtn = document.getElementById('window-connect')
const windowOpenbtn = document.getElementById('window-open')
const windowNotSpambtn = document.getElementById('window-not-spam')
const windowWarmUpbtn = document.getElementById('window-warmup')

windowCreatebtn.addEventListener('click', () => ipcRenderer.send('start-create-window'))
windowConnectbtn.addEventListener('click', () => ipcRenderer.send('start-connect-window'))
windowOpenbtn.addEventListener('click', () => ipcRenderer.send('start-open-window'))
windowNotSpambtn.addEventListener('click', () => ipcRenderer.send('start-not-spam-window'))
windowWarmUpbtn.addEventListener('click', () => ipcRenderer.send('start-warmup-window'))