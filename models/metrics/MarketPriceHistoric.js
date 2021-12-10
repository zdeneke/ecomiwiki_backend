const mongoose = require('mongoose')


const MarketPriceHistoric = new mongoose.Schema({
        collectibleId: {
            type: String,
        },
        history: [{
            storePrice: {
                type: Number
            },
            issueNumber: {
                type: Number
            },
            totalListings: {
                type: Number
            },
            value: {
                type: Number
            },
            date: {
                type: Date
            },
            marketCap: {
                type: Number
            },
            hourlyChange: {
                "market": {
                    type: Number
                },
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
            }
        }]
    },
    { timestamps: true, strict: false })


module.exports = mongoose.model('MarketPriceHistoric', MarketPriceHistoric, 'historicprices')