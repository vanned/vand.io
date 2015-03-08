'use strict';

var should = require('should');
var app = require('../../../app');
var uuid = require('node-uuid');
var moment = require('moment');
var bcrypt = require('bcrypt');
var request = require('supertest');

var appDB = require('../../../components/database/applications');
var application = require('../../../components/schema/application')();
var adminDB = require('../../../components/database/admins');
var userDB = require('../../../components/database/users');
var admin = require('../../../components/schema/admin')();

var cookie;
var appId;
describe('POST /api/application/approved', function() {

  beforeEach(function (done) {
    appId = uuid.v4();
    application._id = appId;
    application.email = 'mockuser@vand.io';
    application.created = moment.utc().valueOf();
    application.updated = moment.utc().add(1, 'hours').valueOf();
    application.company.name = 'Vand';
    application.company.website = 'https://www.vand.io';
    application.appointment.inPerson = true;
    application.appointment.coordinator.firstname = 'John';
    application.appointment.coordinator.lastname = 'Smith';
    application.appointment.coordinator.phonenumber = '555-555-5555';
    application.appointment.coordinator.email = 'john.smith@vand.io';
    application.appointment.date = moment.utc().add(15, 'days').valueOf();
    appDB.insert(application, application._id, function (error) {
      if(error) {
        console.log('Error inserting application.'.red);
        return done(error);
      }
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
          userDB.searchByAll(function (error, reply) {
            if(error) {
              console.log('Error getting users.'.red);
              return done(error);
            }
            var docs = reply.rows.map(function (row) {
              row.value._deleted = true;
              return row.value;
            });
            userDB.deleteBulk(docs, function (error) {
              if(error) {
                console.log('Error deleting users.'.red);
                return done(error);
              }
              userDB.compact(function (error) {
                if(error) {
                  console.log('Error compacting user database.'.red);
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
          });
        });
      });
    });
  });

  it('should successfully approve an application', function(done) {
    request(app)
      .post('/api/application/approved')
      .set('cookie', cookie)
      .send({
        id: appId
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        res.body.should.be.instanceof(Object);
        res.body.should.have.property('message', 'Application approved.');
        done();
      });
  });
});