'use strict';

var validator = require('validator');
var moment = require('moment');
var uuid = require('node-uuid');

var settings = require('../../../config/environment');
var adminDB = require('../../../components/database/admins');
var email = require('../../../components/emails');
var admin = require('../../../components/schema/admin')();

// Create a new admin account with a token.
// They must be an admin to do this so an admin session is required.
exports.index = function(req, res) {
  if(!req.session.isAdmin) {
    return res.status(401).jsonp({message: 'You must be an admin.'});
  }
  var email = req.body.email;
  // Validate input
  if(validator.isNull(email)) {
    return res.status(400).jsonp({message: 'Missing email.'});
  }
  if(!validator.isEmail(email)) {
    return res.status(400).jsonp({message: 'Invalid email.'});
  }
  adminDB.searchByKey('by_email', email, function (error, reply) {
    if(error) {
      console.log(error);
      return res.status(500).jsonp({message: 'Could not create admin.'});
    }
    // Some results from the database means they there is an account with this email.
    if(reply.rows.length !== 0) {
      return res.status(400).jsonp({message: 'Admin already exists.'});
    }
    admin._id = uuid.v4();
    admin.email = email;
    admin.tokens.register = uuid.v4();
    // Should always use UTC time when stored data.
    admin.activated = moment.utc().valueOf();
    adminDB.insert(admin, admin._id, function (error) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not create admin.'});
      }
      // We don't want to send an email out during test
      // so for now we check which enviornment we are running in.
      if(settings.env !== 'test') {
        email.admin.register({
          token: admin.tokens.register,
          email: admin.email
        }, function (error, info) {
          if(error) {
            console.log(error);
            return res.status(500).jsonp({message: 'Could not create admin.'});
          }
          return res.jsonp({message: 'Admin created.'});
        });
      } else {
        return res.jsonp({message: 'Admin created.'});
      }
    });
  });
};