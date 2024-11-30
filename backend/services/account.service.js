const sendLoginEmail=require("../utils/sendEmail")
const {generateLoginToken}=require("../utils/generateToken")
const Account = require("../models/Account")
const CustomError =require("../errors/CustomError")
var bcrypt = require("bcrypt");
require("express-async-errors");

exports.createAccount = async(req)=>{
   
        const { name, email } = req.body;
    
        const existingAccount = await Account.findOne({ email });
        if (existingAccount) {
          throw new CustomError("This account has been created",400)
        }
    
        const username = email.split('@')[0]; 
        const password = await bcrypt.hash(username, 10);

        const newAccount = new Account({
          name,
          email,
          username,
          password, 
          role: 1,
          isLock: false,
          isCreated: false
        });
        
        const successCreate=await newAccount.save();
    
        // Tạo JWT token có hạn 1 phút
        const token =generateLoginToken(successCreate)
        // Gửi email cho nhân viên
        sendLoginEmail(email,token)
        return successCreate;
      

}
exports.resendEmail = async(req)=>{
  const { id} = req.body;
  const account =await Account.findById({_id:id})
  if(account.isCreated===true){
    throw new CustomError("This account has been created by user",400)
  }
  const token =generateLoginToken(account)
  sendLoginEmail(account.email,token)

  return ;

    

}
exports.updateAccount = async (req) => {
  const { id, name, email, isLock } = req.body;

  // Check if account exists
  const account = await Account.findById(id);
  if (!account) {
    throw new CustomError("Account not found", 404);
  }

  if (name) account.name = name;
  if (email) account.email = email;


  // Lock or unlock the account
  if (typeof isLock === 'boolean') {
    account.isLock = isLock;
  }

  await account.save();
  return account ;
};

// Get List of Staff with Pagination
exports.getListStaff = async (req) => {
  const { page = 1, limit = 10 } = req.query;

  // Find staff members with role = 1 (staff)
  const staffList = await Account.find({ role: 1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  // Total number of staff for pagination
  const totalStaff = await Account.countDocuments({ role: 1 });

  return {
    staffList,
    currentPage: page,
    totalPages: Math.ceil(totalStaff / limit),
    totalStaff,
  };
};

// Delete Staff by ID
exports.deleteStaffByIds = async (req) => {
  const { ids } = req.body;  // Expecting an array of IDs in the request body

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new CustomError("No staff IDs provided", 400);
  }

  const failedDeletions = [];
  const successDeletions = [];

  for (const id of ids) {
    try {
      // Check if staff exists
      const account = await Account.findById(id);
      if (!account) {
        throw new CustomError(`Staff with ID ${id} not found`, 404);
      }

      // Check if the account is a staff member (role = 1)
      if (account.role !== 1) {
        throw new CustomError(`Account with ID ${id} is not a staff member`, 400);
      }

      // Delete the staff member
      await Account.deleteOne({ _id: id });
      successDeletions.push(id);
    } catch (err) {
      // Catch errors for individual deletions and continue with the next
      failedDeletions.push({ id, error: err.message });
    }
  }

  // Return a summary of the deletions
  return 
};
exports.updateStatusAccount = async(req)=>{
  try {
    const {id,status}=req.body
    const account = await Account.findByIdAndUpdate(id,{isLock:status})
    return account
  } catch (error) {
    throw new CustomError(error.message, 500)
  }
}
