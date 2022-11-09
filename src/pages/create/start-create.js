const { dialog } = require('electron')
const { saveToFile } = require('../../static/fileSaver.js')
const { startBrowser } = require('./puppeteer.js')

module.exports.start = async (fields, sender) => {

    const { proxys, save_file_path, api_5sim, option, browser_path, profiles_path } = fields
    // const data = []

    try {
        for(let index in proxys) {
            sender.send('indicator-result', { value: parseInt(index) + 1, from: proxys.length })
            const user_infos = await startBrowser(index, proxys[index], api_5sim, option, browser_path, `${profiles_path}\\P-${index.toString()}`)
            if(user_infos?.code === 'err') {
                
            } else if(user_infos?.code === 'stop') {
                break
            } else {
               await saveToFile(save_file_path, user_infos)
                // data.push(user_infos)
            }
        }
        sender.send('indicator-end')
        dialog.showMessageBox({
            message: 'Script Ended',
            buttons: ['Dismiss'],
            title: 'status'
        })
    } catch (err) {
        console.log(err)
    }
}