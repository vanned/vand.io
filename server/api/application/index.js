'use strict';

var express = require('express');
var getController = require('./getApplication.controller');
var postController = require('./updateApplication.controller');

var router = express.Router();

router.get('/', getController.index);
router.post('/', postController.index);

module.exports = router;