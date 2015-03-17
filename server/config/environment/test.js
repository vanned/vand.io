'use strict';

var fs = require('fs');

// Test specific configuration
// ===========================
module.exports = {
  domain: 'http://localhost:9000',
  session: {
    secret: '784YEthBwReODNNChSHUyYExq9Q2xTieYud5WbxVHLWTKDjVnyUH4XAz7940reesfuP4cudJ2SH67d5mStnnx2RLVLgUXn02ziBk' // 64+ char phrase
  },
  couchdb: {
    url: 'http://localhost:5984',
    dbs: {
      admins: 'vand-test-admins',
      users: 'vand-test-users',
      applications: 'vand-test-applications',
      cases: 'vand-test-cases'
    }
  },
  redis: {
    host: 'localhost',
    port: 6379
  },
  amazon: {
    aws: {
      s3: {
        accessKeyId: 'testAccessKeyId',
        secretAccessKey: 'testSecretAccessKey',
        arn: 'testArn',
        bucket: 'test-bucket'
      }
    }
  },
  // Emails won't be sent out but the transporter needs to load.
  email: {
    sendgrid: {
      username: 'testUser',
      password: 'testPassword'
    },
    forward: {
      from: 'test@vand.io',
      to: 'test@gmail.com'
    },
    noReply: 'no-reply@test.com',
    admins: 'admins@test.com'
  },
  keybase: {
    usernameOrEmail: 'testUsername',
    password: 'testPassword',
    privatekey: fs.readFileSync(__dirname + '/../keys/private.asc', {encoding: 'utf8'})
  },
  twitter: {
    consumerKey: 'testConsumerKey',
    consumerSecret: 'testConsumerSecret',
    token: 'testToken',
    tokenSecret: 'testTokenSecret'
  },
  google: {
    recaptcha: {
      siteKey: 'testKey',
      secretKey: 'testSecret'
    }
  }
};