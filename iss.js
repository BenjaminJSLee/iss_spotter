const request = require('request');

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request("https://api.ipify.org?format=json",(error,response,body) => {
    if (error) {
      callback(error,null);
    } else if (response && (response.statusCode < 200 || response.statusCode >= 300)) {
      callback(Error(`Error ${response.statusCode}`),null);
    } else {
      callback(null,JSON.parse(body).ip);
    }
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`http://ip-api.com/json/${ip}`,(error,response,body) => {
    if (error) {
      callback(error,null);
    } else if (response && (response.statusCode < 200 || response.statusCode >= 300)) {
      callback(Error(`Error ${response.statusCode}: ${body}`),null);
    } else {
      const IPData = JSON.parse(body);
      if (IPData.status === 'fail') callback(Error(IPData.message),null);
      else callback(null,{ latitude: IPData.lat, longitude: IPData.lon });
    }
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`,(error,response,body) => {
    if (error) {
      callback(error,null);
    } else if (response && (response.statusCode < 200 || response.statusCode >= 300)) {
      callback(Error(`Error ${response.statusCode}: ${body}`),null);
    } else {
      const data = JSON.parse(body);
      if (data.message === 'failure') callback(Error(data.reason),null);
      else callback(null,data.response);
    }
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      callback(error,null);
      return;
    }
    fetchCoordsByIP(ip, (error,coords) => {
      if (error) {
        callback(error,null);
        return;
      }
      fetchISSFlyOverTimes(coords, (error, data) => {
        if (error) {
          callback(error,null);
          return;
        }
        callback(null,data);
      });
    });
  });
};


module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation,
};