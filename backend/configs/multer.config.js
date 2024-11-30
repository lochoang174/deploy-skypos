const multer = require("multer");

const storageAvatar = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "backend/public/avatars"); // Thư mục lưu ảnh avatar
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); // Tên file = timestamp + tên gốc
    },
});

const uploadAvatar = multer({ storage: storageAvatar });
module.exports = { uploadAvatar };
