const User = require('../../models/auth/user')

// Read user profile
exports.read = (req,res) => {
    req.profile.hashed_password = undefined
    return res.json(req.profile)
}

// Update user collection
exports.updateMyCollection = (req,res) => {
    const userId = req.params.slug
    User.findByIdAndUpdate(
        {_id: userId},
        {$set: {
            'userCollection': req.body
            }},
        {new: true},
        (err, user) => {
            if (err){
                console.log('Error is: ', err)
                return res.status(400).json({
                    error: 'Something went adding the collectibles.'
                })
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user)
        }
    )
}

exports.updateMyComics = (req,res) => {
    const userId = req.params.slug
    User.findByIdAndUpdate(
        {_id: userId},
        {$set: {
                'userComics': req.body
            }},
        {new: true},
        (err, user) => {
            if (err){
                console.log('Error is: ', err)
                return res.status(400).json({
                    error: 'Something went adding the comics.'
                })
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user)
        }
    )
}

// Update user valuation
exports.updateValuation = (req,res) => {
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        { new: true },
        (err, user) => {
            if (err){
                return res.status(400).json({
                    error: 'Unable to update the users valuation.'
                })
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user)
        }

    )
}

// Get users collectibles
exports.getUserCollectibles = (req,res) => {
    const userId = req.params.slug
    User.findById({_id: userId})
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    error: 'Unable to fetch users collectibles.'
                })
            }
            res.json({
                "collectibles": data.userCollection
            })
        })
}

// Get user comics
exports.getUserComics = (req,res) => {
    const userId = req.params.slug
    User.findById({_id: userId})
        .exec((err, data) => {
            if (err){
                return res.status(400).json({
                    error: 'Unable to fetch users comics.'
                })
            }
            res.json({
                "comics": data.userComics
            })
        })
}

// Update user
exports.update = (req,res) => {
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true},
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: 'You are not authorised to do this.'
                })
            }
            // Don't return the password.
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user)
        }
    );
};

