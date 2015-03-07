'use strict';

var validator = require('validator');
var moment = require('moment');
var uuid = require('node-uuid');

var settings = require('../../../config/environment');
var appDB = require('../../../components/database/applications');
var captcha = require('../../../components/captcha');
var application = require('../../../components/schema/application')();
var email = require('../../../components/emails');

/**
 * Revert the application stored in the database.
 * @param  {Object}   application The application object.
 * @param  {Function} callback The callback function.
 * @return {Function} The callback function.
 */
function _revertApplication(application, callback) {
  appDB.delete(application._id, application._rev, function (error) {
    if(error) {
      return callback(error);
    }
    return callback(null);
  });
}

// Create an application for a company.
exports.index = function(req, res) {
  var emailInput = req.body.email;
  var captchaResp = req.body.captcha;
  // Validate input
  if(validator.isNull(emailInput)) {
    return res.status(400).jsonp({message: 'Missing email.'});
  }
  if(!validator.isEmail(emailInput)) {
    return res.status(400).jsonp({message: 'Invalid email.'});
  }
  if(validator.isNull(captchaResp)) {
    return res.status(400).jsonp({message: 'Missing CAPTCHA response.'});
  }
  captcha.verify(captchaResp, req.ip, function (error) {
    if(error) {
      return res.status(400).jsonp({message: error});
    }
    // Search application by email.
    appDB.searchByKey('by_email', emailInput, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not create application.'});
      }
      if(reply.rows.length !== 0) {
        return res.status(400).jsonp({message: 'Email already applied.'});
      }
      application._id = uuid.v4();
      application.email = emailInput;
      application.created = moment.utc().valueOf();
      appDB.insert(application, application._id, function (error) {
        if(error) {
          console.log(error);
          return res.status(500).jsonp({message: 'Could not create application.'});
        }
        if(settings.env !== 'test') {
          email.applications.create({
            id: application._id,
            email: application.email
          }, function (error, info) {
            if(error) {
              console.log(error);
              _revertApplication(application, function (error) {
                if(error) {
                  console.log(error);
                }
                return res.status(500).jsonp({message: 'Could not create application.'});
              });
            }
            return res.jsonp({message: 'Application created.'});
          });
        } else {
          return res.jsonp({message: 'Application created.'});
        }
      });
    });
  });
};