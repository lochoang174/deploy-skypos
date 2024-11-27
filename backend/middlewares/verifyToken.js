
var dotenv = require("dotenv");
var env = process.env.NODE_ENV;
dotenv.config({ path: `.env.${env}` });

const jwt = require("jsonwebtoken");
const CustomError = require("../errors/CustomError");
const { checkStatus } = require("../utils/checkStatus");

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new CustomError("No token provided",403);
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS);

        const { _id, username, role, email,expirationDate } = decoded;
        const isLock = await checkStatus(_id)
        if(isLock){
            throw new CustomError("Your account is locked, please contact the admin",403);
        }
        const currentTimestamp = Date.now();
        const unixTimestamp = new Date(expirationDate).getTime();
        console.log(currentTimestamp, unixTimestamp);
        if (currentTimestamp > unixTimestamp) {
          throw new CustomError("Access token is expired",401);
        }
        req.user = { id:_id, username, role };
        next();
    } catch (error) {
        next(error)
    }
  };
  module.exports = verifyToken;
  