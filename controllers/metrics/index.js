const omiPrice = require('../../models/metrics/omiPrice')
const omiBurn = require('../../models/metrics/omiBurn')
const UserCount = require('../../models/metrics/userCount')
const Revenue = require('../../models/revenue/revenue')
const Brand = require('../../models/brands/brand')
const License = require('../../models/license/license')
const Collectible = require('../../models/collectibles/collectible')
const MarketPrice = require('../../models/metrics/MarketPrice')
const ComicPrice = require('../../models/metrics/ComicPrice')
const MarketPriceHistoric = require('../../models/metrics/MarketPriceHistoric')
const MarketComicPriceHistoric = require('../../models/metrics/MarketComicPriceHistoric')
const { errorHandler } = require('../../helpers/dbErrorHandler')
const { getPercentageChangeNumberOnly } = require('../../helpers/index')

exports.getMarketPriceHistoricData = (req,res) => {
    const slug = req.params.slug
    MarketPriceHistoric.aggregate([
        {
            "$match": {
                collectibleId: slug,
                "history.date": {
                    $gte: new Date(new Date().getTime() - (24 * 60 * 60 * 1000))
                }
            }
        },
        {
            "$set": {
                "history": {
                    "$filter": {
                        "input": "$history",
                        "as": "h",
                        "cond": {
                            $gte: [
                                "$$h.date",
                                new Date(new Date().getTime() - (24 * 60 * 60 * 1000))
                            ]
                        }
                    }
                }
            }
        }
    ]).exec((err, data) => {
        if (err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data)
    })
}

exports.getMarketPriceHistoricData48 = (req,res) => {
    const slug = req.params.slug

    MarketPriceHistoric.aggregate([
        {
            "$match": {
                collectibleId: slug,
                "history.date": {
                    $gte: new Date(new Date().getTime() - (48 * 60 * 60 * 1000))
                }
            }
        },
        {
            "$set": {
                "history": {
                    "$filter": {
                        "input": "$history",
                        "as": "h",
                        "cond": {
                            $gte: [
                                "$$h.date",
                                new Date(new Date().getTime() - (48 * 60 * 60 * 1000))
                            ]
                        }
                    }
                }
            }
        }
    ]).exec((err, data) => {
        if (err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data)
    })
}

exports.getAllMarketPriceHistoricData = (req,res) => {
    const slug = req.params.slug

    MarketPriceHistoric.aggregate([
        {$match: { collectibleId: slug } },
        {
            $addFields: {
                history: {
                    $map: {
                        input: "$history",
                        in: {
                            "$mergeObjects": [
                                "$$this",
                                {
                                    prevSold: "$$this.prevSold.price"
                                }
                            ]
                        }
                    }
                }
            }
        }
    ]).exec((err, data) => {
        if (err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data)
    })
}

exports.getAllMarketComicPriceHistoricData = (req,res) => {
    const slug = req.params.slug
    MarketComicPriceHistoric.find({ uniqueCoverId: slug}).exec((err, data) => {
        if (err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data)
    })
}

exports.updateAllMarketComicPriceHistory = async function(){
    console.log('\n\n ----------------Running marketCap insertion for Comics ----------------\n')
    console.log('\n\n Please wait while the script runs.... AVG: 3s per record W/O INSERT....\n')
    console.time('updating comics')
    let singularEntries = 0
    let overallRows = 0
    let noValueRecords = 0
    let noListingsRecords = 0
    let overallUnchanged = 0
    const results = await MarketComicPriceHistoric.find(5).exec()
    if(results){
        results.map((v,i) => {
            if(!v.history) return null
            let realHistory = []
            v.history.map((vi,ii) => {
                if(!vi.marketCap){
                    singularEntries++;
                    let realListings = vi.totalListings
                    if(!vi.value){
                        noValueRecords++;
                        return;
                    }
                    if(!vi.totalListings || vi.totalListings === 0){
                        realListings = 1
                        noListingsRecords++;
                    }
                    vi.marketCap = vi.value * realListings
                    realHistory.push(vi)
                }else{
                    overallUnchanged++;
                    realHistory.push(vi)
                }
            })

            // ############ UNCOMMENT AT YOUR OWN RISK ########### 
            // ####################### 
            // PLEASE ONLY UNCOMMENT AND HIT THIS ENDPOINT WITH A LIMIT IF YOU'RE TESTING - AND DO SO LOCALLY.
            // ####################### 

            // await MarketComicPriceHistoric.findOneAndUpdate(
            //     {'_id': v._id},
            // {
            //    $set: {
            //         'history': realHistory
            //     }
            // },
            //     { new: false, upsert: false }
            // ).exec((err,doc) => {
            //     if(err){
            //         console.log('\n\n ERROR UPDATING COMICS ---', err)
            //         return;
            //     }
            //     console.log('\n\n SUCCESS UPDATING COMICS ----')
            // })

            overallRows++;
        })

        console.log('\n\n\n -------INSIDE UPDATE COMICS ---- \n')
        console.timeEnd('updating comics')
        console.log('overall rows checked', overallRows)
        console.log('singular entries updated', singularEntries)
        console.log('singular entries NOT updated', overallUnchanged)
        console.log('no value records', noValueRecords)
        console.log('no listings records', noListingsRecords)
        console.log('\n\n')
    }
}

