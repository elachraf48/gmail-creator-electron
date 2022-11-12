const axios = require('axios')

const random_user = axios.create({
    baseURL: 'https://randomuser.me/api/'
})

module.exports.getRandomUser = () => new Promise(async (resolve, reject) => {
    try {
        const { data } = await random_user.get()
        resolve(data?.results[0])
    } catch (err) {
        reject(err)
    }
})

module.exports.getSimPhone = ({ provider, authorization, country, operator, product }) => new Promise(async (resolve, reject) => {

    let baseURL = ''

    if(provider === '5sim') baseURL = 'https://5sim.net/v1/user/'
    else return reject({ message: 'SIM Provider is required!' })

    const get_sim = axios.create({
        baseURL,
        headers: { Authorization: `Bearer ${authorization}` }
    })
    
    try {
        const { data } = await get_sim.get(`buy/activation/${country}/${operator}/${product}`)
        resolve(data)
    } catch (err) {
        reject(err)
    }
})

module.exports.checkSimActivation = ({ sim_id }) => new Promise(async (resolve, reject) => {
    try {
        const { data } = await get_sim.get(`check/${sim_id}`)
        resolve(data)
    } catch (err) {
        reject(err)
    }
})