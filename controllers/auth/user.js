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
            console.log('user collection data is: ', data)
            res.json({
                "collectibles": data.userCollection
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

