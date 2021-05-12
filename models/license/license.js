const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const licenseSchema = new mongoose.Schema({
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
    brand: [{
        type: ObjectId,
        ref: 'Brand',
        required: true
    }],
    banner: {
        type: String
    },
    description: {
        type: String
    },
    }, { timestamps: true })

module.exports = mongoose.model('License', licenseSchema)