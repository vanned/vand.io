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

var cookie;

describe('POST /api/admin/token', function() {

  beforeEach(function (done) {
    // Add a new admin before each test.
    admin._id = uuid.v4();
    admin.email = 'mockadmin@vand.io';
    admin.username = 'mockadmin';
    admin.password = bcrypt.hashSync('mockpassword', 10);
    admin.active = true;
    admin.token = null;
    admin.created = moment.utc().subtract(1, 'hours').valueOf();
    adminDB.insert(admin, admin._id, function (error) {
      if(error) {
        console.log('Error inserting admin.'.red);
        return done(error);
      }
      // Sign the admin in to get the session.
      request(app)
      .post('/api/admin/login')
      .send({
        username: 'mockadmin',
        password: 'mockpassword'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if(err) {
          return done(err);
        }
        cookie = res.headers['set-cookie'];
        res.body.should.be.instanceof(Object);
        res.body.should.have.property('message', 'Logged in.');
        done();
      });
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

  it('should successfully create an admin', function(done) {
    request(app)
    .post('/api/admin/token')
    .send({
      email: 'newadmin@vand.io'
    })
    .set('cookie', cookie)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Admin created.');
      done();
    });
  });

  it('should fail when missing the email', function(done) {
    request(app)
    .post('/api/admin/token')
    .send({})
    .set('cookie', cookie)
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

  it('should fail the admin email already exists', function(done) {
    request(app)
    .post('/api/admin/token')
    .send({
      email: 'mockadmin@vand.io'
    })
    .set('cookie', cookie)
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Admin already exists.');
      done();
    });
  });
});