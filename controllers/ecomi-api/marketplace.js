const { errorHandler } = require('../../helpers/dbErrorHandler')
require('isomorphic-fetch');
require('dotenv').config()

exports.read = (req,res) => {
    const slug = req.params.slug
    fetch(`${process.env.ALICE}ecomi/marketplace/listing/${slug}`)
        .then(response => {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        })
        .then(data => {
            res.json(data.data.user)
        })
}

exports.list = (req,res) => {

    const offset = req.body.offset

    fetch(`${process.env.ALICE}ecomi/marketplace`,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            offset
        })
    })
        .then(response => {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        })
        .then(data => {
            res.json(data.data.marketListingList)
        })
}




