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
    brand: {
        type: String
    },
    storePrice: {
        type: Number
    },
    editionType: {
        type: String
    },
    metrics:{
        issueNumber: {
            type: Number
        },
        lowestPrice: {
            type: Number
        },
        totalListings: {
            type: Number
        },
        createdAt: {
            type: Date
        },
        updatedAt: {
            type: Date
        },
        prevSold: {
            "price": {
                type: Number
            },
            "createdAt": {
                type: Date
            },
            "issueNumber": {
                type: Number
            },
            "listingType": {
                type: String
            }
        },
    }
}, { timestamps: true })

module.exports = mongoose.model('MarketPrice', MarketPrice, 'marketprices')