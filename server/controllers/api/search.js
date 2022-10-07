const helper = require('../../helper');
const levenshtein = require('fast-levenshtein');
const db = require('../../db');

const comparison = new helper.comparison(levenshtein);

module.exports = {
    async houseViaLoc (req, res) {
        const { sText } = req.query;

        let houses = (await db.query('SELECT * FROM house')).rows;

        if (sText === '' || sText === ' ') return  res.json(houses);

        houses.forEach( (house, index) => {
            const loc = house['address'];

            house['coef'] = comparison.get(sText, loc, house['house_id']);
        })

        houses = houses.sort( (a, b) => a.coef - b.coef);

        if (req.query.hasOwnProperty('limit')) houses.splice(Number(req.query.limit));

        // res.json(houses);
        console.log(houses);
        res.send(houses)
    }
}