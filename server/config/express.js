/**
 * Express configuration
 */

'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var multiparty = require('multiparty');
var compression = require('compression');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');

module.exports = function(app) {
  var env = app.get('env');

  app.set('views', config.root + '/server/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser(config.session.secret));
  app.use(function (req, res, next) {
    if(req.method === 'POST' && req.headers['content-type'].indexOf("multipart/form-data") !== -1) {
      var form = new multiparty.Form();
      req.body = req.body || {};
      form.on('field', function (field, value) {
        req.body[field] = value;
      });
      form.on('part', function (part) {
        part.fileRead = [];
        part.on('data', function (chunk) {
          this.fileRead.push(chunk);
        });
        part.on('error', function (err) {
          next(err);
        });
        req.files = req.files || {};
        part.on('end', function () {
          var finalBuffer = Buffer.concat(this.fileRead);
          req.files[part.name] = {
            buffer: finalBuffer,
            size: finalBuffer.length,
            filename: part.filename,
            mimetype: part.headers['content-type']
          };
        });
      });
      form.on('close', function () {
        next();
      });
      form.parse(req);
    } else {
      next();
    }
  });

  if ('production' === env) {
    app.set('trust proxy', 1);
    app.use(session({
      store: new RedisStore({
        host: config.redis.host,
        port: config.redis.port
      }),
      cookie: {
        path: '/',
        secure: true,
        maxAge: 3600000 * 24,
        httpOnly: true
      }
    }));
    app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public')));
    // In production, route /api/docs to public/docs directory.
    app.use('/api/docs', express.static(path.join(config.root, 'public/docs')));
    app.set('appPath', config.root + '/public');
    app.use(morgan('dev'));
  }

  if ('development' === env || 'test' === env) {
    app.use(session({
      store: new RedisStore({
        host: config.redis.host,
        port: config.redis.port
      }),
      cookie: {
        path: '/',
        secure: false,
        maxAge: 3600000 * 24,
        httpOnly: true
      }
    }));
    app.use(require('connect-livereload')());
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'client')));
    // In development, route /api/docs to client/docs/output directory.
    app.use('/api/docs', express.static(path.join(config.root, 'client/docs/output')));
    app.set('appPath', 'client');
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
};