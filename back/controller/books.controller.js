// Import Entity
const Book = require("../models/book.model");

// Connect DB
const db = require("../config/db");

// GET
// GET ALL
exports.listAction = async (req, res) => {
  Book.find()
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(400).json({ error }));
};

// GET BY ID
exports.getAction = async (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

// GET BY ATTRIBUTES
exports.bestListAction = async (req, res) => {};

// POST
exports.addAction = async (req, res) => {
  const bookObject = JSON.parse(req.body.book);
  const verifiedId = req.auth.userId;
  bookObject.ratings[0].userId = verifiedId;

  delete bookObject.userId;
  delete bookObject._id;

  console.log(bookObject);

  const book = new Book({
    ...bookObject,
    userId: verifiedId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  book
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

// PUT/POST ATTRIBUTES
exports.addRatingAction = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      return res.status(404).json({ error: "Livre non trouvé" });
    }

    console.log("start");
    const ratings = book.ratings;
    let avrRating = 0;
    let isRated = false;

    ratings.forEach((e, i) => {
      console.log("forEach");
      if (e.userId == req.body.userId) {
        isRated = true;
        e.grade = req.body.rating;
      }
      avrRating += e.grade;
    });

    if (!isRated) {
      console.log("is not rated");
      avrRating += req.body.rating;
      ratings.push({
        userId: req.body.userId,
        grade: req.body.rating,
      });
      book.ratings = ratings;
    }

    avrRating = Math.round(avrRating / book.ratings.length);
    book.averageRating = avrRating;

    console.log(book);
    await book.save();

    res.status(200).json({ message: "Votre note est enregistrée !" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// PUT
exports.editAction = async (req, res) => {
  console.log("ici");
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(400).json({ error }));
};

// DELETE
exports.deleteAction = async (req, res) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};
