const schedule = require('node-schedule');
const { getOmiPrice } = require('./getOmiPrice.js')

exports.scheduledOmiUpdater = () => {
    schedule.scheduleJob("*/9 * * * *", () => {
        getOmiPrice()
    });
}