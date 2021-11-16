const express = require('express')
const router = express.Router()

const { collectibleSerieslist, comicSerieslist } = require('../../controllers/series/series')

router.get('/collectible/series/:slug', collectibleSerieslist)

router.get('/comic/series/:slug', comicSerieslist)

module.exports = router