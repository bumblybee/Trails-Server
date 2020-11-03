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

    const activities = getActivities(places[i].activities);

    const { name, country, city, lat, lon, description, directions } = places[
      i
    ];

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

  res.json(result);
};

const getActivities = (activities) => {
  return activities.map((activity) => {
    const {
      activity_type_name,
      thumbnail,
      description,
      length,
      rating,
    } = activity;
    return {
      type: activity_type_name,
      image: thumbnail,
      description: description,
      length: length,
      rating: rating,
    };
  });
};
