const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

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
    license: [{
        type: ObjectId,
        ref: 'License',
        required: true
    }],
    banner: {
        type: String
    },
    description: {
        type: String
    }
}, { timestamps: true })


module.exports = mongoose.model('Brand', brandSchema)