'use strict';

var should = require('should');
var app = require('../../app');
var uuid = require('node-uuid');
var moment = require('moment');
var request = require('supertest');

var appDB = require('../../components/database/applications');
var application = require('../../components/schema/application')();

var appId;
describe('GET /api/application', function() {

  beforeEach(function (done) {
    appId = uuid.v4();
    application._id = appId;
    application.email = 'mockuser@vand.io';
    application.created = moment.utc().valueOf();
    appDB.insert(application, application._id, function (error) {
      if(error) {
        console.log('Error inserting application.'.red);
        return done(error);
      }
      done();
    });
  });

  afterEach(function (done) {
    // Search for all applications
    appDB.searchByAll(function (error, reply) {
      if(error) {
        console.log('Error retreiving application.'.red);
        return done(error);
      }
      // Update their docs to delete.
      var docs = reply.rows.map(function (row) {
        row.value._deleted = true;
        return row.value;
      });
      // Bulk delete
      appDB.deleteBulk(docs, function (error, reply) {
        if(error) {
          console.log('Error deleting applications.'.red);
          return done(error);
        }
        appDB.compact(function (error, reply) {
          if(error) {
            console.log('Error compacting application database.'.red);
            return done(error);
          }
          done();
        });
      });
    })
  });

  it('should respond with the application', function(done) {
    request(app)
      .get('/api/application?id=' + appId)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.body.should.be.instanceof(Object);
        res.body.should.have.property('email');
        res.body.should.have.property('company');
        res.body.should.have.property('appointment');
        done();
      });
  });
});