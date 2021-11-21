// import the mongoose module
const mongoose = require('mongoose');
// import the validator module
const validator = require('validator');

// creating new model called Task 
const Task = mongoose.model('Tasks',{
    description:{
        type:String,
        trim:true,
        required:true,
    },
    completed:{
        type:Boolean,
        default:false
    }
});

// export the Task model
module.exports = Task;

