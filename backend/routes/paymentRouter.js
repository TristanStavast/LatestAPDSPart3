const express = require('express');
const { addPayment, getSummary } = require('../controllers/paymentController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/add', authMiddleware, addPayment);

router.get('/summary', authMiddleware, getSummary);

module.exports = router;