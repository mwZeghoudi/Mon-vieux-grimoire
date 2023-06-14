const express = require("express");
const router = express.Router();
const userController = require("../controller/users.controller");
const validateInputs = require("../middleware/req.validator");

router.post("/login", validateInputs, userController.loginAction);
router.post("/signup", validateInputs, userController.signupAction);

module.exports = router;
