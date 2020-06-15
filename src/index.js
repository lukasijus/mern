const express = require('express')
const connectDB = require('../src/db')

const app = express()
const port = process.env.PORT

// Connect Database
connectDB()

// init middleware
app.use(express.json({extended: false}))

app.get('/', async (req, res) => await res.send('Hello World!'))

// Define Routes
app.use('/api/users',   require('../routes/api/users'))
app.use('/api/profile', require('../routes/api/profile'))
app.use('/api/posts',   require('../routes/api/posts'))
app.use('/api/auth',    require('../routes/api/auth'))

app.listen(port, console.log('running on port', port))

module.exports = app
