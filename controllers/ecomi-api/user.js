require('isomorphic-fetch');
require('dotenv').config()

exports.read = (req,res) => {

    const userId = req.params.slug

    const userQuery =`
         query UserLookUp{
            user(id:"${userId}"){
                id
                profileVisible
                totalCollectibles
                profileCollectibles{
                    edges{
                        node{
                            id
                            ownedByUser
                            formattedIssueNumber
                            collectibleType {
                                id
                                rarity
                                totalAvailable
                                totalIssued
                                storePrice
                                storeCurrencyType
                                name
                                image{
                                    id
                                    url
                                    direction
                                }
                            }
                        }
                    }
                }
                username
                avatar {
                    url
                    id
                }
                totalLikes
                totalFollowers
                totalFullSets
                collectorStatus
                bio
            }   
     }
    `

    fetch('https://api.prod.veve.me/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'cookie': process.env.ECOMI_TOKEN
        },
        body: JSON.stringify({ query: userQuery}),
    })
        .then(data => data.json())
        .then(data => {
            res.json(data.data.user)
        })
        .catch(e => console.log('Error: ', e))
}