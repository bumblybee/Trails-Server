const express = require("express");
const router = express.Router();
const seedController = require("../controllers/seedController");
const { errorWrapper } = require("../handlers/errorHandlers");

//TODO: if leaving api calls attached to routes, verify auth to access

router.get("/combined", errorWrapper(seedController.getCombinedTrails));
router.get("/biking", errorWrapper(seedController.getBikingByState));
router.get("/hiking", errorWrapper(seedController.getHikingByState));

module.exports = router;
