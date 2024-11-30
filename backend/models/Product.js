var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ProductSchema = new Schema({
    productName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
});

module.exports = mongoose.model("Product", ProductSchema);
