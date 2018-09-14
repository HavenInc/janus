module.exports = function init(server, next) {
  const { PortCall } = server.models;
  const { calls } = require('../data/portCalls.json');



  const promises = calls.map(call => PortCall.create(call));

  Promise.all(promises)
    .then(results => {
      console.log(`Done importing ${results.length} port calls!`);
      return next();

    })
    .catch(err => {
      console.log('Error!', err);

      return next(err);
    });
};
