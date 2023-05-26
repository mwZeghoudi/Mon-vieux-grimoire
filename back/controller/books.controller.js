// Import Entity
const Book = require("../models/book.model");

// Connect DB
const db = require("../config/db");

// GET
// GET ALL
exports.listAction = async (req, res, next) => {
  Book.find()
    .then((things) => res.status(200).json(things))
    .catch((error) => res.status(400).json({ error }));
};

// GET BY ID
exports.getAction = async (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((thing) => res.status(200).json(thing))
    .catch((error) => res.status(404).json({ error }));
};

// GET BY ATTRIBUTES 
exports.bestListAction = async (req, res) => {};

// POST 
exports.addAction = async (req, res, next) => {
  const book = new Book({ ...req.body });
  book
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

// PUT/POST ATTRIBUTES 
exports.addRatingAction = async (req, res) => {};

// PUT
exports.editAction = async (req, res) => {};

// DELETE
exports.editAction = async (req, res) => {};
