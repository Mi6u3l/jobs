const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Lead = require('../models/lead');

// Internal API routes

router.get('/', (req, res, next) => {
  res.json('api home route works');
});

router.get('/leads/:userid', (req, res, next) => {

  let allLeads = {
    leadsContacted: [],
    leadsReplyReceived: [],
    leadsInterview: [],
    leadsDone: []
  }

  Lead.find({ 'owner': req.params.userid }, (err, leads) => {
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

    res.json(allLeads);
  });
});

router.post('/lead/new', function(req, res, next) {

  const owner = req.body.owner;
  const company = req.body.company;
  const jobtitle = req.body.jobtitle;
  const status = req.body.status;
  const logourl = req.body.logourl;
  const contactpersonName = req.body.contactpersonname;
  const contactpersonEmail = req.body.contactpersonemail;

  const newLead = new Lead({
    owner,
    company,
    jobtitle,
    status,
    logourl,
    contactperson: {
      name: contactpersonName,
      email: contactpersonEmail
    }

  });

  newLead.save((err, lead) => {
    if (err) {
      res.status(400).json({ message: err });
    };

    res.status(200).json({ lead });
  });

});

module.exports = router;
