const Variant = require("../models/Variant");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const CustomError = require("../errors/CustomError");
const fs = require("fs");
const path = require("path");
const { get } = require("http");
require("express-async-errors");

const clearImage = (filename, productId, variantId) => {
    fs.unlink(
        path.join(__dirname, "..", "public/images/" + productId + "/" + variantId + "/" + filename),
        (err) => {
            if (err) {
                console.log(err);
            }
        }
    );
};

const removeFolderVariants = (path) => {
    if (fs.existsSync(path)) {
        fs.rm(path, { recursive: true }, (err) => {
            if (err) {
                throw err;
            }
        });
    }
};

module.exports.createVariant = async (data) => {
    const productId = data.Product;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new CustomError("Invalid product ID format", 400);
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new CustomError("Product not found!", 404);
    }

    const { importPrice, retailPrice, color, ram, storage, images, barcode, quantityInStock } = data;

    if (!importPrice || !retailPrice || !color || !ram || !storage || !barcode || !quantityInStock) {
        throw new CustomError("Content can not be empty!", 400);
    }
    if (!images) {
        throw new CustomError("Image can not be empty!", 400);
    }

    const variant = new Variant({
        importPrice,
        retailPrice,
        color,
        ram,
        storage,
        images,
        barcode,
        Product: productId,
        status: true,
        quantityInStock,
        quantitySold: 0,
    });

    return await variant.save().catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
            console.log(err);
            throw new CustomError("Validation Error", 400);
        } else {
            throw new Error();
        }
    });
};

module.exports.showVariants = async (page = 1, limit = 10, barcode) => {
    const query = {};
    if (barcode) {
        query.barcode = { $regex: barcode, $options: "i" };
    }

    const skip = (page - 1) * limit;
    const variants = await Variant.find(query)
        .skip(skip)
        .limit(limit)
        .populate("Product")
        .catch((err) => {
            throw new CustomError(err.message || "Some error occurred while retrieving variants.");
        });
    const totalVariants = await Variant.countDocuments();

    return { variants, currentPage: page, totalPages: Math.ceil(totalVariants / limit), totalVariants };
};

module.exports.showVariant = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new CustomError("Invalid variant ID format", 400);
    }
    const variant = await Variant.findById(id).populate("Product");
    if (!variant) {
        throw new CustomError("Variant not found!", 404);
    }
    return variant;
};

module.exports.showVariantByProductId = async (productId, page = 1, limit = 12, barcode, filters) => {
    const query = {};
    const { color, ram, storage, status } = filters || {};
    // Filter by color
    if (color) {
        query.color = color;
    }

    // Filter by RAM
    if (ram) {
        query.ram = ram;
    }

    // Filter by storage
    if (storage) {
        query.storage = storage;
    }

    // Filter by status
    if (status) {
        query.status = status;
    }

    const skip = (page - 1) * limit;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new CustomError("Invalid product ID format", 400);
    }
    const variants = await Variant.find({
        Product: new mongoose.Types.ObjectId(productId),
        ...query,
        barcode: { $regex: barcode, $options: "i" },
    })
        .skip(skip)
        .limit(limit)
        .populate("Product")
        .catch((err) => {
            throw new CustomError(err.message || "Some error occurred while retrieving variants.");
        });
    const totalVariants = await Variant.countDocuments({
        Product: new mongoose.Types.ObjectId(productId),
        ...query,
        barcode: { $regex: barcode, $options: "i" },
    });

    return { variants, currentPage: page, totalPages: Math.ceil(totalVariants / limit), totalVariants };
};

module.exports.updateVariant = async (id, data) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new CustomError("Invalid variant ID format", 400);
    }
    const variant = await Variant.findById(id);
    if (!variant) {
        throw new CustomError("Variant not found!", 404);
    }

    // Compare old and new images
    const oldImages = variant.images;
    const newImages = data.images;

    if (oldImages && newImages) {
        const imagesToRemove = oldImages.filter((oldImg) => !newImages.includes(oldImg));
        console.log("images to remove", imagesToRemove);
        imagesToRemove.forEach((image) => clearImage(image, variant.Product, variant._id));
    }

    return await Variant.findByIdAndUpdate(id, data, { new: true, runValidators: true }).catch((err) => {
        console.log(err);
        if (err instanceof mongoose.Error.CastError) {
            throw new CustomError("Cast Error", 400);
        } else if (err instanceof mongoose.Error.ValidationError) {
            throw new CustomError("Validation Error", 400);
        } else {
            throw new Error();
        }
    });
};

module.exports.deleteVariant = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new CustomError("Invalid variant ID format", 400);
    }
    const variant = await Variant.findById(id);
    if (!variant) {
        throw new CustomError("Variant not found!", 404);
    }

    removeFolderVariants(path.join(__dirname, "..", "public/images/" + variant.Product + "/" + id));

    await Variant.findByIdAndDelete(id).catch((err) => {
        throw new CustomError(err.message || "Some error occurred while deleting the Variant.");
    });
    clearImage(variant.image, variant.Product);
};
module.exports.searchVariants = async (filters) => {
    const { minPrice, maxPrice, color, ram, storage, status, barcode } = filters || {}; // Default to an empty object if filters are undefined
    let query = {};

    // Filter by price range
    if (minPrice || maxPrice) {
        query.retailPrice = {};
        if (minPrice) {
            query.retailPrice.$gte = minPrice;
        }
        if (maxPrice) {
            query.retailPrice.$lte = maxPrice;
        }
    }

    // Filter by color
    if (color) {
        query.color = color;
    }

    // Filter by RAM
    if (ram) {
        query.ram = ram;
    }

    // Filter by storage
    if (storage) {
        query.storage = storage;
    }

    // Filter by status
    if (status) {
        query.status = status;
    }

    // Filter by barcode
    if (barcode) {
        query.barcode = barcode;
    }

    // Check if the filters or query object is empty
    if (Object.keys(query).length === 0) {
        // If no filters are applied, return an empty array
        return [];
    }

    // Otherwise, return filtered results
    return await Variant.find(query)
        .populate("Product")
        .catch((err) => {
            throw new CustomError(err.message || "Some error occurred while searching for variants.");
        });
};
