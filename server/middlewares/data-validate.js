const isEmail = require('isemail');

module.exports = function (req, res, next) {
    const { email, password, name, phone } = req.body;
    
    if (!isEmail.validate(email)) return res.status(400).send('Email is not valid');
    else if (password.length < 5 || password.length > 32) return res.status(400).send('Password is not valid');
    else if (!/[0-9]+/.test(phone) & (phone.length < 7 || phone.length > 15)) return res.status(400).send('Phone is not valid');

    next();
}