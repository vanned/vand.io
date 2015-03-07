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

describe('POST /api/admin/login', function() {

  beforeEach(function (done) {
    admin._id = uuid.v4();
    admin.email = 'mockadmin@vand.io';
    admin.username = 'mockadmin';
    admin.password = bcrypt.hashSync('mockpassword', 10);
    admin.active = true;
    admin.created = moment.utc().subtract(1, 'hours').valueOf();
    admin.activated = moment.utc().valueOf();
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

  it('should successfully log the user in', function(done) {
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
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Logged in.');
      done();
    });
  });

  it('should fail when missing the username', function(done) {
    request(app)
    .post('/api/admin/login')
    .send({
      password: 'mockpassword'
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if(err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Missing username.');
      done();
    });
  });

  it('should fail when missing the password', function(done) {
    request(app)
    .post('/api/admin/login')
    .send({
      username: 'mockadmin'
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if(err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Missing password.');
      done();
    });
  });

  it('should fail when the user does not exist', function(done) {
    request(app)
    .post('/api/admin/login')
    .send({
      username: 'newadmin',
      password: 'mockpassword'
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if(err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Username does not exist.');
      done();
    });
  });

  it('should fail when the passwords do not match', function(done) {
    request(app)
    .post('/api/admin/login')
    .send({
      username: 'mockadmin',
      password: 'newpassword'
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if(err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Passwords do not match.');
      done();
    });
  });
});