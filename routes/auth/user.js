const express = require('express')
const router = express.Router()
const { requireSignin, authMiddleware, adminMiddleware } = require('../../controllers/auth/auth')
const {
    read,
    updateMyCollection,
    updateValuation,
    getUserCollectibles,
    updateMyComics,
    getUserComics,
    updateMyValuation
} = require('../../controllers/auth/user')

// User profile
router.get('/profile', requireSignin, adminMiddleware, read)

// Update user collection
router.put('/user/collection/:slug', requireSignin, updateMyCollection)

// Update user comics
router.put('/user/comics/:slug', requireSignin, updateMyComics)

// Get user collection
router.get('/user/collection/:slug', requireSignin, getUserCollectibles)

// Get user comics
router.get('/user/comics/:slug', requireSignin, getUserComics)

// Set valuation
router.put('/user/valuation/:slug', requireSignin, updateValuation)

module.exports = router