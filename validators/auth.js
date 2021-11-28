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

exports.forgotPasswordValidator = (req,res,next) => {
    req.check('email', 'Please enter a valid email.')
        .notEmpty()
        .matches(/.+@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({
            min: 4,
            max: 32
        });

    const errors = req.validationErrors();
    if (errors){
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError })
    }
    next();
};

exports.resetPasswordValidator = (req,res,next) => {
    req.check('newPassword', 'Password is required.').notEmpty();
    req.check('newPassword')
        .isLength({ min: 6})
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number.');

    const errors = req.validationErrors();
    if (errors){
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError })
    }
    next();
};