require('isomorphic-fetch');
require('dotenv').config()

exports.read = (req,res) => {
    const userId = req.params.slug
    fetch(`${process.env.ALICE}ecomi/users/${userId}`)
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