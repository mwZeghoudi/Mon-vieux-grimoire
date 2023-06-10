const express = require("express");
const router = express.Router();
const bookController = require("../controller/books.controller");

const auth = require("../middleware/auth");
const multer = require("../middleware/multer.config");

// POST
router.post(
  "/",
  auth,
  multer,
  multer.processImage,
  bookController.addBookAction
); // TESTED
router.post("/:id/rating", auth, bookController.addRatingAction); // TESTED

// EDIT
router.put(
  "/:id",
  auth,
  multer,
  multer.processImage,
  bookController.editOneBookAction
); //TESTED

// DELETE
router.delete("/:id", auth, bookController.deleteOneBookAction); //TESTED

// GET
router.get("/", bookController.listBooksAction); //TESTED
router.get("/bestrating", bookController.bestRatingsListAction); //TESTED
router.get("/:id", bookController.getBookAction); //TESTED

module.exports = router;
