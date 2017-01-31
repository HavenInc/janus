const assert = require('chai').assert;
const app = require('../');
const { PortCall } = app.models;

describe('Test', function() {
  it('should test', function(done) {
    const success = PortCall.test();

    assert.equal(success, true, 'test should pass!');

    done();
  });
});
