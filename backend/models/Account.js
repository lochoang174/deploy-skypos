var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const CustomError = require('../errors/CustomError');

var AccountSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }, 
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: Number,// 0: admin, 1: staff
    required: true
  },
  avatar: {
    type: String,
    required: false
  },
  isLock: {
    type: Boolean,
    required: true
  },
  isCreated: {
    type: Boolean,
    required: true
  },
  refreshToken: {
    type: String,
    required: false
  }
},{timestamps:true,
  statics:{
    async findByUsernameAndPwr(username, password) {
      const user = await this.findOne({ username: username }); // Correct the field name

      if (!user) {
        return null; // User not found
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password); // Compare the correct field

      if (!isPasswordCorrect) {
        return null; // Incorrect password
      }
      const userObj = user.toObject();

      delete userObj.password;

      return userObj;
    },
    async changePassword(id, oldPwr, newPwr) {
      const user = await this.findById({ _id: id });
  
      if (!user) {
        throw new CustomError("User not exist",403); // User not found
      }
  
      const isPasswordCorrect = await bcrypt.compare(oldPwr, user.password);
      if (!isPasswordCorrect) {
        throw new CustomError("Wrong Passowrd",400);
      }
  
      // Băm mật khẩu mới
      const hashedNewPassword = await bcrypt.hash(newPwr, 10);
      user.password = hashedNewPassword;
  
      // Cập nhật isCreated nếu nó là false
      if (!user.isCreated) {
        user.isCreated = true;
      }
  
      // Lưu thay đổi
      await user.save();
    },
    async checkAndUpdateToken(token,id,newToken){
      const user = await this.findById({ _id: id });
      if(!user){
        throw new CustomError("User not exist",403);
      }
      if(user.isLock){
        throw new CustomError("Your account is locked, please contact the admin", 403);
      }
      if(user.refreshToken === token){
        user.refreshToken = newToken
        await user.save()
        return user
      }
      console.log(user)
      console.log("token")
      console.log(token)
      return null
    }
  },

  
});
module.exports = mongoose.model("Account", AccountSchema);
