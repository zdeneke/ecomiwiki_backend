const mongoose = require('mongoose')

const Brand = new mongoose.Schema({
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
    description: {
        type: String,
    },
    licensor: {
        id: {
            type: String
        },
        name: {
            type: String
        }
    },
    squareImage:{
        url: {
            type: String
        },
    },
    landscapeImage: {
        type: String
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

module.exports = mongoose.model('Brand', Brand)