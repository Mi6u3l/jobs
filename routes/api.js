const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Lead = require('../models/lead');

/* API routes */

router.get('/', function(req, res, next) {
  res.json('api home route works');
});

router.get('/leads', function(req, res, next) {
  Lead.find((err, leads) => {
    if (err) {
      res.json(err);
      return;
    }
    res.json(leads);
  });
});

module.exports = router;
