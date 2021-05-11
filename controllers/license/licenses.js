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
            Brands.find({license: license})
                .populate('license', '_id name slug')
                .select('_id name slug license createdAt updatedAt')
                .exec((err, collectibles) => {
                    if (err){
                        res.status(400).json({
                            error: errorHandler(err)
                        })
                    }
                    res.json({
                        license,
                        collectibles: collectibles
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