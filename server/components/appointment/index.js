'use strict';

var kue = require('kue');
var jobs = kue.createQueue();
var Keybase = require('node-keybase');
var uuid = require('node-uuid');
var Twitter = require('twitter');
var settings = require('../../config/environment');
var keybase = new Keybase({
  username_or_email: settings.keybase.usernameOrEmail,
  passphrase: settings.keybase.password
});
var client = new Twitter({
  consumer_key: settings.twitter.consumerKey,
  consumer_secret: settings.twitter.consumerSecret,
  access_token_key: settings.twitter.token,
  access_token_secret: settings.twitter.tokenSecret
});

var email = require('../emails');
var applicationDB  = require('../../components/database/applications');

function _dmTwitter(twitterHandle, email, callback) {
  applicationDB.searchByKey('by_email', email, function (error, reply) {
    if(error) {
      return callback(error);
    }
    if(reply.rows.length === 0) {
      return callback('Application not found for email.');
    }
    var application = reply.rows[0].value;
    application.verifyToken = uuid.v4();
    applicationDB.insert(application. application._id, function (error) {
      if(error) {
        return callback(error);
      }
      client.post('direct_messages/new', {
        screen_name: twitterHandle,
        text: application.verifyToken
      }, function (error, data) {
        if(error) {
          return callback(error);
        }
        return callback(null);
      });
    });
  });
}

function _checkKeybase(appointment, callback) {
  keybase.user_lookup({
    domain: [appointment.keybase.domain],
  }, function (error, results) {
    if(error) {
      return callback(error);
    }
    var proofTypes = results.them[0].proofs_summary.by_proof_type;
    // We are only using Twitter for now.
    if(!proofTypes.twitter) {
      return callback('You must have Twitter on your keybase accont.');
    }
    var websites = proofTypes.generic_web_site;
    var siteServiceUrls = websites.map(function (website) {
      return website.service_url;
    });
    // We cannot find the domain in their list, check DNS.
    if(siteServiceUrls.indexOf(appointment.keybase.domain) === -1) {
      var dnsRecords = proofTypes.dns;
      dnsServiceUrls = dnsRecords.map(function (dnsRecord) {
        return dnsRecord.service_url;
      });
      // We cannot find the domain in the DNS list either, there is a no domain matching.
      if(dnsServiceUrls.indexOf(appointment.keybase.domain) === -1) {
        return callback('The domain is not valid for this username.');
      }
    } else {
      _dmTwitter(proofTypes.twitter.nametag, email, function (error) {
        if(error) {
          return callback(error);
        }
        return callback(null);
      });
    }
  });
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
    var email = job.data.email;
    if(appointment.inPerson && !appointment.useKeybase) {
      _alertAdmin(appointment, company, function (error) {
        if(error) {
          return done(error);
        }
        return done(null);
      });
    } else if(appointment.useKeybase && !appointment.inPerson) {
      // TODO Get keybase checks working.
      /*_checkKeybase(appointment, email, function (error) {
        if(error) {
          return done(error);
        }
        return done(null);
      });*/
      return done('Cannot have keybase appointment yet, coming soon.');
    } else {
      return done('Cannot have inperson and keybase appointments.');
    }
  });
};