const User = require('../../src/models/user')
const Task = require('../../src/models/task')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id : userOneId,
    name: "mike",
    email: "mike@example.com",
    password: "pass123098",
    tokens: [{
        token: jwt.sign({_id:userOneId},process.env.JWT_SECRET)
    }]
}

const userTwo = {
    _id : new mongoose.Types.ObjectId(),
    name: "zess",
    email: "zess@example.com",
    password: "12309dada8",
    tokens: [{
        token: jwt.sign({_id: this._id},process.env.JWT_SECRET)
    }]
}

// bad credentials
const badUser = {
    _id: new mongoose.Types.ObjectId(),
    name: "mike",
    email: "mike@example.com",
    password: "password"
}

const tasks = [
    {
        _id: new mongoose.Types.ObjectId(),
        description: 'task one of user one',
        completed: false,
        owner: userOneId
    },
    {
        _id: new mongoose.Types.ObjectId(),
        description: 'task two of user one',
        completed: false,
        owner: userOneId
    },
    {
        _id: new mongoose.Types.ObjectId(),
        description: 'task three of user two',
        completed: true,
        owner: userTwo._id
    }
]

const seedDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await Promise.all(tasks.map(async (task) => {
        await new Task(task).save()    
    }))
} 

module.exports = {
    userOne,
    userOneId,
    badUser,
    seedDatabase,
    userTwoTask: tasks[2]
}