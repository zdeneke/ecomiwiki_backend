const express = require('express')
const router = express.Router()
const { requireSignin, adminMiddleware } = require('../../controllers/auth/auth')
const {
    create,
    list,
    read,
    remove,
    likePost,
    unlikePost,
    addComment,
    removeComment
} = require('../../controllers/social/index')

// Post to timeline
router.post('/post', requireSignin, create)

// Get posts
router.get('/posts', list)

// Get individual post
router.get('/post/:id', read)

// Remove post
router.delete('/post/:id', requireSignin, remove)

// Like post
router.put('/post/like/:id', requireSignin, likePost)

// Unlike post
router.put('/post/unlike/:id', requireSignin, unlikePost)

// Add comment
router.post('/post/comment/:id', requireSignin, addComment)

// Remove comment
router.delete('/post/comment/:id/:comment_id', requireSignin, removeComment)

module.exports = router