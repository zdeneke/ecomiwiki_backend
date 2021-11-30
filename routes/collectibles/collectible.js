const express = require('express')
const router = express.Router()
const apicache = require('apicache')
const {
    create,
    list,
    read,
    remove,
    update,
    listRelated,
    listSearch,
    listBySearch,
    getLatestCollectibles,
    getCollectibleBySlug
} = require('../../controllers/collectibles/collectible')
const { requireSignin, adminMiddleware } = require('../../controllers/auth/auth')

// Init cache
let cache = apicache.middleware

router.post('/collectible', requireSignin, adminMiddleware, create)
router.post('/collectibles', cache('61 minutes'), list)
router.get('/collectible/:slug', cache('61 minutes'), read)
router.get('/collectible/seo/:slug', cache('120 minutes'), getCollectibleBySlug) // TODO: Lets clean this up its basically the same as above but uses slug instead of id
router.delete('/collectible/:slug', requireSignin, adminMiddleware, remove)
router.put('/collectible/:slug', requireSignin, adminMiddleware, update)
router.post("/collectibles/by/search", listBySearch);
router.post("/collectibles/latest", getLatestCollectibles)
// router.get('/collectible/photo/:slug', photo)
// router.post('/collectibles/related', listRelated)
// router.get('/collectibles/search', listSearch)

module.exports = router