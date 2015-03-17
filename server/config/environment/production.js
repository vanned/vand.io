'use strict';

var fs = require('fs');

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip: process.env.OPENSHIFT_NODEJS_IP || process.env.IP || undefined,

  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080,
  domain: process.env.VAND_DOMAIN || 'https://www.vand.io',
  session: {
    secret: process.env.VAND_SESSION_SECRET || '' // 64+ char phrase
  },
  couchdb: {
    url: process.env.VAND_COUCHDB_URL || 'http://localhost:5984',
    dbs: {
      admins: 'vand-admins',
      users: 'vand-users',
      applications: 'vand-applications',
      cases: 'vand-cases'
    }
  },
  redis: {
    host: process.env.VAND_REDIS_HOST || 'localhost',
    port: process.env.VAND_REDIS_PORT || 6379
  },
  amazon: {
    aws: {
      s3: {
        accessKeyId: process.env.VAND_AMAZON_AWS_S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.VAND_AMAZON_AWS_S3_SECRET_ACCESS_KEY || '',
        arn: process.env.VAND_AMAZON_AWS_S3_ARN || '',
        bucket: process.env.VAND_AMAZON_AWS_S3_BUCKET || ''
      }
    }
  },
  email: {
    sendgrid: {
      username: process.env.VAND_EMAIL_SENDGRID_USERNAME || '',
      password: process.env.VAND_EMAIL_SENDGRID_PASSWORD || ''
    },
    forward: {
      from: 'forward@vand.io',
      to: process.env.VAND_EMAIL_FORWARD_TO || ''
    },
    noReply: 'no-reply@vand.io',
    admins: 'admins@vand.io'
  },
  keybase: {
    usernameOrEmail: process.env.VAND_KEYBASE_USERNAME_OR_EMAIL || '',
    password: process.env.VAND_KEYBASE_PASSWORD || '',
    privatekey: fs.readFileSync(__dirname + '/../keys/private.asc', {encoding: 'utf8'})
  },
  twitter: {
    consumerKey: process.env.VAND_TWITTER_CONSUMER_KEY || '',
    consumerSecret: process.env.VAND_TWITTER_CONSUMER_SECRET || '',
    token: process.env.VAND_TWITTER_TOKEN || '',
    tokenSecret: process.env.VAND_TWITTER_TOKEN_SECRET || ''
  },
  google: {
    recaptcha: {
      siteKey: process.env.VAND_GOOGLE_RECAPTCHA_SITEKEY || '',
      secretKey: process.env.VAND_GOOGLE_RECAPTCHA_SECRETKEY || ''
    }
  }
};