const { ipcRenderer } = require('electron')

const windowCreatebtn = document.getElementById('window-create')

windowCreatebtn.addEventListener('click', () => ipcRenderer.send('start-create-window'))