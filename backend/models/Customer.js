var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CustomerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
}, { 
  statics: {
    async findByName(name) {
      return await this.find({ name: new RegExp(name, 'i') });
    },

    async findByPhoneNumber(phoneNumber){
      return await this.find({ phoneNumber: new RegExp(phoneNumber, 'i')})
    },

    async saveUser(userInfo) {
      const existingUser = await this.findOne({ 
        $or: [
          { email: userInfo.email },
          { phoneNumber: userInfo.phoneNumber }
        ]
      });
      
      if (existingUser) {
        throw new Error('Người dùng đã tồn tại với email hoặc số điện thoại này');
      }
      
      const user = new this(userInfo);
      return await user.save();
    },
  }
});

module.exports = mongoose.model("Customer", CustomerSchema);
