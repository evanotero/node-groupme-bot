var HTTPS = require('https');

var botID = process.env.BOT_ID;
var img1URL = process.env.IMG_1_URL;
var img2URL = process.env.IMG_2_URL;

function respond() {
  var req = JSON.parse(this.req.chunks[0]);
  var reHaig = /instahaig/;
  var reWilly = /countdown/;
  var reTechTrek = /bouje/

  if (req.text) {
    if (reHaig.test(req.text.toLowerCase())) {
      console.log(reHaig+" TRUE");
      this.res.writeHead(200);
      // Message contents
      var body = {
        "bot_id" : botID,
        "text" : "",
        "attachments" : [
          {
            "type" : "image",
            "url" : img1URL
          }
        ]
      };
      postMessage(body);
      this.res.end();
    } else if (reWilly.test(req.text.toLowerCase())) {
      console.log(reWilly+" TRUE");
      this.res.writeHead(200);
      var endDate = new Date("Jan 17 2017 09:00:00 GMT-0500 (EST)");
      var botResponse = calculateTimeUntil(endDate);
      // Message contents
      var body = {
        "bot_id" : botID,
        "text" : botResponse
      };
      postMessage(body);
      this.res.end();
    } else if (reTechTrek.test(req.text.toLowerCase())) {
      console.log(reTechTrek+" TRUE");
      this.res.writeHead(200);
      // Message contents
      var body = {
        "bot_id" : botID,
        "text" : "",
        "attachments" : [
          {
            "type" : "image",
            "url" : img2URL
          }
        ]
      };
      postMessage(body);
      this.res.end();
    } else {
      console.log(reHaig + " " + reWilly + " " + reTechTrek + " FALSE");
      this.res.writeHead(200);
      this.res.end();
    }
  } else {
    console.log(reHaig + " " + reWilly + " " + reTechTrek + " FALSE");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(body) {
  var options, botReq;

  // Application verification
  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
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

function calculateTimeUntil(endDate) {
  var _second = 1000;
  var _minute = _second * 60;
  var _hour = _minute * 60;
  var _day = _hour * 24;

  var now = new Date();
  var diff = endDate - now;
  if (diff < 0) {
    return "It's time yo.";
  }
  var days = Math.floor(diff / _day);
  var hours = Math.floor((diff % _day) / _hour);
  var minutes = Math.floor((diff % _hour) / _minute);
  var seconds = Math.floor((diff % _minute) / _second);

  return days + " days, " + hours + " hours, " + minutes + " minutes, and " + seconds + " seconds until Willy Reunion.";
}

exports.respond = respond;