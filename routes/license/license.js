const express = require('express')
const router = express.Router()
const { create, list, read, remove } = require('../../controllers/license/licenses')
const { requireSignin, adminMiddleware } = require('../../controllers/auth/auth')

// Validators
const { runValidation } = require('../../validators')
const { licenseCreateValidator } = require('../../validators/license')

// Create
router.post('/license', licenseCreateValidator, requireSignin, adminMiddleware, create)

// List
router.get('/licenses', list)

// Read
router.get('/license/:slug', read)

// Delete
router.delete('/license/:slug', requireSignin, adminMiddleware, remove)


module.exports = router