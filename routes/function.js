const hueBaseUrl = 'http://210.107.205.200:8080/api/wkcBD-lTULsGrCJ2hqZZqgeQsfathjs6zc3Rul1O/lights/10';
const RabbitmqWrapper = require('../rabbitmq/rabbitmq.js');
const axios = require('axios');
const url = 'amqp://ksh:1234@3.34.5.103';

const getBulbState = async () => {
  const result = await axios.get(hueBaseUrl);
  bulbState = result.data.state;
  return bulbState;
}

const sendData = async (url, queueName, data) => {
    const rq = new RabbitmqWrapper(url, queueName);
    await rq.sendMessage(data);
}

const changeState = async () => {
    let queueName = 'req/hue/light';
    const rq = new RabbitmqWrapper(url, queueName);
    const value = await rq.recvMessage();
    console.log('value', value);
    axios.put(`${hueBaseUrl}/state`, {on: value === '"on"' ? true : false});  
}


module.exports = {
      sendData, changeState, getBulbState
}