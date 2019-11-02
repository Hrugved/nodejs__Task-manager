const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim:true
    },
    age:{
        type: Number,
        default: 0,
        validate(value) {
            if(value<0) {
                throw new Error('Age can\'t be negative!');
            }
        }
    },
    email:{
        type: String,
        unique: true, // one email to only one user
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email format')
            }
        }
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('password can\'t contain \'password\'')
            }
        }
    },
    tokens: [{ // json web tokens (jwt's)
        token: {
            type: String,
            required: true
        }
    }],
    avatar :{
        type: Buffer // user profile image
    }
},{
    timestamps: true
})

// informing mongoose about relationship between users and tasks by virtually setting up a (virtual)field called 'tasks'
// relationship --> 'localField' ( of this 'Schema') is related to 'ForeignField' field of 'ref'(Schema)
// relationship --> '_id' ( of this 'User') is related to 'owner' field of 'Task'
// So populating user.tasks(virtual field on users) will not affect the actual user document 
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// building custom queries on schema( object) itself=> 
    //defined as <schema>.statics.<customFunction>  
    //accessible on <schema> itself , as <schema>.<customFunction>
userSchema.statics.findUserByCredentials = async (email,password) => {
    const user = await User.findOne({email}) // recall its shortcut for email:email (whenever key & value have same name)
    if(!user) { throw new Error('Unable to login!') }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) { throw new Error('Unable to login!') }
    return user
}

// building custom queries on instances of schema( object) => 
    //defined as : <schema>.methods.<customFunction>  
    //accessible on <an_Instance_of_schema> itself as : <an_Instance_of_schema>.<customFunction>
userSchema.methods.generateToken = async function() {
    const user = this // whenever using 'this', dont use arrow-functions as they dont bind 'this'
    const token = jwt.sign({ _id : user.id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.methods.toJSON = function() {  // toJSON is special method : res.send(obj) --> obj.toJSON --> JSON.stringify(obj) --> sent 
    const user = this                     // that means object to be send can be manipulated in toJSON method                                                              
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

// middleware for hashing plain text passwords to hashed passwords
// Note that middleware(advance feature) are surpassed by certain queries(like update in patch route) => so use alternate queries(middleware is compatable) instead of them
// run this before(pre) user.save()
userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8) // 8 -> optiaml number of times hashing algo should run for perfect balance between speed ans security
    }
    next() // Very important for middlewares -> it marks the end of middleware code and calls whatever next function
})

// middleware for deleting all user's task if the user is deleted
// run this before(pre) user.remove()
userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({owner:user._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User