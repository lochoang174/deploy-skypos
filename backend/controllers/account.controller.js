const accountService = require("../services/account.service")
exports.createAccount = async(req,res,next)=>{
    const createAccount = await accountService.createAccount(req)

    req.responseData = {
        status: 201, 
        message: 'Successfully! Create new account', 
        data: createAccount
    }; 
    next();
}
exports.resendEmail = async(req,res,next)=>{
   await accountService.resendEmail(req)

    req.responseData = {
        status: 204, 
        message: 'Successfully! Resend email', 
    };
    next();
}
exports.getListStaff= async(req,res,next)=>{
    const data=await accountService.getListStaff(req)

    req.responseData = {
        status: 200, 
        message: 'Successfully! Get list staff', 
        data
    };
    next();
}
exports.updateAccount= async(req,res,next)=>{
    const data=await accountService.updateAccount(req)

    req.responseData = {
        status: 200, 
        message: 'Successfully! Account updated successfully', 
        data
    };
    next();
}
exports.deleteStaffById= async(req,res,next)=>{
  await accountService.deleteStaffByIds(req)

    req.responseData = {
        status: 204, 
        message: 'Staff deleted successfully', 
       
    };
    next();
}
exports.updateStatusAccount = async(req,res,next)=>{
  const data = await accountService.updateStatusAccount(req)

  req.responseData = {
    status: 204, 
    message: 'Successfully! Account updated successfully', 
    data
  };
  next();
}
