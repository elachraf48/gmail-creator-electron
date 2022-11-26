const puppeteer = require('puppeteer-extra')
const stealthPluguin = require('puppeteer-extra-plugin-stealth')
const { ipcMain } = require('electron')
const { getRandomUser, getSimPhone, checkSimActivation } = require('../../api/index.js')
const { random_email, random_password, waitForSec } = require('../../static/functions.js')

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

const typeInfo = (page, option) => new Promise(async (resolve, reject) => {
    try {
        let el = true
        while(el) {
        const user = await getRandomUser()

            user_infos = {
                first_name: user.name.first,
                last_name: user.name.last,
                email: random_email(`${user.email.replace('@example.com', '')}`, 3),
                gender: user.gender,
                password: random_password(14),
                email_recovery: random_email(`${user.email.replace('@example.com', '')}`, 5),
                recovery_number: '',
                birthday: {
                    year: user.dob.date.split('T')[0].split('-')[0],
                    month: user.dob.date.split('T')[0].split('-')[1],
                    day: user.dob.date.split('T')[0].split('-')[2]
                }
            }

            const type_input = (selector, text) => new Promise(async (resolve, reject) => {
                try {
                    const input = await page.$(selector);
                    await input.click({ clickCount: 3 })
                    await page.type(selector, text, option)
        
                    resolve()
                } catch (err) {
                    reject(err)
                }
            })

            await type_input('#firstName', user_infos.first_name)
            await type_input('#lastName', user_infos.last_name)
            await type_input('#username', user_infos.email.replace('@gmail.com', ''))
            await type_input('#passwd > div.aCsJod.oJeWuf > div > div.Xb9hP > input', user_infos.password)
            await type_input('#confirm-passwd > div.aCsJod.oJeWuf > div > div.Xb9hP > input', user_infos.password)
            
            await page.click('#accountDetailsNext > div > button')
            await waitForSec(1000)
            el = await page.$('#view_container > div > div > div.pwWryf.bxPAYd > div > div.WEQkZc > div > form > span > section > div > div > div.akwVEf.OcVpRe > div.d2CFce.cDSmF.OcVpRe > div > div.LXRPh > div.dEOOab.RxsGPe > div')
        }
        resolve()
    } catch (err) {
        reject(err)
    }
})

const getSimNumber = (page, { enable, country, operator, product, provider, authorization }, option) => new Promise(async (resolve, reject) => {
    let el = true
    let id
    try {
        while(el) {
            if(enable) {
                const data = await getSimPhone({ provider, authorization, country, operator, product })
                // const data = await checkSimActivation({ sim_id: 373678700, provider, authorization })
                user_infos.recovery_number = data.phone
                id = data.id
                console.log(data)
            }
            else user_infos.recovery_number = await page.evaluate(() => prompt('enter number', '+212'))

            await waitForSec(1000)
            await page.waitForSelector('#phoneNumberId')
            const input = await page.$('#phoneNumberId')
            await input.click({ clickCount: 3 })
            await page.type('input#phoneNumberId', user_infos.recovery_number, option)
            await page.click('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.qhFLie > div > div > button')

            await waitForSec(1000)
            el = await page.$('#view_container > div > div > div.pwWryf.bxPAYd > div > div.WEQkZc > div > form > span > section > div > div > div.bAnubd.OcVpRe.Jj6Lae > div.VsO7Kb > div.gFxJE > div.jPtpFe > div')
            if(el) console.log('yes', el) 
            else console.log('not')
        }

        resolve(id)
    } catch (err) {
        reject(err)
    }
})

const getVerificationCode = (page, sim_id, enable, provider, authorization, option) => new Promise(async (resolve, reject) => {
    let el = true

    try {
        while(el) {

            let verfication_code

            if(enable) {
                await new Promise(async function(resolve, reject) {
                    try {
                        while(!verfication_code) {
                            const data = await checkSimActivation({ sim_id, provider, authorization })
                            console.log(data.sms)
                            if(data?.sms && data?.sms?.length !== 0){
                                verfication_code = data?.sms[0]?.code
                                console.log(data.sms[0])
                            }
                            await waitForSec(1000)
                        }
                        resolve()
                    } catch (err) {
                        reject(err)
                    }
                })
            }

            else verfication_code = await page.evaluate(() => prompt('Verification code'))

            
            // const verfication_code = user_infos?.recovery_number?.sms[0]?.code

            await waitForSec(1000)
            await page.waitForSelector('#code')
            const input = await page.$('#code');
            await input.click({ clickCount: 3 })
            console.log('1', verfication_code)
            await page.type('#code', verfication_code, option)
            await page.click('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.qhFLie > div > div > button')
            await waitForSec(1000)
            el = await page.$('#view_container > div > div > div.pwWryf.bxPAYd > div > div.WEQkZc > div > form > span > section > div > div > div.d2CFce.cDSmF.OcVpRe.PkCcVd > div > div.LXRPh > div.dEOOab.RxsGPe > div')
        }

        resolve()
    } catch (err) {
        reject()
    }
})

