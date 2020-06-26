const express = require('express')
const connectDB = require('../src/db')
const path = require('path');
const app = express()
const port = process.env.PORT

// Connect Database
connectDB()

// init middleware
app.use(express.json({extended: false}))

// Define Routes
app.use('/api/users',   require('../routes/api/users'))
app.use('/api/profile', require('../routes/api/profile'))
app.use('/api/posts',   require('../routes/api/posts'))
app.use('/api/auth',    require('../routes/api/auth'))

// Serve static assets in production
if(process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*',(req,res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.listen(port)

