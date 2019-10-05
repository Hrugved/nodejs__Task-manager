const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User',{
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

module.exports = User