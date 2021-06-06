const express = require('express')
const router = express.Router()
const {
    getOmiMetrics,
    getOmiBurn,
    getOmiBurnTotal,
    getStoreRevenueData,
    getStoreRevenueTotal,
    getVeveMetrics,
    getOmiBurnHeatMap,
    getBrandRevenueData,
    getLicensorRevenueData,
    getCollectibleRevenueData
} = require('../../controllers/metrics/index')

// Get OMI metrics
router.get('/metrics/omi', getOmiMetrics)

// Get OMI burn history
router.get('/metrics/burns', getOmiBurn)

// Get OMI burn total
router.get('/metrics/burns/total', getOmiBurnTotal)

// Get OMI burn data for heatmap
router.get('/metrics/burns/heatmap', getOmiBurnHeatMap)

// Get store revenue history
router.get('/metrics/revenue', getStoreRevenueData)

// Get store revenue total
router.get('/metrics/revenue/total', getStoreRevenueTotal)

// Get veve metrics
router.get('/metrics/veve', getVeveMetrics)

// Get brand revenue data
router.get('/metrics/brands', getBrandRevenueData)

// Get licensor revenue data
router.get('/metrics/licensor', getLicensorRevenueData)

// Get collectible revenue data
router.get('/metrics/collectibles', getCollectibleRevenueData)

module.exports = router