const mongoose = require('mongoose') 

const Schema = mongoose.Schema

const paymentSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    amount:{
        type: Number,
        required: true,
        min: [0.01, 'Amount must be greater than zero!']
    }
}, {timestamps: true})


module.exports = mongoose.model('Payment', paymentSchema)