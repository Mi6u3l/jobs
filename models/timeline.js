'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timelineSchema = new mongoose.Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  lead: {
    type: Schema.Types.ObjectId,
    ref: 'Lead',
    required: [true, 'Timeline entry lead id is required.']
  },
  content: String,
  creator: {
    type: String,
    enum: ['manual', 'email', 'app']
  },
  fileurl: String
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Timeline = mongoose.model('Timeline', timelineSchema);

module.exports = Timeline;
