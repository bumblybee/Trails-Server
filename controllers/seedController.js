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

  // const storedTrails = await seedService.storeHikingTrailsInDb(trails);

  const storedTrails = seedService.storeHikingTrailsInJSON(data);

  res.json(storedTrails);
};
