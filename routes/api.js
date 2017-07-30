const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Lead = require('../models/lead');

/* API routes */

router.get('/', function(req, res, next) {
  res.json('api home route works');
});

router.get('/leads', function(req, res, next) {

  let allLeads = {
    leadsContacted: [],
    leadsReplyReceived: [],
    leadsInterview: [],
    leadsDone: []
  }

  Lead.find((err, leads) => {
    if (err) {
      res.json(err);
      return;
    }

    leads.forEach((lead) => {
      if (lead.status === 'contacted') {
        allLeads.leadsContacted.push(lead);
      }
      if (lead.status === 'replyreceived') {
        allLeads.leadsReplyReceived.push(lead);
      }
      if (lead.status === 'interview') {
        allLeads.leadsInterview.push(lead);
      }
      if (lead.status === 'done') {
        allLeads.leadsDone.push(lead);
      }
    });

    console.log(allLeads);
    res.json(allLeads);
  });
});

module.exports = router;
