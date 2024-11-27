const variantService = require("../services/variant.service");
const fs = require("fs");
const path = require("path");

// Create and Save a new Variant
exports.createVariant = async (req, res, next) => {
    const images = req.files ? req.files.map((file) => file.filename) : [];
    if (images.length > 0) {
        req.body.images = images; // Store the filenames in the body
    }
    const variant = await variantService.createVariant(req.body);
    fs.mkdirSync(path.resolve("public/images/" + variant.Product + "/" + variant._id), { recursive: true });
    images.forEach((image) => {
        fs.renameSync(
            path.resolve("public/images/" + variant.Product + "/" + image),
            path.resolve("public/images/" + variant.Product + "/" + variant._id + "/" + image)
        );
    });

    req.responseData = {
        message: "Variant was created successfully!",
        data: variant,
    };
    next();
};

exports.showVariants = async (req, res, next) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const barcode = req.query.barcode;
    const variants = await variantService.showVariants(page, limit, barcode);
    req.responseData = {
        message: "Variants retrieved successfully!",
        data: variants,
    };
    next();
};

exports.showVariant = async (req, res, next) => {
    const id = req.params.id;
    const variant = await variantService.showVariant(id);

    req.responseData = {
        message: "Variant was retrieved successfully!",
        data: variant,
    };

    next();
};

exports.showVariantByProductId = async (req, res, next) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 12;
    const productId = req.params.productId;
    const barcode = req.query.barcode;

    const filters = {
        color: req.query.color,
        ram: req.query.ram,
        storage: req.query.storage,
        status: req.query.status,
    };

    const variants = await variantService.showVariantByProductId(productId, page, limit, barcode, filters);
    req.responseData = {
        message: "Variant was retrieved successfully!",
        data: variants,
    };
    next();
};

exports.updateVariant = async (req, res, next) => {
    const id = req.params.id;
    // const images = req.files ? req.files.map((file) => file.filename) : [];
    // if (images.length > 0) {
    //     req.body.images = images; // Store the filenames in the body
    // }
    let { existingImages } = req.body; // Array of existing image filenames
    if (existingImages === null || existingImages === undefined) {
        existingImages = [];
    }
    const newImages = req.files ? req.files.map((file) => file.filename) : []; // Array of new uploaded file names
    existingImages = !Array.isArray(existingImages) ? [existingImages] : existingImages;
    const images = [...existingImages, ...newImages];
    req.body.images = images;

    const variant = await variantService.updateVariant(id, req.body);
    if (newImages.length > 0) {
        fs.mkdirSync(path.resolve("public/images/" + variant.Product + "/" + variant._id), {
            recursive: true,
        });
        newImages.forEach((image) => {
            fs.renameSync(
                path.resolve("public/images/" + image),
                path.resolve("public/images/" + variant.Product + "/" + variant._id + "/" + image)
            );
        });
    }

    req.responseData = {
        message: "Variant was updated successfully!",
        data: variant,
    };

    next();
};

exports.deleteVariant = async (req, res, next) => {
    const id = req.params.id;
    await variantService.deleteVariant(id);
    req.responseData = {
        message: "Variant was deleted successfully!",
    };
    next();
};

exports.searchVariants = async (req, res, next) => {
    const filters = {
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        color: req.query.color,
        ram: req.query.ram,
        storage: req.query.storage,
        status: req.query.status,
        barcode: req.query.barcode,
    };

    const variants = await variantService.searchVariants(filters);

    if (variants.length === 0) {
        req.responseData = {
            status: 404,
            message: "No variants found!",
            data: [],
        };
        return next();
    }

    const variant = variants[0];
    variant.images = variant.images[0];

    req.responseData = {
        message: "Variants retrieved successfully!",
        data: variant,
    };
    next();
};
