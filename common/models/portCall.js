module.exports = function(PortCall) {

  'use strict';

  // Send a message to a slack channel from here
  PortCall.getRoutes = function(departureDate, arrivalDate, cb) {
    // For more information on how to query data in loopback please see
    // https://docs.strongloop.com/display/public/LB/Querying+data
    var query = {
      where: {
        etd: { gte: departureDate },
        eta: { lte: arrivalDate }
      }
    };

    PortCall.find(query)
      .then(function(results) {
        return cb(null, results);
      })
      .catch(function(err) {
        console.log(err);
        return cb(err);
      });
  };

  PortCall.remoteMethod('getRoutes', {
    accepts: [
      { arg: 'departureDate', 'type': 'date'},
      { arg: 'arrivalDate', 'type': 'date' }
    ],
    returns: [
      { arg: 'result',type: 'array', root:true }
    ]
  });

};
