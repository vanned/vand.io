'use strict';

var kue = require('kue');
var jobs = kue.createQueue();
var Keybase = require('node-keybase');
var settings = require('../../config/environment');
var keybase = new Keybase({
  username_or_email: settings.keybase.usernameOrEmail,
  passphrase: settings.keybase.password
});

var email = require('../emails');

function _checkKeybase(appointment, callback) {

}

function _alertAdmin(appointment, company, callback) {
  if(settings.env !== 'test') {
    email.admin.appointment({
      coordinator: appointment.coordinator,
      date: appointment.date,
      company: company
    }, function (error, info) {
      if(error) {
        console.log(error);
        return callback(error);
      }
      return callback(null);
    });
  } else {
    return callback(null);
  }
}

exports.update = function () {
  jobs.process('appointment', function (job, done) {
    job.progress(1, 100);
    var appointment = job.data.appointment;
    var company = job.data.company;
    if(appointment.inPerson && !appointment.useKeybase) {
      _alertAdmin(appointment, company, function (error) {
        if(error) {
          return done(error);
        }
        return done(null);
      });
    } else if(appointment.useKeybase && !appointment.inPerson) {
      _checkKeybase(appointment, function (error) {
        if(error) {
          return done(error);
        }
        return done(null);
      });
    } else {
      return done('Cannot have inperson and keybase appointments.');
    }
  });
};