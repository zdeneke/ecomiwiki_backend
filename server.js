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

// App
const app = express()

// Database
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(() => console.log('Error connecting to MongoDB'))

// Services (schedulers)
scheduledOmiUpdater()
scheduledBurnUpdater()

// CSP
app.use(function (req, res, next) {
    res.setHeader(
        'Content-Security-Policy-Report-Only',
        "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
    );
    next();
});

// Middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())

// Cors
const corsOptions = {
    origin: 'https://ecomiwiki.com',
    optionsSuccessStatus: 200
}

app.enable('trust proxy')
app.use((req, res, next) => {
    req.secure ? next() : res.redirect('https://' + req.headers.host + req.url)
})

app.use(cors(corsOptions))
app.disable('etag');

// Routes Middleware
app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', collectibleRoutes)
app.use('/api', comicRoutes)
app.use('/api', licenseRoutes)
app.use('/api', brandRoutes)
app.use('/api', metricRoutes)
app.use('/api', seriesRoutes)

// Port
const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})