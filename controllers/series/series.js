const Collectible = require('../../models/collectibles/collectible')
const ComicPrice = require('../../models/metrics/ComicPrice')
const { errorHandler } = require('../../helpers/dbErrorHandler')

exports.collectibleSerieslist = (req,res) => {
    const seriesId = req.params.slug

    Collectible.find({ 'series.id': seriesId })
        .sort({ dropDate: -1 })
        .select('series.name slug storePrice brand name rarity image dropDate licensor.name')
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(data)
        })
}

exports.comicSerieslist = (req,res) => {
    const seriesId = req.params.slug

    ComicPrice.find({ 'comicSeries.id': seriesId })
        .sort({ dropDate: -1 })
        .select('comicSeries.name name comicNumber totalIssued totalAvailable cover.rarity cover.image.thumbnailUrl cover.image.name dropDate metrics')
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(data)
        })
}