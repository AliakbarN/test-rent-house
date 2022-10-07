const router = require('express').Router();
const controllers = require('../../controllers/client/houses_page');
const checkAuthMiddleware = require('../../middlewares/auth');

router.get('/', checkAuthMiddleware, controllers.home);
router.get('/house/:id', controllers.housePage);

module.exports = router;