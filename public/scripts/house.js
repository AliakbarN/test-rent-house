import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { createMap } from '/scripts/map.js';

async function request (url, method = 'GET', data = null) {
    try {
        const headers = {};
        let body;

        if (data) {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(data);
        }

        const response = await fetch(url, {
            headers,
            body,
            method
        })
        return await response.json();
    } catch (err) {
        console.log(err.message);
    }
}

createApp({
    data() {
        return {
            house: {},
            cardStyle: {
                width: '400px',
                height: 'auto',
                position: 'absolute',
                top: '8%',
                left: '35%'
            },
            constStyle: {
                position: 'absolute',
                width: '80%',
                height: '1300px',
                display: 'flex',
                justufyContent: 'center'
            },
            mapStyle: {
                position: 'absolute',
                left: '20%',
                width: '700px',
                height: '500px',
                bottom: '50px'
            },
            btnStyle: {
                position: 'absolute',
                left: '25px',
                top: '25px'
            }
        }
    },
    mounted() {
        request(`/api/get/house/${houseId}`, 'GET')
            .then( res => {
                this.house = res;
                createMap(JSON.parse(res['location']));
        })
    }
}).mount('body');