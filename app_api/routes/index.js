var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});
var ctrlBills = require('../controllers/bills');
var ctrlAuth = require('../controllers/authentication');

//routers bill
router.get('/bills', auth, ctrlBills.billList);
router.get('/bills/:billId', auth, ctrlBills.billFindOne);
router.post('/bills', auth, ctrlBills.billCreate);
router.put('/bills/:billId', auth, ctrlBills.billUpdate);
router.delete('/bills/:billId', auth, ctrlBills.billDelete);

//routers login
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.get('/confirmemail/:token', ctrlAuth.confirmEmail);
router.get('/newTokenValidation/:email', ctrlAuth.newTokenValidation);


module.exports = router;

