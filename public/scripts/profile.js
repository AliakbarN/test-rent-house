import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

async function request (url, method = 'GET', data = null, header = {name: undefined, value: undefined} || null) {
    try {
        const headers = {};
        let body;

        if (data) {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(data);
        }

        if (header) headers[header.name] = header.value;

        const response = await fetch(url, {
            headers,
            body,
            method
        })
        return { st: response.status, res: await response.json() };
    } catch (err) {
        console.log(err.message);
    }
};

createApp({
    data () {
        return {
            user: {},
            house: {}
        }
    },
    methods: {
        logOut () {
            window.localStorage.removeItem('accessToken');
            request('/api/user/logout', 'POST')
                .then( res => {
                    window.location.assign('/');
                })
        }
    },

    mounted () {
        if (window.localStorage.getItem('accessToken') !== null) {
            console.log('send');
            request('/api/user/getuser', 'POST', { accessToken: window.localStorage.getItem('accessToken') })
                .then( res => {
                    if (res.st === 200) {
                        this.user = res.res;
                        console.log(this.user)
                    } else if (res.st === 403) window.location.assign('/');
                })
        } else window.location.assign('/');
    }
}).mount('main');