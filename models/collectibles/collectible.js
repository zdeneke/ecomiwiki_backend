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
    soldOutDate: {
        type: Date
    },
    totalLikes: {
        type: Number
    },
    brand: {
        name: {
            type: String
        },
        id: {
            type: String
        },
        slug: {
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
        name: {
            type: String
        },
        id: {
            type: String
        }
    },
    variety: {
        type: String
    },
    rarity: {
        type: String
    },
    backgroundimage: {
        url: {
            type: String
        },
        direction: {
            type: String
        },
        thumbnailUrl: {
            type: String
        },
        lowResolutionUrl: {
            type: String
        },
        fullResolutionUrl: {
            type: String
        },
        highResolutionUrl: {
            type: String
        },
    },
    image: {
        url: {
            type: String
        },
        direction: {
            type: String
        },
        thumbnailUrl: {
            type: String
        },
        lowResolutionUrl: {
            type: String
        },
        fullResolutionUrl: {
            type: String
        },
        highResolutionUrl: {
            type: String
        },
    },
    storePrice: {
        type: Number
    },
    editionType: {
        type: String
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