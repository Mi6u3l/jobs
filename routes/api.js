const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({ 'dest': './public/uploads' });
const passport = require('passport');
const aws = require('aws-sdk');
require('dotenv').config({'path': '.env'});
const s3_bucket = process.env.S3_BUCKET_NAME;

const Lead = require('../models/lead');
const Timeline = require('../models/timeline');

// aws config
aws.config.region = 'eu-central-1';

// Internal API routes

router.get('/', (req, res, next) => {
  res.json('api home route works');
});

router.get('/leads/:userid', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  let allLeads = {
    leadsContacted: [],
    leadsReplyReceived: [],
    leadsInterview: [],
    leadsDone: []
  }

  Lead.find({ 'owner': req.user._id }, (err, leads) => {
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

router.get('/lead/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  const leadId = req.params.id;

  Lead.findById({ _id: leadId }, (err, lead) => {
    if (err) {
      res.json(err);
      return;
    };

    res.json(lead);
  });

});

router.put('/lead/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {

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

router.put('/lead/updatedat/:id', (req, res, next) => {

  const now = new Date();

  Lead.findByIdAndUpdate(req.params.id, { 'updated_at': now }, (err) => {
    if (err) {
      res.json(err);
      return;
    }

  res.json({ message: 'Lead updated!' });

  });
});

router.delete('/lead/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  Lead.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({ message: 'Lead deleted!' });
  })

});

router.post('/lead/new', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  const owner = req.user._id;
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

router.get('/alarms', passport.authenticate('jwt', { session: false }), async (req, res, next) => {

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 14); // two weeks

  const leadAlarms = await Lead.find({}).where('owner').equals(req.user._id).where('updated_at').lt(cutoff);

  res.json(leadAlarms);

});

router.get('/timeline/:leadid', passport.authenticate('jwt', { session: false }), async (req, res, next) => {

  const timelineLeadId = req.params.leadid;

  const entries = await Timeline.find({})
    .where('lead')
    .equals(timelineLeadId)
    .sort({'created_at': -1});

  res.json(entries);

});

router.post('/timeline/new', passport.authenticate('jwt', { session: false }), (req, res, next) => {

    const owner = req.user._id;
    const lead = req.body.lead;
    const content = req.body.content;
    const creator = req.body.creator;
    const fileurl = req.body.fileurl;
    const filename = req.body.filename;

    const newTimelineEntry = new Timeline({
      owner,
      lead,
      content,
      creator,
      fileurl,
      filename
    });

    newTimelineEntry.save((err, timelineEntry) => {
      if (err) {
        res.status(400).json({ message: err });
      }

      res.status(200).json({ timelineEntry });
    });
});

router.put('/timeline/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  const timelineEntryUpdates = {
    owner: req.user._id,
    lead: req.body.lead,
    content: req.body.content,
    creator: req.body.creator,
    fileurl: req.body.fileurl,
    filename: req.body.filename
  }

  Timeline.findByIdAndUpdate(req.params.id, timelineEntryUpdates, (err) => {
    if (err) {
      res.status(400).json({ message: err });
      return;
    }

    res.status(200).json({ message: 'Timeline entry updated!' });
  });
});

router.delete('/timeline/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  Timeline.findByIdAndRemove(req.params.id, (err, doc) => {
    if (err) {
      res.status(400).json({ message: err });
      return;
    }

    res.status(200).json({ message: 'Timeline entry deleted!', doc });
  })
});

router.get('/sign-s3', passport.authenticate('jwt', { session: false }),  (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: s3_bucket,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${s3_bucket}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

module.exports = router;
