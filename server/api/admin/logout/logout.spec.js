'use strict';

var should = require('should');
var app = require('../../../app');
var request = require('supertest');

describe('GET /api/admin/logout', function() {

  it('should successfully log the admin out', function(done) {
    request(app)
      .get('/api/admin/logout')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        res.body.should.be.instanceof(Object);
        res.body.should.have.property('message', 'Logged out.');
        done();
      });
  });
});