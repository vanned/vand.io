'use strict';

var validator = require('validator');
var uuid = require('node-uuid');
var bcrypt = require('bcrypt');

var appDB = require('../../../components/database/applications');
var userDB = require('../../../components/database/users');
var user = require('../../../components/schema/user')();
var settings = require('../../../config/environment');
var email = require('../../../components/emails');

// Approves an application.
exports.index = function(req, res) {
  if(!req.session.isAdmin) {
    return res.status(401).jsonp({message: 'You must be an admin.'});
  }
  var username = req.session.username;
  var appId = req.body.id;
  if(validator.isNull(appId)) {
    return res.status(400).jsonp({message: 'Missing id.'});
  }
  if(!validator.isUUID(appId, 4)) {
    return res.status(400).jsonp({message: 'Invalid id.'});
  }
  appDB.searchByKey('by_id', appId, function (error, reply) {
    if(error) {
      console.log(error);
      return res.status(500).jsonp({message: 'Could not approve application.'});
    }
    if(reply.rows.length === 0) {
      return res.status(400).jsonp({message: 'Id does not exist.'});
    }
    var application = reply.rows[0].value;
    application.approved = true;
    application.approvedBy = username;
    // Create new random account for company.
    user._id = uuid.v4();
    user.username = uuid.v4();
    var clearText = uuid.v4();
    user.password = bcrypt.hashSync(clearText, 10);
    for (var i = 0; i < 10; i++) {
      user.resetCodes.push(uuid.v4());
    }
    userDB.insert(user, user._id, function (error) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not approve application.'});
      }
      appDB.insert(application, application._id, function (error) {
        if(error) {
          console.log(error);
          return res.status(500).jsonp({message: 'Could not approve application.'});
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
              return res.status(500).jsonp({message: 'Could not approve application.'});
            }
            return res.jsonp({message: 'Application approved.'});
          });
        } else {
          return res.jsonp({message: 'Application approved.'});
        }
      });
    });
  });
};