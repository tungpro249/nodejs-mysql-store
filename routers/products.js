const express = require("express");
const {getAllProducts, addNewProduct, updateProduct, deleteProduct, getProductDetails} = require("../controllers/productController");
const router = express.Router();

router.get("/get-products", getAllProducts);
router.get("/products/:id", getProductDetails);
router.post("/add-product",  addNewProduct);
router.put(`/update-product/:id`,  updateProduct);
router.delete(`/delete-product/:id`,  deleteProduct);

module.exports = router;
