// seed.js
const mongoose = require('mongoose');
var bcrypt = require("bcrypt");

const Account = require('./models/Account');
const url = "mongodb+srv://lochoang611:dROiBl5scGYeWhfc@cluster0.nnwioc9.mongodb.net/skypos"
// const connectMongoDB = (connectString)=>{
//     return mongoose.connect(connectString,{
        
//     }).then(console.log("Connected to DB"))
// }
mongoose.connect(url)
    .then(() => {
        console.log('Connected to MongoDB');
        seedUsers();
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB', error);
    });

async function seedUsers() {
    try {
        await Account.deleteMany(); 
        const password = await bcrypt.hash("admin123", 10);

        const users = [
            { name: "LamLam",
            email:"lamtruongphu3005@gmail.com",
            username:"admin",
            password,
            role:0,
            isLock:false,
            isCreated:true,
            avatar:"/public/avatar-default.jpg"
             },
        ];

        await Account.insertMany(users); 
        mongoose.connection.close(); 
    } catch (error) {
        console.error('Error seeding users', error);
        mongoose.connection.close(); 
    }
}
