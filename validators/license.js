const { check } = require('express-validator')

exports.licenseCreateValidator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Name is required')
]