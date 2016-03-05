var HTTPS = require('https');

var botID = process.env.BOT_ID;
var imgURL = process.env.IMG_URL;

function respond() {
  var req = JSON.parse(this.req.chunks[0]);
  var re = /instahaig/;

  if(req.text && re.test(req.text.toLowerCase())) {
    console.log(re+" TRUE");
    this.res.writeHead(200);
    postMessage();
    this.res.end();
  } else {
    console.log(re+" FALSE");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage() {
  var options, body, botReq;

  // Application verification
  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  // Message contents
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

  console.log('sending image to ' + botID);

  // Catch errors
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