const express = require('express')
const router = express.Router()
const { signup, signin, signout, forgotPassword, resetPassword, requireSignin } = require('../../controllers/auth/auth')

// Validators
const {runValidation} = require('../../validators')
const {userSignupValidator, userSigninValidator, forgotPasswordValidator, resetPasswordValidator} = require('../../validators/auth')

// Signup
router.post('/signup', userSignupValidator, runValidation, signup)

// Signin
router.post('/signin', userSigninValidator, runValidation, signin)

// Signout
router.get('/signout', signout)

// Forgot/Reset password
router.put('/forgot-password', forgotPasswordValidator, forgotPassword)

router.put('/reset-password', resetPasswordValidator, resetPassword)

// Test
router.get('/secret', requireSignin, (req,res) => {
    res.json({
        user: req.user
    })
})
module.exports = router