const puppeteer = require('puppeteer-extra')
const stealthPluguin = require('puppeteer-extra-plugin-stealth')
const { ipcMain } = require('electron')
const { waitForSec } = require('../../static/functions.js')

puppeteer.use(stealthPluguin())

module.exports.startBrowser = async (proxy, option, executablePath = undefined, userDataDir = undefined, profiles) => new Promise(async (resolve, reject) => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            executablePath,
            userDataDir,
            defaultViewport: null,
            args: [
                '--start-maximized',
                `--proxy-server=${proxy}`
            ]
        })

        ipcMain.on('script-status', (_, value) => {
            if(value === 'stop') browser.close()
            resolve({ code: 'stop' })
        })
    
        const pages = await browser.pages()
    
        const page = await browser.newPage()
    
        pages.forEach(p => p.close())

        await page.setDefaultTimeout(300000)
        
        await Promise.all([page.goto('https://gmail.com/'), page.waitForNavigation()])

        // **************************************************************************************************************

        

        // console.log(`${userDataDir} == from ${profiles.from} to ${profiles.to}`)

        // await page.waitForNavigation()
        // await browser.close()
        
        resolve()

    } catch (err) {
        console.log(err)
        resolve({ ...err, code: 'err' })
    }
})