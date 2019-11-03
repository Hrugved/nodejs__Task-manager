const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

app = express()

// tells express to automatically parse incoming JSON to object
app.use(express.json())
// registring the routers with express
app.use(userRouter)
app.use(taskRouter)

module.exports = app