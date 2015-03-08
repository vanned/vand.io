'use strict';

// Logs the user out of their accout.
exports.index = function(req, res) {
  req.session.destroy(function (error) {
    if(error) {
      return res.status(500).jsonp({message: 'Could not log user out.'});
    }
    return res.jsonp({message: 'Logged out.'});
  });
};