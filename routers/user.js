const express = require("express");
const {addNewUser, loginUser, changePassword, forgotPassword, resetPassword, changeInfo} = require("../controllers/userController");
const router = express.Router();

router.post("/register", addNewUser);
router.post("/login", loginUser);
router.post("/change-password", changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put('/change-info/:id', changeInfo);


module.exports = router;
