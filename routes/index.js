const axios = require('axios');
var express = require('express');
var router = express.Router();
const amqp = require('amqplib/callback_api');
const RabbitmqWrapper = require('../rabbitmq/rabbitmq.js');
const {sendData, getBulbState} = require('./function.js');

const url = 'amqp://ksh:1234@3.34.5.103';
const hueBaseUrl = 'http://210.107.205.200:8080/api/wkcBD-lTULsGrCJ2hqZZqgeQsfathjs6zc3Rul1O/lights/10';

amqp.connect(url, (error0, connection)=>{
  if(error0){throw error0;}
  connection.createChannel((error1, channel)=>{
    if(error1) {throw error1;}

    channel.assertQueue('req/hue/state', {
      durable: false
    });
        
    channel.consume('req/hue/state', async (msg)=>{
      console.log('[x] Received %s', 'req/hue/state');
        const data = await getBulbState();
        // console.log(data);
        sendData(url, 'res/hue/state', data);
    }, {noAck:true});
  })
});

amqp.connect(url, (error0, connection)=>{
  if(error0){throw error0;}
  connection.createChannel((error1, channel)=>{
    if(error1) {throw error1;}

    channel.assertQueue('clova/req/hue/state', {
      durable: false
    });
        
    channel.consume('clova/req/hue/state', async (msg)=>{
      console.log('[x] Received %s', 'clova/req/hue/state');
        const data = await getBulbState();
        // console.log(data);
        sendData(url, 'clova/res/hue/state', data);
    }, {noAck:true});
  })
});

amqp.connect(url, (error0, connection)=>{
  if(error0){throw error0;}

  connection.createChannel((error1, channel)=>{
    if(error1) {throw error1};

    channel.assertQueue('req/hue/light', {
      durable: false
    });
    
    console.log('[*] Waiting for messages in' );

    channel.consume('req/hue/light', (msg)=>{
        const value = msg.content.toString();
        console.log('[x] Received req/hue/light %s', value);
        
        axios.put(`${hueBaseUrl}/state`, {
            on: value === '"on"' ? true : false
        });
    }, {noAck:true});    
  });
});

module.exports = router;