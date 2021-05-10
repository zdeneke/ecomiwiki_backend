const express = require('express')
const router = express.Router()
const { requireSignin, authMiddleware, adminMiddleware } = require('../../controllers/auth/auth')
const { read } = require('../../controllers/auth/user')

// User profile
router.get('/profile', requireSignin, adminMiddleware, read)

module.exports = router