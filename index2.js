const { nextISSTimesForMyLocation } = require('./iss_promised');

nextISSTimesForMyLocation()
  .then((data) => {
    for (let obj of data) {
      let d = new Date(Number(obj["risetime"]) * 1000);
      console.log(`Next pass at ${d} for ${obj["duration"]} seconds!`);
    }
  })
  .catch((err) => {
    console.log("Error:",err.message);
  });