const mongoose = require('mongoose')

const UserCount = new mongoose.Schema({
    counts: [{
        value: Number,
        date: Date
    }],
    newUsers: {
        type: Number
    }
}, { timestamps: true })

module.exports = mongoose.model('UserCount', UserCount)