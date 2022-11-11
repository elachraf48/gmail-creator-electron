const { dialog } = require('electron')
const { importfromFile } = require('../../static/fileSaver.js')
const { startBrowser } = require('./puppeteer.js')

module.exports.start = async (fields, sender) => {

    const { proxys, import_users_path, option, browser_path, profiles_path } = fields

    try {
        const userData = await importfromFile(import_users_path)
        for(let index in userData) {
            sender.send('indicator-result', { value: parseInt(index) + 1, from: userData.length, proxy: proxys[index] })
            const user_infos = await startBrowser(userData[index], proxys[index], option, browser_path, profiles_path ? `${profiles_path}\\P-${index.toString()}` : undefined)
            if(user_infos?.code === 'err') {
                
            } else if(user_infos?.code === 'stop') {
                break
            } else {

            }
        }
        sender.send('indicator-end')
    } catch (err) {
        console.log(err)
    }
}