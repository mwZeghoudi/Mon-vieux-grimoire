const express = require("express");
const router = express.Router();
const bookController = require("../controllers/books.controller");

// GET
router.get("/books", bookController.listAction);
router.get("/books/:id", bookController.getAction);
router.get("/books/bestrating", bookController.bestListAction);

// POST
router.post("/books", bookController.addAction);
router.post("/books/:id/rating", bookController.addRatingAction);

// EDIT
router.put("/books/:id", bookController.editAction);

// DELETE
router.delete("/books/:id", bookController.editAction);

module.exports = router;
