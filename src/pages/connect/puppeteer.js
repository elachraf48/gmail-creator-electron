const puppeteer = require('puppeteer-extra')
const stealthPluguin = require('puppeteer-extra-plugin-stealth')
const { ipcMain } = require('electron')
const { waitForSec } = require('../../static/functions.js')

puppeteer.use(stealthPluguin())

module.exports.startBrowser = async (userData, proxy, option, executablePath = undefined, userDataDir = undefined) => new Promise(async (resolve, reject) => {
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

        const conx_btn = await page.$('body > header > div > div > div > a:nth-child(2)')

        if(conx_btn) await Promise.all([page.click('body > header > div > div > div > a:nth-child(2)'), page.waitForNavigation()])

        await page.waitForSelector('input[type="email"][name="identifier"]')

        await new Promise(async (resolve, reject) => {
            try {
                while(true) {
                    // await waitForSec(5000)
                    el = await page.$('input[type="email"][name="identifier"]')
                    if(el) {
                        
                        await page.type('input[type="email"][name="identifier"]', userData.email, option)
                        await page.click('#identifierNext > div > button')
                        break
                    } 
                    else break
                }
                resolve()
            } catch(err) {
                reject(err)
            }
        })

        await page.waitForSelector('input[type="password"][name="Passwd"]')

        await new Promise(async (resolve, reject) => {
            try {
                while(true) {
                    await waitForSec(2500)
                    el = await page.$('input[type="password"][name="Passwd"]')
                    if(el) {
                        
                        await page.type('input[type="password"][name="Passwd"]', userData.password, option)
                        await page.click('#passwordNext > div > button')
                    } 
                    else break
                }
                resolve()
            } catch(err) {
                reject(err)
            }
        })

        // await page.waitForNavigation()
        // await browser.close()
        
        resolve()

    } catch (err) {
        console.log(err)
        resolve({ ...err, code: 'err' })
    }
})