const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const port = process.env.PORT || 3000
app = express()

// tells express to automatically parse incoming JSON to object
app.use(express.json())

app.post('/users', (req,res) => {
    const user = new User(req.body)

    user.save().then(() => {
        res.send(user)
    }).catch((err) => {
        res.status(400).send(err)
    })
})

app.post('/tasks',(req,res)=>{
    const task = new Task(req.body)

    task.save().then(()=>{
        // status code : 201 is for 'Created'. 
        //It will not make any diffrence but its best practice to send back most accurate data
        res.status(201).send(task)
    }).catch((err)=>{
        res.status(400).send(err)
    })   
})

//send back all users
app.get('/users',(req,res)=>{
    User.find({}).then((users)=>{
        res.send(users)
    }).catch((err)=>{
        res.status(500).send(err)
    })
})

//send back user requested by id
app.get('/users/:id',(req,res)=>{
    const _id = req.params.id
    User.findById(_id).then((user)=>{
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }).catch((err)=>{
        res.status(500).send(err)
    })
})

//send back all users
app.get('/tasks',(req,res)=>{
    Task.find({}).then((tasks)=>{
        res.send(tasks)
    }).catch((err)=>{
        res.status(500).send(err)
    })
})

//send back user requested by id
app.get('/tasks/:id',(req,res)=>{
    const _id = req.params.id

    Task.findById(_id).then((task)=>{
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }).catch((err)=>{
        res.status(500).send(err)
    })
})

app.listen(port,() => {
    console.log('Server is up and running on port ' + port)
})