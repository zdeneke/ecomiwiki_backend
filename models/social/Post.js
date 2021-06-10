const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const PostSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: 'User'
    },
    body: {
        type: String,
        required: true
    },
    likes: [
        {
            user: {
                type: ObjectId,
                ref: 'User'
            }
        }
    ],
    comments: [
        {
            user: {
                type: ObjectId,
                ref: 'User'
            },
            body: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }

        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Post', PostSchema)