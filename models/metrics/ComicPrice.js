const mongoose = require('mongoose')

const ComicPrice = new mongoose.Schema({
    comicId: {
        type: String,
    },
    coverId: {
        type: String
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
    slug: {
        type: String
    },
    totalIssued: {
        type: Number
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

module.exports = mongoose.model('ComicPrice', ComicPrice, 'comicprices')