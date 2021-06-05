const mongoose = require('mongoose')

const Revenue = new mongoose.Schema({
    revenue:[{
        totalRevenueForDay: {
            type: Number,
            default: 0,
        },
        totalNFTSalesForDay: {
            type: Number,
            default: 0
        },
        totalStoreNFTSalesCount: {
            type: Number,
            default: 0
        },
        totalStoreIncomeGenerated: {
            type: Number
        },
        date: {
            type: Date
        }
    }],
}, { timestamps: true })

module.exports = mongoose.model('Revenue', Revenue)