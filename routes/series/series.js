const express = require('express')
const router = express.Router()
const apicache = require('apicache')

// Init cache
let cache = apicache.middleware

const { collectibleSerieslist, comicSerieslist } = require('../../controllers/series/series')

router.get('/collectible/seriesx/:slug', cache('1 day'), collectibleSerieslist)

router.get('/comic/series/:slug', cache('1 day'), comicSerieslist)

module.exports = router