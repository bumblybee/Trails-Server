var express = require("express");
var router = express.Router();
const { errorWrapper } = require("../handlers/errorHandlers");
const { isAuth } = require("../middleware/isAuth");
const { upload } = require("../middleware/multerUpload");

const trailsController = require("../controllers/trailsController");

router.get("/search", trailsController.searchTrails);

router.get("/:id", trailsController.getSingleTrail);

router.get("/scouted/:id", isAuth, trailsController.getScoutedTrails);

router.post("/", [upload, isAuth], errorWrapper(trailsController.createTrail));

module.exports = router;
