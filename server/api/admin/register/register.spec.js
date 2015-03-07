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

var testToken = uuid.v4();

describe('POST /api/admin/register', function() {

  beforeEach(function (done) {
    // Add a new admin before each test.
    admin._id = uuid.v4();
    admin.email = 'mockadmin@vand.io';
    admin.active = false;
    admin.tokens.register = testToken;
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

  it('should create an admin with a token', function (done) {
    request(app)
    .post('/api/admin/register')
    .send({
      email: 'mockadmin@vand.io',
      password: 'mockPassword',
      username: 'mockadmin',
      token: testToken
    })
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if(err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message');
      done();
    });
  });

  it('should successfully create the first admin', function (done) {
    adminDB.searchByKey('by_email', 'mockadmin@vand.io', function (error, reply) {
      if(error) {
        console.log('Error retreiving admin.'.red);
        return done(error);
      }
      var admin = reply.rows[0].value;
      adminDB.delete(admin._id, admin._rev, function (error) {
        if(error) {
          console.log('Error deleting admin.'.red);
          return done(error);
        }
        request(app)
        .post('/api/admin/register')
        .send({
          email: 'mockadmin@vand.io',
          password: 'mockPassword',
          username: 'mockadmin'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if(err) {
            return done(err);
          }
          res.body.should.be.instanceof(Object);
          res.body.should.have.property('message');
          done();
        });
      });
    });
  });

  it('should fail when missing the token', function (done) {
    request(app)
    .post('/api/admin/register')
    .send({
      email: 'mockadmin@vand.io',
      password: 'mockPassword',
      username: 'mockadmin'
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if(err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Missing token.');
      done();
    });
  });

  it('should fail when missing the email', function (done) {
    request(app)
    .post('/api/admin/register')
    .send({
      password: 'mockPassword',
      username: 'mockadmin',
      token: testToken
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if(err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Missing email.');
      done();
    });
  });

  it('should fail when the email is invalid', function (done) {
    request(app)
    .post('/api/admin/register')
    .send({
      email: 'foobar',
      password: 'mockPassword',
      username: 'mockadmin',
      token: testToken
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if(err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Invalid email.');
      done();
    });
  });

  it('should fail when missing the username', function (done) {
    request(app)
    .post('/api/admin/register')
    .send({
      email: 'mockadmin@vand.io',
      password: 'mockPassword',
      token: testToken
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

  it('should fail when missing the password', function (done) {
    request(app)
    .post('/api/admin/register')
    .send({
      email: 'mockadmin@vand.io',
      username: 'mockadmin',
      token: testToken
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

  it('should fail when token is invalid', function (done) {
    request(app)
    .post('/api/admin/register')
    .send({
      email: 'mockadmin@vand.io',
      username: 'mockadmin',
      password: 'mockPassword',
      token: 'foobar'
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if(err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Invalid token.');
      done();
    });
  });

  it('should fail when the email does not match the token', function (done) {
    request(app)
    .post('/api/admin/register')
    .send({
      email: 'failadmin@vand.io',
      username: 'mockadmin',
      password: 'mockPassword',
      token: testToken
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if(err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Email does not match token.');
      done();
    });
  });

  it('should fail when the admin account is active already', function (done) {
    adminDB.searchByKey('by_email', 'mockadmin@vand.io', function (error, reply) {
      if(error) {
        console.log('Error retreiving admin account.'.red);
        return done(error);
      }
      var admin = reply.rows[0].value;
      admin.active = true;
      admin.username = 'mockadmin2';
      admin.email = 'mockadmin@vand.io';
      admin.password = bcrypt.hashSync('mockPassword', 10);
      adminDB.insert(admin, admin._id, function (error, reply) {
        if(error) {
          console.log('Error inserting admin.'.red);
          return done(error);
        }
        request(app)
        .post('/api/admin/register')
        .send({
          email: 'mockadmin@vand.io',
          username: 'mockadmin',
          password: 'mockPassword',
          token: testToken
        })
        .expect(400)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if(err) {
            return done(err);
          }
          res.body.should.be.instanceof(Object);
          res.body.should.have.property('message', 'Admin account already active.');
          done();
        });
      });
    });
  });

  it('should fail when the admin username is already taken', function (done) {
    adminDB.searchByKey('by_email', 'mockadmin@vand.io', function (error, reply) {
      if(error) {
        console.log('Error retreiving admin account.'.red);
        return done(error);
      }
      var admin = reply.rows[0].value;
      admin.active = false;
      admin.username = 'mockadmin';
      admin.email = 'mockadmin@vand.io';
      admin.password = bcrypt.hashSync('mockPassword', 10);
      adminDB.insert(admin, admin._id, function (error, reply) {
        if(error) {
          console.log('Error inserting admin.'.red);
          return done(error);
        }
        request(app)
        .post('/api/admin/register')
        .send({
          email: 'mockadmin@vand.io',
          username: 'mockadmin',
          password: 'mockPassword',
          token: testToken
        })
        .expect(400)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if(err) {
            return done(err);
          }
          res.body.should.be.instanceof(Object);
          res.body.should.have.property('message', 'Username already exists.');
          done();
        });
      });
    });
  });
});