'use strict';

var validator = require('validator');
var uuid = require('node-uuid');

var settings = require('../../../config/environment');
var adminDB = require('../../../components/database/admins');
var email = require('../../../components/emails');

/**
 * Gets the account from the database using either the username or email address.
 *
 * @param  {Object}   params   The params object
 * @param  {String}   params.username   The username of the account.
 * @param  {String}   params.email   The email address of the account.
 * @param  {Function} callback The callback function
 * @return {Function} The callback function
 */
function _getAccount (params, callback) {
  if(!params.username) {
    adminDB.searchByKey('by_email', params.email, function (error, reply) {
      if(error) {
        console.log(error);
        return callback({code: 500, message: 'Could not send lost password email.'});
      }
      if(reply.rows.length === 0) {
        return callback({code: 400, message: 'Email does not exist.'});
      }
      return callback(null, reply.rows[0].value);
    });
  } else {
    adminDB.searchByKey('by_username', params.username, function (error, reply)  {
      if(error) {
        console.log(error);
        return callback({code: 500, message: 'Could not send lost password email.'});
      }
      if(reply.rows.length === 0) {
        return callback({code: 400, message: 'Username does not exist.'});
      }
      return callback(null, reply.rows[0].value);
    });
  }
}

// Sends a lost password email.
exports.index = function(req, res) {
  var username = req.body.username;
  var email = req.body.email;
  // Validate input
  if(validator.isNull(username) && validator.isNull(email)) {
    return res.status(400).jsonp({message: 'Missing username or email.'});
  }
  if(!validator.isNull(email) && !validator.isEmail(email)) {
    return res.status(400).jsonp({message: 'Invalid email.'});
  }
  _getAccount({
    username: username,
    email: email
  }, function (error, account) {
    if(error) {
      return res.status(error.code).jsonp({message: error.message});
    }
    // We don't care is the account is active because they don't even know their password.
    account.tokens.reset = uuid.v4();
    // Update database with the new reset token.
    adminDB.insert(account, account._id, function (error, reply) {
      if(error) {
        console.log(error);
        return callback({code: 500, message: 'Could not send lost password email.'});
      }
      // We don't want to kick off an email in a test case.
      if(settings.env !== 'test') {
        email.admin.lostPassword({
          id: account._id,
          token: account.tokens.reset,
          email: account.email
        }, function (error) {
          if(error) {
            console.log(error);
            return res.status(500).jsonp({message: 'Could not send lost password email.'});
          }
          return res.jsonp({message: 'Reset email sent.'});
        });
      } else {
        return res.jsonp({message: 'Reset email sent.'});
      }
    });
  });
};
