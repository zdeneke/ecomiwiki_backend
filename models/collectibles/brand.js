const mongoose = require('mongoose')

const brandSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: true,
        max: 32
    },
    slug: {
        type: String,
        unique: true,
        index: true
    },
}, { timestamps: true })


module.exports = mongoose.model('Brand', brandSchema)