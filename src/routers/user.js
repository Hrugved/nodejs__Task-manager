const express = require('express')
const User = require('../models/user')
//const jwt = require('jsonwebtoken')
auth = require('../middleware/authentication')

const router = new express.Router()

// create new user
router.post('/users', async (req,res) => {
    const user = new User(req.body)
    try{
        await user.save()
        const token = await user.generateToken()
        res.status(201).send({user,token})
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

// logout user
router.post('/users/logout',auth,async (req,res) => {
    try{    
        //remove the current token from user's token array
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token // remember a token(inside tokens array in user models) is an object : token and _id(provided by mongodb)
        })
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

// logout user (all sessions)
router.post('/users/logoutAll', auth, async (req,res) => {
    try{
        // empty the user's token array
        req.user.tokens = [];
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})


//send back user profile
router.get('/users/me', auth,async (req,res)=>{
    res.send(req.user)
})

//update user
router.patch('/users/me', auth,async (req,res)=>{
    const updatesRequested = Object.keys(req.body)
    const allowedUpdates = ['name','age','password','email']
    const isValid = updatesRequested.every((update) => allowedUpdates.includes(update))
    if(!isValid){
        return res.status(400).send({error: 'Invalid updates!'})
    }
    try{
        updatesRequested.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

//Deletes user
router.delete('/users/me', auth, async (req,res)=>{
    try{
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(404).send()
        // }
        await req.user.remove()
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router