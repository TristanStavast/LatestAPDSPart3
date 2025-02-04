const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    accountNumber:{
        type: Number,
        required: true,
        unique: true,
        validate: {
            validator: (value) => /^\d+$/.test(value),
            message: 'Account number must contain only digits',
        },
        
    },
    password:{
        type: String,
        required: true,
        validate: {
            validator: (value) =>
                validator.isStrongPassword(value, {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                }),
                message: 'Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter and 1 number.'
        },
    },
}, {timestamps: true})

userSchema.pre('svae', async function (next) {
    if(!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

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