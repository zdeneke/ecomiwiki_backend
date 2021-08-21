const express = require('express')
const router = express.Router()
const { create, list, read, remove, update, listRelated, listSearch, listBySearch } = require('../../controllers/collectibles/collectible')
const { requireSignin, adminMiddleware } = require('../../controllers/auth/auth')

router.post('/collectible', requireSignin, adminMiddleware, create)
router.post('/collectibles', list)
router.get('/collectible/:slug', read)
router.delete('/collectible/:slug', requireSignin, adminMiddleware, remove)
router.put('/collectible/:slug', requireSignin, adminMiddleware, update)
router.post("/collectibles/by/search", listBySearch);
// router.get('/collectible/photo/:slug', photo)
// router.post('/collectibles/related', listRelated)
// router.get('/collectibles/search', listSearch)

module.exports = router