/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/case', require('./api/case'));
  app.use('/api/application', require('./api/application'));
  app.use('/api/application/approved', require('./api/application/approved'));

  app.use('/api/admin/forgotPassword', require('./api/admin/forgotPassword'));
  app.use('/api/admin/lostPassword', require('./api/admin/lostPassword'));
  app.use('/api/admin/login', require('./api/admin/login'));
  app.use('/api/admin/token', require('./api/admin/token'));
  app.use('/api/admin/register', require('./api/admin/register'));

  app.use('/api/user', require('./api/user'));
  app.use('/api/user/apply', require('./api/user/apply'));
  app.use('/api/user/login', require('./api/user/login'));

  app.use('/api/case/open', require('./api/case/open'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
