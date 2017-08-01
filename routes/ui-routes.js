const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Lead = require('../models/lead');

// Routes visible to user

router.get('lead/:id', (req, res, next) => {
  res.send('moro');
});

module.exports = router;
