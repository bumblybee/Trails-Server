var express = require("express");
var router = express.Router();
const editController = require("../controllers/editController");
const { errorWrapper } = require("../handlers/errorHandlers");
const { isAuth } = require("../middleware/isAuth");
const { authRole } = require("../middleware/authRole");
const roles = require("../enums/roles");

router.get(
  "/:trailId",
  isAuth,
  authRole(roles.Admin),
  editController.getSuggestedEdits
);
module.exports = router;
