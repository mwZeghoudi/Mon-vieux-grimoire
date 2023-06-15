const fs = require("fs");

module.exports = (req, res, next) => {
  const emailRegex = /^\S+@\S+\.[a-zA-Z]{3}$/;
  const imageFormatRegex = /\.(jpg|jpeg|png|webp)$/i;
  const yearRegex = /^\d{4}$/;

  function deleteImage() {
    fs.unlinkSync(req.file.path);
  }

  // Adapter la requete si un fichier y est attacher
  let reqObject = req.body;
  if (reqObject.book) {
    reqObject = JSON.parse(req.body.book);
  }

  // Validation du contenu des input text
  // reqObject.title.replace(/[^a-zA-Z0-9\s]/g, "");
  // reqObject.author.replace(/[^a-zA-Z0-9\s]/g, "");
  // reqObject.genre.replace(/[^a-zA-Z0-9\s]/g, "");

  // Validation de l'email si présent
  if (reqObject.email && !emailRegex.test(reqObject.email)) {
    req.body.book ? deleteImage() : null;
    return res.status(400).json({ error: "Format d'email invalide." });
  }

  // Validation de l'année si présente
  if (
    reqObject.year &&
    !yearRegex.test(reqObject.year) &&
    reqObject.year.length !== 4
  ) {
    req.body.book ? deleteImage() : null;
    return res.status(400).json({
      error:
        "Format d'année invalide. Veuillez entrer une année en 4 chiffres.",
    });
  }

  // Validation du fichier image si présent
  if (req.files && req.files.image) {
    const imageFile = req.files.image;
    const fileExtension = imageFile.name.split(".").pop().toLowerCase();

    if (!imageFormatRegex.test(fileExtension)) {
      req.body.book ? deleteImage() : null;
      return res
        .status(400)
        .json({ error: "Format de fichier d'image non pris en charge." });
    }
  }

  next();
};
