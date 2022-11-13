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
        
        await Promise.all([page.goto('https://mail.google.com/mail/u/0/#spam'), page.waitForNavigation()])

        await new Promise(async (resolve, reject) => {
            try {
                while(true) {
                    await page.waitForSelector('div.BltHke.nH.oy8Mbf > div > div > div > table > tbody > tr')
                    await page.click('div.BltHke.nH.oy8Mbf > div > div > div > table > tbody > tr')
                    // await waitForSec(1000)
                    await page.waitForSelector('button.bzq.bzr.IdsTHf')
                    await page.click('button.bzq.bzr.IdsTHf')
                    await waitForSec(1000)
                    const el = await page.$('div.BltHke.nH.oy8Mbf > div > div > div > table > tbody > tr')
                    if(!el) break

                }
                resolve()
            } catch (err) {
                reject(err)
            }
        })

        await page.evaluate(() => alert('End'))

        await Promise.all([page.goto('https://mail.google.com/mail/u/0/'), page.waitForNavigation()])

        // await page.waitForNavigation()
        // await browser.close()
        
        resolve()

    } catch (err) {
        console.log(err)
        resolve({ ...err, code: 'err' })
    }
})