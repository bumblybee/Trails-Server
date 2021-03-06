var express = require("express");
var router = express.Router();
const { isAuth } = require("../middleware/isAuth");
const userController = require("../controllers/userController");
const { errorWrapper } = require("../handlers/errorHandlers");

router.get("/current", isAuth, userController.getCurrentUser);

router.post("/signup", errorWrapper(userController.signupUser));

router.post("/login", errorWrapper(userController.loginUser));

router.post("/logout", userController.logoutUser);

router.post(
  "/reset-password",
  errorWrapper(userController.generatePasswordResetLink)
);

router.post(
  "/reset-password/:token",
  errorWrapper(userController.resetPassword)
);

// router.post("/bookmark/:id", isAuth, userController.bookMarkTrail);

// router.post("/remove-bookmark/:id", isAuth, userController.removeBookmark);

module.exports = router;
