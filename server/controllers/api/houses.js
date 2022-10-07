const helper = require('../../helper')
const db = require('../../db');

module.exports = {
    getHouseList (req, res) {
        db.query('SELECT * FROM house')
            .then( houses => {
                res
                    .status(201)
                    .send(JSON.stringify(houses.rows));
            })
    },
    getHouse (req, res) {
        db.query(`SELECT * FROM house WHERE house_id = ${req.params.id}`)
            .then( house => {
                res
                    .status(201)
                    .send(JSON.stringify(house.rows[0]));
            })
            .catch( err => {
                console.log(err)
                res
                    .status(403)
                    .render(helper.getView('404'))
            })
    },
    async filter (req, res) {
        let { area, price } = req.query;
        let isNumbers = true;
        let query = '';

        if (area & price) return res.sendStatus(401);

        area = area.split(',');
        price = price.split(',');

        area.forEach( element => {
            if (element === '0') return;
            if (!Number(element)) isNumbers = false;
        });

        price.forEach( element => {
            if (element === '0') return;
            if (!Number(element)) isNumbers = false;
        });

        if (isNumbers) {
            price = price.map( n => Number(n));
            area = area.map( n => Number(n));
        } else return res.sendStatus(403);

        if (area.length !== 0 & price.length !== 0) {
            if (area[1] > 100 & price[1] > 100) {
                query = `SELECT * FROM house WHERE (price > ${price[0]} AND price < ${price[1]}) AND (area > ${area[0]} AND area < ${area[1]})`;
            } else if (area[1] >  100 & price[1] < 100) {
                query = `SELECT * FROM house WHERE area > ${area[0]} AND area < ${area[1]}`;
            } else if (area[1] <  100 & price[1] > 100) {
                query = `SELECT * FROM house WHERE price > ${price[0]} AND price < ${price[1]}`;
            };

            const houses = await db.query(query);
            console.log(houses.rows);
            return res.json(houses.rows);
        } else return res.sendStatus(403);
    }
}