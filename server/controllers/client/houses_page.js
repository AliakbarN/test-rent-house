const helper = require('../../helper');

module.exports = {
    home (req, res) {
        console.log('home');
        res.render(helper.getView('home-page'));
    },
    housePage (req, res) {
        res
            .status(201)
            .render(helper.getView('house.passport'), { houseId: req.params.id });
    },
    notFound (req, res) {
        res
        .status(404)
        .render(helper.getView('404'));
    }
}