const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({ 'dest': './public/uploads' });

const Lead = require('../models/lead');
const Timeline = require('../models/timeline');

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

    // Sort according to colIndex for dashboard view order

    allLeads.leadsContacted.sort((a, b) => {
      return parseFloat(a.colIndex) - parseFloat(b.colIndex);
    });
    allLeads.leadsReplyReceived.sort((a, b) => {
      return parseFloat(a.colIndex) - parseFloat(b.colIndex);
    });
    allLeads.leadsInterview.sort((a, b) => {
      return parseFloat(a.colIndex) - parseFloat(b.colIndex);
    });
    allLeads.leadsDone.sort((a, b) => {
      return parseFloat(a.colIndex) - parseFloat(b.colIndex);
    });

    res.json(allLeads);
  });
});

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

router.put('/lead/:id', (req, res, next) => {

  const leadUpdates = {
    company: req.body.company,
    jobtitle: req.body.jobtitle,
    status: req.body.status,
    colIndex: req.body.colIndex,
    logourl: req.body.logourl,
    contactperson: {
      name: req.body.contactperson.name,
      email: req.body.contactperson.email
    }
  }

  Lead.findByIdAndUpdate(req.params.id, leadUpdates, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({ message: 'Lead updated!' });
  });

});

router.delete('/lead/:id', (req, res, next) => {

  Lead.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({ message: 'Lead deleted!' });
  })

});

router.post('/lead/new', (req, res, next) => {

  const owner = req.body.owner;
  const company = req.body.company;
  const jobtitle = req.body.jobtitle;
  const status = req.body.status;
  const colIndex = req.body.colIndex;
  const logourl = req.body.logourl;
  const contactpersonName = req.body.contactperson.name;
  const contactpersonEmail = req.body.contactperson.email;

  const newLead = new Lead({
    owner,
    company,
    jobtitle,
    status,
    colIndex,
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

router.get('/timeline/:leadid', async (req, res, next) => {

  const timelineLeadId = req.params.leadid;

  const entries = await Timeline.find({})
    .where('lead')
    .equals(timelineLeadId)
    .sort({'created_at': -1});

  res.json(entries);

});

router.post('/timeline/new', (req, res, next) => {

    const owner = req.body.owner;
    const lead = req.body.lead;
    const content = req.body.content;
    const creator = req.body.creator;

    const newTimelineEntry = new Timeline({
      owner,
      lead,
      content,
      creator
    });

    newTimelineEntry.save((err, timelineEntry) => {
      if (err) {
        res.status(400).json({ message: err });
      }

      res.status(200).json({ timelineEntry });
    });
});

router.put('/timeline/:id', (req, res, next) => {

  const timelineEntryUpdates = {
    owner: req.body.owner,
    lead: req.body.lead,
    content: req.body.content,
    creator: req.body.creator
  }

  Timeline.findByIdAndUpdate(req.params.id, timelineEntryUpdates, (err) => {
    if (err) {
      res.status(400).json({ message: err });
      return;
    }

    res.status(200).json({ message: 'Timeline entry updated!' });
  });
});

router.delete('/timeline/:id', (req, res, next) => {

  Timeline.findByIdAndRemove(req.params.id, (err, doc) => {
    if (err) {
      res.status(400).json({ message: err });
      return;
    }

    res.status(200).json({ message: 'Timeline entry deleted!', doc });
  })
});

router.post('/timeline/fileupload', upload.single('file'), (req, res, next) => {

  console.log(req.file);

  res.send('File upload ok!');

});

module.exports = router;
