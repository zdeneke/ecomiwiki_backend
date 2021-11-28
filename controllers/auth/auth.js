const User = require('../../models/auth/user')
const shortId = require('shortid')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')

exports.signup = (req,res) => {
    User.findOne({ email: req.body.email })
        .exec((err, user) => {
            if (user){
                return res.status(400).json({
                    error: 'Email is already registered.'
                })
            }

            const { email, password } = req.body
            let username = shortId.generate()
            let profile = `${process.env.CLIENT_URL}/profile/${username}`

            let newUser = new User({ email, password, username, profile })

            newUser.save((err, success) => {
                console.log('ok saving...')
                if (err){
                    console.log('ok error...', err)
                    return res.status(400).json({
                        error: err
                    })
                }
                res.json({
                    message: 'Signup success! Please sign in.'
                })
            })
        })
}

exports.signin = (req,res) => {
    const { email, password } = req.body
    // Check if user exists
    User.findOne({ email })
        .exec((err, user) => {
            if (err || !user){
                return res.status(400).json({
                    error: "User with that email does not exist."
                })
            }
            // Authenticate
            if (!user.authenticate(password)){
                return res.status(400).json({
                    error: "Email and password do not match."
                })
            }
            // Generate token and send to client
            const token = jwt.sign({_id: user._id }, process.env.JWT_SECRET, {expiresIn: '1d'})

            res.cookie('token', token, { expiresIn: '1d' })

            const { _id, username, name, email, role } = user
            return res.json({
                token,
                user: { _id, username, name, email, role }
            })
        })
}

exports.signout = (req,res) => {
    res.clearCookie('token')
    res.json({
        message: 'Signout success'
    })
}

exports.forgotPassword = (req, res) => {
    const { email } = req.body;

    User.findOne({email}, (err, user) => {
        if (err || !user){
            return res.status(400).json({
                error: 'User with that email does not exist.'
            })
        }

        const token = jwt.sign({ _id: user._id, name: user.name}, process.env.JWT_RESET_PASSWORD, {expiresIn: '10m'});

        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Password reset',
            html: `
                <h1>Please use the following link to reset your password.</h1>
                <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                <hr />
                <p>This email may contain sensitive information.</p>
                <p>${process.env.CLIENT_URL}</p>
            `
        };

        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err){
                console.log('[ERROR]: Reset password link error');
                return res.status(400).json({
                    error: 'Database connection error.'
                })
            } else {
                // TODO: Sign up and setup sendgrid
                console.log(`Email sent to ${email}.`);
                console.log(`Reset link is:  ${process.env.CLIENT_URL}/auth/password/reset/${token}`);
                return res.json({
                    message: `Email has been sent to ${email}`
                })
                // sgMail
                //     .send(emailData)
                //     .then(sent => {
                //         return res.json({
                //             message: `Email has been sent to ${email}.`
                //         })
                //     })
                //     .catch(err => {
                //         return res.json({
                //             message: err.message
                //         })
                //     })
            }
        });

    })

};

exports.resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    if (resetPasswordLink){
        jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, (err, decodedData) => {
            if (err){
                return res.status(400).json({
                    error: 'The link you requested has expired.'
                })
            }

            User.findOne({ resetPasswordLink }, (err, user) => {
                if (err || !user) {
                    return res.status(400).json({
                        error: 'Oops, something went wrong. No user found.'
                    })
                }

                const updatedFields = {
                    password: newPassword,
                    resetPasswordLink: ''
                }

                user = _.extend(user, updatedFields);

                user.save((err, result) => {
                    if (err){
                        return res.status(400).json({
                            error: 'Oops something went wrong. Error updating user password.'
                        })
                    }
                    res.json({
                        message: 'Success! You can now log in with your new password.'
                    })
                });
            });
        })
    }
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "user",
})

exports.authMiddleware = (req,res,next) => {
    const authUserId = req.user._id
    User.findById({ _id: authUserId })
        .exec((err, user) => {
            if (err || !user){
                return res.status(400).json({
                    error: 'User not found'
                })
            }
            req.profile = user
            next()

        })
}

exports.adminMiddleware = (req,res,next) => {
    const adminUserId = req.user._id
    User.findById({ _id: adminUserId })
        .exec((err, user) => {
            if (err || !user){
                return res.status(400).json({
                    error: 'User not found'
                })
            }
            if (user.role !== 1){
                return res.status(400).json({
                    error: 'Admin resource. Access is denied.'
                })
            }
            req.profile = user
            next()
        })
}