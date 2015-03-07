'use strict';

var validator = require('validator');

var userDB = require('../../components/database/users');

// Get the user from the database.
exports.index = function(req, res) {
  if(!req.session.username) {
    return res.status(401).jsonp({message: 'Please sign in.'});
  }
  if(req.session.isAdmin) {
    return res.status(401).jsonp({message: 'Please sign in as a user.'});
  }
  var username = req.session.username;
  // Validate input
  if(validator.isNull(username)) {
    return res.status(400).jsonp({message: 'Missing username.'});
  }
  if(!validator.isUUID(username, 4)) {
    return res.status(400).jsonp({message: 'Invalid username.'});
  }
  userDB.searchByKey('by_username', username, function (error, reply) {
    if(error) {
      console.log(error);
      return res.status(500).jsonp({message: 'Could not get the user.'});
    }
    if(reply.rows.length === 0) {
      return res.status(400).jsonp({message: 'User does not exist.'});
    }
    var user = reply.rows[0].value;
    delete user._rev;
    delete user.password;
    delete user.resetCodes;
    return res.jsonp(user);
  });
};