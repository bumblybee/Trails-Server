const multer = require("multer");
const crypto = require("crypto");

const randomId = crypto.randomBytes(2).toString("hex");

//TODO: manipulate filename before storing, maybe use uuid
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  // To ensure uniqueness - splitting filename at dots, grabbing first three chars + randomId + extension
  filename: (req, file, cb) => {
    cb(
      null,
      file.originalname.split(".")[0].substring(0, 3) +
        randomId +
        "." +
        file.originalname.split(".")[1]
    );
  },
});

//Set image size limit to 5mb and make sure it's an image
const options = {
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: (req, file, next) => {
    const isPhoto = file.mimetype.startsWith("image/");
    if (isPhoto) {
      next(null, true);
    } else {
      next(new Error("File type not allowed"), false);
    }
  },
};

exports.upload = multer(options).single("image");
