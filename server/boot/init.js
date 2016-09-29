var portCalls = require('../../portCalls.json');

module.exports = function init(server) {
  var PortCall = server.models.PortCall;

  PortCall.create(portCalls, function(err, result) {
    if (err) console.log(err);
    console.log("Done importing initial port call data!");
  });
};
