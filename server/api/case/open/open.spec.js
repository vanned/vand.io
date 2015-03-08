'use strict';

var should = require('should');
var app = require('../../../app');
var colors = require('colors');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var request = require('supertest');
var nock = require('nock');
// Allow other network connections such as CouchDB.
nock.enableNetConnect();
var fs = require('fs');

var userDB = require('../../../components/database/users');
var user = require('../../../components/schema/user')();

var cookie;
var username;
describe('POST /api/case/open', function() {

  beforeEach(function (done) {
    /*nock('https://test-bucket.s3-us-west-1.amazonaws.com:443')
    .put('/logs.txt', fs.readFileSync(__dirname + '/logs.txt', {encoding: 'utf8'}))
    .reply(200, {
      'ETag': 'd79254641d0c186d4d13427c85ce3fe7',
      'Location': 'https://test-bucket.s3-us-west-1.amazonaws.com/log.txt'
    });*/
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

  it('should successfully open a new case', function(done) {
    var parts = [
      '--asdasdasdasd\r\n',
      'Content-Type: text/plain\r\n',
      'Content-Disposition: form-data; name="evidence"\r\n',
      '\r\n',
      fs.readFileSync(__dirname + '/logs.txt', {encoding: 'utf8'}),
      '\r\n',
      '--asdasdasdasd--'
    ];
    console.log(parts);
    request(app)
    .post('/api/case/open')
    .send({
      category: '_DENIAL_OF_SERVICE_',
      tags: ['lone wolf', 'lizard squad'],
      description: 'Our website went out of commition for 6 hours. We called it server maintenance, but in fact it was an attack on our network. We blocked the list of IPs causing the issue.',
    })
    .set('cookie', cookie)
    .set('Content-Type', 'multipart/form-data; boundary=asdasdasdasd')
    .set('Content-Length', Buffer.byteLength(parts.join('')))
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      console.log(res.body)
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Case opened.');
      done();
    });
  });
});