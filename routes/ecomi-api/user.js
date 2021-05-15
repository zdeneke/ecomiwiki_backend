const express = require('express')
const router = express.Router()
const { read } = require('../../controllers/ecomi-api/user')
const { requireSignin, adminMiddleware } = require('../../controllers/auth/auth')

// List all
//router.post('/ecomi/marketplace', list)

// Read User
router.get('/ecomi/users/:slug', read)

module.exports = router

