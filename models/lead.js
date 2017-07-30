'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leadSchema = new mongoose.Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  company: {
    type: String,
    required: [true, 'Company name is required.']
  },
  jobtitle: {
    type: String,
    required: [true, 'Job title is required.']
  },
  status: {
    type: String,
    enum: ['contacted', 'replyreceived', 'interview', 'done'],
    required: [true, 'Status is required.']
  },
  logourl: String,
  contactperson: {
    name: String,
    email: {
      type: String,
      required: [true, 'Email for contact person required.']
    }
  }
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;
