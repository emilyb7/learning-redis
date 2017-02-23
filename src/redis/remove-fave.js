const client = require('./../redis.js');

const addFave = require('./add-fave.js');

module.exports = (score, cb) => {
  client.zremrangebyscore("favouritesSet", score, score, (err, reply) => {
    if (err) {
      cb(err);
    } else {
      addFave(score, "", (err, reply) => {
        if (err) {
          console.log(err);
        } else {
          cb();
        }
      });
    }
  });
};
