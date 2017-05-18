'use strict'

const mongoose = require('mongoose'),
      createdModified = require('mongoose-createdmodified').createdModifiedPlugin;

const TalkSchema = new mongoose.Schema({
  service: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  messages: [
    {
      direction: {
        type: String,
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