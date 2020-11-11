// Using controller and route so I can view data in browser before db storage
const seedService = require("../services/seedService");
const states = require("../enums/states");

const {
  grabCombinedData,
  grabSingleStateData,
} = require("../services/dataGrabService");

exports.getCombinedTrails = async (req, res) => {
  const data = await grabCombinedData();

  const trails = await seedService.storeCombinedTrailsInDb(data);

  res.json(trails);
};

exports.getTrailsByState = async (req, res) => {
  const trails = [];

  const kentuckyData = await grabSingleStateData(
    states.kentucky.lat,
    states.kentucky.lng
  );
  const iowaData = await grabSingleStateData(states.iowa.lat, states.iowa.lng);
  const kansasData = await grabSingleStateData(
    states.kansas.lat,
    states.kansas.lng
  );
  const southDakotaData = await grabSingleStateData(
    states.southDakota.lat,
    states.southDakota.lng
  );
  const louisianaData = await grabSingleStateData(
    states.louisiana.lat,
    states.louisiana.lng
  );
  const nebraskaData = await grabSingleStateData(
    states.nebraska.lat,
    states.nebraska.lng
  );
  const mississippiData = await grabSingleStateData(
    states.mississippi.lat,
    states.mississippi.lng
  );

  const kentuckyTrails = parseTrails(kentuckyData);
  const iowaTrails = parseTrails(iowaData);
  const kansasTrails = parseTrails(kansasData);
  const southDakotaTrails = parseTrails(southDakotaData);
  const louisianaTrails = parseTrails(louisianaData);
  const nebraskaTrails = parseTrails(nebraskaData);
  const mississippiTrails = parseTrails(mississippiData);

  trails.push(
    ...kentuckyTrails,
    ...iowaTrails,
    ...kansasTrails,
    ...southDakotaTrails,
    ...louisianaTrails,
    ...nebraskaTrails,
    ...mississippiTrails
  );

  const storedTrails = await seedService.storeTrailsByStateInDb(trails);

  res.json(storedTrails);
};

const parseTrails = (trails) => {
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
