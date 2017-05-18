'use strict'

module.exports = {
  name: 'Mass Messaging Interface',
  version: '0.0.1',
  env: process.env.NODE_ENV || 'development',
  db: {
    uri: 'mongodb://127.0.0.1:27017/mmt'
  },
  errorLogFile: './log/errors.log',
  infoLogFile: './log/info.log',
  amqpChannelName: 'mm_incoming'
};

