var express = require("express");
var router = express.Router();
const { upload } = require("../config/multerConfig");
const trailsController = require("../controllers/trailsController");

router.get("/", trailsController.getTrails);

router.post("/", upload, trailsController.createTrail);

module.exports = router;
