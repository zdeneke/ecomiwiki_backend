const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const { scheduledOmiUpdater, scheduledBurnUpdater } = require('./services/index')

// Routes
const authRoutes = require('./routes/auth/auth')
const userRoutes = require('./routes/auth/user')
const collectibleRoutes = require('./routes/collectibles/collectible')
const comicRoutes = require('./routes/comics/comics')
const licenseRoutes = require('./routes/license/license')
const brandRoutes = require('./routes/brand/brand') 
const metricRoutes = require('./routes/metrics/index')
const seriesRoutes = require('./routes/series/series')

// Ecomi/VEVE API Routes
const ecomiMarketplaceAPI = require('./routes/ecomi-api/marketplace')
const ecomiUserAPI = require('./routes/ecomi-api/user')

// App
const app = express()

// Database
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(() => console.log('Error connecting to MongoDB'))

// Services (schedulers)
scheduledOmiUpdater()
scheduledBurnUpdater()

// Middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())

// Cors
const whitelist = ['http://localhost:3000', 'http://ecomiwiki.com' , 'https://ecomiwiki.com', ['67.225.248.251']];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
}
app.use(cors())
app.disable('etag');

// Routes Middleware
app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', collectibleRoutes)
app.use('/api', comicRoutes)
app.use('/api', licenseRoutes)
app.use('/api', brandRoutes)
app.use('/api', metricRoutes)
app.use('/api', ecomiMarketplaceAPI)
app.use('/api', ecomiUserAPI)
app.use('/api', seriesRoutes)

// Port
const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})