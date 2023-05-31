const express = require("express");
const router = express.Router();
const bookController = require("../controller/books.controller");

const auth = require("../middleware/auth");
const multer = require("../middleware/multer.config");

// POST
router.post("/", auth, multer, bookController.addAction);
router.post("/:id/rating", auth, bookController.addRatingAction);

// EDIT
router.put("/:id", auth, multer, bookController.editAction);

// DELETE
router.delete("/:id", auth, bookController.deleteAction);

// GET
router.get("/", auth, bookController.listAction);
router.get("/:id", auth, bookController.getAction);
router.get("/bestrating", auth, bookController.bestListAction);

module.exports = router;
