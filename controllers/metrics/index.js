const omiPrice = require('../../models/metrics/omiPrice')
const { errorHandler } = require('../../helpers/dbErrorHandler')

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