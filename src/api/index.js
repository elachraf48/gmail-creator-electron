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

const get_sim = axios.create({
    baseURL: 'https://5sim.net/v1/user/',
    headers: { Authorization: `Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2Nzc2MTQ1MjYsImlhdCI6MTY0NjA3ODUyNiwicmF5IjoiYTY5MjdjMjY1YmY3MjE2NmNlNjI5NmMxMDJhYTk5M2UiLCJzdWIiOjk1Nzg2N30.JzNg9T_c9ptHR4RVKd1fJx525FzK3Z35dIYGNzamlVfEjCFdmcwUbpUL-rz6cUsxYGRllXVyH56gVv_OQYORNAfchKi3EZ9thdZtbqcvTjXdBHHGhRlzDZPd-T1-IELi5xXXv3Ga_jOAYh-QWkhfiuPsYGnnuJHLrDogFCpIKp7vfeM3DM13rpxOvZS5TXTtIyWvEy7mTjWlBTnXTbvKphJ0ltOwFjxdDCQMU1R9WfJDinSdm0Zpagr_dPy6dzVmmATHpgLoYHADLpOvEejyy_7aG6y-r6YvjDuLq3NsflNR9yWfR0uHeaJxgomBAJvlNIEAoemKbT8bOhZyUuZaOA` }
})

module.exports.getSimPhone = ({ country, operator, product }) => new Promise(async (resolve, reject) => {
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