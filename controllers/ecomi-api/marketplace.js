const slugify = require('slugify')
const { errorHandler } = require('../../helpers/dbErrorHandler')
require('isomorphic-fetch');
require('dotenv').config()

exports.list = (req, res) => {
    // let order = req.query.order ? req.query.order : 'asc';
    // let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 15;

    let offset = req.body.offset ? `after: "${req.body.offset}"` : '';

    const marketPlaceQuery = `
     query MarketBrowseQuery {
        marketListingList(first: ${limit}, ${offset ? offset : ''}){
            pageInfo{
                hasNextPage
                endCursor
            }
            edges{
                node{
                    id
                    currentPrice
                    bids(first: 1){
                        totalCount
                        edges{
                            node{
                                id
                                status
                            }
                        }
                    }
                    element{
                        ... on Collectible{
                            id
                            formattedIssueNumber
                            collectibleType {
                                id
                                name
                                rarity
                                totalIssued
                                image{
                                    url
                                }
                            }
                        }
                    }
                    endingAt
                    listingType
                    status
                    seller{
                        id
                        username
                    }
                    marketMetadata{
                        totalMarketListings
                    }
                }
            }
        }
     }`

    fetch('https://api.prod.veve.me/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'cookie': process.env.ECOMI_TOKEN
        },
        body: JSON.stringify({ query: marketPlaceQuery}),
        })
        .then(data => data.json())
        .then(data => {
            res.json(data.data.marketListingList)
        })
        .catch(e => console.log('Error: ', e))
}

exports.read = (req, res) => {
    const listingId = req.params.slug
    const marketListing = `
         query MarketListing{
            marketListing(id: "${listingId}"){
                id
            currentPrice
            element {
                ... on Collectible {
                    id
                    formattedIssueNumber
                    collectibleType{
                        id
                        name
                        rarity
                        totalIssued
                        totalAvailable
                        image{
                            url
                        }
                    }
                    transactions{
                        edges{
                            node{
                                id
                                createdAt
                                amountUsd
                                buyer{
                                    id
                                    username
                                    totalCollectibles
                                    totalLikes
                                    totalFollowers
                                    totalFullSets
                                    bio
                                    avatar {
                                        url
                                        id
                                    }
                                }
                            }
                        }
                    }
                }
            }
            }   
     }
    `

    fetch('https://api.prod.veve.me/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'cookie': process.env.ECOMI_TOKEN
        },
        body: JSON.stringify({ query: marketListing}),
    })
        .then(data => data.json())
        .then(data => {
            res.json(data.data.marketListing)
        })
        .catch(e => console.log('Error: ', e))
}




