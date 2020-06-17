const express = require('express')
require('../src/db')
const userRouter = require('../routes/api/users')

const app = express()

app.use(express.json())
app.use(userRouter)

module.exports = app