const License = require('../../models/license/license')
const slugify = require('slugify')
const Collectible = require('../../models/collectibles/collectible')
const Brands = require('../../models/brands/brand')
const { errorHandler } = require('../../helpers/dbErrorHandler')

exports.create = (req,res) => {
    const { name } = req.body
    let slug = slugify(name).toLowerCase()
    let license = new License({ name, slug })

    license.save((err,data) => {
        if (err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data)
    })
}

exports.read = (req,res) => {
    const slug = req.params.slug.toLowerCase()

    License.findOne({ slug })
        .exec((err, license) => {
            if (err){
                res.status(400).json({
                    error: errorHandler(err)
                })
            }
            Collectible.find({"licensor.id": license._id})
                .populate('license', '_id name slug')
                .exec((err, data) => {
                    if (err){
                        res.status(400).json({
                            error: errorHandler(err)
                        })
                    }
                    res.json({
                        license,
                        collectibles: data
                    })
                })
        })
}

exports.list = (req,res) => {
    License.find({})
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(data)
        })
}

exports.remove = (req,res) => {
    const slug = req.params.slug.toLowerCase()

    License.findOneAndRemove({ slug })
        .exec((err, data) => {
            if (err){
                res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json({
                message: 'License removed successfully.'
            })
        })
}

exports.getLatestLicenses = (req,res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10
    let offset = req.body.offset ? parseInt(req.body.offset) : 0

    License.find({})
        .sort({ createdAt: -1 })
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