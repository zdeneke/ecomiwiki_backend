const mongoose = require('mongoose')


const MarketComicPriceHistoric = new mongoose.Schema({
        uniqueCoverId: {
            type: String,
        },
        prices: [{
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
            hourlyChange: {
                "market": {
                    type: Number
                },
            },
        }]
    },
    { timestamps: true, strict: false })


module.exports = mongoose.model('MarketComicPriceHistoric', MarketComicPriceHistoric, 'historiccomicprices')