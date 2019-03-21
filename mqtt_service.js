const request = require('request')

var aedes = require('aedes')();
var mqtt_port = process.env.MQTT_PORT || 1883;
//var http = require('http');
//var url  = require('url');
//var db = new nedb('mqtt.db');
//http_port = process.env.HTTP_PORT || 8080;
//var nedb = require('nedb');

var mqtt = require('net').createServer(aedes.handle);

mqtt.listen(mqtt_port);

aedes.on('publish', function (packet, client) {
  //console.log('publish->',packet);

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

/*aedes.on('client', function(client) {
  db.insert({
    topic: '/',
    action: 'connect',
    timestamp: new Date(),
    message: client.id
  });
});

aedes.on('clientDisconnect', function(client) {
  db.insert({
    topic: '/',
    action: 'disconnect',
    timestamp: new Date(),
    message: client.id
  });
});

aedes.on('subscribe', function(topic, client) {
  db.insert({
    topic: '/',
    action: 'subscribe',
    timestamp: new Date(),
    message: client.id + ' ' + topic
  });
});

aedes.on('unsubscribe', function(topic, client) {
  db.insert({
    topic: '/',
    action: 'unsubscribe',
    timestamp: new Date(),
    message: client.id + ' ' + topic
  });
});*/

/*var web = http.createServer(function(req, res) {

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'DNT,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type');

  var topic = url.parse(req.url).pathname;

  if(topic === '/')
    loadIndex(req, res);
  else
    loadTopic(topic, req, res);

});

db.loadDatabase(function(err) {
  web.listen(http_port);
  console.log('listening on mqtt port %d and http port %d...', mqtt_port, http_port);
});

function loadIndex(req, res) {

  db.find({topic: '/'}).sort({timestamp: -1}).exec(function(err, docs) {

    if(err) {
      res.writeHead(500, {'Content-Type': 'application/json'});
      return res.end({error: err.toString()});
    }

    res.writeHead(200, {'Content-Type': 'text/html'});

    res.write('<html><head></head><body><pre>')
    docs.forEach(function(doc) {
      res.write(doc.timestamp + '  ');
      res.write(doc.action + '   ');
      res.write(doc.message + '\n');
    });

    res.end('</pre></body></html>');

  });

}

function loadTopic(topic, req, res) {

  topic = topic.substring(1);

  db.find({topic: topic}).sort({timestamp: -1}).exec(function(err, docs) {

    if(err) {
      res.writeHead(500, {'Content-Type': 'application/json'});
      return res.end({error: err.toString()});
    }

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({count: docs.length, packets: docs}, null, 2));

  });

} */
