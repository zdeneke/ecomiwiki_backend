const { errorHandler } = require('../../helpers/dbErrorHandler')
require('isomorphic-fetch');
require('dotenv').config()

exports.listNewArrivals = (req,res) => {

    console.log('Getting new arrivals..')

    //const offset = req.body.offset

    fetch(`${process.env.ALICE}ecomi/store/new-arrivals`,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        })
        .then(data => {
            console.log('New arrivals res: ', data)
            res.json(data.data.newArrivals)
        })
}