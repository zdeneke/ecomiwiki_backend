const Post = require('../../models/social/Post')
const stripHtml = require('string-strip-html')
const { errorHandler } = require('../../helpers/dbErrorHandler')

const formidable = require('formidable')

exports.create = (req,res) => {

    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (err){
            return res.status(400).json({
                error: 'Image could not upload'
            })
        }

        const { body } = fields

        if (!body){
            return res.status(400).json({
                error: 'Post is too short'
            })
        }

        let post = new Post()
        post.body = body
        post.user = req.user._id

        if (files.photo){
            if (files.photo.size > 10000000 ){
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size.'
                })
            }
            post.photo.data = fs.readFileSync(files.photo.path)
            post.photo.contentType = files.photo.type
        }

        post.save((err, result) => {
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

    Post.find()
        .sort({ date: -1 })
        .populate('user', '_id name username')
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(data)
        })

}

exports.read = (req,res) => {

    Post.findById(req.params.id)
        .populate('user', '_id name username')
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

    Post.findById(req.params.id)
        .populate('user', '_id name username')
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            if (data.user._id.toString() !== req.user._id){
                return res.status(401).json({ msg: 'User not authorised'})
            }
            data.remove()
            res.json({ msg: 'Post removed'})
        })

}

exports.likePost = (req,res) => {

    Post.findById(req.params.id)
        .populate('user', '_id name username')
        .exec((err, post) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            if (post.likes.filter(like => like.user._id.toString() === req.user._id).length > 0){
                return res.status(400).json({
                    error: 'Post already liked.'
                })
            }
            post.likes.unshift({ user: req.user._id})
            post.save((err, success) => {
                if (err){
                    return res.status(400).json({
                        error: errorHandler(err)
                    })
                }
                res.json(post.likes)
            })
        })

}

exports.unlikePost = (req,res) => {

    Post.findById(req.params.id)
        .populate('user', '_id name username')
        .exec((err, post) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            if (post.likes.filter(like => like.user._id.toString() === req.user._id).length === 0){
                return res.status(400).json({
                    error: 'Post has not yet been liked.'
                })
            }
            // post.likes.unshift({ user: req.user._id})
            const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user._id)
            post.likes.splice(removeIndex, 1)

            post.save((err, success) => {
                if (err){
                    return res.status(400).json({
                        error: errorHandler(err)
                    })
                }
                res.json(post.likes)
            })
        })

}

exports.addComment = (req,res) => {
    Post.findById(req.params.id)
        .exec((err, post) => {

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

                const { body } = fields

                if (!body){
                    return res.status(400).json({
                        error: 'Comment is too short'
                    })
                }

                const newComment = {
                    user: req.user._id,
                    body: body,
                }

                post.comments.unshift(newComment)

                if (files.photo){
                    if (files.photo.size > 10000000 ){
                        return res.status(400).json({
                            error: 'Image should be less than 1mb in size.'
                        })
                    }
                    post.photo.data = fs.readFileSync(files.photo.path)
                    post.photo.contentType = files.photo.type
                }

                post.save((err, success) => {
                    console.log('Success: ', success)
                    if (err){
                        return res.status(400).json({
                            error: errorHandler(err)
                        })
                    }
                    res.json(post.comments)
                })

            })
        })
}

exports.removeComment = (req,res) => {
    Post.findById(req.params.id)
        .populate('user', '_id name username')
        .exec((err, post) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }

            const comment = post.comments.find(comment => comment.id === req.params.comment_id)

            if (!comment){
                return res.status(404).json({
                    error: 'Comment does not exist.'
                })
            }

            if (comment.user.toString() !== req.user._id){
                return res.status(401).json({
                    error: 'User not authorised.'
                })
            }

            const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user._id)
            post.comments.splice(removeIndex, 1)

            post.save((err, success) => {
                if (err){
                    return res.status(400).json({
                        error: errorHandler(err)
                    })
                }
                res.json(post.comments)
            })

        })
}