const express = require('express')
const router = express.Router()

const { list } = require('../../controllers/series/series')

router.get('/collectible/series/:slug', list)

module.exports = router