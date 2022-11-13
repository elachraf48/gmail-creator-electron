const puppeteer = require('puppeteer-extra')
const stealthPluguin = require('puppeteer-extra-plugin-stealth')
const { ipcMain } = require('electron')
const { waitForSec } = require('../../static/functions.js')
const { instagram } = require('./instagram.js')
const { twitter } = require('./twitter.js')

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

        const login_input = await page.$('input[type="email"][name="identifier"]')

        if(login_input) {
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
        }

        const delete_emails = () => new Promise(async(resolve, reject) => {
            try {
                const messages_count = await page.$$eval('table > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(5) > div > div > div:nth-child(1) > span > span', els => els.length)

                if(messages_count) {
                    await page.waitForSelector('[role="checkbox"]')
                    await page.click('[role="checkbox"]')
                    await page.waitForSelector('[aria-label="Delete"][data-tooltip="Delete"][role="button"]')
                    await page.click('[aria-label="Delete"][data-tooltip="Delete"][role="button"]')
                }
                resolve()
            } catch (err) {
                reject(err)
            }
        })

        
        await instagram(browser, page, delete_emails, userData, option)
        
        await twitter(browser, page, delete_emails, userData, option)

        // await page.waitForNavigation()
        // await browser.close()
        
        resolve()

    } catch (err) {
        console.log(err)
        resolve({ ...err, code: 'err' })
    }
})