exports.updateAllMarketCollectiblePriceHistory = async function(){
    console.log('\n\n ----------------Running marketCap insertion for Collectibles ----------------\n')
    console.log('\n\n Please wait while the script runs.... AVG: 3s per record  W/O INSERT....\n')
    console.time('updating collectibles')
    let singularEntries = 0
    let overallRows = 0
    let noValueRecords = 0
    let noListingsRecords = 0
    let overallUnchanged = 0
    const results = await MarketPriceHistoric.find().limit(5).exec()
    if(results){
        results.map((v,i) => {
            if(!v.history) return null
            let realHistory = []
            v.history.map((vi,ii) => {
                if(!vi.marketCap){
                    singularEntries++;
                    let realListings = vi.totalListings
                    if(!vi.value){
                        noValueRecords++;
                        return;
                    }
                    if(!vi.totalListings || vi.totalListings === 0){
                        realListings = 1
                        noListingsRecords++;
                    }
                    vi.marketCap = vi.value * realListings
                    realHistory.push(vi)
                }else{
                    overallUnchanged++;
                    realHistory.push(vi)
                }
            })

            // ############ UNCOMMENT AT YOUR OWN RISK ###########
            // #######################
            // PLEASE ONLY UNCOMMENT AND HIT THIS ENDPOINT WITH A LIMIT IF YOU'RE TESTING - AND DO SO LOCALLY.
            // #######################

            // await MarketPriceHistoric.findOneAndUpdate(
            //     {'_id': v._id},
            // {
            //    $set: {
            //         'history': realHistory
            //     }
            // },
            //     { new: false, upsert: false },
            // ).exec((err,doc) => {
            //     if(err){
            //         console.log('\n\n ERROR UPDATING COLLECTIBLES ---', err)
            //         return;
            //     }
            //     console.log('\n\n SUCCESS UPDATING COLLECTIBLES ----')
            // })

            overallRows++;
        })
        console.log('\n\n\n -------INSIDE UPDATE COLLECTIBLES ---- \n')
        console.timeEnd('updating collectibles')
        console.log('overall rows checked', overallRows)
        console.log('singular entries updated', singularEntries)
        console.log('singular entries NOT updated', overallUnchanged)
        console.log('no value records', noValueRecords)
        console.log('no listings records', noListingsRecords)
        console.log('\n\n')
    }
}


exports.getMarketPlaceComicDataByLosers = (req,res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 15
    let offset = req.body.offset ? parseInt(req.body.offset) : 0
    ComicPrice.find( {"metrics.one_day_change":{ "$exists": true }} )
        .sort({ "metrics.one_day_change": 1 })
        .skip(offset)
        .limit(limit)
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json({
                size: data.length,
                data
            })
        })
}

exports.getMarketPlaceComicDataByGainers = (req,res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 15
    let offset = req.body.offset ? parseInt(req.body.offset) : 0
    ComicPrice.find( {"metrics.one_day_change":{ "$exists": true }} )
        .sort({ "metrics.one_day_change": -1 })
        .skip(offset)
        .limit(limit)
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json({
                size: data.length,
                data
            })
        })
}

exports.getMarketPlaceDataByLosers = (req,res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 15
    let offset = req.body.offset ? parseInt(req.body.offset) : 0
    MarketPrice.find( {"metrics.one_day_change":{ "$exists": true }} )
        .sort({ "metrics.one_day_change": 1 })
        .skip(offset)
        .limit(limit)
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json({
                size: data.length,
                data
            })
        })
}

