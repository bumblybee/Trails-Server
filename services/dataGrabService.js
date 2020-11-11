const axios = require("axios");

//TODO: Figure out if can grab more than 1000 in some way
const combinedOptions = {
  method: "GET",
  url: "https://rapidapi.p.rapidapi.com/",
  params: {
    "q-country_cont": "null",
    limit: "100",
  },
  headers: {
    "x-rapidapi-key": process.env.TRAILS_API_KEY,
    "x-rapidapi-host": "trailapi-trailapi.p.rapidapi.com",
  },
};

const singleStateOptions = {
  method: "GET",
  url: "https://trailapi-trailapi.p.rapidapi.com/trails/explore/",
  // params: { lat: "35.6528", lon: "-97.4781", radius: "100" },
  headers: {
    "x-rapidapi-key": process.env.TRAILS_API_KEY,
    "x-rapidapi-host": "trailapi-trailapi.p.rapidapi.com",
  },
};

exports.grabSingleStateData = async (lat, lng) => {
  const res = await axios.request({
    method: "GET",
    url: "https://trailapi-trailapi.p.rapidapi.com/trails/explore/",
    params: { lat: lat, lon: lng, radius: "100" },
    headers: {
      "x-rapidapi-key": process.env.TRAILS_API_KEY,
      "x-rapidapi-host": "trailapi-trailapi.p.rapidapi.com",
    },
  });

  if (res.error) {
    console.log(error);
  }

  const data = res.data;
  const trails = res.data.data;

  return trails;
};

exports.grabCombinedData = async () => {
  const res = await axios.request(combinedOptions);

  if (res.error) {
    console.log(error);
  }

  const data = res.data;
  const trails = data.places;

  return trails;
};
