const express = require('express')
const router = express.Router();
const accountController = require('../controllers/account.controller')
router
    .post("/",accountController.createAccount)
    .put("/",accountController.updateAccount)
    .delete("/",accountController.deleteStaffById)
    .get("/",accountController.getListStaff)
    .post("/resend",accountController.resendEmail)
    .put("/status",accountController.updateStatusAccount)

module.exports = router