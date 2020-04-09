const axios = require('axios');
var express = require('express');
var router = express.Router();
const amqp = require('amqplib/callback_api');
const get_my_message = require('./function.js').get_my_message;

amqp.connect('amqp://ksh:1234@3.34.5.103', (error0, connection)=>{
  if(error0){throw error0;}
  connection.createChannel((error1, channel)=>{
    if(error1) {throw error1};
    const queue = 'hue/light';
    
    channel.assertQueue(queue, {
      durable: false
    });

    console.log('[*] Waiting for messages in %s.', queue);

    channel.consume(queue, (msg)=>{
        const value = msg.content.toString();
        console.log('[x] Received %s', value);
        const hueBaseUrl = 'http://210.107.205.200:8080/api/wkcBD-lTULsGrCJ2hqZZqgeQsfathjs6zc3Rul1O/lights/10';
        axios.put(`${hueBaseUrl}/state`, {
            on: value === '"on"' ? true : false
        });
    }, {noAck:true});
    
  });
});

// router.get('/:value', get_my_message);

module.exports = router;
