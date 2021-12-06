const mongoose = require('mongoose')

const Prize = new mongoose.Schema({
    collectibleId: {
        type: String,
    },
    uniqueCoverId: {
        type: String
    },
    category: {
        type: String,
        required: true
    },
    donator: {
        type: String,
        required: true
    },
    place: {
        type: Number,
        required: true
    },
    serial: {
        type: Number
    }
}, { timestamps: true })

module.exports = mongoose.model('Prize', Prize)