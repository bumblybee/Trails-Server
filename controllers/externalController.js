const axios = require("axios");

//TODO: This prob shouldn't be connected to a route when adding to db - call function and store data sans route
exports.getData = async (req, res) => {
  const options = {
    method: "GET",
    url: "https://rapidapi.p.rapidapi.com/",
    params: {
      "q-country_cont": "null",
      limit: "25",
    },
    headers: {
      "x-rapidapi-key": process.env.TRAILS_API_KEY,
      "x-rapidapi-host": "trailapi-trailapi.p.rapidapi.com",
    },
  };

  const response = await axios.request(options);

  const data = response.data;
  const places = data.places;
  // let description = "";
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

    if (places[i].description === null) {
      places[i].description = places[i].activities[0].description;
    }

    const activities = getActivities(places[i].activities);

    let { name, city, state, lat, lon, description, directions } = places[i];
    //if place has no activities, skip it
    if (!activities) continue;

    const newSchema = {
      name,
      city,
      state,
      lat,
      lon,
      hiking: activities.hiking,
      biking: activities.biking,
      image: activities.image,
      length: activities.length,
      rating: activities.rating,
      description,
      directions,
    };
    result.push(newSchema);
  }

  res.json(result);
};

const getActivities = (activities) => {
  let hiking = false,
    biking = false,
    image,
    trail_length,
    ratings;

  for (let i = 0; i < activities.length; i++) {
    const { activity_type_name, thumbnail, length, rating } = activities[i];

    image = thumbnail;
    trail_length = length;
    ratings = rating;

    if (activity_type_name === "hiking") {
      hiking = true;
    }

    if (activity_type_name == "mountain biking") {
      biking = true;
    }
  }
  //Weed out camping
  if (hiking === false && biking == false) {
    return;
  } else {
    return {
      hiking,
      biking,

      image,
      length: trail_length,
      rating: ratings,
    };
  }
};
