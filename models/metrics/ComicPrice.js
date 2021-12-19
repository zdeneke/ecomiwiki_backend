const mongoose = require('mongoose')

const ComicPrice = new mongoose.Schema({
    uniqueCoverId: {
        type: String
    },
    slug: {
        type: String,
        unique: true
    },
    comicId: {
        type: String,
    },
    name: {
        type: String
    },
    comicSeries: {
        id:{
            type: String
        },
        name: {
            type: String
        }
    },
    cover: {
        id: {
            type: String
        },
        totalIssued: {
            type: Number
        },
        rarity: {
            type: String
        },
        image: {
            url: {
                type: String
            },
            thumbnailUrl: {
                type: String
            },
            direction: {
                type: String
            }
        }
    },
    totalIssued: {
        type: Number
    },
    totalAvailable: {
        type: Number
    },
    storePrice: {
        type: Number
    },
    comicNumber: {
        type: Number
    },
    metrics:{
        lowestPrice: {
            type: Number
        },
        one_day_change: {
            type: Number
        },
        totalListings: {
            type: Number
        },
        updatedAt: {
            type: Date
        },
    }
}, { timestamps: true })

module.exports = mongoose.model('ComicPrice', ComicPrice, 'comicprices')