var express = require('express');
var router = express.Router();
//var ctrlBills = require('../controllers/bills');
var ctrlMain = require('../controllers/main');

/* GET home page. */
router.get('/', ctrlMain.angularApp);

module.exports = router;
