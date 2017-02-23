const client = require('../redis.js');

module.exports = (request, response) => {
  const item = request.payload.item;
  let items = [];
  client.zrange("favouritesSet", 0, -1, (err, data) => {
    if (err) { console.log(err); }
    else {
      items = items.concat(data);
      const index = items.length;
      client.zadd("favouritesSet", index, item, (err, reply) => {
        if (err) { console.log(err); }
        else { response.file('./public/index.html'); }
      });
    }
  });
};
