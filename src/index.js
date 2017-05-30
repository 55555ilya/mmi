'use strict'

/**
 * Module Dependencies
 */
const config        = require('./config');
const mongoose      = require('mongoose');
const winston       = require('winston');
const amqp          = require('amqplib/callback_api');
const joi           = require('joi');

const Talk = require('./models/talk');

/**
 * Configure logger
 */
global.log = new winston.Logger({
  transports: [
    new winston.transports.File({
      name: 'info-file',
      level: 'info',
      filename: config.infoLogFile
    }),
    new winston.transports.File({
      name: 'error-file',
      level: 'error',
      filename: config.errorLogFile
    })
  ]
});

/**
 * Configure object validator
 */
var talkMessageSchema = joi.object().keys({
  service: joi.string().required(),
  user: joi.string().required(),
  agent: joi.string().required(),
  text: joi.string().required()
}).with('name', 'age');

/**
 * Start message receiver
 */
log.info('Starting message receiver');
amqp.connect('amqp://localhost', function(err, conn) {

  mongoose.connection.on('error', function(err) {
    log.error('Mongoose default connection error: ' + err);
    process.exit(1)
  });

  mongoose.connection.on('open', function(err) {

    if (err) {
      log.error('Mongoose default connection error: ' + err);
      process.exit(1)
    }

  });

  global.db = mongoose.connect(config.db.uri);


  conn.createChannel(function(err, ch) {

    ch.assertQueue(config.amqpChannelName, {durable: true});
    ch.prefetch(1);

    log.info('Waiting for messages');
    ch.consume(config.amqpChannelName, function(msg) {
      var msgText = msg.content.toString();
      log.info("Received %s", msgText);

      try {
        var talkMessage = JSON.parse(msgText);
      } catch (e) {
        log.error('Error parsing message from json %s', msgText);
        ch.ack(msg);
        return
      }

      joi.validate(talkMessage, talkMessageSchema, function (err, value) {
        if(err) {
          log.error('Validating %s throws %s', msgText, err);
          ch.ack(msg);
          return
        }

        Talk.findOne({ user: talkMessage.user, agent: talkMessage.agent, service: talkMessage.service }, function(err, doc) {

          if (err) {
            log.error(err);
            return
          }

          if (!doc) {
            log.info('Creating new Talk for %s', msgText);
            var talk = new Talk({
              service: talkMessage.service,
              user: talkMessage.user,
              agent: talkMessage.agent,
              answered: false,
              status: 'new',
              busy: false,
              messages: [{
                direction: 'in',
                text: talkMessage.text
              }]
            });
            talk.save(function(err, doc) {
              if (err) {
                log.error(err);
              } else {
                ch.ack(msg);
              }
            })
          } else {
            var newMessage = {
              direction: 'in',
              text: talkMessage.text
            };
            Talk.update({ _id: doc._id }, { $set: {answered: false}, $push: {messages: newMessage} }, function(err) {
              if (err) {
                log.error(err);
              } else {
                ch.ack(msg);
              }
            })
          }
        })

      });
    }, {noAck: false});

  });
});
