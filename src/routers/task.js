const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/authentication')
const router = new express.Router()

// create task
router.post('/tasks', auth, async (req,res)=>{
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

//send back all tasks oi users
router.get('/tasks', auth, async (req,res)=>{
    try{
        // const tasks = await Task.find({owner:req.user._id})
        // res.send(tasks)
        
        // alternate approach 
        await req.user.populate('tasks').execPopulate()
        res.send(req.user.tasks)

    }catch(e){
        res.status(500).send(e)
    }
    
})

//send back task requested by id
router.get('/tasks/:id', auth, async (req,res)=>{
    const _id = req.params.id

    try{
        //task = await Task.findById(_id)
        task = await Task.findOne({_id,owner:req.user._id})
        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

//Updates task
router.patch('/tasks/:id', auth, async (req,res)=>{
    const updatesRequested = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isValid = updatesRequested.every((update) => allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send({error : 'Invalid updates!'})
    }

    try{
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        updatesRequested.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

//Deletes task
router.delete('/tasks/:id', auth, async (req,res)=>{
    try{
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router