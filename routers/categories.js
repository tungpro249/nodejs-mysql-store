const express = require("express");
const router = express.Router();

router.get("/get-categories", (res, req) => req.send("huhu"));
router.post("/add-category",  (res, req) => req.send("huhu"));
router.put(`/update-category/:id`,  (res, req) => req.send("huhu"));
router.delete("/delete-category/:id",  (res, req) => req.send("huhu"));

module.exports = router;