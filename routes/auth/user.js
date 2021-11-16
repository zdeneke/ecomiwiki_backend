const express = require('express')
const router = express.Router()
const { requireSignin, authMiddleware, adminMiddleware } = require('../../controllers/auth/auth')
const { read, updateMyCollection, updateValuation, getUserCollectibles } = require('../../controllers/auth/user')

// User profile
router.get('/profile', requireSignin, adminMiddleware, read)

// Update user collection
router.put('/user/collection/:slug', requireSignin, updateMyCollection)

// Get user collection
router.get('/user/collection/:slug', requireSignin, getUserCollectibles)

// Set valuation
router.put('/user/valuation', requireSignin, updateValuation)

module.exports = router