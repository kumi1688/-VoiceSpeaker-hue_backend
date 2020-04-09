const hueBaseUrl = 'http://210.107.205.200:8080/api/wkcBD-lTULsGrCJ2hqZZqgeQsfathjs6zc3Rul1O/lights/10';

const get_my_message = async (req, res) => {
    console.log(req.params);
    const value = req.params.value; 
  
    if(value === 'favicon.ico'){
      return;
    }
  
    try {
        const url = 'amqp://ksh:1234@3.34.5.103:5672';
        const queueName = 'hue/light'
        const rq = new RabbitmqWrapper(url, queueName);
  
        const msg = await rq.recv_helloWorld();
        // axios.put(`${hueBaseUrl}/state`, {
        //   on: value === 'true' ? true: false
        // });
        res.status(200).send(msg);
    } catch (e) {
        console.error(e);
        next(e);
    }
  };

  module.exports = {
      get_my_message
  }