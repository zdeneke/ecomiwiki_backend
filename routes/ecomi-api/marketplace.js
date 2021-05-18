const express = require('express')
const router = express.Router()
const { list, read, getEndingSoonest } = require('../../controllers/ecomi-api/marketplace')
const { requireSignin, adminMiddleware } = require('../../controllers/auth/auth')

// List all
router.post('/ecomi/marketplace', list)

// Read Listing
router.post('/ecomi/marketplace/listing/:slug', read)

// Get Ending Soonest
router.post('/ecomi/marketplace/ending-soonest', getEndingSoonest )

module.exports = router

