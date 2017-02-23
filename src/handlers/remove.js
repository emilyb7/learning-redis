const client = require('../redis.js');

const removeFave = require('./../redis/remove-fave.js');
const listFaves = require('./../redis/list-faves.js');

module.exports = (request, response) => {
  const item = JSON.parse(request.payload).item;
  removeFave(item, (err) => {
    if (err) {
      console.log(err);
    } else {
      listFaves(null, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          response(JSON.stringify(data))
        }
      })
    }
  });
}
