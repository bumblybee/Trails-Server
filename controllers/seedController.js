const seedService = require("../services/seedService");
const states = require("../enums/states");

const {
  grabCombinedData,
  grabAllHikingData,
  grabAllBikingData,
} = require("../services/dataGrabService");

exports.getCombinedTrails = async (req, res) => {
  const data = await grabCombinedData();

  const storedTrails = seedService.storeCombinedTrailsInJSON(data);

  res.json(storedTrails);
};

exports.getBikingByState = async (req, res) => {
  const stateLatLng = [];

  // pull lat and lng from each state object
  states.map((state) => {
    const coords = Object.values(state);

    stateLatLng.push(...coords);
  });

  const data = await grabAllBikingData(stateLatLng);

  // const storedTrails = await seedService.storeBikingTrailsInDb(trails);

  const storedTrails = seedService.storeBikingTrailsInJSON(data);

  res.json(storedTrails);
};

exports.getHikingByState = async (req, res) => {
  const stateLatLng = [];

  // pull lat and lng from each state object
  states.map((state) => {
    const coords = Object.values(state);

    stateLatLng.push(...coords);
  });

  const data = await grabAllHikingData(stateLatLng);

  // const storedTrails = await seedService.storeHikingTrailsInDb(trails);

  const storedTrails = seedService.storeHikingTrailsInJSON(data);

  res.json(storedTrails);
};

exports.viewJSON = (req, res) => {
  const trails = seedService.returnJSON();
  res.json(trails);
};
