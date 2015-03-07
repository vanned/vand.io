'use strict';

var should = require('should');
var app = require('../../app');
var uuid = require('node-uuid');
var moment = require('moment');
var request = require('supertest');

var appDB = require('../../components/database/applications');
var application = require('../../components/schema/application')();

var appId;
describe('POST /api/application', function() {

  beforeEach(function (done) {
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
          done();
        });
      });
    })
  });

  it('should successfully update the application with an in person appointment', function(done) {
    request(app)
    .post('/api/application')
    .send({
      id: appId,
      appointment: {
        inPerson: true,
        useKeybase: false,
        coordinator: {
          firstname: 'John',
          lastname: 'Smith',
          phonenumber: '555-555-5555',
          email: 'mockuser@vand.io'
        },
        keybase: {},
        date: moment.utc().add(15, 'days').valueOf()
      },
      company: {
        name: 'Mock Company Inc.',
        website: 'http://mockwebsite.com'
      }
    })
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Application updated.');
      done();
    });
  });

  it('should successfully update the application with a keybase assessment', function(done) {
    request(app)
    .post('/api/application')
    .send({
      id: appId,
      appointment: {
        inPerson: false,
        useKeybase: true,
        coordinator: {},
        keybase: {
          username: 'johnsmith',
          domain: 'http://mockwebsite.com'
        },
        date: moment.utc().add(15, 'days').valueOf()
      },
      company: {
        name: 'Mock Company Inc.',
        website: 'http://mockwebsite.com'
      }
    })
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Application updated.');
      done();
    });
  });

  it('should fail when missing the application id', function(done) {
    request(app)
    .post('/api/application')
    .send({
      appointment: {
        inPerson: false,
        useKeybase: true,
        coordinator: {},
        keybase: {
          username: 'johnsmith',
          domain: 'http://mockwebsite.com'
        },
        date: moment.utc().add(15, 'days').valueOf()
      },
      company: {
        name: 'Mock Company Inc.',
        website: 'http://mockwebsite.com'
      }
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

  it('should fail when the application id is invalid', function(done) {
    request(app)
    .post('/api/application')
    .send({
      id: 'foobar',
      appointment: {
        inPerson: false,
        useKeybase: true,
        coordinator: {},
        keybase: {
          username: 'johnsmith',
          domain: 'http://mockwebsite.com'
        },
        date: moment.utc().add(15, 'days').valueOf()
      },
      company: {
        name: 'Mock Company Inc.',
        website: 'http://mockwebsite.com'
      }
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

  it('should fail when missing the appointment object', function(done) {
    request(app)
    .post('/api/application')
    .send({
      id: appId,
      company: {
        name: 'Mock Company Inc.',
        website: 'http://mockwebsite.com'
      }
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Missing appointment.');
      done();
    });
  });

  it('should fail when missing the company object', function(done) {
    request(app)
    .post('/api/application')
    .send({
      id: appId,
      appointment: {
        inPerson: false,
        useKeybase: true,
        coordinator: {},
        keybase: {
          username: 'johnsmith',
          domain: 'http://mockwebsite.com'
        },
        date: moment.utc().add(15, 'days').valueOf()
      }
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Missing company.');
      done();
    });
  });

  it('should fail when the appointment object is not an object', function(done) {
    request(app)
    .post('/api/application')
    .send({
      id: appId,
      appointment: 'foobar',
      company: {
        name: 'Mock Company Inc.',
        website: 'http://mockwebsite.com'
      }
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Appointment must be an object.');
      done();
    });
  });

  it('should fail when the appointment inPerson is missing', function(done) {
    request(app)
    .post('/api/application')
    .send({
      id: appId,
      appointment: {
        useKeybase: true,
        coordinator: {},
        keybase: {
          username: 'johnsmith',
          domain: 'http://mockwebsite.com'
        },
        date: moment.utc().add(15, 'days').valueOf()
      },
      company: {
        name: 'Mock Company Inc.',
        website: 'http://mockwebsite.com'
      }
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Appointment type "inPerson" is missing, must be a boolean.');
      done();
    });
  });

  it('should fail when the appointment useKeybase is missing', function(done) {
    request(app)
    .post('/api/application')
    .send({
      id: appId,
      appointment: {
        inPerson: false,
        coordinator: {},
        keybase: {
          username: 'johnsmith',
          domain: 'http://mockwebsite.com'
        },
        date: moment.utc().add(15, 'days').valueOf()
      },
      company: {
        name: 'Mock Company Inc.',
        website: 'http://mockwebsite.com'
      }
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Appointment type "useKeybase" is missing, must be a boolean.');
      done();
    });
  });

  it('should fail when the appointment inPerson is not a boolean', function(done) {
    request(app)
    .post('/api/application')
    .send({
      id: appId,
      appointment: {
        inPerson: 'foobar',
        useKeybase: true,
        coordinator: {},
        keybase: {
          username: 'johnsmith',
          domain: 'http://mockwebsite.com'
        },
        date: moment.utc().add(15, 'days').valueOf()
      },
      company: {
        name: 'Mock Company Inc.',
        website: 'http://mockwebsite.com'
      }
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Appointment type "inPerson" must be a boolean.');
      done();
    });
  });

  it('should fail when the appointment useKeybase is not a boolean', function(done) {
    request(app)
    .post('/api/application')
    .send({
      id: appId,
      appointment: {
        inPerson: false,
        useKeybase: 'foobar',
        coordinator: {},
        keybase: {
          username: 'johnsmith',
          domain: 'http://mockwebsite.com'
        },
        date: moment.utc().add(15, 'days').valueOf()
      },
      company: {
        name: 'Mock Company Inc.',
        website: 'http://mockwebsite.com'
      }
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Appointment type "useKeybase" must be a boolean.');
      done();
    });
  });

  it('should fail when the appointment useKeybase is not a boolean', function(done) {
    request(app)
    .post('/api/application')
    .send({
      id: appId,
      appointment: {
        inPerson: false,
        useKeybase: 'foobar',
        coordinator: {},
        keybase: {
          username: 'johnsmith',
          domain: 'http://mockwebsite.com'
        },
        date: moment.utc().add(15, 'days').valueOf()
      },
      company: {
        name: 'Mock Company Inc.',
        website: 'http://mockwebsite.com'
      }
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Appointment type "useKeybase" must be a boolean.');
      done();
    });
  });

  it('should fail when the appointment useKeybase and inPerson are true', function(done) {
    request(app)
    .post('/api/application')
    .send({
      id: appId,
      appointment: {
        inPerson: true,
        useKeybase: true,
        coordinator: {},
        keybase: {
          username: 'johnsmith',
          domain: 'http://mockwebsite.com'
        },
        date: moment.utc().add(15, 'days').valueOf()
      },
      company: {
        name: 'Mock Company Inc.',
        website: 'http://mockwebsite.com'
      }
    })
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('message', 'Choose one appointment type.');
      done();
    });
  });
  // TODO Finish writing the update application tests.
});