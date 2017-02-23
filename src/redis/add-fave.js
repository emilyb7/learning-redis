const client = require('./../redis.js');

module.exports = (index, item, cb) => {
  client.zadd("favouritesSet", index, item, (err, reply) => {
    if (err) {
      cb(err);
    }
    else {
      cb();
    }
  });
};
