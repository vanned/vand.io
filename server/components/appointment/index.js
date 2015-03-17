'use strict';

var kue = require('kue');
var jobs = kue.createQueue();
var kbpgp = require('kbpgp');
var Keybase = require('node-keybase');
var uuid = require('node-uuid');
var settings = require('../../config/environment');
var VANDIO_PGP_KEY = settings.keybase.privatekey;
var VANDIO_PASSPHRASE = settings.keybase.password;
var keybase = new Keybase({
  username_or_email: settings.keybase.usernameOrEmail,
  passphrase: VANDIO_PASSPHRASE
});

var email = require('../emails');
var applicationDB  = require('../../components/database/applications');

function _addVerifyToken(email, callback) {
  applicationDB.searchByKey('by_email', email, function (error, reply) {
    if(error) {
      return callback(error);
    }
    if(reply.rows.length === 0) {
      return callback('Application not found for email.');
    }
    var application = reply.rows[0].value;
    application.verifyToken = uuid.v4();
    applicationDB.insert(application, application._id, function (error) {
      if(error) {
        return callback(error);
      }
      return callback(null, application.verifyToken);
    });
  });
}

function _encryptMessage(server, user, verifyToken, callback) {
  var params = {
    msg: verifyToken,
    encrypt_for: user,
    sign_with: server
  }
  kbpgp.box(params, function (error, resultString, resultBuffer) {
    if(error) {
      return callback(error);
    }
    return callback(null, resultString);
  });
}

function _checkKeybase(appointment, website, email, callback) {
  keybase.user_lookup({
    usernames: [appointment.keybase.username],
    domain: [website],
  }, function (error, results) {
    if(error) {
      return callback(error);
    }
    var proofTypes = results.them[0].proofs_summary.by_proof_type;
    var websites = proofTypes.generic_web_site || [];
    var siteServiceUrls = websites.map(function (website) {
      return website.service_url;
    });
    var dnsRecords = proofTypes.dns || [];
    var dnsServiceUrls = dnsRecords.map(function (dnsRecord) {
      return dnsRecord.service_url;
    });
    // We found the domain in either their sites list or DNS list.
    if(siteServiceUrls.indexOf(website) !== -1 || dnsServiceUrls.indexOf(website) !== -1) {
      // Get user PGP key and user fingerprint.
      var userPGPKey = results.them[0].public_keys.primary.bundle;
      console.log(userPGPKey);
      // Create a token to encrypt and add it to their account.
      _addVerifyToken(email, function (error, verifyToken) {
        if(error) {
          return callback(error);
        }
        // Create server key manager.
        kbpgp.KeyManager.import_from_armored_pgp({
          armored: VANDIO_PGP_KEY
        }, function (error, server) {
          if(error) {
            return callback(error);
          }
          if(server.is_pgp_locked()) {
            // Unlock keymanager for server.
            server.unlock_pgp({
              passphrase: VANDIO_PASSPHRASE
            }, function (error) {
              if(error) {
                return callback(error);
              }
              // Get user key manager.
              kbpgp.KeyManager.import_from_armored_pgp({
                armored: userPGPKey
              }, function (error, user) {
                if(error) {
                  return callback(error);
                }
                // Encrypt token and return encrypted message.
                _encryptMessage(server, user, verifyToken, function (error, message) {
                  if(error) {
                    return callback(error);
                  }
                  return callback(null, message);
                });
              });
            });
          } else {
            // Get user key manager.
            kbpgp.KeyManager.import_from_armored_pgp({
              armored: userPGPKey
            }, function (error, user) {
              if(error) {
                return callback(error);
              }
              // Encrypt token and return encrypted message.
              _encryptMessage(server, user, verifyToken, function (error, message) {
                if(error) {
                  return callback(error);
                }
                return callback(null, message);
              });
            });
          }
        });
      });
    } else {
      // We cannot find the domain in the DNS list either, there is a no domain matching.
      return callback('The domain is not valid for this username.');
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
          return done(new Error(error));
        }
        return done(null);
      });
    } else if(appointment.useKeybase && !appointment.inPerson) {
      _checkKeybase(appointment, company.website, email, function (error, message) {
        if(error) {
          return done(new Error(error));
        }
        return done(null, message);
      });
    } else {
      return done(new Error('Cannot have inperson and keybase appointments.'));
    }
  });
};