module.exports = function(Voyage) {

  'use strict';

  // Send a message to a slack channel from here
  Voyage.sendMessage = function(departurePort, arrivalPort, cb) {
    console.log(messagePayload.msg);

    let result = {
      alertMsg: "Hello, World!"
    };
    return cb(null, result);
  };

  Voyage.remoteMethod('sendMessage', {
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
