const express = require('express')
const router = express.Router()
const { create, list, read, remove, update, listRelated, listSearch } = require('../../controllers/comics/comic')
const { requireSignin, adminMiddleware } = require('../../controllers/auth/auth')

// router.post('/comic', requireSignin, adminMiddleware, create)
router.post('/comics', cache('61 minutes'), list)
router.get('/comic/:slug', cache('61 minutes'), read)
router.delete('/comic/:slug', requireSignin, adminMiddleware, remove)
router.put('/comic/:slug', requireSignin, adminMiddleware, update)
// router.get('/comic/photo/:slug', photo)
// router.post('/comics/related', listRelated)
// router.get('/comics/search', listSearch)

module.exports = router