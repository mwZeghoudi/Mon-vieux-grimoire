const fs = require("fs");
const emailRegex = /^\S+@\S+\.[a-zA-Z]{2,3}$/;
const passwordRegex = /^\S+$/;
const imageFormatRegex = /\.(jpg|jpeg|png|webp)$/i;
const yearRegex = /^\d{4}$/;

module.exports = (req, res, next) => {

  let reqObject = req.body;
  if (reqObject.book) {
    reqObject = JSON.parse(req.body.book);
  }
  function deleteImage() {
    fs.unlinkSync(req.file.path);
  }

  reqObject.title ? reqObject.title = reqObject.title.replace(/[^a-zA-Z0-9\s]/g, "") : null;
  reqObject.author ? reqObject.author = reqObject.author.replace(/[^a-zA-Z0-9\s]/g, "") : null;
  reqObject.genre ? reqObject.genre = reqObject.genre.replace(/[^a-zA-Z0-9\s]/g, "") : null;

  if (reqObject.email && !emailRegex.test(reqObject.email)) {
    return res.status(400).json({ error: "Format d'email invalide." });
  }

  if (reqObject.password && !passwordRegex.test(reqObject.password)) {
    return res.status(400).json({ error: "Format du mot de passe invalide." });
  }

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
  req.controledBody = reqObject;
  next();
};
