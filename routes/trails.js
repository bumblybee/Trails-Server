var express = require("express");
var router = express.Router();
const trailsController = require("../controllers/trailsController");

router.get("/", trailsController.getTrails);

module.exports = router;
