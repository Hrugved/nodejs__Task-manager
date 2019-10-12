const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const port = process.env.PORT || 3000
app = express()

// tells express to automatically parse incoming JSON to object
app.use(express.json())
// registring the routers with express
app.use(userRouter)
app.use(taskRouter)

app.listen(port,() => {
    console.log('Server is up and running on port ' + port)
})