const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    accountNumber:{
        type: Number,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
}, {timestamps: true})

userSchema.statics.login = async function (accountNumber, password) {
    if(!accountNumber || !password) {
        throw Error('All fields must be filled in!')
    }

const user = await this.findOne({ accountNumber })

if(!user) {
    throw Error('Incorrect account number or password!')
}

const match = await bcrypt.compare(password, user.password)

if(!match) {
    throw Error ('Incorrect account number or password!')
}

return user

}

module.exports = mongoose.model('User', userSchema)