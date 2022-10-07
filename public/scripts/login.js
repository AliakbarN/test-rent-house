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
        return null;
    }
};

createApp({
    data () {
        return {
            inputValue: {
                email: '',
                password: ''
            },
            email: '',
            password:''
        }
    },
    methods: {
        sendForm () {
            request('/api/user/login', 'POST', { email: this.inputValue.email, password: this.inputValue.password })
                .then( res => {
                    if (!res) return console.log('Wrong password or email');

                    if (res.st === 200 & res.res['accessToken'] != undefined) {
                        window.localStorage.setItem('accessToken', res.res['accessToken']);
                        window.location.assign('/user/profile');
                    }
                })
        },
        changeInputData (dir, event) {
            switch (dir) {
                case 'email':
                    this.inputValue.email = event.target.value;
                    break;
                case 'password':
                    this.inputValue.password = event.target.value;
                    break;
            }
        }
    },

    mounted () {

    }
}).mount('#form');