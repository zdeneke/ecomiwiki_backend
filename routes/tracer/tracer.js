const express = require('express')
const router = express.Router()
const fs = require('fs')

const getIP = (req) => {
    // req.connection is deprecated
    const conRemoteAddress = req.connection.remoteAddress
    // req.socket is said to replace req.connection
    const sockRemoteAddress = req.socket.remoteAddress
    // some platforms use x-real-ip
    const xRealIP = req.headers['x-real-ip']
    // most proxies use x-forwarded-for
    const xForwardedForIP = (() => {
        const xForwardedFor = req.headers['x-forwarded-for']
        if (xForwardedFor) {
            // The x-forwarded-for header can contain a comma-separated list of
            // IP's. Further, some are comma separated with spaces, so whitespace is trimmed.
            const ips = xForwardedFor.split(',').map(ip => ip.trim())
            return ips[0]
        }
    })()
    // prefer x-forwarded-for and fallback to the others
    return xForwardedForIP || xRealIP || sockRemoteAddress || conRemoteAddress
}
router.get('/tracer', (req,res) => {
    const date = Date.now()
    fs.writeFileSync('./trace.txt', `trace is ${getIP(req)}. Date is: ${date}`, { flag: 'a+' }, err => {
        if (err) {
            console.error(err)
            return
        }
        //file written successfully
        console.log('Logged it.', getIP(req))
    })
    return res.json({
        ip: getIP(req)
    })
})

module.exports = router