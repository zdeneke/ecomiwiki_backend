const express = require('express')
const router = express.Router()
const apicache = require('apicache')
const {
    create,
    list,
    read,
    remove,
    update,
} = require('../../controllers/community/veveartshow')
const { requireSignin, adminMiddleware } = require('../../controllers/auth/auth')

let cache = apicache.middleware

router.post('/veveartshow/prize', create)
router.post('/veveartshow/prizes', list)
router.get('/veveartshow/prize/:slug', read)
router.delete('/veveartshow/prize/:slug', requireSignin, adminMiddleware, remove)
router.put('/veveartshow/prize/:slug', requireSignin, adminMiddleware, update)

module.exports = router