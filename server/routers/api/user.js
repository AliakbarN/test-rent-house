const router = require('express').Router();
const controllers = require('../../controllers/api/user');
const dataValidator = require('../../middlewares/data-validate');
const checkAuthMiddleware = require('../../middlewares/auth')

router.post('/registration',
    dataValidator,
    controllers.registration);
router.post('/login', controllers.login);
router.get('/registration', (req, res) => {
    console.log('registr');
    res.sendStatus(303);
})
router.post('/logout', controllers.logout);
router.get('/activate/:link', controllers.activate);
router.get('/refresh', controllers.refresh);
router.post('/getuser',
    checkAuthMiddleware,
    controllers.getuser);

module.exports = router;