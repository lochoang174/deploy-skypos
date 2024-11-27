const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");

const variantController = require("../controllers/variant.controller");

router.post("/", upload.array("images", 10), variantController.createVariant);
router.get("/", variantController.showVariants);
router.get("/search", variantController.searchVariants);
router.get("/product/:productId", variantController.showVariantByProductId);
router.get("/detail/:id", variantController.showVariant);
router.put("/:id", upload.array("images", 10), variantController.updateVariant);
router.delete("/:id", variantController.deleteVariant);

module.exports = router;
