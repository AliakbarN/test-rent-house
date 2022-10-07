const helper = require("../../helper");

module.exports = {
    login (req, res) {
        res.render(helper.getView('login'));
    },    
    signup (req, res) {
        res.render(helper.getView('signup'));
    },
    profile (req, res) {
        res.render(helper.getView('profile'));
    }
}