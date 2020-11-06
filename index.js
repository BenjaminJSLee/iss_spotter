const { nextISSTimesForMyLocation } = require('./iss');

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.error("Error:", error);
  }
  // success, print out the deets!
  for (let obj of passTimes) {
    let d = new Date(Number(obj["risetime"]) * 1000);
    console.log(`Next pass at ${d} for ${obj["duration"]} seconds!`);
  }
});
