const fs = require("fs");
// Import Entity
const Book = require("../models/book.model");

// Connect DB
const db = require("../config/db");

// GET
// GET ALL
exports.listBooksAction = async (req, res) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// GET BY ID
exports.getBookAction = async (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

// GET BY ATTRIBUTES
exports.bestRatingsListAction = async (req, res) => {
  try {
    const books = await Book.find();
    const sortedBooks = books.sort((a, b) => b.averageRating - a.averageRating);
    const top3Books = sortedBooks.slice(0, 3);

    res.status(200).json(top3Books);
  } catch (error) {
    res.status(400).json({ error });
  }
};

// POST
exports.addBookAction = async (req, res) => {
  const bookObject = JSON.parse(req.body.book);
  const verifiedId = req.auth.userId;
  bookObject.ratings[0].userId = verifiedId;

  delete bookObject.userId;
  delete bookObject._id;
  const filename = req.file.filename;
  const filenameArray = filename.split(".");
  filenameArray.pop();
  const filenameWithoutExtension = filenameArray.join(".");

  const book = new Book({
    ...bookObject,
    userId: verifiedId,
    imageUrl: `${req.protocol}://${req.get(
      "host"
    )}/images/${filenameWithoutExtension}.webp`,
  });

  book
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

// POST Rating
exports.addRatingAction = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      return res.status(404).json({ error: "Livre non trouvé" });
    }
    const ratings = book.ratings;
    let avrRating = 0;
    let isRated = false;
    ratings.forEach((e, i) => {
      if (e.userId == req.body.userId) {
        isRated = true;
        e.grade = req.body.rating;
      }
      avrRating += e.grade;
    });
    if (!isRated) {
      avrRating += req.body.rating;
      ratings.push({
        userId: req.body.userId,
        grade: req.body.rating,
      });
      book.ratings = ratings;
    }

    book.averageRating = avrRating / book.ratings.length;

    await book.save();
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error });
  }
};

// PUT
exports.editOneBookAction = async (req, res) => {
  let book = req.body;
  if (req.body.book) {
    book = JSON.parse(req.body.book);
    const filename = req.file.filename;
    const filenameArray = filename.split(".");
    filenameArray.pop();
    const filenameWithoutExtension = filenameArray.join(".");
    book = {
      ...book,
      imageUrl: `${req.protocol}://${req.get(
        "host"
      )}/images/${filenameWithoutExtension}.webp`,
    };
  }
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      const filePath = book.imageUrl.split("/images/").pop(0);
      fs.unlinkSync(`images/${filePath}`);
    })
    .catch((error) => res.status(404).json({ error }));

  Book.updateOne({ _id: req.params.id }, { ...book, _id: req.params.id })
    .then((book) => res.status(200).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

// DELETE
exports.deleteOneBookAction = async (req, res) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};
