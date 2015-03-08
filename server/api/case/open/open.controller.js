'use strict';

var validator = require('validator');
var sanitize = require('google-caja').sanitize;
var async = require('async');
var kue = require('kue');
var jobs = kue.createQueue();
var incident = require('../../../components/case');
// TODO Change this file size limit to a more reasonable value later.
var FILE_SIZE_LIMIT = 30 * 1024 * 1024;

// Creates a new case.
exports.index = function(req, res) {
  if(!req.session.username) {
    return res.status(401).jsonp({message: 'Please sign in.'});
  }
  if(req.session.isAdmin) {
    return res.status(401).jsonp({message: 'Please sign in as user.'})
  }
  var username = req.session.username;
  var category = req.body.category;
  var tags = req.body.tags;
  var description = req.body.description;
  if(validator.isNull(category)) {
    return res.status(400).jsonp({message: 'Missing category.'});
  }
  if(!validator.isCategory(category)) {
    return res.status(400).jsonp({message: 'Invalid category.'});
  }
  if(validator.isNull(tags)) {
    return res.status(400).jsonp({message: 'Missing tags.'});
  }
  if(!tags instanceof Array) {
    return res.status(400).jsonp({message: 'Tags must be a list.'});
  }
  for (var i = 0; i < tags.length; i++) {
    var tag = tags[i];
    if(typeof(tag) !== 'string') {
      return res.status(400).jsonp({message: 'One or more tags is invalid.'});
    }
  }
  if(validator.isNull(description)) {
    return res.status(400).jsonp({message: 'Missing description.'});
  }
  description = sanitize(description);
  var filenames = Object.keys(req.files);
  if(filenames.length === 0) {
    return res.status(400).jsonp({message: 'You must include 1 evidence file.'});
  }
  async.each(filenames, function (fieldname, cb) {
    if(req.files[fieldname].size === (FILE_SIZE_LIMIT)) {
      return cb('One or more files was too large, must be less than 30 MB.');
    }
    return cb(null);
  }, function (error) {
    if(error) {
      return res.status(400).jsonp({message: error});
    }
    var job = jobs.create('createCase', {
      username: username,
      category: category,
      tags: tags,
      description: description,
      files: req.files
    }, function (error) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not open a new case.'});
      }
      incident.upload();
      return res.jsonp({message: 'Case created, files are being uploaded.', id: job.id});
    });
  });
};

validator.extend('isCategory', function (str) {
  var categories = Object.freeze([
    '_EAVES_DROPPING_',
    '_DATA_MODIFICATION_',
    '_IP_SPOOFING_',
    '_PASSWORD_BASED_ATTACK_',
    '_DENIAL_OF_SERVICE_',
    '_MAN_IN_THE_MIDDLE_',
    '_COMPROMISED_KEY_ATTACK_',
    '_SNIFFER_ATTACK_',
    '_APPLICATION_LAYER_ATTACK_',
    '_UNDEFINED_'
  ]);
  return categories.indexOf(str) !== -1;
});