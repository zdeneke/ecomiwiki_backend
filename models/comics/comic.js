const mongoose = require('mongoose')

const Comic = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    comicSeries: {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        }
    },
    slug: {
        type: String,
        unique: true,
        index: true
    },
    dropDate: {
        type: Date
    },
    description: {
        type: String,
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
            lowResolutionUrl: {
                type: String
            },
            medResolutionUrl: {
                type: String
            },
            highResolutionUrl: {
                type: String
            },
            fullResolutionUrl: {
                type: String
            },
            direction: {
                type: String
            }
        }
    },
    storePrice: {
        type: Number
    },
    pageCount: {
        type: Number
    },
    comicNumber: {
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

module.exports = mongoose.model('Comic', Comic)