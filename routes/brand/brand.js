const express = require('express')
const router = express.Router()
const { create, list, read, remove } = require('../../controllers/brands/brands')
const { requireSignin, adminMiddleware } = require('../../controllers/auth/auth')

// Validators
const { runValidation } = require('../../validators')
const { brandCreateValidator } = require('../../validators/brand')

// Create
router.post('/brand', brandCreateValidator, requireSignin, adminMiddleware, create)

// List
router.get('/brands', list)

// Read
router.get('/brand/:slug', read)

// Delete
router.delete('/brand/:slug', requireSignin, adminMiddleware, remove)


module.exports = router