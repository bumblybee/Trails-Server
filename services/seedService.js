const Trail = require("../db").Trail;

const parseActivities = (activities) => {
  // define object props
  let hiking = false,
    biking = false,
    image,
    trail_length,
    ratings;

  // loop activities array
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

const parseCombinedTrails = (trails) => {
  const result = [];
  for (let i = 0; i < trails.length; i++) {
    // Exclude results outside US
    if (trails[i].country !== "United States") {
      continue;
    }

    //Get activities from array
    const activities = parseActivities(trails[i].activities);

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

    const point = { type: "Point", coordinates: [lon, lat] };

    //create schema to push to db
    result.push({
      name,
      city,
      state,
      lnglat: point,
      hiking: activities.hiking,
      biking: activities.biking,
      image: activities.image,
      length: activities.length,
      rating: activities.rating,
      description,
      directions,
    });
  }
  return result;
};

const parseTrailsByState = (trails) => {
  const result = [];

  for (let i = 0; i < trails.length; i++) {
    if (trails[i].description === "") {
      continue;
    }

    if (trails[i].thumbnail === null || !trails[i].thumbnail.includes("http")) {
      trails[i].thumbnail = null;
    }

    const {
      name,
      city,
      region,
      lat,
      lon,
      description,
      directions,
      length,
      rating,
      thumbnail,
    } = trails[i];

    const point = { type: "Point", coordinates: [lon, lat] };

    result.push({
      name,
      city,
      state: region,
      lnglat: point,
      description,
      directions,
      length,
      rating,
      image: thumbnail,
      biking: true,
      hiking: false,
    });
  }
  return result;
};

exports.storeCombinedTrailsInDb = async (trails) => {
  const parsedTrails = parseCombinedTrails(trails);

  //push to db
  const createdTrails = await Trail.bulkCreate([...parsedTrails], {
    ignoreDuplicates: true,
  });

  return createdTrails;
};

exports.storeTrailsByStateInDb = async (trails) => {
  const parsedTrails = parseTrailsByState(trails);

  const createdTrails = await Trail.bulkCreate([...parsedTrails], {
    ignoreDuplicates: true,
  });

  return createdTrails;
};
