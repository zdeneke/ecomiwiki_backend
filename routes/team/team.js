const express = require('express')
const router = express.Router()
const { create, list, read, remove, update, photo,} = require('../../controllers/team/team')
const { requireSignin, adminMiddleware } = require('../../controllers/auth/auth')

// Create team
router.post('/team', requireSignin, adminMiddleware, create)

// Get team
router.get('/team', list)

// Read team member
router.get('/team/:slug', read)

// Delete team member
router.delete('/team/:slug', requireSignin, adminMiddleware, remove)

// Update team member
router.put('/team/:slug', requireSignin, adminMiddleware, update)

// Get team member photo
router.get('/team/photo/:slug', photo)

module.exports = router