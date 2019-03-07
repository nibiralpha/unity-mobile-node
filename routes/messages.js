var express = require('express');
var router = express.Router();
var chatFunctions = require('../functions/chat');

/* GET messages. */
router.get('/', function(req,res, next) {
  chatFunctions.getMessages(req, res);
});

/* save deviceIDToken */
router.post('/saveToken', function(req, res) {
  chatFunctions.saveToken(req, res);
});

module.exports = router;