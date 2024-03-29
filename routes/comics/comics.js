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
    getLatestComics,
    listBySearch,
    getSingleComicSeo
} = require('../../controllers/comics/comic')
const { requireSignin, adminMiddleware } = require('../../controllers/auth/auth')

let cache = apicache.middleware

// router.post('/comic', requireSignin, adminMiddleware, create)
router.post('/comics', cache('61 minutes'), list)
router.get('/comic/:slug', cache('61 minutes'), read)
router.get('/comic/seo/:slug', cache('61 minutes'), getSingleComicSeo)
router.delete('/comic/:slug', requireSignin, adminMiddleware, remove)
router.put('/comic/:slug', requireSignin, adminMiddleware, update)
router.post('/comic/latest', getLatestComics)
router.post("/comics/by/search", listBySearch);
// router.get('/comic/photo/:slug', photo)
// router.post('/comics/related', listRelated)
// router.get('/comics/search', listSearch)

module.exports = router