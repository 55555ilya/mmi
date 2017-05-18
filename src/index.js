'use strict'

/**
 * Module Dependencies
 */
const config        = require('./config'),
      mongoose      = require('mongoose'),
      winston       = require('winston');

const User = require('./models/talk');

global.log = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: config.info_log_file
    }),
    new winston.transports.File({
      level: 'error',
      filename: config.error_log_file
    })
  ]
});



