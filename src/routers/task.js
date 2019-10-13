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

//send back tasks of user : 
    // options: 
        //completed: true/false
        //limit: num
        //skip: num
        //sortBy: field:asc/desc
router.get('/tasks', auth, async (req,res)=>{
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
    }

    try{
        await req.user.populate({
            path: 'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort // { field: 1/-1} 1:ascending, -1:descending
            }
            }).execPopulate()

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