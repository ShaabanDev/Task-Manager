// import the mongoose module
const mongoose = require("mongoose");
// import the validator module
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    uppercase: true,
    required: true,
  },
  age: {
    type: Number,
    default: 0,
    // validate the age value using the validator module
    validate(value) {
      if (value < 0) {
        throw new Error("Enter valid age");
      }
    },
  },

  email: {
    type: String,
    trim: true,
    required:true,
    unique:true,
    lowercase: true,
    required: true,
    // validate the email value using the validator module
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Enter valid Email");
      }
    },
  },
  password: {
    type: String,
    trim: true,
    minlength: 7,
    // validate the password value using the validator module
    validate(value) {
      if (value.includes("password")) {
        throw new Error("Enter valid Password");
      }
    },
  },
  tokens:[{
    token:{
      type:String,
      required:true,
    }
  }]
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcryptjs.hash(user.password, 8);
  }
  next();
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
}
userSchema.methods.generateAuthToken= async function(){
  const user = this;
  const token = await jwt.sign({_id:user._id.toString()},'logintheuser',);
  user.tokens = user.tokens.concat({token});
  await user.save();
  return token
}

userSchema.virtual('tasks',{
  ref:'Tasks',
  localField:'_id',
  foreignField:'owner'
})

userSchema.statics.findByEmailAndPassword = async(email,password)=>{
  const user = await User.findOne({email});
  if(!user){
    throw new Error('Unable to login').toString();
  }
  const isMatch = await bcryptjs.compare(password,user.password);
  if(!isMatch){
    throw new Error('Unable to login').toString();
  }
  return user;
}

// creating the user model
const User = mongoose.model("Users", userSchema);

//  export the user model
module.exports = User;
