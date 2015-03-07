'use strict';

var validator = require('validator');
var uuid = require('node-uuid');
var bcrypt = require('bcrypt');
var moment = require('moment');

var admin = require('../../../components/schema/admin')();
var adminDB = require('../../../components/database').admins;

function _createAdminAccount (adminData, res) {
  var username = adminData.username;
  var email = adminData.email;
  var password = adminData.password;
  // Hash password
  bcrypt.hash(password, 10, function (error, hash) {
    if(error) {
      console.log(error);
      return res.status(500).jsonp({message: 'Could not register admin.'});
    }
    if(adminData.entry) {
      admin = adminData.entry;
    } else {
      admin._id = uuid.v4();
    }
    admin.password = hash;
    admin.username = username;
    admin.tokens.register = null;
    admin.active = true;
    admin.activated = moment.utc().valueOf();
    // Store account in DB.
    adminDB.insert(admin, admin._id, function (error) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not register admin.'});
      }
      return res.jsonp({message: 'Admin registered.'});
    });
  });
}

// Registers a new admin with their token
// Also registers the first admin on the site without a token.
exports.index = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var username = req.body.username;
  // Validate input
  if(validator.isNull(username)) {
    return res.status(400).jsonp({message: 'Missing username.'});
  }
  if(validator.isNull(email)) {
    return res.status(400).jsonp({message: 'Missing email.'});
  }
  if(!validator.isEmail(email)) {
    return res.status(400).jsonp({message: 'Invalid email.'});
  }
  if(validator.isNull(password)) {
    return res.status(400).jsonp({message: 'Missing password.'});
  }
  // TODO Check the length of the password to be 12+ chars because they are an admin.

  // If no token, check if this is the first user. If it is, create the admin account.
  // If this is not the first account, they need a token.
  if(!req.body.token) {
    adminDB.searchByAllReduced(function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not register admin.'});
      }
      if(reply.rows.length === 0) {
        return _createAdminAccount({
          entry: null,
          username: username,
          email: email,
          password: password
        }, res);
      } else {
        return res.status(400).jsonp({message: 'Missing token.'});
      }
    });
  } else {
    var token = req.body.token;
    if(validator.isNull(token)) {
      return res.status(400).jsonp({message: 'Missing token.'});
    }
    if(!validator.isUUID(token, 4)) {
      return res.status(400).jsonp({message: 'Invalid token.'});
    }
    adminDB.searchByKey('by_register_token', token, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not register admin.'});
      }
      if(reply.rows.length === 0) {
        return res.status(400).jsonp({message: 'Invalid token.'});
      }
      var adminEntry = reply.rows[0].value;
      if(adminEntry.email !== email) {
        return res.status(400).jsonp({message: 'Email does not match token.'});
      }
      if(adminEntry.active) {
        return res.status(400).jsonp({message: 'Admin account already active.'});
      }
      // Search if username exists.
      adminDB.searchByKey('by_username', username, function (error, reply) {
        if(error) {
          console.log(error);
          return res.status(500).jsonp({message: 'Could not register admin.'});
        }
        if(reply.rows.length !== 0) {
          // The username exists already.
          return res.status(400).jsonp({message: 'Username already exists.'});
        }
        // Token is in the DB, let's create their account.
        return _createAdminAccount({
          entry: adminEntry,
          username: username,
          email: email,
          password: password
        }, res);
      });
    });
  }
};