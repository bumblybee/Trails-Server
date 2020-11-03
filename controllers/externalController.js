const axios = require("axios");

exports.getData = async (req, res) => {
  const options = {
    method: "GET",
    url: "https://rapidapi.p.rapidapi.com/",
    params: {
      "q-country_cont": "null",
      limit: "10",
    },
    headers: {
      "x-rapidapi-key": process.env.TRAILS_API_KEY,
      "x-rapidapi-host": "trailapi-trailapi.p.rapidapi.com",
    },
  };

  const response = await axios.request(options);

  const data = response.data;
  const places = data.places;
  let result = [];
  for (let i = 0; i < places.length; i++) {
    if (places[i].country !== "United States") {
      continue;
    }

    if (places[i].activities.length < 1) {
      continue;
    }

    const {
      name,
      country,
      city,
      lat,
      lon,
      description,
      directions,
      activities,
    } = places[i];

    const newSchema = {
      name,
      country,
      city,
      lat,
      lon,
      description,
      directions,
      activities,
    };
    result.push(newSchema);
  }
  // places.forEach((place) => {
  //   //TODO: destructure activities for relevant data
  //   if (place.country !== "United States") {
  //   }
  //   const { name, city, lat, lon, description, directions, activities } = place;
  //   const newSchema = {
  //     name,
  //     city,
  //     lat,
  //     lon,
  //     description,
  //     directions,
  //     activities,
  //   };
  //   result.push(newSchema);
  // });

  res.json(result);
};
