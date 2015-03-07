'use strict';

var validator = require('validator');
var bcrypt = require('bcrypt');

var adminDB = require('../../../components/database/admins');

// Log the admin into the site.
exports.index = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  // Validate input.
  if(validator.isNull(username)) {
    return res.status(400).jsonp({message: 'Missing username.'});
  }
  if(validator.isNull(password)) {
    return res.status(400).jsonp({message: 'Missing password.'});
  }
  // TODO Check for length 12+ for admins

  // Search for admin in database by username.
  adminDB.searchByKey('by_username', username, function (error, reply) {
    if(error) {
      console.log(error);
      return res.status(500).jsonp({message: 'Could not log admin in.'});
    }
    // The database returned no rows.
    if(reply.rows.length === 0) {
      return res.status(400).jsonp({message: 'Username does not exist.'});
    }
    var admin = reply.rows[0].value;
    // Check if passwords match.
    bcrypt.compare(password, admin.password, function (error, matches) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not log admin in.'});
      }
      if(!matches) {
        // TODO Lock the user out if they try too many times.
        return res.status(400).jsonp({message: 'Passwords do not match.'});
      }
      // Assign session to user.
      req.session.isAdmin = true;
      req.session.username = admin.username;
      req.session.email = admin.email;
      return res.jsonp({message: 'Logged in.'});
    });
  });
};