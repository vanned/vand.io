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

var resetToken;
var adminId;
describe('POST /api/admin/forgotPassword', function() {

  beforeEach(function (done) {
    adminId = uuid.v4();
    resetToken = uuid.v4();
    // Add a new admin before each test.
    admin._id = adminId;
    admin.username = 'mockadmin';
    admin.email = 'mockadmin@vand.io';
    admin.active = false;
    admin.tokens.register = null;
    admin.tokens.reset = resetToken;
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

  it('should successfully change the admin password', function(done) {
    request(app)
    .post('/api/admin/forgotPassword')
    .send({
      id: adminId,
      token: resetToken,
      new: 'newTestPassword',
      confirm: 'newTestPassword'
    })
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Password changed.');
      done();
    });
  });

  it('should fail on missing id', function(done) {
    request(app)
    .post('/api/admin/forgotPassword')
    .send({
      token: resetToken,
      new: 'newTestPassword',
      confirm: 'newTestPassword'
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Missing id.');
      done();
    });
  });

  it('should fail on missing token', function(done) {
    request(app)
    .post('/api/admin/forgotPassword')
    .send({
      id: adminId,
      new: 'newTestPassword',
      confirm: 'newTestPassword'
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Missing token.');
      done();
    });
  });

  it('should fail on missing new password', function(done) {
    request(app)
    .post('/api/admin/forgotPassword')
    .send({
      id: adminId,
      token: resetToken,
      confirm: 'newTestPassword'
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Missing new password.');
      done();
    });
  });

  it('should fail on missing confirmed password', function(done) {
    request(app)
    .post('/api/admin/forgotPassword')
    .send({
      id: adminId,
      token: resetToken,
      new: 'newTestPassword'
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Missing confirmed password.');
      done();
    });
  });

  it('should fail on invalid id', function(done) {
    request(app)
    .post('/api/admin/forgotPassword')
    .send({
      id: 'foobar',
      token: resetToken,
      new: 'newTestPassword',
      confirm: 'newTestPassword'
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Invalid id.');
      done();
    });
  });

  it('should fail on invalid token', function(done) {
    request(app)
    .post('/api/admin/forgotPassword')
    .send({
      id: adminId,
      token: 'foobar',
      new: 'newTestPassword',
      confirm: 'newTestPassword'
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Invalid token.');
      done();
    });
  });

  it('should fail when passwords don\'t match', function(done) {
    request(app)
    .post('/api/admin/forgotPassword')
    .send({
      id: adminId,
      token: resetToken,
      new: 'newTestPassword',
      confirm: 'newFailPassword'
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Passwords do not match.');
      done();
    });
  });

  it('should fail when the id does not exist', function(done) {
    request(app)
    .post('/api/admin/forgotPassword')
    .send({
      id: uuid.v4(),
      token: resetToken,
      new: 'newTestPassword',
      confirm: 'newTestPassword'
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Admin does not exist with that id.');
      done();
    });
  });

  it('should fail when the token does not match the admin account', function(done) {
    request(app)
    .post('/api/admin/forgotPassword')
    .send({
      id: adminId,
      token: uuid.v4(),
      new: 'newTestPassword',
      confirm: 'newTestPassword'
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Token does not match admin.');
      done();
    });
  });
});