const { ipcRenderer } = require('electron')

const windowCreatebtn = document.getElementById('window-create')
const windowConnectbtn = document.getElementById('window-connect')

windowCreatebtn.addEventListener('click', () => ipcRenderer.send('start-create-window'))
windowConnectbtn.addEventListener('click', () => ipcRenderer.send('start-connect-window'))