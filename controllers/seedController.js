const seedService = require("../services/seedService");
const states = require("../enums/states");

const {
  grabCombinedData,
  grabSingleStateData,
} = require("../services/dataGrabService");

exports.getCombinedTrails = async (req, res) => {
  const data = await grabCombinedData();

  // const trails = await seedService.storeCombinedTrailsInDb(data);

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
  const missouriData = await grabSingleStateData(
    states.missouri.lat,
    states.missouri.lng
  );

  trails.push(
    ...kentuckyData,
    ...iowaData,
    ...kansasData,
    ...southDakotaData,
    ...louisianaData,
    ...nebraskaData,
    ...mississippiData,
    ...missouriData
  );

  // const storedTrails = await seedService.storeTrailsByStateInDb(trails);

  res.json(storedTrails);
};
