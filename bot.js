var HTTPS = require('https');

var botID = process.env.BOT_ID;
var imgURL = process.env.IMG_URL;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/haig$/;

  if(request.text && botRegex.test(request.text.toLowerCase())) {
    this.res.writeHead(200);
    postMessage();
    this.res.end();
  } else {
    console.log("Pass");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage() {
  var options, body, botReq;

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : "",
    "attachments" : [
      {
        "type" : "image",
        "url" : imgURL
      }
    ]
  };

  console.log('sending ' + ' image ' + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode != 202) {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error: '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout: '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;