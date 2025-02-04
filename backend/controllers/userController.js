const User = require('../models/userModel.js');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET_KEY, {expires: '3d'})
}

const loginUser = async (req, res) => {
    const {accountNumber, password} = req.body

    try {
        const user = await User.login(accountNumber, password)

        const token = createToken(user._id)

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.MODE_ENV === 'production',
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite: 'Lax'
        })

        res.status(200).json({accountNumber})
    }
    catch(error)
    {
        res.status(400).json({error: error.message})
    }
}

const logoutUser = async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.MODE_ENV === 'production',
        expires: new Date(0)
    })

    res.status(200).json({message: 'Logged out successfully'})
    
}


module.exports = {
    loginUser,
    logoutUser
}