const mongoose = require('mongoose')

const Collectible = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true,
        index: true
    },
    dropDate: {
        type: Date
    },
    brand: {
        name: {
            type: String
        },
        id: {
            type: String
        }
    },
    licensor: {
        name: {
            type: String
        },
        id: {
            type: String
        },
    },
    description: {
        type: String,
    },
    series: {
        type: String
    },
    variety: {
        type: String
    },
    rarity: {
        type: String
    },
    image: {
        url: {
            type: String
        },
        direction: {
            type: String
        }
    },
    storePrice: {
        type: Number
    },
    totalIssued:{
        type: Number
    },
    totalAvailable: {
        type: Number
    },
    revenue:{
        realised: {
            type: Number
        },
        potential: {
            type: Number
        }
    }
}, { timestamps: true })

module.exports = mongoose.model('Collectible', Collectible)