const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

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
    }
})

// middleware for hashing passwords
// Note that middleware(advance feature) are surpassed by certain queries(like update in patch route) => so amek sure to update logic in thise places so that middleware is compatable
userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8) // 8 -> optiaml number of times hashing algo should run for perfect balance between speed ans security
    }
    next() // Very important for middlewares -> it marks the end of middleware code and calls whatever next function
})

const User = mongoose.model('User', userSchema)

module.exports = User