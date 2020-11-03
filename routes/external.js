const express = require("express");
const router = express.Router();
const externalController = require("../controllers/externalController");

router.get("/", externalController.getData);

module.exports = router;