exports.getMarketPlaceDataByGainers = (req,res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 15
    let offset = req.body.offset ? parseInt(req.body.offset) : 0
    MarketPrice.find( {"metrics.one_day_change":{ "$exists": true }} )
        .sort({ "metrics.one_day_change": -1 })
        .skip(offset)
        .limit(limit)
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json({
                size: data.length,
                data
            })
        })
}

exports.getMarketPlaceComicDataBySearch = (req,res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 15
    let offset = req.body.offset ? parseInt(req.body.offset) : 0
    let findArgs = {}
    if (req.body.filters.name && req.body.filters.name.length > 0){
        findArgs = {
            "$or": [
                { "name": { '$regex': req.body.filters.name, '$options': 'i' } },
                { "brand.name": { '$regex': req.body.filters.name, '$options': 'i' } }
            ]
        }
    }

    ComicPrice.find(findArgs)
        .sort([[sortBy, order]])
        .skip(offset)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                console.log('Error is: ', err)
                return res.status(400).json({
                    error: "Comics not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
}

exports.getMarketPlaceDataBySearch = (req,res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 15
    let offset = req.body.offset ? parseInt(req.body.offset) : 0
    let findArgs = {}
    if (req.body.filters.name && req.body.filters.name.length > 0){
        findArgs = {
            "$or": [
                { "name": { '$regex': req.body.filters.name, '$options': 'i' } },
                { "brand.name": { '$regex': req.body.filters.name, '$options': 'i' } }
            ]
        }
    }

    MarketPrice.find(findArgs)
        .sort([[sortBy, order]])
        .skip(offset)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Collectibles not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
    }

exports.getMarketPlaceDataBySearchMyComics = (req,res) => {
    let ids = req.body.ids ? req.body.ids : null
    let order = req.body.order ? req.body.order : "desc"
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id"
    let limit = req.body.limit ? parseInt(req.body.limit) : 15
    let offset = req.body.offset ? parseInt(req.body.offset) : 0
    let findArgs = {}
    if (req.body.filters.name && req.body.filters.name.length > 0){
        findArgs = {
            "$or": [
                { "name": { '$regex': req.body.filters.name, '$options': 'i' } },
                { "brand.name": { '$regex': req.body.filters.name, '$options': 'i' } },
                { "uniqueCoverId" : {"$in": ids } }
            ]
        }
    } else {
        findArgs = {
            "$or": [
                { "uniqueCoverId" : {"$in": ids } }
            ]
        }
    }

    ComicPrice.find(findArgs)
        .sort([[sortBy, order]])
        .skip(offset)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                console.log('Error is: ', err)
                return res.status(400).json({
                    error: "Collectibles not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
}

exports.getMarketPlaceDataBySearchMyCollectibles = (req,res) => {
    let ids = req.body.ids ? req.body.ids : null
    let order = req.body.order ? req.body.order : "desc"
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id"
    let limit = req.body.limit ? parseInt(req.body.limit) : 15
    let offset = req.body.offset ? parseInt(req.body.offset) : 0
    let findArgs = {}
    if (req.body.filters.name && req.body.filters.name.length > 0){
        findArgs = {
            "$or": [
                { "name": { '$regex': req.body.filters.name, '$options': 'i' } },
                { "brand.name": { '$regex': req.body.filters.name, '$options': 'i' } },
                { "collectibleId" : {"$in": ids } }
            ]
        }
    } else {
        findArgs = {
            "$or": [
                { "collectibleId" : {"$in": ids } }
            ]
        }
    }

    MarketPrice.find(findArgs)
        .sort([[sortBy, order]])
        .skip(offset)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                console.log('Error is: ', err)
                return res.status(400).json({
                    error: "Collectibles not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
}

exports.getMarketplaceData = (req,res) => {
    console.log(req, res, 'wtf')
    let limit = req.body.limit ? parseInt(req.body.limit) : 15
    let offset = req.body.offset ? parseInt(req.body.offset) : 0

    MarketPrice.find()
        .sort({ createdAt: -1 })
        .populate('history')
        .skip(offset)
        .limit(limit)
        .exec((err, data) => {
        if (err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
            size: data.length,
            data
        })
    })
}

exports.getSingleMarketCollectibleData = (req,res) => {

    const slug = req.params.slug

    MarketPrice.find({ collectibleId: slug }).exec((err, data) => {
        if (err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data)
    })
}

exports.getSingleMarketCollectibleStatistics = (req,res) => {

    const slug = req.params.slug

    MarketPrice.find({ collectibleId: slug })
        .exec((err, data) => {
        if (err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data)
    })
}

exports.getFloorPriceById = (req,res) => {
    const slug = req.params.slug

    MarketPrice.find({ collectibleId: slug})
        .select('metrics updatedAt totalListings issueNumber')
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(data)
        })
}

exports.getCollectibleChangeSummary = (req,res) => {
    const slug = req.params.slug
    MarketPriceHistoric.find({ collectibleId: slug })
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            const currentPrice = data[0].history[0] ? data[0].history[0].value : 0
            const calcThis = (endDay) => {
                return endDay
            }
            const results = {
                "docid": data[0]._id,
                "collectibleId": data[0].collectibleId,
                "currentPrice": currentPrice,
                "one_day_change": data[0].history[23] ? calcThis(data[0].history[23].value) : null,
                "one_week_change": data[0].history[161] ? calcThis(data[0].history[161].value) : null,
                "one_month_change": data[0].history[644] ? calcThis(data[0].history[961].value) : null,
                "three_month_change": data[0].history[1932] ? calcThis(data[0].history[1932].value) : null,
                "six_month_change": data[0].history[3864] ? calcThis(data[0].history[3864].value) : null,
                "one_year_change": data[0].history[7728] ? calcThis(data[0].history[7728].value) : null
            }
            res.json(results)
        })
}

exports.getMarketplaceComicData = (req,res) => {
    ComicPrice.find()
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(data)
        })
}

