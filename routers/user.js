const express = require("express");
const {addNewUser, loginUser} = require("../controllers/userController");
const router = express.Router();

router.post("/register", addNewUser);
router.post("/login",  loginUser);

module.exports = router;
