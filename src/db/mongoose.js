const mongoose = require('mongoose');
const validator = require('validator');
const connectionURL = 'mongodb://127.0.0.1:27017/task-manager-api';


mongoose.connect(connectionURL,{
    useNewUrlParser:true,
});

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
        validate(value){
            if(value.includes('password')){
                throw new Error('Enter valid Email');
            }
        }
    }
})


const Tasks = mongoose.model('Tasks',{
    description:{
        type:String,
        required:true,
    },
    completed:{
        type:Boolean,
        default:false
    }
});

