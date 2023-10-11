const express = require("express");
const {getAllProducts, addNewProduct, updateProduct, deleteProduct, getProductDetails, upload} = require("../controllers/productController");
const router = express.Router();

router.get("/get-products", getAllProducts);
router.get("/products/:id", getProductDetails);
router.post('/add-product', upload.single('image'), addNewProduct);
router.put('/update-product/:id', upload.single('image'), updateProduct);
router.delete(`/delete-product/:id`,  deleteProduct);

module.exports = router;
