const mongoose = require('mongoose')

const dateNow = Date.now()
const MarketPriceHistoric = new mongoose.Schema({
        collectibleId: {
            type: String,
        },
    },
    { timestamps: true, strict: false })


module.exports = mongoose.model('MarketPriceHistoric', MarketPriceHistoric, 'historicprices')