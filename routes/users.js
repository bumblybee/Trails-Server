var express = require("express");
var router = express.Router();
const { isAuth } = require("../middleware/isAuth");
const userController = require("../controllers/userController");
const { errorWrapper } = require("../handlers/errorHandlers");

router.get("/current", isAuth, userController.getCurrentUser);

router.post("/signup", errorWrapper(userController.signupUser));

router.post("/login", errorWrapper(userController.loginUser));

module.exports = router;
