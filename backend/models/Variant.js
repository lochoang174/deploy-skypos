var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var VariantSchema = new Schema(
    {
        importPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        retailPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        color: {
            type: String,
            required: true,
        },
        ram: {
            type: Number,
            required: true,
        },
        storage: {
            type: Number,
            required: true,
        },
        images: {
            type: [String],
            required: true,
        },
        barcode: {
            type: String,
            required: true,
        },
        Product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Product",
        },
        status: {
            type: Boolean,
            required: true,
        },
        quantityInStock: {
            type: Number,
            required: true,
        },
        quantitySold: {
            type: Number,
        },
    },
    {
        statics: {
            async findByBarcode(barcode) {
                return await this.findOne({ barcode }).populate("product");
            },

            async createVariant(productId, variantInfo) {
                try {
                    const Product = mongoose.model("Product");
                    const productExists = await Product.exists({ _id: productId });

                    if (!productExists) {
                        throw new Error("Product not found");
                    }

                    const Variant = mongoose.model("Variant");
                    const variant = new Variant(variantInfo);

                    variant.Product = productId;

                    return await variant.save();
                } catch (error) {
                    throw new Error(`Failed to create variant: ${error.message}`);
                }
            },

            // async increment(){},
            async incrementQuantitySold(variantId, amount) {
                return await this.findByIdAndUpdate(variantId, {
                    $inc: {
                        quantityInStock: -amount,
                        quantitySold: amount,
                    },
                });
            },

            async decrementQuantitySold(variantId, amount) {
                return await this.findByIdAndUpdate(variantId, {
                    $inc: {
                        quantityInStock: amount,
                        quantitySold: -amount,
                    },
                });
            },

            async updateQuantitySold(variantId, oldQuantity, newQuantity) {
                return await this.findByIdAndUpdate(variantId, {
                    $inc: {
                        quantityInStock: -newQuantity + oldQuantity,
                        quantitySold: newQuantity - oldQuantity,
                    },
                });
            },

            async updateVariant(variantId, updateData) {
                return await this.findByIdAndUpdate(variantId, updateData, { new: true }).populate("Product");
            },

            async getById(variantId) {
                return await this.findById(variantId).populate("Product");
            },

            async getByProductId(productId) {
                return await this.find({ product: productId }).populate("Product");
            },
        },
    }
);

module.exports = mongoose.model("Variant", VariantSchema);
