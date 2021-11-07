const { check } = require('express-validator')

exports.userSignupValidator = [
    check('email')
        .isEmail()
        .withMessage('Email is required'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters in length')
]

exports.userSigninValidator = [
    check('email')
        .isEmail()
        .withMessage('Email is required'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters in length')
]
