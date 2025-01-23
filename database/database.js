const mongoose = require('mongoose');


const dbconnect = ()=>{
    mongoose.connect("mongodb://127.0.0.1:27017/demo",{
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    })
    .then(()=>{
        console.log("Database connected");
    })
    .catch((err)=>console.log("DB connection error: " + err));
}

module.exports = dbconnect;