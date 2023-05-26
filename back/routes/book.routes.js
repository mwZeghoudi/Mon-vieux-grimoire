const express = require("express");
const router = express.Router();
const bookController = require("../controller/books.controller");

// POST
router.post("/", bookController.addAction);
router.post("/:id/rating", bookController.addRatingAction);

// GET
router.get("/", bookController.listAction);
router.get("/:id", bookController.getAction);
router.get("/bestrating", bookController.bestListAction);

// EDIT
router.put("/:id", bookController.editAction);

// DELETE
router.delete("/:id", bookController.editAction);

module.exports = router;
