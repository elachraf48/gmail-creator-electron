module.exports.random_password = (max) => Array(max).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.+-*@&#%$!?").map(x => x[Math.floor(Math.random() * x.length)] ).join('');
module.exports.random_email = (username, max) => username + Array(max).fill("0123456789abcdefghijklmnopqrstuvwxyz").map(x => x[Math.floor(Math.random() * x.length)] ).join('') + '@gmail.com';

module.exports.waitForSec = (ms) => new Promise((reslove, reject) => {
    if (typeof ms === 'number') setTimeout(() => reslove() , ms)
    else reject('not a number')
})