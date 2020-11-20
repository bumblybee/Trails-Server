const seedService = require("../services/seedService");
const states = require("../enums/states");

const {
  grabCombinedData,
  grabAllHikingData,
  grabAllBikingData,
} = require("../services/dataGrabService");

exports.getCombinedTrails = async (req, res) => {
  const data = await grabCombinedData();

  const trails = await seedService.storeCombinedTrailsInDb(data);

  res.json(trails);
};

exports.getBikingByState = async (req, res) => {
  const stateLatLng = [];

  // pull lat and lng from each state object
  states.map((state) => {
    const entries = Object.values(state);

    stateLatLng.push(...entries);
  });

  // const data = await grabAllBikingData(stateLatLng);
  const trails = [...data];

  // const storedTrails = await seedService.storeBikingTrailsInDb(trails);

  res.json(trails);
};

exports.getHikingByState = async (req, res) => {
  const stateLatLng = [];

  // pull lat and lng from each state object
  states.map((state) => {
    const entries = Object.values(state);

    stateLatLng.push(...entries);
  });

  const data = await grabAllHikingData(stateLatLng);
  const trails = [...data];

  // const storedTrails = await seedService.storeHikingTrailsInDb(trails);

  res.json(trails);

  // const trails = [];

  // const kentuckyData = await grabHikingData(
  //   states.kentucky.lat,
  //   states.kentucky.lng
  // );
  // const iowaData = await grabHikingData(states.iowa.lat, states.iowa.lng);
  // const kansasData = await grabHikingData(states.kansas.lat, states.kansas.lng);
  // const southDakotaData = await grabHikingData(
  //   states.southDakota.lat,
  //   states.southDakota.lng
  // );
  // const louisianaData = await grabHikingData(
  //   states.louisiana.lat,
  //   states.louisiana.lng
  // );
  // const nebraskaData = await grabHikingData(
  //   states.nebraska.lat,
  //   states.nebraska.lng
  // );
  // const mississippiData = await grabHikingData(
  //   states.mississippi.lat,
  //   states.mississippi.lng
  // );
  // const missouriData = await grabHikingData(
  //   states.missouri.lat,
  //   states.missouri.lng
  // );

  // trails.push(
  //   ...kentuckyData,
  //   ...iowaData,
  //   ...kansasData,
  //   ...southDakotaData,
  //   ...louisianaData,
  //   ...nebraskaData,
  //   ...mississippiData,
  //   ...missouriData
  // );

  // const storedTrails = await seedService.storeHikingTrailsInDb(trails);

  // res.json(storedTrails);
};
