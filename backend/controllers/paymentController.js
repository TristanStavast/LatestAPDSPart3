const Payment = require('../models/paymentModel.js');

// Add a new payment
const addPayment = async (req, res) => {
    const { title, description, amount } = req.body;

    // Validate required fields
    if (!title || !description || !amount) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    try {
        // Create a new payment object
        const newPayment = new Payment({
            title,
            description,
            amount
        });

        
        await newPayment.save();

        res.status(201).json({ message: 'Payment added successfully', payment: newPayment });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add payment', error: error.message });
    }
};

// Get the summary of payments (total count and total amount)
const getSummary = async (req, res) => {
    try {
        
        const payments = await Payment.find();

        
        const totalConfirmedPayments = payments.length;
        const totalAmount = payments.reduce((total, payment) => total + payment.amount, 0);

        res.status(200).json({
            totalConfirmedPayments,
            totalAmount
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get payment summary', error: error.message });
    }
};

module.exports = {
    addPayment,
    getSummary
};
