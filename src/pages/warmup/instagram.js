const { waitForSec } = require('../../static/functions.js')

module.exports.instagram = (browser, page, delete_emails, userData, option) => new Promise(async resolve => {
    try {
        const instaPage = await browser.newPage()

        await instaPage.goto('https://www.instagram.com/accounts/emailsignup/')
        
        await instaPage.waitForSelector('input[Name ="emailOrPhone"]')
        
        await instaPage.type('input[Name ="emailOrPhone"]', userData.email, option)
        await instaPage.type('input[Name ="fullName"]', `${userData.first_name} ${userData.last_name}`, option)
        await instaPage.type('input[Name ="username"]', userData.email.replace('@gmail.com', ''), option)
        await instaPage.type('input[Name ="password"]', 'Emh12345678', option)
        
        await waitForSec(2000)
        await instaPage.click('button[Type="submit"]')
        
        await instaPage.waitForSelector('select[Title="Day:"]')
        
        await instaPage.select('select[Title="Day:"]', userData.birthday.day)
        await instaPage.select('select[Title="Month:"]', userData.birthday.month)
        await instaPage.select('select[Title="Year:"]', userData.birthday.year)
        
        // await waitForSec(2000)

        await instaPage.waitForSelector('button._acan._acap._acaq._acas')
        await instaPage.click('button._acan._acap._acaq._acas')
        
        await instaPage.waitForSelector('input[Name ="email_confirmation_code"]')
        await page.reload()
        await delete_emails()
        
        await waitForSec(2000)
        
        while(true) {
            try {
                await page.reload()
                await page.waitForSelector('table > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(5) > div > div > div:nth-child(1) > span > span', { timeout: 2000 })
                break
            } catch (err) {
                continue
            }
        }

        const messageTitle = await page.$eval('table > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(5) > div > div > div:nth-child(1) > span > span', el => el.innerText)
        console.log(messageTitle)
        
        await instaPage.type('input[Name ="email_confirmation_code"]', messageTitle.split(' ')[0], option)
        
        await waitForSec(2000)
        await instaPage.click('button[Type="submit"]')
    } catch (err) {
        console.log(err)
        resolve()
    }
})