const express = require('express')
const router = express.Router()
const { listNewArrivals } = require('../../controllers/ecomi-api/store')
const { requireSignin, adminMiddleware } = require('../../controllers/auth/auth')

// List all
//router.post('/ecomi/marketplace', list)

// Get New Arrivals
router.post('/ecomi/store/new-arrivals', listNewArrivals)

module.exports = router

