'use strict'

module.exports = {
  name: 'Mass Messaging Interface',
  version: '0.0.1',
  env: process.env.NODE_ENV || 'development',
  db: {
    uri: 'mongodb://127.0.0.1:27017/api'
  },
  errors_log_file: './log/errors.log',
  info_log_file: './log/info.log'
};