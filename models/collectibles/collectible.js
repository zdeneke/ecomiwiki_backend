const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const collectibleSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        max: 160,
        min: 3,
    },
    brand: [{
        type: ObjectId,
        ref: 'Brand',
        required: true
    }],
    veveImage: {
        type: String,
        required: true
    },
    eiImage: {
        type: String,
    },
    dropDate: {
        type: Date
    },
    listPrice: {
        type: Number
    },
    rarity: {
        type: String
    },
    editions: {
        type: Number
    },
    editionType: {
        type: String
    },
    license: {
        type: String
    },
    series: {
        type: Number
    },
    slug: {
        type: String,
        unique: true,
        required: true,
    },
    body: {
        type: {},
        required: true,
        unique: true,
        max: 4000000,
        min: 200,
    },
    excerpt: {
        type: String,
        max: 1000,
    },
    mtitle: {
        type: String,
    },
    mdesc: {
        type: String,
    },
}, { timestamps: true })

module.exports = mongoose.model('Collectible', collectibleSchema)