const router = require('express').Router();
const controller = require('../../controllers/api/search');

router.get('/house/loc', controller.houseViaLoc)

module.exports = router;