const { errorHandler } = require('../../helpers/dbErrorHandler')
require('isomorphic-fetch');
require('dotenv').config()

exports.read = (req,res) => {
    const slug = req.params.slug
    fetch(`${process.env.ALICE}ecomi/marketplace/listing/${slug}`, {
        method: "POST"
    })
        .then(response => {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        })
        .then(data => {
            res.json(data.data.marketListing)
        })
}

exports.list = (req,res) => {

    //const offset = req.body.offset

    fetch(`${process.env.ALICE}ecomi/marketplace`,{
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
            res.json(data.data.marketListingList)
        })
}

exports.getEndingSoonest = (req,res) => {
    fetch(`${process.env.ALICE}ecomi/marketplace/ending-soonest`,{
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
            res.json(data.data.marketListingList)
        })
}