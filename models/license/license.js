const mongoose = require('mongoose')

const License = new mongoose.Schema({
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
    squareImage:{
        type: String
    },
    landscapeImage: {
        type: String
    },
}, { timestamps: true })

module.exports = mongoose.model('License', License)