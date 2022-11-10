const { dialog } = require('electron')
const { importfromFile } = require('../../static/fileSaver.js')
const { startBrowser } = require('./puppeteer.js')

module.exports.start = async (fields, sender) => {

    const { proxys, import_users_path, option, browser_path, profiles_path } = fields
    // const data = []

    try {
        const userData = await importfromFile(import_users_path)
        console.log(userData)
        for(let index in userData) {
            sender.send('indicator-result', { value: parseInt(index) + 1, from: userData.length })
            const user_infos = await startBrowser(index, userData[index], proxys[index], option, browser_path, `${profiles_path}\\P-${index.toString()}`)
            if(user_infos?.code === 'err') {
                
            } else if(user_infos?.code === 'stop') {
                break
            } else {
            //    await saveToFile(import_users_path, user_infos)
                // data.push(user_infos)
            }
        //     dialog.showMessageBox({
        //     message: JSON.stringify(userData[index]),
        //     buttons: ['Dismiss'],
        //     title: 'user'
        // })
        }
        sender.send('indicator-end')
        // dialog.showMessageBox({
        //     message: 'Script Ended',
        //     buttons: ['Dismiss'],
        //     title: 'status'
        // })
    } catch (err) {
        console.log(err)
    }
}