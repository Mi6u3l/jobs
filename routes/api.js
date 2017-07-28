const express = require('express');
const router = express.Router();

/* API routes */

router.get('/', function(req, res, next) {
  res.json('api home route works');
});

module.exports = router;
