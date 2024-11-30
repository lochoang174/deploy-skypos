const CustomError = require("../errors/CustomError");
const Account = require("../models/Account");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");
const decodeToken = require("../utils/decodeToken");
require("express-async-errors");
const fs = require("fs");
const path = require("path");
var cookie = require("cookie");

exports.login = async (req, res) => {
    const authData = req.body;

    const user = await Account.findByUsernameAndPwr(authData.username, authData.password);

    if (user) {
        let accessToken = generateAccessToken(user);
        let refreshToken = generateRefreshToken(user);
        if (user.isLock === true) {
            throw new CustomError("Your account is locked, please contact the admin", 403);
        }
        if (user.isCreated === false) {
            throw new CustomError("You must login by link, please contact the admin", 403);
        }
        await Account.findByIdAndUpdate(user._id, { refreshToken: refreshToken });
        // res.setHeader( "Set-Cookie",
        //     cookie.serialize("refreshToken", refreshToken, {
        //       httpOnly: true,
        //       maxAge: 60 * 60 * 24 * 7, // 1 week
        //     }),)
        res.cookie("refreshToken", refreshToken, {
            maxAge: 900000,
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
        });
        // res.send();
        return {
            user,
            accessToken,
        };
    } else {
        throw new CustomError("Wrong login information", 401);
    }
};
exports.loginByLink = async (req, res, next) => {
    const token = req.params.token;
    const userData = decodeToken(token, next);
    const user = await Account.findById({ _id: userData._id });
    if (user) {
        let accessToken = generateAccessToken(user);
        let refreshToken = generateRefreshToken(user);
        // res.cookie('token', user.Token, { httpOnly: true, secure: true });
        await Account.findByIdAndUpdate(user._id, { refreshToken: refreshToken });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true, // Use secure in production
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        return {
            user,
            accessToken,
        };
    } else {
        throw new CustomError("Invalid User", 401);
    }
};
exports.changePassword = async (req) => {
    const { oldPwr, newPwr } = req.body;
    console.log(req.body);
    const id = req.user.id;
    console.log(id);
    await Account.changePassword(id, oldPwr, newPwr);
    return;
};
exports.changeProfile = async (req) => {
    const id = req.user.id;
    const updateData = req.body;

    // Nếu có file avatar mới được upload
    if (req.file) {
        // Kiểm tra file từ multer middleware
        // Lấy thông tin user hiện tại để kiểm tra avatar cũ
        const currentUser = await Account.findById(id);

        // Xóa avatar cũ nếu tồn tại
        if (currentUser.avatar) {
            const oldAvatarPath = path.join(__dirname, "..", currentUser.avatar);

            if (fs.existsSync(oldAvatarPath)) {
                fs.unlinkSync(oldAvatarPath);
            }
        }

        // Cập nhật đường dẫn avatar mới
        updateData.avatar = "public/avatars/" + req.file.filename;
    }

    // Cập nhật thông tin profile
    const updatedUser = await Account.findByIdAndUpdate(id, { $set: updateData }, { new: true });

    if (!updatedUser) {
        throw new CustomError("User not found", 404);
    }

    return updatedUser;
};
exports.refreshToken = async (req, res) => {
    const { id } = req.body;
    var cookies = cookie.parse(req.headers.cookie || "");

    const token = cookies.refreshToken;

    const newRefreshToken = generateRefreshToken(id);
    try {
        const user = await Account.checkAndUpdateToken(token, id, newRefreshToken);
        if (user) {
            const newAccessToken = generateAccessToken(user);
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: true, // Use secure in production
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            return {
                user,
                accessToken: newAccessToken,
            };
        }
        throw new CustomError("Invalid token", 401);
    } catch (error) {
        throw error;
    }
};
exports.logout = async (req, res) => {
    const { id } = req.body;
    res.clearCookie("refreshToken");
    await Account.findByIdAndUpdate(id, { refreshToken: null });
    return;
};
