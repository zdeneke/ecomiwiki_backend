const mongoose = require('mongoose')

const omiBurn = new mongoose.Schema({
    burns: [{
        value: Number,
        date: Date
    }],
    burnWalletBalance: Number,
}, { timestamps: true })


module.exports = mongoose.model('omiBurn', omiBurn)