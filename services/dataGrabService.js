const axios = require("axios");

const options = {
  method: "GET",
  url: "https://rapidapi.p.rapidapi.com/",
  params: {
    "q-country_cont": "null",
    limit: "1000",
  },
  headers: {
    "x-rapidapi-key": process.env.TRAILS_API_KEY,
    "x-rapidapi-host": "trailapi-trailapi.p.rapidapi.com",
  },
};

const grabData = async () => {
  const res = await axios.request(options);

  if (res.error) {
    console.log(error);
  }

  const data = res.data;
  const trails = data.places;

  return trails;
};

module.exports = grabData;
