const Team = require('../../models/team/team')
const formidable = require('formidable')
const slugify = require('slugify')
const stripHtml = require('string-strip-html')
const _ = require('lodash')
const { errorHandler } = require('../../helpers/dbErrorHandler')
const fs = require('fs')

exports.create = (req,res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req,(err, fields, files) => {
        if (err){
            return res.status(400).json({
                error: 'Image could not upload'
            })
        }
        const { name, title, body } = fields

        console.log('Team form fields are: ', fields)

        if (!title || !title.length){
            return res.status(400).json({
                error: 'Title is required'
            })
        }

        if (!body || body.length < 200){
            return res.status(400).json({
                error: 'Content is too short. Write some more?'
            })
        }

        let staff = new Team()
        staff.name = name
        staff.title = title
        staff.body = body
        staff.slug = slugify(name).toLowerCase()
        staff.author = req.user._id

        if (files.photo) {
            if (files.photo.size > 10000000 ){
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size.'
                })
            }
            staff.photo.data = fs.readFileSync(files.photo.path)
            staff.photo.contentType = files.photo.type
        }

        staff.save((err, result) => {
            if (err){
                console.log('Error saving staff member: ', err)
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(result)
        })

    })
}

exports.list = (req,res) => {
    Team.find({})
        .populate('author', '_id name username')
        .select('_id name title photo vip slug author createdAt updatedAt')
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
    const slug = req.params.slug.toLowerCase()

    Team.findOne({ slug })
        .populate('author', '_id name username')
        .select('_id name title body slug author createdAt updatedAt')
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
    Team.findOneAndRemove({ slug })
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json({
                message: 'Team member deleted successfully.'
            })
        })
}

exports.update = (req, res) => {
    const slug = req.params.slug.toLowerCase()

    Team.findOne({ slug })
        .exec((err, oldTeam) => {
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
                        error: 'Image could not upload.'
                    })
                }

                let slugBeforeMerge = oldTeam.slug
                oldTeam = _.merge(oldTeam, fields)
                oldTeam.slug = slugBeforeMerge

                const { body, name, title } = fields

                if (files.photo){
                    if (files.photo.size > 10000000){
                        return res.status(400).json({
                            error: 'Image should be less than 1mb in size.'
                        })
                    }
                    oldTeam.photo.data = fs.readFileSync(files.photo.path)
                    oldTeam.photo.contentType = files.photo.type
                }

                oldTeam.save((err, result) => {
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

exports.photo = (req,res) => {
    const slug = req.params.slug.toLowerCase()

    Team.findOne({ slug })
        .select('photo')
        .exec((err, member) => {
            if (err || !member){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.set('Content-Type', member.photo.contentType)
            return res.send(member.photo.data)
        })
}