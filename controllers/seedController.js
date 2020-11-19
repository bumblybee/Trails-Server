const seedService = require("../services/seedService");
const states = require("../enums/states");

const {
  grabCombinedData,
  grabBikingData,
  grabHikingData,
  grabAllBikingData,
} = require("../services/dataGrabService");

exports.getCombinedTrails = async (req, res) => {
  const data = await grabCombinedData();

  const trails = await seedService.storeCombinedTrailsInDb(data);

  res.json(trails);
};

exports.getBikingByState = async (req, res) => {
  const trails = [];
  // const kentuckyData = await grabBikingData(
  //   states.kentucky.lat,
  //   states.kentucky.lng
  // );
  // const iowaData = await grabBikingData(states.iowa.lat, states.iowa.lng);
  // const kansasData = await grabBikingData(states.kansas.lat, states.kansas.lng);
  // const southDakotaData = await grabBikingData(
  //   states.southDakota.lat,
  //   states.southDakota.lng
  // );
  // const louisianaData = await grabBikingData(
  //   states.louisiana.lat,
  //   states.louisiana.lng
  // );
  // const nebraskaData = await grabBikingData(
  //   states.nebraska.lat,
  //   states.nebraska.lng
  // );
  // const mississippiData = await grabBikingData(
  //   states.mississippi.lat,
  //   states.mississippi.lng
  // );
  // const missouriData = await grabBikingData(
  //   states.missouri.lat,
  //   states.missouri.lng
  // );

  states.map((state) => {
    // const data = await grabBikingData(state.lat, state.lng);
    // trails.push(...data);
    const entries = Object.values(state);

    trails.push(...entries);
  });

  // res.json((mapped = trails.map((trail) => trail)));

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

  // Promise.all(trails).then(async (res) => {
  //   const data = await res;
  //   res.json(data);
  // });

  // const storedTrails = await seedService.storeBikingTrailsInDb(trails);
  const data = await grabAllBikingData(trails);
  res.json(data);
};

exports.getHikingByState = async (req, res) => {
  const trails = [];

  const kentuckyData = await grabHikingData(
    states.kentucky.lat,
    states.kentucky.lng
  );
  const iowaData = await grabHikingData(states.iowa.lat, states.iowa.lng);
  const kansasData = await grabHikingData(states.kansas.lat, states.kansas.lng);
  const southDakotaData = await grabHikingData(
    states.southDakota.lat,
    states.southDakota.lng
  );
  const louisianaData = await grabHikingData(
    states.louisiana.lat,
    states.louisiana.lng
  );
  const nebraskaData = await grabHikingData(
    states.nebraska.lat,
    states.nebraska.lng
  );
  const mississippiData = await grabHikingData(
    states.mississippi.lat,
    states.mississippi.lng
  );
  const missouriData = await grabHikingData(
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

  // const storedTrails = await seedService.storeHikingTrailsInDb(trails);

  res.json(storedTrails);
};
