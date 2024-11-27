var dotenv = require('dotenv');
var jwt = require("jsonwebtoken");
var env = process.env.NODE_ENV;
var ms = require("ms")
dotenv.config({ path: `.env.${env}` });
exports.generateAccessToken = (user) => {
    const expirationDate = Date.now() + ms(process.env.JWT_ACCESS_EXPIRED); // Add offset to the current time

    return jwt.sign({ 
        username:user.username,
        email:user.email,
        _id:user._id,
        role:user.role,
        avatar:user.avatar, 
        islock:user.isLock,
        isCreated:user.isCreated,
        expirationDate }, process.env.JWT_ACCESS);
};
exports.generateLoginToken = (user) => {
    const expirationDate = Date.now() + ms(process.env.JWT_LOGIN_EXPIRED); // Add offset to the current time

    // const expirationDate = new Date();
    // expirationDate.setTime(ms(process.env.JWT_LOGIN_EXPIRED));
    return jwt.sign({ 
        username:user.username,
        email:user.email,
        _id:user._id,
        avatar:user.avatar, 
        islock:user.isLock,
        isCreated:user.isCreated,
        expirationDate 
    }, process.env.JWT_LOGIN);
};
exports.generateRefreshToken = (user) => {
    const expirationDate = Date.now() + ms(process.env.JWT_REFRESH_EXPIRED); // Add offset to the current time
    return jwt.sign({ 
        _id:user._id,
        expirationDate
    }, process.env.JWT_REFRESH);
};

