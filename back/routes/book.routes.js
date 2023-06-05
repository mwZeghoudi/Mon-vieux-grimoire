const express = require("express");
const router = express.Router();
const bookController = require("../controller/books.controller");

const auth = require("../middleware/auth");
const multer = require("../middleware/multer.config");

// POST
router.post("/", auth, multer, bookController.addAction); // TESTED
router.post("/:id/rating", auth, bookController.addRatingAction); // TESTED

// EDIT
router.put("/:id", auth, multer, bookController.editAction); //TESTED

// DELETE
router.delete("/:id", auth, bookController.deleteAction); //TESTED

// GET
router.get("/", bookController.listAction); //TESTED
router.get("/bestrating", bookController.bestListAction); //TESTED
router.get("/:id", bookController.getAction); //TESTED

module.exports = router;
