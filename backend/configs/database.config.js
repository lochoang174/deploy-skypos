const mongoose = require('mongoose')
mongoose.set('strictQuery', true);

const connectMongoDB = (connectString)=>{
    return mongoose.connect(connectString,{
        
    }).then(console.log("Connected to DB"))
}
module.exports = connectMongoDB