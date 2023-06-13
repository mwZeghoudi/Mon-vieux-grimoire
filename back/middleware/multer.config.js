const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};



const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const filename = file.originalname.split(" ").join("_");
    const filenameArray = filename.split(".");
    filenameArray.pop();
    const filenameWithoutExtension = filenameArray.join(".");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, `${filenameWithoutExtension}-${Date.now()}.${extension}`);
  },
});

const upload = multer({ storage: storage }).single("image");

module.exports = upload;

// Middleware de traitement d'image
module.exports.processImage = (req, res, next) => {
  if (!req.file) {
    // Aucun fichier image trouvé
    return res.status(400).json({ error: "Aucun fichier image trouvé." });
  }

  // Vérifier si le format d'image est pris en charge
  if (!Object.keys(MIME_TYPES).includes(req.file.mimetype)) {
    return res
      .status(400)
      .json({ error: "Format d'image non pris en charge." });
  }

  // Utiliser Sharp pour compresser l'image
  if (req.file.mimetype === "image/webp") {
    // Utiliser Sharp pour redimensionner uniquement
    const tempFilePath = path.join("images", `${Date.now()}-temp.webp`);
    sharp(req.file.path)
      .resize(500, null)
      .toFile(tempFilePath, (error) => {
        if (error) {
          console.error(error);
          return res
            .status(500)
            .json({ error: "Erreur lors du redimensionnement de l'image." });
        }
        // Supprimer le fichier d'origine
        fs.unlinkSync(req.file.path);
        // Renommer le fichier temporaire avec le même nom que le fichier original
        fs.renameSync(tempFilePath, req.file.path);
        next();
      });
  } else {
    sharp(req.file.path)
      .resize(500, null)
      .toFile(req.file.path.replace(/\.[^.]+$/, ".webp"))
      .then(() => {
        // Supprimer le fichier d'origine
        fs.unlinkSync(req.file.path);
        next();
      })
      .catch((error) => {
        console.error(error);
        return res
          .status(500)
          .json({ error: "Erreur lors de la compression de l'image." });
      });
  }
};
