const { errorHandler } = require('../../helpers/dbErrorHandler')
require('isomorphic-fetch');
require('dotenv').config()

exports.listNewArrivals = (req,res) => {
    console.log('Req Body is: ', req.body.props)

    const offset = req.body.props
    console.log('Offset is: ', offset)

    fetch(`${process.env.ALICE}ecomi/store/new-arrivals?offset=${offset}`,{
        method: "POST",
        headers: {
            Accept: 'application/json',
            "Content-Type": "application/json"
        },
        body: offset
    })
        .then(response => {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        })
        .then(data => {
            res.json(data.data.newArrivals)
        })
}