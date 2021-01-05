const multer = require("multer");
const multerS3 = require("multer-s3");
const { s3Config } = require("../config/s3Config");
const crypto = require("crypto");

//* Think about having client handle s3 uploads if going to allow multiple images - slows server down

const randomId = crypto.randomBytes(2).toString("hex");

const multerS3Config = multerS3({
  s3: s3Config,
  acl: "public-read",
  bucket: process.env.S3_BUCKET,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    cb(null, randomId + "-" + file.originalname);
  },
});

//TODO: Custom error fileFilter?
//Set image size limit to 5mb and make sure it's an image
const multerOptions = {
  storage: multerS3Config,
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

exports.upload = multer(multerOptions).single("image");
