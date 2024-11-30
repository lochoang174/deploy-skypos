const Account = require("../models/Account");
exports.checkStatus = async(id)=>{
    const account = await Account.findById(id)
    return account.isLock
}