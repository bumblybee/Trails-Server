// Using controller and route so I can view data in browser before db storage
const seedService = require("../services/seedService");

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

  const kentucky = { lat: 35.6528, lng: -97.4781 };
  const iowa = { lat: 42.4928, lng: -92.3426 };
  const kansas = { lat: 38.8403, lng: -97.6114 };
  const southDakota = { lat: 44.3668, lng: -100.3538 };
  const louisiana = { lat: 31.3113, lng: -92.4451 };
  const nebraska = { lat: 40.7808, lng: -99.7415 };
  const mississippi = { lat: 32.2988, lng: -90.1848 };

  // const kentuckyData = await grabSingleStateData(kentucky.lat, kentucky.lng);
  const iowaData = await grabSingleStateData(iowa.lat, iowa.lng);
  const kansasData = await grabSingleStateData(kansas.lat, kansas.lng);
  const southDakotaData = grabSingleStateData(southDakota.lat, southDakota.lng);
  const louisianaData = await grabSingleStateData(louisiana.lat, louisiana.lng);
  const nebraskaData = await grabSingleStateData(nebraska.lat, nebraska.lng);
  const mississippiData = await grabSingleStateData(
    mississippi.lat,
    mississippi.lng
  );

  // const kentuckyTrails = parseTrails(kentuckyData);
  const iowaTrails = parseTrails(iowaData);
  const kansasTrails = parseTrails(kansasData);
  const southDakotaTrails = parseTrails(southDakotaData);
  const louisianaTrails = parseTrails(louisianaData);
  const nebraskaTrails = parseTrails(nebraskaData);
  const mississippiTrails = parseTrails(mississippiData);

  trails.push(
    // ...kentuckyTrails
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
