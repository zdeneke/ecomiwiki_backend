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
    fetch(`${process.env.ALICE}ecomi/marketplace`,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            offset: props
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




