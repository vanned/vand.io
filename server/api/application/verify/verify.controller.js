'use strict';

var validator = require('validator');
var kbpgp = require('kbpgp');
var uuid = require('node-uuid');
var moment = require('moment');
var bcrypt = require('bcrypt');
var fs = require('fs');
var request = require('request');
var Keybase = require('node-keybase');
var settings = require('../../../config/environment');
var VANDIO_PGP_KEY = settings.keybase.privatekey;
var VANDIO_PASSPHRASE = settings.keybase.password;
var keybase = new Keybase({
  username_or_email: settings.keybase.usernameOrEmail,
  passphrase: VANDIO_PASSPHRASE
});

var user = require('../../../components/schema/user')();
var applicationDB  = require('../../../components/database/applications');
var userDB = require('../../../components/database/users');
var email = require('../../../components/emails');

/**
 * Get the server key manager object based on the private key of the server Keybase account.
 *
 * Take private key on server from settings file and import into key manager. Unlock the key using the Keybase password.
 *
 * @param {Function} callback The callback function.
 * @return {Function} The callback function.
 */
function _getServerKeyManager(callback) {
  // Get Import private key into key manager.
  kbpgp.KeyManager.import_from_armored_pgp({
    armored: VANDIO_PGP_KEY
  }, function (error, serverKM) {
    if(error) {
      return callback(error);
    }
    if(serverKM.is_pgp_locked()) {
      // Unlock the private key.
      serverKM.unlock_pgp({
        passphrase: VANDIO_PASSPHRASE
      }, function (error) {
        if(error) {
          return callback(error);
        }
        return callback(null, serverKM);
      });
    } else {
      return callback(null, serverKM);
    }
  });
}

/**
 * Get the user key manager object based on the Keybase username.
 *
 * Gets the public key of the username and imports it into the keymanager.
 *
 * @param {String} username The Keybase username.
 * @param {Function} callback The callback function.
 * @return {Function} The callback function.
 */
function _getUserKeyManager(username, callback) {
  keybase.public_key_for_username(username, function (error, pgpKey) {
    if(error) {
      return callback(error);
    }
    kbpgp.KeyManager.import_from_armored_pgp({
      armored: pgpKey
    }, function (error, userKM) {
      if(error) {
        return callback(error);
      }
      return callback(null, userKM);
    });
  });
}

/**
 * Looks up a Keybase user by their key fingerprint.
 * @param {String} fingerprint The keybase user key fingerprint.
 * @param {Function} callback The callback function
 * @return {Function} The callback function.
 */
function _lookupUserByFingerPrint(fingerprint, callback) {
  keybase.user_lookup({
    key_fingerprint: [fingerprint]
  }, function (error, results) {
    if(error) {
      return callback(error);
    }
    return callback(null, results.them[0].basics.username);
  });
}

// Verify incoming encrypted message with application.
exports.index = function(req, res) {
  var id = req.body.id;
  var message = req.body.message;
  // Validate input.
  if(validator.isNull(id)) {
    return res.status(400).jsonp({message: 'Missing id.'});
  }
  if(validator.isNull(message)) {
    return res.status(400).jsonp({message: 'Missing message.'});
  }
  if(!validator.isUUID(id, 4)) {
    return res.status(400).jsonp({message: 'Invalid id.'});
  }
  // Get server key manager object.
  _getServerKeyManager(function (error, serverKM) {
    if(error) {
      console.log(error);
      return res.status(500).jsonp({message: 'Could not verify application.'});
    }
    // Get application from database.
    applicationDB.searchByKey('by_id', id, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not verify application.'});
      }
      if(reply.rows.length === 0) {
        return res.status(400).jsonp({message: 'Application does not exist.'});
      }
      var application = reply.rows[0].value;
      if(application.approved) {
        return res.status(400).jsonp({message: 'Application already approved.'});
      }
      // Get user key manager object.
      _getUserKeyManager(application.appointment.keybase.username, function (error, userKM) {
        if(error) {
          console.log(error);
          return res.status(500).jsonp({message: 'Could not verify application.'});
        }
        // Decrypt message.
        var ring = new kbpgp.keyring.KeyRing;
        ring.add_key_manager(userKM);
        ring.add_key_manager(serverKM);
        kbpgp.unbox({
          keyfetch: ring,
          armored: message
        }, function (error, literals) {
          if(error) {
            console.log(error);
            return res.status(500).jsonp({message: 'Could not verify application.'});
          }
          var decryptedMessage = literals[0].toString();
          // Check the message matches value in database.
          if(decryptedMessage !== application.verifyToken) {
            return res.status(400).jsonp({message: 'Message does not match expected value.'});
          }
          // Get fingerprint from decrypted message.
          var dataSigner = literals[0].get_data_signer();
          if(!dataSigner) {
            return res.status(400).jsonp({message: 'You must sign your message.'});
          }
          var keyManager = dataSigner.get_key_manager();
          if(!keyManager) {
            console.log('Could not get key manager from data signer.');
            return res.status(500).jsonp({message: 'Could not verify application.'});
          }
          // Check to make sure signer matches keybase username.
          _lookupUserByFingerPrint(keyManager.get_pgp_fingerprint().toString('hex'), function (error, username) {
            if(error) {
              console.log(error);
              return res.status(500).jsonp({message: 'Could not verify application.'});
            }
            if(username !== application.appointment.keybase.username) {
              return res.status(400).jsonp({message: 'This message is signed with the wrong username.'});
            }
            // Update application approval.
            application.approved = true;
            application.verifyToken = null;
            application.approvedByKeybase = true;
            application.updated = moment.utc().valueOf();
            // Create new random account for company.
            user._id = uuid.v4();
            user.username = uuid.v4();
            var clearText = uuid.v4();
            user.password = bcrypt.hashSync(clearText, 10);
            for (var i = 0; i < 10; i++) {
              user.resetCodes.push(uuid.v4());
            }
            // Add user into database.
            userDB.insert(user, user._id, function (error) {
              if(error) {
                console.log(error);
                return res.status(500).jsonp({message: 'Could not verify application.'});
              }
              // Update application in database.
              applicationDB.insert(application, application._id, function (error) {
                if(error) {
                  console.log(error);
                  return res.status(500).jsonp({message: 'Could not verify application.'});
                }
                // Don't email in a test case.
                if(settings.env !== 'test') {
                  email.users.register({
                    username: user.username,
                    password: clearText,
                    resetCodes: user.resetCodes,
                    email: application.email
                  }, function (error, info) {
                    if(error) {
                      // TODO Revert the database changes of inserting the users.
                      console.log(error);
                      return res.status(500).jsonp({message: 'Could not verify application.'});
                    }
                    return res.jsonp({message: 'Application verified, please check your email.'});
                  });
                } else {
                  return res.jsonp({message: 'Application verified, please check your email.'});
                }
              });
            });
          });
        });
      });
    });
  });
};