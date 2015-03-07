'use strict';

var validator = require('validator');
var appDB = require('../../../components/database/applications');

// Approves an application.
exports.index = function(req, res) {
  if(!req.session.isAdmin) {
    return res.status(401).jsonp({message: 'You must be an admin.'});
  }
  var username = req.session.username;
  var appId = req.body.id;
  if(validator.isNull(id)) {
    return res.status(400).jsonp({message: 'Missing id.'});
  }
  if(!validator.isUUID(id, 4)) {
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
    // TODO Kick off the user account generation workflow.
    appDB.insert(application, application._id, function (error) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not approve application.'});
      }
      return res.jsonp({message: 'Application approved.'});
    });
  });
};