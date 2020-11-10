const Trail = require("../db").Trail;

exports.getTrails = (req, res) => {
  const trails = [
    {
      name: "George Wyth",
      city: "Cedar Falls",
      length: 7,
      description: "Stuff about trail",
    },
    {
      name: "Black Hawk",
      city: "Cedar Falls",
      length: 4,
      description: "Stuff about trail",
    },
  ];

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
  const imagePath = `${url}/${req.file.filename}`;

  const point = { type: "Point", coordinates: [lng, lat] };

  const newTrail = {
    userId,
    name,
    city,
    state,
    lnglat: point,
    hiking,
    biking,
    image: imagePath,
    length,
    rating,
    description,
    directions,
  };

  // const trail = await Trail.create(newTrail);

  res.status(200).json({ newTrail });
};
