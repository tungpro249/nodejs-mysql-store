const express = require("express");
const {getAllCategories, addNewCategory, updateCategory} = require("../controllers/categoriesController");
const router = express.Router();

router.get("/get-categories", getAllCategories);
router.post("/add-category",  addNewCategory);
router.put(`/update-category/:id`,  updateCategory);
router.delete("/delete-category/:id",  (res, req) => req.send("huhu"));

module.exports = router;