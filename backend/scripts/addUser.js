require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

async function createUser() {
    const hashedPassword = await bcrypt.hash('password123', 10); // Change password as needed
    const user = new User({
        accountNumber: '123456',
        password: hashedPassword
    });

    await user.save();
    console.log('User added successfully');
    mongoose.connection.close();
}

createUser();