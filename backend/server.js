require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const users = require('./mockDatabase');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const ExpressBrute = require('express-brute');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')
const cors = require('cors')
const https = require('https')
const fs = require('fs')

const app = express();

const options = {
    key: fs.readFileSync('./keys/privatekey.pem'),
    cert: fs.readFileSync('./keys/certificate.pem')
}

const cspDirectives = {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", 'https://trusted-cdn.com'],
    styleSrc: ["'self'", 'https://trusted-styles.com'],
    imgSrc: ["'self'", 'data:', 'https://trusted-images.com'],
    connectSrc: ["'self'", 'https://api.yourdomain.com']
}

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X_CSURF-TOKEN'],
    credentials: true
}


const store = new ExpressBrute.MemoryStore();

const PORT = 5000;

app.use(cookieParser());
app.use(csurf({ cookie: {
    httpOnly: false,
    secure: process.env.MODE_ENV === 'production',
    sameSite: 'none'
} }));
app.use(bodyParser.json());
app.use(helmet.contentSecurityPolicy({ directives: cspDirectives }))
app.use(cors(corsOptions));
app.use(express.json())
app.set('trust proxy', true)


const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts from this IP, please try again later.',
    headers: true
});

app.use('/api/login', loginLimiter);

const bruteForce = new ExpressBrute(store, {
    freeRetries: 10,
    minWait: 1000,
    maxWait: 5000,
    failCallback: function(req, res, next) {
        console.log('Brute force failed: ', req.ip)
        res.status(429).send('Too many failed login attempts, please try again later')
    }
});

app.use((req, res, next) => {
    res.cookie('XSRF-TOKEN', req.csrfToken())
    next();
})

if(process.env.MODE_ENV !== 'development') {
    app.use(bruteForce.prevent)
}


app.use((req, res, next) => {
    if (req.protocol === 'http') {
        res.redirect(301, 'https://' + req.headers.host + req.url)
    } else {
        next();
    }
})

let payments = [];
let confirmedPaymentsCount = 0
let totalConfirmedAmount = 0

https.createServer(options, app).listen(PORT, () => {
    console.log(`Server running on https://localhost:${PORT}`)
})

app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() })
})

// User Login Route
app.post('/api/login', bruteForce.prevent, async (req, res) => {
    const { accountNumber, password } = req.body;
    
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
        
        const token = jwt.sign({ accountNumber: user.accountNumber }, process.env.SECRET_KEY, { expiresIn: '1h'})
        res.status(200).json({ message: 'Login Successful', token});
        console.log('CSRF TOKEN: ', csrfToken)

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
});

app.post('/api/payments', (req, res) => {
    const { name, description, amount } = req.body;

    if (!name || !description || !amount) {
        return res.status(400).json({ message: 'All fields are required! ' });
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
});

// app.get('/api/csrf-token', (req, res) => {
//     res.json({ csrfToken: req.csrfToken() });
// });


