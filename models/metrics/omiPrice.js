const mongoose = require('mongoose')

const omiPrice = new mongoose.Schema({
    price: {
        currentPrice: {
            type: Number
        },
        percent_change_1h: {
            type: Number
        },
        percent_change_7d: {
            type: Number
        },
        percent_change_24h: {
            type: Number
        },
        percent_change_30d: {
            type: Number
        },
        percent_change_60d: {
            type: Number
        },
        percent_change_90d: {
            type: Number
        },
        volume_24: {
            type: Number
        }
    },
    circulating_supply: {
        type: Number
    },
    cmc_rank: {
        type: Number
    },
    max_supply: {
        type: Number
    },
    num_market_pairs: {
        type: Number
    },
    total_supply: {
        type: Number
    },
    market_cap: {
        type: Number
    },
}, { timestamps: true })


module.exports = mongoose.model('omiPrice', omiPrice)