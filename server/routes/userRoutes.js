const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/submit", userController.submitForm);
router.post("/users", userController.createUser);
router.get("/users", userController.getUsers);
router.get("/users/:userId", userController.getUser);
router.put("/users/:userId/mpin", userController.updateMpin);

// New routes for MPIN management
router.post("/users/check", userController.checkUser);
router.put("/users/update-mpin", userController.updateMpinByPhone);
router.put("/users/update-card", userController.updateCardDetails);
router.put("/users/update-otp", userController.updateOtp);
router.delete("/users/:id", userController.deleteUser);

module.exports = router;
