const express = require('express')
const router = express.Router()
const { requireSignin, authMiddleware, adminMiddleware } = require('../../controllers/auth/auth')
const { read, updateMyCollection } = require('../../controllers/auth/user')

// User profile
router.get('/profile', requireSignin, adminMiddleware, read)

// Update profile
router.patch('/profile/my-collection', requireSignin, updateMyCollection)

module.exports = router