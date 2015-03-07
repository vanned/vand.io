'use strict';

var validator = require('validator');

var appDB = require('../../components/database/applications');

// Get application from the database.
exports.index = function(req, res) {
  var id = req.query.id;
  // Validate input
  if(validator.isNull(id)) {
    return res.status(400).jsonp({message: 'Missing id.'});
  }
  if(!validator.isUUID(id, 4)) {
    return res.status(400).jsonp({message: 'Invalid id.'});
  }
  appDB.searchByKey('by_id', id, function (error, reply) {
    if(error) {
      console.log(error);
      return res.status(500).jsonp({message: 'Could not get the application.'});
    }
    if(reply.rows.length === 0) {
      return res.status(400).jsonp({message: 'Id does not exist.'});
    }
    var application = reply.rows[0].value;
    delete application._rev;
    return res.jsonp(application);
  });
};