const axios = require("axios");

exports.getData = (req, res) => {
  var options = {
    method: "GET",
    url: "https://rapidapi.p.rapidapi.com/",
    params: {
      "q-activities_activity_type_name_eq": "null",
      "q-city_cont": "null",
      "q-state_cont": "null",
      "q-country_cont": "null",
      limit: "10",
    },
    headers: {
      "x-rapidapi-key": process.env.TRAILS_API_KEY,
      "x-rapidapi-host": "trailapi-trailapi.p.rapidapi.com",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      res.json(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
};
