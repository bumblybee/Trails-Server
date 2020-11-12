var express = require("express");
var router = express.Router();
const { errorWrapper } = require("../handlers/errorHandlers");
const { upload } = require("../middleware/multerConfig");
const trailsController = require("../controllers/trailsController");

router.get("/", trailsController.getTrails);

router.post("/", upload, errorWrapper(trailsController.createTrail));

module.exports = router;
