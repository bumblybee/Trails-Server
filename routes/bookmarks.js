const express = require("express");
const router = express.Router();
const bookmarksController = require("../controllers/bookmarksController");
const { isAuth } = require("../middleware/isAuth");
const { errorWrapper } = require("../handlers/errorHandlers");

router.get("/", isAuth, bookmarksController.getBookmarks);

router.get("/latest", bookmarksController.latestBookmarks);

router.post(
  "/create/:userId/:trailId",
  isAuth,
  errorWrapper(bookmarksController.createBookmark)
);

router.post(
  "/remove/:userId/:trailId",
  isAuth,
  bookmarksController.removeBookmark
);

module.exports = router;
