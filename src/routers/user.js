const express = require('express')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const router = new express.Router()

// create new user
router.post('/users', async (req,res) => {
    const user = new User(req.body)

    try{
        await user.save()
        const token = await user.generateToken()
        res.status(201).send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

// login user
router.post('/users/login',async (req,res)=>{
    try{
        const user = await User.findUserByCredentials(req.body.email, req.body.password)
        const token = await user.generateToken()
        res.send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
})

//send back all users
router.get('/users',async (req,res)=>{
    
    try{
        const users = await User.find({})
        res.send(users)
    }catch(e){
        res.status(500).send(e)
    }
})

//send back user requested by id
router.get('/users/:id',async (req,res)=>{
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

})

//update user
router.patch('/users/:id',async (req,res)=>{
    const updatesRequested = Object.keys(req.body)
    const allowedUpdates = ['name','age','password','email']
    const isValid = updatesRequested.every((update) => allowedUpdates.includes(update))
    if(!isValid){
        return res.status(400).send({error: 'Invalid updates!'})
    }
    try{
        // Note that middleware(advance feature) is surpassed by certain queries(like update in patch route) => so cant use below one line code
        //const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true})
        
        // alternative logic for updating which is compatable with middleware
        const user = await User.findById(req.params.id)
        if(!user) {
            return res.status(400).send('no user')
        }
        updatesRequested.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

//Deletes user
router.delete('/users/:id',async (req,res)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router