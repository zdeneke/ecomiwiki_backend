const express = require('express')
const router = express.Router()
const apicache = require('apicache')
const { requireSignin, authMiddleware } = require('../../controllers/auth/auth')

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
    getMarketPlaceDataByLosers,
    getMarketPlaceDataByGainers,
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

router.get('/metrics/test', requireSignin, authMiddleware, (req,res) => {
    res.json({
        'msg': 'here is data.'
    })
})

// Get brand revenue data
router.get('/metrics/brands', requireSignin, authMiddleware, cache('60 minutes'), getBrandRevenueData)

// Get licensor revenue data
router.get('/metrics/licensor', requireSignin, authMiddleware, cache('61 minutes'), getLicensorRevenueData)

// Get collectible revenue data
router.get('/metrics/collectibles', requireSignin, authMiddleware, cache('61 minutes'), getCollectibleRevenueData)

// Get secondary marketplace data for collectibles
router.post('/metrics/marketplace/collectibles', requireSignin, authMiddleware, cache('61 minutes'), getMarketplaceData)

// Search secondary marketplace data collectibles
router.post('/metrics/marketplace/collectibles/search', requireSignin, authMiddleware, getMarketPlaceDataBySearch)

// Search secondary marketplace data for users collectibles
router.post('/metrics/marketplace/my-collectibles/search', requireSignin, authMiddleware, getMarketPlaceDataBySearchMyCollectibles)

// Biggest losers in the marketplace
router.post('/metrics/marketplace/collectibles/losers', requireSignin, authMiddleware, getMarketPlaceDataByLosers)

// Biggest gainers in the marketplace
router.post('/metrics/marketplace/collectibles/gainers', requireSignin, authMiddleware, getMarketPlaceDataByGainers)

// Get secondary marketplace data for single (collectible)
router.get('/metrics/marketplace/collectible/:slug', requireSignin, authMiddleware, cache('61 minutes'), getSingleMarketCollectibleData)

// Get secondary marketplace data for single (collectible)
router.get('/metrics/marketplace/collectible/:slug/statistics', requireSignin, authMiddleware, cache('61 minutes'), getSingleMarketCollectibleStatistics)

// Get floor price by id
router.get('/metrics/marketplace/collectible/:slug/current-floor-price', requireSignin, authMiddleware, cache('61 minutes'), getFloorPriceById)

// Get percentage change summary for collectible
router.get('/metrics/marketplace/collectible/:slug/percentages', requireSignin, authMiddleware, cache('61 minutes'), getCollectibleChangeSummary)

// Get secondary marketplace historical sale data (collectible)
router.get('/metrics/marketplace/collectible/history/:slug', requireSignin, authMiddleware, cache('61 minutes'), getMarketPriceHistoricData)

router.get('/metrics/marketplace/collectible/history/:slug/all', requireSignin, authMiddleware, cache('61 minutes'), getAllMarketPriceHistoricData)

// Get secondary marketplace data for comics
router.get('/metrics/marketplace/comics', requireSignin, authMiddleware, cache('61 minutes'), getMarketplaceComicData)

router.post('/metrics/marketplace/comics/search', requireSignin, authMiddleware, getMarketPlaceComicDataBySearch)

// Get secondary marketplace historical sale data (comic)
router.get('/metrics/marketplace/comic/history/:slug', requireSignin, authMiddleware, cache('61 minutes'), getMarketPriceComicHistoricData)

router.get('/metrics/marketplace/comic/history/:slug/all', requireSignin, authMiddleware, cache('61 minutes'), getAllMarketComicPriceHistoricData)

// Get collectibles valuation
// router.post('/metrics/account/collectibles/valuation', cache('61 minutes'), getCollectiblesValuation)

// Get comics valuation
// router.post('/metrics/account/comics/valuation', cache('61 minutes'), getComicsValuation)

module.exports = router