/**
 * Express configuration
 */

'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var compression = require('compression');
var session = require('express-session');
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
  // app.use(function (req, res, next) {
  //   req.files = {};
  //   req.body = {};
  //   if(req.busboy) {
  //     req.busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
  //       req.body[fieldname] = val;
  //     });
  //     req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
  //       if(!filename) {
  //         next();
  //       }
  //       file.fileRead = [];
  //       file.on('data', function (chunk) {
  //         this.fileRead.push(chunk);
  //       });
  //       file.on('error', function (error) {
  //         console.log('Error while buffering the stream: ', error);
  //       });
  //       file.on('end', function () {
  //         var finalBuffer = Buffer.concat(this.fileRead);
  //         req.files[fieldname] = {
  //           buffer: finalBuffer,
  //           size: finalBuffer.length,
  //           filename: filename,
  //           mimetype: mimetype
  //         };
  //       });
  //     });
  //     req.busboy.on('filesLimit', function () {
  //       next();
  //     });
  //     req.busboy.on('error', function (error) {
  //       console.log('Error while parsing the form: ', error);
  //     });
  //     req.busboy.on('finish', function () {
  //       next();
  //     });
  //     req.pipe(req.busboy);
  //   } else {
  //     next();
  //   }
  // });

  if ('production' === env) {
    app.set('trust proxy', 1);
    app.use(session({
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