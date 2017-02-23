const client = require('../redis.js');

const listFaves = require('../redis/list-faves.js');
const addFave = require('../redis/add-fave.js');

module.exports = (request, response) => {
  const item = request.payload.item;
  listFaves(null, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const index = data.items.length;
      addFave(index, item, (err) => {
        if (err) {
          console.log(err);
        } else {
          response.file('./public/index.html');
        }
      })
    }
  });
};
