const Brand = require('../../models/collectibles/brand')
const slugify = require('slugify')
const Collectible = require('../../models/collectibles/collectible')
const { errorHandler } = require('../../helpers/dbErrorHandler')

exports.create = (req,res) => {
    const { name } = req.body
    let slug = slugify(name).toLowerCase()

    let brand = new Brand({ name, slug })

    brand.save((err,data) => {
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

    Brand.findOne({ slug })
        .exec((err, brand) => {
            if (err){
                res.status(400).json({
                    error: errorHandler(err)
                })
            }
            Collectible.find({brand: brand})
                .populate('brand', '_id name slug')
                .populate('author', '_id name')
                .select('_id title slug brand author eiImage veveImage rarity editions license series createdAt updatedAt')
                .exec((err, data) => {
                    if (err){
                        res.status(400).json({
                            error: errorHandler(err)
                        })
                    }
                    res.json({
                        brand,
                        collectibles: data
                    })
                })
        })
}

exports.list = (req,res) => {
    Brand.find({})
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

    Brand.findOneAndRemove({ slug })
        .exec((err, data) => {
            if (err){
                res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json({
                message: 'Brand removed successfully.'
            })
        })
}