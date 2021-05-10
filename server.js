const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const fetch = require("node-fetch")
require('dotenv').config()

// Routes
const blogRoutes = require('./routes/blog/blog')
const authRoutes = require('./routes/auth/auth')
const userRoutes = require('./routes/auth/user')
const categoryRoutes = require('./routes/blog/category')
const tagRoutes = require('./routes/blog/tag')

// App
const app = express()

// Database
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(() => console.log('Error connecting to MongoDB'))

// CoinMarketCap Test
// fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=omi', {
//     method: 'GET',
//     headers: {
//         'X-CMC_PRO_API_KEY': 'c867dd02-79fe-449c-8e65-02040c1534fd',
//         'Accepts': 'application/json'
//     }
// })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Ok CMC res is: ', data)
//     })
//     .catch(e => console.log('Failed to fetch:', e))

// Middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())

// Cors
if (process.env.NODE_ENV === 'development'){
    app.use(cors({ origin: `${process.env.CLIENT_URL}` }))
}

// Routes Middleware
app.use('/api', blogRoutes)
app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', categoryRoutes)
app.use('/api', tagRoutes)

// Port
const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})