module.exports.startBrowser = async (proxy, sim_api, option, executablePath = undefined, userDataDir = undefined) => new Promise(async (resolve, reject) => {

    // (index, proxy_list[index], sim_api, type_option, browserPath, profilesPath)

    try {

        const browser = await puppeteer.launch({
            headless: false,
            executablePath,
            userDataDir,
            defaultViewport: null,
            args: [
                '--start-maximized',
                // `--proxy-server=${proxy}`
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
    
        await page.goto('https://www.google.com/gmail/about/')

        // **************************************************************************************************************

        await Promise.all([page.click('body > header > div > div > div > a:nth-child(3)'), page.waitForNavigation()])

        await typeInfo(page, option)

        await page.waitForSelector('#phoneNumberId')

        await waitForSec(1000)
        
        const sim_id = await getSimNumber(page, sim_api, option)

        await page.waitForSelector('#code')

        await waitForSec(1000)

        await getVerificationCode(page, sim_id, sim_api.enable, option)

        await page.waitForSelector('#view_container > div > div > div.pwWryf.bxPAYd > div > div.WEQkZc > div > form > span > section > div > div > div.akwVEf.OcVpRe > div.d2CFce.cDSmF.OcVpRe > div > div.aCsJod.oJeWuf > div > div.Xb9hP > input')

        await waitForSec(1000)

        await page.evaluate(() => document.querySelector('input[type="tel"]#phoneNumberId').value = '')

        await page.type('#view_container > div > div > div.pwWryf.bxPAYd > div > div.WEQkZc > div > form > span > section > div > div > div.akwVEf.OcVpRe > div.d2CFce.cDSmF.OcVpRe > div > div.aCsJod.oJeWuf > div > div.Xb9hP > input', user_infos.email_recovery, option)

        await page.select('#month', parseInt(user_infos.birthday.month).toString())
        await page.type('#day', user_infos.birthday.day, option)
        await page.type('#year', user_infos.birthday.year, option)

        await page.select('#gender', user_infos.gender === 'male' ? '1' : '2')
    
        await page.click('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.qhFLie > div > div > button')


        resolve(user_infos)

        await waitForSec((2000))
        const privacy1 = await page.$('input[type="hidden"][name="__msgId__"]')
        if(privacy1) {
            await page.waitForSelector('div[aria-labelledby="selectionc10"] > * > div')
            await page.click('div[aria-labelledby="selectionc10"] > * > div')
        }

        await page.click('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div.dG5hZc > div.qhFLie > div > div > button')

        await waitForSec((2000))
        const privacy2 = await page.$('div:nth-child(2) > div > div > button[data-idom-class]')
        if(privacy2) await page.click('div:nth-child(2) > div > div > button[data-idom-class]')

        await waitForSec((2000))
        const privacy3 = await page.$('#view_container > div > div > div > div > div > div > div > div > div > button[data-idom-class]')
        if(privacy3) await page.click('#view_container > div > div > div > div > div > div > div > div > div > button[data-idom-class]')

        await waitForSec((2000))
        // await page.waitForSelector('button[type="button"]#learnMore')
        // await page.waitForSelector('button[type="button"]#moreOptions')
        const btn01 = await page.$('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div.dG5hZc > div.qhFLie > div > div > button')
        if(btn01) await page.click('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div.dG5hZc > div.qhFLie > div > div > button')

        await waitForSec((2000))
        // await page.waitForSelector('a[data-link="privacy"][href="https://policies.google.com/terms?hl=en&gl=US"]')
        // await page.waitForSelector('a[data-link="privacy"][href="https://policies.google.com/privacy?hl=en&gl=US"]')
        const btn02 = await page.$('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.qhFLie > div > div > button')
        if(btn02) await page.click('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.qhFLie > div > div > button')

        await page.waitForNavigation()

        await browser.close()

    } catch (err) {
        console.log(err)
        resolve({ ...err, code: 'err' })
    }
})