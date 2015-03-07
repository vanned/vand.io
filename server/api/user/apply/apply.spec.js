'use strict';

var should = require('should');
var app = require('../../../app');
var colors = require('colors');
var request = require('supertest');
var nock = require('nock');
var uuid = require('node-uuid');
var moment = require('moment');
// Allow other network connections such as CouchDB.
nock.enableNetConnect();

var qs = require('querystring');

var settings = require('../../../config/environment');
var application  = require('../../../components/schema/application')();
var appDB = require('../../../components/database/applications');

describe('POST /api/user/apply', function() {

  beforeEach(function (done) {
    nock('https://www.google.com')
    .get('/recaptcha/api/siteverify?' + qs.stringify({
      secret: settings.google.recaptcha.secretKey,
      response: 'testResponse',
      remoteip: '127.0.0.1'
    }))
    .reply(200, {
      success: true
    });
    done();
  });

  afterEach(function (done) {
    // Search for all applications.
    appDB.searchByAll(function (error, reply) {
      if(error) {
        console.log('Error retreiving applications.'.red);
        return done(Error);
      }
      // Update their docs to delete.
      var docs = reply.rows.map(function (row) {
        row.value._deleted = true;
        return row.value;
      });
      // Bulk delete.
      appDB.deleteBulk(docs, function (error, reply) {
        if(error) {
          console.log('Error deleting applications.'.red);
          return done(error);
        }
        // Compact database.
        appDB.compact(function (error, reply) {
          if(error) {
            console.log('Error compacting application database.'.red);
            return done(error);
          }
          done();
        });
      });
    });
  })

  it('should successfully create an application and email it', function(done) {
    request(app)
    .post('/api/user/apply')
    .send({
      email: 'mockuser@vand.io',
      captcha: 'testResponse'
    })
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Application created.');
      done();
    });
  });

  it('should fail when missing the email', function(done) {
    request(app)
    .post('/api/user/apply')
    .send({
      captcha: 'testResponse'
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Missing email.');
      done();
    });
  });

  it('should fail when missing the captcha', function(done) {
    request(app)
    .post('/api/user/apply')
    .send({
      email: 'mockuser@vand.io'
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Missing CAPTCHA response.');
      done();
    });
  });

  it('should fail when the email is invalid', function(done) {
    request(app)
    .post('/api/user/apply')
    .send({
      email: 'foobar',
      captcha: 'testResponse'
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Invalid email.');
      done();
    });
  });

  it('should fail the email already exists', function(done) {
    application._id = uuid.v4();
    application.email = 'mockuser@vand.io';
    application.created = moment.utc().valueOf();
    appDB.insert(application, application._id, function (error) {
      if(error) {
        return done(error);
      }
      request(app)
      .post('/api/user/apply')
      .send({
        email: 'mockuser@vand.io',
        captcha: 'testResponse'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.body.should.be.instanceof(Object);
        res.body.should.have.property('message', 'Email already applied.');
        done();
      });
    });
  });
});