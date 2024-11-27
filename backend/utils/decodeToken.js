const jwt = require('jsonwebtoken');
var dotenv = require('dotenv');
const CustomError = require('../errors/CustomError');
var env = process.env.NODE_ENV;
dotenv.config({ path: `.env.${env}` });

const decodeToken = (token,next) => {
  try {
    // Giải mã và xác minh token
    const decoded = jwt.verify(token, process.env.JWT_LOGIN); // Thay thế 'your-secret-key' bằng secret key thực sự của bạn
    
    const currentTimestamp = Date.now();
    const unixTimestamp = new Date(decoded.expirationDate).getTime();

    if (currentTimestamp > unixTimestamp) {
      throw new CustomError("Login token is expired",401);
    }
    return decoded;
  } catch (error) {
    next(error)

      // throw new CustomError('Invalid token',403);
    
  }
}

module.exports=decodeToken
