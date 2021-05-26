const schedule = require('node-schedule');
const { getOmiPrice } = require('./getOmiPrice.js')
const { getBurnTotals } = require('./getBurnTotals')

exports.scheduledOmiUpdater = () => {
    schedule.scheduleJob("*/9 * * * *", () => {
        getOmiPrice()
    });
}

exports.scheduledBurnUpdater = () => {
    schedule.scheduleJob("0 0 * * *", () => {
        console.log('Getting burn totals')
        getBurnTotals()
    })
}