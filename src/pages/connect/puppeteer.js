const puppeteer = require('puppeteer-extra')
const stealthPluguin = require('puppeteer-extra-plugin-stealth')
const { ipcMain } = require('electron')
const { waitForSec } = require('../../static/functions.js')

puppeteer.use(stealthPluguin())

let user_infos = {
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    password: '',
    email_recovery: '',
    recovery_number: {
        id: null,
        phone: '',
        operator: '',
        product: '',
        price: 0,
        status: '',
        expires: '',
        sms: [],
        created_at: '',
        country: ''
    },
    birthday: {
        year: '',
        month: '',
        day: ''
    }
}

// 373678700

module.exports.startBrowser = async (i, userData, proxy, option, executablePath = undefined, userDataDir = undefined) => new Promise(async (resolve, reject) => {

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

        ipcMain.on('script-status', (event, value) => {
            if(value === 'stop') browser.close()
            resolve({ code: 'stop' })
        })
    
        const pages = await browser.pages()
    
        const page = await browser.newPage()
    
        pages.forEach(p => p.close())

        await page.setDefaultTimeout(300000)
    
        await page.goto('https://gmail.com/')

        // **************************************************************************************************************

        await page.waitForSelector('input[type="email"][name="identifier"]')
        await page.type('input[type="email"][name="identifier"]', userData.email, option)
        await page.click('#identifierNext > div > button')

        await page.waitForSelector('input[type="password"][name="Passwd"]')
        await waitForSec(2000)
        await page.type('input[type="password"][name="Passwd"]', userData.password, option)
        console.log(userData.password)
        // await waitForSec(100000)
        await page.click('#passwordNext > div > button')

        // await page.waitForNavigation()

        // await browser.close()
        
        resolve(user_infos)

    } catch (err) {
        console.log(err)
        resolve({ ...err, code: 'err' })
    }
})