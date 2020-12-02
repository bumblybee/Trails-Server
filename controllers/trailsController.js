const Trail = require("../db").Trail;
const sequelize = require("sequelize");
const { uploadToS3 } = require("../services/s3Service");
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
  } = req.body;

  console.log(req.file);

  // const url = `${req.protocol}://${req.get("host")}`;
  // const image = `${url}/${req.file.filename}`;

  const s3Response = await uploadToS3(req.file);
  const s3ImageUrl = s3Response.Location;

  const point = { type: "Point", coordinates: [lng, lat] };

  // TODO: bring in multer config code to append an id to image before store
  // const newTrail = {
  //   userId,
  //   name,
  //   city,
  //   state,
  //   lnglat: point,
  //   hiking,
  //   biking,
  //   image,
  //   length,
  //   rating,
  //   description,
  // };

  // const trail = await Trail.create(newTrail);
  res.status(201).send(s3Response);
  // res.status(201).json({ newTrail });
};
