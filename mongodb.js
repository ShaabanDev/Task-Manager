const {MongoClient,ObjectId,} = require("mongodb");


const connectionURL = 'mongodb://127.0.0.1:27017';

const dbName = "task-manager";

MongoClient.connect(connectionURL, { useNewUrlParser: true },(error,client)=>{
    if(error){
        console.log(error);
        return  console.log('unable to connect to database');
    }

    console.log('connected correctly');
    const db = client.db(dbName);
});
