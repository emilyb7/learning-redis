const client = require('./../redis.js');

module.exports = (args, cb) => {
  client.zrange("favouritesSet", 0, -1, "WITHSCORES", (err, reply) => {
    if (err) {
      cb(err);
    } else {
      const items = reply.filter((item, index) => index % 2 === 0);
      const scores = reply.filter((item, index) => index % 2 > 0);
      const data = {
        items: items,
        scores: scores,
      };
      cb(null, data);
    }
  })
};
