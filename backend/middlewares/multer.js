const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (req.body.Product) {
            fs.mkdirSync(path.resolve("backend/public/images/" + req.body.Product), { recursive: true });
            cb(null, path.resolve("backend/public/images/" + req.body.Product));
        }
        // Save image to public/images folder
        else cb(null, path.resolve("backend/public/images")); // Save image to public/images folder
    },
    filename: function (req, file, cb) {
        cb(null, crypto.randomUUID() + path.extname(file.originalname)); // Append timestamp to original file name
    },
});

// Check file type (for image uploads only)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error("Images only!"));
    }
};

// Initialize upload object
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
    fileFilter: fileFilter,
});

module.exports = upload;
