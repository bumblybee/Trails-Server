var express = require("express");
var router = express.Router();
const { errorWrapper } = require("../handlers/errorHandlers");
const { isAuth } = require("../middleware/isAuth");
const { authRole } = require("../middleware/authRole");
const roles = require("../enums/roles");

const { upload } = require("../middleware/multerUpload");

const trailsController = require("../controllers/trailsController");

router.get("/search", trailsController.searchTrails);

router.get("/:id", trailsController.getSingleTrail);

router.get("/scouted/:id", isAuth, trailsController.getScoutedTrails);

router.post(
  "/suggest-edit",
  isAuth,
  errorWrapper(trailsController.suggestTrailEdit)
);

router.post("/", [upload, isAuth], errorWrapper(trailsController.createTrail));

module.exports = router;
