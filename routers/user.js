const express = require("express");
const {addNewUser, loginUser, changePassword} = require("../controllers/userController");
const router = express.Router();

router.post("/register", addNewUser);
router.post("/login", loginUser);
router.post("/change-password", changePassword);

module.exports = router;
