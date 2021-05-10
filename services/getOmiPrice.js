const fetch = require('node-fetch')
const omiPrice = require('../models/metrics/omiPrice');

exports.getOmiPrice = () => {
    fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=omi', {
        method: 'GET',
        headers: {
            'X-CMC_PRO_API_KEY': 'c867dd02-79fe-449c-8e65-02040c1534fd',
            'Accepts': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {

            omiPrice.findOneAndUpdate(
                {'_id': '6099a4a88ccea450904c7771'},
                {
                    'price.currentPrice': data.data.OMI.quote.USD.price,
                    'price.percent_change_1h' : data.data.OMI.quote.USD.percent_change_1h,
                    'price.percent_change_7d' : data.data.OMI.quote.USD.percent_change_7d,
                    'price.percent_change_24h' : data.data.OMI.quote.USD.percent_change_24h,
                    'price.percent_change_30d' : data.data.OMI.quote.USD.percent_change_30d,
                    'price.percent_change_60d' : data.data.OMI.quote.USD.percent_change_60d,
                    'price.percent_change_90d' : data.data.OMI.quote.USD.percent_change_90d,
                    'price.volume_24' : data.data.OMI.quote.volume_24h,
                    circulating_supply : data.data.OMI.circulating_supply,
                    cmc_rank : data.data.OMI.cmc_rank,
                    max_supply : data.data.OMI.max_supply,
                    num_market_pairs : data.data.OMI.num_market_pairs,
                    total_supply : data.data.OMI.total_supply,
                    market_cap : data.data.OMI.market_cap
                },
                {upsert: true},
                function (err, doc) {
                    if (err){
                        console.log('Error updating OMI metrics.')
                    } else {
                        console.log('OMI metrics successfully updated.')
                    }
                }
            );
        })
        .catch(e => console.log('Failed to fetch:', e))
}