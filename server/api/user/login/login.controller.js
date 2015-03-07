'use strict';

var validator = require('validator');
var bcrypt = require('bcrypt');

var userDB = require('../../../components/database/users');

// Log the user into the site.
exports.index = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  if(validator.isNull(username)) {
    return res.status(400).jsonp({message: 'Missing username.'});
  }
  if(validator.isNull(password)) {
    return res.status(400).jsonp({message: 'Missing password.'});
  }
  userDB.searchByKey('by_username', username, function (error, reply) {
    if(error) {
      console.log(error);
      return res.status(500).jsonp({message: 'Could not log the user in.'});
    }
    if(reply.rows.length === 0) {
      return res.status(400).jsonp({message: 'User does not exist.'});
    }
    var user = reply.rows[0].value;
    bcrypt.compare(password, user.password, function (error, matches) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not log the user in.'});
      }
      if(!matches) {
        // TODO Lock the user out if they continue to use the wrong password.
        return res.status(400).jsonp({message: 'Wrong password.'});
      }
      req.session.isAdmin = false;
      req.session.username = user.username;
      req.session.email = user.email;
      return res.jsonp({message: 'Logged in.'});
    });
  });
};