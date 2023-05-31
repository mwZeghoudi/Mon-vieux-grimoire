const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const bookController = require("../controller/books.controller");

// POST
router.post("/", auth, bookController.addAction);
router.post("/:id/rating", auth, bookController.addRatingAction);

// EDIT
router.put("/:id", auth, bookController.editAction);

// DELETE
router.delete("/:id", auth, bookController.deleteAction);

// GET
router.get("/", auth, bookController.listAction);
router.get("/:id", auth, bookController.getAction);
router.get("/bestrating", auth, bookController.bestListAction);

module.exports = router;
