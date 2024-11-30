const productService = require("../services/product.service");
const variantService = require("../services/variant.service");
const path = require("path");
const fs = require("fs");
const Variant = require("../models/Variant");
// Create and Save a new Product
exports.createProduct = async (req, res, next) => {
    const product = await productService.createProduct(req.body);

    req.responseData = {
        message: "Product was created successfully!",
        data: {
            product: product,
        },
    };

    next();
};

// Retrieve all Products from the database.
exports.showProducts = async (req, res, next) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 8;
    const productName = req.query.productName;
    const categories = req.query.category ? req.query.category.split(",") : [];

    const products = await productService.showProducts(page, limit, productName, categories);
    req.responseData = {
        message: "Products retrieved successfully!",
        data: products,
    };
    next();
};

// Find a single Product with an id
exports.showProduct = async (req, res, next) => {
    const id = req.params.id;
    const product = await productService.showProduct(id);
    req.responseData = {
        message: "Product was retrieved successfully!",
        data: product,
    };
    next();
};

exports.updateProduct = async (req, res, next) => {
    const id = req.params.id;
    const product = await productService.updateProduct(id, req.body);

    req.responseData = {
        message: "Product was updated successfully!",
        data: product,
    };

    next();
};

exports.deleteProduct = async (req, res, next) => {
    const id = req.params.id;
    await productService.deleteProduct(id);
    await Variant.deleteMany({ Product: id });
    removeFolder(path.resolve("public/images/" + id));
    req.responseData = {
        message: "Product was deleted successfully!",
    };

    next();
};

exports.searchProducts = async (req, res, next) => {
    const productName = req.query.productName;
    const products = await productService.searchProducts(productName);
    req.responseData = {
        message: "Products retrieved successfully!",
        data: products,
    };
    next();
};

exports.filterProducts = async (req, res, next) => {
    const category = req.query.category;
    const products = await productService.filterProducts(category);
    req.responseData = {
        message: "Products retrieved successfully!",
        data: products,
    };
    next();
};

const removeFolder = (path) => {
    if (fs.existsSync(path)) {
        fs.rm(path, { recursive: true }, (err) => {
            if (err) {
                throw err;
            }
        });
    }
};
