const Collectible = require('../../models/collectibles/collectible')
const { errorHandler } = require('../../helpers/dbErrorHandler')

exports.list = (req,res) => {
    const seriesId = req.params.slug

    Collectible.find({ 'series.id': seriesId })
        .sort({ dropDate: -1 })
        .select('series.name name rarity image dropDate')
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(data)
        })
}