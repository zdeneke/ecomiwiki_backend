const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const { scheduledOmiUpdater } = require('./services/index')

// Routes
const blogRoutes = require('./routes/blog/blog')
const authRoutes = require('./routes/auth/auth')
const userRoutes = require('./routes/auth/user')
const categoryRoutes = require('./routes/blog/category')
const tagRoutes = require('./routes/blog/tag')
const collectibleRoutes = require('./routes/collectibles/collectible')
const brandRoutes = require('./routes/collectibles/brand')
const metricRoutes = require('./routes/metrics/index')

// App
const app = express()

// Database
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(() => console.log('Error connecting to MongoDB'))

// Services (schedulers)
scheduledOmiUpdater()

// Middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())

// Cors
app.use(cors())

// Routes Middleware
app.use('/api', blogRoutes)
app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', categoryRoutes)
app.use('/api', tagRoutes)
app.use('/api', collectibleRoutes)
app.use('/api', brandRoutes)
app.use('/api', metricRoutes)

// Port
const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})