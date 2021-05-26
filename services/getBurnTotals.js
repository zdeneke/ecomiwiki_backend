const omiBurn = require('../models/metrics/omiBurn');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');


exports.getBurnTotals = () => {

    puppeteer
        .launch()
        .then(browser => browser.newPage())
        .then(page => {
            return page.goto('https://token.veve.me').then(() => {
                return page.waitForFunction('document.querySelector(".jss42").innerText.length > 3')
            }).then(() => { return page.content()});
        })
        .then(html => {

            // Grab the burn wallet number
            const $ = cheerio.load(html);
            const balance = $('.jss42').text();
            console.log('Balance grabbed is: ', balance)
            const burnWalletBalance = parseFloat(balance.replace(/,/g, ''))

            // Get previous burn wallet balance
            let previousBurnWalletBalance;

            omiBurn.find((err, doc) => {
                previousBurnWalletBalance = doc[0].burnWalletBalance
                console.log('Previous burn wallet balance: ', previousBurnWalletBalance)
            })
                .then(() => {
                    // Calculate the daily burn (new burn wallet balance - previous burn wallet balance
                    const burnt = burnWalletBalance - previousBurnWalletBalance
                    console.log('Amount burnt is: ', burnt)

                    // Save values in the db
                    omiBurn.findOneAndUpdate(
                        { _id: '60a78407e85ab38f01d7a7b7'},
                        {
                            'burnWalletBalance': burnWalletBalance,
                            $push: {
                                'burns': {
                                    value: burnt,
                                    date: new Date()
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
                })


        })
        .catch(console.error);

}