const { ipcRenderer } = require('electron')

const formSelector = document.querySelector('form')

const select_browser = document.getElementById('select-browser')
const select_browser_text = document.getElementById('select-browser-text')

const select_profile_path = document.getElementById('select-profile-path')
const select_profile_path_text = document.getElementById('select-profile-path-text')

const import_users = document.getElementById('import-users')
const import_users_text = document.getElementById('import-users-text')

const select_proxys = document.getElementById('select-proxys')
const proxys_port = document.getElementById('proxys-port')
const proxys_port_seter = document.getElementById('proxys-port-seter')
const proxy_list = document.getElementById('proxy-list')

const option_delay = document.getElementById('option-delay')

const indicator = document.getElementById('indicator')

const start_btn = document.getElementById('start-btn')
const stop_btn = document.getElementById('stop-btn')

const checkAPISim = checked => {
    country_input.disabled = !checked
    operator_input.disabled = !checked
    product_input.disabled = !checked
}

const isProxysValid = proxy => {
    return /^([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})$/.test(proxy)
}

const isProxysAndPortValid = proxy => {
    return /^([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\:[0-9]{1,5})$/.test(proxy)
}


formSelector.addEventListener('submit', e => {
    e.preventDefault()

    const fields = {
        browser_path: select_browser_text.value,
        profiles_path: select_profile_path_text.value,
        import_users_path: import_users_text.value,
        option: {
            delay: option_delay.value
        },
        proxys: proxy_list.value.split('\n')
    }

    if(fields.proxys.some(proxy => isProxysValid(proxy))) return ipcRenderer.send('message-box-', { type: 'error', message: 'One or more proxy has no port!' })
    if(fields.proxys.some(proxy => !isProxysAndPortValid(proxy))) return ipcRenderer.send('message-box-', { type: 'error', message: 'One or more proxy are not correct!' })

    ipcRenderer.send('start-browser-', fields)
})

stop_btn.addEventListener('click', () => {
    ipcRenderer.send('script-status-', 'stop')
})

select_browser.addEventListener('click', () => ipcRenderer.send('select-browser-'))
select_profile_path.addEventListener('click', () => ipcRenderer.send('select-profile-path-'))
import_users.addEventListener('click', () => ipcRenderer.send('import-users-path-'))
select_proxys.addEventListener('click', () => ipcRenderer.send('select-proxy-list-'))

proxys_port_seter.addEventListener('click', () => {
    // console.log(proxy_list.value, proxys_port.value)
    const port = proxys_port.value
    const list = proxy_list.value.split('\n').filter(item => isProxysAndPortValid(item) || isProxysValid(item))
    proxy_list.value = list.map(item => isProxysValid(item) ? `${item}:${port}` : item).join('\n')
})

ipcRenderer.on('select-browser-result', (_, data) => {
    select_browser_text.value = data
})

ipcRenderer.on('select-profile-path-result', (_, data) => {
    select_profile_path_text.value = data
})

ipcRenderer.on('import-users-path-result', (_, data) => {
    import_users_text.value = data
})

ipcRenderer.on('select-proxy-list-result', (_, data) => {
    proxy_list.value = data
})

ipcRenderer.on('indicator-result', (_, { value, from }) => {
    indicator.value = `${value} from ${from}`
    if(value <= from) {
        start_btn.classList.add('d-none')
        stop_btn.classList.remove('d-none')
    } else {
        stop_btn.classList.add('d-none')
        start_btn.classList.remove('d-none')
    }
})

ipcRenderer.on('indicator-end', () => {
    indicator.value = ``
    stop_btn.classList.add('d-none')
    start_btn.classList.remove('d-none')

})

use_api_check.addEventListener('change', e => checkAPISim(e.target.checked))

checkAPISim(use_api_check.checked)