'use strict';

var should = require('should');
var app = require('../../app');
var colors = require('colors');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var request = require('supertest');

var userDB = require('../../components/database/users');
var user = require('../../components/schema/user')();

var cookie;
var username;
describe('GET /api/user', function() {

  beforeEach(function (done) {
    username = uuid.v4();
    user._id = uuid.v4();
    user.username = username;
    user.password = bcrypt.hashSync('mockpassword', 10);
    for (var i = 0; i < 10; i++) {
      user.resetCodes.push(uuid.v4());
    }
    userDB.insert(user, user._id, function (error) {
      if(error) {
        console.log('Error inserting user.'.red);
        return done(error);
      }
      request(app)
      .post('/api/user/login')
      .send({
        username: username,
        password: 'mockpassword'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (error, res) {
        if(error) {
          return done(error);
        }
        cookie = res.headers['set-cookie'];
        res.body.should.be.instanceof(Object);
        res.body.should.have.property('message', 'Logged in.');
        return done(null);
      });
    });
  });

  afterEach(function (done) {
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
          return done(null);
        });
      });
    });
  });

  it('should respond with the user', function(done) {
    request(app)
      .get('/api/user')
      .set('cookie', cookie)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        res.body.should.be.instanceof(Object);
        done();
      });
  });
});