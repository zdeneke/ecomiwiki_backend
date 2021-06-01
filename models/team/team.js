const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const teamSchema = new mongoose.Schema({
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
    formerMember: {
      type: Boolean,
      default: false
    },
    vip: {
        type: Boolean,
        default: false
    },
    title: {
        type: String
    },
    location: {
        type: String
    },
    body: {
        type: {},
        required: true,
        unique: true,
        max: 4000000,
        min: 200,
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    social: {
        youtube: {
            type: String
        },
        twitter: {
            type: String
        },
        facebook: {
            type: String
        },
        linkedin: {
            type: String
        },
        instagram: {
            type: String
        }
    },
    experience: [
        {
            title: {
                type: String,
                required: true
            },
            company: {
                type: String,
                required: true
            },
            location: {
                type: String
            },
            from: {
                type: Date,
                required: true
            },
            to: {
                type: Date
            },
        }
    ],
    author: {
        type: ObjectId,
        ref: 'User'
    }
}, { timestamps: true })


module.exports = mongoose.model('Team', teamSchema)