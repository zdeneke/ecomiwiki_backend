const mongoose = require('mongoose')

const MarketPrice = new mongoose.Schema({
    collectibleId: {
        type: String,
    },
    name: {
        type: String
    },
    slug: {
        type: String
    },
    totalIssued: {
        type: Number
    },
    rarity: {
        type: String
    },
    editionType: {
        type: String
    },
    metrics:[{
        issueNumber: {
            type: Number
        },
        lowestPrice: {
            type: Number
        },
        totalListings: {
            type: Number
        },
        date: {
            type: Date,
            default: Date.now()
        }
    }]
}, { timestamps: true })

module.exports = mongoose.model('MarketPrice', MarketPrice)