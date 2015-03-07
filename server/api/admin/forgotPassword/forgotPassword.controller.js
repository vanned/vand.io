'use strict';

var validator = require('validator');
var bcrypt = require('bcrypt');

var adminDB = require('../../../components/database/admins');

// Update an account with a new password.
exports.index = function(req, res) {
  var id = req.body.id;
  var token = req.body.token;
  var newPassword = req.body.new;
  var confirmPassword = req.body.confirm;
  // Validate input
  if(validator.isNull(id)) {
    return res.status(400).jsonp({message: 'Missing id.'});
  }
  if(validator.isNull(token)) {
    return res.status(400).jsonp({message: 'Missing token.'});
  }
  if(validator.isNull(newPassword)) {
    return res.status(400).jsonp({message: 'Missing new password.'});
  }
  if(validator.isNull(confirmPassword)) {
    return res.status(400).jsonp({message: 'Missing confirmed password.'});
  }
  if(!validator.isUUID(id, 4)) {
    return res.status(400).jsonp({message: 'Invalid id.'});
  }
  if(!validator.isUUID(token, 4)) {
    return res.status(400).jsonp({message: 'Invalid token.'});
  }
  // Check if password and confirm passwords match.
  if(newPassword !== confirmPassword) {
    return res.status(400).jsonp({message: 'Passwords do not match.'});
  }
  // Find admin by unique id.
  adminDB.searchByKey('by_id', id, function (error, reply) {
    if(error) {
      console.log(error);
      return res.status(500).jsonp({message: 'Could not change password.'});
    }
    // Admin not found using that id.
    if(reply.rows.length === 0) {
      return res.status(400).jsonp({message: 'Admin does not exist with that id.'});
    }
    var admin = reply.rows[0].value;
    // Check if reset token is the token provided.
    if(admin.tokens.reset !== token) {
      return res.status(400).jsonp({message: 'Token does not match admin.'});
    }
    // Encrypt new password.
    bcrypt.hash(newPassword, 10, function (error, hash) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not change password.'});
      }
      admin.tokens.reset = null;
      admin.password = hash;
      // Update admin in the database.
      adminDB.insert(admin, admin._id, function (error) {
        if(error) {
          console.log(error);
          return res.status(500).jsonp({message: 'Could not change password.'});
        }
        return res.jsonp({message: 'Password changed.'});
      });
    });
  });
};