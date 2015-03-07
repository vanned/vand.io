'use strict';

var path = require('path');
var url = require('url');
var moment = require('moment');
var nodemailer = require('nodemailer');
var settings = require('../../config/environment');
var sgTransport = require('nodemailer-sendgrid-transport');
var transporter = nodemailer.createTransport(sgTransport({
  auth: {
    api_user: settings.email.sendgrid.username,
    api_key: settings.email.sendgrid.password
  }
}));
var emailTemplates = require('email-templates');

exports.admin = {
  register: function (params, callback) {
    // Get templates directory for admins.
    var templatesDir = path.join(__dirname, 'templates/admin');
    var tokenUrl = url.resolve(settings.domain, '/admin/activate/' + params.token);
    emailTemplates(templatesDir, function (error, templates) {
      if(error) {
        return callback(error);
      }
      // Get register template
      templates('register', {
        tokenUrl: tokenUrl
      }, function (error, html, text) {
        if(error) {
          return callback(error);
        }
        // Set mail options for email.
        var mailOptions = {
          from: settings.email.noReply,
          to: params.email,
          subject: 'Sign up for Vand!',
          html: html
        };
        // Send email
        transporter.sendMail(mailOptions, function (error, info) {
          if(error) {
            return callback(error);
          }
          return callback(null, info);
        });
      });
    });
  },
  lostPassword: function (params, callback) {
    var templatesDir = path.join(__dirname, 'templates/admin');
    var passwordUrl = url.resolve(settings.domain, '/admin/reset/' + params.id + '/' + params.token);
    emailTemplates(templatesDir, function (error, templates) {
      if(error) {
        return callback(error);
      }
      templates('lostPassword', {
        passwordUrl: passwordUrl
      }, function (error, html, text) {
        if(error) {
          return callback(error);
        }
        var mailOptions = {
          from: settings.email.noReply,
          to: params.email,
          subject: 'Forgot Password',
          html: html
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if(error) {
            return callback(error);
          }
          return callback(null, info);
        });
      })
    });
  },
  appointment: function (params, callback) {
    var templatesDir = path.join(__dirname, 'templates/admin');
    emailTemplates(templatesDir, function (error, templates) {
      if(error) {
        return callback(error);
      }
      templates('appointment', {
        firstname: params.coordinator.firstname,
        lastname: params.coordinator.lastname,
        email: params.coordinator.email,
        phonenumber: params.coordinator.phonenumber,
        date: moment.utc(params.date).toString(),
        companyName: params.company.name,
        website: params.company.website
      }, function (error, html, text) {
        if(error) {
          return callback(error);
        }
        var mailOptions = {
          from: settings.email.noReply,
          to: settings.email.admins,
          subject: 'Appointment Request',
          html: html
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if(error) {
            return callback(error);
          }
          return callback(null, info);
        });
      })
    });
  }
};

exports.applications = {
  create: function (params, callback) {
    var templatesDir = path.join(__dirname, 'templates/applications');
    var applicationUrl = url.resolve(settings.domain, '/application/' + params.id);
    emailTemplates(templatesDir, function (error, templates) {
      if(error) {
        return callback(error);
      }
      templates('create', {
        applicationUrl: applicationUrl
      }, function (error, html, text) {
        if(error) {
          return callback(error);
        }
        var mailOptions = {
          from: settings.email.noReply,
          to: params.email,
          subject: 'Application Created!',
          html: html
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if(error) {
            return callback(error);
          }
          return callback(null, info);
        });
      });
    });
  }
};