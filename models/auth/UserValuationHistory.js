const mongoose = require('mongoose')


const UserValuationHistory = new mongoose.Schema({
        valuation: [{
            totalValuation: {
                type: Number
            },
            comicsValuation: {
                type: Number
            },
            collectiblesValuation: {
                type: Number
            },
            omiValuation: {
                type: Number
            },
            date: {
                type: Date,
            }
        }]
    },
    { timestamps: true, strict: false })


module.exports = mongoose.model('UserValuationHistory', UserValuationHistory, 'user-valuation-history')