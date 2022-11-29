const { dialog } = require('electron')
const { saveToFile } = require('../../static/fileSaver.js')
const { startBrowser } = require('./puppeteer.js')

module.exports.start = async (fields, sender) => {

    const { proxys, save_file_path, api_sim, option, browser_path, profiles_path } = fields

    try {
        for(let index in proxys) {
            sender.send('indicator-result', { value: parseInt(index) + 1, from: proxys.length, proxy: proxys[index] })
            const user_infos = await startBrowser(proxys[index], api_sim, option, browser_path, profiles_path ? `${profiles_path}\\P-${index.toString()}` : undefined, save_file_path)
            if(user_infos?.code === 'err') {
                
            } else if(user_infos?.code === 'stop') {
                break
            } else {
            //    await saveToFile(save_file_path, user_infos)
            }
        }
        sender.send('indicator-end')
        dialog.showMessageBox({
            message: 'Script Ended',
            buttons: ['Dismiss'],
            title: 'status'
        })
    } catch ({ message }) {
        console.log(message)
    }
}