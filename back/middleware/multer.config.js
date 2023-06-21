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

// Middleware catch and save picture
module.exports = upload;

// Middleware picture settings
module.exports.processImage = (req, res, next) => {
  // No file found
  if (!req.file && req.method == "POST") {
    return res.status(400).json({ error: "Aucun fichier image trouvé." });
  } else if (!req.file && req.method == "PUT") {
    return next();
  }

  if (!Object.keys(MIME_TYPES).includes(req.file.mimetype)) {
    return res
      .status(400)
      .json({ error: "Format d'image non pris en charge." });
  }

  // Use Sharp to edit pictures
  if (req.file.mimetype === "image/webp") {
    // Only resize 
    const tempFilePath = path.join("images", `${Date.now()}-temp.webp`);
    sharp(req.file.path)
      .resize(500, null)
      .toFile(tempFilePath, (error) => {
        if (error) {
          console.error(error);
          return res
            .status(500)
            .json({ error: "Erreur lors de la compression de l'image." });
        }
        // Delete original file and rename the new one 
        fs.unlinkSync(req.file.path);
        fs.renameSync(tempFilePath, req.file.path);
        next();
      });
  } else {
    // Resize and change mimetype to webp
    sharp(req.file.path)
      .resize(500, null)
      .toFile(req.file.path.replace(/\.[^.]+$/, ".webp"))
      .then(() => {
        // Delete original file
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
