const express = require("express");
const {
  handleRegisterLoyalCustomer,
} = require("../controllers/loyalCustomerController");
const router = express.Router();

router.post("/register-loyal-customer", handleRegisterLoyalCustomer);

module.exports = router;
