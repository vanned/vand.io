'use strict';

var request = require('request');
var settings = require('../../config/environment');

/**
 * Parses the captcha error.
 *
 * @param  {String} captchaError The error from Google.
 * @return {String} The reformatted response.
 */
function _parseCaptchaError(captchaError) {
  var errorMatches = {
    'missing-input-secret': 'The secret parameter is missing.',
    'invalid-input-secret': 'The secret parameter is invalid or malformed.',
    'missing-input-response': 'The response parameter is missing',
    'invalid-input-response': 'The response parameter is invalid or malformed.'
  };
  return errorMatches[captchaError] || null;
}

// Verify Captcha request.
exports.verify = function (captchaResp, remoteIP, callback) {
  request.get('https://www.google.com/recaptcha/api/siteverify', {
    json: true,
    qs: {
      secret: settings.google.recaptcha.secretKey,
      response: captchaResp,
      remoteip: remoteIP
    }
  }, function (error, response, body) {
    if(error) {
      console.log(error);
      return callback('Could not verify captcha, please try again.');
    }
    if(!body.success) {
      if(body['error-codes']) {
        console.error(body['error-codes'].map(_parseCaptchaError).join('\n'));
      }
      return callback('Could not verify captcha, please try again.');
    }
    return callback(null);
  });
};