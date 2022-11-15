const { waitForSec } = require('../../static/functions.js')
const { randome_fact } = require('.././../api/index.js')

const mails = `tranngocvananh2017@gmail.com
        tranphuongtra3176@gmail.com
        tranquanghoa24052004@gmail.com
        tranquangtuan857@gmail.com
        tranquockhanh.abct@gmail.com
        tranquyen18081981@gmail.com
        tranrubi0703@gmail.com
        transong343314@gmail.com
        transonnam269@gmail.com
        trantantrung854@gmail.com
        tranthaiphong007@gmail.com
        tranthanh545886@gmail.com
        tranthanh56334@gmail.com
        tranthanhlam177@gmail.com
        tranthanhthanh1790@gmail.com
        tranthanhvuel@gmail.com
        tranthao20091988@gmail.com
        trantheson3094@gmail.com
        tranthihoaixuan20@gmail.com
        tranthilinhlinh87@gmail.com
        tranthingochanh71503@gmail.com
        tranthitamhy1946@gmail.com
        tranthithanhhuong11091964@gmail.com
        tranthithaobinh7697@gmail.com
        tranthithida20101970@gmail.com
        tranthong4652@gmail.com
        trantrang018177@gmail.com
        tranvanchua15121986@gmail.com
        tranvanduy1964@gmail.com
        tranvanhung10121967@gmail.com
        tranvanman149cm@gmail.com
        tranvanmien092078002164@gmail.com
        tranvanquynh5850@gmail.com
        tranvansau46421@gmail.com
        tranvuongbdstn@gmail.com
        trawlermeander@gmail.com
        trieudinhchien82882@gmail.com
        trieuquinam72728@gmail.com
        trieuquocduy47761@gmail.com
        trieutien1410@gmail.com
        trieuvantienvp@gmail.com
        trinhthicuc10@gmail.com
        trinhthidieuhuyen48365@gmail.com
        trinhthieucau2563@gmail.com
        trinhthile408@gmail.com
        trinhthingan20061979@gmail.com
        trinhthithuthuy0101@gmail.com
        trinhthiyen080@gmail.com
        trinhtoan23101971@gmail.com
        trinhvantam83228@gmail.com`

module.exports.sendMail = (page, option) => new Promise(async (resolve, reject) => {
    const receiver = mails.split('\n')[Math.floor(Math.random() * mails.split('\n').length)]
    try {
        for(let i = 0;i < 100;i++) {
            const { subject, mail_text } = await randome_fact()
            await page.waitForSelector('div.aic > div > div[role="button"]')
            await page.click('div.aic > div > div[role="button"]')
            await page.waitForSelector('.nH > [role="dialog"]')
            await waitForSec(1000)
            await page.type('.nH > [role="dialog"] [type="text"][role="combobox"]', receiver, option)
            await page.type('.nH > [role="dialog"] [name="subjectbox"]', subject, option)
            await page.type('.nH > [role="dialog"] [role="textbox"][aria-multiline="true"]', mail_text, option)
            await page.click('.nH > [role="dialog"] table[role="group"] td:nth-child(1) [role="button"]')
        }
        resolve()
    } catch (error) {
        await page.click('.nH > [role="dialog"] table[role="group"] td:nth-child(6) [role="button"]')
        reject(error)
    }
})