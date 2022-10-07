const router = require('express').Router();
const controller = require('../../controllers/client/user');

router.get('/login', controller.login);
router.get('/signup', controller.signup);
router.get('/profile', controller.profile);

module.exports = router;