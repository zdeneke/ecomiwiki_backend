const Brand = require('../../models/brands/brand')
const slugify = require('slugify')
const Collectible = require('../../models/collectibles/collectible')
const { errorHandler } = require('../../helpers/dbErrorHandler')

exports.create = (req,res) => {
    const { name, license } = req.body
    let slug = slugify(name).toLowerCase()

    let brand = new Brand({ name, license, slug })

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
            Collectible.find({"brand.id": brand._id})
                .populate('brand', '_id name slug')
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
    let limit = req.body.limit ? parseInt(req.body.limit) : 10
    let offset = req.body.offset ? parseInt(req.body.offset) : 0

    Brand.find({})
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

exports.getBrandPhoto = (req,res) => {
    const slug = req.params.slug

    Brand.findById(slug)
        .select('squareImage')
        .exec((err, data) => {
            if (err){
                res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(data)
        })

}

exports.getLatestBrands = (req,res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10
    let offset = req.body.offset ? parseInt(req.body.offset) : 0

    Brand.find({})
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

exports.listAllBrands = (req,res) => {
    console.log('hit')
    Brand.find({})
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