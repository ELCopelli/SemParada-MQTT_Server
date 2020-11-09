const request = require('request')

var aedes = require('aedes')();
var mqtt_port = process.env.MQTT_PORT || 1883;

var mqtt = require('net').createServer(aedes.handle);

mqtt.listen(mqtt_port);

aedes.on('publish', function (packet, client) {
  
  /*Éderson Copelli - 20/03/2019 - Adicionado try-catch, para caso der qualquer erro ignorar a requisição */
  try {
    if (!client) return;

    packet.payloadString = packet.payload.toString();
    packet.payloadLength = packet.payload.length;
    packet.payload = JSON.stringify(packet.payload);
    packet.timestamp = new Date();

    //console.log('JSON->', packet.timestamp +'<>'+ packet.payloadString);

    request.post('http://copelli.com.br:8080/post_dados_equipamentos', {
      json: JSON.parse(packet.payloadString)
    }, (error, res, body) => {
      if (error) {
        console.error(error)
        return
      }
      console.log(`statusCode: ${res.statusCode}`)
      console.log(body)
    });
  }
  catch (e) {
    console.log('Erro no processamento da requisição MQTT:' + e.message);
  }

});

