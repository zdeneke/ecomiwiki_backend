const { check } = require('express-validator')

exports.brandCreateValidator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Name is required')
]