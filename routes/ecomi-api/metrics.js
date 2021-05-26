const express = require('express')
const router = express.Router()
const { getOmiBurn } = require('../../controllers/metrics/index')

// List all
router.get('/ecomi/metrics/burn', getOmiBurn)

module.exports = router

