const express = require('express')
const router = express.Router()
const apicache = require('apicache')
const { requireSignin } = require('../../controllers/auth/auth')

const {
    getOmiMetrics,
    getOmiBurn,
    getOmiBurnTotal,
    getUserGrowthData,
    getStoreRevenueData,
    getStoreRevenueTotal,
    getVeveMetrics,
    getOmiBurnHeatMap,
    getBrandRevenueData,
    getLicensorRevenueData,
    getCollectibleRevenueData,
    getMarketplaceData,
    getMarketPriceHistoricData,
    getMarketplaceComicData,
    getCollectiblesValuation,
    getComicsValuation,
    getMarketPriceComicHistoricData,
    getSingleMarketCollectibleData,
    getCollectibleChangeSummary,
    getAllMarketPriceHistoricData,
    getMarketPlaceDataBySearch,
    getMarketPlaceDataBySearchMyCollectibles,
    getFloorPriceById,
    getMarketPlaceComicDataBySearch,
    getAllMarketComicPriceHistoricData,
    getSingleMarketCollectibleStatistics
} = require('../../controllers/metrics/index')

// Init cache
let cache = apicache.middleware

// Get OMI metrics
router.get('/metrics/omi', cache('5 minutes'), getOmiMetrics)

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

// Get veve user growth data
router.get('/metrics/user/growth', getUserGrowthData)

// Get brand revenue data
router.get('/metrics/brands', cache('60 minutes'), getBrandRevenueData)

// Get licensor revenue data
router.get('/metrics/licensor', cache('61 minutes'), getLicensorRevenueData)

// Get collectible revenue data
router.get('/metrics/collectibles', cache('61 minutes'), getCollectibleRevenueData)

// Get secondary marketplace data for collectibles
router.post('/metrics/marketplace/collectibles', cache('61 minutes'), getMarketplaceData)

// Search secondary marketplace data collectibles
router.post('/metrics/marketplace/collectibles/search', getMarketPlaceDataBySearch)

// Search secondary marketplace data for users collectibles
router.post('/metrics/marketplace/my-collectibles/search', getMarketPlaceDataBySearchMyCollectibles)

// Biggest losers in the marketplace
// router.post('/metrics/marketplace/collectibles/loosers', getMarketPlaceDataByLosers)

// Get secondary marketplace data for single (collectible)
router.get('/metrics/marketplace/collectible/:slug', cache('61 minutes'), getSingleMarketCollectibleData)

// Get secondary marketplace data for single (collectible)
router.get('/metrics/marketplace/collectible/:slug/statistics', cache('61 minutes'), getSingleMarketCollectibleStatistics)

// Get floor price by id
router.get('/metrics/marketplace/collectible/:slug/current-floor-price', cache('61 minutes'), getFloorPriceById)

// Get percentage change summary for collectible
router.get('/metrics/marketplace/collectible/:slug/percentages', cache('61 minutes'), getCollectibleChangeSummary)

// Get secondary marketplace historical sale data (collectible)
router.get('/metrics/marketplace/collectible/history/:slug', cache('61 minutes'), getMarketPriceHistoricData)

router.get('/metrics/marketplace/collectible/history/:slug/all', cache('61 minutes'), getAllMarketPriceHistoricData)

// Get secondary marketplace data for comics
router.get('/metrics/marketplace/comics', cache('61 minutes'), getMarketplaceComicData)

router.post('/metrics/marketplace/comics/search', cache('61 minutes'), getMarketPlaceComicDataBySearch)

// Get secondary marketplace historical sale data (comic)
router.get('/metrics/marketplace/comic/history/:slug', cache('61 minutes'), getMarketPriceComicHistoricData)

router.get('/metrics/marketplace/comic/history/:slug/all', cache('61 minutes'), getAllMarketComicPriceHistoricData)

// Get collectibles valuation
router.post('/metrics/account/collectibles/valuation', getCollectiblesValuation)

// Get comics valuation
router.post('/metrics/account/comics/valuation', getComicsValuation)

module.exports = router