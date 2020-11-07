// Using controller and route so I can view data in browser before db storage

const Trail = require("../db").Trail;
const grabData = require("../services/dataGrabService");

//TODO: This prob shouldn't be connected to a route when adding to db - call function and store data sans route
exports.getData = async (req, res) => {
  const trails = await grabData();
  const results = [];

  for (let i = 0; i < trails.length; i++) {
    // Exclude results outside US
    if (trails[i].country !== "United States") {
      continue;
    }

    //Get activities from array
    const activities = getActivities(trails[i].activities);

    //if place has no activities, skip it
    if (!activities) continue;

    //if lat and lng not provided, don't include
    if (trails[i].lat === 0 || trails[i].lon === 0) {
      continue;
    }

    //Use trail activity description if no default description
    if (trails[i].description === null) {
      trails[i].description = trails[i].activities[0].description;
    }

    // If no image url aka the image is stored on the external api server, set to null
    if (activities.image === null || !activities.image.includes("http")) {
      activities.image = null;
    }

    //Grab data from props
    let { name, city, state, lat, lon, description, directions } = trails[i];

    //create schema to push to db
    const newTrail = {
      name,
      city,
      state,
      lat,
      lng: lon,
      hiking: activities.hiking,
      biking: activities.biking,
      image: activities.image,
      length: activities.length,
      rating: activities.rating,
      description,
      directions,
    };

    //add to db here

    const createdTrail = await Trail.create(newTrail);
    //For browser view -- check actual length of results available
    results.push(createdTrail);
  }

  res.json(results);
};

const getActivities = (activities) => {
  // define object props
  let hiking = false,
    biking = false,
    image,
    trail_length,
    ratings;

  // loop acitivities array
  for (let i = 0; i < activities.length; i++) {
    //grab props from activity
    const { activity_type_name, thumbnail, length, rating } = activities[i];

    // set return object props to props from external api activity object
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

  // Don't return object at all if no hiking or biking
  if (hiking === false && biking == false) {
    return;
  } else {
    // return object to store to Trail model
    return {
      hiking,
      biking,
      image,
      length: trail_length,
      rating: ratings,
    };
  }
};
