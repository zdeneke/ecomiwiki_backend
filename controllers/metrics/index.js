const omiPrice = require('../../models/metrics/omiPrice')
const omiBurn = require('../../models/metrics/omiBurn')
const Revenue = require('../../models/revenue/revenue')
const Brand = require('../../models/brands/brand')
const License = require('../../models/license/license')
const Collectible = require('../../models/collectibles/collectible')
const { errorHandler } = require('../../helpers/dbErrorHandler')
const { getPercentageChangeNumberOnly } = require('../../helpers/index')

exports.getOmiMetrics = (req,res) => {
    omiPrice.find().exec((err, data) => {
        if (err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data)
    })
}

exports.getOmiBurn = (req,res) => {
    omiBurn.find().exec((err, data) => {
        if (err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data)
    })
}

exports.getOmiBurnHeatMap = (req,res) => {
    omiBurn.find().exec((err, data) => {
        if (err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

        let burnHeatMapData = []

        data[0].burns.map((burnData, index) => {

            const burnHeatMapDataObj = {
                value: burnData.value,
                day: burnData.date.getDate(),
                month: new Date(burnData.date).toLocaleString('en-us', {month:'long'}),
            }

            burnHeatMapData.push(burnHeatMapDataObj)

        })

        res.json(burnHeatMapData)
    })
}

exports.getOmiBurnTotal = (req,res) => {
    omiBurn
        .find()
        .select('burnWalletBalance')
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(data)
        })
}

exports.getStoreRevenueData = (req,res) => {
    Revenue.find().exec((err, data) => {
        if (err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data[0].revenue)
    })
}

exports.getStoreRevenueTotal = (req,res) => {
    Revenue.find()
        .select('revenue.totalStoreIncomeGenerated')
        .limit(1)
        .exec((err, data) => {
        if (err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data[0].revenue[0])
    })
}

exports.getVeveMetrics = (req,res) => {
    Revenue.find()
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            const metricResults = {
                'revenue':{
                    "last_updated": data[0].revenue[0].date,
                    "currentStoreRevenue": data[0].revenue[0].totalStoreIncomeGenerated,
                    "twenty_four_hour_change": getPercentageChangeNumberOnly(data[0].revenue[0].totalStoreIncomeGenerated, data[0].revenue[1].totalStoreIncomeGenerated),
                    "seven_day_change": getPercentageChangeNumberOnly(data[0].revenue[0].totalStoreIncomeGenerated, data[0].revenue[6].totalStoreIncomeGenerated),
                    "thirty_day_change": getPercentageChangeNumberOnly(data[0].revenue[0].totalStoreIncomeGenerated, data[0].revenue[29].totalStoreIncomeGenerated),
                },
                'nfts': {
                    "currentNFTSales": data[0].revenue[0].totalStoreNFTSalesCount,
                    "thirty_day_change_nft": getPercentageChangeNumberOnly(data[0].revenue[0].totalStoreNFTSalesCount, data[0].revenue[29].totalStoreNFTSalesCount)
                }
            }
            res.json(metricResults)
        })
}

exports.getBrandRevenueData = (req,res) => {
    Brand.find({})
        .select('name squareImage slug revenue.realised revenue.potential revenue.date')
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            let dataBlob = []
            data.map((brand) => {
                const dataBlobObj = {
                    "name": brand.name,
                    "revenueRealised": Number(brand.revenue.realised),
                }
                dataBlob.push(dataBlobObj)
            })
            res.json(dataBlob)
        })
}

exports.getLicensorRevenueData = (req,res) => {
    License.find({})
        .select('name squareImage slug revenue.realised revenue.potential revenue.date')
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            let dataBlob = []
            data.map((license) => {
                const dataBlobObj = {
                    "name": license.name,
                    "revenueRealised": Number(license.revenue.realised),
                }
                dataBlob.push(dataBlobObj)
            })
            res.json(dataBlob)
        })
}

exports.getCollectibleRevenueData = (req,res) => {
    Collectible.find({})
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            let dataBlob = []
            data.map((collectible) => {
                console.log(`Collectible data is: `, collectible)
                const dataBlobObj = {
                    "name": collectible.name,
                    "revenueRealised": collectible.revenue.realised
                }
                dataBlob.push(dataBlobObj)
            })
            res.json(dataBlob)
        })
}