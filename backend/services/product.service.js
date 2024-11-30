const Product = require("../models/Product");
const CustomError = require("../errors/CustomError");
const mongoose = require("mongoose");
require("express-async-errors");

module.exports.createProduct = async (data) => {
    const { productName, category, description } = data;

    if (!productName || !category) {
        throw new CustomError("Content can not be empty!", 400);
    }

    const productData = {
        productName,
        category,
        createdAt: new Date(),
    };

    // Only add description if it's provided
    if (description) {
        productData.description = description;
    }

    const product = new Product(productData);

    return await product.save().catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
            throw new CustomError("Validation Error", 400);
        } else {
            throw new Error();
        }
    });
};

module.exports.searchProducts = async (productName) => {
    if (!productName) {
        throw new CustomError("Product name is required for search.", 400);
    }

    // Create a case-insensitive regular expression for partial match
    const regex = new RegExp(productName, "i"); // "i" flag makes the search case-insensitive

    return await Product.find({ productName: { $regex: regex } }).catch((err) => {
        throw new CustomError(err.message || "Some error occurred while retrieving products.");
    });
};

module.exports.showProducts = async (page = 1, limit = 10, productName, categories) => {
    // Calculate how many products to skip based on the page number

    const query = {};

    // Add product name filtering if provided
    if (productName) {
        query.productName = { $regex: productName, $options: "i" }; // Case-insensitive search
    }

    // Add category filtering if provided
    if (categories && Array.isArray(categories) && categories.length > 0) {
        query.category = { $in: categories }; // Match any of the provided categories
    }
    const skip = (page - 1) * limit;
    const products = await Product.find(query)
        .skip(skip)
        .limit(limit)
        .catch((err) => {
            throw new CustomError(err.message || "Some error occurred while retrieving products.");
        });
    const totalProducts = await Product.countDocuments(query);

    return { products, currentPage: page, totalPages: Math.ceil(totalProducts / limit), totalProducts };
};

module.exports.showProduct = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new CustomError("Invalid product ID format", 400);
    }
    const product = await Product.findById(id);
    if (!product) {
        throw new CustomError("Product not found!", 404);
    }
    return product;
};

module.exports.updateProduct = async (id, data) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new CustomError("Invalid product ID format", 400);
    }
    const { productName, category, description } = data;

    if (!productName || !category) {
        throw new CustomError("Content can not be empty!", 400);
    }

    const product = await Product.findById(id);
    if (!product) throw new CustomError("Product not found!", 404);

    return await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true }).catch((err) => {
        if (err instanceof mongoose.Error.CastError) {
            throw new CustomError("Cast Error", 400);
        } else if (err instanceof mongoose.Error.ValidationError) {
            throw new CustomError(err._message, 400);
        } else {
            throw new Error();
        }
    });
};

module.exports.deleteProduct = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new CustomError("Invalid product ID format", 400);
    }
    const product = await Product.findById(id);
    if (!product) {
        throw new CustomError("Product not found!", 404);
    }

    await Product.findByIdAndDelete(id).catch((err) => {
        throw new CustomError(err.message || "Some error occurred while deleting the Product.");
    });
};
