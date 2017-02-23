const client = require('../redis.js');

const listFaves = require('./../redis/list-faves.js');

module.exports = (request, response) => {
  listFaves(null, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      response(JSON.stringify(data));
    }
  });
};
