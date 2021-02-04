const express = require("express");
const router = express.Router();
const bookmarksController = require("../controllers/bookmarksController");
const { isAuth } = require("../middleware/isAuth");
const { errorWrapper } = require("../handlers/errorHandlers");

router.post(
  "/create/:id",
  isAuth,
  errorWrapper(bookmarksController.createBookmark)
);

router.post("/remove/:id", isAuth, bookmarksController.removeBookmark);

module.exports = router;
