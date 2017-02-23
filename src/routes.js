const home = require('./handlers/home.js');
const submit = require('./handlers/submit.js');
const items = require('./handlers/items.js');
const remove = require('./handlers/remove.js');

module.exports = [
   { method: 'GET', path: '/', handler: home },
   { method: 'POST', path: '/', handler: submit},
   { method: 'GET', path: '/items', handler: items},
   { method: 'POST', path: '/remove', handler: remove},
   { method: 'GET', path: '/{file*}', handler: { directory: { path: 'public/' } } },
];
