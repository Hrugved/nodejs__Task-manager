const express = require('express')
const Task = require('../models/task')

const router = new express.Router()

router.post('/tasks',async (req,res)=>{
    const task = new Task(req.body)

    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

//send back all users
router.get('/tasks',async (req,res)=>{
    
    try{
        const tasks = await Task.find({})
        res.send(tasks)
    }catch(e){
        res.status(500).send(e)
    }
    
})

//send back user requested by id
router.get('/tasks/:id',async (req,res)=>{
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
})

//Updates task
router.patch('/tasks/:id',async (req,res)=>{
    const updatesRequested = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isValid = updatesRequested.every((update) => allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send({error : 'Invalid updates!'})
    }

    try{
        task = await Task.findById(req.params.id)
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
router.delete('/tasks/:id',async (req,res)=>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router