exports.getMarketPriceComicHistoricData = (req,res) => {
    const slug = req.params.slug

    MarketComicPriceHistoric.aggregate([
        {
            "$match": {
                uniqueCoverId: slug,
                "history.date": {
                    $gte: new Date(new Date().getTime() - (24 * 60 * 60 * 1000))
                }
            }
        },
        {
            "$set": {
                "history": {
                    "$filter": {
                        "input": "$history",
                        "as": "h",
                        "cond": {
                            $gte: [
                                "$$h.date",
                                new Date(new Date().getTime() - (24 * 60 * 60 * 1000))
                            ]
                        }
                    }
                }
            }
        }
    ]).exec((err, data) => {
        if (err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data)
    })
}

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

exports.getUserGrowthData = (req,res) => {
    UserCount.find().exec((err, data) => {
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
            data[0].revenue.reverse()
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
        .select('name squareImage slug revenue')
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            let dataBlob = []
            data.map((brand) => {
                const dataBlobObj = {
                    ...brand
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
                const dataBlobObj = {
                    "name": collectible.name,
                    "revenueRealised": collectible.revenue.realised
                }
                dataBlob.push(dataBlobObj)
            })
            res.json(dataBlob)
        })
}

exports.getCollectiblesValuation = (req,res) => {

    const usersCollectibles = req.body.collectibles
    let collectiblesArr = []
    if (usersCollectibles <= 0){ return res.json({})}
    usersCollectibles.map(collectible => {
        collectiblesArr.push(collectible.collectibleId)
    })

    let valuation = 0
    let retailPrice = 0
    let quantity = 1
    MarketPrice.find({collectibleId: { $in : collectiblesArr } })
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            data.map((value) => {
                const pluckIt = usersCollectibles.filter(collectible => (collectible.collectibleId) === value.collectibleId)
                valuation += value.metrics.lowestPrice * pluckIt[0].quantity
                retailPrice += value.storePrice * pluckIt[0].quantity
            })
            res.json({
                valuation: valuation.toFixed(2),
                retailPrice: retailPrice.toFixed(2)
            })
        })
}

exports.getComicsValuation = (req,res) => {
    const usersComics = req.body.comics
    let comicsArr = []
    usersComics.map(comic => {
        comicsArr.push(comic.uniqueCoverId)
    })

    let valuation = 0
    let retailPrice = 0
    let quantity = 1
    ComicPrice.find({ uniqueCoverId: {$in : comicsArr }})
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            data.map((value) => {
                const pluckIt = usersComics.filter(comic => (comic.uniqueCoverId) === value.uniqueCoverId)
                valuation += value.metrics.lowestPrice * pluckIt[0].quantity
                retailPrice += value.storePrice * pluckIt[0].quantity
            })

            res.json({
                valuation,
                retailPrice
            })
        })
}