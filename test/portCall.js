const assert = require('chai').assert;
superagent = require('superagent'),
    app = require('../server/server');
var chaifs = require('chai-fs');
var chai = require('chai');
chai.use(chaifs);
var expect = chai.expect;
var file = chaifs.file;


describe('PortCalls model', function() {
    var server;

    beforeEach(function(done) {
        server = app.listen(done);
    });

    afterEach(function(done) {
        server.close(done);
    });

    it('Check non-transit shipping voyages', function(done) {
        superagent
            .post('http://localhost:3000/api/PortCalls/getRoutes')
            .send({
                "etd": "2016-01-03T18:30:00.000Z",
                "eta": "2016-02-18T18:30:00.000Z",
                "incTrans": true
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end(function(err, getRoutesResponse) {
                if (err) {
                    return done(err);
                }
                assert.equal(getRoutesResponse.status, 200);
                expect("test/testWithTransShipments.json").to.be.a.file().with.content(JSON.stringify(getRoutesResponse.body));
                done();
            });
    });

    it('Check transit shipping voyages', function(done) {
        superagent
            .post('http://localhost:3000/api/PortCalls/getRoutes')
            .send({
                "etd": "2016-01-03T18:30:00.000Z",
                "eta": "2016-02-18T18:30:00.000Z"
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end(function(err, getRoutesResponse) {
                if (err) {
                    return done(err);
                }
                assert.equal(getRoutesResponse.status, 200);
                expect("test/testWithoutTransShipments.json").to.be.a.file().with.content(JSON.stringify(getRoutesResponse.body));
                done();
            });
    });

});
