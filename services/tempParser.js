const omiBurn = require('../models/metrics/omiBurn');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');


exports.parseHistoricalBurns = () => {

    let burnt;
    let date;

    oomiBurn.findOneAndUpdate(
        { _id: '60a78407e85ab38f01d7a7b7'},
        {
            $push: {
                'burns': {
                    value: burnt,
                    date: date
                }
            }
        },
        { new: true, upsert: true })
        .exec((err, data) => {
            if (err){
                return console.log('Error saving OMI burn metrics', err)
            }
            // Success
            console.log('OMI burn metrics successfully updated.')
        });

}