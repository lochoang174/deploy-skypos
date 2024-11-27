const authService = require('../services/auth.service') 

exports.login = async(req, res, next)=>{
    console.log("login")
    const data =await authService.login(req,res)
    req.responseData = {
        status: 201, 
        message: 'Successfully login!', 
        data: data
    };
    next();
}

exports.loginBylink = async(req, res, next)=>{
     
    const data =await authService.loginByLink(req,res,next)
    req.responseData = {
        status: 201, 
        message: 'Successfully login!', 
        data: data
    };
    next();
}
exports.changePassword = async(req, res, next)=>{
   await authService.changePassword(req)
 
    req.responseData = {
        status: 204, 
        message: 'Successfully change Password!', 
    };
    next(); 
}
exports.updateProfile = async(req, res, next)=>{
    const data = await authService.changeProfile(req)
    req.responseData = {
        status: 200, 
        message: 'Successfully update profile!', 
        data: data
    };
    next();
}
exports.refreshToken = async(req, res, next)=>{
    const data = await authService.refreshToken(req,res)
    req.responseData = {
        status: 200, 
        message: 'Successfully refresh token!', 
        data: data
    };
    next();
}
exports.logout = async(req, res, next)=>{
    await authService.logout(req,res)
    req.responseData = {
        status: 204, 
        message: 'Successfully logout!', 
    };
    next();
}
