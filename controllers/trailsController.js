const Trail = require("../db").Trail;
const { CustomError } = require("../handlers/errorHandlers");
const sequelize = require("sequelize");
const { Op } = require("sequelize");

exports.searchTrails = async (req, res) => {
  //TODO: Check using query vs params

  const { lng, lat } = req.query;

  const location = sequelize.literal(
    `ST_GeomFromText('POINT(${lng} ${lat})', 4326)`
  );

  //TODO: figure out fn for max distance
  const distance = sequelize.fn(
    "ST_DistanceSphere",
    sequelize.literal("lnglat"),
    location
  );

  const whereConfig = {};
  if (req.query.filter) {
    if (req.query.filter === "hiking") {
      whereConfig.hiking = true;
    } else if (req.query.filter === "biking") {
      whereConfig.biking = true;
    }
  }
  //TODO: config for sending image to client via s3
  const trails = await Trail.findAll({
    where: whereConfig,
    attributes: {
      include: [[distance, "distance"]],
    },
    order: distance,
    limit: 25,
  });

  res.json(trails);
};

exports.createTrail = async (req, res) => {
  // throw new CustomError("upload.failed", "UploadError", 400);
  const {
    userId,
    name,
    city,
    state,
    lat,
    lng,
    hiking,
    biking,
    length,
    rating,
    description,
    difficulty,
  } = req.body;
  console.log(req.body);

  if (!hiking) hiking = false;
  if (!biking) biking = false;

  const imageUrl = req.file ? req.file.location : null;

  const point = { type: "Point", coordinates: [lng, lat] };

  const newTrail = {
    userId,
    name,
    city,
    state,
    lnglat: point,
    hiking,
    biking,
    image: imageUrl,
    length,
    rating,
    description,
    difficulty: difficulty.toLowerCase(),
  };

  const trail = await Trail.create(newTrail);

  res.status(201).json(trail);
};
