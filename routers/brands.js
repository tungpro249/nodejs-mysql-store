const express = require("express");
const {
  getAllBrands,
  addNewBrand,
  updateBrand,
  deleteBrand,
  upload,
} = require("../controllers/brandController.js");
const router = express.Router();

router.get("/get-brands", getAllBrands);
router.post("/add-brand", upload.single("image"), addNewBrand);
router.put(`/update-brand/:id`, upload.single("image"), updateBrand);
router.delete("/delete-brand/:id", deleteBrand);

module.exports = router;
