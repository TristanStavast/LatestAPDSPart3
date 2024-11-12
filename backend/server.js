const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const users = require('./mockDatabase')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const ExpressBrute = require('express-brute');
const store = new ExpressBrute.MemoryStore()

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

app.use(helmet())

const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts from this IP, please try again later.',
    headers: true
})

app.use('/api/login', loginLimiter)

const bruteForce = new ExpressBrute(store, {
    freeRetries: 3,
    minWait: 5000,
    maxWait: 60000,
    failCallback: function(req, res, next) {
        res.status(429).send('Too many failed login attempts, please try again later')
    }
})

app.use(bruteForce.prevent)

let payments = [];
let confirmedPaymentsCount = 0
let totalConfirmedAmount = 0

// User Registration Route
app.post('/api/register', async (req, res) => {
    const { fullName, idNumber, accountNumber, password } = req.body;

    if (!fullName || !idNumber || !accountNumber || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Hash the password with bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Store the hashed password (replace with a real DB call)
        const newUser = { fullName, idNumber, accountNumber, password: hashedPassword };
        users.push(newUser);

        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
});

// User Login Route
app.post('/api/login', bruteForce.prevent, async (req, res) => {
    const { accountNumber, password } = req.body;
    console.log("Users array", users)

    if (!accountNumber || !password) {
        return res.status(400).json({ message: 'Account number and password are required.' });
    }

    // Find the user in the "database"
    const user = users.find(user => user.accountNumber === accountNumber);

    if (!user) {
        console.log("user not found!!!!!")
        return res.status(400).json({ message: 'Account not found' });
    }

    try {
        // Compare the entered password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Send back a success response (you can later add a JWT token here)
        res.status(200).json({ message: 'Login successful', token: 'some-jwt-token' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
});

app.post('/api/payments', (req, res) => {
    const { name, description, amount } = req.body;

    if (!name || !description || !amount) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    const newPayment = { id: Date.now(), name, description, amount: Number(amount) };
    payments.push(newPayment);

    res.status(201).json({ message: 'Payment added successfully', payment: newPayment });
});



app.post('/api/payments/confirm/:id', (req, res) => {
    const paymentId = req.params.id;

    const paymentIndex = payments.findIndex(p => p.id.toString() === paymentId);

    if (paymentIndex === -1) {
        return res.status(404).json({ message: 'Payment not found' });
    }

    const payment = payments[paymentIndex];

    if (payment && typeof payment.amount !== 'number') {
        return res.status(400).json({ message: 'Invalid payment amount' });
    }

    // Increment the confirmed payments counter and total confirmed amount
    confirmedPaymentsCount += 1;
    
    totalConfirmedAmount += Number(payment.amount) || 0;

    // Remove the payment after confirmation
    payments.splice(paymentIndex, 1);

    res.status(200).json({
        message: 'Payment confirmed and removed',
        confirmedPaymentsCount,
        totalConfirmedAmount,
        payment
    });
});

app.get('/api/payments', (req, res) => {
    res.status(200).json({payments})
})



// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
