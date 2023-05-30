const express = require("express");
const {addNewUser, loginUser} = require("../controllers/userController");
const router = express.Router();

router.post("/api/register", addNewUser);
router.post("/api/login",  loginUser);

module.exports = router;
