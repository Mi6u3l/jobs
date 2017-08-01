const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Lead = require('../models/lead');

// Routes visible to user

router.get('/lead/:id', (req, res, next) => {

  const leadId = req.params.id;

  Lead.findById({ _id: leadId }, (err, lead) => {
    if (err) {
      res.json(err);
      return;
    };

    res.json(lead);
  });

});

module.exports = router;
