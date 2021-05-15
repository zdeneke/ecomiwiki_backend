const express = require('express')
const router = express.Router()
const { list, read } = require('../../controllers/ecomi-api/marketplace')
const { requireSignin, adminMiddleware } = require('../../controllers/auth/auth')

// List all
router.post('/ecomi/marketplace', list)

// Read Listing
router.post('/ecomi/marketplace/listing/:slug', read)

module.exports = router

