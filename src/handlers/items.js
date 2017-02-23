const client = require('../redis.js');

module.exports = (request, response) => {
  client.zrange("favouritesSet", 0, -1, "WITHSCORES", (err, reply) => {
    if(err) { console.log(err); }
    else {
      const items = reply.filter((item, index) => index % 2 == 0);
      const scores = reply.filter((item, index) => index % 2 > 0);
      const data = {
        items: items,
        scores: scores,
      };
      response(JSON.stringify(data));
    }
  })
};
