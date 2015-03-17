'use strict';

var validator = require('validator');
var moment = require('moment');
var kue = require('kue');
var jobs = kue.createQueue();

var appDB = require('../../components/database/applications');
var appment = require('../../components/appointment');

function _validateCoordinator(coordinator, inPerson, callback) {
  if(typeof(coordinator) !== 'object') {
    return callback('Coodinator must be an object.');
  }
  if(validator.isNull(coordinator.firstname) && inPerson) {
    return callback('Missing coordinator firstname.');
  }
  if(validator.isNull(coordinator.lastname) && inPerson) {
    return callback('Missing coordinator lastname.');
  }
  if(validator.isNull(coordinator.phonenumber) && inPerson) {
    return callback('Missing coordinator phone number.');
  }
  if(!validator.isPhoneNumber(coordinator.phonenumber, 'US') && inPerson) {
    return callback('Invalid coordinator phone number, currently US numbers only.');
  }
  if(validator.isNull(coordinator.email) && inPerson) {
    return callback('Missing coordinator email.');
  }
  if(!validator.isEmail(coordinator.email) && inPerson) {
    return callback('Invalid coordinator email.');
  }
  return callback(null, {
    firstname: coordinator.firstname,
    lastname: coordinator.lastname,
    phonenumber: coordinator.phonenumber,
    email: coordinator.email
  });
}

function _validateKeybase(keybase, useKeybase, callback) {
  if(typeof(keybase) !== 'object') {
    return callback('Keybase must be an object.');
  }
  if(validator.isNull(keybase.username) && useKeybase) {
    return callback('Missing keybase username.');
  }
  return callback(null, {
    username: keybase.username
  });
}

function _validateAppointment(appointment, callback) {
  if(typeof(appointment) !== 'object') {
    return callback('Appointment must be an object.');
  }
  if(validator.isNull(appointment.inPerson)) {
    return callback('Appointment type "inPerson" is missing, must be a boolean.');
  }
  if(validator.isNull(appointment.useKeybase)) {
    return callback('Appointment type "useKeybase" is missing, must be a boolean.');
  }
  if(!validator.isBoolean(appointment.inPerson)) {
    return callback('Appointment type "inPerson" must be a boolean.');
  }
  // Strict typing on boolean checks to "true"/"false" and "1"/"0".
  appointment.inPerson = validator.toBoolean(appointment.inPerson, true);
  if(!validator.isBoolean(appointment.useKeybase)) {
    return callback('Appointment type "useKeybase" must be a boolean.');
  }
  // Strict typing on boolean checks to "true"/"false" and "1"/"0".
  appointment.useKeybase = validator.toBoolean(appointment.useKeybase, true);
  if(appointment.useKeybase === appointment.inPerson) {
    return callback('Choose one appointment type.');
  }
  if(validator.isNull(appointment.date)) {
    return callback('Missing appointment date/time.');
  }
  if(!moment.utc(appointment.date).isValid()) {
    return callback('Invalid appointment date/time.');
  }
  if(moment.utc(appointment.date).diff(moment.utc()) <= 0) {
    return callback('Appointment date already past.');
  }
  appointment.date = moment.utc(appointment.date).valueOf();
  if(validator.isNull(appointment.coordinator)) {
    return callback('Missing appointment coordinator.');
  }
  if(validator.isNull(appointment.keybase)) {
    return callback('Missing appointment keybase.');
  }
  _validateCoordinator(appointment.coordinator, appointment.inPerson, function (error, coordinator) {
    if(error) {
      return callback(error);
    }
    appointment.coordinator = coordinator
    _validateKeybase(appointment.keybase, appointment.useKeybase, function (error, keybase) {
      if(error) {
        return callback(error);
      }
      appointment.keybase = keybase;
      return callback(null, {
        inPerson: appointment.inPerson,
        coordinator: appointment.coordinator,
        useKeybase: appointment.useKeybase,
        keybase: appointment.keybase,
        date: appointment.date
      });
    });
  });
}

