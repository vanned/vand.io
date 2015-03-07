'use strict';

var should = require('should');
var colors = require('colors');
var moment = require('moment');
var uuid = require('node-uuid');
var bcrypt = require('bcrypt');
var app = require('../../../app');
var request = require('supertest');

var adminDB = require('../../../components/database/admins');
var admin = require('../../../components/schema/admin')();

describe('POST /api/admin/lostPassword', function() {

  beforeEach(function (done) {
    // Add a new admin before each test.
    admin._id = uuid.v4();
    admin.username = 'mockadmin';
    admin.email = 'mockadmin@vand.io';
    admin.active = false;
    admin.tokens.register = null;
    admin.created = moment.utc().valueOf();
    adminDB.insert(admin, admin._id, function (error) {
      if(error) {
        console.log('Error inserting admin.'.red);
        return done(error);
      }
      done();
    });
  });

  afterEach(function (done) {
    // Search for all admins.
    adminDB.searchByAll(function (error, reply) {
      if(error) {
        console.log('Error retreiving users.'.red);
        return done(error);
      }
      // Update their docs to delete.
      var docs = reply.rows.map(function (row) {
        row.value._deleted = true;
        return row.value;
      });
      // Bulk delete.
      adminDB.deleteBulk(docs, function (error, reply) {
        if(error) {
          console.log('Error deleting users.'.red);
          return done(error);
        }
        // Compact database.
        adminDB.compact(function (error, reply) {
          if(error) {
            console.log('Error compacting admin database.'.red);
            return done(error);
          }
          done();
        });
      });
    });
  });

  it('should successfully email a reset password link using a username', function(done) {
    request(app)
    .post('/api/admin/lostPassword')
    .send({
      username: 'mockadmin'
    })
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Reset email sent.');
      done();
    });
  });

  it('should successfully email a reset password link using an email', function(done) {
    request(app)
    .post('/api/admin/lostPassword')
    .send({
      email: 'mockadmin@vand.io'
    })
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Reset email sent.');
      done();
    });
  });

  it('should fail when missing both the email and username', function(done) {
    request(app)
    .post('/api/admin/lostPassword')
    .send({
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Missing username or email.');
      done();
    });
  });

  it('should fail when the email is invalid', function(done) {
    request(app)
    .post('/api/admin/lostPassword')
    .send({
      email: 'foobar'
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Invalid email.');
      done();
    });
  });

  it('should fail when the email does not exist', function(done) {
    request(app)
    .post('/api/admin/lostPassword')
    .send({
      email: 'newadmin@vand.io'
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Email does not exist.');
      done();
    });
  });

  it('should fail when the username does not exist', function(done) {
    request(app)
    .post('/api/admin/lostPassword')
    .send({
      username: 'newadmin'
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Username does not exist.');
      done();
    });
  });
});