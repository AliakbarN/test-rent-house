const router = require('express').Router();
const controllers = require('../../controllers/api/houses');

router.get('/get/house-list', controllers.getHouseList);
router.get('/get/house/:id', controllers.getHouse);
router.get('/house/filter', controllers.filter);

module.exports = router;