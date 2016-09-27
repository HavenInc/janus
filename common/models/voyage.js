module.exports = function(Voyage) {

  'use strict';

  // Send a message to a slack channel from here
  Voyage.getRoutes = function(departurePort, arrivalPort, cb) {
    console.log("Ports", departurePort, arrivalPort);

    let result = {
      alertMsg: "Hello, World!"
    };
    return cb(null, result);
  };

  Voyage.remoteMethod('getRoutes', {
    accepts: [
      {
        arg: 'departurePort', 'type': 'string',
        arg: 'arrivalPort', 'type': 'string'
      }
    ],
    returns: [
      { arg: 'result',
        type: 'object'
      }
    ]
  });

};
