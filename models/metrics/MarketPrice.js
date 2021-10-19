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
        "name": {
            type: String
        },
        "id": {
            type: String
        },
        "squareImage":{
            "thumbnailUrl": {
                type: String
            },
        }
    },
    image: {
        direction: String,
        thumbnailUrl: String
    },
    storePrice: {
        type: Number
    },
    editionType: {
        type: String
    },
    history: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MarketPriceHistoric'
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