var express = require("express");
var router = express.Router();
const userController = require("../controllers/userController");
const { errorWrapper } = require("../handlers/errorHandlers");

router.post("/signup", errorWrapper(userController.signupUser));
router.post("/login", errorWrapper(userController.loginUser));

module.exports = router;
