const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.controller");

router.post("/login", userController.loginAction);
router.post("/signup", userController.signupAction);

module.exports = router;
