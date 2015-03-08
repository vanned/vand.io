'use strict';

var should = require('should');
var colors = require('colors');
var moment = require('moment');
var uuid = require('node-uuid');
var bcrypt = require('bcrypt');
var app = require('../../app');
var request = require('supertest');

var adminDB = require('../../components/database/admins');
var admin = require('../../components/schema/admin')();

var appDB = require('../../components/database/applications');
var application = require('../../components/schema/application')();

var cookie;
var appId;
describe('GET /api/application', function() {

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
      });
    })
  });

  it('should respond with an application using an id', function(done) {
    request(app)
    .get('/api/application?id=' + appId)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Array);
      res.body[0].should.have.property('email');
      res.body[0].should.have.property('company');
      res.body[0].should.have.property('appointment');
      done();
    });
  });

  it('should respond with an application without any id', function(done) {
    request(app)
    .get('/api/application')
    .set('cookie', cookie)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Array);
      res.body[0].should.have.property('email');
      res.body[0].should.have.property('company');
      res.body[0].should.have.property('appointment');
      done();
    });
  });
});