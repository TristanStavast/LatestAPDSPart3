const User = require('../models/userModel.js');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
    jwt.sign({_id}, process.env.SECRET_KEY, {expires: '3d'})
}

const loginUser = async (requestAnimationFrame, res) => {
    const {accountNumber, password} = res.body

    try {
        const user = await User.loginUser(accountNumber, password)

        const token = createToken(user._id)

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.MODE_ENV === 'produciton',
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite: 'Lax'
        })
    }
    catch(error)
    {
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    loginUser
}