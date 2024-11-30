const express = require('express')
const verifyToken = require("../middlewares/verifyToken");
const {uploadAvatar} = require("../configs/multer.config")
const router = express.Router();
const authController = require('../controllers/auth.controller')

// router.get("/login")
router.post("/login",authController.login)
router.get("/login/:token",authController.loginBylink)
router.post("/changePassword", verifyToken,authController.changePassword)
router.put("/profile", verifyToken,uploadAvatar.single("avatar"),authController.updateProfile)
router.post("/refresh",authController.refreshToken)
router.post("/logout",authController.logout)
module.exports = router