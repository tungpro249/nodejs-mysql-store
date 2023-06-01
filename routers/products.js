const express = require("express");
const {getAllProducts, addNewProduct, updateProduct} = require("../controllers/productController");
const router = express.Router();

router.get("/get-products", getAllProducts);
router.post("/add-product",  addNewProduct);
router.put(`/update-product/:id`,  updateProduct);
router.delete("/delete-product",  ()=>{});

module.exports = router;
