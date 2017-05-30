'use strict'

const mongoose = require('mongoose');
const createdModified = require('mongoose-createdmodified').createdModifiedPlugin;

const TalkSchema = new mongoose.Schema({
  service: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  agent: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'ongoing', 'finished'],
    default: ['new'],
    required: true
  },
  busy: {
    type: Boolean,
    default: false,
    required: true
  },
  answered: {
    type: Boolean,
    required: true,
    default: false
  },
  messages: [
    {
      direction: {
        type: String,
        enum: ['in', 'out'],
        required: true
      },
      text: {
        type: String,
        required: true
      },
      created: {
        type : Date,
        default: Date.now
      }
    }
  ]
}, { minimize: false });

TalkSchema.plugin(createdModified, { index: true });

const Talk = mongoose.model('Talk', TalkSchema);
module.exports = Talk;