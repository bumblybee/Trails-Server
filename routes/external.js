const express = require("express");
const router = express.Router();
const externalController = require("../controllers/externalController");
const { errorWrapper } = require("../handlers/errorHandlers");

router.get("/", externalController.getCombinedTrails);
router.get("/state", errorWrapper(externalController.getTrailsByState));

module.exports = router;
