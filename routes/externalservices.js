const express = require('express');
const router = express.Router();
require('dotenv').config({'path': '.env'});
const axios = require('axios');
const Timeline = require('../models/timeline');

// External API routes

// Glassdoor

router.get('/glassdoor', (req, res, next) => {

  const companyName = req.query.company;

  const glassdoorUrl = `http://api.glassdoor.com/api/api.htm?t.p=${process.env.GLASSDOOR_PARTNERID}&t.k=${process.env.GLASSDOOR_PARTNERKEY}&userip=81.38.90.75&useragent=Mozilla/%2F4.0&format=json&v=1&action=employers&q=${companyName}`;

  axios.get(glassdoorUrl)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      res.json(error);
    });

});

// Cloudmailin

router.post('/mail', async (req, res, next) => {

  console.log(req.body);

  const lead = req.body.headers.Subject;
  const content = req.body.plain;

  const newTimelineEntry = new Timeline({
    lead,
    content
  });

  newTimelineEntry.save((err, timelineEntry) => {
    if (err) {
      res.status(400).json({ message: err });
    }

    res.status(200).json('mail ok!');
  });

});


module.exports = router;
