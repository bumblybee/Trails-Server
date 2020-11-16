const axios = require("axios");

const combinedOptions = {
  method: "GET",
  url: "https://rapidapi.p.rapidapi.com/",
  params: {
    "q-country_cont": "null",
    //TODO: change to max 1500 when doing final store
    limit: "400",
  },
  headers: {
    "x-rapidapi-key": process.env.TRAILS_API_KEY,
    "x-rapidapi-host": "trailapi-trailapi.p.rapidapi.com",
  },
};

exports.grabCombinedData = async () => {
  const res = await axios.request(combinedOptions);

  if (res.error) {
    console.log(res.error);
  }

  const trails = res.data.places;

  return trails;
};

exports.grabBikingData = async (lat, lng) => {
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
    console.log(res.error);
  }

  const trails = res.data.data;

  return trails;
};

exports.grabHikingData = async (lat, lng) => {
  const res = await axios.request({
    method: "GET",
    url: "https://www.hikingproject.com/data/get-trails",
    params: {
      lat: lat,
      lon: lng,
      maxDistance: "200",
      key: process.env.HIKING_API_KEY,
    },
  });

  if (res.error) {
    console.log(res.error);
  }

  const trails = res.data.trails;
  return trails;
};
