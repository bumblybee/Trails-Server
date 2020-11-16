const Trail = require("../db").Trail;
const sequelize = require("sequelize");

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

  const trails = await Trail.findAll({
    attributes: {
      include: [[distance, "distance"]],
    },
    order: distance,
    limit: 25,
  });

  res.json(trails);
};

//TODO: Change http in images from external api to https so don't run into cors issues later in prod
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
    directions,
  } = req.body;

  console.log(req.file);

  const url = `${req.protocol}://${req.get("host")}`;
  const image = `${url}/${req.file.filename}`;

  const point = { type: "Point", coordinates: [lng, lat] };

  const newTrail = {
    userId,
    name,
    city,
    state,
    lnglat: point,
    hiking,
    biking,
    image,
    length,
    rating,
    description,
    directions,
  };

  // const trail = await Trail.create(newTrail);

  res.status(200).json({ newTrail });
};
