const formidable = require('formidable')
const Prize = require('../../../models/prizes/prize')

exports.create = (req,res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (err){
            return res.status(400).json({
                error: 'Image could not upload'
            })
        }

        const {
            collectibleId,
            category,
            donator,
            place,
            serial,
            uniqueCoverId
        } = fields

        let prize = new Prize()
        if (!collectibleId || !collectibleId.length){
            prize.uniqueCoverId = uniqueCoverId
        }
        if (!uniqueCoverId || !uniqueCoverId.length){
            prize.collectibleId = collectibleId
        }
        prize.category = category
        prize.donator = donator
        prize.place = place
        prize.serial = serial

        prize.save((err, result) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(result)
        })

    })
}

exports.list = (req,res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10
    let offset = req.body.offset ? parseInt(req.body.offset) : 0

    Prize.find({})
        .sort({ place: -1 })
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

exports.read = (req,res) => {

}

exports.remove = (req,res) => {

}

exports.update = (req,res) => {

}