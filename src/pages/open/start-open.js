const { startBrowser } = require('./puppeteer.js')

module.exports.start = async (fields, sender) => {

    const { proxys, option, browser_path, profiles_path, profiles } = fields

    try {
        for(let index = profiles.from; index <= profiles.to; index++) {
            sender.send('indicator-result', { value: parseInt(index), from: parseInt(profiles.from) - parseInt(profiles.to), proxy: proxys[index] })
            const user_infos = await startBrowser(proxys[index], option, browser_path, profiles_path ? `${profiles_path}\\P-${index.toString()}` : `${profiles_path}\\P-${index.toString()}`, profiles)
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