const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const port = process.env.PORT || 3000
app = express()

// tells express to automatically parse incoming JSON to object
app.use(express.json())

app.post('/users', async (req,res) => {
    const user = new User(req.body)

    try{
        await user.save()
        res.status(201).send(user)
    }catch(e){
        res.status(400).send(e)
    }

    // user.save().then(() => {
    //     res.send(user)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

app.post('/tasks',async (req,res)=>{
    const task = new Task(req.body)

    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }

    // task.save().then(()=>{
    //     // status code : 201 is for 'Created'. 
    //     //It will not make any diffrence but its best practice to send back most accurate data
    //     res.status(201).send(task)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })   
})

//send back all users
app.get('/users',async (req,res)=>{
    
    try{
        const users = await User.find({})
        res.send(users)
    }catch(e){
        res.status(500).send(e)
    }
    
    // User.find({}).then((users)=>{
    //     res.send(users)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
})

//send back user requested by id
app.get('/users/:id',async (req,res)=>{
    const _id = req.params.id

    try{
        user = await User.findById(_id)
        if(!user) {
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }

    // User.findById(_id).then((user)=>{
    //     if(!user){
    //         return res.status(404).send()
    //     }
    //     res.send(user)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
})

//send back all users
app.get('/tasks',async (req,res)=>{
    
    try{
        const tasks = await Task.find({})
        res.send(tasks)
    }catch(e){
        res.status(500).send(e)
    }
    
    // Task.find({}).then((tasks)=>{
    //     res.send(tasks)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
})

//send back user requested by id
app.get('/tasks/:id',async (req,res)=>{
    const _id = req.params.id

    try{
        task = await Task.findById(_id)
        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }

    // Task.findById(_id).then((task)=>{
    //     if(!task){
    //         return res.status(404).send()
    //     }
    //     res.send(task)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
})

app.listen(port,() => {
    console.log('Server is up and running on port ' + port)
})