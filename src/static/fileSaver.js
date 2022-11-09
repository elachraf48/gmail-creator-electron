const fs = require('fs/promises')

module.exports.saveToFile = (fileName, user_infos) => new Promise(async (resolve, reject) => {
    if(!fileName) return reject('file name is required !')
    try {
            const dataFile = await fs.readFile(fileName)
            const jsonFile = JSON.parse(dataFile.toString())
            await fs.writeFile(fileName, JSON.stringify([ ...jsonFile, user_infos ]))
        } catch (err) {
            console.log(err)
            await fs.writeFile(fileName, JSON.stringify([ user_infos ]))
        }   
})