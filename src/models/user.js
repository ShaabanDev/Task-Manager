// import the mongoose module
const mongoose = require('mongoose');
// import the validator module
const validator = require('validator');


// creating the user model
const User = mongoose.model('Users',{
    name:{
        type:String,
        trim:true,
        uppercase:true,
        required:true,
    },
    age:{
        type:Number,
        default:0,
        // validate the age value using the validator module
        validate(value){
            if(value<0){
                throw new Error('Enter valid age');
            }
        },
    },
    
    email:{
        type:String,
        trim:true,
        lowercase:true,
        required:true,
        // validate the email value using the validator module
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Enter valid Email');
            }
        }
    },
    password:{
        type:String,
        trim:true,
        minlength:7,
        // validate the password value using the validator module
        validate(value){
            if(value.includes('password')){
                throw new Error('Enter valid Password');
            }
        }
    }
})

//  export the user model
module.exports =User;