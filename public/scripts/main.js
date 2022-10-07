import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { createMap } from '/scripts/map.js';

createApp({
    data() {
      return {
        houses: [],
        isGrid: true,
        isShowAreaFilterPopup: false,
        isShowPriceFilterPopup: false,
        currentFilter: '',
        user: {
            isAuth: false,
            name: ''
        },
        inputValue: {
            filter: {
                price: {
                    from: '',
                    upto: ''
                },
                area: {
                    from: '',
                    upto: ''
                }
            },
            sText: ''
        },
        style: {
            filterPopupPos: {
                top: '0px',
                left: '0px'
            }
        }
      }
    },
    methods: {
        redirectToHouse (id) {
            window.location.assign(`/house/${id}`);
        },
        redirectToProfile () {
            window.location.assign(`/user/profile`);
        },
        redirectToLogin () {
            window.location.assign(`/user/login`);
        },
        redirectToSignup () {
            window.location.assign(`/user/signup`);
        },
        openFilterPopup (type, evt) {
            this.currentFilter = type;
            setTimeout(() => {
                document.addEventListener('click', this.closeFilterPopup);
            }, 600);
            switch (type) {
                case 'price':
                    if (this.isShowAreaFilterPopup) this.isShowAreaFilterPopup = false;
                    this.isShowPriceFilterPopup = true;
                    this.style.filterPopupPos.top = evt.clientY + 'px';
                    this.style.filterPopupPos.left = evt.clientX - 150 + 'px';
                break;
                case 'area':
                    if (this.isShowPriceFilterPopup) this.isShowPriceFilterPopup = false;
                    this.isShowAreaFilterPopup = true;
                    this.style.filterPopupPos.top = evt.clientY + 'px';
                    this.style.filterPopupPos.left = evt.clientX + 30 + 'px';
                break;
            }
        },
        sendSText () {
            request(`/api/search/house/loc?sText=${this.inputValue.sText}`)
                .then( res => {
                    console.log(res);
                    this.houses = res.res;
                })
        },
        filterProduct () {
            if (this.inputValue.filter.price.from <= this.inputValue.filter.price.upto & this.inputValue.filter.area.upto >= this.inputValue.filter.area.from) {
                request(`/api/house/filter?price=${this.inputValue.filter.price.from},${this.inputValue.filter.price.upto}&area=${this.inputValue.filter.area.from},${this.inputValue.filter.area.upto}`)
                    .then( res => {
                        console.log(res);
                        this.houses = res.res;
                    })
            }
        },
        closeFilterPopup () {
            console.log(this.currentFilter);
            switch (this.currentFilter) {
                case 'price':
                    this.isShowPriceFilterPopup = false;
                break;
                case 'area':
                    this.isShowAreaFilterPopup = false;
                break;
            };
            document.removeEventListener('click', this.closeFilterPopup);
            this.currentFilter = '';
        },
        changeInputData (dir, event) {
            switch (dir) {
                case 'price from':
                    this.inputValue.filter.price.from = event.target.value;
                    break;
                case 'price upto':
                    this.inputValue.filter.price.upto = event.target.value;
                    break;
                case 'area from':
                    this.inputValue.filter.area.from = event.target.value;
                    break;
                case 'area upto':
                    this.inputValue.filter.area.upto = event.target.value;
                    break;
                case 'sText':
                    this.inputValue.sText = event.target.value;
                    break;
            }
        }
    },
    mounted() {
        request('/api/get/house-list')
            .then( res => {
                this.houses = res.res;
                let coords = [];
                let price = [];

                this.houses.forEach( house => {
                    coords.push(JSON.parse(house['location']));
                    price.push(JSON.parse(house['price']))
                });

                createMap(coords, price);
            })
        
        if (window.localStorage.getItem('accessToken') !== null) {
            request('/api/user/getuser', 'POST', { accessToken: window.localStorage.getItem('accessToken') })
                .then( res => {
                    console.log(res);
                    if (res.st === 200) {
                        this.user.isAuth = true;
                        this.user.name = res.res['name'];
                    }
                })
        }
    }
}).mount('body')

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
        return { st: response.status, res: await response.json() };
    } catch (err) {
        console.log(err.message);   
    }
};