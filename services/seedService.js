const Trail = require("../db").Trail;
const fs = require("fs");
const trailFile = "../trails-server/db/json/trails.json";

const parseActivities = (activities) => {
  // define object props
  let hiking = false,
    biking = false,
    image,
    trail_length,
    ratings;

  activities.forEach((activity) => {
    const { activity_type_name, thumbnail, length, rating } = activity;

    image = thumbnail;
    trail_length = length;
    ratings = rating;

    if (activity_type_name === "hiking") {
      hiking = true;
    }

    if (activity_type_name == "mountain biking") {
      biking = true;
    }
  });

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

    //parse activities in nested activities array
    const activities = parseActivities(trails[i].activities);

    //if place has no activities, i.e. no hiking or biking, skip it
    if (!activities) continue;

    //if lat and lng not provided, skip
    if (trails[i].lat === 0 || trails[i].lon === 0) {
      continue;
    }

    //Use trail activity description if no default description
    if (trails[i].description === null) {
      trails[i].description = trails[i].activities[0].description;
    }

    // If no image url, aka the image is stored on the external api server, set to null
    if (activities.image === null || !activities.image.includes("http")) {
      activities.image = null;
    }
    //TODO: Change http to https

    // destructure api props
    let { name, city, state, lat, lon, description } = trails[i];

    // store lng and lat in db as type Point
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
      difficulty: "unknown",
    });
  }
  return result;
};

const parseBikingTrails = (trails) => {
  const result = [];

  for (let i = 0; i < trails.length; i++) {
    if (trails[i].description === "") {
      continue;
    }

    let {
      name,
      city,
      region,
      lat,
      lon,
      description,
      difficulty,
      length,
      rating,
      thumbnail,
    } = trails[i];

    if (difficulty === "") {
      difficulty = "unknown";
    }

    if (difficulty.toLowerCase() === "easiest") {
      difficulty = "beginner";
    }

    const point = { type: "Point", coordinates: [lon, lat] };

    // push schema into result and return
    result.push({
      name,
      city,
      state: region,
      lnglat: point,
      description,
      length,
      rating,
      difficulty: difficulty.toLowerCase(),
      image: thumbnail,
      biking: true,
      hiking: false,
    });
  }
  return result;
};

const parseHikingTrails = (trails) => {
  const result = [];
  for (let i = 0; i < trails.length; i++) {
    if (!trails[i].name) {
      continue;
    }

    let {
      name,
      location,
      latitude,
      longitude,
      summary,
      difficulty,
      length,
      stars,
      imgMedium,
    } = trails[i];

    switch (difficulty) {
      case "green":
        difficulty = "beginner";
        break;
      case "greenBlue":
        difficulty = "beginner";
        break;
      case "blue":
        difficulty = "intermediate";
        break;
      case "blueBlack":
        difficulty = "intermediate";
        break;
      case "black":
        difficulty = "advanced";
        break;
      case "blackBlack":
        difficulty = "expert";
        break;
      default:
        difficulty = "unknown";
    }

    const point = { type: "Point", coordinates: [longitude, latitude] };

    // push schema into result and return
    result.push({
      name,
      city: location.split(",")[0],
      state: location.split(",")[1].trim(),
      lnglat: point,
      description: summary,
      length,
      rating: stars,
      difficulty,
      image: imgMedium,
      biking: false,
      hiking: true,
    });
  }
  return result;
};

//TODO: move db storing to www to seed db when reset
// exports.storeCombinedTrailsInDb = async (trails) => {
//   // grab parsed trails from above
//   const parsedTrails = parseCombinedTrails(trails);

//   //push to db in bulk, ignoring any duplicates
//   // const createdTrails = await Trail.bulkCreate([...parsedTrails], {
//   //   ignoreDuplicates: true,
//   // });

//   //return db data to controller to view as json
//   // return createdTrails;

//   return parsedTrails;
// };

// exports.storeBikingTrailsInDb = async (trails) => {
//   const parsedTrails = parseBikingTrails(trails);

//   // const createdTrails = await Trail.bulkCreate([...parsedTrails], {
//   //   ignoreDuplicates: true,
//   // });

//   //return db data to controller to view as json
//   // return createdTrails;

//   return parsedTrails;
// };

// exports.storeHikingTrailsInDb = async (trails) => {
//   const parsedTrails = parseHikingTrails(trails);

//   const createdTrails = await Trail.bulkCreate([...parsedTrails], {
//     ignoreDuplicates: true,
//   });

//   return createdTrails;
// };

exports.storeCombinedTrailsInJSON = (trails) => {
  const parsedTrails = parseCombinedTrails(trails);

  const stringifiedTrails = JSON.stringify(parsedTrails, null, 2);

  fs.writeFile(trailFile, stringifiedTrails, (err) => {
    if (err) console.log(err);
    console.log("Data written to json file");
  });

  return parsedTrails;
};

exports.storeHikingTrailsInJSON = (trails) => {
  //require within function because if no data store in json yet and it's required at top, throws error
  const jsonTrails = require("../db/json/trails.json");

  const parsedTrails = parseHikingTrails(...trails);

  jsonTrails.push(parsedTrails);

  const stringifiedTrails = JSON.stringify(jsonTrails, null, 2);

  fs.writeFile(trailFile, stringifiedTrails, (err) => {
    if (err) console.log(err);
    console.log("Data written to json file");
  });

  return parsedTrails;
};

exports.storeBikingTrailsInJSON = (trails) => {
  const jsonTrails = require("../db/json/trails.json");

  const parsedTrails = parseBikingTrails(...trails);

  jsonTrails.push(parsedTrails);

  const stringifiedTrails = JSON.stringify(jsonTrails, null, 2);

  fs.writeFile(trailFile, stringifiedTrails, (err) => {
    if (err) console.log(err);
    console.log("Data written to json file");
  });

  return parsedTrails;
};
