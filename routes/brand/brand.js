const express = require('express')
const router = express.Router()
const { create, list, read, remove, getBrandPhoto } = require('../../controllers/brands/brands')
const { requireSignin, adminMiddleware } = require('../../controllers/auth/auth')

// Validators
const { runValidation } = require('../../validators')
const { brandCreateValidator } = require('../../validators/brand')

// Create
router.post('/brand', brandCreateValidator, requireSignin, adminMiddleware, create)

// List
router.post('/brands', list)

// Read
router.get('/brand/:slug', read)

// Delete
router.delete('/brand/:slug', requireSignin, adminMiddleware, remove)

// Get Brand Photo
router.get('/brand/photo/:slug', getBrandPhoto)

module.exports = router