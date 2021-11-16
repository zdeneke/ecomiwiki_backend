const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const { scheduledOmiUpdater, scheduledBurnUpdater } = require('./services/index')

const { getOmiPrice } = require('./services/getOmiPrice')

// getOmiPrice()
// Routes
const blogRoutes = require('./routes/blog/blog')
const teamRoutes = require('./routes/team/team')
const authRoutes = require('./routes/auth/auth')
const userRoutes = require('./routes/auth/user')
const categoryRoutes = require('./routes/blog/category')
const tagRoutes = require('./routes/blog/tag')
const collectibleRoutes = require('./routes/collectibles/collectible')
const comicRoutes = require('./routes/comics/comics')
const licenseRoutes = require('./routes/license/license')
const brandRoutes = require('./routes/brand/brand') 
const metricRoutes = require('./routes/metrics/index')
const storeRoutes = require('./routes/ecomi-api/store')
const socialRoutes = require('./routes/social/social')
const tracerRoutes = require('./routes/tracer/tracer')
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
const whitelist = ['http://localhost:3000', 'https://ecomiwiki.com'];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
}
app.use(cors(corsOptions))
app.disable('etag');


// Routes Middleware
app.use('/api', blogRoutes)
app.use('/api', teamRoutes)
app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', categoryRoutes)
app.use('/api', tagRoutes)
app.use('/api', collectibleRoutes)
app.use('/api', comicRoutes)
app.use('/api', licenseRoutes)
app.use('/api', brandRoutes)
app.use('/api', metricRoutes)
app.use('/api', ecomiMarketplaceAPI)
app.use('/api', ecomiUserAPI)
app.use('/api', storeRoutes)
app.use('/api', socialRoutes)
app.use('/api', tracerRoutes)
app.use('/api', seriesRoutes)

// Port
const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})