const client = require('../redis.js');

module.exports = (request, response) => {
  const input = request.payload;
  const item = JSON.parse(input).item;
  client.zremrangebyscore("favouritesSet", item, item, (err, reply) => {
    if (err) { console.log(err); }
    else {
      client.zadd("favouritesSet", item, "", (err, reply) => {
        if (err) { console.log(err); }
        else {
          client.zrange("favouritesSet", 0, -1, "WITHSCORES", (err, reply) => {
            if (err) { console.log(err); }
            else {
              const items = reply.filter((item, index) => index % 2 === 0);
              const scores = reply.filter((item, index) => index % 2 > 0);
              const data = {
                items: items,
                scores: scores,
              };
              response(JSON.stringify(data));
            }
          })
        }
      })
    }
  })
};