function _validateCompany(company, callback) {
  if(typeof(company) !== 'object') {
    return callback('Company must be an object.');
  }
  if(validator.isNull(company.name)) {
    return callback('Missing company name.');
  }
  if(validator.isNull(company.website)) {
    return callback('Missing company website.');
  }
  if(!validator.isURL(company.website)) {
    return callback('Invalid company website.');
  }
  return callback(null, {
    name: company.name,
    website: company.website
  });
}

// Update an existing application based on the application id.
exports.index = function(req, res) {
  var id = req.body.id;
  var appointment = req.body.appointment;
  var company = req.body.company;
  // Validate input.
  if(validator.isNull(id)) {
    return res.status(400).jsonp({message: 'Missing id.'});
  }
  if(!validator.isUUID(id, 4)) {
    return res.status(400).jsonp({message: 'Invalid id.'});
  }
  if(validator.isNull(appointment)) {
    return res.status(400).jsonp({message: 'Missing appointment.'});
  }
  if(validator.isNull(company)) {
    return res.status(400).jsonp({message: 'Missing company.'});
  }
  _validateAppointment(appointment, function (error, appointment) {
    if(error) {
      return res.status(400).jsonp({message: error});
    }
    _validateCompany(company, function (error, company) {
      if(error) {
        return res.status(400).jsonp({message: error});
      }
      appDB.searchByKey('by_id', id, function (error, reply) {
        if(error) {
          console.log(error);
          return res.status(500).jsonp({message: 'Could not update application.'});
        }
        // Application does not exist for the requested id.
        if(reply.rows.length === 0) {
          return res.status(400).jsonp({message: 'Application does not exist.'});
        }
        var application = reply.rows[0].value;
        if(application.approved) {
          application.approved = false;
        }
        var newApplication = require('../../components/schema/application')();
        var now = moment.utc();
        // If we originally had inPerson and now we want keybase
        // If the original appointment date has not passed yet
        if(application.appointment.inPerson && appointment.useKeybase && moment.utc(application.appointment.date).diff(now) > 0) {
          // Empty the appointment object.
          application.appointment = newApplication.appointment;
          application.appointment.date = appointment.date;
          // Update the object with just keybase stuff.
          application.appointment.useKeybase = appointment.useKeybase;
          application.appointment.keybase = appointment.keybase;
          // If we originally had keybase and now we want an inperson appointment.
          // If the original appointment date has not passed yet
        } else if(application.appointment.useKeybase && appointment.inPerson && moment.utc(application.appointment.date).diff(now) > 0) {
          // Empty the appointment object.
          application.appointment = newApplication.appointment;
          application.appointment.date = appointment.date;
          // Update the object with just in person stuff.
          application.appointment.inPerson = appointment.inPerson;
          application.appointment.coordinator = appointment.coordinator;
        } else {
          application.appointment = appointment;
        }
        application.updated = moment.utc().valueOf();
        application.company = company;
        appDB.insert(application, application._id, function (error) {
          if(error) {
            console.log(error);
            return res.status(500).jsonp({message: 'Could not update application.'});
          }
          var job = jobs.create('appointment', {
            appointment: application.appointment,
            company: application.company,
            email: application.email
          }).save(function (error) {
            if(error) {
              console.log(error);
              return res.status(500).jsonp({message: 'Could not update application.'});
            }
            appment.update();
            return res.jsonp({message: 'Application updated.', id: job.id});
          });
        });
      });
    });
  });
};

validator.extend('isBoolean', function (str) {
  switch(str) {
    case 1:
    case true:
    case 0:
    case false:
    case '1':
    case 'true':
    case '0':
    case 'false':
      return true;
    default:
      return false;
  }
});

validator.extend('isPhoneNumber', function (str, type) {
  switch(type) {
    case 'US':
    // Matches 555-555-5555 or 555.555.5555 or 555.555-5555 or 555-555.5555
    var usPhoneRegex = new RegExp(/^(([0-9]{3})(?:-|.)([0-9]{3})(?:-|.)([0-9]{4}))$/);
    return usPhoneRegex.test(str);
    default:
    return false;
  }
});