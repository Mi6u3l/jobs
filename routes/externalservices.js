const express = require('express');
const router = express.Router();
require('dotenv').config({'path': '.env'});
const axios = require('axios');

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


module.exports = router;
