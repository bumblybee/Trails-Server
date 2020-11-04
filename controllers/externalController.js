const axios = require("axios");

//TODO: This prob shouldn't be connected to a route when adding to db - call function and store data sans route
exports.getData = async (req, res) => {
  const options = {
    method: "GET",
    url: "https://rapidapi.p.rapidapi.com/",
    params: {
      "q-country_cont": "null",
      limit: "20",
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

    if (places[i].lat === 0 || places[i].lon === 0) {
      continue;
    }

    const activities = getActivities(places[i].activities);

    let { name, city, state, lat, lon, directions } = places[i];

    const newSchema = {
      name,
      city,
      state,
      lat,
      lon,
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
