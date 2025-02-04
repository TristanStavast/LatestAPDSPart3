const express = require('express');
const {loginUser} = require('../controllers/userController.js');
const ExpressBrute = require('express-brute');

const store = new ExpressBrute.MemoryStore();

const bruteForce = new ExpressBrute(store, {
    freeRetries: 5,
    minWait: 1000 * 30,
    maxWait: 1000 * 60 * 10,
    lifetime: 1000*60 * 10
});

const router = express.Router();

router.post('/login', bruteForce.prevent, loginUser)
router.post('/loginout', loginUser)

module.exports = router