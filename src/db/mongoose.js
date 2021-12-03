const mongoose = require('mongoose');
const connectionURL = process.env.MONGODB_URL;


mongoose.connect(connectionURL,{
    useNewUrlParser:true,
});




// /users/mohamed/mongodb/bin/mongod.exe --dbpath=/users/mohamed/mongodb-data