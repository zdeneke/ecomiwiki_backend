const Collectible = require('../../models/collectibles/collectible')
const formidable = require('formidable')
const slugify = require('slugify')
const stripHtml = require('string-strip-html')
const _ = require('lodash')
const { errorHandler } = require('../../helpers/dbErrorHandler')
const fs = require('fs')
const { smartTrim } = require('../../helpers/blog')

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
            title,
            listPrice,
            body,
            dropDate,
            rarity,
            editions,
            editionType,
            license,
            series,
            description,
            veveImage,
            eiImage,
            brand
        } = fields

        if (!title || !title.length){
            return res.status(400).json({
                error: 'Title is required'
            })
        }

        if (!body || body.length < 50){
            return res.status(400).json({
                error: 'Content is too short. Write some more?'
            })
        }
        let collectible = new Collectible()
        collectible.title = title
        collectible.body = body
        collectible.slug = slugify(title).toLowerCase()
        collectible.mtitle = `${title} | ${process.env.APP_NAME}`
        collectible.mdesc = description
        collectible.veveImage = veveImage
        collectible.eiImage = eiImage
        collectible.brand = brand
        collectible.dropDate = dropDate
        collectible.rarity = rarity
        collectible.editions = editions
        collectible.editionType = editionType
        collectible.license = license
        collectible.series = series
        collectible.listPrice = listPrice
        //collectible.excerpt = smartTrim(excerpt, 320, ' ','...')
        collectible.author = req.user._id

        if (files.photo) {
            if (files.photo.size > 10000000 ){
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size.'
                })
            }
            collectible.photo.data = fs.readFileSync(files.photo.path)
            collectible.photo.contentType = files.photo.type
        }


        collectible.save((err, result) => {
            console.log('Error is: ', err)
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(result)
        })
    })
}

exports.listAllCollectibles = (req,res) => {
    Collectible.find({})
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

exports.list = (req,res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10
    let offset = req.body.offset ? parseInt(req.body.offset) : 0

    Collectible.find({})
        .sort({ dropDate: -1 })
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
    const slug = req.params.slug.toLowerCase()

    Collectible.findOne({ _id: slug })
        .populate('brand', '_id name, slug')
        .populate('license', '_id name, slug')
        .populate('author', '_id name username')
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(data)
        })
}


exports.getCollectibleBySlug = (req,res) => {
    const slug = req.params.slug.toLowerCase()

    Collectible.findOne({ slug })
        .populate('brand', '_id name, slug')
        .populate('license', '_id name, slug')
        .populate('author', '_id name username')
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
    Collectible.findOneAndRemove({ slug })
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json({
                message: 'Collectible deleted successfully.'
            })
        })

}

exports.update = (req,res) => {
    const slug = req.params.slug.toLowerCase()

    Collectible.findOne({slug})
        .exec((err, oldCollectible) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }

            let form = new formidable.IncomingForm()
            form.keepExtensions = true

            form.parse(req, (err, fields, files) => {
                if (err){
                    return res.status(400).json({
                        error: 'Image could not upload'
                    })
                }

                let slugBeforeMerge = oldCollectible.slug
                oldCollectible = _.merge(oldCollectible, fields)
                oldCollectible.slug = slugBeforeMerge

                const { title, listPrice, body, dropDate, rarity, editions, editionType, license, series, description, veveImage, eiImage, brand } = fields

                if (body){
                    oldCollectible.desc = stripHtml(body.substr(0, 160))
                }

                // if (files.photo) {
                //     if (files.photo.size > 10000000 ){
                //         return res.status(400).json({
                //             error: 'Image should be less than 1mb in size.'
                //         })
                //     }
                //     oldCollectible.photo.data = fs.readFileSync(files.photo.path)
                //     oldCollectible.photo.contentType = files.photo.type
                // }

                oldCollectible.save((err, result) => {
                    if (err){
                        return res.status(400).json({
                            error: errorHandler(err)
                        })
                    }
                    res.json(result)
                })
            })

        })

}

exports.listBySearch = (req, res) => {
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

    Collectible.find(findArgs)
        .sort([[sortBy, order]])
        .skip(offset)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

exports.getLatestCollectibles = (req,res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10
    let offset = req.body.offset ? parseInt(req.body.offset) : 0

    Collectible.find({})
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


// exports.photo = (req,res) => {
//     const slug = req.params.slug.toLowerCase()
//
//     Collectible.findOne({ slug })
//         .select('photo')
//         .exec((err, blog) => {
//             if (err || !blog){
//                 return res.status(400).json({
//                     error: errorHandler(err)
//                 })
//             }
//             res.set('Content-Type', blog.photo.contentType)
//             return res.send(blog.photo.data)
//         })
// }

// exports.listRelated = (req,res) => {
//     let limit = req.body.limit ? parseInt(req.body.limit) : 3
//     const { _id, categories } = req.body.blog
//
//     Collectible.find({
//         _id: {$ne: _id },
//         categories: {$in: categories}
//     })
//         .limit(limit)
//         .populate('author', '_id name profile')
//         .select('title slug author createdAt updatedAt')
//         .exec((err, blogs) => {
//             if (err){
//                 return res.status(400).json({
//                     error: 'No blogs were found.'
//                 })
//             }
//             res.json(blogs)
//         })
// }
//
// exports.listSearch = (req,res) => {
//     const { search } = req.query
//     if (search){
//         Collectible.find({
//             $or: [
//                 {title: {$regex: search, $options: 'i'}},
//                 {body: {$regex: search, $options: 'i'}}
//             ]
//         }, (err, blogs) => {
//             if (err){
//                 return res.status(400).json({
//                     error: errorHandler(err)
//                 })
//             }
//             res.json(blogs)
//         }).select('-photo -body')
//     }
// }