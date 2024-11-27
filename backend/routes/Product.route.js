const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

router.post("/", productController.createProduct);
router.get("/", productController.showProducts);
router.get("/search", productController.searchProducts);
router.get("/detail/:id", productController.showProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
//search product by barcode

module.exports = router;
