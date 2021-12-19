const Comic = require('../../models/comics/comic')
const ComicPrice = require('../../models/metrics/ComicPrice')
const formidable = require('formidable')
const slugify = require('slugify')
const stripHtml = require('string-strip-html')
const _ = require('lodash')
const { errorHandler } = require('../../helpers/dbErrorHandler')
const fs = require('fs')
const { smartTrim } = require('../../helpers/blog')

// exports.create = (req,res) => {
//     let form = new formidable.IncomingForm()
//     form.keepExtensions = true
//     form.parse(req, (err, fields, files) => {
//         if (err){
//             return res.status(400).json({
//                 error: 'Image could not upload'
//             })
//         }
//         const {
//             title,
//             listPrice,
//             body,
//             dropDate,
//             rarity,
//             editions,
//             editionType,
//             license,
//             series,
//             description,
//             veveImage,
//             eiImage,
//             brand
//         } = fields
//
//         if (!title || !title.length){
//             return res.status(400).json({
//                 error: 'Title is required'
//             })
//         }
//
//         if (!body || body.length < 50){
//             return res.status(400).json({
//                 error: 'Content is too short. Write some more?'
//             })
//         }
//         let comic = new Comic()
//         comic.title = title
//         comic.body = body
//         comic.slug = slugify(title).toLowerCase()
//         comic.mtitle = `${title} | ${process.env.APP_NAME}`
//         comic.mdesc = description
//         comic.veveImage = veveImage
//         comic.eiImage = eiImage
//         comic.brand = brand
//         comic.dropDate = dropDate
//         comic.rarity = rarity
//         comic.editions = editions
//         comic.editionType = editionType
//         comic.license = license
//         comic.series = series
//         comic.listPrice = listPrice
//         //comic.excerpt = smartTrim(excerpt, 320, ' ','...')
//         comic.author = req.user._id
//
//         if (files.photo) {
//             if (files.photo.size > 10000000 ){
//                 return res.status(400).json({
//                     error: 'Image should be less than 1mb in size.'
//                 })
//             }
//             comic.photo.data = fs.readFileSync(files.photo.path)
//             comic.photo.contentType = files.photo.type
//         }
//
//
//         comic.save((err, result) => {
//             console.log('Error is: ', err)
//             if (err){
//                 return res.status(400).json({
//                     error: errorHandler(err)
//                 })
//             }
//             res.json(result)
//         })
//     })
// }

exports.list = (req,res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10
    let offset = req.body.offset ? parseInt(req.body.offset) : 0

    Comic.find({})
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

    ComicPrice.findOne({ "uniqueCoverId": slug })
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(data)
        })
}

exports.getSingleComicSeo = (req,res) => {
    const slug = req.params.slug.toLowerCase()

    ComicPrice.findOne({ slug: slug })
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            console.log('data is: ', data)
            res.json(data)
        })
}

exports.remove = (req,res) => {
    const slug = req.params.slug.toLowerCase()
    Comic.findOneAndRemove({ slug })
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json({
                message: 'Comic deleted successfully.'
            })
        })

}

exports.update = (req,res) => {
    const slug = req.params.slug.toLowerCase()

    Comic.findOne({slug})
        .exec((err, oldComic) => {
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

                let slugBeforeMerge = oldComic.slug
                oldComic = _.merge(oldComic, fields)
                oldComic.slug = slugBeforeMerge

                const { title, listPrice, body, dropDate, rarity, editions, editionType, license, series, description, veveImage, eiImage, brand } = fields

                if (body){
                    oldComic.desc = stripHtml(body.substr(0, 160))
                }

                // if (files.photo) {
                //     if (files.photo.size > 10000000 ){
                //         return res.status(400).json({
                //             error: 'Image should be less than 1mb in size.'
                //         })
                //     }
                //     oldComic.photo.data = fs.readFileSync(files.photo.path)
                //     oldComic.photo.contentType = files.photo.type
                // }

                oldComic.save((err, result) => {
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

exports.getLatestComics = (req,res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10
    let offset = req.body.offset ? parseInt(req.body.offset) : 0

    Comic.find({})
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


//             $or: [
//                 {title: {$regex: search, $options: 'i'}},
//                 {body: {$regex: search, $options: 'i'}}
//             ]

exports.listBySearch = (req,res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 15
    let offset = req.body.offset ? parseInt(req.body.offset) : 0
    let findArgs = {}

    if (req.body.filters.name && req.body.filters.name.length > 0){
        findArgs = {
            "$or": [
                { "title": { '$regex': req.body.filters.name, '$options': 'i' } },
            ]
        }
    }

    // Dont use comic use the marketprice/comic thing - look at github.
    Comic.find(findArgs)
        .sort([[sortBy, order]])
        .skip(offset)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Comics not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

// exports.photo = (req,res) => {
//     const slug = req.params.slug.toLowerCase()
//
//     Comic.findOne({ slug })
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
//     Comic.find({
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
//         Comic.find({
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