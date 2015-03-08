'use strict';

// Logs the admin out of their account.
exports.index = function(req, res) {
  req.session.destroy(function (error) {
    if(error) {
      return res.status(500).jsonp({message: 'Could not log admin out.'});
    }
    return res.jsonp({message: 'Logged out.'});
  });
};