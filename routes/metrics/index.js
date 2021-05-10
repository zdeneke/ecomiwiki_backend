const express = require('express')
const router = express.Router()
const { getOmiMetrics } = require('../../controllers/metrics/index')

// Get OMI metrics
router.get('/metrics/omi', getOmiMetrics)

module.exports = router